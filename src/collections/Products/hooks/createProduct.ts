import { Product } from './../../../payload-types'
import Stripe from 'stripe'
import type { CollectionBeforeChangeHook } from 'payload'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripe = new Stripe(stripeSecretKey || '', { apiVersion: '2022-08-01' })

const logs = false

export const createProduct: CollectionBeforeChangeHook = async ({ req, data }) => {
  const { payload } = req
  const newDoc: Record<string, unknown> = {
    ...data,
    skipSync: false, // Set back to 'false' so that all changes continue to sync to Stripe
  }

  if (data.skipSync) {
    if (logs) payload.logger.info(`Skipping product 'beforeChange' hook`)
    return newDoc
  }

  if (!data.id) {
    if (logs)
      payload.logger.info(
        `No Stripe product assigned to this document, skipping product 'beforeChange' hook`,
      )
    return newDoc
  }

  if (logs) payload.logger.info(`Looking up product from Stripe...`)

  try {
    const product = await stripe.products.create({
      name: data.title,
      id: data.id,
    })
    if (logs) payload.logger.info(`Found product from Stripe: ${product.name}`)
  } catch (error: unknown) {
    payload.logger.error(`Error fetching product from Stripe: ${error}`)
    return newDoc
  }

  if (logs) payload.logger.info(`Looking up price from Stripe...`)

  return newDoc
}
