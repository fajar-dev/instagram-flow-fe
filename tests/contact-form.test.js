import { expect, test } from 'bun:test'
import { createContactForm, contactFormSchema } from '../app/util/contact-form'

test('contact forms get independent initial state and validate localized input', () => {
  const first = createContactForm()
  const second = createContactForm()
  first.name = 'Changed'
  expect(second.name).toBe('')
  const schema = contactFormSchema(key => key)
  expect(schema.safeParse(second).success).toBe(false)
  const valid = { ...second, name: 'Contact', email: 'contact@example.com', phone: '123' }
  expect(schema.safeParse(valid).success).toBe(true)
  expect(schema.safeParse({ ...valid, email: 'invalid' }).success).toBe(false)
})
