import { supabase } from './supabaseClient.js';
import { requireSession, signOut } from './auth.js';

const els = {
  topbar: document.getElementById('topbar-actions'),
  statusPill: document.getElementById('status-pill'),
  banner: document.getElementById('upgrade-banner'),
  tabNav: document.getElementById('tab-nav'),
  content: document.getElementById('tab-content'),
};

let state = {
  session: null,
  premium: false,
  workouts: [],
  dietPlans: [],
  logs: [],
  tab: 'treinos',
};

init();

async function init() {
  const session = await requireSession('/login.html');
  if (!session) return;
  state.session = session;

  wireTopbar();
  wireTabs();

  await Promise.all([loadContent(), loadLogs()]);
  render();

  // Se o usuário veio direto da landing page com um plano escolhido
  // (ex: /app.html?assinar=monthly), dispara o checkout automaticamente.
  const params = new URLSearchParams(window.location.search);
  const plan = params.get('assinar');
  if (plan) {
    window.history.replaceState({}, '', '/app.html');
    startCheckout(plan === 'yearly' ? 'yearly' : 'monthly');
  }
}

function wireTopbar() {
  document.getElementById('logout-btn').addEventListener('click', async () => {
    await signOut();
    window.location.href = '/index.html';
  });
}

function wireTabs() {
  els.tabNav.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.tab = btn.dataset.tab;
      render();
    });
  });
}

async function authHeader() {
  const { data } = await supabase.auth.getSession();
  const token = data.session && data.session.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function loadContent() {
  const headers = await authHeader();
  const resp = await fetch('/api/workouts', { headers });
  const data = await resp.json();
  state.premium = !!data.premium;
  state.workouts = data.workouts || [];
  state.dietPlans = data.dietPlans || [];
}

async function loadLogs() {
  const { data } = await supabase
    .from('workout_logs')
    .select('workout_id, completed_at')
    .order('completed_at', { ascending: false });
  state.logs = data || [];
}

async function startCheckout(plan) {
  const headers = { 'Content-Type': 'application/json', ...(await authHeader()) };
  const resp = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers,
    body: JSON.stringify({ plan }),
  });
  const data = await resp.json();
  if (data.url) {
    window.location.href = data.url;
  } else {
    alert(data.error || 'Não foi possível iniciar o checkout.');
  }
}

async function openPortal() {
  const headers = await authHeader();
  const resp = await fetch('/api/create-portal-session', { method: 'POST', headers });
  const data = await resp.json();
  if (data.url) {
    window.location.href = data.url;
  } else {
    alert(data.error || 'Não foi possível abrir o portal de assinatura.');
  }
}

async function logWorkout(workoutId) {
  await supabase.from('workout_logs').insert({ user_id: state.session.user.id, workout_id: workoutId });
  await loadLogs();
  render();
}

function render() {
  els.statusPill.textContent = state.premium ? 'Premium' : 'Grátis';
  els.statusPill.className = `pill ${state.premium ? 'premium' : 'free'}`;

  els.topbar.innerHTML = state.premium
    ? `<button class="btn btn-ghost btn-sm" id="portal-btn">Minha assinatura</button>
       <button class="btn btn-ghost btn-sm" id="logout-btn">Sair</button>`
    : `<button class="btn btn-primary btn-sm" id="upgrade-btn">Fazer upgrade</button>
       <button class="btn btn-ghost btn-sm" id="logout-btn">Sair</button>`;

  document.getElementById('logout-btn').addEventListener('click', async () => {
    await signOut();
    window.location.href = '/index.html';
  });
  if (!state.premium) {
    document.getElementById('upgrade-btn').addEventListener('click', () => (state.tab = 'upgrade') && render());
  } else {
    document.getElementById('portal-btn').addEventListener('click', openPortal);
  }

  els.banner.style.display = state.premium ? 'none' : 'flex';
  els.banner.innerHTML = state.premium
    ? ''
    : `<div><strong>Você está no plano grátis.</strong><br><span style="color:var(--text-dim); font-size:0.9rem;">Libere treinos ilimitados, dieta e progresso com o Premium.</span></div>
       <button class="btn btn-primary" id="banner-upgrade-btn">Ver planos Premium</button>`;
  if (!state.premium) {
    document.getElementById('banner-upgrade-btn').addEventListener('click', () => {
      state.tab = 'upgrade';
      render();
    });
  }

  els.tabNav.querySelectorAll('button').forEach((btn) => btn.classList.toggle('active', btn.dataset.tab === state.tab));

  if (state.tab === 'treinos') renderWorkouts();
  else if (state.tab === 'dieta') renderDiet();
  else if (state.tab === 'progresso') renderProgress();
  else if (state.tab === 'upgrade') renderUpgrade();
}

