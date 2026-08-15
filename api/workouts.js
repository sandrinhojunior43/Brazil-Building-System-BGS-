const { supabaseAdmin } = require('../lib/supabaseAdmin');
const { getUserFromRequest } = require('../lib/auth');
const { setCorsHeaders } = require('../lib/cors');
const { isActive } = require('../lib/subscriptions');
const { freeWorkouts, premiumWorkouts, premiumDietPlans } = require('../data/workouts');

// O conteúdo premium é decidido no servidor (não no front-end) para que
// o paywall não possa ser burlado só editando o JS do navegador.
module.exports = async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método não permitido' });

  const user = await getUserFromRequest(req);

  if (!user) {
    return res.status(200).json({ premium: false, workouts: freeWorkouts, dietPlans: [] });
  }

  const { data } = await supabaseAdmin
    .from('subscriptions')
    .select('status, current_period_end')
    .eq('user_id', user.id)
    .maybeSingle();

  const premium = isActive(data);

  return res.status(200).json({
    premium,
    workouts: premium ? [...freeWorkouts, ...premiumWorkouts] : freeWorkouts,
    dietPlans: premium ? premiumDietPlans : [],
  });
};
