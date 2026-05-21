// ═══════════════════════════════════════════════════════
//  МАКС — AI ТРЕЙДЕР v2  |  trader.js
//  Подключить в index.html перед </body>:
//  <script src="trader.js"></script>
// ═══════════════════════════════════════════════════════

// ─── СТИЛИ ────────────────────────────────────────────
(function injectStyles() {
  const css = `
  /* Trader nav tab */
  .nav-item[data-screen="trader"] {}

  /* Trader screen */
  #s-trader { background: var(--bg); }
  .trader-tabs { display:flex; gap:6px; padding:10px 10px 6px; overflow-x:auto; scrollbar-width:none; flex-shrink:0; }
  .trader-tabs::-webkit-scrollbar { display:none; }
  .trader-tab { flex-shrink:0; padding:7px 14px; border-radius:20px; font-size:12px; font-weight:700;
    border:1px solid var(--border2); background:var(--bg2); color:var(--text3); cursor:pointer; transition:all .15s; }
  .trader-tab.active { background:var(--amber2); border-color:rgba(247,183,49,.35); color:var(--amber); }
  .trader-tab:active { transform:scale(.95); }

  /* Market strip */
  .market-strip { padding:0 10px 6px; display:flex; gap:8px; overflow-x:auto; scrollbar-width:none; flex-shrink:0; }
  .market-strip::-webkit-scrollbar { display:none; }
  .mkt-card { flex-shrink:0; background:var(--bg2); border:1px solid var(--border); border-radius:12px;
    padding:10px 14px; min-width:110px; cursor:pointer; transition:all .15s; }
  .mkt-card:active { transform:scale(.96); }
  .mkt-pair { font-size:11px; font-weight:700; color:var(--text2); }
  .mkt-price { font-size:16px; font-weight:900; color:var(--text); margin:2px 0; letter-spacing:-.02em; }
  .mkt-change { font-size:11px; font-weight:700; }
  .mkt-change.up { color:var(--green); }
  .mkt-change.dn { color:var(--red); }
  .mkt-funding { font-size:10px; color:var(--text3); margin-top:2px; }

  /* Fear & Greed */
  .fng-bar { margin:0 10px 8px; background:var(--bg2); border:1px solid var(--border); border-radius:14px; padding:12px 14px;
    display:flex; align-items:center; gap:12px; flex-shrink:0; }
  .fng-gauge { width:52px; height:52px; flex-shrink:0; }
  .fng-info { flex:1; }
  .fng-label { font-size:11px; color:var(--text3); }
  .fng-val { font-size:20px; font-weight:900; letter-spacing:-.03em; margin:1px 0; }
  .fng-status { font-size:11px; font-weight:700; }
  .fng-updated { font-size:10px; color:var(--text3); margin-top:2px; }

  /* Stats grid */
  .stats-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; padding:0 10px 8px; }
  .stat-card { background:var(--bg2); border:1px solid var(--border); border-radius:14px; padding:12px; text-align:center; }
  .stat-lbl { font-size:9px; font-weight:700; color:var(--text3); text-transform:uppercase; letter-spacing:.1em; }
  .stat-val { font-size:22px; font-weight:900; margin:4px 0 2px; letter-spacing:-.03em; }
  .stat-sub { font-size:10px; color:var(--text3); }

  /* Journal */
  .journal-list { padding:0 10px 8px; display:flex; flex-direction:column; gap:8px; }
  .jrn-card { background:var(--bg2); border:1px solid var(--border); border-radius:14px; padding:12px 14px;
    transition:border-color .2s; }
  .jrn-card.open-trade { border-color:rgba(247,183,49,.3); }
  .jrn-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; }
  .jrn-pair { font-size:14px; font-weight:900; letter-spacing:-.02em; }
  .jrn-dir { font-size:11px; font-weight:700; padding:2px 8px; border-radius:5px; }
  .jrn-dir.long { background:var(--green2); color:var(--green); }
  .jrn-dir.short { background:var(--red2); color:var(--red); }
  .jrn-pnl { font-size:14px; font-weight:900; }
  .jrn-levels { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:8px; }
  .jrn-lvl { font-size:11px; padding:2px 8px; border-radius:5px; background:var(--bg3); color:var(--text2); }
  .jrn-close-row { display:flex; gap:6px; margin-top:8px; align-items:center; }
  .jrn-close-inp { flex:1; background:var(--bg3); border:1px solid var(--border2); border-radius:8px;
    padding:7px 10px; font-size:13px; font-family:var(--font); color:var(--text); outline:none; }
  .jrn-close-inp:focus { border-color:var(--amber); }
  .jrn-close-btn { padding:7px 14px; border-radius:8px; border:none; font-size:12px; font-weight:700;
    cursor:pointer; font-family:var(--font); }
  .jrn-close-win { background:var(--green2); color:var(--green); border:1px solid rgba(45,232,160,.3); }
  .jrn-close-loss { background:var(--red2); color:var(--red); border:1px solid rgba(240,80,80,.3); }
  .jrn-ts { font-size:10px; color:var(--text3); margin-top:4px; }

  /* Calculator */
  .calc-wrap { padding:0 10px 8px; display:flex; flex-direction:column; gap:8px; }
  .calc-card { background:var(--bg2); border:1px solid var(--border); border-radius:14px; padding:14px; }
  .calc-title { font-size:12px; font-weight:700; color:var(--text); margin-bottom:12px; display:flex; align-items:center; gap:6px; }
  .calc-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
  .calc-lbl { font-size:12px; color:var(--text2); }
  .calc-inp { background:var(--bg3); border:1px solid var(--border2); border-radius:8px; padding:7px 10px;
    font-size:14px; font-family:var(--font); color:var(--text); outline:none; width:110px; text-align:right;
    transition:border-color .15s; }
  .calc-inp:focus { border-color:var(--amber); }
  .calc-result-row { display:flex; align-items:center; justify-content:space-between;
    background:var(--bg3); border-radius:10px; padding:10px 14px; margin-top:4px; }
  .calc-result-lbl { font-size:12px; color:var(--text2); font-weight:600; }
  .calc-result-val { font-size:18px; font-weight:900; color:var(--amber); }

  /* Screener */
  .screener-wrap { padding:0 10px 8px; display:flex; flex-direction:column; gap:6px; }
  .screener-item { background:var(--bg2); border:1px solid var(--border); border-radius:12px; padding:12px 14px;
    display:flex; align-items:center; gap:12px; cursor:pointer; transition:all .15s; }
  .screener-item:active { background:var(--bg3); }
  .scr-pair { font-size:14px; font-weight:900; flex:1; }
  .scr-price { font-size:14px; font-weight:700; color:var(--text); }
  .scr-chg { font-size:12px; font-weight:700; }
  .scr-signal { font-size:10px; font-weight:700; padding:3px 8px; border-radius:5px; }
  .scr-signal.bull { background:var(--green2); color:var(--green); }
  .scr-signal.bear { background:var(--red2); color:var(--red); }
  .scr-signal.neut { background:var(--bg3); color:var(--text3); }

  /* Trade capture bar */
  #tradeCaptureBar { position:fixed; bottom:calc(var(--nav-h) + 8px); left:10px; right:10px;
    background:var(--bg2); border-radius:16px; padding:12px 14px; z-index:150;
    box-shadow:0 4px 24px rgba(0,0,0,.5); animation:slideup .25s cubic-bezier(.32,1,.32,1); }

  /* Alert badge on nav */
  .trader-alert-dot { position:absolute; top:4px; right:calc(50% - 18px); width:7px; height:7px;
    border-radius:50%; background:var(--amber); box-shadow:0 0 6px var(--amber);
    animation:pulse 2s infinite; }
  `;
  const st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);
})();

