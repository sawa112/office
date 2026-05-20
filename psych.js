/**
 * psych.js — Психологический профиль клиента
 * Модуль для AI Holding Office
 *
 * ПОДКЛЮЧЕНИЕ в index.html:
 *   1. Перед </body> добавь: <script src="psych.js"></script>
 *   2. В навигацию (nav) добавь кнопку:
 *      <div class="nav-item" id="nav-psych" onclick="switchScreen('psych')">
 *        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 *          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
 *          <circle cx="12" cy="12" r="10"/><line x1="12" y1="17" x2="12.01" y2="17"/>
 *        </svg>
 *        Профиль
 *      </div>
 *   3. В .app добавь экран: <div class="screen" id="s-psych"></div>
 *   4. В switchScreen() добавь 'psych' в массив экранов
 *   5. API_KEY уже есть в index.html — psych.js его читает автоматически
 */

// ─── PSYCH STORE ─────────────────────────────────────────────────────────────
const PSYCH_KEY = 'holding_psych_profiles_v1';

const PsychStore = {
  load() {
    try { return JSON.parse(localStorage.getItem(PSYCH_KEY) || '[]'); }
    catch { return []; }
  },
  save(profiles) {
    localStorage.setItem(PSYCH_KEY, JSON.stringify(profiles));
  },
  add(profile) {
    const profiles = this.load();
    const existing = profiles.findIndex(p => p.id === profile.id);
    if (existing >= 0) profiles[existing] = profile;
    else profiles.unshift(profile);
    this.save(profiles);
    return profiles;
  },
  delete(id) {
    const profiles = this.load().filter(p => p.id !== id);
    this.save(profiles);
    return profiles;
  }
};

// ─── PSYCH TYPES ─────────────────────────────────────────────────────────────
const PSYCH_TYPES = {
  dominant: {
    label: 'Доминант',
    emoji: '⚡',
    color: '#f05050',
    bg: '#380f0f',
    border: 'rgba(240,80,80,0.25)',
    desc: 'Решает быстро, не любит долгие обсуждения',
    tactics: ['Говори коротко и по делу', 'Давай конкретные цифры и сроки', 'Не объясняй очевидного', 'Уважай его время']
  },
  analytical: {
    label: 'Аналитик',
    emoji: '🔬',
    color: '#5b8df7',
    bg: '#0d1f4a',
    border: 'rgba(91,141,247,0.25)',
    desc: 'Нужны факты, цифры и время на обдумывание',
    tactics: ['Присылай структурированные данные', 'Не торопи с решением', 'Объясняй логику шагов', 'Используй точные формулировки']
  },
  expressive: {
    label: 'Экспрессив',
    emoji: '🎭',
    color: '#f7b731',
    bg: '#3a2700',
    border: 'rgba(247,183,49,0.25)',
    desc: 'Эмоциональный, ценит отношения и истории',
    tactics: ['Начинай с small talk', 'Делись историями и кейсами', 'Апеллируй к эмоциям', 'Поддерживай его энтузиазм']
  },
  amiable: {
    label: 'Дружелюбный',
    emoji: '🤝',
    color: '#2de8a0',
    bg: '#0a3328',
    border: 'rgba(45,232,160,0.25)',
    desc: 'Избегает конфликтов, медленно принимает решения',
    tactics: ['Создавай безопасную атмосферу', 'Не давли и не торопи', 'Подчёркивай надёжность', 'Давай гарантии и примеры']
  }
};

const TONE_STYLES = {
  formal:   { label: 'Формально',   emoji: '👔', color: '#8888aa' },
  friendly: { label: 'Дружески',    emoji: '😊', color: '#2de8a0' },
  assertive:{ label: 'Напористо',   emoji: '💪', color: '#f05050' },
  empathic: { label: 'Эмпатично',   emoji: '❤️', color: '#f7b731' },
  concise:  { label: 'Кратко',      emoji: '⚡', color: '#5b8df7' },
};

