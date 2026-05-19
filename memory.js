// ═══════════════════════════════════════
//  memory.js — Память сотрудников
//  Подключи в index.html: <script src="memory.js"></script>
// ═══════════════════════════════════════

const Memory = {
  MAX_PER_EMPLOYEE: 50,

  _key(empId) { return `mem_emp_${empId}`; },
  _clientKey(name) { return `mem_client_${name.toLowerCase().replace(/\s+/g,'_')}`; },

  // Сохранить воспоминание сотрудника
  save(empId, type, text, meta={}) {
    const key = this._key(empId);
    const list = this.getAll(empId);
    list.unshift({ type, text, meta, ts: Date.now() });
    if (list.length > this.MAX_PER_EMPLOYEE) list.length = this.MAX_PER_EMPLOYEE;
    localStorage.setItem(key, JSON.stringify(list));
  },

  // Получить все воспоминания сотрудника
  getAll(empId) {
    try { return JSON.parse(localStorage.getItem(this._key(empId)) || '[]'); }
    catch { return []; }
  },

  // Получить последние N воспоминаний
  getLast(empId, n=10) { return this.getAll(empId).slice(0, n); },

  // Сформировать контекст для промпта
  buildContext(empId) {
    const mems = this.getLast(empId, 15);
    if (!mems.length) return '';
    const lines = mems.map(m => {
      const d = new Date(m.ts).toLocaleDateString('ru',{day:'numeric',month:'short'});
      return `[${d}] ${m.type}: ${m.text}`;
    });
    return `\n\nТВОЯ ПАМЯТЬ (прошлые задачи и контекст):\n${lines.join('\n')}`;
  },

  // Сохранить данные о клиенте
  saveClient(name, data) {
    const key = this._clientKey(name);
    const existing = this.getClient(name);
    const updated = { ...existing, ...data, name, updatedAt: Date.now() };
    localStorage.setItem(key, JSON.stringify(updated));
  },

  getClient(name) {
    try { return JSON.parse(localStorage.getItem(this._clientKey(name)) || 'null'); }
    catch { return null; }
  },

  // Все клиенты
  getAllClients() {
    const clients = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k.startsWith('mem_client_')) {
        try { clients.push(JSON.parse(localStorage.getItem(k))); } catch {}
      }
    }
    return clients.sort((a,b) => (b.updatedAt||0) - (a.updatedAt||0));
  },

  // Очистить память одного сотрудника
  clear(empId) { localStorage.removeItem(this._key(empId)); },

  // Очистить всё
  clearAll() {
    const toRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k.startsWith('mem_')) toRemove.push(k);
    }
    toRemove.forEach(k => localStorage.removeItem(k));
  }
};

// ── Автосохранение после каждой задачи ──────────────────────────
// Вызывай эту функцию после получения ответа от AI в tasks.js
function memAutoSave(empId, taskText, resultText) {
  Memory.save(empId, 'задача', taskText.slice(0, 120));
  // Парсим клиентов из текста (простое имя после "клиент" / "@")
  const clientMatch = taskText.match(/клиент[а-я]*\s+([А-ЯA-Z][а-яa-z]+(?:\s+[А-ЯA-Z][а-яa-z]+)?)/i);
  if (clientMatch) {
    Memory.saveClient(clientMatch[1], { lastTask: taskText.slice(0,80), lastEmployee: empId });
  }
}

// ── UI: панель памяти сотрудника ─────────────────────────────────
function showMemoryPanel(empId, empName) {
  const mems = Memory.getLast(empId, 20);
  const clients = Memory.getAllClients().slice(0, 5);

  const html = `
  <div id="memPanel" style="
    position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.75);
    display:flex;align-items:flex-end;justify-content:center;
    animation:fadein .15s;
  " onclick="e=>{ if(e.target.id==='memPanel') closeMemPanel(); }">
    <div style="
      background:var(--bg2);border:0.5px solid var(--border2);
      border-radius:20px 20px 0 0;width:100%;max-height:82vh;
      overflow-y:auto;padding:20px;animation:slideup .2s ease-out;
    ">
      <div style="width:38px;height:4px;border-radius:2px;background:var(--bg4);margin:0 auto 16px"></div>
      <div style="font-size:16px;font-weight:700;margin-bottom:4px">🧠 Память — ${empName}</div>
      <div style="font-size:11px;color:var(--text3);margin-bottom:16px">${mems.length} воспоминаний</div>

      ${clients.length ? `
        <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px">Клиенты</div>
        ${clients.map(c=>`
          <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:10px;padding:10px 12px;margin-bottom:6px">
            <div style="font-size:13px;font-weight:600">${c.name}</div>
            <div style="font-size:11px;color:var(--text3);margin-top:2px">${c.lastTask||''}</div>
          </div>
        `).join('')}
        <div style="margin-bottom:14px"></div>
      ` : ''}

      <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px">История задач</div>
      ${mems.length ? mems.map(m=>{
        const d = new Date(m.ts).toLocaleDateString('ru',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
        return `<div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:10px;padding:10px 12px;margin-bottom:6px">
          <div style="font-size:11px;color:var(--blue);margin-bottom:3px">${m.type}</div>
          <div style="font-size:13px;color:var(--text);line-height:1.45">${m.text}</div>
          <div style="font-size:10px;color:var(--text3);margin-top:4px">${d}</div>
        </div>`;
      }).join('') : '<div style="text-align:center;color:var(--text3);font-size:13px;padding:24px">Пока пусто</div>'}

      <div style="display:flex;gap:8px;margin-top:16px">
        <button onclick="closeMemPanel()" style="flex:1;padding:11px;border-radius:10px;border:0.5px solid var(--border2);background:var(--bg3);color:var(--text2);font-size:14px;font-weight:600;font-family:var(--font);cursor:pointer">Закрыть</button>
        <button onclick="Memory.clear(${empId});closeMemPanel();" style="padding:11px 16px;border-radius:10px;border:0.5px solid rgba(240,80,80,.3);background:var(--red2);color:var(--red);font-size:14px;font-weight:600;font-family:var(--font);cursor:pointer">Очистить</button>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', html);
}

function closeMemPanel() {
  const p = document.getElementById('memPanel');
  if (p) p.remove();
}
