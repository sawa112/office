// ═══════════════════════════════════════
//  kanban.js — Канбан доска задач
//  Подключи: <script src="kanban.js"></script>
// ═══════════════════════════════════════

const Kanban = {
  COLS: ['queue','work','review','done'],
  LABELS: { queue:'📋 Очередь', work:'⚡ В работе', review:'👁 Проверка', done:'✅ Готово' },
  COLORS: { queue:'var(--text3)', work:'var(--amber)', review:'var(--blue)', done:'var(--green)' },

  _key: 'kanban_tasks',

  load() {
    try { return JSON.parse(localStorage.getItem(this._key) || '[]'); } catch { return []; }
  },
  save(tasks) { localStorage.setItem(this._key, JSON.stringify(tasks)); },

  add(text, empId, empName, empEmoji) {
    const tasks = this.load();
    const task = {
      id: Date.now(),
      text,
      empId, empName, empEmoji,
      col: 'queue',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      priority: 'normal' // low / normal / high
    };
    tasks.unshift(task);
    this.save(tasks);
    return task;
  },

  move(id, col) {
    const tasks = this.load();
    const t = tasks.find(t=>t.id===id);
    if (t) { t.col = col; t.updatedAt = Date.now(); }
    this.save(tasks);
    this.render();
  },

  remove(id) {
    const tasks = this.load().filter(t=>t.id!==id);
    this.save(tasks);
    this.render();
  },

  setPriority(id, priority) {
    const tasks = this.load();
    const t = tasks.find(t=>t.id===id);
    if (t) { t.priority = priority; t.updatedAt = Date.now(); }
    this.save(tasks);
    this.render();
  },

  render() {
    const container = document.getElementById('kanbanBoard');
    if (!container) return;
    const tasks = this.load();

    container.innerHTML = this.COLS.map(col => {
      const colTasks = tasks.filter(t=>t.col===col);
      return `
      <div class="kb-col" data-col="${col}">
        <div class="kb-col-hdr">
          <span style="color:${this.COLORS[col]}">${this.LABELS[col]}</span>
          <span class="kb-count">${colTasks.length}</span>
        </div>
        <div class="kb-cards" id="kbCol_${col}">
          ${colTasks.length ? colTasks.map(t=>this._cardHTML(t)).join('') :
            `<div class="kb-empty">Пусто</div>`}
        </div>
      </div>`;
    }).join('');
  },

  _cardHTML(t) {
    const age = this._age(t.createdAt);
    const pColor = t.priority==='high'?'var(--red)':t.priority==='low'?'var(--text3)':'var(--amber)';
    const nextCols = this.COLS.filter(c=>c!==t.col);
    return `
    <div class="kb-card" data-id="${t.id}">
      <div class="kb-card-top">
        <span class="kb-emp">${t.empEmoji||'👤'} ${t.empName||'Агент'}</span>
        <span style="width:7px;height:7px;border-radius:50%;background:${pColor};display:inline-block;flex-shrink:0"></span>
      </div>
      <div class="kb-card-text">${t.text.slice(0,100)}${t.text.length>100?'…':''}</div>
      <div class="kb-card-bot">
        <span class="kb-age">${age}</span>
        <div class="kb-actions">
          ${nextCols.slice(0,2).map(c=>`
            <button class="kb-mv" onclick="Kanban.move(${t.id},'${c}')" title="${this.LABELS[c]}">
              ${c==='done'?'✓':c==='work'?'▶':c==='review'?'👁':'↩'}
            </button>`).join('')}
          <button class="kb-mv danger" onclick="Kanban.remove(${t.id})" title="Удалить">✕</button>
        </div>
      </div>
    </div>`;
  },

  _age(ts) {
    const m = Math.floor((Date.now()-ts)/60000);
    if (m<1) return 'только что';
    if (m<60) return m+'м';
    if (m<1440) return Math.floor(m/60)+'ч';
    return Math.floor(m/1440)+'д';
  }
};

// ── HTML экрана канбана (вставить в index.html как новый .screen) ──
const KANBAN_SCREEN_HTML = `
<div class="screen" id="screenKanban">
  <div class="hdr">
    <div class="hdr-logo">
      <div class="hdr-icon">📋</div>
      <div><div class="hdr-title">Канбан</div><div class="hdr-sub">Доска задач</div></div>
    </div>
    <div class="hdr-right">
      <div class="hbtn" onclick="showAddTaskModal()">＋</div>
    </div>
  </div>
  <div style="overflow-x:auto;flex:1;display:flex;padding:10px 0 8px">
    <div id="kanbanBoard" style="display:flex;gap:10px;padding:0 12px;min-width:max-content;align-items:flex-start"></div>
  </div>
</div>`;

