const { supabaseAdmin } = require('./supabaseAdmin');

// Extrai e valida o usuário logado a partir do header
// "Authorization: Bearer <access_token>" (o token de sessão do Supabase).
// Nunca confie em um user_id enviado pelo corpo/query da requisição sem
// validar o token — qualquer um poderia forjar o id de outra pessoa.
async function getUserFromRequest(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data || !data.user) return null;
  return data.user;
}

module.exports = { getUserFromRequest };
