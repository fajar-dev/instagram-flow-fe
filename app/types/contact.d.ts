export type Salutation = 'mr' | 'mrs'
export type ContactType = 'customer' | 'vendor' | 'supplier' | 'other'

export interface Contact {
  id: number
  name: string
  salutation: Salutation | null
  email: string
  phone: string
  type: ContactType
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ContactPayload {
  name: string
  salutation: Salutation | undefined
  email: string
  phone: string
  type: ContactType
  isActive: boolean
}
