cat > /home/claude/trader.js << 'EOF'
// ═══════════════════════════════════════════════════════
//  МАКС — AI ТРЕЙДЕР  |  trader.js
//  Подключить в index.html перед закрывающим </body>:
//  <script src="trader.js"></script>
// ═══════════════════════════════════════════════════════

const TRADER = {

  // ─── БАЗА ЗНАНИЙ ──────────────────────────────────────
  knowledge: {

    // Технический анализ
    ta: `
ТЕХНИЧЕСКИЙ АНАЛИЗ (база знаний Макса):

УРОВНИ И ЗОНЫ:
— Поддержка/сопротивление: ищи зоны где цена разворачивалась 2+ раза
— Round numbers (круглые числа): 30000, 50000, 100000 — психологически важны
— Предыдущие хаи/лои: всегда отмечай High/Low предыдущего дня, недели, месяца
— Объёмные зоны: где был максимальный объём — там сильная поддержка/сопротивление

ПАТТЕРНЫ (надёжные):
— Двойное дно / двойная вершина: разворотные, подтверждение — пробой шеи
— Голова и плечи: сильный разворот, цель = высота фигуры
— Флаг/вымпел: продолжение тренда, вход после пробоя
— Поглощение (engulfing): разворотная свеча, особенно на ключевых уровнях
— Пин-бар: отвержение уровня, хвост 2x тело

ИНДИКАТОРЫ:
— RSI: перекупленность >70, перепроданность <30. Дивергенция — сильный сигнал
— MACD: пересечение линий + гистограмма. Лучше работает на 4H и выше
— EMA 20/50/200: тренд определяется относительно EMA200. Пересечение 20/50 — сигнал
— Bollinger Bands: сжатие = накопление перед движением, выход за полосу = импульс
— Volume: подтверждает пробои. Пробой без объёма = ложный

ТАЙМФРЕЙМЫ:
— 1D/1W: определение глобального тренда и ключевых уровней
— 4H: рабочий таймфрейм для поиска точки входа
— 1H/15M: точный вход, уточнение стопа
`,

    // Риск-менеджмент
    risk: `
РИСК-МЕНЕДЖМЕНТ (железные правила Макса):

РАЗМЕР ПОЗИЦИИ:
— Максимальный риск на сделку: 1-2% от депозита
— Формула: размер позиции = (депозит × риск%) / (вход - стоп) 
— Максимальная одновременная экспозиция: 6% (3 сделки по 2%)
— Никогда не усредняй убыточную позицию

СТОП-ЛОСС:
— Всегда ставить ДО входа, не после
— За уровень поддержки/сопротивления + 0.5% буфер
— ATR-стоп: стоп = вход ± (ATR × 1.5)
— Трейлинг стоп: переносить в безубыток при +1R прибыли

ТЕЙК-ПРОФИТ:
— Минимальный R:R = 1:2 (лучше 1:3)
— ТП1 на 50% позиции = следующий уровень сопротивления
— ТП2 на 30% = расширение Фибоначчи 1.618
— ТП3 на 20% = держать с трейлингом

ДНЕВНЫЕ ЛИМИТЫ:
— Максимальный дневной убыток: 5% депозита → стоп торговле
— Максимум сделок в день: 5 (качество важнее количества)
— После 3 убыточных подряд: пауза минимум 2 часа

ПСИХОЛОГИЯ:
— Не мстить рынку после убытка
— Не увеличивать размер после серии прибылей (эйфория убивает)
— Вести журнал сделок — обязательно
`,

    // Рыночные циклы
    cycles: `
РЫНОЧНЫЕ ЦИКЛЫ КРИПТО:

HALVING CYCLE (4 года):
— Pre-halving: накопление за 6-12 мес до халвинга
— Post-halving bull: рост 12-18 месяцев после халвинга
— Bear market: снижение 1-2 года, коррекция 70-85% от ATH
— Аккумуляция: боковик перед следующим циклом

СЕЗОННОСТЬ:
— Q1 (янв-март): исторически сильный для крипто (институциональные покупки)
— Q2 (апр-июнь): коррекция "sell in may"
— Q3 (июл-сент): смешанный, часто консолидация
— Q4 (окт-дек): исторически бычий ("uptober")

ДОМИНАЦИЯ BTC:
— BTC.D растёт = деньги выходят из альтов в BTC (риск-офф)
— BTC.D падает = ротация в альты (альт-сезон)
— BTC.D >60% = альты дёшевы относительно BTC

КОРРЕЛЯЦИИ:
— BTC и ETH коррелируют ~0.85
— Альты = BTC × beta (beta > 1 = более волатильны)
— DXY (доллар) обратно коррелирует с крипто
— SPX (акции США) прямо коррелирует при кризисах
`,

    // Фьючерсы
    futures: `
ФЬЮЧЕРСЫ И ДЕРИВАТИВЫ:

БАЗОВЫЕ ПОНЯТИЯ:
— Perpetual futures: бессрочные, ставка финансирования каждые 8 часов
— Funding rate >0.1%: лонгисты платят шортистам (много лонгов = перегрев)
— Funding rate <-0.05%: шортисты платят лонгистам (рынок медвежий)
— Open Interest (OI): растёт с ценой = сильный тренд. Падает = закрытие позиций

ПЛЕЧО:
— Максимум для трендовых: x5-x10
— Максимум для скальпинга: x20
— Никогда x50-x100 (казино)
— Изолированная маржа предпочтительнее кросс-маржи

ЛИКВИДАЦИИ:
— Карта ликвидаций: скопление стопов → магнит для цены
— Ликвидационный каскад: падение → ликвидации лонгов → ещё падение
— Искать зоны скопления ликвидаций через Coinglass

СИГНАЛЫ ДЕРИВАТИВОВ:
— Long/Short ratio >3: толпа в лонгах → вероятен шорт-сквиз вниз
— Long/Short ratio <0.5: все в шортах → вероятен шорт-сквиз вверх
— OI резко растёт при падении → новые шорты открываются (медвежий сигнал)
— OI резко падает при падении → закрытие лонгов (дно близко)

FUNDING ARBITRAGE:
— Высокий положительный funding → шорт фьючерс + спот лонг (нейтрально)
— Собирать funding при нейтральной позиции
`,

    // On-chain анализ
    onchain: `
ON-CHAIN МЕТРИКИ (для BTC и ETH):

НАКОПЛЕНИЕ/РАСПРЕДЕЛЕНИЕ:
— Exchange Netflow: приток на биржи = продажное давление, отток = накопление
— HODL Waves: % монет не двигавшихся 1+ год → долгосрочные держатели не продают
— SOPR >1: в среднем продают в прибыль (бычий рынок)
— SOPR <1: в среднем продают в убыток (медвежий рынок или капитуляция)

МАЙНЕРЫ:
— Miner Outflow: майнеры продают → давление на цену
— Hash Ribbon: пересечение хешрейта = сигнал покупки после капитуляции майнеров

СТЕЙБЛКОИНЫ:
— Рост supply USDT/USDC = новые деньги идут в крипто (бычий)
— Stablecoin Supply Ratio (SSR): низкий = много сухого пороха для покупок

КИТЫ:
— Транзакции >1000 BTC: отслеживать через Whale Alert
— Адреса с 1000+ BTC: растёт количество = накопление
— Exchange whale ratio: высокий = киты готовятся продавать
`,

    // Стратегии
    strategies: `
ТОРГОВЫЕ СТРАТЕГИИ МАКСА:

1. ПРОБОЙ УРОВНЯ (breakout):
Условия: консолидация 2+ недели, сужение BB, снижение объёма
Вход: закрытие свечи 4H выше/ниже уровня с объёмом
Стоп: за середину консолидации
Цель: высота консолидации × 1.618

2. ОТБОЙ ОТ УРОВНЯ (bounce):
Условия: цена на сильном уровне (тест 3+), RSI перепродан/перекуплен
Вход: пин-бар или поглощение на уровне (1H/4H)
Стоп: за уровень + 0.5%
Цель: следующий уровень

3. ТРЕНДОВОЕ ДВИЖЕНИЕ (trend following):
Условия: цена выше EMA200 4H, EMA20 > EMA50
Вход: откат к EMA20 или EMA50 без пробоя
Стоп: под EMA50 или последний лой
Цель: предыдущий хай + расширение

4. ДИВЕРГЕНЦИЯ (divergence):
Условия: RSI дивергенция на 4H (бычья/медвежья)
Вход: подтверждение разворотной свечой
Стоп: за экстремум
Цель: начало дивергенции

5. НАКОПЛЕНИЕ (Wyckoff):
Фазы: PS → SC → AR → ST → Spring → SOS → LPS → BU
Вход на Spring (ложный пробой поддержки) или LPS
Стоп: под Spring
Цель: ширина торгового диапазона
`
  },

  // ─── ЖУРНАЛ СДЕЛОК ────────────────────────────────────
  tradeJournal: JSON.parse(localStorage.getItem('trader_journal') || '[]'),

  saveJournal() {
    localStorage.setItem('trader_journal', JSON.stringify(this.tradeJournal.slice(-200)));
  },

  addTrade(trade) {
    trade.id = Date.now();
    trade.ts = new Date().toISOString();
    this.tradeJournal.push(trade);
    this.saveJournal();
    this.analyzePerformance();
  },

  // ─── АНАЛИЗ РЕЗУЛЬТАТОВ ───────────────────────────────
  analyzePerformance() {
    const trades = this.tradeJournal.filter(t => t.result !== undefined);
    if (trades.length < 3) return null;

    const wins = trades.filter(t => t.result > 0);
    const losses = trades.filter(t => t.result < 0);
    const winRate = (wins.length / trades.length * 100).toFixed(1);
    const avgWin = wins.length ? (wins.reduce((s,t) => s + t.result, 0) / wins.length).toFixed(2) : 0;
    const avgLoss = losses.length ? (Math.abs(losses.reduce((s,t) => s + t.result, 0) / losses.length)).toFixed(2) : 0;
    const profitFactor = avgLoss > 0 ? (avgWin * wins.length / (avgLoss * losses.length)).toFixed(2) : '∞';
    const totalPnl = trades.reduce((s,t) => s + t.result, 0).toFixed(2);

    const stats = { winRate, avgWin, avgLoss, profitFactor, totalPnl, total: trades.length };
    localStorage.setItem('trader_stats', JSON.stringify(stats));
    return stats;
  },

  // ─── ФОРМИРОВАНИЕ СИСТЕМНОГО ПРОМПТА ──────────────────
  buildSystemPrompt(emp) {
    const stats = JSON.parse(localStorage.getItem('trader_stats') || 'null');
    const recentTrades = this.tradeJournal.slice(-10);
    const userKnowledge = emp.knowledge || [];

    let system = emp.baseSystem;

    // Добавляем базу знаний
    system += `\n\n${'═'.repeat(50)}\nБАЗА ЗНАНИЙ МАКСА:\n${'═'.repeat(50)}`;
    system += this.knowledge.ta;
    system += this.knowledge.risk;
    system += this.knowledge.futures;
    system += this.knowledge.strategies;
    system += this.knowledge.cycles;
    system += this.knowledge.onchain;

    // Добавляем пользовательские знания
    if (userKnowledge.length > 0) {
      system += `\n\n${'═'.repeat(50)}\nМОИ ЛИЧНЫЕ ЗНАНИЯ И СТРАТЕГИИ (загружены владельцем):\n${'═'.repeat(50)}\n`;
      userKnowledge.forEach(k => {
        system += `\n📌 ${k.topic}:\n${k.content}\n`;
      });
    }

    // Добавляем статистику
    if (stats) {
      system += `\n\n${'═'.repeat(50)}\nМОЯ СТАТИСТИКА (${stats.total} сделок):\n${'═'.repeat(50)}`;
      system += `\nWin Rate: ${stats.winRate}%`;
      system += `\nAvg Win: +${stats.avgWin}% | Avg Loss: -${stats.avgLoss}%`;
      system += `\nProfit Factor: ${stats.profitFactor}`;
      system += `\nОбщий PnL: ${stats.totalPnl}%`;

      // Выводы из статистики
      if (parseFloat(stats.winRate) < 40) {
        system += `\n⚠️ Низкий win rate — нужно быть строже с точками входа`;
      }
      if (parseFloat(stats.profitFactor) < 1.5) {
        system += `\n⚠️ Низкий profit factor — улучшить соотношение R:R`;
      }
    }

    // Добавляем журнал последних сделок
    if (recentTrades.length > 0) {
      system += `\n\n${'═'.repeat(50)}\nПОСЛЕДНИЕ СДЕЛКИ (учись на них):\n${'═'.repeat(50)}\n`;
      recentTrades.forEach(t => {
        const pnl = t.result !== undefined ? (t.result > 0 ? `✅ +${t.result}%` : `❌ ${t.result}%`) : '⏳ открыта';
        system += `${t.pair} ${t.direction} @ ${t.entry} → SL:${t.sl} TP:${t.tp} | ${pnl}`;
        if (t.notes) system += ` | Заметка: ${t.notes}`;
        system += '\n';
      });
    }

    return system;
  },

  // ─── ПАРСИНГ СИГНАЛА ИЗ ОТВЕТА ───────────────────────
  parseSignal(text) {
    const signal = {};
    const patterns = {
      pair:      /Инструмент[:\s]+([A-Z]+\/[A-Z]+|[A-Z]+USDT)/i,
      direction: /Сигнал[:\s]+(LONG|SHORT|НЕЙТРАЛЬНО)/i,
      entry:     /Вход[:\s]+([\d.,\s-]+)/i,
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

  // ─── РЕНДЕР ЖУРНАЛА ───────────────────────────────────
  renderJournal() {
    const trades = this.tradeJournal.slice().reverse();
    if (!trades.length) return '<div style="color:var(--text3);font-size:12px;padding:12px">Журнал пуст — сделки появятся после торговли</div>';

    return trades.slice(0, 20).map(t => {
      const pnl = t.result !== undefined
        ? `<span style="color:${t.result > 0 ? 'var(--green)' : 'var(--red)'}; font-weight:700">${t.result > 0 ? '+' : ''}${t.result}%</span>`
        : `<span style="color:var(--amber)">⏳ открыта</span>`;
      const dir = t.direction === 'LONG'
        ? '<span style="color:var(--green)">▲ LONG</span>'
        : '<span style="color:var(--red)">▼ SHORT</span>';
      return `<div style="background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:10px 12px;margin-bottom:6px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <span style="font-weight:700;font-size:13px">${t.pair || '?'}</span>
          ${dir}
          ${pnl}
        </div>
        <div style="font-size:11px;color:var(--text3)">
          Вход: <b style="color:var(--text2)">${t.entry||'?'}</b> &nbsp;
          SL: <b style="color:var(--red)">${t.sl||'?'}</b> &nbsp;
          TP: <b style="color:var(--green)">${t.tp1||'?'}</b>
        </div>
        ${t.notes ? `<div style="font-size:11px;color:var(--text3);margin-top:4px">💬 ${t.notes}</div>` : ''}
        <div style="font-size:10px;color:var(--text3);margin-top:4px">${new Date(t.ts).toLocaleString('ru')}</div>
      </div>`;
    }).join('');
  },

  // ─── РЕНДЕР СТАТИСТИКИ ────────────────────────────────
  renderStats() {
    const stats = this.analyzePerformance();
    if (!stats) return '<div style="color:var(--text3);font-size:12px;padding:12px">Недостаточно сделок для статистики (нужно 3+)</div>';

    const pfColor = parseFloat(stats.profitFactor) >= 1.5 ? 'var(--green)' : parseFloat(stats.profitFactor) >= 1 ? 'var(--amber)' : 'var(--red)';
    const wrColor = parseFloat(stats.winRate) >= 55 ? 'var(--green)' : parseFloat(stats.winRate) >= 40 ? 'var(--amber)' : 'var(--red)';

    return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:4px 0">
      <div style="background:var(--bg3);border-radius:10px;padding:12px;text-align:center">
        <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.08em">Win Rate</div>
        <div style="font-size:22px;font-weight:900;color:${wrColor};margin-top:4px">${stats.winRate}%</div>
        <div style="font-size:10px;color:var(--text3)">${stats.total} сделок</div>
      </div>
      <div style="background:var(--bg3);border-radius:10px;padding:12px;text-align:center">
        <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.08em">Profit Factor</div>
        <div style="font-size:22px;font-weight:900;color:${pfColor};margin-top:4px">${stats.profitFactor}</div>
        <div style="font-size:10px;color:var(--text3)">Win/Loss ratio</div>
      </div>
      <div style="background:var(--bg3);border-radius:10px;padding:12px;text-align:center">
        <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.08em">Avg Win</div>
        <div style="font-size:22px;font-weight:900;color:var(--green);margin-top:4px">+${stats.avgWin}%</div>
      </div>
      <div style="background:var(--bg3);border-radius:10px;padding:12px;text-align:center">
        <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.08em">Total PnL</div>
        <div style="font-size:22px;font-weight:900;color:${parseFloat(stats.totalPnl)>=0?'var(--green)':'var(--red)'};margin-top:4px">${parseFloat(stats.totalPnl)>=0?'+':''}${stats.totalPnl}%</div>
      </div>
    </div>`;
  }
};

// ─── ИНТЕГРАЦИЯ В ГЛАВНЫЙ APP ──────────────────────────

// Переопределяем buildSystem для агента Макс (id=9)
const _origBuildSystem = typeof buildSystem === 'function' ? buildSystem : null;
function buildSystem(emp) {
  if (emp.id === 9) return TRADER.buildSystemPrompt(emp);
  return _origBuildSystem ? _origBuildSystem(emp) : emp.baseSystem;
}

// Добавляем агента Макс в employees если ещё нет
if (typeof employees !== 'undefined' && !employees.find(e => e.id === 9)) {
  employees.push({
    id:9, name:'Макс', role:'Трейдер', dept:'Трейдинг', emoji:'📈', xp:0,
    baseSkills:['BTC','ETH','фьючерсы','деривативы','тех. анализ','риск-менеджмент','on-chain'],
    learnedSkills:[], knowledge:[],
    baseSystem:`Ты — Макс, профессиональный крипто-трейдер. Торгуешь BTC, ETH и альткоины на споте и фьючерсах через Bybit.

РЕЖИМЫ:
1. АНАЛИЗ — расклад рынка, уровни, сигнал long/short/нейтрально
2. СДЕЛКА — конкретный ордер с параметрами

При анализе используй весь массив знаний из своей базы. Учись на прошлых сделках из журнала.

ФОРМАТ ОТВЕТА:
Одно предложение вывода, затем:
<result>
📊 Инструмент: [пара]
📈 Тренд: [бычий/медвежий/боковик]
🎯 Сигнал: [LONG / SHORT / НЕЙТРАЛЬНО]
📍 Вход: [цена или зона]
🛑 Стоп-лосс: [цена] ([%] риска)
✅ Тейк-профит 1: [цена] ([%] профита)
✅ Тейк-профит 2: [цена]
⚖️ Risk/Reward: [соотношение]
💡 Обоснование: [2-3 предложения с учётом ТА, объёмов, деривативов]
</result>`
  });
}

// Добавляем Трейдинг в роутинг
if (typeof kwMap !== 'undefined') {
  kwMap[9] = ['трейд','биржа','bybit','btc','eth','крипто','фьючерс','деривати','сигнал','long','short','стоп','тейк','позиц','памп','свеча','таймфрейм','маржа','плечо','анализ рынк','торгов','монет','альт','бинанс'];
}
if (typeof modeForce !== 'undefined') {
  modeForce.trade = [9, 8];
}

// Парсим сигнал после ответа Макса и предлагаем записать в журнал
const _origAddBub = typeof addBub === 'function' ? addBub : null;
function addBub(emp, text, isInt=false) {
  if (_origAddBub) _origAddBub(emp, text, isInt);
  if (emp.id === 9) {
    const signal = TRADER.parseSignal(text);
    if (signal && (signal.direction === 'LONG' || signal.direction === 'SHORT')) {
      setTimeout(() => showTradeCapture(signal), 600);
    }
  }
}

// ─── UI: ЗАХВАТ СДЕЛКИ ────────────────────────────────
function showTradeCapture(signal) {
  const existing = document.getElementById('tradeCaptureBar');
  if (existing) existing.remove();

  const bar = document.createElement('div');
  bar.id = 'tradeCaptureBar';
  bar.style.cssText = `
    position:fixed;bottom:calc(var(--nav-h) + 8px);left:10px;right:10px;
    background:var(--bg2);border:1px solid ${signal.direction==='LONG'?'rgba(45,232,160,.4)':'rgba(240,80,80,.4)'};
    border-radius:16px;padding:12px 14px;z-index:150;
    box-shadow:0 4px 24px rgba(0,0,0,.5);
    animation:slideup .25s cubic-bezier(.32,1,.32,1);
  `;
  bar.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:15px">📈</span>
        <span style="font-weight:700;font-size:13px">Сигнал от Макса</span>
        <span style="padding:2px 8px;border-radius:5px;font-size:11px;font-weight:700;
          background:${signal.direction==='LONG'?'var(--green2)':'var(--red2)'};
          color:${signal.direction==='LONG'?'var(--green)':'var(--red)'}">
          ${signal.direction==='LONG'?'▲ LONG':'▼ SHORT'}
        </span>
        ${signal.pair ? `<span style="font-size:12px;color:var(--text2)">${signal.pair}</span>` : ''}
      </div>
      <div onclick="document.getElementById('tradeCaptureBar').remove()"
        style="color:var(--text3);cursor:pointer;font-size:18px;line-height:1">✕</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
      ${signal.entry ? `<span style="font-size:11px;background:var(--bg3);padding:3px 8px;border-radius:6px;color:var(--text2)">Вход: <b>${signal.entry}</b></span>` : ''}
      ${signal.sl ? `<span style="font-size:11px;background:var(--red2);padding:3px 8px;border-radius:6px;color:var(--red)">SL: ${signal.sl}</span>` : ''}
      ${signal.tp1 ? `<span style="font-size:11px;background:var(--green2);padding:3px 8px;border-radius:6px;color:var(--green)">TP: ${signal.tp1}</span>` : ''}
      ${signal.rr ? `<span style="font-size:11px;background:var(--blue3);padding:3px 8px;border-radius:6px;color:var(--blue)">R:R ${signal.rr}</span>` : ''}
    </div>
    <div style="display:flex;gap:8px">
      <button onclick="recordTrade(${JSON.stringify(signal).replace(/"/g,'&quot;')}, 'open')"
        style="flex:1;padding:10px;border-radius:10px;border:none;
          background:${signal.direction==='LONG'?'var(--green2)':'var(--red2)'};
          color:${signal.direction==='LONG'?'var(--green)':'var(--red)'};
          font-weight:700;font-size:13px;cursor:pointer;font-family:var(--font)">
        ✅ Записать в журнал
      </button>
      <button onclick="document.getElementById('tradeCaptureBar').remove()"
        style="padding:10px 16px;border-radius:10px;border:1px solid var(--border2);
          background:var(--bg3);color:var(--text2);font-size:13px;cursor:pointer;font-family:var(--font)">
        Пропустить
      </button>
    </div>
  `;
  document.body.appendChild(bar);
}

function recordTrade(signal, status) {
  TRADER.addTrade({
    pair: signal.pair || 'BTC/USDT',
    direction: signal.direction,
    entry: signal.entry,
    sl: signal.sl,
    tp1: signal.tp1,
    tp2: signal.tp2,
    rr: signal.rr,
    status,
    result: undefined
  });
  document.getElementById('tradeCaptureBar')?.remove();

  // Показываем уведомление
  const note = document.createElement('div');
  note.style.cssText = `position:fixed;bottom:calc(var(--nav-h)+12px);left:50%;transform:translateX(-50%);
    background:var(--green2);border:1px solid rgba(45,232,160,.3);color:var(--green);
    padding:8px 18px;border-radius:20px;font-size:12px;font-weight:700;z-index:200;
    animation:fadein .2s ease`;
  note.textContent = '✅ Сделка записана в журнал';
  document.body.appendChild(note);
  setTimeout(() => note.remove(), 2500);

  if (typeof addLog === 'function') {
    addLog('ok', `📈 Сделка записана: ${signal.pair} ${signal.direction}`, `Вход: ${signal.entry} | SL: ${signal.sl}`);
  }
}

// ─── ЗАКРЫТИЕ СДЕЛКИ ──────────────────────────────────
function closeTrade(index, result, notes='') {
  const trade = TRADER.tradeJournal[index];
  if (!trade) return;
  trade.result = parseFloat(result);
  trade.closeTs = new Date().toISOString();
  trade.notes = notes;
  trade.status = 'closed';
  TRADER.saveJournal();
  TRADER.analyzePerformance();

  if (typeof addLog === 'function') {
    addLog(result > 0 ? 'ok' : 'err',
      `${result > 0 ? '✅' : '❌'} Сделка закрыта: ${trade.pair} ${result > 0 ? '+' : ''}${result}%`,
      trade.notes || '');
  }
}

// ─── ЭКСПОРТ ──────────────────────────────────────────
window.TRADER = TRADER;
window.showTradeCapture = showTradeCapture;
window.recordTrade = recordTrade;
window.closeTrade = closeTrade;

console.log('📈 trader.js загружен — Макс готов к работе');
EOF
echo "Done: $(wc -l < /home/claude/trader.js) lines"
