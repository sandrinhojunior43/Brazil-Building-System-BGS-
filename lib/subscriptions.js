const { supabaseAdmin } = require('./supabaseAdmin');

const ACTIVE_STATUSES = ['active', 'trialing'];

// Uma assinatura só libera conteúdo premium se o status do Stripe for
// ativo/trial E (quando presente) o período atual ainda não venceu.
function isActive(row) {
  if (!row) return false;
  if (!ACTIVE_STATUSES.includes(row.status)) return false;
  if (row.current_period_end && row.current_period_end * 1000 < Date.now()) return false;
  return true;
}

function planFromPriceId(priceId) {
  if (priceId && priceId === process.env.STRIPE_PRICE_ID_YEARLY) return 'yearly';
  if (priceId && priceId === process.env.STRIPE_PRICE_ID_MONTHLY) return 'monthly';
  return null;
}

async function upsertSubscription({ userId, customerId, subscriptionId, status, plan, currentPeriodEnd }) {
  const { error } = await supabaseAdmin.from('subscriptions').upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      status,
      plan,
      current_period_end: currentPeriodEnd,
    },
    { onConflict: 'user_id' }
  );
  if (error) throw error;
}

async function updateByCustomerId(customerId, fields) {
  const { error } = await supabaseAdmin.from('subscriptions').update(fields).eq('stripe_customer_id', customerId);
  if (error) throw error;
}

module.exports = { isActive, planFromPriceId, upsertSubscription, updateByCustomerId, ACTIVE_STATUSES };
