import { expect, test } from 'bun:test'
import { uploadFileError } from '../app/util/upload'

test('individual upload validation follows server size and format limits', () => {
  const limits = { maxUploadMb: 1, maxBatchFiles: 5, maxJobFiles: 2 }
  expect(
    uploadFileError(new File(['image'], 'photo.png', { type: 'image/png' }), limits)
  ).toBeUndefined()
  expect(
    uploadFileError(new File([new Uint8Array(1048577)], 'large.png', { type: 'image/png' }), limits)
  ).toBe('fileSize')
  expect(uploadFileError(new File([], 'empty.png', { type: 'image/png' }), limits)).toBe('fileSize')
  expect(uploadFileError(new File(['image'], 'x.svg', { type: 'image/svg+xml' }), limits)).toBe(
    'fileFormat'
  )
})

test('image validation rejects mismatches, corrupt images and excessive resolution', async () => {
  const { validateUploadImage } = await import('../app/util/upload')
  const limits = { maxUploadMb: 1, maxBatchFiles: 5, maxJobFiles: 5 }
  expect(
    await validateUploadImage(new File(['x'], 'photo.heic', { type: 'image/jpeg' }), limits)
  ).toBe('fileFormat')
  const previous = globalThis.createImageBitmap
  let closed = false
  try {
    globalThis.createImageBitmap = async () => {
      throw new Error('corrupt')
    }
    const image = new File(['x'], 'photo.png', { type: 'image/png' })
    expect(await validateUploadImage(image, limits)).toBe('fileUnreadable')
    globalThis.createImageBitmap = async () => ({
      width: 10000,
      height: 5000,
      close: () => {
        closed = true
      }
    })
    expect(await validateUploadImage(image, limits)).toBe('filePixels')
    expect(closed).toBe(true)
  } finally {
    globalThis.createImageBitmap = previous
  }
})

test('a failed upload does not stop later files; retry skips successful and invalid files', async () => {
  const { uploadPendingFiles } = await import('../app/util/upload')
  const entries = [
    { id: 'a', status: 'ready' },
    { id: 'b', status: 'ready' },
    { id: 'c', status: 'ready' },
    { id: 'd', status: 'invalid' }
  ]
  const calls = []
  const failures = []
  await uploadPendingFiles(
    entries,
    async (entry) => {
      calls.push(entry.id)
      if (entry.id === 'b') {
        throw new Error('bad image')
      }
    },
    entry => failures.push(entry.id)
  )
  expect(calls).toEqual(['a', 'b', 'c'])
  expect(failures).toEqual(['b'])
  expect(entries.map(entry => entry.status)).toEqual([
    'uploaded',
    'failed',
    'uploaded',
    'invalid'
  ])
  calls.length = 0
  entries.shift()
  await uploadPendingFiles(
    entries,
    async (entry) => {
      calls.push(entry.id)
    },
    () => {}
  )
  expect(calls).toEqual(['b'])
})

test('leaving upload stops the remaining queue without resending completed files', async () => {
  const { uploadPendingFiles } = await import('../app/util/upload')
  const entries = [{ status: 'ready' }, { status: 'ready' }]
  let active = true
  let calls = 0
  await uploadPendingFiles(
    entries,
    async () => {
      calls++
      active = false
    },
    () => {},
    () => active
  )
  expect(calls).toBe(1)
  expect(entries.map(entry => entry.status)).toEqual(['uploaded', 'ready'])
})