// ─── INJECT TRADER SCREEN & NAV TAB ───────────────────
(function injectDOM() {
  // Add screen before closing </div> of app
  const app = document.getElementById('app');
  if (!app) return;

  // Trader screen
  const screen = document.createElement('div');
  screen.className = 'screen';
  screen.id = 's-trader';
  screen.innerHTML = `
    <!-- Trader tab bar -->
    <div class="trader-tabs">
      <div class="trader-tab active" onclick="traderTab(this,'market')">📡 Рынок</div>
      <div class="trader-tab" onclick="traderTab(this,'journal')">📒 Журнал</div>
      <div class="trader-tab" onclick="traderTab(this,'stats')">📊 Статистика</div>
      <div class="trader-tab" onclick="traderTab(this,'calc')">🧮 Калькулятор</div>
      <div class="trader-tab" onclick="traderTab(this,'screener')">🔭 Скринер</div>
    </div>

    <!-- MARKET TAB -->
    <div id="trader-market" class="scroll" style="display:flex;flex-direction:column">
      <div class="fng-bar" id="fngBar">
        <svg class="fng-gauge" id="fngGauge" viewBox="0 0 52 52"></svg>
        <div class="fng-info">
          <div class="fng-label">Fear & Greed Index</div>
          <div class="fng-val" id="fngVal">—</div>
          <div class="fng-status" id="fngStatus">Загрузка...</div>
          <div class="fng-updated" id="fngUpdated"></div>
        </div>
        <button onclick="TRADER.loadMarketData()" style="padding:6px 10px;border-radius:8px;border:1px solid var(--border2);background:var(--bg3);color:var(--text2);font-size:11px;cursor:pointer;font-family:var(--font)">↺</button>
      </div>
      <div class="market-strip" id="marketStrip">
        <div style="color:var(--text3);font-size:12px;padding:8px">Загружаю цены...</div>
      </div>
      <div class="sec-lbl">Быстрый анализ</div>
      <div style="padding:0 10px 6px;display:grid;grid-template-columns:1fr 1fr;gap:8px" id="traderQuickGrid">
        <div class="action-btn" onclick="traderAsk('Проанализируй BTC/USDT на 4H. Дай сигнал с точками входа, стопом и тейком.')">
          <div class="action-icon amber">₿</div>
          <div><div class="action-text">Анализ BTC</div><div class="action-sub">Сигнал 4H</div></div>
        </div>
        <div class="action-btn" onclick="traderAsk('Проанализируй ETH/USDT на 4H. Уровни, тренд, точка входа.')">
          <div class="action-icon" style="background:rgba(100,80,200,.15)">Ξ</div>
          <div><div class="action-text">Анализ ETH</div><div class="action-sub">Сигнал 4H</div></div>
        </div>
        <div class="action-btn" onclick="traderAsk('Какова общая ситуация на крипторынке? Доминация BTC, настроение, риски.')">
          <div class="action-icon" style="background:rgba(37,199,208,.1)">🌊</div>
          <div><div class="action-text">Обзор рынка</div><div class="action-sub">Настроение</div></div>
        </div>
        <div class="action-btn" onclick="traderAsk('Назови топ-3 альткоина с лучшим потенциалом на этой неделе и почему.')">
          <div class="action-icon" style="background:rgba(160,125,247,.1)">🎯</div>
          <div><div class="action-text">Топ альты</div><div class="action-sub">Эта неделя</div></div>
        </div>
      </div>
      <div class="sec-lbl" id="traderScreenerLbl" style="display:none">Скринер (авто)</div>
      <div id="traderInlineScreener"></div>
      <div style="height:12px"></div>
    </div>

    <!-- JOURNAL TAB -->
    <div id="trader-journal" class="scroll" style="display:none;flex-direction:column">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 10px 6px">
        <div style="font-size:12px;font-weight:700;color:var(--text)">Открытые позиции</div>
        <div id="openCount" style="font-size:11px;color:var(--text3)">0</div>
      </div>
      <div class="journal-list" id="journalOpen"></div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 10px 6px">
        <div style="font-size:12px;font-weight:700;color:var(--text)">История сделок</div>
        <button onclick="TRADER.clearJournal()" style="font-size:10px;color:var(--text3);background:none;border:none;cursor:pointer;font-family:var(--font)">Очистить</button>
      </div>
      <div class="journal-list" id="journalClosed"></div>
      <div style="height:12px"></div>
    </div>

    <!-- STATS TAB -->
    <div id="trader-stats" class="scroll" style="display:none;flex-direction:column">
      <div style="padding:10px 10px 4px">
        <div class="stats-grid" id="statsGrid"></div>
      </div>
      <div class="sec-lbl">Разбор последних убытков</div>
      <div id="statsPostmortem" style="padding:0 10px 8px"></div>
      <div style="height:12px"></div>
    </div>

    <!-- CALC TAB -->
    <div id="trader-calc" class="scroll" style="display:none;flex-direction:column">
      <div class="calc-wrap">
        <div class="calc-card">
          <div class="calc-title">🧮 Размер позиции</div>
          <div class="calc-row">
            <span class="calc-lbl">Депозит (USDT)</span>
            <input class="calc-inp" id="calcDeposit" type="number" value="1000" oninput="TRADER.recalcPosition()">
          </div>
          <div class="calc-row">
            <span class="calc-lbl">Риск на сделку (%)</span>
            <input class="calc-inp" id="calcRisk" type="number" value="2" step="0.5" oninput="TRADER.recalcPosition()">
          </div>
          <div class="calc-row">
            <span class="calc-lbl">Цена входа</span>
            <input class="calc-inp" id="calcEntry" type="number" value="" placeholder="43500" oninput="TRADER.recalcPosition()">
          </div>
          <div class="calc-row">
            <span class="calc-lbl">Стоп-лосс</span>
            <input class="calc-inp" id="calcSL" type="number" value="" placeholder="42000" oninput="TRADER.recalcPosition()">
          </div>
          <div class="calc-row">
            <span class="calc-lbl">Плечо (x)</span>
            <input class="calc-inp" id="calcLev" type="number" value="5" min="1" max="20" oninput="TRADER.recalcPosition()">
          </div>
          <div class="calc-result-row">
            <span class="calc-result-lbl">Объём позиции</span>
            <span class="calc-result-val" id="calcVolume">—</span>
          </div>
          <div class="calc-result-row" style="margin-top:6px">
            <span class="calc-result-lbl">Риск в USDT</span>
            <span class="calc-result-val" id="calcRiskUSDT" style="color:var(--red)">—</span>
          </div>
          <div class="calc-result-row" style="margin-top:6px">
            <span class="calc-result-lbl">Маржа (залог)</span>
            <span class="calc-result-val" id="calcMargin" style="color:var(--blue)">—</span>
          </div>
        </div>
        <div class="calc-card">
          <div class="calc-title">📐 Тейк-профит по R:R</div>
          <div class="calc-row">
            <span class="calc-lbl">R:R цель</span>
            <input class="calc-inp" id="calcRR" type="number" value="2" step="0.5" oninput="TRADER.recalcTP()">
          </div>
          <div class="calc-result-row">
            <span class="calc-result-lbl">TP1 (1:2)</span>
            <span class="calc-result-val" id="calcTP1" style="color:var(--green)">—</span>
          </div>
          <div class="calc-result-row" style="margin-top:6px">
            <span class="calc-result-lbl">TP2 (1:3)</span>
            <span class="calc-result-val" id="calcTP2" style="color:var(--green)">—</span>
          </div>
        </div>
        <div class="calc-card">
          <div class="calc-title">💡 Спросить Макса про расчёт</div>
          <button onclick="TRADER.askCalcAdvice()" style="width:100%;padding:12px;border-radius:10px;border:1px solid rgba(247,183,49,.3);background:var(--amber2);color:var(--amber);font-size:13px;font-weight:700;cursor:pointer;font-family:var(--font)">
            📈 Получить рекомендацию по позиции
          </button>
        </div>
      </div>
    </div>

    <!-- SCREENER TAB -->
    <div id="trader-screener" class="scroll" style="display:none;flex-direction:column">
      <div style="padding:10px 10px 6px;display:flex;align-items:center;justify-content:space-between">
        <div style="font-size:12px;font-weight:700;color:var(--text)">Топ пары по объёму</div>
        <button onclick="TRADER.runScreener()" style="padding:6px 12px;border-radius:8px;border:1px solid var(--border2);background:var(--bg2);color:var(--text2);font-size:11px;font-weight:700;cursor:pointer;font-family:var(--font)">↺ Обновить</button>
      </div>
      <div class="screener-wrap" id="screenerList">
        <div style="color:var(--text3);font-size:12px;padding:8px">Нажмите «Обновить» для загрузки</div>
      </div>
      <div class="sec-lbl" style="margin-top:4px">Автоскринер</div>
      <div style="padding:0 10px 8px">
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:14px">
          <div style="font-size:12px;color:var(--text2);margin-bottom:10px">Автоматический скринер каждые N часов</div>
          <div style="display:flex;gap:6px;align-items:center;margin-bottom:10px">
            <span style="font-size:12px;color:var(--text2)">Интервал (ч):</span>
            <input id="screenerInterval" type="number" value="4" min="1" max="24"
              style="width:60px;background:var(--bg3);border:1px solid var(--border2);border-radius:6px;padding:5px 8px;font-size:13px;font-family:var(--font);color:var(--text);outline:none;text-align:center">
          </div>
          <div style="display:flex;gap:8px">
            <button onclick="TRADER.startAutoScreener()" style="flex:1;padding:10px;border-radius:10px;border:1px solid rgba(45,232,160,.3);background:var(--green2);color:var(--green);font-size:12px;font-weight:700;cursor:pointer;font-family:var(--font)">▶ Запустить</button>
            <button onclick="TRADER.stopAutoScreener()" style="flex:1;padding:10px;border-radius:10px;border:1px solid var(--border2);background:var(--bg3);color:var(--text2);font-size:12px;font-weight:700;cursor:pointer;font-family:var(--font)">■ Стоп</button>
          </div>
          <div id="screenerStatus" style="font-size:11px;color:var(--text3);margin-top:8px;text-align:center"></div>
        </div>
      </div>
      <div style="height:12px"></div>
    </div>
  `;

  // Insert before nav
  const nav = app.querySelector('.nav');
  if (nav) nav.before(screen);
  else app.appendChild(screen);

  // Add nav tab
  const navEl = app.querySelector('.nav');
  if (navEl) {
    const tab = document.createElement('div');
    tab.className = 'nav-item';
    tab.id = 'nav-trader';
    tab.setAttribute('onclick', "switchScreen('trader')");
    tab.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
        <polyline points="16 7 22 7 22 13"/>
      </svg>
      Трейдер`;
    navEl.appendChild(tab);
  }
})();

// ─── TRADER OBJECT ─────────────────────────────────────
const TRADER = {

  // Состояние
  marketData: {},
  fngData: null,
  screenerTimer: null,
  tradeJournal: []  /* loaded via Storage.get below */,

  // ── СОХРАНЕНИЕ ──
  saveJournal() {
    Storage.set('trader_journal', JSON.stringify(this.tradeJournal.slice(-300)));
  },

  clearJournal() {
    if (!confirm('Очистить историю закрытых сделок?')) return;
    this.tradeJournal = this.tradeJournal.filter(t => t.status === 'open');
    this.saveJournal();
    this.renderJournal();
  },

  // ── ЗАГРУЗКА РЫНОЧНЫХ ДАННЫХ ──
  async loadMarketData() {
    const pairs = ['BTCUSDT','ETHUSDT','SOLUSDT','BNBUSDT','XRPUSDT'];
    document.getElementById('marketStrip').innerHTML = '<div style="color:var(--text3);font-size:12px;padding:8px">Загружаю...</div>';

    try {
      // Bybit public ticker API (не требует ключей)
      const res = await fetch('https://api.bybit.com/v5/market/tickers?category=linear');
      const data = await res.json();

      if (data.retCode === 0 && data.result?.list) {
        const tickers = data.result.list.filter(t => pairs.includes(t.symbol));
        this.marketData = {};
        tickers.forEach(t => { this.marketData[t.symbol] = t; });
        this.renderMarketStrip(tickers);
        this.appendPriceToNextMaxQuery();
      }
    } catch(e) {
      document.getElementById('marketStrip').innerHTML = '<div style="color:var(--red);font-size:11px;padding:8px">Ошибка загрузки. Bybit API недоступен.</div>';
    }

    // Fear & Greed
    this.loadFearGreed();
  },

  renderMarketStrip(tickers) {
    const strip = document.getElementById('marketStrip');
    if (!strip) return;
    strip.innerHTML = tickers.map(t => {
      const chg = parseFloat(t.price24hPcnt) * 100;
      const up = chg >= 0;
      const funding = t.fundingRate ? (parseFloat(t.fundingRate) * 100).toFixed(4) : null;
      const pair = t.symbol.replace('USDT','/USDT');
      return `<div class="mkt-card" onclick="traderAsk('Проанализируй ${pair} и дай торговый сигнал с уровнями входа, стопом и тейком. Текущая цена: ${parseFloat(t.lastPrice).toFixed(2)}')">
        <div class="mkt-pair">${pair}</div>
        <div class="mkt-price">$${parseFloat(t.lastPrice).toLocaleString('en',{maximumFractionDigits:2})}</div>
        <div class="mkt-change ${up?'up':'dn'}">${up?'▲':'▼'} ${Math.abs(chg).toFixed(2)}%</div>
        ${funding ? `<div class="mkt-funding">Fund: ${parseFloat(t.fundingRate)*100 > 0 ? '+' : ''}${funding}%</div>` : ''}
      </div>`;
    }).join('');
  },

  // Добавляем цены в следующий запрос к Максу
  appendPriceToNextMaxQuery() {
    this._priceContext = null;
    const lines = Object.entries(this.marketData).map(([sym, t]) => {
      const chg = (parseFloat(t.price24hPcnt)*100).toFixed(2);
      const fund = t.fundingRate ? ` | Funding: ${(parseFloat(t.fundingRate)*100).toFixed(4)}%` : '';
      return `${sym}: $${parseFloat(t.lastPrice).toFixed(2)} (${chg > 0 ? '+' : ''}${chg}%${fund})`;
    });
    if (lines.length) {
      this._priceContext = `\n\n📡 АКТУАЛЬНЫЕ ЦЕНЫ (Bybit, только что):\n${lines.join('\n')}`;
    }
  },

  // ── FEAR & GREED ──
  async loadFearGreed() {
    try {
      const res = await fetch('https://api.alternative.me/fng/?limit=1&format=json');
      const data = await res.json();
      const d = data.data?.[0];
      if (!d) return;
      this.fngData = d;
      const val = parseInt(d.value);
      const valEl = document.getElementById('fngVal');
      const statusEl = document.getElementById('fngStatus');
      const updEl = document.getElementById('fngUpdated');
      if (valEl) {
        valEl.textContent = val;
        valEl.style.color = val <= 25 ? 'var(--red)' : val <= 45 ? 'var(--amber)' : val <= 55 ? 'var(--text)' : val <= 75 ? 'var(--green)' : '#00e5a0';
      }
      if (statusEl) {
        statusEl.textContent = d.value_classification;
        statusEl.style.color = val <= 45 ? 'var(--red)' : val <= 55 ? 'var(--amber)' : 'var(--green)';
      }
      if (updEl) updEl.textContent = `Обновлено: ${new Date(d.timestamp*1000).toLocaleTimeString('ru',{hour:'2-digit',minute:'2-digit'})}`;

      // Draw SVG gauge
      const svg = document.getElementById('fngGauge');
      if (svg) {
        const pct = val / 100;
        const r = 20, cx = 26, cy = 28;
        const circumference = Math.PI * r;
        const offset = circumference * (1 - pct);
        const col = val <= 25 ? '#f05050' : val <= 45 ? '#f7b731' : val <= 55 ? '#aaa' : '#2de8a0';
        svg.innerHTML = `
          <path d="M6,28 A20,20 0 0,1 46,28" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="5" stroke-linecap="round"/>
          <path d="M6,28 A20,20 0 0,1 46,28" fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round"
            stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" style="transition:stroke-dashoffset .8s ease"/>
          <text x="26" y="22" text-anchor="middle" fill="${col}" font-size="10" font-weight="900" font-family="sans-serif">${val}</text>`;
      }
    } catch(e) {}
  },

  // ── ЖУРНАЛ СДЕЛОК ──
  addTrade(trade) {
    trade.id = Date.now();
    trade.ts = new Date().toISOString();
    trade.status = 'open';
    this.tradeJournal.push(trade);
    this.saveJournal();
    this.renderJournal();
    this.renderStats();
  },

  closeTrade(id, result, notes = '') {
    const trade = this.tradeJournal.find(t => t.id === id);
    if (!trade) return;
    trade.result = parseFloat(result);
    trade.closeTs = new Date().toISOString();
    trade.notes = notes || '';
    trade.status = 'closed';
    this.saveJournal();
    this.renderJournal();
    this.renderStats();

    if (typeof addLog === 'function') {
      addLog(result > 0 ? 'ok' : 'err',
        `${result > 0 ? '✅' : '❌'} Сделка закрыта: ${trade.pair} ${result > 0 ? '+' : ''}${result}%`, trade.notes);
    }

    // Автоматический разбор убыточной сделки
    if (parseFloat(result) < 0) {
      setTimeout(() => this.autoPostmortem(trade), 800);
    }
  },

  // ── РЕНДЕР ЖУРНАЛА ──
  renderJournal() {
    const openTrades = this.tradeJournal.filter(t => t.status === 'open');
    const closedTrades = this.tradeJournal.filter(t => t.status === 'closed').reverse().slice(0, 30);

    const openEl = document.getElementById('journalOpen');
    const closedEl = document.getElementById('journalClosed');
    const countEl = document.getElementById('openCount');
    if (countEl) countEl.textContent = `${openTrades.length} открыто`;

    if (openEl) {
      if (!openTrades.length) {
        openEl.innerHTML = '<div style="color:var(--text3);font-size:12px;padding:8px 0">Нет открытых позиций</div>';
      } else {
        openEl.innerHTML = openTrades.map(t => this.renderTradeCard(t, true)).join('');
      }
    }

    if (closedEl) {
      if (!closedTrades.length) {
        closedEl.innerHTML = '<div style="color:var(--text3);font-size:12px;padding:8px 0">История пуста</div>';
      } else {
        closedEl.innerHTML = closedTrades.map(t => this.renderTradeCard(t, false)).join('');
      }
    }
  },

  renderTradeCard(t, isOpen) {
    const isLong = t.direction === 'LONG';
    const pnlColor = t.result > 0 ? 'var(--green)' : t.result < 0 ? 'var(--red)' : 'var(--amber)';
    const pnlText = t.result !== undefined
      ? `${t.result > 0 ? '+' : ''}${t.result}%`
      : '⏳ открыта';

    const closeForm = isOpen ? `
      <div class="jrn-close-row">
        <input class="jrn-close-inp" type="number" placeholder="PnL % (например: +3.5 или -1.2)"
          id="close-inp-${t.id}" step="0.1">
        <button class="jrn-close-btn jrn-close-win" onclick="TRADER.closeFromUI(${t.id}, true)">✅ WIN</button>
        <button class="jrn-close-btn jrn-close-loss" onclick="TRADER.closeFromUI(${t.id}, false)">❌ LOSS</button>
      </div>` : '';

    const postmortemBtn = !isOpen && t.result < 0
      ? `<button onclick="TRADER.autoPostmortem(${JSON.stringify(t).replace(/"/g,'&quot;')})"
          style="margin-top:8px;padding:6px 12px;border-radius:8px;border:1px solid rgba(240,80,80,.3);background:var(--red2);color:var(--red);font-size:11px;font-weight:700;cursor:pointer;font-family:var(--font)">
          🔍 Разбор ошибки
        </button>` : '';

    return `<div class="jrn-card ${isOpen ? 'open-trade' : ''}">
      <div class="jrn-top">
        <span class="jrn-pair">${t.pair || '?'}</span>
        <span class="jrn-dir ${isLong ? 'long' : 'short'}">${isLong ? '▲ LONG' : '▼ SHORT'}</span>
        <span class="jrn-pnl" style="color:${pnlColor}">${pnlText}</span>
      </div>
      <div class="jrn-levels">
        ${t.entry ? `<span class="jrn-lvl">Вход: ${t.entry}</span>` : ''}
        ${t.sl ? `<span class="jrn-lvl" style="color:var(--red)">SL: ${t.sl}</span>` : ''}
        ${t.tp1 ? `<span class="jrn-lvl" style="color:var(--green)">TP: ${t.tp1}</span>` : ''}
        ${t.rr ? `<span class="jrn-lvl" style="color:var(--blue)">R:R ${t.rr}</span>` : ''}
      </div>
      ${t.notes ? `<div style="font-size:11px;color:var(--text3);margin-bottom:4px">💬 ${t.notes}</div>` : ''}
      ${closeForm}
      ${postmortemBtn}
      <div class="jrn-ts">${new Date(t.ts).toLocaleString('ru')}</div>
    </div>`;
  },

  closeFromUI(id, isWin) {
    const inp = document.getElementById('close-inp-' + id);
    let val = parseFloat(inp?.value || '0');
    if (!val) {
      // если не ввели — показываем подсказку
      if (inp) { inp.style.borderColor = 'var(--amber)'; inp.focus(); return; }
    }
    if (isWin && val < 0) val = Math.abs(val);
    if (!isWin && val > 0) val = -val;
    this.closeTrade(id, val);
  },

  // ── РАЗБОР ОШИБКИ ──
  async autoPostmortem(trade) {
    const emp = (typeof employees !== 'undefined') ? employees.find(e => e.id === 9) : null;
    if (!emp) return;

    if (typeof addSys === 'function') addSys('🔍 Макс анализирует убыточную сделку...');
    if (typeof switchScreen === 'function') switchScreen('tasks');

    const prompt = `Проведи детальный разбор моей убыточной сделки:
