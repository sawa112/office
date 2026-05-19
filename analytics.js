// ═══════════════════════════════════════
//  analytics.js — Аналитика холдинга
//  Подключи в index.html перед </body>:
//  <script src="analytics.js"></script>
// ═══════════════════════════════════════

const Analytics = {

  // Собрать статистику из localStorage
  getData() {
    // Задачи из канбана
    let kanbanTasks = [];
    try { kanbanTasks = JSON.parse(localStorage.getItem('kanban_tasks') || '[]'); } catch {}

    // Память сотрудников (задачи)
    const empStats = {};
    if (typeof employees !== 'undefined') {
      employees.forEach(e => {
        let mems = [];
        try { mems = JSON.parse(localStorage.getItem(`mem_emp_${e.id}`) || '[]'); } catch {}
        empStats[e.id] = { name: e.name, emoji: e.emoji, role: e.role, tasks: mems.length, xp: e.xp };
      });
    }

    // Статистика канбана по сотрудникам
    kanbanTasks.forEach(t => {
      if (empStats[t.empId]) {
        empStats[t.empId].kanban = (empStats[t.empId].kanban || 0) + 1;
        if (t.col === 'done') empStats[t.empId].done = (empStats[t.empId].done || 0) + 1;
      }
    });

    // По дням (последние 7 дней)
    const days = {};
    const now = Date.now();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      const key = d.toLocaleDateString('ru', { weekday: 'short', day: 'numeric' });
      days[key] = 0;
    }
    kanbanTasks.forEach(t => {
      const d = new Date(t.createdAt);
      const diff = Math.floor((now - t.createdAt) / 86400000);
      if (diff <= 6) {
        const key = d.toLocaleDateString('ru', { weekday: 'short', day: 'numeric' });
        if (days[key] !== undefined) days[key]++;
      }
    });

    return { empStats, days, kanbanTasks };
  },

  render() {
    const container = document.getElementById('analyticsContent');
    if (!container) return;
    const { empStats, days, kanbanTasks } = this.getData();

    const total = kanbanTasks.length;
    const done = kanbanTasks.filter(t => t.col === 'done').length;
    const inWork = kanbanTasks.filter(t => t.col === 'work').length;
    const pct = total ? Math.round(done / total * 100) : 0;

    // Топ сотрудников по задачам
    const topEmps = Object.values(empStats)
      .sort((a, b) => (b.tasks + (b.done || 0)) - (a.tasks + (a.done || 0)))
      .slice(0, 5);

    // Max для графика
    const dayVals = Object.values(days);
    const maxDay = Math.max(...dayVals, 1);

    container.innerHTML = `
      <!-- Сводка -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:16px">
        ${this._statCard('📋', 'Всего задач', total)}
        ${this._statCard('✅', 'Выполнено', done, 'var(--green)')}
        ${this._statCard('⚡', 'В работе', inWork, 'var(--amber)')}
      </div>

      <!-- Прогресс -->
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:14px;padding:14px;margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <span style="font-size:13px;font-weight:600">Общий прогресс</span>
          <span style="font-size:13px;font-weight:700;color:var(--green)">${pct}%</span>
        </div>
        <div style="background:var(--bg3);border-radius:6px;height:8px;overflow:hidden">
          <div style="background:linear-gradient(90deg,var(--blue),var(--green));height:100%;width:${pct}%;border-radius:6px;transition:width .5s"></div>
        </div>
      </div>

      <!-- График по дням -->
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:14px;padding:14px;margin-bottom:12px">
        <div style="font-size:13px;font-weight:600;margin-bottom:12px">📈 Задачи за 7 дней</div>
        <div style="display:flex;align-items:flex-end;gap:6px;height:80px">
          ${Object.entries(days).map(([label, val]) => `
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
              <div style="font-size:9px;color:var(--text3);font-weight:600">${val || ''}</div>
              <div style="width:100%;background:${val > 0 ? 'var(--blue)' : 'var(--bg3)'};border-radius:4px 4px 0 0;height:${Math.max(val / maxDay * 60, val > 0 ? 6 : 2)}px;transition:height .4s"></div>
              <div style="font-size:8px;color:var(--text3);text-align:center;line-height:1.2">${label}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Топ сотрудников -->
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:14px;padding:14px">
        <div style="font-size:13px;font-weight:600;margin-bottom:12px">🏆 Активность сотрудников</div>
        ${topEmps.length ? topEmps.map((e, i) => {
          const total = e.tasks + (e.done || 0);
          const maxTotal = (topEmps[0].tasks + (topEmps[0].done || 0)) || 1;
          const w = Math.round(total / maxTotal * 100);
          return `
          <div style="margin-bottom:10px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
              <span style="font-size:12px">${e.emoji} ${e.name} <span style="color:var(--text3);font-size:10px">${e.role}</span></span>
              <span style="font-size:11px;color:var(--text3)">${total} задач · XP ${e.xp}</span>
            </div>
            <div style="background:var(--bg3);border-radius:4px;height:5px">
              <div style="background:${['var(--blue)','var(--green)','var(--amber)','var(--purple)','var(--teal)'][i]};height:100%;width:${w}%;border-radius:4px;transition:width .5s"></div>
            </div>
          </div>`;
        }).join('') : '<div style="color:var(--text3);font-size:13px;text-align:center;padding:16px">Пока нет данных — выдайте задачи сотрудникам</div>'}
      </div>
    `;
  },

  _statCard(icon, label, val, color = 'var(--blue)') {
    return `
    <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:14px;padding:12px;text-align:center">
      <div style="font-size:20px;margin-bottom:4px">${icon}</div>
      <div style="font-size:20px;font-weight:700;color:${color}">${val}</div>
      <div style="font-size:10px;color:var(--text3);margin-top:2px">${label}</div>
    </div>`;
  }
};

// ── HTML экрана аналитики ────────────────────────────────────────
const ANALYTICS_SCREEN_HTML = `
<div class="screen" id="s-analytics">
  <div class="hdr">
    <div class="hdr-logo">
      <div class="hdr-icon">📊</div>
      <div><div class="hdr-title">Аналитика</div><div class="hdr-sub">Статистика холдинга</div></div>
    </div>
    <div class="hbtn" onclick="Analytics.render()" title="Обновить">↻</div>
  </div>
  <div style="flex:1;overflow-y:auto;padding:12px" id="analyticsContent">
    <div style="color:var(--text3);text-align:center;padding:40px;font-size:13px">Загрузка...</div>
  </div>
</div>`;

// ── Навигация (добавить в nav) ───────────────────────────────────
const ANALYTICS_NAV_HTML = `
<div class="nav-item" id="nav-analytics" onclick="switchScreen('analytics')">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
  Аналитика
</div>`;

// ── Инициализация ────────────────────────────────────────────────
function initAnalytics() {
  if (!document.getElementById('s-analytics')) {
    document.querySelector('.app').insertAdjacentHTML('beforeend', ANALYTICS_SCREEN_HTML);
  }
  if (!document.getElementById('nav-analytics')) {
    document.querySelector('.nav').insertAdjacentHTML('beforeend', ANALYTICS_NAV_HTML);
  }
}
