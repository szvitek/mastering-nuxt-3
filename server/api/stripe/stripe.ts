import Stripe from 'stripe';
const config = useRuntimeConfig();
const stripe = new Stripe(config.stripeSecret);

export default stripe;