// ─── RENDER SCREEN ───────────────────────────────────────────────────────────
function renderPsychScreen() {
  const screen = document.getElementById('s-psych');
  if (!screen) return;

  const profiles = PsychStore.load();

  screen.innerHTML = `
    <div style="flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none">

      <!-- INPUT PANEL -->
      <div style="padding:12px;display:flex;flex-direction:column;gap:8px">
        <div style="background:var(--bg2);border:0.5px solid var(--border2);border-radius:14px;overflow:hidden;transition:border-color .2s" id="psychInputWrap">
          <div style="padding:10px 14px 4px;display:flex;align-items:center;gap:8px">
            <span style="font-size:16px">🧠</span>
            <input id="psychClientName" placeholder="Имя клиента..." maxlength="40"
              style="flex:1;background:transparent;border:none;font-size:14px;font-family:var(--font);color:var(--text);outline:none"
              oninput="psychInputWrap.style.borderColor='var(--purple)'">
          </div>
          <textarea id="psychChat" placeholder="Вставь переписку с клиентом (минимум 2-3 сообщения)..."
            style="width:100%;background:transparent;border:none;border-top:0.5px solid var(--border);padding:10px 14px;font-size:13px;font-family:var(--font);color:var(--text);resize:none;outline:none;min-height:90px;max-height:200px;line-height:1.5;color:var(--text)"
            oninput="autoH(this)"></textarea>
          <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-top:0.5px solid var(--border)">
            <span style="font-size:11px;color:var(--text3)">AI проанализирует стиль общения</span>
            <button onclick="analyzePsych()" id="psychAnalyzeBtn"
              style="padding:7px 16px;border-radius:20px;background:var(--purple,#a07df7);border:none;color:#fff;font-size:12px;font-weight:700;cursor:pointer;font-family:var(--font);display:flex;align-items:center;gap:6px;transition:opacity .15s">
              <span>Анализ</span>
              <span style="font-size:14px">→</span>
            </button>
          </div>
        </div>
      </div>

      <!-- STATUS -->
      <div id="psychStatus" style="display:none;margin:0 12px 8px;padding:10px 14px;border-radius:10px;background:rgba(160,125,247,.1);border:0.5px solid rgba(160,125,247,.25);font-size:12px;color:#a07df7;display:none;align-items:center;gap:8px">
        <div style="width:14px;height:14px;border-radius:50%;border:1.5px solid #a07df7;border-top-color:transparent;animation:spin .7s linear infinite;flex-shrink:0"></div>
        <span id="psychStatusText">Анализирую переписку...</span>
      </div>

      <!-- PROFILES LIST -->
      <div style="padding:0 12px 80px" id="psychProfiles">
        ${profiles.length === 0 ? `
          <div style="text-align:center;padding:48px 24px;color:var(--text3)">
            <div style="font-size:40px;margin-bottom:12px">🧠</div>
            <div style="font-size:14px;font-weight:600;color:var(--text2);margin-bottom:6px">Профилей пока нет</div>
            <div style="font-size:12px;line-height:1.6">Вставь переписку с клиентом выше<br>и AI определит как с ним общаться</div>
          </div>
        ` : profiles.map(p => renderProfileCard(p)).join('')}
      </div>
    </div>
  `;
}

