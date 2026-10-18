import { z } from 'zod'
import type { ContactPayload } from '~/types/contact'

export function createContactForm(): ContactPayload {
  return { salutation: undefined, name: '', email: '', phone: '', type: 'customer', isActive: true }
}

export function contactFormSchema(t: (key: string) => string) {
  return z.object({
    salutation: z.enum(['mr', 'mrs']).nullable().optional(),
    name: z.string().min(1, t('components.contact.form.nameRequired')),
    email: z.string().min(1, t('components.contact.form.emailRequired')).email(t('components.contact.form.emailInvalid')),
    phone: z.string().min(1, t('components.contact.form.phoneRequired')),
    type: z.enum(['customer', 'vendor', 'supplier', 'other']),
    isActive: z.boolean()
  })
}
