import { test, expect } from 'bun:test'
import { moveSlide, rankSlides } from '../app/util/slides'

test('moving a slide preserves selection and does not mutate the input', () => {
  const ids = ['cover', 'photo-1', 'photo-2']
  expect(moveSlide(ids, 'photo-2', 0)).toEqual(['photo-2', 'cover', 'photo-1'])
  expect(ids).toEqual(['cover', 'photo-1', 'photo-2'])
  expect(moveSlide(ids, 'missing', 0)).toBe(ids)
  expect(moveSlide(ids, 'cover', -1)).toBe(ids)
  expect(moveSlide(ids, 'cover', 3)).toBe(ids)
})

test('initial slides select highest scores first without changing source data', () => {
  const renders = Array.from({ length: 12 }, (_, i) => ({ id: String(i), assetId: String(i) }))
  const rankings = renders.map((r, i) => ({ assetId: r.assetId, score: i, reason: '' }))
  const ordered = rankSlides(renders, rankings)
  expect(ordered.slice(0, 10).map(r => r.id)).toEqual([
    '11',
    '10',
    '9',
    '8',
    '7',
    '6',
    '5',
    '4',
    '3',
    '2'
  ])
  expect(renders[0].id).toBe('0')
  expect(
    moveSlide(
      ordered.map(r => r.id),
      '2',
      0
    )[0]
  ).toBe('2')
})

test('equal scores keep their order and unscored slides come last', () => {
  const renders = ['missing', 'zero', 'a', 'b'].map(id => ({ id, assetId: id }))
  expect(
    rankSlides(renders, [
      { assetId: 'zero', score: 0 },
      { assetId: 'a', score: 90 },
      { assetId: 'b', score: 90 }
    ]).map(r => r.id)
  ).toEqual(['a', 'b', 'zero', 'missing'])
  expect(rankSlides(renders, [])).toEqual(renders)
})
