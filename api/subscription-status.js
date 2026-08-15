const { supabaseAdmin } = require('../lib/supabaseAdmin');
const { getUserFromRequest } = require('../lib/auth');
const { setCorsHeaders } = require('../lib/cors');
const { isActive } = require('../lib/subscriptions');

module.exports = async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método não permitido' });

  // O usuário é identificado pelo token de sessão (Authorization: Bearer),
  // nunca por um user_id passado na query — isso evitaria que qualquer
  // pessoa consultasse o status de assinatura de outra.
  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: 'Não autenticado' });

  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select('status, plan, current_period_end')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('subscription-status error:', error);
    return res.status(500).json({ error: 'Erro ao consultar assinatura' });
  }

  return res.status(200).json({
    active: isActive(data),
    plan: (data && data.plan) || null,
    status: (data && data.status) || 'inactive',
    current_period_end: (data && data.current_period_end) || null,
  });
};
