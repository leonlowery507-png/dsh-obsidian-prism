/* Obsidian Prism for DeepSeek Harness · Home Studio telemetry panel
 * Adapted for the DSH v44.7 hero DOM from RMvdesi/obsidian-prism 1.0.7.
 * GPL-3.0-only.
 */
(function (root, factory) {
  'use strict';
  const api = factory(root || (typeof globalThis !== 'undefined' ? globalThis : null));
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root && typeof root === 'object') root.DSHPrismHomeStudio = api;
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function (root) {
  'use strict';

  const SAMPLE_STORAGE_KEY = 'dsh_obsidian_prism_home_samples_v1';
  const USAGE_CACHE_KEY = 'dsh_obsidian_prism_home_usage_cache_v1';
  const SAMPLE_LIMIT = 2400;
  const USAGE_FETCH_COOLDOWN_MS = 60_000;
  const USAGE_BATCH_LIMIT = 24;
  const TELEMETRY_POLL_MS = 15_000;
  const HOME_SELECTOR =
    '[data-conversation-content][data-content-phase="hero"], ' +
    '[data-conversation-content][data-content-phase="blank"]';
  const RANGE_DAYS = Object.freeze({ '7d': 7, '30d': 30, '90d': 90, all: 0 });
  const HOME_COLOUR_COUNT = 8;
  const OWNED_SELECTOR = '[data-dsh-prism-owned="1"], .dsh-prism-home-studio-seat';

  const COPY = Object.freeze({
    'zh-CN': {
      region: 'Prism Studio 首页仪表盘',
      title: '棱镜仪表盘',
      subtitle: '本地遥测 · 不生成虚构数据',
      overview: '总览',
      trend: '趋势',
      models: '模型',
      range7: '7 天',
      range30: '30 天',
      range90: '90 天',
      rangeAll: '全部',
      sessions: '会话样本',
      samples: '遥测样本',
      calls: '调用记录',
      tokens: '观测 Token',
      activeDays: '活跃天',
      peakContext: '上下文峰值',
      cache: '缓存命中',
      favorite: '常用模型',
      heatTitle: '活动热力图',
      heatSub: '7 × {n} 周',
      heatHint: '{date} · {tokens} Token',
      trendTitle: 'Token 趋势',
      trendSub: '按观测增量聚合',
      modelsTitle: '模型分布',
      modelsSub: '按实际 Token 占比',
      noDataTitle: '还没有可展示的用量数据',
      noDataBody: '正在等待 DSH bridge、metrics 或本地遥测样本。这里不会用随机数字填充。',
      noTrend: '当前范围还没有 Token 增量。',
      noModels: '当前范围还没有可归属到模型的 Token。',
      sourceLive: 'DSH bridge 实时遥测 · 本地采样',
      sourceHost: '宿主用量桥 · 最近同步',
      sourceEmpty: '等待 bridge / metrics / 本地采样',
      updated: '更新于 {time}',
      notReported: '尚未报告',
      tokenUnit: 'Token',
      rowIn: '输入',
      rowOut: '输出',
    },
    'zh-TW': {
      region: 'Prism Studio 首頁儀表板',
      title: '稜鏡儀表板',
      subtitle: '本機遙測 · 不生成虛構資料',
      overview: '總覽',
      trend: '趨勢',
      models: '模型',
      range7: '7 天',
      range30: '30 天',
      range90: '90 天',
      rangeAll: '全部',
      sessions: '工作階段樣本',
      samples: '遙測樣本',
      calls: '呼叫紀錄',
      tokens: '觀測 Token',
      activeDays: '活躍天',
      peakContext: '上下文峰值',
      cache: '快取命中',
      favorite: '常用模型',
      heatTitle: '活動熱力圖',
      heatSub: '7 × {n} 週',
      heatHint: '{date} · {tokens} Token',
      trendTitle: 'Token 趨勢',
      trendSub: '依觀測增量聚合',
      modelsTitle: '模型分布',
      modelsSub: '依實際 Token 佔比',
      noDataTitle: '尚無可顯示的用量資料',
      noDataBody: '正在等待 DSH bridge、metrics 或本機遙測樣本。此處不會以隨機數字填充。',
      noTrend: '目前範圍尚無 Token 增量。',
      noModels: '目前範圍尚無可歸屬至模型的 Token。',
      sourceLive: 'DSH bridge 即時遙測 · 本機取樣',
      sourceHost: '宿主用量橋 · 最近同步',
      sourceEmpty: '等待 bridge / metrics / 本機取樣',
      updated: '更新於 {time}',
      notReported: '尚未回報',
      tokenUnit: 'Token',
      rowIn: '輸入',
      rowOut: '輸出',
    },
    yue: {
      region: 'Prism Studio 首頁儀表板',
      title: '稜鏡儀表板',
      subtitle: '本機遙測 · 唔會作虛構數據',
      overview: '總覽',
      trend: '趨勢',
      models: '模型',
      range7: '7 日',
      range30: '30 日',
      range90: '90 日',
      rangeAll: '全部',
      sessions: '對話樣本',
      samples: '遙測樣本',
      calls: '呼叫紀錄',
      tokens: '觀測 Token',
      activeDays: '活躍日',
      peakContext: '上下文峰值',
      cache: '快取命中',
      favorite: '常用模型',
      heatTitle: '活動熱力圖',
      heatSub: '7 × {n} 週',
      heatHint: '{date} · {tokens} Token',
      trendTitle: 'Token 趨勢',
      trendSub: '按觀測增量聚合',
      modelsTitle: '模型分布',
      modelsSub: '按實際 Token 佔比',
      noDataTitle: '暫時未有用量數據',
      noDataBody: '等緊 DSH bridge、metrics 或本機遙測樣本。呢度唔會用隨機數字填。',
      noTrend: '呢個範圍暫時未有 Token 增量。',
      noModels: '呢個範圍暫時未有可歸屬模型嘅 Token。',
      sourceLive: 'DSH bridge 即時遙測 · 本機取樣',
      sourceHost: '宿主用量橋 · 最近同步',
      sourceEmpty: '等緊 bridge / metrics / 本機取樣',
      updated: '更新於 {time}',
      notReported: '未回報',
      tokenUnit: 'Token',
      rowIn: '輸入',
      rowOut: '輸出',
    },
    en: {
      region: 'Prism Studio home dashboard',
      title: 'Prism Studio',
      subtitle: 'Local telemetry · no synthetic data',
      overview: 'Overview',
      trend: 'Trend',
      models: 'Models',
      range7: '7d',
      range30: '30d',
      range90: '90d',
      rangeAll: 'All',
      sessions: 'Sessions',
      samples: 'Telemetry samples',
      calls: 'Calls',
      tokens: 'Observed tokens',
      activeDays: 'Active days',
      peakContext: 'Peak context',
      cache: 'Cache hit',
      favorite: 'Favorite model',
      heatTitle: 'Activity heatmap',
      heatSub: '7 × {n} weeks',
      heatHint: '{date} · {tokens} tokens',
      trendTitle: 'Token trend',
      trendSub: 'Aggregated observed deltas',
      modelsTitle: 'Model distribution',
      modelsSub: 'Share of actual tokens',
      noDataTitle: 'No usage data yet',
      noDataBody: 'Waiting for the DSH bridge, metrics, or local telemetry samples. No random values are used here.',
      noTrend: 'No token deltas in this range yet.',
      noModels: 'No model-attributed tokens in this range yet.',
      sourceLive: 'DSH bridge live telemetry · local samples',
      sourceHost: 'Host usage bridge · recent sync',
      sourceEmpty: 'Waiting for bridge / metrics / local samples',
      updated: 'Updated {time}',
      notReported: 'Not reported',
      tokenUnit: 'tokens',
      rowIn: 'in',
      rowOut: 'out',
    },
    ja: {
      region: 'Prism Studio ホームダッシュボード',
      title: 'Prism Studio',
      subtitle: 'ローカル計測 · 架空データなし',
      overview: '概要',
      trend: '推移',
      models: 'モデル',
      range7: '7日',
      range30: '30日',
      range90: '90日',
      rangeAll: '全期間',
      sessions: 'セッション',
      samples: '計測サンプル',
      calls: '呼び出し',
      tokens: '観測 Token',
      activeDays: '利用日数',
      peakContext: 'コンテキスト最大',
      cache: 'キャッシュ',
      favorite: 'よく使うモデル',
      heatTitle: 'アクティビティ',
      heatSub: '7 × {n} 週',
      heatHint: '{date} · {tokens} Token',
      trendTitle: 'Token 推移',
      trendSub: '観測増分の集計',
      modelsTitle: 'モデル分布',
      modelsSub: '実 Token の比率',
      noDataTitle: '表示できる使用量データがありません',
      noDataBody: 'DSH bridge、metrics、またはローカル計測サンプルを待っています。ランダムな値は表示しません。',
      noTrend: 'この範囲には Token 増分がありません。',
      noModels: 'この範囲にはモデル別 Token がありません。',
      sourceLive: 'DSH bridge ライブ計測 · ローカルサンプル',
      sourceHost: 'ホスト使用量ブリッジ · 最近の同期',
      sourceEmpty: 'bridge / metrics / ローカルサンプルを待機中',
      updated: '{time} 更新',
      notReported: '未報告',
      tokenUnit: 'Token',
      rowIn: '入力',
      rowOut: '出力',
    },
  });

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function finite(value) {
    if (value === null || value === undefined || value === '') return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }

  function positive(value) {
    const n = finite(value);
    return n !== null && n >= 0 ? n : null;
  }

  function textValue(value) {
    return typeof value === 'string' ? value.trim() : '';
  }

  function normalizeLanguage(raw) {
    const value = textValue(raw).toLowerCase();
    if (value === 'zh-tw' || value === 'zh-hk' || value === 'zh-mo') return 'zh-TW';
    if (value === 'yue' || value === 'zh-yue') return 'yue';
    if (value === 'ja' || value.startsWith('ja-')) return 'ja';
    if (value === 'en' || value.startsWith('en-')) return 'en';
    return 'zh-CN';
  }

  function resolveLanguage(config) {
    const configured = textValue(config?.language || config?.lang);
    if (configured && configured !== 'auto') return normalizeLanguage(configured);
    const nav = textValue(root?.navigator?.language || root?.navigator?.languages?.[0]);
    if (nav) return normalizeLanguage(nav);
    const htmlLang = textValue(root?.document?.documentElement?.lang);
    return htmlLang ? normalizeLanguage(htmlLang) : 'zh-CN';
  }

  function copyFor(lang) {
    return COPY[lang] || COPY['zh-CN'];
  }

  function formatCompact(value) {
    const n = positive(value);
    if (n === null) return '—';
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
    return String(Math.round(n));
  }

  function formatCount(value) {
    const n = positive(value);
    return n === null ? '—' : Math.round(n).toLocaleString();
  }

  function formatPercent(value) {
    const n = finite(value);
    if (n === null) return '—';
    const pct = n <= 1 ? n * 100 : n;
    return `${pct.toFixed(pct >= 10 ? 0 : 1).replace(/\.0$/, '')}%`;
  }

  function dateKey(date) {
    const d = date instanceof Date ? date : new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function startOfDay(value) {
    const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  function addDays(value, days) {
    const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
    date.setDate(date.getDate() + days);
    return date;
  }

  function formatTime(value, lang) {
    const n = finite(value);
    if (n === null) return '—';
    try {
      return new Intl.DateTimeFormat(lang === 'en' ? 'en' : lang === 'ja' ? 'ja-JP' : 'zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(n));
    } catch {
      return new Date(n).toLocaleTimeString();
    }
  }

  function formatDateLabel(value, lang) {
    try {
      return new Intl.DateTimeFormat(lang === 'en' ? 'en' : lang === 'ja' ? 'ja-JP' : 'zh-CN', {
        month: 'numeric',
        day: 'numeric',
      }).format(new Date(value));
    } catch {
      return `${new Date(value).getMonth() + 1}/${new Date(value).getDate()}`;
    }
  }

  function make(tag, className, text) {
    const node = root.document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = String(text);
    return node;
  }

  function markOwned(node) {
    node.setAttribute('data-dsh-prism-owned', '1');
    return node;
  }

  function withinOwned(node) {
    const element = node?.nodeType === 1 ? node : node?.parentElement;
    return Boolean(element?.closest?.(OWNED_SELECTOR));
  }

  function isVisible(element, win) {
    if (!element?.isConnected) return false;
    if (withinOwned(element)) return false;
    try {
      const style = win?.getComputedStyle?.(element);
      if (style && (style.display === 'none' || style.visibility === 'hidden')) return false;
    } catch {}
    return true;
  }

  function findHomeContent(doc, win) {
    const candidates = Array.from(doc?.querySelectorAll?.(HOME_SELECTOR) || []);
    let best = null;
    let bestArea = -1;
    for (const node of candidates) {
      if (!isVisible(node, win)) continue;
      const rect = node.getBoundingClientRect?.();
      const area = Math.max(0, Number(rect?.width) || 0) * Math.max(0, Number(rect?.height) || 0);
      if (area > bestArea) {
        best = node;
        bestArea = area;
      }
    }
    return best;
  }

  function findCurrentConversation(doc, win) {
    const candidates = Array.from(doc?.querySelectorAll?.('[data-conversation-content]') || []);
    let best = null;
    let bestArea = -1;
    for (const node of candidates) {
      if (!isVisible(node, win)) continue;
      const rect = node.getBoundingClientRect?.();
      const area = Math.max(0, Number(rect?.width) || 0) * Math.max(0, Number(rect?.height) || 0);
      if (area > bestArea) {
        best = node;
        bestArea = area;
      }
    }
    return best;
  }

  function createEmptyExternal() {
    return {
      days: new Map(),
      models: new Map(),
      sessions: new Set(),
      calls: 0,
      cacheRead: 0,
      inputTokens: 0,
      outputTokens: 0,
      updatedAt: 0,
      source: '',
      hasRecords: false,
    };
  }

  function sampleModel(sample) {
    return textValue(sample?.m || sample?.model) || '';
  }

  function sampleTime(sample) {
    return finite(sample?.t ?? sample?.at ?? sample?.sampledAt);
  }

  function sampleUsed(sample) {
    return positive(sample?.u ?? sample?.usedTokens);
  }

  function sampleDelta(sample) {
    return positive(sample?.d ?? sample?.deltaTokens);
  }

  function sampleSession(sample) {
    return textValue(sample?.s ?? sample?.sessionId) || '_sessionless';
  }

  function parseDateInput(value) {
    if (value instanceof Date && Number.isFinite(value.getTime())) return value;
    if (typeof value === 'number' && Number.isFinite(value)) {
      return new Date(value > 100_000_000_000 ? value : value * 1000);
    }
    if (typeof value === 'string' && value.trim()) {
      const parsed = Date.parse(value);
      if (Number.isFinite(parsed)) return new Date(parsed);
    }
    return null;
  }

  function dayRecord() {
    return { tokens: 0, calls: 0, models: new Map(), cacheRead: 0, input: 0, output: 0 };
  }

  function mergeDay(target, date, tokens, calls, models, cacheRead, input, output) {
    const key = dateKey(date);
    let row = target.get(key);
    if (!row) {
      row = dayRecord();
      target.set(key, row);
    }
    row.tokens += positive(tokens) || 0;
    row.calls += positive(calls) || 0;
    row.cacheRead += positive(cacheRead) || 0;
    row.input += positive(input) || 0;
    row.output += positive(output) || 0;
    if (models && typeof models === 'object') {
      for (const [id, raw] of Object.entries(models)) {
        const name = textValue(id);
        const amount = positive(raw);
        if (!name || !amount) continue;
        row.models.set(name, (row.models.get(name) || 0) + amount);
      }
    }
    return row;
  }

  function normalizeSample(raw) {
    if (!raw || typeof raw !== 'object') return null;
    const t = sampleTime(raw);
    const u = sampleUsed(raw);
    const x = positive(raw.x ?? raw.maxTokens);
    const d = sampleDelta(raw);
    const m = sampleModel(raw);
    if (!(t > 0) || (u === null && x === null && d === null)) return null;
    return {
      t,
      s: sampleSession(raw),
      m,
      u,
      x,
      d: d ?? 0,
      c: finite(raw.c ?? raw.cacheHitRate),
      k: textValue(raw.k ?? raw.source) || 'telemetry',
    };
  }

  function normalizeSamples(rawList) {
    if (!Array.isArray(rawList)) return [];
    const out = [];
    for (const raw of rawList) {
      const sample = normalizeSample(raw);
      if (sample) out.push(sample);
    }
    out.sort((a, b) => a.t - b.t);
    return out.slice(-SAMPLE_LIMIT);
  }

  function createController(bridge) {
    const doc = root?.document;
    const win = doc?.defaultView || root;
    if (!doc || !win) {
      return {
        start() { return this; },
        sync() {},
        refreshData: async () => {},
        getState: () => ({ visible: false, reason: 'document-unavailable' }),
        getElement: () => null,
        destroy() {},
      };
    }

    let destroyed = false;
    let started = false;
    let seat = null;
    let panel = null;
    let contentEl = null;
    let syncTimer = 0;
    let renderTimer = 0;
    let telemetryTimer = 0;
    let pollTimer = 0;
    let usageRefreshInFlight = false;
    let metricsRefreshInFlight = false;
    let lastUsageRefreshAt = 0;
    let lastMetricsRefreshAt = 0;
    let lastTelemetrySignature = '';
    let observer = null;
    let focusAfterRender = null;

    const samples = [];
    const external = createEmptyExternal();
    const unsubscribers = [];
    const listeners = [];
    const state = {
      activeTab: 'overview',
      activeRange: '30d',
      data: null,
      localSamples: 0,
      usageRecords: 0,
      lastUpdatedAt: 0,
      loading: false,
      lastError: '',
    };

    function readConfig() {
      try {
        return (typeof bridge?.getConfig === 'function' ? bridge.getConfig() : bridge?.config) || {};
      } catch {
        return {};
      }
    }

    function homeLayout(config = readConfig()) {
      const value = textValue(config.homeLayout || config.homeMode || 'studio').toLowerCase();
      return value === 'classic' || value === 'off' ? value : 'studio';
    }

    function currentSessionId() {
      const host =
        contentEl ||
        findCurrentConversation(doc, win) ||
        findHomeContent(doc, win);
      return textValue(host?.getAttribute?.('data-conversation-session')) || '_sessionless';
    }

    function storage() {
      try {
        return win.localStorage || null;
      } catch {
        return null;
      }
    }

    function loadSamples() {
      const store = storage();
      if (!store) return;
      try {
        const parsed = JSON.parse(store.getItem(SAMPLE_STORAGE_KEY) || '[]');
        const list = Array.isArray(parsed) ? parsed : parsed?.samples;
        samples.splice(0, samples.length, ...normalizeSamples(list));
        state.localSamples = samples.length;
        if (samples.length) state.lastUpdatedAt = samples[samples.length - 1].t;
      } catch {}
    }

    function saveSamples() {
      const store = storage();
      if (!store) return;
      try {
        store.setItem(SAMPLE_STORAGE_KEY, JSON.stringify(samples));
      } catch {}
    }

    function serializeExternal() {
      const days = {};
      for (const [key, row] of external.days) {
        days[key] = {
          tokens: row.tokens,
          calls: row.calls,
          models: Object.fromEntries(row.models),
          cacheRead: row.cacheRead,
          input: row.input,
          output: row.output,
        };
      }
      return {
        days,
        models: Object.fromEntries(external.models),
        sessions: Array.from(external.sessions),
        calls: external.calls,
        cacheRead: external.cacheRead,
        inputTokens: external.inputTokens,
        outputTokens: external.outputTokens,
        updatedAt: external.updatedAt,
        source: external.source,
        hasRecords: external.hasRecords,
      };
    }

    function loadExternalUsage() {
      const store = storage();
      if (!store) return;
      try {
        const cache = JSON.parse(store.getItem(USAGE_CACHE_KEY) || 'null');
        if (!cache || typeof cache !== 'object' || !cache.days) return;
        for (const [key, raw] of Object.entries(cache.days)) {
          if (!raw || typeof raw !== 'object') continue;
          const row = dayRecord();
          row.tokens = positive(raw.tokens) || 0;
          row.calls = positive(raw.calls) || 0;
          row.cacheRead = positive(raw.cacheRead) || 0;
          row.input = positive(raw.input) || 0;
          row.output = positive(raw.output) || 0;
          for (const [id, value] of Object.entries(raw.models || {})) {
            const amount = positive(value);
            if (id && amount) row.models.set(id, amount);
          }
          external.days.set(key, row);
        }
        for (const [id, value] of Object.entries(cache.models || {})) {
          const amount = positive(value);
          if (id && amount) external.models.set(id, amount);
        }
        for (const id of Array.isArray(cache.sessions) ? cache.sessions : []) {
          const value = textValue(id);
          if (value) external.sessions.add(value);
        }
        external.calls = positive(cache.calls) || 0;
        external.cacheRead = positive(cache.cacheRead) || 0;
        external.inputTokens = positive(cache.inputTokens) || 0;
        external.outputTokens = positive(cache.outputTokens) || 0;
        external.updatedAt = positive(cache.updatedAt) || 0;
        external.source = textValue(cache.source);
        external.hasRecords = Boolean(cache.hasRecords);
        if (external.hasRecords) state.usageRecords = external.sessions.size || external.days.size;
      } catch {}
    }

    function saveExternalUsage() {
      const store = storage();
      if (!store) return;
      try {
        store.setItem(USAGE_CACHE_KEY, JSON.stringify(serializeExternal()));
      } catch {}
    }

    function resetExternalUsage() {
      external.days.clear();
      external.models.clear();
      external.sessions.clear();
      external.calls = 0;
      external.cacheRead = 0;
      external.inputTokens = 0;
      external.outputTokens = 0;
      external.updatedAt = 0;
      external.source = '';
      external.hasRecords = false;
    }

    function restoreExternalUsage(snapshot) {
      resetExternalUsage();
      if (!snapshot || typeof snapshot !== 'object' || !snapshot.days) return;
      for (const [key, raw] of Object.entries(snapshot.days)) {
        if (!raw || typeof raw !== 'object') continue;
        const row = dayRecord();
        row.tokens = positive(raw.tokens) || 0;
        row.calls = positive(raw.calls) || 0;
        row.cacheRead = positive(raw.cacheRead) || 0;
        row.input = positive(raw.input) || 0;
        row.output = positive(raw.output) || 0;
        for (const [id, value] of Object.entries(raw.models || {})) {
          const amount = positive(value);
          if (id && amount) row.models.set(id, amount);
        }
        external.days.set(key, row);
      }
      for (const [id, value] of Object.entries(snapshot.models || {})) {
        const amount = positive(value);
        if (id && amount) external.models.set(id, amount);
      }
      for (const id of Array.isArray(snapshot.sessions) ? snapshot.sessions : []) {
        const value = textValue(id);
        if (value) external.sessions.add(value);
      }
      external.calls = positive(snapshot.calls) || 0;
      external.cacheRead = positive(snapshot.cacheRead) || 0;
      external.inputTokens = positive(snapshot.inputTokens) || 0;
      external.outputTokens = positive(snapshot.outputTokens) || 0;
      external.updatedAt = positive(snapshot.updatedAt) || 0;
      external.source = textValue(snapshot.source);
      external.hasRecords = Boolean(snapshot.hasRecords);
      state.usageRecords = external.sessions.size || external.days.size;
    }

    function scheduleSync() {
      if (destroyed) return;
      if (syncTimer) clearTimeout(syncTimer);
      syncTimer = win.setTimeout(() => {
        syncTimer = 0;
        sync();
      }, 70);
    }

    function scheduleRender(force = false) {
      if (destroyed) return;
      if (renderTimer) {
        if (!force) return;
        clearTimeout(renderTimer);
      }
      renderTimer = win.setTimeout(() => {
        renderTimer = 0;
        renderPanel();
      }, 36);
    }

    function pruneDuplicateSeats(keepSeat) {
      const nodes = Array.from(
        doc?.querySelectorAll?.('.dsh-prism-home-studio-seat, .ag-cs-home-panel-seat, [data-prism-home-studio="1"]') || []
      );
      for (const node of nodes) {
        if (!node || node === keepSeat) continue;
        try {
          node.parentElement?.removeChild(node);
        } catch {}
      }
    }

    function removeSeat() {
      if (seat?.parentElement) seat.parentElement.removeChild(seat);
      pruneDuplicateSeats(null);
      contentEl = null;
    }

    function mountHost() {
      const scroll = contentEl.querySelector?.('[data-conversation-scroll]') || contentEl;
      const composerSeat =
        scroll.querySelector?.(':scope > [data-composer-seat][data-conversation-region="composer"]') ||
        contentEl.querySelector?.( '[data-composer-seat][data-conversation-region="composer"]');
      if (!scroll) return false;
      if (!seat) return false;
      pruneDuplicateSeats(seat);
      if (seat.parentElement !== scroll) {
        scroll.insertBefore(seat, composerSeat && composerSeat.parentElement === scroll ? composerSeat : null);
      } else if (composerSeat && composerSeat.parentElement === scroll && seat.nextElementSibling !== composerSeat) {
        scroll.insertBefore(seat, composerSeat);
      }
      return seat.isConnected;
    }

    function ensureSeat() {
      const config = readConfig();
      const layout = homeLayout(config);
      if (layout !== 'studio') {
        removeSeat();
        return false;
      }
      const nextContent = findHomeContent(doc, win);
      if (!nextContent) {
        removeSeat();
        return false;
      }
      contentEl = nextContent;
      if (!seat) {
        seat = markOwned(make('div', 'ag-cs-home-panel-seat dsh-prism-home-studio-seat'));
        seat.setAttribute('data-prism-home-studio', '1');
        seat.setAttribute('translate', 'no');
        panel = markOwned(make('section', 'ag-cs-home-panel dsh-prism-home-studio-panel'));
        panel.setAttribute('role', 'region');
        panel.setAttribute('aria-label', copyFor(resolveLanguage(config)).region);
        panel.addEventListener('click', onPanelClick);
        panel.addEventListener('keydown', onPanelKeydown);
        panel.addEventListener('mouseover', onHeatHover);
        panel.addEventListener('mouseleave', hideHeatHint);
        seat.appendChild(panel);
      }
      return mountHost();
    }

    function setFocusAfterRender(kind, value) {
      focusAfterRender = { kind, value };
    }

    function restoreFocusAfterRender() {
      if (!focusAfterRender || !panel) return;
      const current = focusAfterRender;
      focusAfterRender = null;
      const selector =
        current.kind === 'tab'
          ? `button[data-tab="${current.value}"]`
          : `button[data-range="${current.value}"]`;
      panel.querySelector?.(selector)?.focus?.({ preventScroll: true });
    }

    function onPanelClick(event) {
      const button = event.target?.closest?.('button[data-tab], button[data-range]');
      if (!button || !panel?.contains(button)) return;
      const tab = button.getAttribute('data-tab');
      const range = button.getAttribute('data-range');
      if (tab && RANGE_DAYS[state.activeRange] !== undefined) {
        state.activeTab = tab;
        setFocusAfterRender('tab', tab);
        renderPanel();
        return;
      }
      if (range && RANGE_DAYS[range] !== undefined) {
        state.activeRange = range;
        setFocusAfterRender('range', range);
        renderPanel();
      }
    }

    function onPanelKeydown(event) {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      const tab = event.target?.closest?.('button[data-tab]');
      if (!tab || !panel?.contains(tab)) return;
      const tabs = Array.from(panel.querySelectorAll('button[data-tab]'));
      const index = tabs.indexOf(tab);
      if (index < 0) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === 'ArrowLeft') nextIndex = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      const next = tabs[nextIndex];
      const nextTab = next?.getAttribute('data-tab');
      if (!nextTab) return;
      state.activeTab = nextTab;
      setFocusAfterRender('tab', nextTab);
      renderPanel();
    }

    function hideHeatHint() {
      const hint = panel?.querySelector?.('.ag-cs-home-heat-hint');
      if (hint) hint.removeAttribute('data-shown');
    }

    function onHeatHover(event) {
      const cell = event.target?.closest?.('.ag-cs-home-heat-cell[data-tip]');
      if (!cell || !panel?.contains(cell)) return;
      const grid = cell.closest?.('.ag-cs-home-heat');
      const hint = grid?.querySelector?.('.ag-cs-home-heat-hint');
      if (!grid || !hint) return;
      const tip = cell.getAttribute('data-tip') || '';
      const width = Math.max(92, Math.min(248, tip.length * 7 + 20));
      const gridWidth = grid.clientWidth || 480;
      const gridHeight = grid.clientHeight || 96;
      const left = clamp(cell.offsetLeft + cell.offsetWidth / 2 - width / 2, 0, Math.max(0, gridWidth - width));
      const below = gridHeight - (cell.offsetTop + cell.offsetHeight);
      const top = below > 34 ? cell.offsetTop + cell.offsetHeight + 6 : Math.max(0, cell.offsetTop - 28);
      hint.textContent = tip;
      hint.style.transform = `translate3d(${Math.round(left)}px, ${Math.round(top)}px, 0)`;
      hint.setAttribute('data-shown', 'true');
    }

    function ingestTelemetry(raw, source = 'telemetry') {
      if (destroyed || !raw || typeof raw !== 'object') return false;
      const model = textValue(raw.model);
      const used = positive(raw.usedTokens ?? raw.used);
      const max = positive(raw.maxTokens ?? raw.max);
      const tps = positive(raw.tps ?? raw.latestTps);
      if (used === null && max === null && tps === null) return false;
      const cache = finite(raw.cacheHitRate ?? raw.cache);
      const sampled = parseDateInput(raw.sampledAt || raw.at || raw.savedAt);
      const at = sampled?.getTime() || Date.now();
      const sessionId = textValue(raw.sessionId) || currentSessionId();
      const signature = `${sessionId}|${model}|${used ?? ''}|${max ?? ''}|${cache ?? ''}`;
      if (signature === lastTelemetrySignature) return false;

      let previous = null;
      for (let i = samples.length - 1; i >= 0; i -= 1) {
        if (samples[i].s === sessionId) {
          previous = samples[i];
          break;
        }
      }
      let delta = 0;
      if (used !== null) {
        const priorUsed = positive(previous?.u);
        delta = priorUsed === null ? used : used >= priorUsed ? used - priorUsed : 0;
      }
      const sample = {
        t: at,
        s: sessionId,
        m: model,
        u: used,
        x: max,
        d: Math.max(0, Math.round(delta)),
        c: cache,
        k: source,
      };
      samples.push(sample);
      if (samples.length > SAMPLE_LIMIT) samples.splice(0, samples.length - SAMPLE_LIMIT);
      lastTelemetrySignature = signature;
      state.localSamples = samples.length;
      state.lastUpdatedAt = Math.max(state.lastUpdatedAt, at);
      saveSamples();
      scheduleRender(true);
      return true;
    }

    function ingestMetricsPayload(payload) {
      if (!payload || typeof payload !== 'object') return false;
      const speed = payload.speed && typeof payload.speed === 'object' ? payload.speed : null;
      const context =
        speed?.context && typeof speed.context === 'object'
          ? speed.context
          : payload.context && typeof payload.context === 'object'
            ? payload.context
            : payload.usage?.context;
      if (!context) return false;
      return ingestTelemetry(
        {
          model: context.model || speed?.model || payload.model,
          usedTokens: context.usedTokens,
          maxTokens: context.maxTokens,
          cacheHitRate: context.cacheHitRate,
          sampledAt: context.sampledAt || speed?.savedAt,
        },
        'metrics'
      );
    }

    function ingestUsageRecord(rawRecord, fallbackId = '') {
      if (!rawRecord || typeof rawRecord !== 'object') return false;
      const id = textValue(rawRecord.id || rawRecord.cascadeId || fallbackId);
      const payload =
        rawRecord.record && typeof rawRecord.record === 'object'
          ? rawRecord.record
          : rawRecord.delta && typeof rawRecord.delta === 'object'
            ? rawRecord.delta
            : rawRecord;
      let added = false;

      if (payload.days && typeof payload.days === 'object') {
        for (const [key, raw] of Object.entries(payload.days)) {
          if (!raw || typeof raw !== 'object') continue;
          const date = parseDateInput(`${key}T12:00:00`);
          if (!date) continue;
          const models = raw.models && typeof raw.models === 'object' ? raw.models : {};
          const calls = positive(raw.calls) || 0;
          const tokens =
            positive(raw.total ?? raw.tokens) ??
            ((positive(raw.input) || 0) + (positive(raw.output) || 0) + (positive(raw.cacheWrite) || 0));
          mergeDay(
            external.days,
            date,
            tokens,
            calls,
            models,
            positive(raw.cacheRead) || 0,
            positive(raw.input) || 0,
            positive(raw.output) || 0
          );
          external.calls += calls;
          external.cacheRead += positive(raw.cacheRead) || 0;
          external.inputTokens += positive(raw.input) || 0;
          external.outputTokens += positive(raw.output) || 0;
          added = true;
        }
      }

      if (!added) {
        const timestamp =
          parseDateInput(payload.lastModifiedAt || payload.modifiedAt || payload.updatedAt || payload.createdAt) ||
          parseDateInput(payload.lastModifiedSec || payload.modifiedSec || payload.createdSec);
        if (!timestamp) return false;
        const usage = payload.usage && typeof payload.usage === 'object' ? payload.usage : payload;
        const input = positive(usage.inputTokens ?? usage.input ?? usage.promptTokens) || 0;
        const output = positive(usage.outputTokens ?? usage.output ?? usage.completionTokens) || 0;
        const cacheRead = positive(usage.cacheReadTokens ?? usage.cacheRead) || 0;
        const total =
          positive(usage.totalTokens ?? usage.tokens ?? usage.total) ??
          input + output + cacheRead;
        const model =
          textValue(usage.model || usage.modelId || payload.model || payload.modelId) || '';
        const calls = positive(usage.calls ?? usage.turns ?? payload.stepCount) || 0;
        if (total <= 0 && calls <= 0) return false;
        mergeDay(
          external.days,
          timestamp,
          total,
          calls,
          model ? { [model]: total } : null,
          cacheRead,
          input,
          output
        );
        external.calls += calls;
        external.cacheRead += cacheRead;
        external.inputTokens += input;
        external.outputTokens += output;
        added = true;
      }

      if (added) {
        if (id) external.sessions.add(id);
        external.hasRecords = true;
        external.updatedAt = Date.now();
        external.source = 'usage-bridge';
        state.usageRecords = external.sessions.size || external.days.size;
        state.lastUpdatedAt = Math.max(state.lastUpdatedAt, external.updatedAt);
      }
      return added;
    }

    function withTimeout(promise, ms) {
      return new Promise((resolve, reject) => {
        let done = false;
        const timer = win.setTimeout(() => {
          if (done) return;
          done = true;
          reject(new Error('timeout'));
        }, ms);
        Promise.resolve(promise).then(
          (value) => {
            if (done) return;
            done = true;
            clearTimeout(timer);
            resolve(value);
          },
          (error) => {
            if (done) return;
            done = true;
            clearTimeout(timer);
            reject(error);
          }
        );
      });
    }

    function summaryList(payload) {
      const source = payload?.summaries ?? payload?.records ?? [];
      if (Array.isArray(source)) return source;
      if (source && typeof source === 'object') {
        return Object.entries(source).map(([id, value]) => ({ id, ...(value || {}) }));
      }
      return [];
    }

    async function refreshUsageBridge(force = false) {
      if (destroyed || usageRefreshInFlight) return false;
      const usageBridge = win.__agPrismUsageBridge;
      if (!usageBridge || typeof usageBridge.listSummaries !== 'function') return false;
      const now = Date.now();
      if (!force && now - lastUsageRefreshAt < USAGE_FETCH_COOLDOWN_MS) return false;
      try {
        if (typeof usageBridge.isOnline === 'function' && !usageBridge.isOnline()) return false;
      } catch {
        return false;
      }
      usageRefreshInFlight = true;
      state.loading = true;
      let changed = false;
      const previous = serializeExternal();
      resetExternalUsage();
      try {
        const summaryPayload = await withTimeout(usageBridge.listSummaries(8000), 9000);
        const summaries = summaryList(summaryPayload)
          .filter((item) => item && typeof item === 'object')
          .slice(0, USAGE_BATCH_LIMIT);
        const consumedIds = new Set();
        if (summaries.length && typeof usageBridge.fetchBatch === 'function') {
          const requests = summaries
            .map((summary) => ({
              id: textValue(summary.id || summary.cascadeId),
              stepCount: positive(summary.stepCount ?? summary.steps) || 0,
              lastModifiedSec: positive(summary.lastModifiedSec) || 0,
              createdSec: positive(summary.createdSec) || 0,
              subagent: Boolean(summary.subagent),
              workspace: textValue(summary.workspace),
              parentId: textValue(summary.parentId || summary.parentConversationId),
              gmOffset: 0,
            }))
            .filter((request) => request.id);
          if (requests.length) {
            const batch = await withTimeout(usageBridge.fetchBatch(requests, 18000), 15000);
            const records = Array.isArray(batch?.records) ? batch.records : [];
            for (const record of records) {
              const added = ingestUsageRecord(record, record?.id);
              changed = added || changed;
              if (added) consumedIds.add(textValue(record?.id));
            }
          }
        }
        for (const summary of summaries) {
          const id = textValue(summary.id || summary.cascadeId);
          if (id && consumedIds.has(id)) continue;
          changed = ingestUsageRecord(summary, id) || changed;
        }
        lastUsageRefreshAt = Date.now();
        if (changed) {
          saveExternalUsage();
          state.lastError = '';
          state.lastUpdatedAt = Date.now();
          scheduleRender(true);
        }
      } catch (error) {
        if (!changed) restoreExternalUsage(previous);
        state.lastError = String(error?.message || error || 'usage-bridge-unavailable');
      } finally {
        if (!changed) restoreExternalUsage(previous);
        usageRefreshInFlight = false;
        state.loading = false;
        scheduleRender();
      }
      return changed;
    }

    async function refreshMetrics(force = false) {
      if (destroyed || metricsRefreshInFlight) return false;
      const now = Date.now();
      if (!force && now - lastMetricsRefreshAt < USAGE_FETCH_COOLDOWN_MS) return false;
      const metricsBridge = win.__agPrismMetricsBridge || win.agPulseHost;
      if (!metricsBridge || typeof metricsBridge.getMetrics !== 'function') return false;
      metricsRefreshInFlight = true;
      let changed = false;
      try {
        const payload = await withTimeout(metricsBridge.getMetrics(), 7000);
        changed = ingestMetricsPayload(payload);
        lastMetricsRefreshAt = Date.now();
      } catch (error) {
        state.lastError = String(error?.message || error || 'metrics-unavailable');
      } finally {
        metricsRefreshInFlight = false;
      }
      return changed;
    }

    function refreshTelemetry() {
      if (destroyed) return false;
      let changed = false;
      try {
        const snapshot =
          (typeof bridge?.estimateTelemetry === 'function' && bridge.estimateTelemetry(doc)) ||
          (typeof bridge?.getTelemetry === 'function' && bridge.getTelemetry());
        if (snapshot) changed = ingestTelemetry(snapshot, 'bridge') || changed;
      } catch {}
      return changed;
    }

    async function refreshData(force = true) {
      if (destroyed) return;
      refreshTelemetry();
      const tasks = [];
      if (force || Date.now() - lastMetricsRefreshAt >= USAGE_FETCH_COOLDOWN_MS) tasks.push(refreshMetrics(force));
      if (force || Date.now() - lastUsageRefreshAt >= USAGE_FETCH_COOLDOWN_MS) {
        tasks.push(refreshUsageBridge(force));
      }
      await Promise.allSettled(tasks);
      scheduleRender(true);
    }

    function rangeStart(range) {
      const days = RANGE_DAYS[range] || 0;
      const today = startOfDay(new Date());
      return days ? addDays(today, -(days - 1)) : null;
    }

    function withinRange(date, range) {
      const start = rangeStart(range);
      if (!start) return true;
      const key = dateKey(date);
      return key >= dateKey(start);
    }

    function buildSamplesView(range) {
      const dayMap = new Map();
      const modelTotals = new Map();
      const sessions = new Set();
      let peakContext = null;
      let latestCache = null;
      let latestAt = 0;
      let tokenTotal = 0;
      let calls = 0;

      for (const sample of samples) {
        const at = new Date(sample.t);
        if (!withinRange(at, range)) continue;
        sessions.add(sample.s || '_sessionless');
        calls += 1;
        const used = positive(sample.u);
        if (used !== null && (peakContext === null || used > peakContext)) peakContext = used;
        if (finite(sample.c) !== null) latestCache = sample.c;
        if (sample.t >= latestAt) {
          latestAt = sample.t;
        }
        const delta = positive(sample.d) || 0;
        if (!dayMap.has(dateKey(at))) dayMap.set(dateKey(at), dayRecord());
        const day = dayMap.get(dateKey(at));
        day.calls += 1;
        if (delta > 0) {
          day.tokens += delta;
          tokenTotal += delta;
          if (sample.m) {
            day.models.set(sample.m, (day.models.get(sample.m) || 0) + delta);
            modelTotals.set(sample.m, (modelTotals.get(sample.m) || 0) + delta);
          }
        }
      }

      const activeDays = Array.from(dayMap.values()).filter((day) => day.tokens > 0 || day.calls > 0).length;
      let favorite = '';
      let favoriteTokens = -1;
      for (const [model, amount] of modelTotals) {
        if (amount > favoriteTokens) {
          favorite = model;
          favoriteTokens = amount;
        }
      }
      return {
        kind: 'samples',
        dayMap,
        modelTotals,
        sessions,
        calls,
        tokenTotal,
        activeDays,
        peakContext,
        cache: latestCache,
        favorite,
        latestAt,
      };
    }

    function buildExternalView(range) {
      const dayMap = new Map();
      const modelTotals = new Map();
      let tokenTotal = 0;
      let calls = 0;
      let cacheRead = 0;
      let inputTokens = 0;
      let latestAt = 0;
      let latestModel = '';

      for (const [key, row] of external.days) {
        const date = parseDateInput(`${key}T12:00:00`);
        if (!date || !withinRange(date, range)) continue;
        const copy = dayRecord();
        copy.tokens = row.tokens;
        copy.calls = row.calls;
        copy.cacheRead = row.cacheRead;
        copy.input = row.input;
        copy.output = row.output;
        for (const [model, amount] of row.models) {
          copy.models.set(model, amount);
          modelTotals.set(model, (modelTotals.get(model) || 0) + amount);
        }
        dayMap.set(key, copy);
        tokenTotal += row.tokens;
        calls += row.calls;
        cacheRead += row.cacheRead;
        inputTokens += row.input;
        latestAt = Math.max(latestAt, date.getTime());
      }

      let favorite = '';
      let favoriteTokens = -1;
      for (const [model, amount] of modelTotals) {
        if (amount > favoriteTokens) {
          favorite = model;
          favoriteTokens = amount;
        }
      }
      return {
        kind: 'host',
        dayMap,
        modelTotals,
        sessions: external.sessions,
        calls,
        tokenTotal,
        activeDays: Array.from(dayMap.values()).filter((day) => day.tokens > 0 || day.calls > 0).length,
        peakContext: null,
        cache: inputTokens > 0 ? cacheRead / inputTokens : null,
        favorite,
        latestAt,
      };
    }

    function buildData() {
      const sampleView = buildSamplesView(state.activeRange);
      const externalView =
        external.hasRecords && external.days.size
          ? buildExternalView(state.activeRange)
          : null;
      const useExternal = Boolean(externalView && (externalView.tokenTotal > 0 || externalView.calls > 0));
      const active = useExternal ? externalView : sampleView;
      const peak = sampleView.peakContext;
      const favorite = active.favorite || sampleView.favorite || '';
      const hasData =
        active.tokenTotal > 0 ||
        Array.from(active.dayMap.values()).some((row) => row.tokens > 0 || row.calls > 0);
      return {
        ...active,
        peakContext: peak,
        favorite,
        hasData,
        source: useExternal ? 'host' : samples.length ? 'samples' : 'none',
        latestAt: Math.max(active.latestAt || 0, state.lastUpdatedAt || 0),
      };
    }

    function buildDaySeries(data, range) {
      const today = startOfDay(new Date());
      const days = RANGE_DAYS[range] || 0;
      let start;
      if (days) start = addDays(today, -(days - 1));
      else {
        const keys = Array.from(data.dayMap.keys()).sort();
        start = keys.length ? parseDateInput(`${keys[0]}T12:00:00`) : addDays(today, -29);
        if (!start) start = addDays(today, -29);
        const oldest = addDays(today, -181);
        if (start < oldest) start = oldest;
      }
      start = startOfDay(start);
      const span = Math.max(1, Math.round((today - start) / 86400000) + 1);
      const cap = range === '90d' || range === 'all' ? 90 : span;
      if (span > cap) start = addDays(today, -(cap - 1));
      const out = [];
      for (let date = new Date(start); date <= today; date = addDays(date, 1)) {
        const key = dateKey(date);
        const row = data.dayMap.get(key);
        out.push({
          key,
          date: new Date(date),
          tokens: row?.tokens || 0,
          calls: row?.calls || 0,
          models: row?.models || new Map(),
        });
      }
      return out;
    }

    function createOrbital() {
      const orbital = make('div', 'ag-cs-orbital-backdrop');
      orbital.setAttribute('aria-hidden', 'true');
      orbital.innerHTML =
        '<svg viewBox="0 0 760 300" fill="none" preserveAspectRatio="none">' +
        '<ellipse cx="455" cy="148" rx="350" ry="116" transform="rotate(-9 455 148)"/>' +
        '<ellipse class="is-dashed" cx="455" cy="148" rx="250" ry="79" stroke-dasharray="2.5 5.5" transform="rotate(-9 455 148)"/>' +
        '<path d="M452 32h8M456 28v8M212 190h7M215.5 186.5v7M688 91h7M691.5 87.5v7"/>' +
        '<circle class="is-cobalt" cx="625" cy="55" r="2.3"/>' +
        '<circle class="is-iris" cx="302" cy="67" r="1.9"/>' +
        '<circle class="is-amber" cx="555" cy="229" r="1.9"/>' +
        '</svg>';
      return orbital;
    }

    function createHeader(copy, data) {
      const header = make('div', 'ag-cs-home-panel-head');
      const brand = make('div', 'dsh-prism-home-brand');
      const mark = make('span', 'dsh-prism-home-brand-mark');
      mark.setAttribute('aria-hidden', 'true');
      mark.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2.8 15.2 9l6.1 3-6.1 3-3.2 6.2-3.1-6.2-6.2-3 6.2-3L12 2.8Z" stroke="currentColor" stroke-width="1.25"/><circle cx="12" cy="12" r="2.2" fill="currentColor"/></svg>';
      const labels = make('div', 'dsh-prism-home-brand-labels');
      labels.appendChild(make('span', 'dsh-prism-home-brand-title', copy.title));
      labels.appendChild(make('span', 'dsh-prism-home-brand-sub', copy.subtitle));
      brand.appendChild(mark);
      brand.appendChild(labels);

      const tabs = make('div', 'ag-cs-home-tabs');
      tabs.setAttribute('role', 'tablist');
      tabs.setAttribute('aria-label', copy.title);
      for (const [id, label] of [
        ['overview', copy.overview],
        ['trend', copy.trend],
        ['models', copy.models],
      ]) {
        const button = make('button', 'ag-cs-home-tab', label);
        button.type = 'button';
        button.setAttribute('role', 'tab');
        button.setAttribute('data-tab', id);
        button.setAttribute('aria-controls', `dsh-prism-home-panel-${id}`);
        button.setAttribute('aria-selected', state.activeTab === id ? 'true' : 'false');
        if (state.activeTab === id) button.setAttribute('data-active', '');
        tabs.appendChild(button);
      }
      header.appendChild(brand);
      header.appendChild(tabs);
      header.setAttribute('data-tabs', '3');
      if (!data.hasData) header.setAttribute('data-empty', '');
      return header;
    }

    function createToolbar(copy, data) {
      const row = make('div', 'dsh-prism-home-toolbar');
      const ranges = make('div', 'ag-cs-home-ranges');
      ranges.setAttribute('role', 'group');
      ranges.setAttribute('aria-label', copy.tokens);
      for (const [id, label] of [
        ['7d', copy.range7],
        ['30d', copy.range30],
        ['90d', copy.range90],
        ['all', copy.rangeAll],
      ]) {
        const button = make('button', 'ag-cs-home-range', label);
        button.type = 'button';
        button.setAttribute('data-range', id);
        button.setAttribute('aria-pressed', state.activeRange === id ? 'true' : 'false');
        if (state.activeRange === id) button.setAttribute('data-active', '');
        ranges.appendChild(button);
      }
      const meta = make('div', 'dsh-prism-home-meta');
      const source =
        data.source === 'host'
          ? copy.sourceHost
          : data.source === 'samples'
            ? copy.sourceLive
            : copy.sourceEmpty;
      meta.appendChild(make('span', 'dsh-prism-home-source', source));
      if (data.latestAt) {
        meta.appendChild(
          make(
            'span',
            'dsh-prism-home-updated',
            copy.updated.replace('{time}', formatTime(data.latestAt, resolveLanguage(readConfig())))
          )
        );
      }
      row.appendChild(ranges);
      row.appendChild(meta);
      return row;
    }

    function createEmpty(copy) {
      const empty = make('div', 'dsh-prism-home-empty');
      const orb = make('span', 'dsh-prism-home-empty-orb');
      orb.setAttribute('aria-hidden', 'true');
      const title = make('strong', 'dsh-prism-home-empty-title', copy.noDataTitle);
      const body = make('p', 'dsh-prism-home-empty-body', copy.noDataBody);
      empty.appendChild(orb);
      empty.appendChild(title);
      empty.appendChild(body);
      return empty;
    }

    function createStatCard(label, value, detail, kind) {
      const card = make('div', 'ag-cs-home-stat');
      card.setAttribute('data-stat', kind);
      card.appendChild(make('span', 'ag-cs-home-stat-label', label));
      card.appendChild(make('span', 'ag-cs-home-stat-value', value));
      if (detail) card.appendChild(make('span', 'ag-cs-home-stat-sub', detail));
      return card;
    }

    function createOverview(copy, data) {
      const wrap = make('div', 'dsh-prism-home-view');
      if (!data.hasData) {
        wrap.appendChild(createEmpty(copy));
        return wrap;
      }
      const stats = make('div', 'ag-cs-home-stats');
      const sessions = data.sessions?.size || 0;
      const calls = positive(data.calls) || 0;
      const tokenTotal = positive(data.tokenTotal) || 0;
      const favorite = data.favorite || '—';
      const peakValue = data.peakContext === null || data.peakContext === 0 ? '—' : formatCompact(data.peakContext);
      const cache = formatPercent(data.cache);
      stats.appendChild(
        createStatCard(copy.sessions, sessions ? formatCount(sessions) : '—', sessions ? copy.sourceLive : copy.notReported, 'sessions')
      );
      stats.appendChild(
        createStatCard(
          data.kind === 'host' ? copy.calls : copy.samples,
          calls ? formatCount(calls) : '—',
          data.kind === 'host' ? copy.sourceHost : copy.sourceLive,
          'calls'
        )
      );
      stats.appendChild(createStatCard(copy.tokens, tokenTotal ? formatCompact(tokenTotal) : '—', copy.tokenUnit, 'tokens'));
      stats.appendChild(
        createStatCard(copy.activeDays, data.activeDays ? formatCount(data.activeDays) : '—', '', 'days')
      );
      stats.appendChild(
        createStatCard(copy.peakContext, peakValue, peakValue === '—' ? copy.notReported : copy.tokenUnit, 'peak')
      );
      stats.appendChild(createStatCard(copy.favorite, favorite, favorite === '—' ? copy.notReported : '', 'model'));
      wrap.appendChild(stats);

      const series = buildDaySeries(data, state.activeRange);
      const heat = make('div', 'ag-cs-home-heat');
      const aligned = [];
      const first = series[0]?.date || startOfDay(new Date());
      const offset = first.getDay();
      for (let i = 0; i < offset; i += 1) aligned.push(null);
      for (const point of series) aligned.push(point);
      while (aligned.length % 7 !== 0) aligned.push(null);
      const columns = aligned.length / 7;
      heat.style.setProperty('--dsh-prism-home-heat-columns', String(columns));
      heat.setAttribute('role', 'img');
      heat.setAttribute('aria-label', `${copy.heatTitle} · ${copy.heatSub.replace('{n}', String(columns))}`);
      const max = Math.max(0, ...series.map((point) => point.tokens));
      for (const point of aligned) {
        const cell = make('span', 'ag-cs-home-heat-cell');
        if (!point) {
          cell.setAttribute('data-empty', '1');
          cell.setAttribute('aria-hidden', 'true');
          heat.appendChild(cell);
          continue;
        }
        const ratio = max > 0 ? point.tokens / max : 0;
        const level = point.tokens <= 0 ? 0 : ratio >= 0.82 ? 5 : ratio >= 0.58 ? 4 : ratio >= 0.34 ? 3 : ratio >= 0.14 ? 2 : 1;
        cell.setAttribute('data-level', String(level));
        const tip = copy.heatHint
          .replace('{date}', point.key)
          .replace('{tokens}', formatCompact(point.tokens));
        cell.setAttribute('data-tip', tip);
        cell.setAttribute('aria-label', tip);
        heat.appendChild(cell);
      }
      const hint = make('span', 'ag-cs-home-heat-hint');
      hint.setAttribute('aria-hidden', 'true');
      heat.appendChild(hint);

      const heatSection = make('section', 'dsh-prism-home-section');
      const heatHead = make('div', 'dsh-prism-home-section-head');
      heatHead.appendChild(make('span', 'dsh-prism-home-section-title', copy.heatTitle));
      heatHead.appendChild(
        make('span', 'dsh-prism-home-section-sub', copy.heatSub.replace('{n}', String(columns)))
      );
      heatSection.appendChild(heatHead);
      heatSection.appendChild(heat);
      wrap.appendChild(heatSection);
      return wrap;
    }

    function createTrend(copy, data) {
      const wrap = make('div', 'dsh-prism-home-view');
      if (!data.hasData || !data.tokenTotal) {
        wrap.appendChild(createEmpty(copy));
        wrap.querySelector('.dsh-prism-home-empty-body').textContent = copy.noTrend;
        return wrap;
      }
      const series = buildDaySeries(data, state.activeRange);
      const max = Math.max(0, ...series.map((point) => point.tokens));
      const head = make('div', 'dsh-prism-home-section-head');
      head.appendChild(make('span', 'dsh-prism-home-section-title', copy.trendTitle));
      head.appendChild(make('span', 'dsh-prism-home-section-sub', copy.trendSub));
      wrap.appendChild(head);

      const chart = make('div', 'ag-cs-home-chart');
      const plot = make('div', 'ag-cs-home-chart-plot');
      plot.setAttribute('role', 'img');
      plot.setAttribute(
        'aria-label',
        `${copy.trendTitle}: ${formatCompact(data.tokenTotal)} ${copy.tokenUnit}, ${series.length} days`
      );
      for (const at of [1, 0.5, 0]) {
        const tick = make('span', 'ag-cs-home-chart-tick', formatCompact(max * at));
        tick.style.bottom = `${at * 100}%`;
        plot.appendChild(tick);
      }
      const bars = make('div', 'ag-cs-home-chart-bars');
      const labelEvery = Math.max(1, Math.ceil(series.length / 6));
      for (let i = 0; i < series.length; i += 1) {
        const point = series[i];
        const column = make('span', 'ag-cs-home-chart-col');
        column.style.height = `${max > 0 ? Math.max(2, (point.tokens / max) * 100) : 2}%`;
        column.title = `${point.key} · ${formatCompact(point.tokens)} ${copy.tokenUnit}`;
        column.setAttribute('data-label', i % labelEvery === 0 ? formatDateLabel(point.date, resolveLanguage(readConfig())) : '');
        const segment = make('span', 'ag-cs-home-chart-seg');
        const models = Array.from(point.models.entries()).sort((a, b) => b[1] - a[1]);
        if (models.length) {
          let cursor = 0;
          for (let index = 0; index < models.length; index += 1) {
            const [model, amount] = models[index];
            const part = make('span', 'ag-cs-home-chart-stack');
            part.setAttribute('data-color', String(hashModel(model) % HOME_COLOUR_COUNT));
            part.style.height = `${point.tokens > 0 ? (amount / point.tokens) * 100 : 0}%`;
            segment.appendChild(part);
            cursor += amount;
          }
          if (cursor < point.tokens) {
            const other = make('span', 'ag-cs-home-chart-stack');
            other.setAttribute('data-color', String(HOME_COLOUR_COUNT - 1));
            other.style.height = `${(point.tokens - cursor) / point.tokens * 100}%`;
            segment.appendChild(other);
          }
        }
        column.appendChild(segment);
        bars.appendChild(column);
      }
      plot.appendChild(bars);
      chart.appendChild(plot);
      wrap.appendChild(chart);
      return wrap;
    }

    function hashModel(name) {
      let hash = 2166136261;
      for (let i = 0; i < name.length; i += 1) {
        hash ^= name.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
      }
      return Math.abs(hash);
    }

    function createModels(copy, data) {
      const wrap = make('div', 'dsh-prism-home-view');
      const entries = Array.from(data.modelTotals.entries())
        .filter((entry) => entry[1] > 0)
        .sort((a, b) => b[1] - a[1]);
      if (!data.hasData || !entries.length) {
        wrap.appendChild(createEmpty(copy));
        wrap.querySelector('.dsh-prism-home-empty-body').textContent = copy.noModels;
        return wrap;
      }
      const total = entries.reduce((sum, entry) => sum + entry[1], 0);
      const head = make('div', 'dsh-prism-home-section-head');
      head.appendChild(make('span', 'dsh-prism-home-section-title', copy.modelsTitle));
      head.appendChild(make('span', 'dsh-prism-home-section-sub', copy.modelsSub));
      wrap.appendChild(head);

      const distribution = make('div', 'dsh-prism-home-model-distribution');
      const donut = make('div', 'dsh-prism-home-donut');
      const stops = [];
      let cursor = 0;
      entries.forEach(([model, amount], index) => {
        const start = cursor;
        cursor += (amount / total) * 100;
        const end = index === entries.length - 1 ? 100 : cursor;
        stops.push(
          `var(--dsh-prism-model-${hashModel(model) % HOME_COLOUR_COUNT}) ${start.toFixed(2)}% ${end.toFixed(2)}%`
        );
      });
      donut.style.background = `conic-gradient(${stops.join(',')})`;
      donut.setAttribute('role', 'img');
      donut.setAttribute('aria-label', `${copy.modelsTitle}: ${formatCompact(total)} ${copy.tokenUnit}`);
      const donutCore = make('span', 'dsh-prism-home-donut-core');
      donutCore.appendChild(make('strong', '', formatCompact(total)));
      donutCore.appendChild(make('small', '', copy.tokenUnit));
      donut.appendChild(donutCore);

      const list = make('div', 'ag-cs-home-models');
      entries.forEach(([model, amount]) => {
        const row = make('div', 'ag-cs-home-model');
        const swatch = make('span', 'ag-cs-home-model-swatch');
        swatch.setAttribute('data-color', String(hashModel(model) % HOME_COLOUR_COUNT));
        const name = make('span', 'ag-cs-home-model-name', model);
        name.title = model;
        const share = make('span', 'ag-cs-home-model-share', `${((amount / total) * 100).toFixed(1)}%`);
        const value = make('span', 'ag-cs-home-model-split', formatCompact(amount));
        row.appendChild(swatch);
        row.appendChild(name);
        row.appendChild(value);
        row.appendChild(share);
        list.appendChild(row);
      });
      distribution.appendChild(donut);
      distribution.appendChild(list);
      wrap.appendChild(distribution);
      return wrap;
    }

    function renderPanel() {
      if (destroyed || !ensureSeat() || !panel) return false;
      const config = readConfig();
      const lang = resolveLanguage(config);
      const copy = copyFor(lang);
      const data = buildData();
      state.data = data;
      panel.setAttribute('aria-busy', state.loading ? 'true' : 'false');
      panel.setAttribute('data-source', data.source);
      panel.setAttribute('data-empty', data.hasData ? 'false' : 'true');
      panel.setAttribute('aria-label', copy.region);
      panel.replaceChildren();
      panel.appendChild(createOrbital());
      panel.appendChild(createHeader(copy, data));
      panel.appendChild(createToolbar(copy, data));
      const body = make('div', 'dsh-prism-home-body');
      body.id = `dsh-prism-home-panel-${state.activeTab}`;
      body.setAttribute('role', 'tabpanel');
      if (!data.hasData) body.appendChild(createEmpty(copy));
      else if (state.activeTab === 'trend') body.appendChild(createTrend(copy, data));
      else if (state.activeTab === 'models') body.appendChild(createModels(copy, data));
      else body.appendChild(createOverview(copy, data));
      panel.appendChild(body);
      restoreFocusAfterRender();
      return true;
    }

    function sync() {
      if (destroyed) return;
      if (!ensureSeat()) return;
      scheduleRender(true);
    }

    function onConfigEvent(event) {
      if (destroyed) return;
      const detail = event?.detail;
      const config = detail?.config && typeof detail.config === 'object' ? detail.config : detail;
      if (config && typeof config === 'object') {
        if (config.homeLayout !== undefined || config.homeMode !== undefined) scheduleSync();
        if (config.language !== undefined || config.lang !== undefined) scheduleRender(true);
      }
      scheduleSync();
    }

    function onTelemetryEvent(event) {
      if (destroyed) return;
      ingestTelemetry(event?.detail || event, 'telemetry-event');
    }

    function onMutation(records) {
      if (destroyed) return;
      let relevant = false;
      for (const record of records || []) {
        const target = record?.target;
        if (withinOwned(target)) continue;
        if (record.type === 'attributes') {
          if (
            target?.matches?.('[data-conversation-content]') &&
            (record.attributeName === 'data-content-phase' ||
              record.attributeName === 'data-conversation-session')
          ) {
            relevant = true;
            break;
          }
          if (
            record.attributeName === 'data-prism-theme' ||
            record.attributeName === 'data-ag-cs-theme'
          ) {
            relevant = true;
            break;
          }
          continue;
        }
        if (record.addedNodes?.length || record.removedNodes?.length) {
          let structural = false;
          for (const node of Array.from(record.addedNodes || []).concat(Array.from(record.removedNodes || []))) {
            if (node?.nodeType !== 1 || withinOwned(node)) continue;
            if (
              node.matches?.('[data-conversation-content], [data-conversation-scroll], [data-composer-seat]') ||
              node.querySelector?.('[data-conversation-content], [data-conversation-scroll], [data-composer-seat]')
            ) {
              structural = true;
              break;
            }
          }
          if (structural) {
            relevant = true;
            break;
          }
        }
      }
      if (relevant) scheduleSync();
    }

    function start() {
      if (started || destroyed) return controller;
      started = true;
      loadSamples();
      loadExternalUsage();
      if (typeof bridge?.onTelemetryChange === 'function') {
        const unsubscribe = bridge.onTelemetryChange((snapshot) => ingestTelemetry(snapshot, 'bridge-subscription'));
        if (typeof unsubscribe === 'function') unsubscribers.push(unsubscribe);
        else if (unsubscribe?.unsubscribe) unsubscribers.push(() => unsubscribe.unsubscribe());
      }
      win.addEventListener('ag-prism:config', onConfigEvent);
      win.addEventListener('ag-prism:telemetry', onTelemetryEvent);
      doc.addEventListener('visibilitychange', onVisibilityChange);
      listeners.push(() => win.removeEventListener('ag-prism:config', onConfigEvent));
      listeners.push(() => win.removeEventListener('ag-prism:telemetry', onTelemetryEvent));
      listeners.push(() => doc.removeEventListener('visibilitychange', onVisibilityChange));
      if (typeof MutationObserver === 'function') {
        observer = new MutationObserver(onMutation);
        observer.observe(doc.documentElement, {
          subtree: true,
          childList: true,
          attributes: true,
          attributeFilter: [
            'data-content-phase',
            'data-conversation-session',
            'data-prism-theme',
            'data-ag-cs-theme',
          ],
        });
      }
      sync();
      if (homeLayout(readConfig()) !== 'off') void refreshData(true);
      pollTimer = win.setInterval(() => {
        if (destroyed || doc.hidden) return;
        if (homeLayout(readConfig()) === 'off') return;
        refreshTelemetry();
        if (seat?.isConnected) {
          void refreshMetrics(false);
          void refreshUsageBridge(false);
        }
      }, TELEMETRY_POLL_MS);
      return controller;
    }

    function onVisibilityChange() {
      if (destroyed) return;
      if (!doc.hidden) {
        scheduleSync();
        void refreshData(false);
      }
    }

    function destroy() {
      if (destroyed) return;
      destroyed = true;
      if (syncTimer) clearTimeout(syncTimer);
      if (renderTimer) clearTimeout(renderTimer);
      if (pollTimer) clearInterval(pollTimer);
      if (telemetryTimer) clearTimeout(telemetryTimer);
      syncTimer = renderTimer = pollTimer = telemetryTimer = 0;
      observer?.disconnect();
      observer = null;
      for (const unsubscribe of unsubscribers.splice(0)) {
        try {
          unsubscribe();
        } catch {}
      }
      for (const remove of listeners.splice(0)) {
        try {
          remove();
        } catch {}
      }
      if (panel) {
        panel.removeEventListener('click', onPanelClick);
        panel.removeEventListener('keydown', onPanelKeydown);
        panel.removeEventListener('mouseover', onHeatHover);
        panel.removeEventListener('mouseleave', hideHeatHint);
      }
      if (seat?.parentElement) seat.parentElement.removeChild(seat);
      seat = panel = contentEl = null;
      state.data = null;
    }

    const controller = {
      start,
      sync,
      render: renderPanel,
      refreshData,
      getState() {
        return {
          visible: Boolean(seat?.isConnected),
          activeTab: state.activeTab,
          activeRange: state.activeRange,
          hasData: Boolean(state.data?.hasData),
          source: state.data?.source || 'none',
          localSamples: samples.length,
          usageRecords: state.usageRecords,
          lastUpdatedAt: state.lastUpdatedAt,
          loading: state.loading,
          lastError: state.lastError,
          phase: contentEl?.getAttribute?.('data-content-phase') || null,
          samples: samples.slice(-32),
        };
      },
      getElement: () => panel,
      destroy,
    };
    return controller;
  }

  let activeInstance = null;

  function init(bridge) {
    const runtimeBridge = bridge || root?.DSHPrismBridge || null;
    const prevGlobal = root?.__dshPrismHomeStudioActive || null;
    if (prevGlobal && prevGlobal !== activeInstance && typeof prevGlobal.destroy === 'function') {
      try {
        prevGlobal.destroy();
      } catch {}
    }
    if (activeInstance) {
      if (activeInstance.__bridge === runtimeBridge) {
        activeInstance.sync();
        return activeInstance;
      }
      activeInstance.destroy();
      activeInstance = null;
    }
    const instance = createController(runtimeBridge);
    Object.defineProperty(instance, '__bridge', { value: runtimeBridge, configurable: true });
    activeInstance = instance;
    if (root && typeof root === 'object') root.__dshPrismHomeStudioActive = instance;
    instance.start();
    return instance;
  }

  function getInstance() {
    return activeInstance;
  }

  function destroy() {
    const prevGlobal = root?.__dshPrismHomeStudioActive || null;
    if (prevGlobal && prevGlobal !== activeInstance && typeof prevGlobal.destroy === 'function') {
      try {
        prevGlobal.destroy();
      } catch {}
    }
    if (activeInstance) {
      activeInstance.destroy();
      activeInstance = null;
    }
    if (root && typeof root === 'object' && root.__dshPrismHomeStudioActive) {
      root.__dshPrismHomeStudioActive = null;
    }
  }

  const api = Object.freeze({
    SAMPLE_STORAGE_KEY,
    USAGE_CACHE_KEY,
    HOME_SELECTOR,
    init,
    getInstance,
    destroy,
    createController,
  });

  function bootFromBridge() {
    if (!root?.document) return;
    // 若已有更新版本接管全局入口，卸载旧监听，避免热重载后复活出重复仪表盘
    if (root.DSHPrismHomeStudio && root.DSHPrismHomeStudio !== api) {
      root.removeEventListener?.('dsh-prism:ready', bootFromBridge);
      return;
    }
    if (root.__DSH_PRISM_NO_AUTO_BOOT__ === true || api.getInstance()) return;
    const runtimeBridge = root.DSHPrismBridge;
    if (!runtimeBridge) return;
    if (typeof runtimeBridge.registerModule === 'function') {
      runtimeBridge.registerModule('homeStudio', api);
    }
    if (!api.getInstance()) api.init(runtimeBridge);
  }

  function autoBoot() {
    bootFromBridge();
  }

  if (root?.document) {
    root.addEventListener?.('dsh-prism:ready', bootFromBridge);
    if (root.document.readyState === 'loading') {
      root.document.addEventListener('DOMContentLoaded', autoBoot, { once: true });
    } else {
      root.setTimeout?.(autoBoot, 0);
    }
  }

  return api;
});
