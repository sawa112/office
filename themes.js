// ═══════════════════════════════════════
//  themes.js — Темы оформления
// ═══════════════════════════════════════

const Themes = {
  _key: 'holding_theme',
  _current: 'dark',

  list: {
    dark: {
      label: '🌑 Тёмная', desc: 'Классика',
      vars: {
        '--bg':'#0a0a0f','--bg2':'#12121a','--bg3':'#1a1a26','--bg4':'#202030',
        '--border':'rgba(255,255,255,0.06)','--border2':'rgba(255,255,255,0.11)',
        '--text':'#eeeef5','--text2':'#8888aa','--text3':'#44445a',
        '--blue':'#5b8df7','--blue2':'#1e3570','--blue3':'#0d1f4a',
        '--green':'#2de8a0','--green2':'#0a3328',
        '--amber':'#f7b731','--amber2':'#3a2700',
        '--red':'#f05050','--red2':'#380f0f',
        '--purple':'#a07df7','--teal':'#25c7d0'
      }
    },
    light: {
      label: '☀️ Светлая', desc: 'Чистая',
      vars: {
        '--bg':'#f4f4f8','--bg2':'#ffffff','--bg3':'#ececf3','--bg4':'#e0e0eb',
        '--border':'rgba(0,0,0,0.07)','--border2':'rgba(0,0,0,0.13)',
        '--text':'#18181f','--text2':'#55556a','--text3':'#9999b0',
        '--blue':'#3b6ff0','--blue2':'#c5d5fc','--blue3':'#e8effe',
        '--green':'#18b87a','--green2':'#d0f5e8',
        '--amber':'#e09000','--amber2':'#fef3d0',
        '--red':'#e03030','--red2':'#fde8e8',
        '--purple':'#7c4df5','--teal':'#0db8c0'
      }
    },
    midnight: {
      label: '🌊 Полночь', desc: 'Синяя',
      vars: {
        '--bg':'#070d1a','--bg2':'#0d1628','--bg3':'#131f38','--bg4':'#1a2a4a',
        '--border':'rgba(100,160,255,0.08)','--border2':'rgba(100,160,255,0.15)',
        '--text':'#ddeeff','--text2':'#6688aa','--text3':'#334466',
        '--blue':'#4da6ff','--blue2':'#1a3a6a','--blue3':'#0d2040',
        '--green':'#2de8a0','--green2':'#0a2830',
        '--amber':'#f7b731','--amber2':'#2a1800',
        '--red':'#f05050','--red2':'#2a0808',
        '--purple':'#a07df7','--teal':'#25c7d0'
      }
    },
    forest: {
      label: '🌿 Лес', desc: 'Зелёная',
      vars: {
        '--bg':'#080f0a','--bg2':'#101a12','--bg3':'#172019','--bg4':'#1e2b20',
        '--border':'rgba(80,200,100,0.08)','--border2':'rgba(80,200,100,0.14)',
        '--text':'#e0f0e4','--text2':'#6a9a72','--text3':'#3a5a40',
        '--blue':'#4db8f0','--blue2':'#1a3a50','--blue3':'#0d2030',
        '--green':'#2de8a0','--green2':'#0a2818',
        '--amber':'#f7c731','--amber2':'#2a2000',
        '--red':'#f05050','--red2':'#2a0808',
        '--purple':'#a07df7','--teal':'#25d0a0'
      }
    }
  },

  apply(name) {
    const theme = this.list[name];
    if (!theme) return;
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
    localStorage.setItem(this._key, name);
    this._current = name;
    document.querySelectorAll('.theme-card').forEach(c => {
      c.classList.toggle('active', c.dataset.theme === name);
    });
  },

  init() {
    const saved = localStorage.getItem(this._key) || 'dark';
    this._current = saved;
    this.apply(saved);
  },

  render() {
    const container = document.getElementById('themesGrid');
    if (!container) return;
    container.innerHTML = Object.entries(this.list).map(([key, t]) => `
      <div class="theme-card${this._current === key ? ' active' : ''}" data-theme="${key}"
        onclick="Themes.apply('${key}')"
        style="background:var(--bg2);border:0.5px solid var(--border);border-radius:14px;padding:14px;cursor:pointer;transition:border-color .2s;text-align:center">
        <div style="font-size:24px;margin-bottom:6px">${t.label.split(' ')[0]}</div>
        <div style="font-size:13px;font-weight:600;color:var(--text)">${t.label.split(' ').slice(1).join(' ')}</div>
        <div style="font-size:11px;color:var(--text3);margin-top:2px">${t.desc}</div>
        <div style="display:flex;gap:4px;justify-content:center;margin-top:10px">
          ${['--bg','--blue','--green','--amber'].map(v=>`<div style="width:16px;height:16px;border-radius:50%;background:${t.vars[v]};border:0.5px solid rgba(128,128,128,0.2)"></div>`).join('')}
        </div>
      </div>
    `).join('');
  }
};

// ── CSS ──────────────────────────────────────────────────────────
(function() {
  if (document.getElementById('themesCSS')) return;
  const s = document.createElement('style');
  s.id = 'themesCSS';
  s.textContent = `.theme-card.active{border-color:var(--blue)!important}.theme-card:hover{border-color:var(--border2)!important}`;
  document.head.appendChild(s);
})();

// ── Экран — добавляем ПЕРЕД .nav, а не после .app ────────────────
function initThemes() {
  // 1. Экран — вставляем перед навигацией
  if (!document.getElementById('s-themes')) {
    const nav = document.querySelector('.nav');
    if (nav) {
      nav.insertAdjacentHTML('beforebegin', `
        <div class="screen" id="s-themes">
          <div style="flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding:12px">
            <div class="sec-lbl" style="padding:4px 0 12px">Оформление</div>
            <div id="themesGrid" style="display:grid;grid-template-columns:1fr 1fr;gap:8px"></div>
          </div>
        </div>
      `);
    }
  }

  // 2. Кнопка в nav — только если ещё нет
  if (!document.getElementById('nav-themes')) {
    const nav = document.querySelector('.nav');
    if (nav) {
      nav.insertAdjacentHTML('beforeend', `
        <div class="nav-item" id="nav-themes" onclick="switchScreen('themes')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2a10 10 0 0 1 0 20"/>
            <path d="M2 12h20"/>
          </svg>
          Темы
        </div>
      `);
    }
  }

  // 3. Применяем сохранённую тему
  Themes.init();

  // 4. Рендерим карточки сразу
  Themes.render();
}
