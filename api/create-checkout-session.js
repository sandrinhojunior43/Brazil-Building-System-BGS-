const { stripe } = require('../lib/stripe');
const { supabaseAdmin } = require('../lib/supabaseAdmin');
const { getUserFromRequest } = require('../lib/auth');
const { setCorsHeaders } = require('../lib/cors');

module.exports = async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  try {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: 'Faça login para assinar' });

    const body = req.body || {};
    const plan = body.plan === 'yearly' ? 'yearly' : 'monthly';
    const priceId = plan === 'yearly' ? process.env.STRIPE_PRICE_ID_YEARLY : process.env.STRIPE_PRICE_ID_MONTHLY;

    if (!priceId) {
      return res.status(400).json({ error: 'Plano inválido ou price_id não configurado' });
    }
    if (!process.env.APP_SUCCESS_URL || !process.env.APP_CANCEL_URL) {
      return res.status(500).json({ error: 'APP_SUCCESS_URL/APP_CANCEL_URL não configuradas no servidor' });
    }

    // Reaproveita o customer do Stripe já vinculado a este usuário, se existir.
    const { data: existing } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    let customerId = existing && existing.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: process.env.APP_SUCCESS_URL,
      cancel_url: process.env.APP_CANCEL_URL,
      client_reference_id: user.id,
      allow_promotion_codes: true,
      subscription_data: {
        metadata: { supabase_user_id: user.id, plan },
      },
      metadata: { supabase_user_id: user.id, plan },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('create-checkout-session error:', err);
    return res.status(500).json({ error: 'Erro ao criar sessão de checkout' });
  }
};