Пара: ${trade.pair}
Направление: ${trade.direction}
Вход: ${trade.entry}
Стоп-лосс: ${trade.sl}
Тейк-профит: ${trade.tp1}
Результат: ${trade.result}%
${trade.notes ? `Заметки: ${trade.notes}` : ''}

Дай честный анализ:
1. Что могло пойти не так?
2. Были ли ошибки в риск-менеджменте?
3. Что делать иначе в следующий раз?
<result>РАЗБОР ОШИБКИ И ВЫВОДЫ</result>`;

    if (typeof askEmp === 'function') {
      await askEmp(emp, false, prompt);
    }
  },

  // ── СТАТИСТИКА ──
  analyzePerformance() {
    const closed = this.tradeJournal.filter(t => t.status === 'closed' && t.result !== undefined);
    if (closed.length < 1) return null;
    const wins = closed.filter(t => t.result > 0);
    const losses = closed.filter(t => t.result < 0);
    const winRate = closed.length ? (wins.length / closed.length * 100) : 0;
    const avgWin = wins.length ? wins.reduce((s,t) => s+t.result, 0) / wins.length : 0;
    const avgLoss = losses.length ? Math.abs(losses.reduce((s,t) => s+t.result, 0) / losses.length) : 0;
    const pf = avgLoss > 0 ? (avgWin * wins.length) / (avgLoss * losses.length) : null;
    const totalPnl = closed.reduce((s,t) => s+t.result, 0);
    return { winRate, avgWin, avgLoss, pf, totalPnl, total: closed.length, wins: wins.length, losses: losses.length };
  },

  renderStats() {
    const s = this.analyzePerformance();
    const grid = document.getElementById('statsGrid');
    const pm = document.getElementById('statsPostmortem');
    if (!grid) return;

    if (!s) {
      grid.innerHTML = '<div style="grid-column:1/-1;color:var(--text3);font-size:12px;padding:8px">Закройте хотя бы одну сделку для статистики</div>';
      return;
    }

    const wrColor = s.winRate >= 55 ? 'var(--green)' : s.winRate >= 40 ? 'var(--amber)' : 'var(--red)';
    const pfColor = s.pf >= 1.5 ? 'var(--green)' : s.pf >= 1 ? 'var(--amber)' : 'var(--red)';
    const pnlColor = s.totalPnl >= 0 ? 'var(--green)' : 'var(--red)';

    grid.innerHTML = `
      <div class="stat-card">
        <div class="stat-lbl">Win Rate</div>
        <div class="stat-val" style="color:${wrColor}">${s.winRate.toFixed(1)}%</div>
        <div class="stat-sub">${s.wins}W / ${s.losses}L</div>
      </div>
      <div class="stat-card">
        <div class="stat-lbl">Profit Factor</div>
        <div class="stat-val" style="color:${pfColor}">${s.pf ? s.pf.toFixed(2) : '—'}</div>
        <div class="stat-sub">Win/Loss ratio</div>
      </div>
      <div class="stat-card">
        <div class="stat-lbl">Avg Win</div>
        <div class="stat-val" style="color:var(--green)">+${s.avgWin.toFixed(2)}%</div>
        <div class="stat-sub">на сделку</div>
      </div>
      <div class="stat-card">
        <div class="stat-lbl">Total PnL</div>
        <div class="stat-val" style="color:${pnlColor}">${s.totalPnl >= 0 ? '+' : ''}${s.totalPnl.toFixed(2)}%</div>
        <div class="stat-sub">${s.total} сделок</div>
      </div>`;

    // Постмортем убыточных
    if (pm) {
      const losses = this.tradeJournal.filter(t => t.status === 'closed' && t.result < 0).slice(-3).reverse();
      if (losses.length) {
        pm.innerHTML = losses.map(t => `
          <div style="background:var(--red2);border:1px solid rgba(240,80,80,.2);border-radius:12px;padding:12px 14px;margin-bottom:8px">
            <div style="display:flex;justify-content:space-between;margin-bottom:4px">
              <span style="font-weight:700">${t.pair} ${t.direction}</span>
              <span style="color:var(--red);font-weight:700">${t.result}%</span>
            </div>
            <div style="font-size:11px;color:var(--text3)">Вход: ${t.entry || '?'} | SL: ${t.sl || '?'}</div>
            <button onclick="TRADER.autoPostmortem(${JSON.stringify(t).replace(/"/g,'&quot;')})"
              style="margin-top:8px;padding:6px 12px;border-radius:7px;border:1px solid rgba(240,80,80,.3);background:transparent;color:var(--red);font-size:11px;font-weight:700;cursor:pointer;font-family:var(--font)">
              🔍 Разбор
            </button>
          </div>`).join('');
      } else {
        pm.innerHTML = '<div style="color:var(--text3);font-size:12px;padding:8px 0">Убыточных сделок нет — отлично!</div>';
      }
    }
  },

  // ── КАЛЬКУЛЯТОР ПОЗИЦИИ ──
  recalcPosition() {
    const deposit = parseFloat(document.getElementById('calcDeposit')?.value) || 0;
    const riskPct = parseFloat(document.getElementById('calcRisk')?.value) || 2;
    const entry = parseFloat(document.getElementById('calcEntry')?.value) || 0;
    const sl = parseFloat(document.getElementById('calcSL')?.value) || 0;
    const lev = parseFloat(document.getElementById('calcLev')?.value) || 5;

    const riskUSDT = deposit * (riskPct / 100);
    document.getElementById('calcRiskUSDT').textContent = riskUSDT ? `$${riskUSDT.toFixed(2)}` : '—';

    if (entry && sl && Math.abs(entry - sl) > 0) {
      const slPct = Math.abs(entry - sl) / entry;
      const positionSize = riskUSDT / slPct;
      const margin = positionSize / lev;
      document.getElementById('calcVolume').textContent = `$${positionSize.toFixed(2)}`;
      document.getElementById('calcMargin').textContent = `$${margin.toFixed(2)}`;
    } else {
      document.getElementById('calcVolume').textContent = '—';
      document.getElementById('calcMargin').textContent = '—';
    }
    this.recalcTP();
  },

  recalcTP() {
    const entry = parseFloat(document.getElementById('calcEntry')?.value) || 0;
    const sl = parseFloat(document.getElementById('calcSL')?.value) || 0;
    const rrTarget = parseFloat(document.getElementById('calcRR')?.value) || 2;
    if (!entry || !sl) { document.getElementById('calcTP1').textContent='—'; document.getElementById('calcTP2').textContent='—'; return; }
    const isLong = entry > sl;
    const risk = Math.abs(entry - sl);
    const tp1 = isLong ? entry + risk * rrTarget : entry - risk * rrTarget;
    const tp2 = isLong ? entry + risk * 3 : entry - risk * 3;
    document.getElementById('calcTP1').textContent = tp1.toFixed(2);
    document.getElementById('calcTP2').textContent = tp2.toFixed(2);
  },

  askCalcAdvice() {
    const deposit = document.getElementById('calcDeposit')?.value || '?';
    const riskPct = document.getElementById('calcRisk')?.value || '2';
    const entry = document.getElementById('calcEntry')?.value || '?';
    const sl = document.getElementById('calcSL')?.value || '?';
    const lev = document.getElementById('calcLev')?.value || '5';
    if (typeof traderAsk === 'function') {
      traderAsk(`Помоги с расчётом позиции: депозит ${deposit} USDT, риск ${riskPct}%, вход ${entry}, стоп ${sl}, плечо x${lev}. Оцени параметры и дай рекомендации.`);
    }
  },

  // ── СКРИНЕР ──
  async runScreener() {
    const el = document.getElementById('screenerList');
    if (el) el.innerHTML = '<div style="color:var(--text3);font-size:12px;padding:8px">Загружаю данные...</div>';

    try {
      const res = await fetch('https://api.bybit.com/v5/market/tickers?category=linear');
      const data = await res.json();
      if (data.retCode !== 0) throw new Error('API error');

      const tickers = data.result.list
        .filter(t => t.symbol.endsWith('USDT') && parseFloat(t.volume24h) > 10000000)
        .sort((a,b) => Math.abs(parseFloat(b.price24hPcnt)) - Math.abs(parseFloat(a.price24hPcnt)))
        .slice(0, 20);

      if (el) {
        el.innerHTML = tickers.map(t => {
          const chg = parseFloat(t.price24hPcnt) * 100;
          const up = chg >= 0;
          const signal = Math.abs(chg) > 5 ? (up ? 'bull' : 'bear') : 'neut';
          const signalText = signal === 'bull' ? '▲ Рост' : signal === 'bear' ? '▼ Падение' : '— Нейтраль';
          return `<div class="screener-item" onclick="traderAsk('Анализ ${t.symbol.replace('USDT','/USDT')}: цена $${parseFloat(t.lastPrice).toFixed(4)}, изменение ${chg.toFixed(2)}% за 24ч. Дай сигнал.')">
            <span class="scr-pair">${t.symbol.replace('USDT','')}</span>
            <span class="scr-price">$${parseFloat(t.lastPrice).toLocaleString('en',{maximumFractionDigits:4})}</span>
            <span class="scr-chg" style="color:${up?'var(--green)':'var(--red)'}">${up?'+':''}${chg.toFixed(2)}%</span>
            <span class="scr-signal ${signal}">${signalText}</span>
          </div>`;
        }).join('');
      }
    } catch(e) {
      if (el) el.innerHTML = '<div style="color:var(--red);font-size:11px;padding:8px">Ошибка загрузки. Проверьте соединение.</div>';
    }
  },

  // Автоскринер
  startAutoScreener() {
    const hours = parseFloat(document.getElementById('screenerInterval')?.value) || 4;
    const ms = hours * 60 * 60 * 1000;
    this.stopAutoScreener();
    this.screenerTimer = setInterval(async () => {
      await this.runScreener();
      // Отправить алерт в TG если настроен
      await this.sendScreenerAlert();
    }, ms);
    const st = document.getElementById('screenerStatus');
    if (st) st.textContent = `✅ Запущен — каждые ${hours}ч`;
    if (typeof addLog === 'function') addLog('ok', `📡 Автоскринер запущен`, `Интервал: ${hours}ч`);
    // Запустить сразу
    this.runScreener();
  },

  stopAutoScreener() {
    if (this.screenerTimer) {
      clearInterval(this.screenerTimer);
      this.screenerTimer = null;
    }
    const st = document.getElementById('screenerStatus');
    if (st) st.textContent = '■ Остановлен';
  },

  async sendScreenerAlert() {
    // Шлём топ мувер в TG если подключён
    if (typeof notifyOwner !== 'function') return;
    try {
      const res = await fetch('https://api.bybit.com/v5/market/tickers?category=linear');
      const data = await res.json();
      if (data.retCode !== 0) return;
      const top = data.result.list
        .filter(t => t.symbol.endsWith('USDT') && parseFloat(t.volume24h) > 10000000)
        .sort((a,b) => Math.abs(parseFloat(b.price24hPcnt)) - Math.abs(parseFloat(a.price24hPcnt)))[0];
      if (top) {
        const chg = (parseFloat(top.price24hPcnt)*100).toFixed(2);
        await notifyOwner(`📡 <b>Скринер Макса</b>\n\nТоп мувер: <b>${top.symbol}</b>\nЦена: $${parseFloat(top.lastPrice).toFixed(4)}\nИзменение: ${chg}%\n\n⚡ Открой приложение для анализа`);
      }
    } catch(e) {}
  },

  // ── БАЗА ЗНАНИЙ ──
  knowledge: {
    ta: `
