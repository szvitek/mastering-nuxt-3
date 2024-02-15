import { PrismaClient } from '@prisma/client';
import stripe from './stripe';

interface PaymentIntent {
  id: string;
}

const prisma = new PrismaClient();
const STRIPE_WEBHOOK_SECRET = useRuntimeConfig().stripeWebhookSecret;

export default defineEventHandler(async (event) => {
  const signature = getHeader(event, 'stripe-signature');
  const body = await readRawBody(event);

  if (!signature || !body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid signature or body',
    });
  }

  // verify the webhook signature
  let stripeEvent;
  try {
    stripeEvent = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid signature',
    });
  }

  if (stripeEvent.type === 'payment_intent.succeeded') {
    await handlePaymentSucceeded(stripeEvent.data.object);
  } else if (stripeEvent.type === 'payment_intent.payment_failed') {
    await handlePaymentFailed(stripeEvent.data.object);
  }

  return 200;
});

async function handlePaymentSucceeded(paymentIntent: PaymentIntent) {
  // Verify the related course purchase
  try {
    await prisma.coursePurchase.update({
      where: {
        paymentId: paymentIntent.id,
      },
      data: {
        verified: true,
      },
    });
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error verifying purchase',
    });
  }
}

async function handlePaymentFailed(paymentIntent: PaymentIntent) {
  // Clean up the course purchase
  try {
    await prisma.coursePurchase.delete({
      where: {
        paymentId: paymentIntent.id,
      },
    });
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error removing purchase',
    });
  }
}
