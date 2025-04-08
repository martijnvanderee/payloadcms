import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'Customers',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'full_name',
      type: 'text',
      label: 'Full Name',
      required: true,
    },
    // Email added by default
    // Add more fields as needed
  ],
}
