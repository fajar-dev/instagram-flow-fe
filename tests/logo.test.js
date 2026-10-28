import { expect, test } from 'bun:test'
import { getLogoSizeClass, getLogoSources, resolveLogoVariant } from '../app/util/logo'

test('resolveLogoVariant resolves icon and full variants correctly', () => {
  expect(resolveLogoVariant()).toBe('icon')
  expect(resolveLogoVariant('full')).toBe('full')
  expect(resolveLogoVariant('icon')).toBe('icon')
  expect(resolveLogoVariant(undefined, true)).toBe('icon')
  expect(resolveLogoVariant(undefined, false)).toBe('full')
  // explicit variant takes precedence over isCollapsed
  expect(resolveLogoVariant('full', true)).toBe('full')
  expect(resolveLogoVariant('icon', false)).toBe('icon')
})

test('getLogoSources returns correct assets for icon variant', () => {
  const sources = getLogoSources('icon')
  expect(sources.light).toBe('/logo.png')
  expect(sources.dark).toBe('/logo-light.png')
})

test('getLogoSources returns correct assets for full variant', () => {
  const sources = getLogoSources('full')
  expect(sources.light).toBe('/logo-full.png')
  expect(sources.dark).toBe('/logo-full-light.png')
})

test('getLogoSizeClass handles preset and custom sizes', () => {
  // icon presets
  expect(getLogoSizeClass('xs', 'icon')).toBe('h-6')
  expect(getLogoSizeClass('sm', 'icon')).toBe('h-8')
  expect(getLogoSizeClass('md', 'icon')).toBe('h-12')
  expect(getLogoSizeClass('lg', 'icon')).toBe('h-14')
  expect(getLogoSizeClass('xl', 'icon')).toBe('h-18')

  // full presets
  expect(getLogoSizeClass('xs', 'full')).toBe('h-5')
  expect(getLogoSizeClass('sm', 'full')).toBe('h-7')
  expect(getLogoSizeClass('md', 'full')).toBe('h-9')
  expect(getLogoSizeClass('lg', 'full')).toBe('h-12')
  expect(getLogoSizeClass('xl', 'full')).toBe('h-16')

  // custom size class
  expect(getLogoSizeClass('h-24', 'icon')).toBe('h-24')
  expect(getLogoSizeClass('h-32', 'full')).toBe('h-32')
})
