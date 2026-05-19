// ═══════════════════════════════════════
//  crm.js — Воронка сделок / CRM
//  Подключи: <script src="crm.js"></script>
// ═══════════════════════════════════════

const CRM = {
  STAGES: ['lead','contact','proposal','negotiation','closed','lost'],
  LABELS: { lead:'🎯 Лид', contact:'💬 Контакт', proposal:'📄 КП', negotiation:'🤝 Переговоры', closed:'✅ Закрыто', lost:'❌ Потеря' },
  COLORS: { lead:'var(--text3)', contact:'var(--blue)', proposal:'var(--amber)', negotiation:'var(--purple)', closed:'var(--green)', lost:'var(--red)' },
  _key: 'crm_deals',

  load() { try { return JSON.parse(localStorage.getItem(this._key)||'[]'); } catch { return []; } },
  save(deals) { localStorage.setItem(this._key, JSON.stringify(deals)); },

  add(data) {
    const deals = this.load();
    const deal = {
      id: Date.now(),
      name: data.name||'Новая сделка',
      client: data.client||'',
      amount: data.amount||0,
      currency: data.currency||'₽',
      stage: 'lead',
      source: data.source||'',
      notes: data.notes||'',
      empId: data.empId||null,
      empName: data.empName||'',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      history: [{ ts: Date.now(), stage: 'lead', note: 'Сделка создана' }]
    };
    deals.unshift(deal);
    this.save(deals);
    return deal;
  },

  move(id, stage, note='') {
    const deals = this.load();
    const d = deals.find(d=>d.id===id);
    if (d) {
      d.stage = stage;
      d.updatedAt = Date.now();
      d.history.push({ ts: Date.now(), stage, note });
    }
    this.save(deals);
    this.render();
  },

  remove(id) { this.save(this.load().filter(d=>d.id!==id)); this.render(); },

  stats() {
    const deals = this.load();
    const total = deals.reduce((s,d)=>s+Number(d.amount||0),0);
    const closed = deals.filter(d=>d.stage==='closed').reduce((s,d)=>s+Number(d.amount||0),0);
    const active = deals.filter(d=>!['closed','lost'].includes(d.stage)).length;
    return { total, closed, active, count: deals.length };
  },

  render() {
    const container = document.getElementById('crmBoard');
    if (!container) return;
    const deals = this.load();
    const stats = this.stats();

    // Stats bar
    const statsEl = document.getElementById('crmStats');
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="crm-stat"><div class="crm-stat-val">${stats.count}</div><div class="crm-stat-lbl">Всего</div></div>
        <div class="crm-stat"><div class="crm-stat-val">${stats.active}</div><div class="crm-stat-lbl">Активных</div></div>
        <div class="crm-stat" style="color:var(--green)"><div class="crm-stat-val">${this._fmt(stats.closed)}</div><div class="crm-stat-lbl">Закрыто</div></div>
        <div class="crm-stat"><div class="crm-stat-val">${this._fmt(stats.total)}</div><div class="crm-stat-lbl">Воронка</div></div>`;
    }

    container.innerHTML = this.STAGES.map(stage => {
      const stageDeal = deals.filter(d=>d.stage===stage);
      const stageSum = stageDeal.reduce((s,d)=>s+Number(d.amount||0),0);
      return `
      <div class="crm-col" data-stage="${stage}">
        <div class="crm-col-hdr">
          <span style="color:${this.COLORS[stage]}">${this.LABELS[stage]}</span>
          <div style="display:flex;align-items:center;gap:6px">
            ${stageSum>0?`<span class="crm-sum">${this._fmt(stageSum)}</span>`:''}
            <span class="kb-count">${stageDeal.length}</span>
          </div>
        </div>
        <div class="crm-cards" id="crmCol_${stage}">
          ${stageDeal.length ? stageDeal.map(d=>this._cardHTML(d)).join('') :
            `<div class="kb-empty">Пусто</div>`}
        </div>
      </div>`;
    }).join('');
  },

  _cardHTML(d) {
    const age = this._age(d.createdAt);
    const nextStages = this.STAGES.filter(s=>s!==d.stage&&s!=='lost');
    const prevStage = this.STAGES[this.STAGES.indexOf(d.stage)-1];
    return `
    <div class="crm-card" onclick="showDealDetail(${d.id})">
      <div class="crm-card-name">${d.name}</div>
      ${d.client?`<div class="crm-card-client">👤 ${d.client}</div>`:''}
      ${d.amount>0?`<div class="crm-card-amount">${this._fmt(d.amount)} ${d.currency}</div>`:''}
      ${d.empName?`<div class="crm-card-emp">→ ${d.empName}</div>`:''}
      <div class="crm-card-bot">
        <span class="kb-age">${age}</span>
        <div class="kb-actions" onclick="event.stopPropagation()">
          ${prevStage?`<button class="kb-mv" onclick="CRM.move(${d.id},'${prevStage}')" title="Назад">←</button>`:''}
          ${d.stage!=='closed'?`<button class="kb-mv" style="color:var(--green)" onclick="CRM.move(${d.id},'closed','Закрыто')" title="Закрыть">✓</button>`:''}
          ${d.stage!=='lost'?`<button class="kb-mv danger" onclick="CRM.move(${d.id},'lost','Потеря')" title="Потеря">✗</button>`:''}
          <button class="kb-mv danger" onclick="CRM.remove(${d.id})" title="Удалить">🗑</button>
        </div>
      </div>
    </div>`;
  },

  _fmt(n) {
    if (!n) return '0';
    if (n>=1000000) return (n/1000000).toFixed(1)+'М';
    if (n>=1000) return (n/1000).toFixed(0)+'К';
    return n+'';
  },

  _age(ts) {
    const m = Math.floor((Date.now()-ts)/60000);
    if (m<60) return m+'м';
    if (m<1440) return Math.floor(m/60)+'ч';
    return Math.floor(m/1440)+'д';
  }
};

// ── Детальная карточка сделки ────────────────────────────────────
function showDealDetail(id) {
  const deals = CRM.load();
  const d = deals.find(d=>d.id===id);
  if (!d) return;
  const hist = (d.history||[]).slice().reverse();
  const html = `
  <div id="dealModal" style="position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.75);display:flex;align-items:flex-end;justify-content:center" onclick="if(event.target.id==='dealModal')closeDealModal()">
    <div style="background:var(--bg2);border:0.5px solid var(--border2);border-radius:20px 20px 0 0;width:100%;max-height:88vh;overflow-y:auto;padding:20px;animation:slideup .2s ease-out">
      <div style="width:38px;height:4px;border-radius:2px;background:var(--bg4);margin:0 auto 16px"></div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <div style="font-size:16px;font-weight:700">${d.name}</div>
        <span style="font-size:11px;padding:3px 10px;border-radius:8px;background:var(--bg3);color:${CRM.COLORS[d.stage]}">${CRM.LABELS[d.stage]}</span>
      </div>
      ${d.amount>0?`<div style="font-size:22px;font-weight:700;color:var(--green);margin-bottom:12px">${CRM.stats._fmt?'':d.amount} ${d.currency}</div>`:''}
      ${d.client?`<div style="font-size:13px;color:var(--text2);margin-bottom:8px">👤 Клиент: <strong>${d.client}</strong></div>`:''}
      ${d.source?`<div style="font-size:13px;color:var(--text2);margin-bottom:8px">📍 Источник: ${d.source}</div>`:''}
      ${d.notes?`<div style="background:var(--bg3);border-radius:10px;padding:10px 12px;font-size:13px;color:var(--text2);margin-bottom:12px">${d.notes}</div>`:''}

      <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px">Перевести на этап</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px">
        ${CRM.STAGES.filter(s=>s!==d.stage).map(s=>`
          <button onclick="CRM.move(${d.id},'${s}');closeDealModal()" style="padding:6px 12px;border-radius:8px;border:0.5px solid var(--border2);background:var(--bg3);color:${CRM.COLORS[s]};font-size:12px;font-weight:600;cursor:pointer;font-family:var(--font)">${CRM.LABELS[s]}</button>
        `).join('')}
      </div>

      ${hist.length?`
        <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px">История</div>
        ${hist.map(h=>{
          const dt = new Date(h.ts).toLocaleString('ru',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
          return `<div style="display:flex;gap:10px;margin-bottom:8px;align-items:flex-start">
            <div style="width:8px;height:8px;border-radius:50%;background:${CRM.COLORS[h.stage]||'var(--text3)'};margin-top:4px;flex-shrink:0"></div>
            <div><div style="font-size:12px;color:var(--text)">${CRM.LABELS[h.stage]||h.stage}</div>${h.note?`<div style="font-size:11px;color:var(--text3)">${h.note}</div>`:''}<div style="font-size:10px;color:var(--text3);margin-top:2px">${dt}</div></div>
          </div>`;
        }).join('')}
      `:''}

      <button onclick="closeDealModal()" style="width:100%;margin-top:8px;padding:11px;border-radius:10px;border:0.5px solid var(--border2);background:var(--bg3);color:var(--text2);font-size:14px;font-weight:600;cursor:pointer;font-family:var(--font)">Закрыть</button>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}
function closeDealModal() { document.getElementById('dealModal')?.remove(); }

// ── Модал добавления сделки ──────────────────────────────────────
function showAddDealModal() {
  const emps = typeof employees !== 'undefined' ? employees : [];
  const html = `
  <div id="addDealModal" style="position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.75);display:flex;align-items:flex-end;justify-content:center" onclick="if(event.target.id==='addDealModal')closeAddDealModal()">
    <div style="background:var(--bg2);border:0.5px solid var(--border2);border-radius:20px 20px 0 0;width:100%;max-height:88vh;overflow-y:auto;padding:20px;animation:slideup .2s ease-out">
      <div style="width:38px;height:4px;border-radius:2px;background:var(--bg4);margin:0 auto 16px"></div>
      <div style="font-size:16px;font-weight:700;margin-bottom:16px">Новая сделка</div>
      ${['Название|addDealName|text|Куртка Stone Island XL','Клиент|addDealClient|text|Иван Петров','Сумма|addDealAmount|number|15000','Источник|addDealSource|text|Instagram, Авито...','Заметки|addDealNotes|textarea|Детали...'].map(f=>{
        const [lbl,id,type,ph]=f.split('|');
        return `<div style="margin-bottom:10px"><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px">${lbl}</div>
          ${type==='textarea'
            ?`<textarea id="${id}" placeholder="${ph}" style="width:100%;background:var(--bg3);border:0.5px solid var(--border2);border-radius:10px;padding:10px 12px;font-size:14px;font-family:var(--font);color:var(--text);outline:none;resize:none;min-height:70px"></textarea>`
            :`<input type="${type}" id="${id}" placeholder="${ph}" style="width:100%;background:var(--bg3);border:0.5px solid var(--border2);border-radius:10px;padding:10px 12px;font-size:14px;font-family:var(--font);color:var(--text);outline:none">`}
        </div>`;
      }).join('')}
      ${emps.length?`<div style="margin-bottom:14px"><div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px">Ответственный</div>
        <select id="addDealEmp" style="width:100%;background:var(--bg3);border:0.5px solid var(--border2);border-radius:10px;padding:10px 12px;font-size:14px;font-family:var(--font);color:var(--text);outline:none">
          <option value="">— не назначен —</option>
          ${emps.map(e=>`<option value="${e.id}">${e.emoji} ${e.name}</option>`).join('')}
        </select></div>`:''}
      <div style="display:flex;gap:8px;margin-top:4px">
        <button onclick="closeAddDealModal()" style="flex:1;padding:11px;border-radius:10px;border:0.5px solid var(--border2);background:var(--bg3);color:var(--text2);font-size:14px;font-weight:600;cursor:pointer;font-family:var(--font)">Отмена</button>
        <button onclick="submitAddDeal()" style="flex:1;padding:11px;border-radius:10px;border:none;background:var(--blue);color:#fff;font-size:14px;font-weight:600;cursor:pointer;font-family:var(--font)">Добавить</button>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  document.getElementById('addDealName').focus();
}
function closeAddDealModal() { document.getElementById('addDealModal')?.remove(); }
function submitAddDeal() {
  const name = document.getElementById('addDealName').value.trim();
  if (!name) return;
  const empSel = document.getElementById('addDealEmp');
  const empId = empSel?.value ? parseInt(empSel.value) : null;
  const emp = empId && typeof employees!=='undefined' ? employees.find(e=>e.id===empId) : null;
  CRM.add({
    name,
    client: document.getElementById('addDealClient').value.trim(),
    amount: parseFloat(document.getElementById('addDealAmount').value)||0,
    source: document.getElementById('addDealSource').value.trim(),
    notes: document.getElementById('addDealNotes').value.trim(),
    empId, empName: emp?.name||''
  });
  closeAddDealModal();
  CRM.render();
}

// ── CSS и HTML экрана CRM ────────────────────────────────────────
const CRM_CSS = `
.crm-stat { text-align:center; flex:1; }
.crm-stat-val { font-size:18px; font-weight:700; color:var(--text); }
.crm-stat-lbl { font-size:10px; color:var(--text3); margin-top:2px; }
.crm-col { width:200px; flex-shrink:0; display:flex; flex-direction:column; gap:6px; }
.crm-col-hdr { display:flex; align-items:center; justify-content:space-between; padding:4px 2px 6px; font-size:11px; font-weight:700; }
.crm-sum { font-size:10px; color:var(--green); font-weight:700; }
.crm-cards { display:flex; flex-direction:column; gap:6px; min-height:60px; }
.crm-card { background:var(--bg2); border:0.5px solid var(--border); border-radius:12px; padding:11px 12px; cursor:pointer; transition:border-color .15s; }
.crm-card:hover { border-color:var(--border2); }
.crm-card-name { font-size:13px; font-weight:600; color:var(--text); margin-bottom:4px; }
.crm-card-client { font-size:11px; color:var(--text3); margin-bottom:3px; }
.crm-card-amount { font-size:13px; font-weight:700; color:var(--green); margin-bottom:3px; }
.crm-card-emp { font-size:10px; color:var(--blue); margin-bottom:6px; }
.crm-card-bot { display:flex; align-items:center; justify-content:space-between; }
`;

const CRM_SCREEN_HTML = `
<div class="screen" id="screenCRM">
  <div class="hdr">
    <div class="hdr-logo">
      <div class="hdr-icon">💰</div>
      <div><div class="hdr-title">CRM</div><div class="hdr-sub">Воронка сделок</div></div>
    </div>
    <div class="hdr-right">
      <div class="hbtn" onclick="showAddDealModal()">＋</div>
    </div>
  </div>
  <div style="display:flex;gap:0;padding:10px 12px;border-bottom:0.5px solid var(--border);flex-shrink:0" id="crmStats"></div>
  <div style="overflow-x:auto;flex:1;display:flex;padding:10px 0 8px">
    <div id="crmBoard" style="display:flex;gap:10px;padding:0 12px;min-width:max-content;align-items:flex-start"></div>
  </div>
</div>`;

function initCRM() {
  if (!document.getElementById('crmCSS')) {
    const style = document.createElement('style');
    style.id = 'crmCSS';
    style.textContent = CRM_CSS;
    document.head.appendChild(style);
  }
  if (!document.getElementById('screenCRM')) {
    document.querySelector('.app').insertAdjacentHTML('beforeend', CRM_SCREEN_HTML);
  }
  CRM.render();
}