ТЕХНИЧЕСКИЙ АНАЛИЗ:
— Поддержка/сопротивление: зоны где цена разворачивалась 2+ раза
— Round numbers (30000, 50000, 100000) — психологически важны
— Паттерны: двойное дно/вершина, голова и плечи, флаг, поглощение, пин-бар
— RSI: >70 перекупленность, <30 перепроданность. Дивергенция — сильный сигнал
— MACD: пересечение линий на 4H и выше
— EMA 20/50/200: тренд. Пробой EMA200 — смена тренда
— Volume: пробой без объёма = ложный`,
    risk: `
РИСК-МЕНЕДЖМЕНТ (железные правила):
— Максимальный риск на сделку: 1-2% от депозита
— Размер позиции = (депозит × риск%) / (вход - стоп)
— Минимальный R:R = 1:2
— Стоп ВСЕГДА ставить до входа
— Дневной лимит убытка: 5% → стоп торговле
— После 3 убыточных подряд: пауза 2 часа`,
    futures: `
ФЬЮЧЕРСЫ:
— Funding rate >0.1%: много лонгов = перегрев (шортить осторожно)
— Funding rate <-0.05%: много шортов = возможный шорт-сквиз вверх
— OI растёт с ценой = сильный тренд
— Long/Short ratio >3: толпа в лонгах → риск сквиза вниз
— Плечо: максимум x10 для трендовых, x20 для скальпинга`,
    strategies: `
