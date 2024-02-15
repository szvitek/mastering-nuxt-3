# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Stripe and webhooks

Stripe test card: spam 42 all over in the input

**Card number:** `4242 4242 4242 4242`

**MM / YY:** `04/24`

**CVC:** `242`

**ZIP:** `42424`

Webhooks: https://docs.stripe.com/webhooks

Install Stripe CLI: https://docs.stripe.com/stripe-cli

Login to stripe cli, verify in browser

```bash
stripe login
```

start stripe server locally to test webhooks:

```bash
stripe listen --forward-to=http://localhost:3000/api/stripe/webhook
```

then get the webhook secret and put in .env

trigger the webhooks success:

```bash
stripe trigger payment_intent.succeeded
```

trigger the webhooks failed:

```bash
stripe trigger payment_intent.payment_failed
```

**When the app is deployed don't forget to setup the webhook endpoint in stripe dashboard**

```
Stripe Dashboard -> Developers -> Webhooks -> Hosted endpoints -> Add endpoint
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
