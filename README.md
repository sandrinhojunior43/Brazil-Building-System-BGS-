# BGS - Brazil Building System

App de treinos com plano Grátis e Premium por assinatura. Front-end estático
(HTML/CSS/JS puro) + back-end serverless na Vercel, autenticação e banco de
dados no Supabase, pagamentos recorrentes no Stripe. Tudo em um único projeto
Vercel — sobe front-end e back-end juntos com um só deploy.

## Estrutura

```
index.html, login.html, app.html, sucesso.html, cancelado.html   → front-end
termos.html, privacidade.html                                    → páginas legais
css/, js/, assets/, manifest.json                                → estáticos
api/*.js                                                          → funções serverless (Vercel)
lib/*.js                                                          → helpers do back-end (Stripe, Supabase, auth, CORS)
data/workouts.js                                                  → conteúdo dos treinos/dietas (grátis x premium)
sql/schema.sql                                                    → schema do Supabase
```

### O que cada rota de API faz
- `POST /api/create-checkout-session` — cria a sessão de pagamento no Stripe para o usuário logado.
- `POST /api/webhook` — recebe eventos do Stripe e atualiza a assinatura no Supabase.
- `GET /api/subscription-status` — retorna se o usuário logado tem Premium ativo.
- `POST /api/create-portal-session` — abre o Stripe Customer Portal (cancelar/trocar plano/atualizar cartão).
- `GET /api/workouts` — retorna os treinos (e planos de dieta, se Premium); o paywall é decidido no servidor.

## Passo a passo para colocar no ar

### 1. Criar o projeto no Supabase (grátis)
1. https://supabase.com → New Project
2. No **SQL Editor**, cole e rode o conteúdo de `sql/schema.sql`
3. Em **Authentication → Providers**, confirme que "Email" está habilitado (login por e-mail/senha)
4. Em **Project Settings → API**, copie: `Project URL`, `anon public key`, `service_role key`

### 2. Criar o produto no Stripe
1. https://stripe.com → crie a conta (comece no **modo teste**)
2. **Products → Add Product** → "BGS Premium"
   - Preço mensal recorrente: R$ 29,90 → copie o `price_id`
   - Preço anual recorrente: R$ 350,00 → copie o `price_id`
3. **Developers → API keys** → copie a `Secret key`
4. Em **Settings → Billing → Customer portal**, ative o portal (necessário para `/api/create-portal-session`)
5. **Developers → Webhooks → Add endpoint**:
   - URL: `https://SEU-PROJETO.vercel.app/api/webhook`
   - Eventos: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copie o `Signing secret` (`whsec_...`)

### 3. Configurar variáveis de ambiente
Copie `.env.example` para `.env` (uso local) e preencha com os valores acima.
Depois, no painel da Vercel: **Project → Settings → Environment Variables**,
cadastre as mesmas chaves para produção.

### 4. Preencher a config pública do front-end
Abra `js/config.js` e troque `SUPABASE_URL` e `SUPABASE_ANON_KEY` pelos valores
do seu projeto (são chaves públicas, feitas para rodar no navegador —
diferente da `service_role key`, que fica só no back-end).

### 5. Instalar dependências e testar localmente
```bash
npm install -g vercel
npm install
vercel dev
```
Abra `http://localhost:3000`. Para testar o webhook localmente, use o
[Stripe CLI](https://stripe.com/docs/stripe-cli):
```bash
stripe listen --forward-to localhost:3000/api/webhook
```

### 6. Deploy
```bash
vercel --prod
```
Confirme que as variáveis de ambiente estão cadastradas no painel da Vercel
e refaça o deploy se precisar ajustá-las.

### 7. Testar o fluxo completo (modo teste do Stripe)
1. Acesse `/login.html`, crie uma conta
2. Vá em **Premium** dentro do app → **Assinar mensal**
3. Complete o checkout com o cartão de teste `4242 4242 4242 4242`, validade e CVC quaisquer
4. Volte pro app → `Treinos`/`Dieta`/`Progresso` devem estar liberados como Premium
5. Teste também `Minha assinatura` (Customer Portal) e o cancelamento

## Checklist antes de vender de verdade (produção)

- [ ] Trocar as chaves do Stripe de **teste** para **produção** (e recriar os `price_id` no modo live)
- [ ] Atualizar o endpoint do webhook no Stripe para apontar pro domínio final
- [ ] Configurar domínio próprio na Vercel (em vez do `*.vercel.app`)
- [ ] Ajustar `APP_SUCCESS_URL`, `APP_CANCEL_URL`, `APP_RETURN_URL` e `ALLOWED_ORIGIN` pro domínio final
- [ ] Revisar `termos.html` e `privacidade.html` com um advogado/contador — preencher CNPJ, razão social e política de reembolso reais (LGPD e CDC)
- [ ] Definir e-mail de suporte real (hoje está como `contato@seudominio.com`)
- [ ] Confirmar impostos/notas fiscais da assinatura com seu contador (Stripe Tax pode ajudar)
- [ ] Testar o fluxo inteiro de novo em produção com uma cobrança real de baixo valor antes de divulgar

## Próximos passos (opcional)
- [ ] E-mail transacional de boas-vindas / cobrança (Supabase + Resend, por ex.)
- [ ] Página de administração simples para ver assinantes ativos
- [ ] Publicar como app nativo (Capacitor) na Play Store / App Store
