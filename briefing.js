// ═══════════════════════════════════════
//  briefing.js — Утренний брифинг
//  Подключи в index.html перед </body>:
//  <script src="briefing.js"></script>
// ═══════════════════════════════════════

const Briefing = {

  async generate() {
    const btn = document.getElementById('briefingBtn');
    const out = document.getElementById('briefingOut');
    if (btn) { btn.textContent = '⏳ Генерирую...'; btn.disabled = true; }
    if (out) out.innerHTML = '<div style="color:var(--text3);font-size:13px;text-align:center;padding:24px">Собираю данные...</div>';

    try {
      // Собираем данные
      const kanbanTasks = (() => { try { return JSON.parse(localStorage.getItem('kanban_tasks') || '[]'); } catch { return []; } })();
      const inboxMsgs = (() => { try { return JSON.parse(localStorage.getItem('inbox_messages') || '[]'); } catch { return []; } })();

      const done = kanbanTasks.filter(t => t.col === 'done');
      const inWork = kanbanTasks.filter(t => t.col === 'work');
      const queue = kanbanTasks.filter(t => t.col === 'queue');
      const newMsgs = inboxMsgs.filter(m => m.status === 'new');

      // XP сотрудников
      const empLines = (typeof employees !== 'undefined')
        ? employees.map(e => `${e.emoji} ${e.name} (${e.role}): XP ${e.xp}`).join('\n')
        : '';

      const prompt = `Ты — ИИ-ассистент холдинга. Составь краткий утренний брифинг на русском языке.

ДАННЫЕ:
- Задач выполнено: ${done.length}
- Задач в работе: ${inWork.map(t => `"${t.text.slice(0,50)}"`).join(', ') || 'нет'}
- Задач в очереди: ${queue.length}
- Новых входящих сообщений от клиентов: ${newMsgs.length}
${newMsgs.length ? '- Темы входящих: ' + newMsgs.slice(0,3).map(m => `"${m.text.slice(0,40)}"`).join(', ') : ''}

КОМАНДА:
${empLines}

Напиши брифинг в формате:
🌅 Доброе утро! [дата]

📊 Вчера:
[что сделано]

⚡ Сейчас в работе:
[задачи]

📋 Очередь ([N] задач):
[кратко]

📨 Входящие:
[кратко о сообщениях]

🎯 Рекомендация дня:
[одна конкретная рекомендация]

Будь конкретным и кратким. Не более 20 строк.`;

      const apiKey = typeof API_KEY !== 'undefined' ? API_KEY : '';
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 600,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      const data = await resp.json();
      const text = data.content?.[0]?.text || '';
      if (!text) throw new Error('Пустой ответ');

      // Показываем в UI
      if (out) {
        out.innerHTML = `
          <div style="background:var(--bg3);border:0.5px solid var(--border2);border-radius:14px;padding:16px;white-space:pre-wrap;font-size:13px;line-height:1.6;color:var(--text)">${text}</div>
          <button onclick="Briefing.send()" style="width:100%;margin-top:10px;padding:12px;border-radius:12px;border:none;background:var(--blue);color:#fff;font-size:14px;font-weight:700;cursor:pointer;font-family:var(--font)">📤 Отправить в Telegram</button>
        `;
        this._lastText = text;
      }

      if (typeof addLog === 'function') addLog('ok', '✅ Брифинг сгенерирован', '');

    } catch(e) {
      if (out) out.innerHTML = `<div style="color:var(--red);font-size:13px;text-align:center;padding:24px">❌ Ошибка: ${e.message}</div>`;
      if (typeof addLog === 'function') addLog('error', '❌ Ошибка брифинга', e.message);
    }

    if (btn) { btn.textContent = '🌅 Сгенерировать брифинг'; btn.disabled = false; }
  },

  async send() {
    if (!this._lastText) return;
    const token = (typeof INTEGRATIONS !== 'undefined') ? INTEGRATIONS.TgBot?.token : '';
    const chatId = (typeof INTEGRATIONS !== 'undefined') ? INTEGRATIONS.TgBot?.chatId : '';

    if (!token || !chatId) {
      alert('Настройте Telegram бота в разделе Связи (токен и Chat ID)');
      return;
    }

    try {
      const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: this._lastText })
      });
      const data = await r.json();
      if (data.ok) {
        if (typeof addLog === 'function') addLog('ok', '✅ Брифинг отправлен в Telegram', '');
        const btn = document.querySelector('#briefingOut button');
        if (btn) { btn.textContent = '✅ Отправлено!'; btn.disabled = true; btn.style.background = 'var(--green)'; }
      } else {
        alert('Ошибка отправки: ' + (data.description || 'Неизвестная ошибка'));
      }
    } catch(e) {
      alert('Ошибка: ' + e.message);
    }
  },

  _lastText: ''
};

// ── HTML экрана ──────────────────────────────────────────────────
const BRIEFING_SCREEN_HTML = `
<div class="screen" id="s-briefing">
  <div class="hdr">
    <div class="hdr-logo">
      <div class="hdr-icon">🌅</div>
      <div><div class="hdr-title">Брифинг</div><div class="hdr-sub">Утренняя сводка</div></div>
    </div>
  </div>
  <div style="flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px">
    <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:14px;padding:16px">
      <div style="font-size:13px;color:var(--text2);margin-bottom:12px;line-height:1.5">
        AI соберёт данные о задачах, входящих сообщениях и команде — и сформирует сводку. Можно сразу отправить себе в Telegram.
      </div>
      <button id="briefingBtn" onclick="Briefing.generate()" style="width:100%;padding:13px;border-radius:12px;border:none;background:var(--blue);color:#fff;font-size:14px;font-weight:700;cursor:pointer;font-family:var(--font)">🌅 Сгенерировать брифинг</button>
    </div>
    <div id="briefingOut"></div>
  </div>
</div>`;

// ── Навигация ────────────────────────────────────────────────────
const BRIEFING_NAV_HTML = `
<div class="nav-item" id="nav-briefing" onclick="switchScreen('briefing')">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
  Брифинг
</div>`;

// ── Инициализация ────────────────────────────────────────────────
function initBriefing() {
  if (!document.getElementById('s-briefing')) {
    document.querySelector('.app').insertAdjacentHTML('beforeend', BRIEFING_SCREEN_HTML);
  }
  if (!document.getElementById('nav-briefing')) {
    document.querySelector('.nav').insertAdjacentHTML('beforeend', BRIEFING_NAV_HTML);
  }
}