СТРАТЕГИИ:
1. ПРОБОЙ: консолидация 2+ недели → закрытие 4H выше/ниже уровня с объёмом
2. ОТБОЙ: пин-бар или поглощение на сильном уровне с RSI дивергенцией
3. ТРЕНД: откат к EMA20/50 в тренде выше EMA200
4. ДИВЕРГЕНЦИЯ: RSI дивергенция на 4H + разворотная свеча`,
    cycles: `
ЦИКЛЫ И КОРРЕЛЯЦИИ:
— Halving cycle: накопление → пост-халвинг булл → медвежий → аккумуляция
— Q4 исторически бычий, Q2 коррекция
— BTC.D растёт = деньги в BTC из альтов
— DXY обратно коррелирует с крипто`
  },

  // ── СИСТЕМНЫЙ ПРОМПТ ──
  buildSystemPrompt(emp) {
    let sys = emp.baseSystem;
    sys += '\n\n' + '═'.repeat(40) + '\nБАЗА ЗНАНИЙ:\n' + '═'.repeat(40);
    sys += this.knowledge.ta + this.knowledge.risk + this.knowledge.futures + this.knowledge.strategies + this.knowledge.cycles;

    if (emp.knowledge?.length) {
      sys += '\n\n' + '═'.repeat(40) + '\nПОЛЬЗОВАТЕЛЬСКИЕ ЗНАНИЯ:\n' + '═'.repeat(40) + '\n';
      emp.knowledge.forEach(k => { sys += `📌 ${k.topic}:\n${k.content}\n`; });
    }

    if (this._priceContext) {
      sys += this._priceContext;
      // _priceContext kept for all agents in chain (reset after full chain in sendTask)
    }

    if (this.fngData) {
      sys += `\n\n📊 Fear & Greed Index: ${this.fngData.value} — ${this.fngData.value_classification}`;
    }

    const closed = this.tradeJournal.filter(t => t.status === 'closed').slice(-10);
    if (closed.length) {
      sys += '\n\n' + '═'.repeat(40) + '\nПОСЛЕДНИЕ СДЕЛКИ:\n' + '═'.repeat(40) + '\n';
      closed.forEach(t => {
        const pnl = t.result !== undefined ? (t.result > 0 ? `✅ +${t.result}%` : `❌ ${t.result}%`) : '⏳';
        sys += `${t.pair} ${t.direction} @ ${t.entry} SL:${t.sl} TP:${t.tp1} | ${pnl}\n`;
      });
    }

    const stats = this.analyzePerformance();
    if (stats) {
      sys += `\n📈 Статистика: WR ${stats.winRate.toFixed(1)}% | PF ${stats.pf?.toFixed(2)||'—'} | PnL ${stats.totalPnl.toFixed(2)}%`;
      if (stats.winRate < 40) sys += '\n⚠️ Низкий WR — строже фильтровать входы';
    }

    return sys;
  },

  // ── ПАРСИНГ СИГНАЛА ──
  parseSignal(text) {
    const signal = {};
    const patterns = {
      pair:      /Инструмент[:\s]+([A-Z]+\/[A-Z]+|[A-Z]+USDT)/i,
      direction: /Сигнал[:\s]+(LONG|SHORT|НЕЙТРАЛЬНО)/i,
      entry:     /Вход[:\s]+([\d.,\s–\-]+)/i,
      sl:        /Стоп-лосс[:\s]+([\d.,]+)/i,
      tp1:       /Тейк-профит 1[:\s]+([\d.,]+)/i,
      tp2:       /Тейк-профит 2[:\s]+([\d.,]+)/i,
      rr:        /Risk\/Reward[:\s]+([\d.:]+)/i,
    };
    for (const [key, rx] of Object.entries(patterns)) {
      const m = text.match(rx);
      if (m) signal[key] = m[1].trim();
    }
    return Object.keys(signal).length > 2 ? signal : null;
  },
};

// ─── ПЕРЕОПРЕДЕЛЯЕМ buildSystem ───────────────────────
const _origBuildSystem = typeof buildSystem === 'function' ? buildSystem : null;
function buildSystem(emp) {
  if (emp.id === 9) return TRADER.buildSystemPrompt(emp);
  return _origBuildSystem ? _origBuildSystem(emp) : (emp.baseSystem || '');
}

// ─── ПЕРЕОПРЕДЕЛЯЕМ askEmp для подтягивания цен ───────
const _origAskEmp = typeof askEmp === 'function' ? askEmp : null;
async function askEmp(emp, isInt = false, customPrompt = null) {
  // Перед запросом к Максу — обновляем цены
  if (emp.id === 9 && Object.keys(TRADER.marketData).length === 0) {
    await TRADER.loadMarketData();
  } else if (emp.id === 9) {
    TRADER.appendPriceToNextMaxQuery(); // обновляем контекст
  }
  if (_origAskEmp) return _origAskEmp(emp, isInt, customPrompt);
}

// ─── ПЕРЕОПРЕДЕЛЯЕМ addBub — ловим сигналы ────────────
const _origAddBub = typeof addBub === 'function' ? addBub : null;
function addBub(emp, text, isInt = false) {
  if (_origAddBub) _origAddBub(emp, text, isInt);
  if (emp.id === 9) {
    const signal = TRADER.parseSignal(text);
    if (signal && (signal.direction === 'LONG' || signal.direction === 'SHORT')) {
      setTimeout(() => showTradeCapture(signal), 600);
    }
  }
}

// ─── ДОБАВЛЯЕМ МАКСА В EMPLOYEES ──────────────────────
if (typeof employees !== 'undefined' && !employees.find(e => e.id === 9)) {
  employees.push({
    id: 9, name: 'Макс', role: 'Трейдер', dept: 'Трейдинг', emoji: '📈', xp: 0,
    baseSkills: ['BTC','ETH','фьючерсы','деривативы','тех. анализ','риск-менеджмент'],
    learnedSkills: [], knowledge: [],
    baseSystem: `Ты — Макс, профессиональный крипто-трейдер. Торгуешь BTC, ETH и альты на Bybit.
