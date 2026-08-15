const { stripe } = require('../lib/stripe');
const { upsertSubscription, updateByCustomerId, planFromPriceId } = require('../lib/subscriptions');

// O Stripe exige o corpo "cru" (não parseado) da requisição para validar
// a assinatura do webhook — por isso o bodyParser é desligado aqui.
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Método não permitido');

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Assinatura do webhook inválida:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.client_reference_id || (session.metadata && session.metadata.supabase_user_id);
        const subscriptionId = session.subscription;
        const customerId = session.customer;

        if (userId && subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = subscription.items.data[0] && subscription.items.data[0].price.id;
          await upsertSubscription({
            userId,
            customerId,
            subscriptionId,
            status: subscription.status,
            plan: planFromPriceId(priceId) || (session.metadata && session.metadata.plan) || null,
            currentPeriodEnd: subscription.current_period_end,
          });
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const userId = subscription.metadata && subscription.metadata.supabase_user_id;
        const priceId = subscription.items.data[0] && subscription.items.data[0].price.id;

        if (userId) {
          await upsertSubscription({
            userId,
            customerId: subscription.customer,
            subscriptionId: subscription.id,
            status: subscription.status,
            plan: planFromPriceId(priceId),
            currentPeriodEnd: subscription.current_period_end,
          });
        } else {
          // Fallback: sem metadata (ex: assinatura alterada pelo Customer
          // Portal), localiza pelo customer_id já salvo no primeiro evento.
          await updateByCustomerId(subscription.customer, {
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            plan: planFromPriceId(priceId),
            current_period_end: subscription.current_period_end,
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await updateByCustomerId(subscription.customer, {
          status: 'canceled',
          current_period_end: subscription.current_period_end,
        });
        break;
      }

      default:
        // Outros eventos são ignorados de propósito.
        break;
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Erro ao processar evento do webhook:', err);
    // 500 faz o Stripe reter o evento e tentar de novo mais tarde.
    return res.status(500).json({ error: 'Erro ao processar webhook' });
  }
};

module.exports.config = { api: { bodyParser: false } };

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}