function renderWorkouts() {
  if (!state.workouts.length) {
    els.content.innerHTML = '<div class="empty-state">Nenhum treino disponível no momento.</div>';
    return;
  }

  els.content.innerHTML = `<div class="grid">${state.workouts
    .map((w) => {
      const done = state.logs.some((l) => l.workout_id === w.id);
      return `
      <div class="card workout-card">
        <h3>${escapeHtml(w.title)}</h3>
        <div class="meta">
          <span>${escapeHtml(w.level)}</span>
          <span>${escapeHtml(w.muscle_group)}</span>
          <span>${w.duration_min} min</span>
        </div>
        <ol>${w.exercises.map((ex) => `<li>${escapeHtml(ex.name)} — ${ex.sets}x${escapeHtml(String(ex.reps))}</li>`).join('')}</ol>
        <button class="btn ${done ? 'btn-ghost' : 'btn-primary'} btn-sm btn-block" style="margin-top:16px;" data-log="${w.id}" ${
        done ? 'disabled' : ''
      }>${done ? '✓ Concluído hoje' : 'Marcar como concluído'}</button>
      </div>`;
    })
    .join('')}</div>`;

  els.content.querySelectorAll('[data-log]').forEach((btn) => {
    btn.addEventListener('click', () => logWorkout(btn.dataset.log));
  });
}

function renderDiet() {
  if (!state.premium) {
    els.content.innerHTML = lockedMessage('Planos de dieta são exclusivos do Premium.');
    return;
  }
  if (!state.dietPlans.length) {
    els.content.innerHTML = '<div class="empty-state">Nenhum plano de dieta disponível.</div>';
    return;
  }
  els.content.innerHTML = `<div class="grid">${state.dietPlans
    .map(
      (d) => `
      <div class="card">
        <h3>${escapeHtml(d.title)}</h3>
        <p style="color:var(--text-dim); font-size:0.88rem;">${escapeHtml(d.goal)}</p>
        <ul style="padding-left:18px; font-size:0.9rem; color:var(--text-dim);">
          ${d.meals.map((m) => `<li>${escapeHtml(m)}</li>`).join('')}
        </ul>
      </div>`
    )
    .join('')}</div>`;
}

function renderProgress() {
  if (!state.premium) {
    els.content.innerHTML = lockedMessage('O histórico de progresso é exclusivo do Premium.');
    return;
  }
  if (!state.logs.length) {
    els.content.innerHTML = '<div class="empty-state">Você ainda não concluiu nenhum treino. Bora começar? 💪</div>';
    return;
  }
  els.content.innerHTML = `
    <div class="card" style="margin-bottom:20px;">
      <h3 style="margin-top:0;">Total de treinos concluídos: ${state.logs.length}</h3>
    </div>
    <div class="card">
      <ol style="padding-left:18px;">
        ${state.logs
          .slice(0, 30)
          .map((l) => `<li>${escapeHtml(workoutTitle(l.workout_id))} — ${new Date(l.completed_at).toLocaleString('pt-BR')}</li>`)
          .join('')}
      </ol>
    </div>`;
}

function renderUpgrade() {
  els.content.innerHTML = `
    <div class="pricing-grid">
      <div class="card price-card highlight">
        <span class="tag">Mensal</span>
        <h3>Premium</h3>
        <div class="price">R$ 39<span>/mês</span></div>
        <ul>
          <li>Treinos ilimitados</li>
          <li>Planos de dieta completos</li>
          <li>Histórico de progresso</li>
        </ul>
        <button class="btn btn-primary btn-block" id="checkout-monthly">Assinar mensal</button>
      </div>
      <div class="card price-card">
        <span class="tag">Anual</span>
        <h3>Premium</h3>
        <div class="price">R$ 350<span>/ano</span></div>
        <ul>
          <li>Tudo do plano mensal</li>
          <li>Equivalente a ~R$ 29/mês</li>
          <li>Pagamento único no ano</li>
        </ul>
        <button class="btn btn-primary btn-block" id="checkout-yearly">Assinar anual</button>
      </div>
    </div>`;
  document.getElementById('checkout-monthly').addEventListener('click', () => startCheckout('monthly'));
  document.getElementById('checkout-yearly').addEventListener('click', () => startCheckout('yearly'));
}

function lockedMessage(text) {
  return `<div class="empty-state">
    🔒 ${escapeHtml(text)}<br><br>
    <button class="btn btn-primary" onclick="document.querySelector('[data-tab=upgrade]').click()">Ver planos Premium</button>
  </div>`;
}

function workoutTitle(id) {
  const found = state.workouts.find((w) => w.id === id);
  return found ? found.title : id;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
