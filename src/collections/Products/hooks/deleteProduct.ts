import Stripe from 'stripe'
import type { CollectionAfterDeleteHook } from 'payload'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripe = new Stripe(stripeSecretKey || '', { apiVersion: '2022-08-01' })

export const deleteProduct: CollectionAfterDeleteHook = async ({ req, id }) => {
  const { payload } = req

  try {
    if (typeof id === 'string') await stripe.products.del(id)
  } catch (error: unknown) {
    payload.logger.error(`Error fetching product from Stripe: ${error}`)
  }
}