// ── CSS канбана (вставить в <style> или отдельный файл) ──────────
const KANBAN_CSS = `
.kb-col { width: 220px; flex-shrink: 0; display: flex; flex-direction: column; gap: 6px; }
.kb-col-hdr { display: flex; align-items: center; justify-content: space-between; padding: 4px 2px 6px; font-size: 12px; font-weight: 700; }
.kb-count { background: var(--bg3); border: 0.5px solid var(--border2); border-radius: 10px; padding: 1px 7px; font-size: 10px; color: var(--text3); }
.kb-cards { display: flex; flex-direction: column; gap: 6px; min-height: 60px; }
.kb-card { background: var(--bg2); border: 0.5px solid var(--border); border-radius: 12px; padding: 11px 12px; transition: border-color .15s; }
.kb-card:hover { border-color: var(--border2); }
.kb-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.kb-emp { font-size: 10px; color: var(--text3); }
.kb-card-text { font-size: 12.5px; color: var(--text); line-height: 1.45; }
.kb-card-bot { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; }
.kb-age { font-size: 10px; color: var(--text3); }
.kb-actions { display: flex; gap: 4px; }
.kb-mv { width: 22px; height: 22px; border-radius: 6px; border: 0.5px solid var(--border2); background: var(--bg3); color: var(--text2); font-size: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-family: var(--font); transition: all .15s; }
.kb-mv:hover { border-color: var(--blue); color: var(--blue); }
.kb-mv.danger:hover { border-color: var(--red); color: var(--red); }
.kb-empty { font-size: 11px; color: var(--text3); text-align: center; padding: 20px 0; border: 0.5px dashed var(--border); border-radius: 10px; }
`;

// ── Инициализация ────────────────────────────────────────────────
function initKanban() {
  // Вставить CSS
  if (!document.getElementById('kanbanCSS')) {
    const style = document.createElement('style');
    style.id = 'kanbanCSS';
    style.textContent = KANBAN_CSS;
    document.head.appendChild(style);
  }
  // Вставить экран если ещё нет
  if (!document.getElementById('screenKanban')) {
    document.querySelector('.app').insertAdjacentHTML('beforeend', KANBAN_SCREEN_HTML);
  }
  Kanban.render();
}

function showAddTaskModal() {
  // Используем employees из основного файла если доступны
  const emps = typeof employees !== 'undefined' ? employees : [{id:0,name:'Агент',emoji:'🤖'}];
  const html = `
  <div id="kbModal" style="position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.75);display:flex;align-items:flex-end;justify-content:center" onclick="if(event.target.id==='kbModal')closeKbModal()">
    <div style="background:var(--bg2);border:0.5px solid var(--border2);border-radius:20px 20px 0 0;width:100%;padding:20px;animation:slideup .2s ease-out">
      <div style="width:38px;height:4px;border-radius:2px;background:var(--bg4);margin:0 auto 16px"></div>
      <div style="font-size:16px;font-weight:700;margin-bottom:16px">Новая задача</div>
      <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px">Исполнитель</div>
      <select id="kbEmpSel" style="width:100%;background:var(--bg3);border:0.5px solid var(--border2);border-radius:10px;padding:10px 12px;font-size:14px;font-family:var(--font);color:var(--text);outline:none;margin-bottom:12px">
        ${emps.map(e=>`<option value="${e.id}" data-emoji="${e.emoji}" data-name="${e.name}">${e.emoji} ${e.name}</option>`).join('')}
      </select>
      <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px">Задача</div>
      <textarea id="kbTaskText" placeholder="Опишите задачу..." style="width:100%;background:var(--bg3);border:0.5px solid var(--border2);border-radius:10px;padding:10px 12px;font-size:14px;font-family:var(--font);color:var(--text);outline:none;resize:none;min-height:90px;margin-bottom:12px"></textarea>
      <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px">Приоритет</div>
      <div style="display:flex;gap:6px;margin-bottom:16px">
        ${['low','normal','high'].map(p=>`<button onclick="document.querySelectorAll('.kb-pri').forEach(b=>b.classList.remove('sel'));this.classList.add('sel');window._kbPriority='${p}'" class="kb-pri${p==='normal'?' sel':''}" data-p="${p}" style="flex:1;padding:8px;border-radius:10px;border:0.5px solid var(--border2);background:var(--bg3);color:var(--text2);font-size:12px;font-weight:600;cursor:pointer;font-family:var(--font);transition:all .15s">${p==='low'?'🔵 Низкий':p==='normal'?'🟡 Обычный':'🔴 Высокий'}</button>`).join('')}
      </div>
      <style>.kb-pri.sel{background:var(--blue3)!important;border-color:var(--blue2)!important;color:var(--blue)!important}</style>
      <div style="display:flex;gap:8px">
        <button onclick="closeKbModal()" style="flex:1;padding:11px;border-radius:10px;border:0.5px solid var(--border2);background:var(--bg3);color:var(--text2);font-size:14px;font-weight:600;cursor:pointer;font-family:var(--font)">Отмена</button>
        <button onclick="addKbTask()" style="flex:1;padding:11px;border-radius:10px;border:none;background:var(--blue);color:#fff;font-size:14px;font-weight:600;cursor:pointer;font-family:var(--font)">Добавить</button>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  window._kbPriority = 'normal';
  document.getElementById('kbTaskText').focus();
}

function closeKbModal() { document.getElementById('kbModal')?.remove(); }

function addKbTask() {
  const text = document.getElementById('kbTaskText').value.trim();
  if (!text) return;
  const sel = document.getElementById('kbEmpSel');
  const opt = sel.options[sel.selectedIndex];
  const empId = parseInt(sel.value);
  const empName = opt.dataset.name;
  const empEmoji = opt.dataset.emoji;
  const task = Kanban.add(text, empId, empName, empEmoji);
  task.priority = window._kbPriority || 'normal';
  const tasks = Kanban.load();
  const t = tasks.find(t=>t.id===task.id);
  if(t) t.priority = task.priority;
  Kanban.save(tasks);
  closeKbModal();
  Kanban.render();
}
