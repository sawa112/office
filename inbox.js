// ═══════════════════════════════════════
//  inbox.js — Входящие сообщения
//  Подключи в index.html перед </body>:
//  <script src="inbox.js"></script>
// ═══════════════════════════════════════

const Inbox = {
  _key: 'inbox_messages',
  _offsetKey: 'inbox_tg_offset',
  _polling: null,

  load() {
    try { return JSON.parse(localStorage.getItem(this._key) || '[]'); } catch { return []; }
  },

  save(msgs) {
    // Храним последние 100
    localStorage.setItem(this._key, JSON.stringify(msgs.slice(0, 100)));
  },

  getOffset() {
    return parseInt(localStorage.getItem(this._offsetKey) || '0');
  },

  setOffset(v) {
    localStorage.setItem(this._offsetKey, String(v));
  },

  // Получить новые сообщения из Telegram бота
  async fetchTelegram() {
    const token = (typeof INTEGRATIONS !== 'undefined') ? INTEGRATIONS.TgBot?.token : '';
    if (!token) return [];

    try {
      const offset = this.getOffset();
      const url = `https://api.telegram.org/bot${token}/getUpdates?offset=${offset}&limit=20&timeout=0`;
      const r = await fetch(url);
      const data = await r.json();
      if (!data.ok || !data.result?.length) return [];

      const newMsgs = [];
      let maxOffset = offset;

      data.result.forEach(upd => {
        maxOffset = Math.max(maxOffset, upd.update_id + 1);
        const msg = upd.message || upd.edited_message;
        if (!msg || !msg.text) return;

        newMsgs.push({
          id: upd.update_id,
          source: 'telegram',
          from: msg.from?.first_name + (msg.from?.last_name ? ' ' + msg.from.last_name : ''),
          username: msg.from?.username || '',
          chatId: msg.chat?.id,
          text: msg.text,
          ts: msg.date * 1000,
          status: 'new' // new | read | replied
        });
      });

      this.setOffset(maxOffset);
      return newMsgs;
    } catch(e) {
      return [];
    }
  },

  async refresh() {
    const btn = document.getElementById('inboxRefreshBtn');
    if (btn) btn.textContent = '⏳';

    const newMsgs = await this.fetchTelegram();
    if (newMsgs.length) {
      const existing = this.load();
      const existIds = new Set(existing.map(m => m.id));
      const toAdd = newMsgs.filter(m => !existIds.has(m.id));
      this.save([...toAdd, ...existing]);
    }

    if (btn) btn.textContent = '↻';
    this.render();
  },

  markRead(id) {
    const msgs = this.load();
    const m = msgs.find(m => m.id === id);
    if (m) { m.status = 'read'; this.save(msgs); this.render(); }
  },

  markReplied(id) {
    const msgs = this.load();
    const m = msgs.find(m => m.id === id);
    if (m) { m.status = 'replied'; this.save(msgs); this.render(); }
  },

  delete(id) {
    this.save(this.load().filter(m => m.id !== id));
    this.render();
  },

  // Отправить задачу сотруднику от имени входящего
  sendToAgent(id) {
    const msgs = this.load();
    const m = msgs.find(m => m.id === id);
    if (!m) return;

    // Переключаем на экран задач и вставляем текст
    switchScreen('tasks');
    const inp = document.getElementById('taskInp');
    if (inp) {
      inp.value = `Ответь клиенту ${m.from}: «${m.text}»`;
      inp.style.height = 'auto';
      inp.style.height = inp.scrollHeight + 'px';
      inp.focus();
    }
    this.markRead(id);
  },

  // Автоответ через AI
  async autoReply(id) {
    const msgs = this.load();
    const m = msgs.find(m => m.id === id);
    if (!m) return;

    const card = document.getElementById(`inbox_${id}`);
    if (card) {
      const btn = card.querySelector('.inbox-ai-btn');
      if (btn) { btn.textContent = '⏳'; btn.disabled = true; }
    }

    try {
      const token = (typeof INTEGRATIONS !== 'undefined') ? INTEGRATIONS.TgBot?.token : '';
      if (!token || !m.chatId) {
        alert('Настройте Telegram бота в разделе Связи'); return;
      }

      // Генерируем ответ через AI
      const apiKey = typeof API_KEY !== 'undefined' ? API_KEY : '';
      if (!apiKey) { alert('Нет API ключа'); return; }

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
          max_tokens: 300,
          messages: [{
            role: 'user',
            content: `Ты — менеджер онлайн-магазина. Напиши вежливый краткий ответ клиенту на его сообщение. Только текст ответа, без пояснений.\n\nСообщение клиента: ${m.text}`
          }]
        })
      });

      const data = await resp.json();
      const replyText = data.content?.[0]?.text || '';
      if (!replyText) throw new Error('Нет ответа');

      // Отправляем в Telegram
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: m.chatId, text: replyText })
      });

      this.markReplied(id);
      if (typeof addLog === 'function') addLog('ok', `✅ Ответ отправлен клиенту ${m.from}`, replyText.slice(0, 60));

    } catch(e) {
      if (typeof addLog === 'function') addLog('error', '❌ Ошибка автоответа', e.message);
    }
  },

  render() {
    const container = document.getElementById('inboxList');
    if (!container) return;
    const msgs = this.load();

    // Счётчик новых
    const newCount = msgs.filter(m => m.status === 'new').length;
    const badge = document.getElementById('inboxBadge');
    if (badge) {
      badge.textContent = newCount || '';
      badge.style.display = newCount ? 'flex' : 'none';
    }

    if (!msgs.length) {
      container.innerHTML = `
        <div style="text-align:center;padding:48px 24px;color:var(--text3)">
          <div style="font-size:32px;margin-bottom:12px">📭</div>
          <div style="font-size:14px;font-weight:600;margin-bottom:6px">Нет входящих</div>
          <div style="font-size:12px">Нажмите ↻ чтобы проверить новые сообщения<br>из Telegram бота</div>
        </div>`;
      return;
    }

    const statusColor = { new: 'var(--blue)', read: 'var(--text3)', replied: 'var(--green)' };
    const statusLabel = { new: '🔵 Новое', read: '⚪ Прочитано', replied: '✅ Отвечено' };
    const sourceIcon = { telegram: '✈️', instagram: '📸', vk: '💙', whatsapp: '💚' };

    container.innerHTML = msgs.map(m => {
      const time = new Date(m.ts).toLocaleString('ru', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
      return `
      <div id="inbox_${m.id}" style="background:var(--bg2);border:0.5px solid ${m.status==='new'?'var(--blue2)':'var(--border)'};border-radius:14px;padding:14px;margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
          <div>
            <span style="font-size:13px;font-weight:700">${sourceIcon[m.source]||'💬'} ${m.from}</span>
            ${m.username ? `<span style="font-size:10px;color:var(--text3);margin-left:6px">@${m.username}</span>` : ''}
          </div>
          <div style="display:flex;align-items:center;gap:6px">
            <span style="font-size:10px;color:${statusColor[m.status]}">${statusLabel[m.status]}</span>
            <button onclick="Inbox.delete(${m.id})" style="width:20px;height:20px;border-radius:6px;border:0.5px solid var(--border2);background:var(--bg3);color:var(--text3);font-size:10px;cursor:pointer;display:flex;align-items:center;justify-content:center">✕</button>
          </div>
        </div>
        <div style="font-size:13px;color:var(--text);line-height:1.5;margin-bottom:10px">${m.text}</div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:10px;color:var(--text3)">${time}</span>
          <div style="display:flex;gap:6px">
            <button onclick="Inbox.sendToAgent(${m.id})" style="padding:5px 10px;border-radius:8px;border:0.5px solid var(--border2);background:var(--bg3);color:var(--text2);font-size:11px;font-weight:600;cursor:pointer;font-family:var(--font)">👤 Агенту</button>
            ${m.status !== 'replied' ? `<button class="inbox-ai-btn" onclick="Inbox.autoReply(${m.id})" style="padding:5px 10px;border-radius:8px;border:none;background:var(--blue);color:#fff;font-size:11px;font-weight:600;cursor:pointer;font-family:var(--font)">🤖 AI ответ</button>` : ''}
          </div>
        </div>
      </div>`;
    }).join('');
  },

  // Автообновление каждые 30 сек
  startPolling() {
    if (this._polling) return;
    this._polling = setInterval(() => {
      const screen = document.getElementById('s-inbox');
      if (screen?.classList.contains('active')) this.refresh();
      else {
        // Тихо проверяем счётчик
        this.fetchTelegram().then(newMsgs => {
          if (newMsgs.length) {
            const existing = this.load();
            const existIds = new Set(existing.map(m => m.id));
            const toAdd = newMsgs.filter(m => !existIds.has(m.id));
            if (toAdd.length) { this.save([...toAdd, ...existing]); this.render(); }
          }
        });
      }
    }, 30000);
  }
};

