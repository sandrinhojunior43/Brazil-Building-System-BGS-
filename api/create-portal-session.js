const { stripe } = require('../lib/stripe');
const { supabaseAdmin } = require('../lib/supabaseAdmin');
const { getUserFromRequest } = require('../lib/auth');
const { setCorsHeaders } = require('../lib/cors');

// Abre o Stripe Customer Portal, onde o usuário pode trocar de plano,
// atualizar cartão ou cancelar a assinatura sem precisar de mais telas
// no nosso app.
module.exports = async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: 'Não autenticado' });

  const { data } = await supabaseAdmin
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!data || !data.stripe_customer_id) {
    return res.status(404).json({ error: 'Nenhuma assinatura encontrada para este usuário' });
  }

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: data.stripe_customer_id,
      return_url: process.env.APP_RETURN_URL || process.env.APP_SUCCESS_URL,
    });
    return res.status(200).json({ url: portalSession.url });
  } catch (err) {
    console.error('create-portal-session error:', err);
    return res.status(500).json({ error: 'Erro ao abrir o portal de assinatura' });
  }
};