Используй всю базу знаний. Учись на прошлых сделках из журнала.

ФОРМАТ ответа — 1 предложение вывода, затем:
<result>
📊 Инструмент: [пара]
📈 Тренд: [бычий/медвежий/боковик]
🎯 Сигнал: [LONG / SHORT / НЕЙТРАЛЬНО]
📍 Вход: [цена или зона]
🛑 Стоп-лосс: [цена] ([%])
✅ Тейк-профит 1: [цена] ([%])
✅ Тейк-профит 2: [цена]
⚖️ Risk/Reward: [соотношение]
💡 Обоснование: [2-3 предложения: ТА + деривативы + объёмы]
</result>`
  });
}

// ─── РОУТИНГ ──────────────────────────────────────────
if (typeof kwMap !== 'undefined') {
  kwMap[9] = ['трейд','биржа','bybit','btc','eth','крипто','фьючерс','деривати','сигнал','long','short','стоп','тейк','позиц','свеча','таймфрейм','плечо','торгов','монет','альт','памп'];
}

// ─── UI ФУНКЦИИ ───────────────────────────────────────

// Переключение таба трейдера
function traderTab(el, name) {
  document.querySelectorAll('.trader-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  ['market','journal','stats','calc','screener'].forEach(n => {
    const panel = document.getElementById('trader-' + n);
    if (panel) panel.style.display = n === name ? 'flex' : 'none';
  });
  if (name === 'journal') TRADER.renderJournal();
  if (name === 'stats') TRADER.renderStats();
  if (name === 'screener') TRADER.runScreener();
}

// Быстрый вопрос Максу (переходит на экран задач)
function traderAsk(text) {
  if (typeof switchScreen === 'function') switchScreen('tasks');
  const inp = document.getElementById('taskInp');
  if (inp) {
    inp.value = text;
    if (typeof sendTask === 'function') sendTask();
  }
}

// UI карточка захвата сделки
function showTradeCapture(signal) {
  const existing = document.getElementById('tradeCaptureBar');
  if (existing) existing.remove();

  const bar = document.createElement('div');
  bar.id = 'tradeCaptureBar';
  const isLong = signal.direction === 'LONG';
  bar.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:15px">📈</span>
        <span style="font-weight:700;font-size:13px">Сигнал от Макса</span>
        <span style="padding:2px 8px;border-radius:5px;font-size:11px;font-weight:700;
          background:${isLong?'var(--green2)':'var(--red2)'};color:${isLong?'var(--green)':'var(--red)'}">${isLong?'▲ LONG':'▼ SHORT'}</span>
        ${signal.pair ? `<span style="font-size:12px;color:var(--text2)">${signal.pair}</span>` : ''}
      </div>
      <div onclick="this.closest('#tradeCaptureBar').remove()" style="color:var(--text3);cursor:pointer;font-size:20px;line-height:1">✕</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
      ${signal.entry ? `<span style="font-size:11px;background:var(--bg3);padding:3px 8px;border-radius:6px;color:var(--text2)">Вход: <b>${signal.entry}</b></span>` : ''}
      ${signal.sl ? `<span style="font-size:11px;background:var(--red2);padding:3px 8px;border-radius:6px;color:var(--red)">SL: ${signal.sl}</span>` : ''}
      ${signal.tp1 ? `<span style="font-size:11px;background:var(--green2);padding:3px 8px;border-radius:6px;color:var(--green)">TP: ${signal.tp1}</span>` : ''}
      ${signal.rr ? `<span style="font-size:11px;background:var(--blue3);padding:3px 8px;border-radius:6px;color:var(--blue)">R:R ${signal.rr}</span>` : ''}
    </div>
    <div style="display:flex;gap:8px">
      <button onclick="recordTrade(${JSON.stringify(signal).replace(/"/g,'&quot;')})"
        style="flex:1;padding:10px;border-radius:10px;border:none;background:${isLong?'var(--green2)':'var(--red2)'};
          color:${isLong?'var(--green)':'var(--red)'};font-weight:700;font-size:13px;cursor:pointer;font-family:var(--font)">
        ✅ В журнал
      </button>
      <button onclick="this.closest('#tradeCaptureBar').remove()"
        style="padding:10px 16px;border-radius:10px;border:1px solid var(--border2);background:var(--bg3);color:var(--text2);font-size:13px;cursor:pointer;font-family:var(--font)">
        Пропустить
      </button>
    </div>`;
  document.body.appendChild(bar);
}