function renderProfileCard(p) {
  const type = PSYCH_TYPES[p.type] || PSYCH_TYPES.analytical;
  const tone = TONE_STYLES[p.tone] || TONE_STYLES.friendly;
  const date = new Date(p.createdAt).toLocaleDateString('ru', {day:'numeric',month:'short'});

  const signalBars = (score) => {
    const bars = 5;
    return Array.from({length: bars}, (_, i) =>
      `<div style="width:4px;height:${8 + i*4}px;border-radius:2px;background:${i < score ? type.color : 'var(--bg3)'}"></div>`
    ).join('');
  };

  const tacticsHtml = (p.tactics || type.tactics).map(t =>
    `<div style="display:flex;align-items:flex-start;gap:8px;padding:7px 10px;background:var(--bg3);border-radius:8px;font-size:12px;line-height:1.5;color:var(--text2)">
      <span style="color:${type.color};flex-shrink:0;margin-top:1px">›</span>
      <span>${t}</span>
    </div>`
  ).join('');

  const traitsHtml = (p.traits || []).map(tr =>
    `<span style="font-size:10px;padding:3px 9px;border-radius:20px;background:${type.bg};color:${type.color};border:0.5px solid ${type.border};font-weight:600">${tr}</span>`
  ).join('');

  const triggersHtml = (p.triggers || []).map(tr =>
    `<div style="font-size:12px;color:var(--text2);padding:5px 9px;background:var(--bg3);border-radius:7px;border-left:2px solid var(--red)">${tr}</div>`
  ).join('');

  const opportunitiesHtml = (p.opportunities || []).map(op =>
    `<div style="font-size:12px;color:var(--text2);padding:5px 9px;background:var(--bg3);border-radius:7px;border-left:2px solid var(--green)">${op}</div>`
  ).join('');

  return `
    <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:14px;overflow:hidden;margin-bottom:10px" id="pcard-${p.id}">

      <!-- HEAD -->
      <div style="padding:14px;background:linear-gradient(135deg,${type.bg},var(--bg2));border-bottom:0.5px solid var(--border);position:relative">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px">
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:44px;height:44px;border-radius:50%;background:${type.bg};border:1.5px solid ${type.border};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">${type.emoji}</div>
            <div>
              <div style="font-size:16px;font-weight:700;letter-spacing:-.02em">${p.clientName}</div>
              <div style="font-size:11px;color:${type.color};font-weight:700;margin-top:2px">${type.label} · ${tone.emoji} ${tone.label}</div>
              <div style="font-size:10px;color:var(--text3);margin-top:2px">${date}</div>
            </div>
          </div>
          <button onclick="deletePsychProfile('${p.id}')"
            style="width:28px;height:28px;border-radius:8px;border:0.5px solid var(--border);background:var(--bg3);cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;color:var(--text3);flex-shrink:0">✕</button>
        </div>

        <!-- CONFIDENCE BARS -->
        <div style="display:flex;align-items:flex-end;gap:3px;margin-top:10px">
          ${signalBars(p.confidence || 3)}
          <span style="font-size:10px;color:var(--text3);margin-left:6px">уверенность в профиле</span>
        </div>
      </div>

      <!-- BODY -->
      <div style="padding:12px;display:flex;flex-direction:column;gap:10px">

        <!-- SUMMARY -->
        <div style="font-size:13px;line-height:1.6;color:var(--text2)">${p.summary || type.desc}</div>

        <!-- TRAITS -->
        ${traitsHtml ? `<div style="display:flex;flex-wrap:wrap;gap:5px">${traitsHtml}</div>` : ''}

        <!-- TONE METER -->
        <div style="background:var(--bg3);border-radius:10px;padding:10px 12px">
          <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Стиль общения</div>
          <div style="display:flex;flex-direction:column;gap:5px">
            ${renderToneMeters(p.toneScores || {})}
          </div>
        </div>

        <!-- TACTICS -->
        <div>
          <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px">Тактики</div>
          <div style="display:flex;flex-direction:column;gap:4px">${tacticsHtml}</div>
        </div>

        <!-- TRIGGERS & OPPORTUNITIES -->
        ${triggersHtml ? `
        <div>
          <div style="font-size:10px;font-weight:700;color:var(--red);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px">⚠ Избегай</div>
          <div style="display:flex;flex-direction:column;gap:4px">${triggersHtml}</div>
        </div>` : ''}

        ${opportunitiesHtml ? `
        <div>
          <div style="font-size:10px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px">✓ Используй</div>
          <div style="display:flex;flex-direction:column;gap:4px">${opportunitiesHtml}</div>
        </div>` : ''}

        <!-- OPENER SUGGESTION -->
        ${p.opener ? `
        <div style="background:${type.bg};border:0.5px solid ${type.border};border-radius:10px;padding:11px 13px">
          <div style="font-size:10px;font-weight:700;color:${type.color};text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px">💬 Как начать следующий диалог</div>
          <div style="font-size:13px;color:var(--text);line-height:1.55;font-style:italic">"${p.opener}"</div>
          <button onclick="copyText('${p.opener.replace(/'/g,"\\'")}', this)"
            style="margin-top:8px;padding:5px 12px;border-radius:7px;border:0.5px solid ${type.border};background:transparent;color:${type.color};font-size:11px;font-weight:600;cursor:pointer;font-family:var(--font)">
            Скопировать
          </button>
        </div>` : ''}

      </div>
    </div>
  `;
}

function renderToneMeters(scores) {
  const meters = [
    { key:'formal',    label:'Формально',  color:'#8888aa' },
    { key:'warm',      label:'Тепло',      color:'#f7b731' },
    { key:'assertive', label:'Напористо',  color:'#f05050' },
    { key:'speed',     label:'Скорость',   color:'#5b8df7' },
  ];
  return meters.map(m => {
    const val = Math.round((scores[m.key] || 50));
    return `<div style="display:flex;align-items:center;gap:8px">
      <span style="font-size:11px;color:var(--text3);width:76px;flex-shrink:0">${m.label}</span>
      <div style="flex:1;height:5px;border-radius:3px;background:var(--bg4,#202030);overflow:hidden">
        <div style="height:100%;border-radius:3px;background:${m.color};width:${val}%;transition:width .6s ease"></div>
      </div>
      <span style="font-size:10px;color:var(--text3);width:28px;text-align:right">${val}%</span>
    </div>`;
  }).join('');
}

