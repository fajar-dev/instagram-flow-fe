import { test, expect } from 'bun:test'
import { moveSlide } from '../app/util/slides'

test('moving a slide preserves selection and does not mutate the input', () => {
  const ids = ['cover', 'photo-1', 'photo-2']
  expect(moveSlide(ids, 'photo-2', 0)).toEqual(['photo-2', 'cover', 'photo-1'])
  expect(ids).toEqual(['cover', 'photo-1', 'photo-2'])
  expect(moveSlide(ids, 'missing', 0)).toBe(ids)
  expect(moveSlide(ids, 'cover', -1)).toBe(ids)
  expect(moveSlide(ids, 'cover', 3)).toBe(ids)
})