function recordTrade(signal) {
  TRADER.addTrade({
    pair: signal.pair || 'BTC/USDT',
    direction: signal.direction,
    entry: signal.entry, sl: signal.sl,
    tp1: signal.tp1, tp2: signal.tp2, rr: signal.rr,
  });
  document.getElementById('tradeCaptureBar')?.remove();

  const note = document.createElement('div');
  note.style.cssText = `position:fixed;bottom:calc(var(--nav-h)+12px);left:50%;transform:translateX(-50%);
    background:var(--green2);border:1px solid rgba(45,232,160,.3);color:var(--green);
    padding:8px 18px;border-radius:20px;font-size:12px;font-weight:700;z-index:200;animation:fadein .2s ease`;
  note.textContent = '✅ Сделка записана в журнал';
  document.body.appendChild(note);
  setTimeout(() => note.remove(), 2500);

  if (typeof addLog === 'function') addLog('ok', `📈 Сделка: ${signal.pair} ${signal.direction}`, `Вход: ${signal.entry} | SL: ${signal.sl}`);
}

// ─── ПЕРЕОПРЕДЕЛЯЕМ switchScreen ──────────────────────
const _origSwitchScreen = typeof switchScreen === 'function' ? switchScreen : null;
function switchScreen(name) {
  if (_origSwitchScreen) _origSwitchScreen(name);

  // Показываем/скрываем экран трейдера
  const traderScreen = document.getElementById('s-trader');
  const traderNav = document.getElementById('nav-trader');
  if (traderScreen) traderScreen.classList.toggle('active', name === 'trader');
  if (traderNav) traderNav.classList.toggle('active', name === 'trader');

  if (name === 'trader') {
    TRADER.loadMarketData();
    TRADER.renderJournal();
    TRADER.renderStats();
  }
}

// Загружаем данные при старте приложения
document.addEventListener('DOMContentLoaded', () => {
  // Load journal from Storage
  try {
    const raw = localStorage.getItem('trader_journal');
    if (raw) TRADER.tradeJournal = JSON.parse(raw);
  } catch(e) {}
  if (typeof Storage !== 'undefined' && Storage.get) {
    Storage.get('trader_journal').then(val => {
      if (val) try { TRADER.tradeJournal = JSON.parse(val); } catch(e) {}
    }).catch(()=>{});
  }
  setTimeout(() => {
    if (typeof API_KEY !== 'undefined' && API_KEY) {
      TRADER.loadMarketData();
    }
  }, 1500);
});

// Экспорт
window.TRADER = TRADER;
window.showTradeCapture = showTradeCapture;
window.recordTrade = recordTrade;
window.traderTab = traderTab;
window.traderAsk = traderAsk;

console.log('📈 trader.js v2 загружен — Макс готов к работе');