// ── HTML экрана ──────────────────────────────────────────────────
const INBOX_SCREEN_HTML = `
<div class="screen" id="s-inbox">
  <div class="hdr">
    <div class="hdr-logo">
      <div class="hdr-icon">📨</div>
      <div><div class="hdr-title">Входящие</div><div class="hdr-sub">Сообщения от клиентов</div></div>
    </div>
    <div id="inboxRefreshBtn" class="hbtn" onclick="Inbox.refresh()" title="Обновить">↻</div>
  </div>
  <div style="flex:1;overflow-y:auto;padding:12px" id="inboxList"></div>
</div>`;

// ── Навигация ────────────────────────────────────────────────────
const INBOX_NAV_HTML = `
<div class="nav-item" id="nav-inbox" onclick="switchScreen('inbox')" style="position:relative">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
  <span id="inboxBadge" style="display:none;position:absolute;top:4px;right:12px;background:var(--red);color:#fff;font-size:9px;font-weight:700;border-radius:8px;padding:1px 5px;min-width:16px;text-align:center"></span>
  Входящие
</div>`;

// ── Инициализация ────────────────────────────────────────────────
function initInbox() {
  if (!document.getElementById('s-inbox')) {
    document.querySelector('.app').insertAdjacentHTML('beforeend', INBOX_SCREEN_HTML);
  }
  if (!document.getElementById('nav-inbox')) {
    document.querySelector('.nav').insertAdjacentHTML('beforeend', INBOX_NAV_HTML);
  }
  Inbox.render();
  Inbox.startPolling();
}