// ─── ANALYZE ─────────────────────────────────────────────────────────────────
async function analyzePsych() {
  const apiKey = typeof API_KEY !== 'undefined' ? API_KEY : localStorage.getItem('holding_api_key');
  if (!apiKey) { alert('Нет API-ключа'); return; }

  const name = (document.getElementById('psychClientName')?.value || '').trim();
  const chat = (document.getElementById('psychChat')?.value || '').trim();

  if (!name) { document.getElementById('psychClientName')?.focus(); return; }
  if (chat.length < 30) { alert('Вставь хотя бы несколько сообщений из переписки'); return; }

  // Show loading
  const btn = document.getElementById('psychAnalyzeBtn');
  if (btn) { btn.style.opacity = '0.4'; btn.style.pointerEvents = 'none'; }
  const statusEl = document.getElementById('psychStatus');
  if (statusEl) { statusEl.style.display = 'flex'; }

  const statusMessages = [
    'Читаю переписку...',
    'Определяю психотип...',
    'Строю тактики общения...',
    'Формирую профиль...'
  ];
  let si = 0;
  const statusInterval = setInterval(() => {
    const el = document.getElementById('psychStatusText');
    if (el && statusMessages[si]) { el.textContent = statusMessages[si]; si++; }
  }, 900);

  const systemPrompt = `Ты — психолог и эксперт по коммуникациям. Анализируешь переписку и определяешь психологический профиль человека для эффективных продаж и общения.

Отвечай ТОЛЬКО валидным JSON без markdown, без пояснений, только объект:
{
  "type": "dominant|analytical|expressive|amiable",
  "tone": "formal|friendly|assertive|empathic|concise",
  "confidence": 1-5,
  "summary": "2-3 предложения: кто этот человек, как думает, что важно",
  "traits": ["черта1","черта2","черта3"],
  "toneScores": {
    "formal": 0-100,
    "warm": 0-100,
    "assertive": 0-100,
    "speed": 0-100
  },
  "tactics": ["конкретный совет 1","конкретный совет 2","конкретный совет 3","конкретный совет 4"],
  "triggers": ["чего избегать 1","чего избегать 2"],
  "opportunities": ["что использовать 1","что использовать 2"],
  "opener": "Готовая фраза для начала следующего диалога с этим человеком"
}`;

  const userPrompt = `Клиент: ${name}\n\nПереписка:\n${chat}`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    clearInterval(statusInterval);

    const data = await res.json();
    const raw = data.content?.[0]?.text || '';

    let profile;
    try {
      const clean = raw.replace(/```json|```/g, '').trim();
      profile = JSON.parse(clean);
    } catch {
      throw new Error('Не удалось разобрать ответ AI: ' + raw.slice(0, 100));
    }

    profile.id = 'psych_' + Date.now();
    profile.clientName = name;
    profile.chatSnippet = chat.slice(0, 200);
    profile.createdAt = Date.now();

    PsychStore.add(profile);

    // Reset form
    if (document.getElementById('psychClientName')) document.getElementById('psychClientName').value = '';
    if (document.getElementById('psychChat')) { document.getElementById('psychChat').value = ''; document.getElementById('psychChat').style.height = 'auto'; }

    // Re-render
    renderPsychScreen();

    // Scroll to top of profiles
    setTimeout(() => {
      const profilesEl = document.getElementById('psychProfiles');
      if (profilesEl) profilesEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

  } catch (err) {
    clearInterval(statusInterval);
    alert('Ошибка анализа: ' + err.message);
    if (btn) { btn.style.opacity = ''; btn.style.pointerEvents = ''; }
    if (statusEl) { statusEl.style.display = 'none'; }
  }
}

function deletePsychProfile(id) {
  PsychStore.delete(id);
  const card = document.getElementById('pcard-' + id);
  if (card) {
    card.style.transition = 'opacity .2s, transform .2s';
    card.style.opacity = '0';
    card.style.transform = 'translateY(-8px)';
    setTimeout(() => renderPsychScreen(), 220);
  }
}

function copyText(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = '✓ Скопировано';
    setTimeout(() => { btn.textContent = orig; }, 2000);
  });
}

// ─── HOOK INTO EXISTING APP ───────────────────────────────────────────────────
// Автоматически рендерим экран когда на него переключаются
const _origSwitch = typeof switchScreen === 'function' ? switchScreen : null;
if (_origSwitch) {
  window.switchScreen = function(name) {
    _origSwitch(name);
    if (name === 'psych') renderPsychScreen();
  };
}

// Добавляем 'psych' в массив экранов если switchScreen использует фиксированный список
// (fallback — вызываем renderPsychScreen при первом показе вручную)
document.addEventListener('DOMContentLoaded', () => {
  const screen = document.getElementById('s-psych');
  if (screen) {
    // Наблюдаем за классом active
    const obs = new MutationObserver(() => {
      if (screen.classList.contains('active')) renderPsychScreen();
    });
    obs.observe(screen, { attributes: true, attributeFilter: ['class'] });
  }
});
