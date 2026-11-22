/**
 * Obsidian Prism for DeepSeek Harness (dsh) — 灵魂微件与像素伴侣模块
 * 文件: src/widgets-vial-mascot.js
 * 暴露全局对象: window.DSHPrismWidgets
 *
 * 包含三大核心灵魂组件（高保真移植自 obsidian-prism-main）:
 * 1. 浅水波物理上下文试管。24 节点模拟、玻璃折射和刻度跟随桥接提供的真实容量与用量。
 *    浮层展示模型、已观测切片、API 按量计费和 /compact 入口。
 * 2. 星空推理条嵌入 DSH 模型选择器。档位、顺序和选中态均来自原生选项，
 *    所有有效档位共用活动星空滑块；原生根菜单通过会话选择服务直接提交，菜单保持展开。
 * 3. 输入卡片上沿的 DeepSeek 深潜蓝鲸 / 星海虎鲸像素伴宠（DSHPrismCompanions）。
 */

(function (root, factory) {
  'use strict';
  const api = factory(root);
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.DSHPrismWidgets = api;
    // 兼容上游 obsidian-prism-main 全局命名空间
    if (!root.__agVialCore) root.__agVialCore = api.vialCore;
    if (!root.__agCsUsageCore) root.__agCsUsageCore = api.usageCore;
    if (!root.__agCrystalPrismCore) root.__agCrystalPrismCore = api.crystalCore;
    if (!root.__agDualMascotRig) root.__agDualMascotRig = api.mascotCore;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function (G) {
  'use strict';

  const WIDGET_STYLE_ID = 'dsh-prism-widgets-inline-css';
  const STORAGE_VIAL_MODE_KEY = 'dsh_obsidian_prism_vial_mode';
  const STORAGE_CHROMA_KEY = '__op_chroma_v1';

  // ── 公共工具函数 ─────────────────────────────────────────────────────────────
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, Number.isFinite(+v) ? +v : lo));
  const safe = (fn, fb) => {
    try {
      return fn();
    } catch {
      return fb;
    }
  };
  const nowPerf = () => (typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now());

  function readStorage(key) {
    return safe(() => (typeof localStorage !== 'undefined' ? localStorage.getItem(key) || '' : ''), '');
  }

  function writeStorage(key, val) {
    safe(() => {
      if (typeof localStorage === 'undefined') return;
      if (val === null || val === undefined) localStorage.removeItem(key);
      else localStorage.setItem(key, String(val));
    });
  }

  function isDarkRoot(doc) {
    const html = doc?.documentElement;
    if (!html) return true;
    const pt = html.getAttribute('data-prism-theme') || '';
    if (pt === 'crystal' || pt === 'alabaster') return false;
    if (pt === 'obsidian' || pt === 'warm') return true;
    const csTheme = html.getAttribute('data-ag-cs-theme') || '';
    if (csTheme === 'light') return false;
    if (csTheme === 'dark') return true;
    const cls = `${html.className || ''} ${doc?.body?.className || ''}`;
    return !/\b(?:theme-light|light-theme|light)\b/.test(cls);
  }

  function readRootThemeMeta(doc) {
    const html = doc?.documentElement;
    const dark = isDarkRoot(doc);
    const prismTheme = html?.getAttribute('data-prism-theme') || (dark ? 'obsidian' : 'crystal');
    const palette = html?.getAttribute('data-ag-cs-palette') || (prismTheme === 'warm' ? 'warm' : 'obsidian');
    const lightPreset =
      html?.getAttribute('data-ag-cs-light-preset') || (prismTheme === 'alabaster' ? 'alabaster' : 'crystal');
    const rawAccent = html?.getAttribute('data-ag-cs-accent') || html?.getAttribute('data-prism-accent') || 'follow';
    const accentTone =
      rawAccent === 'cobalt' || rawAccent === 'iris' || rawAccent === 'amber' || rawAccent === 'mono'
        ? rawAccent
        : palette === 'warm' || prismTheme === 'warm' || prismTheme === 'alabaster'
          ? 'amber'
          : 'cobalt';
    const motion = html?.getAttribute('data-ag-cs-motion') || 'ultra';
    const rawAmb = html?.getAttribute('data-ag-cs-ambient');
    let ambient = 1;
    if (rawAmb !== null && rawAmb !== undefined && rawAmb !== '') {
      const n = Number(rawAmb);
      if (Number.isFinite(n)) ambient = n > 1 ? clamp(n / 100, 0, 1) : clamp(n, 0, 1);
    }
    const lang = html?.getAttribute('data-ag-cs-lang') || 'zh-CN';
    return { isDark: dark, prismTheme, palette, lightPreset, accentTone, rawAccent, motion, ambient, lang };
  }

  function isMotionReduced(doc) {
    const meta = readRootThemeMeta(doc);
    if (meta.motion === 'off') return true;
    return Boolean(safe(() => (doc?.defaultView || G).matchMedia?.('(prefers-reduced-motion: reduce)')?.matches, false));
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // 子模块 1: 用量遥测与线性耗尽预测核心 (移植自 usage-core.js)
  // ═════════════════════════════════════════════════════════════════════════════
  const HOME_BOOKS = [
    { key: 'tao', tokens: 7607, zh: '《道德经》', en: 'Tao Te Ching' },
    { key: 'meta', tokens: 27557, zh: '《变形记》', en: 'Metamorphosis' },
    { key: 'alice', tokens: 37248, zh: '《爱丽丝漫游奇境》', en: "Alice's Adventures in Wonderland" },
    { key: 'animal', tokens: 39000, zh: '《动物农场》', en: 'Animal Farm' },
    { key: 'gatsby', tokens: 65763, zh: '《了不起的盖茨比》', en: 'The Great Gatsby' },
    { key: 'meditations', tokens: 96973, zh: '《沉思录》', en: 'Meditations' },
    { key: 'tolive', tokens: 115000, zh: '《活着》', en: 'To Live' },
    { key: 'hobbit', tokens: 123000, zh: '《霍比特人》', en: 'The Hobbit' },
    { key: '1984', tokens: 136278, zh: '《一九八四》', en: 'Nineteen Eighty-Four' },
    { key: 'walden', tokens: 152659, zh: '《瓦尔登湖》', en: 'Walden' },
    { key: 'threebody', tokens: 202000, zh: '《三体》', en: 'The Three-Body Problem' },
    { key: 'darkforest', tokens: 307000, zh: '《三体Ⅱ·黑暗森林》', en: 'The Dark Forest' },
    { key: 'deathsend', tokens: 336000, zh: '《三体Ⅲ·死神永生》', en: "Death's End" },
    { key: 'anna', tokens: 481659, zh: '《安娜·卡列尼娜》', en: 'Anna Karenina' },
    { key: 'lotr', tokens: 625000, zh: '《魔戒》', en: 'The Lord of the Rings' },
  ];

  function resolveLang(lang) {
    if (lang === 'zh-TW' || lang === 'yue' || lang === 'en' || lang === 'ja') return lang;
    return 'zh-CN';
  }

  function pickLang(map, lang) {
    const l = resolveLang(lang);
    return map[l] ?? (l === 'yue' ? map['zh-TW'] : undefined) ?? map['zh-CN'] ?? map.en ?? '';
  }

  function fmtK(n) {
    const v = Number(n) || 0;
    if (v >= 1e6) return (v / 1e6).toFixed(2).replace(/\.00$/, '') + 'M';
    if (v >= 1e3) return (v / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(Math.round(v));
  }

  // DSH can report binary context windows as well as decimal provider limits.
  function formatContextTokens(tokens) {
    if (tokens === null) return '—';
    if (tokens > 0 && tokens % 1024 === 0 && tokens % 1000 !== 0) {
      return tokens % 1048576 === 0 ? (tokens / 1048576) + 'M' : (tokens / 1024) + 'K';
    }
    return fmtK(tokens).toUpperCase();
  }

  function shortEta(ms, lang) {
    const l = resolveLang(lang);
    if (!(ms > 0) || !Number.isFinite(ms)) {
      return pickLang({ 'zh-CN': '即将刷新', 'zh-TW': '即將重設', yue: '就嚟重設', en: 'Refreshing', ja: '間もなく更新' }, l);
    }
    const totalSec = Math.max(1, Math.round(ms / 1000));
    const d = Math.floor(totalSec / 86400);
    const h = Math.floor((totalSec % 86400) / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    if (l === 'zh-CN') return d > 0 ? `${d}天${h}小时` : h > 0 ? `${h}小时${m}分` : `${Math.max(1, m)}分钟`;
    if (l === 'zh-TW') return d > 0 ? `${d}天${h}小時` : h > 0 ? `${h}小時${m}分` : `${Math.max(1, m)}分鐘`;
    if (l === 'yue') return d > 0 ? `${d}日${h}個鐘` : h > 0 ? `${h}個鐘${m}分` : `${Math.max(1, m)}分鐘`;
    if (l === 'ja') return d > 0 ? `${d}日${h}時間` : h > 0 ? `${h}時間${m}分` : `${Math.max(1, m)}分`;
    return d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${Math.max(1, m)}m`;
  }

  function quotaRemaining(bucket) {
    if (!bucket || typeof bucket !== 'object' || bucket.available === false || bucket.disabled === true) return null;
    if (bucket.expired === true) return 1;
    const r = bucket.remaining ?? bucket.remainingFraction;
    if (typeof r === 'number' && Number.isFinite(r)) return clamp(r, 0, 1);
    if (typeof r === 'string' && r.trim() !== '' && Number.isFinite(Number(r))) return clamp(Number(r), 0, 1);
    return null;
  }

  function quotaWindows(group) {
    if (!group || typeof group !== 'object') return [];
    const w5 = group.windows?.['5h'] || group.fiveHour || null;
    const ww = group.windows?.weekly || group.weekly || null;
    const out = [];
    if (w5 && quotaRemaining(w5) !== null) out.push(['5h', w5]);
    if (ww && quotaRemaining(ww) !== null) out.push(['weekly', ww]);
    return out;
  }

  /**
   * 线性消耗速率与窗口提前耗尽预测（5 小时滚动窗口 / 7 天周配额窗口）
   */
  function quotaForecast(bucket, windowKey, nowMs = Date.now()) {
    const rem = quotaRemaining(bucket);
    if (rem === null) return null;
    const spanMs = windowKey === 'weekly' ? 7 * 86400 * 1000 : 5 * 3600 * 1000;
    const rawReset = bucket?.resetAt ?? bucket?.resetTime ?? null;
    const resetMs =
      typeof rawReset === 'string'
        ? Date.parse(rawReset)
        : typeof rawReset === 'number'
          ? rawReset > 1e11
            ? rawReset
            : rawReset * 1000
          : NaN;

    if (!Number.isFinite(resetMs) || resetMs <= nowMs) {
      return {
        window: windowKey,
        remaining: rem,
        endRemaining: rem,
        forecastDrop: 0,
        willExhaust: false,
        exhaustInMs: null,
        paceRatio: 0,
        status: rem < 1 ? 'ok' : 'idle',
        resetAtMs: Number.isFinite(resetMs) ? resetMs : null,
        resetInMs: 0,
      };
    }

    const leftMs = Math.max(0, Math.min(spanMs, resetMs - nowMs));
    const elapsedMs = Math.max(0, spanMs - leftMs);
    const used = Math.max(0, 1 - rem);
    const minSmoothMs = windowKey === 'weekly' ? 2 * 3600 * 1000 : 15 * 60 * 1000;

    if (used < 0.005 || elapsedMs < 3 * 60 * 1000) {
      return {
        window: windowKey,
        remaining: rem,
        endRemaining: rem,
        forecastDrop: 0,
        willExhaust: rem <= 0.005,
        exhaustInMs: rem <= 0.005 ? 0 : null,
        paceRatio: 0,
        status: rem <= 0.005 ? 'exhaust' : 'idle',
        resetAtMs: resetMs,
        resetInMs: leftMs,
      };
    }

    const burnPerMs = used / Math.max(elapsedMs, minSmoothMs);
    const projectedExtra = burnPerMs * leftMs;
    const endRemaining = Math.max(0, Math.min(rem, rem - projectedExtra));
    const forecastDrop = Math.max(0, rem - endRemaining);
    const idealUsed = spanMs > 0 ? elapsedMs / spanMs : 0;
    const paceRatio = idealUsed > 0.02 ? used / idealUsed : used / 0.02;
    const timeToZeroMs = burnPerMs > 0 ? rem / burnPerMs : Infinity;
    const willExhaust = rem <= 0.01 || (timeToZeroMs < leftMs * 0.95 && used >= 0.06);

    let status = 'ok';
    if (willExhaust) status = 'exhaust';
    else if (paceRatio > 1.18 && used >= 0.05) status = 'tight';
    else if (used < 0.01) status = 'idle';

    return {
      window: windowKey,
      remaining: rem,
      endRemaining,
      forecastDrop,
      willExhaust,
      exhaustInMs: Number.isFinite(timeToZeroMs) && willExhaust ? Math.max(0, Math.round(timeToZeroMs)) : null,
      paceRatio: Number(paceRatio.toFixed(2)),
      status,
      resetAtMs: resetMs,
      resetInMs: leftMs,
    };
  }

  function groupQuotaPace(group, lang, nowMs = Date.now()) {
    const l = resolveLang(lang);
    const wins = quotaWindows(group);
    const forecasts = wins.map(([wk, b]) => quotaForecast(b, wk, nowMs)).filter(Boolean);
    const rank = { exhaust: 3, tight: 2, ok: 1, idle: 0 };
    let primary = null;
    for (const f of forecasts) {
      if (!primary || (rank[f.status] ?? 0) > (rank[primary.status] ?? 0)) primary = f;
    }
    const status = primary ? primary.status : 'idle';
    const label = pickLang(
      status === 'exhaust'
        ? { 'zh-CN': '提前耗尽', 'zh-TW': '提前耗盡', yue: '提早用晒', en: 'Depleting early', ja: '早期枯渇予測' }
        : status === 'tight'
          ? { 'zh-CN': '配速偏紧', 'zh-TW': '配速偏緊', yue: '進度偏緊', en: 'Burning fast', ja: '消費やや速め' }
          : status === 'ok'
            ? { 'zh-CN': '配额充裕', 'zh-TW': '配額充裕', yue: '配額充裕', en: 'On track', ja: 'ペース良好' }
            : { 'zh-CN': '待命充裕', 'zh-TW': '待命充裕', yue: '待命充裕', en: 'Standby', ja: '待機中' },
      l
    );
    let detail = '';
    if (primary) {
      if (primary.willExhaust && primary.exhaustInMs !== null) {
        const eta = shortEta(primary.exhaustInMs, l);
        detail = pickLang(
          {
            'zh-CN': `线性预测：约 ${eta}后耗尽`,
            'zh-TW': `線性預測：約 ${eta}後耗盡`,
            yue: `線性預測：約 ${eta}後用晒`,
            en: `Linear forecast: empty in ~${eta}`,
            ja: `線形予測：約${eta}で枯渇`,
          },
          l
        );
      } else if (primary.resetInMs > 0) {
        const eta = shortEta(primary.resetInMs, l);
        const endPct = Math.round(primary.endRemaining * 100);
        detail = pickLang(
          {
            'zh-CN': `${eta}后重置 · 线性预计结余 ${endPct}%`,
            'zh-TW': `${eta}後重設 · 線性預計結餘 ${endPct}%`,
            yue: `${eta}後重設 · 預計剩 ${endPct}%`,
            en: `Resets in ${eta} · Est. ${endPct}% left`,
            ja: `${eta}後に更新 · 予測残 ${endPct}%`,
          },
          l
        );
      }
    }
    return { status, label, detail, primary, forecasts };
  }

  function matchBookYardstick(tokens, lang) {
    const t = Math.max(0, Number(tokens) || 0);
    if (t < 3000) return '';
    let best = HOME_BOOKS[0];
    for (let i = 0; i < HOME_BOOKS.length; i++) {
      if (t >= HOME_BOOKS[i].tokens * 0.65) best = HOME_BOOKS[i];
    }
    const mult = (t / best.tokens).toFixed(1).replace(/\.0$/, '');
    const l = resolveLang(lang);
    const title = l === 'en' ? best.en : best.zh;
    return l === 'en' ? `≈ ${mult}× ${title}` : `约相当于 ${mult} 本${title}`;
  }

  const usageCore = {
    HOME_BOOKS,
    fmtK,
    shortEta,
    quotaRemaining,
    quotaWindows,
    quotaForecast,
    groupQuotaPace,
    matchBookYardstick,
  };

  // ═════════════════════════════════════════════════════════════════════════════
  // 子模块 2: 浅水波物理光学上下文试管引擎 (移植自 vial-core.js)
  // ═════════════════════════════════════════════════════════════════════════════
  const VIAL_WAVE_NODES = 24;
  const VIAL_TUBE_X = 34;
  const VIAL_TUBE_OUT_R = 21.6;
  const VIAL_TUBE_IN_R = 19.6;
  const VIAL_LIP_Y = 18.5;
  const VIAL_TOP_OUT = 18.5;
  const VIAL_TOP_IN = 20.5;
  const VIAL_RC_TOP_IN = 12.5;
  const VIAL_HEM_Y = 175.0;
  const VIAL_FLOOR_OUT = 198.0;
  const VIAL_FLOOR_IN = 195.0;
  const VIAL_RC_OUT = 14.5;
  const VIAL_RC_IN = 12.5;
  const VIAL_FIXED_DT = 1 / 120;
  const VIAL_MAX_FRAME_DT = 0.05;
  const VIAL_MAX_SUBSTEPS = 8;
  const VIAL_GRAVITY = 460.0;
  const VIAL_SETTLE_MIN_AGE = 1.1;

  const clampFill = (v) => clamp(v ?? 0.46, 0.06, 0.95);

  /**
   * 24 节点 1D 阻尼浅水波 + 高阻尼水平仪重力摆 + 挂壁润湿 + 液滴激波 + 星尘微泡
   */
  function createWaterVialPhysics(initialOptions = {}) {
    const waveH = new Float32Array(VIAL_WAVE_NODES);
    const waveV = new Float32Array(VIAL_WAVE_NODES);

    let fill = clampFill(initialOptions.fill ?? 0.46);
    let targetFill = fill;
    let streaming = Boolean(initialOptions.streaming);
    let tiltAngle = 0;
    let tiltVel = 0;
    let tiltAcc = 0;
    let wetLeft = 0;
    let wetRight = 0;
    let pendantProgress = 0;
    let streamClock = 0;
    let dustCooldown = 0.42;
    let accumulator = 0;
    const fallingDrops = [];
    const bubbles = [];
    const dropPool = [];
    const bubblePool = [];

    const getSurfaceYNormalized = () => 1 - fill;
    const getSurfacePixelY = () => {
      const top = VIAL_LIP_Y + 8;
      const bot = VIAL_HEM_Y + 14;
      return bot - fill * (bot - top);
    };

    const sampleWaveAt = (normX) => {
      const t = clamp((normX + 1) * 0.5, 0, 1) * (VIAL_WAVE_NODES - 1);
      const i0 = Math.min(VIAL_WAVE_NODES - 2, Math.floor(t));
      const f = t - i0;
      return waveH[i0] * (1 - f) + waveH[i0 + 1] * f;
    };

    const localSurfaceY = (xPx) => getSurfacePixelY() + Math.tan(tiltAngle) * xPx + sampleWaveAt(xPx / VIAL_TUBE_IN_R);

    const boreHalfWidthAt = (yPx) => {
      if (yPx <= VIAL_TOP_IN || yPx >= VIAL_FLOOR_IN) return 0;
      const cyTop = VIAL_TOP_IN + VIAL_RC_TOP_IN;
      if (yPx < cyTop) {
        const dt = cyTop - yPx;
        return VIAL_TUBE_IN_R - VIAL_RC_TOP_IN + Math.sqrt(Math.max(0, VIAL_RC_TOP_IN * VIAL_RC_TOP_IN - dt * dt));
      }
      const cyBot = VIAL_FLOOR_IN - VIAL_RC_IN;
      const db = yPx - cyBot;
      if (db <= 0) return VIAL_TUBE_IN_R;
      return db >= VIAL_RC_IN
        ? VIAL_TUBE_IN_R - VIAL_RC_IN
        : VIAL_TUBE_IN_R - VIAL_RC_IN + Math.sqrt(Math.max(0, VIAL_RC_IN * VIAL_RC_IN - db * db));
    };

    const spawnSplashBubbles = (normX, count, gentle = false) => {
      const surfY = getSurfacePixelY();
      for (let i = 0; i < count; i++) {
        if (bubbles.length >= 10) bubblePool.push(bubbles.shift());
        const b = bubblePool.pop() || {};
        b.y = gentle
          ? Math.min(VIAL_HEM_Y + 10, Math.max(surfY + 14, VIAL_FLOOR_IN - 12 - Math.random() * 18))
          : Math.min(VIAL_HEM_Y + 11, surfY + 5 + Math.random() * 14);
        b.r = gentle ? 0.95 + Math.random() * 0.65 : 1.3 + Math.random() * 1.45;
        const maxX = Math.max(2, boreHalfWidthAt(b.y) - b.r - 1.2);
        b.x = clamp(normX * (VIAL_TUBE_IN_R - 4) + (Math.random() - 0.5) * 8, -maxX, maxX);
        b.vx = (Math.random() - 0.5) * (gentle ? 3.5 : 9.0);
        b.vy = gentle ? -(14 + Math.random() * 9) : -(22 + Math.random() * 24);
        b.phase = Math.random() * Math.PI * 2;
        b.aspect = 1.0;
        b.alpha = gentle ? 0.72 : 0.92;
        b.gentle = gentle;
        bubbles.push(b);
      }
    };

    const injectWaveRange = (centerNorm, widthNodes, ampVel) => {
      const idxF = clamp((centerNorm + 1) * 0.5 * (VIAL_WAVE_NODES - 1), 0, VIAL_WAVE_NODES - 1);
      for (let i = 0; i < VIAL_WAVE_NODES; i++) {
        const d = Math.abs(i - idxF);
        if (d <= widthNodes) {
          const w = 0.5 * (1 + Math.cos((d / Math.max(1, widthNodes)) * Math.PI));
          waveV[i] = clamp(waveV[i] + ampVel * w, -65, 65);
        }
      }
    };

    const injectSlosh = (impulse = 1.6) => {
      const s = clamp(impulse, -3.8, 3.8);
      tiltVel += s * 1.85;
      for (let i = 0; i < VIAL_WAVE_NODES; i++) {
        const norm = (i / (VIAL_WAVE_NODES - 1)) * 2 - 1;
        waveV[i] += norm * s * 18.0 + Math.sin(norm * 4.2) * Math.abs(s) * 4.2;
      }
      if (Math.abs(s) > 0.85) spawnSplashBubbles(s > 0 ? 0.25 : -0.25, 2, false);
    };

    const injectTilt = (angleOrImpulse = 0.18) => {
      const s = clamp(angleOrImpulse, -1.6, 1.6);
      tiltAngle = clamp(tiltAngle + s * 0.45, -0.48, 0.48);
      tiltVel += s * 2.2;
      for (let i = 0; i < VIAL_WAVE_NODES; i++) {
        const norm = (i / (VIAL_WAVE_NODES - 1)) * 2 - 1;
        waveV[i] += norm * s * 12.0;
      }
    };

    const injectFingerPoke = (normX = 0, normY = 0.5, vx = 0, vy = 0) => {
      const nx = clamp(normX, -1, 1);
      const nearSurface = Math.abs(normY - getSurfaceYNormalized()) < 0.22;
      const pushX = clamp(vx * 0.14, -2.6, 2.6);
      if (nearSurface) {
        injectWaveRange(nx, 4.5, -24 + vy * 1.4);
        tiltVel += pushX * 0.62;
        if (nx < -0.35) wetLeft = Math.min(0.42, wetLeft + 0.16);
        if (nx > 0.35) wetRight = Math.min(0.42, wetRight + 0.16);
        spawnSplashBubbles(nx * 0.7, 2, false);
      } else {
        injectWaveRange(nx, 3.2, -11.5);
        tiltVel += (pushX !== 0 ? pushX : nx * 0.4) * 0.44;
      }
    };

    const spawnDropletNow = () => {
      if (fallingDrops.length >= 4) return;
      pendantProgress = 0;
      const d = dropPool.pop() || {};
      d.x = (Math.random() - 0.5) * 1.8;
      d.y = VIAL_LIP_Y + 5.0;
      d.vx = 0;
      d.vy = 38.0;
      d.r = 2.55;
      fallingDrops.push(d);
    };

    const computeEnergy = () => {
      let e = 0;
      for (let i = 0; i < VIAL_WAVE_NODES; i++) e += Math.abs(waveH[i]) + Math.abs(waveV[i]) * 0.05;
      return e;
    };

    const subStep = (dt) => {
      const diffFill = targetFill - fill;
      if (Math.abs(diffFill) < 0.00018) fill = targetFill;
      else fill += diffFill * Math.min(1, dt * 6.0);

      const omegaT = 7.2;
      const zetaT = 0.4;
      let streamTorque = 0;
      if (streaming) {
        streamClock += dt;
        streamTorque = Math.sin(streamClock * 1.55) * 0.22 + Math.sin(streamClock * 2.7 + 1.1) * 0.09;
      }
      const accT = -2 * zetaT * omegaT * tiltVel - omegaT * omegaT * tiltAngle + streamTorque;
      tiltAcc = accT;
      tiltVel += accT * dt;
      tiltAngle = clamp(tiltAngle + tiltVel * dt, -0.48, 0.48);
      if (!streaming && Math.abs(tiltAngle) < 0.00035 && Math.abs(tiltVel) < 0.0012) {
        tiltAngle = 0;
        tiltVel = 0;
        tiltAcc = 0;
      }
      const sinT = Math.sin(tiltAngle);
      const cosT = Math.cos(tiltAngle);

      if (tiltAngle < -0.11) wetLeft = Math.max(wetLeft, Math.min(0.42, (-tiltAngle - 0.08) * 1.15));
      if (tiltAngle > 0.11) wetRight = Math.max(wetRight, Math.min(0.42, (tiltAngle - 0.08) * 1.15));

      const c2 = 380.0;
      const damp = 2.65;
      const restore = 26.0;
      const tiltPump = -tiltAcc * 0.3;
      for (let i = 0; i < VIAL_WAVE_NODES; i++) {
        const hL = i > 0 ? waveH[i - 1] : waveH[0];
        const hR = i < VIAL_WAVE_NODES - 1 ? waveH[i + 1] : waveH[VIAL_WAVE_NODES - 1];
        const norm = (i / (VIAL_WAVE_NODES - 1)) * 2 - 1;
        const acc = c2 * (hL + hR - 2 * waveH[i]) - damp * waveV[i] - restore * waveH[i] + tiltPump * norm;
        waveV[i] += acc * dt;
      }
      let sumH = 0;
      for (let i = 0; i < VIAL_WAVE_NODES; i++) {
        waveH[i] = clamp(waveH[i] + waveV[i] * dt, -10, 10);
        sumH += waveH[i];
      }
      const meanFix = (sumH / VIAL_WAVE_NODES) * 0.025;
      let restEnergy = 0;
      for (let i = 0; i < VIAL_WAVE_NODES; i++) {
        waveH[i] -= meanFix;
        restEnergy += Math.abs(waveH[i]) + Math.abs(waveV[i]) * 0.05;
      }
      if (!streaming && tiltAngle === 0 && tiltVel === 0 && restEnergy < 0.05) {
        waveH.fill(0);
        waveV.fill(0);
      }

      const runL = -waveH[0] - 1.2;
      const runR = -waveH[VIAL_WAVE_NODES - 1] - 1.2;
      if (runL > 0) wetLeft = Math.max(wetLeft, Math.min(0.42, runL * 0.035));
      if (runR > 0) wetRight = Math.max(wetRight, Math.min(0.42, runR * 0.035));
      wetLeft = Math.max(0, wetLeft - dt * 0.14);
      wetRight = Math.max(0, wetRight - dt * 0.14);

      pendantProgress = Math.max(0, pendantProgress - dt * 2.0);
      if (streaming && fill > 0.14 && fallingDrops.length === 0) {
        dustCooldown -= dt;
        if (dustCooldown <= 0 && bubbles.length < 4) {
          dustCooldown = 0.62 + Math.random() * 0.45;
          spawnSplashBubbles((Math.random() - 0.5) * 1.1, 1, true);
        }
      }

      for (let i = fallingDrops.length - 1; i >= 0; i--) {
        const d = fallingDrops[i];
        d.vx += -VIAL_GRAVITY * sinT * dt;
        d.vy += VIAL_GRAVITY * cosT * dt;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        const limD = Math.max(0, boreHalfWidthAt(d.y) - d.r - 0.6);
        if (d.x < -limD) {
          d.x = -limD;
          d.vx = Math.abs(d.vx) * 0.12;
          wetLeft = Math.max(wetLeft, 0.12);
        } else if (d.x > limD) {
          d.x = limD;
          d.vx = -Math.abs(d.vx) * 0.12;
          wetRight = Math.max(wetRight, 0.12);
        }
        if (d.y >= localSurfaceY(d.x) - 1.5) {
          const normDropX = d.x / VIAL_TUBE_IN_R;
          injectWaveRange(normDropX, 4.2, -32.0);
          spawnSplashBubbles(normDropX, 3, false);
          dropPool.push(d);
          fallingDrops.splice(i, 1);
        }
      }

      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.phase += dt * (b.gentle ? 3.8 : 5.8 + 2.0 / b.r);
        const rise = b.gentle ? 16 + b.r * 5 : 25 + b.r * 8;
        const relax = Math.min(1, dt * 3.0);
        b.vx += (sinT * rise - b.vx) * relax;
        b.vy += (-cosT * rise - b.vy) * relax;
        const wob = Math.sin(b.phase) * (b.gentle ? 3.2 : 5.6 + b.r * 2.2);
        b.x += (b.vx + cosT * wob) * dt;
        b.y += (b.vy + sinT * wob) * dt;
        b.aspect = 1 + (b.gentle ? 0.1 : 0.18) * Math.sin(b.phase * 2 + 0.6);
        const limB = Math.max(0, boreHalfWidthAt(b.y) - b.r - 1.0);
        b.x = clamp(b.x, -limB, limB);
        b.y = Math.min(VIAL_HEM_Y + 11, b.y);
        if (b.y <= localSurfaceY(b.x) + 2.5) {
          injectWaveRange(b.x / VIAL_TUBE_IN_R, 2.0, b.gentle ? -0.6 : -4.4);
          bubblePool.push(b);
          bubbles.splice(i, 1);
        }
      }
    };

    const step = (dtRaw) => {
      const dt = clamp(dtRaw || 0.016, 0.001, VIAL_MAX_FRAME_DT);
      accumulator += dt;
      let n = 0;
      while (accumulator >= VIAL_FIXED_DT && n < VIAL_MAX_SUBSTEPS) {
        subStep(VIAL_FIXED_DT);
        accumulator -= VIAL_FIXED_DT;
        n++;
      }
      if (n >= VIAL_MAX_SUBSTEPS) accumulator = 0;
    };

    const isSettled = () => {
      if (streaming || fallingDrops.length > 0 || bubbles.length > 0) return false;
      if (Math.abs(targetFill - fill) >= 0.001) return false;
      if (Math.abs(tiltAngle) >= 0.005 || Math.abs(tiltVel) >= 0.015) return false;
      if (computeEnergy() >= 0.24) return false;
      if (wetLeft >= 0.06 || wetRight >= 0.06) return false;
      return true;
    };

    const readSnapshotInto = (out) => {
      out.fill = fill;
      out.targetFill = targetFill;
      out.tiltAngle = tiltAngle;
      out.tiltVel = tiltVel;
      out.waveEnergy = computeEnergy();
      out.pendantSize = pendantProgress;
      out.fallingCount = fallingDrops.length;
      out.bubbleCount = bubbles.length;
      out.wetLeft = wetLeft;
      out.wetRight = wetRight;
      out.streaming = streaming;
      return out;
    };

    return {
      waveH,
      fallingDrops,
      bubbles,
      readSnapshotInto,
      setTargetFill: (next) => { targetFill = clampFill(next); },
      snapFillNow: (next) => { targetFill = clampFill(next ?? targetFill); fill = targetFill; },
      setStreaming: (on) => { streaming = Boolean(on); },
      injectSlosh,
      injectTilt,
      injectFingerPoke,
      spawnDropletNow,
      getSurfacePixelY,
      sampleWaveAt,
      isSettled,
      step,
      getSnapshot: () => readSnapshotInto({}),
    };
  }

  function traceClosedCapsule(ctx, cx, rSide, topY, botY, rTop, rBot) {
    const rt = Math.max(0, Math.min(rTop, rSide));
    const rb = Math.max(0, Math.min(rBot, rSide));
    const leftX = cx - rSide;
    const rightX = cx + rSide;
    ctx.beginPath();
    ctx.moveTo(leftX + rt, topY);
    ctx.lineTo(rightX - rt, topY);
    ctx.arcTo(rightX, topY, rightX, topY + rt, rt);
    ctx.lineTo(rightX, botY - rb);
    ctx.arcTo(rightX, botY, rightX - rb, botY, rb);
    ctx.lineTo(leftX + rb, botY);
    ctx.arcTo(leftX, botY, leftX, botY - rb, rb);
    ctx.lineTo(leftX, topY + rt);
    ctx.arcTo(leftX, topY, leftX + rt, topY, rt);
    ctx.closePath();
  }

  // WebGL2 光学水试管片段着色器（深空电离 + 白昼高硼硅玻璃）
  const VIAL_VERT_SRC = `#version 300 es
    in vec2 a_pos;
    out vec2 v_uv;
    void main() { v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos, 0.0, 1.0); }
  `;

  const VIAL_FRAG_SRC = `#version 300 es
    precision highp float;
    in vec2 v_uv;
    out vec4 outColor;
    uniform float u_time;
    uniform float u_dark;
    uniform float u_fill;
    uniform float u_tilt;
    uniform float u_accent;
    uniform float u_critical;
    uniform float u_wetL;
    uniform float u_wetR;
    uniform float u_hoverSlice;
    uniform float u_wave[24];
    uniform vec4 u_drops[4];
    uniform vec4 u_bubbles[8];
    uniform vec3 u_ratios;

    const float CX = 34.0;
    const float R_OUT = 21.6;
    const float R_IN = 19.6;
    const float TOP_OUT = 18.5;
    const float TOP_IN = 20.5;
    const float LIP_Y = 18.5;
    const float HEM_Y = 175.0;
    const float FLOOR_OUT = 198.0;
    const float FLOOR_IN = 195.0;
    const float RC_OUT = 14.5;
    const float RC_IN = 12.5;
    const float H_BOX_OUT = 89.75;
    const float Y_MID_OUT = 108.25;
    const float H_BOX_IN = 87.25;
    const float Y_MID_IN = 107.75;

    const vec3 ION_DEEP = vec3(0.059, 0.090, 0.227);
    const vec3 ION_SYS = vec3(0.106, 0.286, 0.698);
    const vec3 ION_CONV = vec3(0.192, 0.525, 1.000);
    const vec3 ION_TOOL = vec3(0.361, 0.776, 0.988);
    const vec3 ION_HAZE = vec3(0.690, 0.875, 1.000);
    const vec3 DAY_AIR = vec3(0.880, 0.920, 0.980);
    const vec3 DAY_RIM_REF = vec3(0.118, 0.251, 0.686);
    const vec3 DAY_ROYAL = vec3(0.114, 0.306, 0.847);
    const vec3 DAY_COBALT = vec3(0.145, 0.388, 0.922);
    const vec3 DAY_SKY = vec3(0.008, 0.518, 0.780);
    const vec3 DAY_MENISCUS = vec3(0.016, 0.275, 0.635);
    const vec3 DAY_VIOLET = vec3(0.486, 0.227, 0.929);
    const vec3 DAY_AMBER_RED = vec3(0.918, 0.345, 0.047);
    const vec3 CRIT_DEEP = vec3(0.360, 0.145, 0.035);
    const vec3 CRIT_SYS = vec3(0.740, 0.330, 0.075);
    const vec3 CRIT_CONV = vec3(0.945, 0.600, 0.070);
    const vec3 CRIT_TOOL = vec3(0.995, 0.835, 0.310);

    void layerOver(inout vec3 col, inout float alpha, vec3 srcCol, float srcA) {
      float a = clamp(srcA, 0.0, 1.0);
      if (a <= 1e-4) return;
      float outA = a + alpha * (1.0 - a);
      col = (srcCol * a + col * alpha * (1.0 - a)) / max(outA, 1e-4);
      alpha = outA;
    }

    float roundedBoxSdf(vec2 p, vec2 halfExt, float r) {
      vec2 d = abs(p) - (halfExt - vec2(r));
      return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - r;
    }

    float sampleWave(float uNorm) {
      float t = clamp((uNorm + 1.0) * 0.5, 0.0, 1.0) * 23.0;
      int i1 = int(clamp(floor(t), 0.0, 22.0));
      float f = t - float(i1);
      return mix(u_wave[i1], u_wave[i1 + 1], f);
    }

    float hash12(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    float capsuleHalfWidth(float yPx, float topY, float botY, float rSide, float rc) {
      if (yPx < topY || yPx > botY) return 0.0;
      float cyT = topY + rc;
      if (yPx < cyT) { float dt = cyT - yPx; return rSide - rc + sqrt(max(0.0, rc * rc - dt * dt)); }
      float cyB = botY - rc;
      if (yPx > cyB) { float db = yPx - cyB; return rSide - rc + sqrt(max(0.0, rc * rc - db * db)); }
      return rSide;
    }

    vec3 evalSpectrum(float hFrac) {
      float h = clamp(hFrac, 0.0, 1.0);
      if (u_dark > 0.5) {
        vec3 crit = mix(mix(CRIT_DEEP, CRIT_SYS, smoothstep(0.0, 0.36, h)), mix(CRIT_CONV, CRIT_TOOL, smoothstep(0.55, 1.0, h)), smoothstep(0.30, 0.78, h));
        if (u_accent > 2.5) return mix(mix(vec3(0.11, 0.115, 0.13), vec3(0.84, 0.85, 0.88), h), crit, u_critical);
        if (u_accent > 1.5) return mix(mix(vec3(0.22, 0.09, 0.02), vec3(0.98, 0.75, 0.14), h), crit, u_critical);
        if (u_accent > 0.5) return mix(mix(vec3(0.11, 0.05, 0.26), vec3(0.77, 0.62, 0.99), h), crit, u_critical);
        vec3 sea = mix(mix(ION_DEEP, ION_SYS, smoothstep(0.0, 0.38, h)), mix(ION_CONV, ION_TOOL, smoothstep(0.62, 1.0, h)), smoothstep(0.32, 0.78, h));
        return mix(sea, crit, u_critical);
      }
      vec3 dayCrit = mix(DAY_VIOLET, DAY_AMBER_RED, smoothstep(0.25, 0.85, h));
      if (u_accent > 2.5) return mix(mix(vec3(0.16, 0.16, 0.18), vec3(0.46, 0.46, 0.50), h), dayCrit, u_critical);
      if (u_accent > 1.5) return mix(mix(vec3(0.71, 0.32, 0.04), vec3(0.96, 0.62, 0.05), h), dayCrit, u_critical);
      if (u_accent > 0.5) return mix(mix(vec3(0.36, 0.13, 0.72), vec3(0.66, 0.33, 0.97), h), dayCrit, u_critical);
      vec3 daySea = mix(mix(DAY_ROYAL, DAY_COBALT, smoothstep(0.0, 0.5, h)), DAY_SKY, smoothstep(0.45, 1.0, h));
      return mix(daySea, dayCrit, u_critical);
    }

    void main() {
      vec2 px = vec2(v_uv.x * 96.0, (1.0 - v_uv.y) * 220.0);
      float dx = px.x - CX;
      float distOut = -roundedBoxSdf(vec2(dx, px.y - Y_MID_OUT), vec2(R_OUT, H_BOX_OUT), RC_OUT);
      if (distOut <= -0.8) { outColor = vec4(0.0); return; }
      float distIn = -roundedBoxSdf(vec2(dx, px.y - Y_MID_IN), vec2(R_IN, H_BOX_IN), RC_IN);
      float rOutAtY = capsuleHalfWidth(px.y, TOP_OUT, FLOOR_OUT, R_OUT, RC_OUT);
      float rInAtY = capsuleHalfWidth(px.y, TOP_IN, FLOOR_IN, R_IN, RC_IN);
      float bodyAA = smoothstep(-0.55, 0.45, distOut);
      float uOut = clamp(dx / max(1.0, rOutAtY), -1.0, 1.0);
      float uIn = (rInAtY > 0.5) ? clamp(dx / rInAtY, -1.0, 1.0) : clamp(dx / R_IN, -1.0, 1.0);
      vec3 col = vec3(0.0);
      float alpha = 0.0;

      float topChamber = LIP_Y + 8.0;
      float botChamber = HEM_Y + 14.0;
      float baseSurfY = botChamber - u_fill * (botChamber - topChamber);
      float slopeTilt = tan(u_tilt) * dx;
      float waveDisp = sampleWave(uIn);
      float surfCenterY = baseSurfY + slopeTilt + waveDisp - 1.55 * pow(abs(uIn), 3.0);
      float perspAmp = (rInAtY > 0.0) ? (0.205 * rInAtY * sqrt(max(0.0, 1.0 - uIn * uIn))) : 0.0;
      float surfBackY = surfCenterY - perspAmp;
      float surfFrontY = surfCenterY + perspAmp;

      float colH = max(12.0, FLOOR_IN - baseSurfY);
      float hFrac = clamp((FLOOR_IN - (px.y - slopeTilt * 0.72 - waveDisp * 0.45)) / colH, 0.0, 1.0);
      vec3 ionBase = evalSpectrum(hFrac);
      vec3 surfTint = evalSpectrum(0.96);

      // 空气底衬
      vec3 airCol = u_dark > 0.5 ? vec3(0.045, 0.068, 0.125) : DAY_AIR;
      float airA = u_dark > 0.5 ? 0.12 * (0.3 + 0.7 * pow(abs(uOut), 3.2)) : mix(0.26, 0.42, pow(abs(uOut), 2.5));
      layerOver(col, alpha, airCol, airA * bodyAA);

      if (u_dark <= 0.5) {
        float refractMask = clamp(max(smoothstep(3.4, 0.8, distOut), smoothstep(0.66, 0.98, abs(uOut))) * bodyAA, 0.0, 1.0);
        layerOver(col, alpha, DAY_RIM_REF, refractMask * 0.26);
      }

      // 能量液柱与星尘微泡
      if (distIn > -0.6 && px.y >= surfBackY - 0.6) {
        float boreMask = smoothstep(-0.45, 0.55, distIn) * smoothstep(-0.5, 0.5, px.y - surfBackY);
        float nz = sqrt(max(0.0, 1.0 - uIn * uIn));
        float depthPx = max(0.0, px.y - surfCenterY);
        vec3 body = ionBase * (0.76 + 0.24 * nz);
        body += surfTint * exp(-depthPx / 8.0) * (0.35 + 0.65 * nz) * 0.20;
        layerOver(col, alpha, clamp(body, 0.0, 1.0), boreMask * 0.92);

        if (depthPx > 2.0) {
          vec2 sUv = vec2(asin(clamp(uIn, -0.96, 0.96)) * R_IN / 6.0, (px.y + u_time * 6.0) / 6.0);
          float rnd = hash12(floor(sUv) + vec2(3.7, 9.1));
          float dMask = 1.0 - smoothstep(0.08, 0.20, length(fract(sUv) - 0.5));
          float vis = dMask * step(0.42, rnd) * (0.4 + 0.6 * exp(-depthPx / 50.0)) * nz * boreMask;
          layerOver(col, alpha, u_dark > 0.5 ? ION_HAZE : vec3(0.95, 0.99, 1.0), vis * 0.62);
        }

        for (int i = 0; i < 8; i++) {
          vec4 b = u_bubbles[i];
          if (b.w <= 0.0 || px.y < surfCenterY + 1.0) continue;
          float bd = length(px - vec2(CX + b.x, b.y)) / max(0.6, b.z);
          if (bd > 2.2) continue;
          float core = (1.0 - smoothstep(0.25, 0.80, bd)) * b.w * boreMask;
          layerOver(col, alpha, vec3(0.95, 0.99, 1.0), core * 0.85);
        }
      }

      // 3D 弯月面刀锋
      if (distIn > -0.6) {
        float boreMask = smoothstep(-0.35, 0.55, distIn);
        if (px.y >= surfBackY - 0.5 && px.y <= surfFrontY + 0.5) {
          float discMask = smoothstep(-0.45, 0.45, px.y - surfBackY) * smoothstep(-0.45, 0.45, surfFrontY - px.y) * boreMask;
          layerOver(col, alpha, mix(surfTint, vec3(0.9, 0.96, 1.0), 0.35), discMask * 0.56);
        }
        float dFront = abs(px.y - surfFrontY);
        float blade = (1.0 - smoothstep(0.3, 0.95, dFront)) * boreMask;
        vec3 bladeCol = u_dark > 0.5
          ? (u_critical > 0.5 ? CRIT_TOOL : mix(ION_TOOL, ION_HAZE, 0.65))
          : (u_critical > 0.5 ? DAY_AMBER_RED : DAY_MENISCUS);
        layerOver(col, alpha, bladeCol, blade * 0.92);
      }

      // 内壁润湿与下落光滴
      if (distIn > -0.6 && px.y < surfCenterY) {
        float wallMask = smoothstep(2.0, 0.3, distIn) * smoothstep(-0.2, 0.3, distIn);
        if (dx < 0.0 && u_wetL > 0.01 && px.y > surfCenterY - u_wetL * 54.0) {
          layerOver(col, alpha, surfTint, wallMask * 0.48);
        }
        if (dx > 0.0 && u_wetR > 0.01 && px.y > surfCenterY - u_wetR * 54.0) {
          layerOver(col, alpha, surfTint, wallMask * 0.48);
        }
      }
      for (int i = 0; i < 4; i++) {
        vec4 dr = u_drops[i];
        if (dr.w <= 0.0) continue;
        float dd = length(px - vec2(CX + dr.x, dr.y)) / max(0.7, dr.z);
        if (dd < 1.8) layerOver(col, alpha, mix(vec3(0.95, 0.99, 1.0), surfTint, 0.35), (1.0 - smoothstep(0.3, 0.95, dd)) * 0.9);
      }

      // 悬停切片光学聚焦环
      if (u_hoverSlice >= -0.5) {
        float sumR = max(1e-3, u_ratios.x + u_ratios.y + u_ratios.z);
        float midFrac = u_hoverSlice < 0.5
          ? (u_ratios.x * 0.5) / sumR
          : (u_hoverSlice < 1.5 ? (u_ratios.x + u_ratios.y * 0.5) / sumR : (u_ratios.x + u_ratios.y + u_ratios.z * 0.5) / sumR);
        float sliceY = FLOOR_IN - colH * midFrac;
        float hRing = (1.0 - smoothstep(0.25, 1.15, abs(px.y - sliceY))) * bodyAA;
        layerOver(col, alpha, u_dark > 0.5 ? ION_HAZE : vec3(1.0), hRing * 0.85);
      }

      // 垂直玻璃高光丝 + 外缘轮廓
      if (px.y > TOP_OUT + 10.0 && px.y < FLOOR_OUT - 10.0) {
        float thread = (1.0 - smoothstep(0.2, 0.85, abs(px.x - (CX - R_OUT * 0.72)))) * smoothstep(0.8, 1.8, distOut);
        layerOver(col, alpha, u_dark > 0.5 ? vec3(0.78, 0.89, 1.0) : vec3(0.95, 0.99, 1.0), thread * 0.36);
      }
      float rimMask = smoothstep(1.65, 0.95, distOut) * smoothstep(-0.35, 0.35, distOut);
      vec3 rimCol = u_dark > 0.5 ? mix(vec3(0.72, 0.85, 0.98), vec3(0.22, 0.32, 0.48), smoothstep(-0.6, 0.7, uOut)) : DAY_RIM_REF;
      layerOver(col, alpha, rimCol, rimMask * 0.82);

      outColor = vec4(clamp(col, 0.0, 1.0), clamp(alpha, 0.0, 1.0));
    }
  `;

  function compileGlProgram(gl, vsSrc, fsSrc) {
    const mk = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        const err = gl.getShaderInfoLog(s) || 'shader compile error';
        gl.deleteShader(s);
        throw new Error(err);
      }
      return s;
    };
    const vs = mk(gl.VERTEX_SHADER, vsSrc);
    const fs = mk(gl.FRAGMENT_SHADER, fsSrc);
    const p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || 'link error');
    return p;
  }

  /**
   * 挂载 物理光学水试管渲染器至 <canvas>
   */
  function mountPhysicalWaterVial(canvas, options = {}) {
    const cssW = 96;
    const cssH = 220;
    const ctx2d = canvas?.getContext?.('2d');
    let reduceMotion = Boolean(options.reduceMotion);
    const phys = createWaterVialPhysics({
      fill: options.fill ?? 0,
      streaming: Boolean(options.streaming),
    });

    const getState =
      typeof options.getState === 'function'
        ? options.getState
        : () => ({
            isDark: true,
            accentTone: 'cobalt',
            critical: false,
            fill: options.fill ?? 0,
            maxTokens: null,
            hoveredSlice: -1,
            streaming: false,
            ratios: [0, 0, 0],
          });

    let glCanvas = null;
    let glState = null;
    if (typeof document !== 'undefined' && ctx2d && !options.force2D) {
      safe(() => {
        glCanvas = document.createElement('canvas');
        const gl = glCanvas.getContext('webgl2', { alpha: true, antialias: true, premultipliedAlpha: false });
        if (!gl) return;
        const prog = compileGlProgram(gl, VIAL_VERT_SRC, VIAL_FRAG_SRC);
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, 'a_pos');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        glState = {
          gl,
          prog,
          buf,
          u: {
            time: gl.getUniformLocation(prog, 'u_time'),
            dark: gl.getUniformLocation(prog, 'u_dark'),
            fill: gl.getUniformLocation(prog, 'u_fill'),
            tilt: gl.getUniformLocation(prog, 'u_tilt'),
            accent: gl.getUniformLocation(prog, 'u_accent'),
            critical: gl.getUniformLocation(prog, 'u_critical'),
            wetL: gl.getUniformLocation(prog, 'u_wetL'),
            wetR: gl.getUniformLocation(prog, 'u_wetR'),
            hoverSlice: gl.getUniformLocation(prog, 'u_hoverSlice'),
            wave: gl.getUniformLocation(prog, 'u_wave[0]'),
            drops: gl.getUniformLocation(prog, 'u_drops[0]'),
            bubbles: gl.getUniformLocation(prog, 'u_bubbles[0]'),
            ratios: gl.getUniformLocation(prog, 'u_ratios'),
          },
        };
      });
    }

    let elapsedTime = 0;
    let settleClock = 0;
    let dirty = true;
    let lastSig = '';
    let lastPtr = null;
    const snapBuf = {};
    const dropArr = new Float32Array(16);
    const bubArr = new Float32Array(32);

    const notifyWake = () => {
      dirty = true;
      safe(() => options.onWake?.());
    };

    const onPointerMove = (evt) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const rx = ((evt.clientX - rect.left) / rect.width) * cssW;
      const ry = ((evt.clientY - rect.top) / rect.height) * cssH;
      if (lastPtr) {
        const vx = clamp(evt.clientX - lastPtr.cx, -24, 24);
        const vy = clamp(evt.clientY - lastPtr.cy, -24, 24);
        phys.injectFingerPoke((rx - VIAL_TUBE_X) / VIAL_TUBE_IN_R, (ry - (VIAL_LIP_Y + 8)) / (VIAL_HEM_Y - VIAL_LIP_Y + 6), vx, vy);
        notifyWake();
      }
      lastPtr = { cx: evt.clientX, cy: evt.clientY };
    };
    const onPointerDown = (evt) => {
      const rect = canvas.getBoundingClientRect();
      const rx = rect.width ? ((evt.clientX - rect.left) / rect.width) * cssW : VIAL_TUBE_X;
      const ry = rect.height ? ((evt.clientY - rect.top) / rect.height) * cssH : 110;
      const nx = (rx - VIAL_TUBE_X) / VIAL_TUBE_IN_R;
      phys.injectFingerPoke(nx, (ry - (VIAL_LIP_Y + 8)) / (VIAL_HEM_Y - VIAL_LIP_Y + 6), (Math.random() - 0.5) * 8, -4);
      phys.injectSlosh(nx >= 0 ? 1.35 : -1.35);
      phys.spawnDropletNow();
      notifyWake();
    };
    const onPointerLeave = () => { lastPtr = null; };

    canvas?.addEventListener?.('pointermove', onPointerMove);
    canvas?.addEventListener?.('pointerdown', onPointerDown);
    canvas?.addEventListener?.('pointerleave', onPointerLeave);

    const drawScaleMarks = (ctx, st, curFill) => {
      const isDark = Boolean(st.isDark);
      const maxTok = st.maxTokens;
      const tickX = VIAL_TUBE_X + VIAL_TUBE_OUT_R + 2.4;
      const topChamber = VIAL_LIP_Y + 8;
      const botChamber = VIAL_HEM_Y + 14;
      const hChamber = botChamber - topChamber;

      ctx.save();
      ctx.font = '500 9px "JetBrains Mono", ui-monospace, SFMono-Regular, monospace';
      ctx.textBaseline = 'middle';
      for (const sf of [0.125, 0.375, 0.625, 0.875]) {
        const sy = Math.round(botChamber - sf * hChamber);
        ctx.fillStyle = isDark ? 'rgba(168, 190, 224, 0.22)' : 'rgba(30, 41, 59, 0.24)';
        ctx.fillRect(tickX, sy - 0.4, 2.2, 0.85);
      }

      const tone = st.accentTone || 'cobalt';
      const activeCols =
        tone === 'mono'
          ? isDark ? ['#71717A', '#A1A1AA', '#E4E4E7'] : ['#3F3F46', '#52525B', '#71717A']
          : tone === 'amber'
            ? isDark ? ['#B45309', '#D97706', '#FBBF24'] : ['#92400E', '#B45309', '#D97706']
            : tone === 'iris'
              ? isDark ? ['#6D28D9', '#8B5CF6', '#C4B5FD'] : ['#5B21B6', '#7C3AED', '#9333EA']
              : [isDark ? '#2A6EE8' : '#1D4ED8', isDark ? '#3186FF' : '#2563EB', isDark ? '#5CC6FC' : '#0284C7'];

      [0.25, 0.5, 0.75].forEach((frac, idx) => {
        const ty = Math.round(botChamber - frac * hChamber);
        const reached = curFill >= frac - 0.012;
        ctx.fillStyle = reached
          ? st.critical
            ? isDark ? '#F59E0B' : '#EA580C'
            : activeCols[idx]
          : isDark ? 'rgba(172, 194, 228, 0.3)' : 'rgba(30, 41, 59, 0.38)';
        ctx.fillRect(tickX, ty - 0.5, 3.6, 1.1);
        ctx.fillStyle = reached
          ? isDark ? 'rgba(226, 238, 255, 0.92)' : 'rgba(15, 23, 42, 0.92)'
          : isDark ? 'rgba(148, 163, 184, 0.62)' : 'rgba(30, 41, 59, 0.65)';
        if (maxTok > 0) ctx.fillText(formatContextTokens(maxTok * frac), tickX + 5.6, ty + 0.3);
      });
      ctx.restore();
    };

    const drawFallback2D = (ctx, st, snap) => {
      const isDark = Boolean(st.isDark);
      const tone = st.accentTone || 'cobalt';
      const isCrit = Boolean(st.critical);
      const surfY = phys.getSurfacePixelY();
      const slope = Math.tan(snap.tiltAngle) * VIAL_TUBE_IN_R;

      ctx.save();
      traceClosedCapsule(ctx, VIAL_TUBE_X, VIAL_TUBE_OUT_R, VIAL_TOP_OUT, VIAL_FLOOR_OUT, VIAL_RC_OUT, VIAL_RC_OUT);
      ctx.fillStyle = isDark ? 'rgba(11, 16, 30, 0.16)' : 'rgba(224, 235, 250, 0.34)';
      ctx.fill();

      // 裁切至内腔后绘制带波浪曲线的液柱
      ctx.save();
      traceClosedCapsule(ctx, VIAL_TUBE_X, VIAL_TUBE_IN_R, VIAL_TOP_IN, VIAL_FLOOR_IN, VIAL_RC_IN, VIAL_RC_IN);
      ctx.clip();

      if (st.fill > 0 && surfY < VIAL_FLOOR_IN - 0.5) {
        const grad = ctx.createLinearGradient(VIAL_TUBE_X, VIAL_FLOOR_IN, VIAL_TUBE_X, Math.min(VIAL_FLOOR_IN - 6, surfY));
        if (isCrit) {
          grad.addColorStop(0, isDark ? 'rgba(92,37,9,0.94)' : 'rgba(124,58,237,0.94)');
          grad.addColorStop(0.55, isDark ? 'rgba(241,153,18,0.92)' : 'rgba(234,88,12,0.94)');
          grad.addColorStop(1, isDark ? 'rgba(254,213,79,0.94)' : 'rgba(245,158,11,0.95)');
        } else if (tone === 'mono') {
          grad.addColorStop(0, isDark ? 'rgba(30,30,34,0.92)' : 'rgba(39,39,42,0.94)');
          grad.addColorStop(1, isDark ? 'rgba(212,212,216,0.92)' : 'rgba(113,113,122,0.94)');
        } else if (tone === 'amber') {
          grad.addColorStop(0, isDark ? 'rgba(69,26,3,0.92)' : 'rgba(146,64,14,0.94)');
          grad.addColorStop(1, isDark ? 'rgba(251,191,36,0.92)' : 'rgba(245,158,11,0.94)');
        } else if (tone === 'iris') {
          grad.addColorStop(0, isDark ? 'rgba(46,16,101,0.92)' : 'rgba(91,33,182,0.94)');
          grad.addColorStop(1, isDark ? 'rgba(196,181,253,0.92)' : 'rgba(168,85,247,0.94)');
        } else {
          grad.addColorStop(0, isDark ? 'rgba(15,23,58,0.94)' : 'rgba(29,78,216,0.94)');
          grad.addColorStop(0.55, isDark ? 'rgba(49,134,255,0.92)' : 'rgba(37,99,235,0.94)');
          grad.addColorStop(1, isDark ? 'rgba(92,198,252,0.94)' : 'rgba(2,132,199,0.94)');
        }

        ctx.beginPath();
        const leftX = VIAL_TUBE_X - VIAL_TUBE_IN_R;
        const rightX = VIAL_TUBE_X + VIAL_TUBE_IN_R;
        ctx.moveTo(leftX, VIAL_FLOOR_IN + 2);
        for (let i = 0; i < VIAL_WAVE_NODES; i++) {
          const u = (i / (VIAL_WAVE_NODES - 1)) * 2 - 1;
          const x = VIAL_TUBE_X + u * VIAL_TUBE_IN_R;
          const y = surfY + u * slope + phys.waveH[i];
          ctx.lineTo(x, y);
        }
        ctx.lineTo(rightX, VIAL_FLOOR_IN + 2);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // 漂浮星尘微泡与下坠液滴
        for (const b of phys.bubbles) {
          if (b.y <= surfY + 1) continue;
          ctx.fillStyle = isDark ? 'rgba(220,242,255,0.85)' : 'rgba(240,249,255,0.92)';
          ctx.beginPath();
          ctx.arc(VIAL_TUBE_X + b.x, b.y, Math.max(0.9, b.r * 0.72), 0, Math.PI * 2);
          ctx.fill();
        }
        for (const d of phys.fallingDrops) {
          ctx.fillStyle = isCrit ? '#FCD34D' : '#BAE6FD';
          ctx.beginPath();
          ctx.ellipse(VIAL_TUBE_X + d.x, d.y, d.r * 0.72, d.r * 1.15, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // 3D 弯月面折射刀锋
        ctx.save();
        ctx.translate(VIAL_TUBE_X, surfY);
        ctx.rotate(snap.tiltAngle);
        ctx.fillStyle = isCrit ? 'rgba(245,158,11,0.42)' : isDark ? 'rgba(125,211,252,0.34)' : 'rgba(2,132,199,0.48)';
        ctx.beginPath();
        ctx.ellipse(0, 0, VIAL_TUBE_IN_R - 0.3, 3.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = isCrit ? '#FDE68A' : isDark ? 'rgba(186,230,253,0.94)' : 'rgba(3,105,161,0.94)';
        ctx.lineWidth = 1.15;
        ctx.beginPath();
        ctx.ellipse(0, 0, VIAL_TUBE_IN_R - 0.3, 3.8, 0, 0, Math.PI);
        ctx.stroke();
        ctx.restore();

        // 切片悬停聚焦环
        if (typeof st.hoveredSlice === 'number' && st.hoveredSlice >= 0) {
          const rt = Array.isArray(st.ratios) ? st.ratios : [0, 0, 0];
          const sumR = Math.max(1e-3, (rt[0] || 0) + (rt[1] || 0) + (rt[2] || 0));
          const midFrac =
            st.hoveredSlice === 0
              ? (rt[0] * 0.5) / sumR
              : st.hoveredSlice === 1
                ? (rt[0] + rt[1] * 0.5) / sumR
                : (rt[0] + rt[1] + rt[2] * 0.5) / sumR;
          const sliceY = VIAL_FLOOR_IN - Math.max(12, VIAL_FLOOR_IN - surfY) * midFrac;
          ctx.strokeStyle = isDark ? 'rgba(186,230,253,0.92)' : '#FFFFFF';
          ctx.lineWidth = 1.25;
          ctx.beginPath();
          ctx.ellipse(VIAL_TUBE_X, sliceY, VIAL_TUBE_IN_R - 1, 2.6, 0, 0, Math.PI);
          ctx.stroke();
        }
      }
      ctx.restore();

      // 垂直玻璃高光丝与晶壁外轮廓
      const tx = VIAL_TUBE_X - VIAL_TUBE_OUT_R * 0.72;
      ctx.fillStyle = isDark ? 'rgba(200,226,255,0.34)' : 'rgba(255,255,255,0.62)';
      ctx.fillRect(tx, VIAL_TOP_OUT + 15, 0.9, VIAL_FLOOR_OUT - VIAL_TOP_OUT - 30);

      traceClosedCapsule(ctx, VIAL_TUBE_X, VIAL_TUBE_OUT_R, VIAL_TOP_OUT, VIAL_FLOOR_OUT, VIAL_RC_OUT, VIAL_RC_OUT);
      ctx.strokeStyle = isDark ? 'rgba(172,204,248,0.68)' : 'rgba(30,64,175,0.66)';
      ctx.lineWidth = 1.1;
      ctx.stroke();
      ctx.restore();
    };

    const stepInternal = (dtSec, isBoot) => {
      if (!ctx2d) return;
      const dt = clamp(dtSec || 0.016, 0.001, VIAL_MAX_FRAME_DT);
      const st = getState() || {};
      const fillVal = clampFill(st.fill ?? 0);
      phys.setStreaming(Boolean(st.streaming));
      if (reduceMotion) {
        phys.snapFillNow(fillVal);
      } else {
        phys.setTargetFill(fillVal);
        if (!isBoot) {
          elapsedTime += dt;
          settleClock += dt;
          phys.step(dt);
        }
      }

      const dpr = Math.min((G && G.devicePixelRatio) || 1, 2);
      const tw = Math.round(cssW * dpr);
      const th = Math.round(cssH * dpr);
      if (canvas.width !== tw || canvas.height !== th) {
        canvas.width = tw;
        canvas.height = th;
      }
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx2d.clearRect(0, 0, cssW, cssH);

      const snap = phys.readSnapshotInto(snapBuf);
      if (st.fill > 0 && glState && glCanvas && !glState.gl.isContextLost?.()) {
        const { gl, prog, u } = glState;
        if (glCanvas.width !== tw || glCanvas.height !== th) {
          glCanvas.width = tw;
          glCanvas.height = th;
        }
        gl.viewport(0, 0, tw, th);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(prog);

        dropArr.fill(0);
        for (let i = 0; i < Math.min(4, phys.fallingDrops.length); i++) {
          const d = phys.fallingDrops[i];
          dropArr[i * 4] = d.x;
          dropArr[i * 4 + 1] = d.y;
          dropArr[i * 4 + 2] = d.r;
          dropArr[i * 4 + 3] = 1;
        }
        bubArr.fill(0);
        for (let i = 0; i < Math.min(8, phys.bubbles.length); i++) {
          const b = phys.bubbles[i];
          bubArr[i * 4] = b.x;
          bubArr[i * 4 + 1] = b.y;
          bubArr[i * 4 + 2] = b.r;
          bubArr[i * 4 + 3] = b.alpha;
        }
        const tone = st.accentTone || 'cobalt';
        const accentNum = tone === 'mono' ? 3 : tone === 'amber' ? 2 : tone === 'iris' ? 1 : 0;
        const rt = Array.isArray(st.ratios) ? st.ratios : [0, 0, 0];
        gl.uniform1f(u.time, elapsedTime);
        gl.uniform1f(u.dark, st.isDark !== false ? 1 : 0);
        gl.uniform1f(u.fill, snap.fill);
        gl.uniform1f(u.tilt, snap.tiltAngle);
        gl.uniform1f(u.accent, accentNum);
        gl.uniform1f(u.critical, st.critical ? 1 : 0);
        gl.uniform1f(u.wetL, snap.wetLeft);
        gl.uniform1f(u.wetR, snap.wetRight);
        gl.uniform1f(u.hoverSlice, typeof st.hoveredSlice === 'number' ? st.hoveredSlice : -1);
        gl.uniform1fv(u.wave, phys.waveH);
        gl.uniform4fv(u.drops, dropArr);
        gl.uniform4fv(u.bubbles, bubArr);
        gl.uniform3f(u.ratios, rt[0] || 0, rt[1] || 0, rt[2] || 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        ctx2d.drawImage(glCanvas, 0, 0, cssW, cssH);
      } else {
        drawFallback2D(ctx2d, st, snap);
      }

      drawScaleMarks(ctx2d, st, snap.fill);
      lastSig = `${st.isDark ? 1 : 0}|${st.accentTone}|${st.critical ? 1 : 0}|${st.hoveredSlice}|${fillVal.toFixed(4)}|${st.maxTokens}`;
      dirty = false;
    };

    const isSettled = () => {
      if (!ctx2d) return true;
      if (dirty) return false;
      const st = getState() || {};
      const fillVal = clampFill(st.fill ?? 0);
      const sig = `${st.isDark ? 1 : 0}|${st.accentTone}|${st.critical ? 1 : 0}|${st.hoveredSlice}|${fillVal.toFixed(4)}|${st.maxTokens}`;
      if (sig !== lastSig) return false;
      if (reduceMotion) return true;
      if (st.streaming) return false;
      if (settleClock < VIAL_SETTLE_MIN_AGE) return false;
      return phys.isSettled();
    };

    stepInternal(0.016, true);

    return {
      step: (dt) => stepInternal(dt, false),
      isSettled,
      setReduceMotion: (v) => { reduceMotion = Boolean(v); notifyWake(); },
      agitate: (s = 1.6) => { phys.injectSlosh(s); notifyWake(); },
      impulse: (s = 1.6) => { phys.injectSlosh(s); notifyWake(); },
      tilt: (s = 0.18) => { phys.injectTilt(s); notifyWake(); },
      spawnDroplet: () => { phys.spawnDropletNow(); notifyWake(); },
      wake: notifyWake,
      getDebugState: () => ({ rendererMode: glState ? 'webgl2' : '2d', settled: isSettled(), ...phys.getSnapshot() }),
      dispose: () => {
        canvas?.removeEventListener?.('pointermove', onPointerMove);
        canvas?.removeEventListener?.('pointerdown', onPointerDown);
        canvas?.removeEventListener?.('pointerleave', onPointerLeave);
        if (glState) {
          safe(() => {
            glState.gl.deleteProgram(glState.prog);
            glState.gl.deleteBuffer(glState.buf);
          });
          glState = null;
        }
        glCanvas = null;
      },
    };
  }

  const vialCore = {
    WAVE_NODES: VIAL_WAVE_NODES,
    createWaterVialPhysics,
    mountPhysicalWaterVial,
  };

  // ═════════════════════════════════════════════════════════════════════════════
  // 子模块 3: 编排器切割水晶棱镜条 & 品牌图标引擎 (model-glyph-crystal + crystal-prism-core)
  // ═════════════════════════════════════════════════════════════════════════════
  const BRAND_PATHS = {
    gemini:
      'M24 12.024c-6.437.388-11.59 5.539-11.977 11.976h-.047C11.588 17.563 6.436 12.412 0 12.024v-.047C6.437 11.588 11.588 6.437 11.976 0h.047c.388 6.437 5.54 11.588 11.977 11.977z',
    claude:
      'm4.714 15.956l4.718-2.648l.079-.23l-.08-.128h-.23l-.79-.048l-2.695-.073l-2.337-.097l-2.265-.122l-.57-.121l-.535-.704l.055-.353l.48-.321l.685.06l1.518.104l2.277.157l1.651.098l2.447.255h.389l.054-.158l-.133-.097l-.103-.098l-2.356-1.596l-2.55-1.688l-1.336-.972l-.722-.491L2 6.223l-.158-1.008l.656-.722l.88.06l.224.061l.893.686l1.906 1.476l2.49 1.833l.364.304l.146-.104l.018-.072l-.164-.274l-1.354-2.446l-1.445-2.49l-.644-1.032l-.17-.619a3 3 0 0 1-.103-.729L6.287.133L6.7 0l.995.134l.42.364l.619 1.415L9.735 4.14l1.555 3.03l.455.898l.243.832l.09.255h.159V9.01l.127-1.706l.237-2.095l.23-2.695l.08-.76l.376-.91l.747-.492l.583.28l.48.685l-.067.444l-.286 1.851l-.558 2.903l-.365 1.942h.213l.243-.242l.983-1.306l1.652-2.064l.728-.82l.85-.904l.547-.431h1.032l.759 1.129l-.34 1.166l-1.063 1.347l-.88 1.142l-1.263 1.7l-.79 1.36l.074.11l.188-.02l2.853-.606l1.542-.28l1.84-.315l.832.388l.09.395l-.327.807l-1.967.486l-2.307.462l-3.436.813l-.043.03l.049.061l1.548.146l.662.036h1.62l3.018.225l.79.522l.473.638l-.08.485l-1.213.62l-1.64-.389l-3.825-.91l-1.31-.329h-.183v.11l1.093 1.068l2.003 1.81l2.508 2.33l.127.578l-.321.455l-.34-.049l-2.204-1.657l-.85-.747l-1.925-1.62h-.127v.17l.443.649l2.343 3.521l.122 1.08l-.17.353l-.607.213l-.668-.122l-1.372-1.924l-1.415-2.168l-1.141-1.943l-.14.08l-.674 7.254l-.316.37l-.728.28l-.607-.461l-.322-.747l.322-1.476l.388-1.924l.316-1.53l.285-1.9l.17-.632l-.012-.042l-.14.018l-1.432 1.967l-2.18 2.945l-1.724 1.845l-.413.164l-.716-.37l.066-.662l.401-.589l2.386-3.036l1.439-1.882l.929-1.086l-.006-.158h-.055L4.138 18.56l-1.13.146l-.485-.456l.06-.746l.231-.243l1.907-1.312Z',
    deepseek:
      'M12 2C6.8 2 2.6 5.9 2.1 10.9c-.3 3.1.9 6.1 3.2 8.2.8.7 1.8 1.2 2.8 1.5.5.1 1-.3.9-.8-.2-1.1.1-2.2.8-3 .7-.8 1.8-1.2 2.9-1.1 2.2.2 4.3-.7 5.7-2.4 1.5-1.8 2.1-4.2 1.4-6.5C18.8 3.9 15.7 2 12 2zm3.2 7.1a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8z',
  };

  // 22 颗黄金分割确定性星尘粒子（移植自 upstream-client.js）
  const STAR_PARTICLE_COUNT = 22;
  const GOLDEN_RATIO = 0.6180339887498949;
  const EFFORT_TIERS = Object.freeze([
    { id: 'low', label: 'Low', zh: '低', energy: 0.16, stars: 5, speed: 0.7 },
    { id: 'medium', label: 'Medium', zh: '中', energy: 0.45, stars: 11, speed: 1.05 },
    { id: 'high', label: 'High', zh: '高', energy: 0.76, stars: 17, speed: 1.5 },
    { id: 'max', label: 'Max', zh: '极高', energy: 1.0, stars: 22, speed: 2.0 },
    { id: 'orchestrator', label: 'Orchestrator', zh: '编排 · DeepThink', energy: 1.0, stars: 22, speed: 2.2, crystal: true },
  ]);

  function starHash01(index, salt) {
    const val = ((index + 1) * (salt || 1) * 2654435761) % 4294967296;
    return ((val >>> 8) % 1000) / 1000;
  }

  const STAR_PARTICLES = (() => {
    const out = [];
    for (let i = 0; i < STAR_PARTICLE_COUNT; i++) {
      const yNorm = 0.16 + 0.68 * starHash01(i, 73);
      out.push(
        Object.freeze({
          id: i,
          phase: ((i + 1) * GOLDEN_RATIO) % 1,
          y: yNorm,
          size: 1.1 + 1.1 * starHash01(i, 37),
          brightness: 0.52 + 0.48 * starHash01(i, 61),
          twinklePhase: starHash01(i, 109) * Math.PI * 2,
        })
      );
    }
    return Object.freeze(out);
  })();

  // 切割水晶 4 路异步星芒锚点（移植自 crystal-prism-core.js）
  const CRYSTAL_GLINTS = [
    { u: 0.17, v: 0.30, freq: 0.2718282, phase: 0.15, wobFreq: 0.0713, wobAmp: 0.55, wobPhase: 0.4 },
    { u: 0.41, v: 0.64, freq: 0.3819660, phase: 1.72, wobFreq: 0.0527, wobAmp: 0.62, wobPhase: 2.1 },
    { u: 0.63, v: 0.32, freq: 0.2236068, phase: 3.29, wobFreq: 0.0891, wobAmp: 0.48, wobPhase: 4.3 },
    { u: 0.83, v: 0.62, freq: 0.3141593, phase: 4.86, wobFreq: 0.0618, wobAmp: 0.58, wobPhase: 5.6 },
  ];

  const CRYSTAL_SPECTRA = {
    default: ['#4C8DF6', '#9B72CB', '#D96570', '#F2B84B'],
    cobalt: ['#1D4ED8', '#3186FF', '#5CC6FC', '#8CE0FF'],
    iris: ['#6D28D9', '#8B5CF6', '#A58AF8', '#DDD6FE'],
    amber: ['#B45309', '#D97706', '#F2B84B', '#FDE68A'],
    mono: ['#94A3B8', '#CBD5E1', '#E2E8F0', '#F8FAFC'],
  };

  function evalCrystalGlints(timeSec, reduceMotion) {
    if (reduceMotion) return [0, 0.42, 0.24, 0];
    const t = Math.max(0, Number(timeSec) || 0);
    return CRYSTAL_GLINTS.map((a) => {
      const wob = a.wobAmp * Math.sin(t * Math.PI * 2 * a.wobFreq + a.wobPhase);
      const wave = Math.sin(t * Math.PI * 2 * a.freq + a.phase + wob);
      return wave > 0 ? Math.pow(wave, 16) : 0;
    });
  }

  function computeCrystalProximity(localX, localY, w, h, radius = 105) {
    if (!Number.isFinite(localX) || !Number.isFinite(localY) || localX < -2000) return 0;
    const capR = Math.min(w, h) * 0.5;
    const cx = localX - w * 0.5;
    const cy = localY - h * 0.5;
    const dx = Math.max(0, Math.abs(cx) - Math.max(0, w * 0.5 - capR));
    const dist = Math.hypot(dx, Math.abs(cy)) - capR;
    if (dist <= 0) return 1;
    if (dist >= radius) return 0;
    const u = 1 - dist / radius;
    return u * u * (3 - 2 * u);
  }

  /**
   * 绘制切割白水晶棱镜条（含 Voronoi 风格斜切面、冠面顶光、下亭部全内反射暗渊、
   * 105px 指针追光柯西色散火彩、4 路异步星芒、唤醒扫光及内壁蚀刻晶锁）
   */
  function drawCutCrystalBar(ctx, cssW, cssH, state) {
    const r = cssH * 0.5;
    const isDark = state.isDark !== false;
    const prox = clamp(state.proximity || 0, 0, 1);
    const ambient = clamp(state.ambient ?? 1, 0, 1);
    const tone = state.accentTone || 'default';
    const spectrum = CRYSTAL_SPECTRA[tone] || CRYSTAL_SPECTRA.default;
    const glints = evalCrystalGlints(state.time || 0, Boolean(state.reduceMotion));

    ctx.save();
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') ctx.roundRect(0, 0, cssW, cssH, r);
    else ctx.rect(0, 0, cssW, cssH);
    ctx.clip();

    // 1. 宏观主光：上冠面冰银高光 -> 中部清透 -> 下亭部 TIR 暗渊
    const baseGrad = ctx.createLinearGradient(0, 0, 0, cssH);
    if (isDark) {
      baseGrad.addColorStop(0, '#D4DCE8');
      baseGrad.addColorStop(0.22, '#EDF2FA');
      baseGrad.addColorStop(0.54, '#8A96AC');
      baseGrad.addColorStop(0.84, '#2A303E');
      baseGrad.addColorStop(1, '#0C0D12');
    } else {
      baseGrad.addColorStop(0, '#EFF4FB');
      baseGrad.addColorStop(0.24, '#FFFFFF');
      baseGrad.addColorStop(0.56, '#C8D3E4');
      baseGrad.addColorStop(1, '#64748B');
    }
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, cssW, cssH);

    // 2. 各向异性多边形切割晶面
    const cols = Math.max(5, Math.round(cssW / 38));
    const xs = [];
    for (let i = 0; i <= cols; i++) {
      const jitter = i === 0 || i === cols ? 0 : Math.sin(i * 4.7) * 0.19;
      xs.push(((i + jitter) / cols) * cssW);
    }
    const edges = [];
    let fIdx = 0;
    const paintFacet = (pts, idx, lower) => {
      const shade = 0.5 + 0.5 * Math.sin(idx * 2.37 + 0.8);
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let k = 1; k < pts.length; k++) ctx.lineTo(pts[k][0], pts[k][1]);
      ctx.closePath();
      if (shade > 0.52) {
        ctx.fillStyle = `rgba(255,255,255,${((shade - 0.52) * (isDark ? 0.46 : 0.55)).toFixed(3)})`;
      } else {
        const a = (0.52 - shade) * (lower ? (isDark ? 0.86 : 0.4) : isDark ? 0.34 : 0.16);
        ctx.fillStyle = isDark ? `rgba(9,10,15,${a.toFixed(3)})` : `rgba(40,54,78,${a.toFixed(3)})`;
      }
      ctx.fill();

      // 近场指针追光 + 柯西色散火彩
      if (prox > 0.02 && state.pointerLocal && state.pointerLocal.x > -2000) {
        let cx = 0;
        let cy = 0;
        for (const p of pts) { cx += p[0]; cy += p[1]; }
        cx /= pts.length;
        cy /= pts.length;
        const spot = prox * Math.max(0, 1 - Math.hypot(cx - state.pointerLocal.x, cy - state.pointerLocal.y) / 105);
        if (spot > 0.04) {
          ctx.save();
          ctx.globalAlpha = spot * (tone === 'mono' ? 0.16 : 0.36);
          ctx.fillStyle = spectrum[idx % spectrum.length];
          ctx.fill();
          ctx.restore();
        }
      }
    };

    for (let i = 0; i < cols; i++) {
      const x0 = xs[i];
      const x1 = xs[i + 1];
      const midA = cssH * (0.36 + 0.26 * (0.5 + 0.5 * Math.sin(i * 3.1 + 1.2)));
      const midB = cssH * (0.36 + 0.26 * (0.5 + 0.5 * Math.sin((i + 1) * 3.1 + 1.2)));
      const slant = cssH * 0.36;
      paintFacet([[x0 + slant, 0], [x1 + slant, 0], [x1, midB], [x0, midA]], fIdx++, false);
      paintFacet([[x0, midA], [x1, midB], [x1 - slant, cssH], [x0 - slant, cssH]], fIdx++, true);
      edges.push([x0, midA, x1, midB], [x0 + slant, 0, x0, midA], [x0, midA, x0 - slant, cssH]);
    }

    // 3. 刀锋菲涅尔棱线
    for (let e = 0; e < edges.length; e++) {
      const [ax, ay, bx, by] = edges[e];
      const len = Math.hypot(bx - ax, by - ay) || 1;
      const nx = -(by - ay) / len;
      const ny = (bx - ax) / len;
      const facing = Math.abs(nx * -0.53 + ny * -0.85);
      const sel = 0.5 + 0.5 * Math.sin(e * 5.13 + 0.7);
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      if (facing * sel > 0.38) {
        ctx.lineWidth = 0.95;
        ctx.strokeStyle = `rgba(252,254,255,${(0.38 + 0.55 * facing * sel).toFixed(3)})`;
      } else {
        ctx.lineWidth = 0.6;
        ctx.strokeStyle = isDark ? 'rgba(9,10,14,0.22)' : 'rgba(60,72,92,0.12)';
      }
      ctx.stroke();
    }

    // 4. 内部三色折射斜棱带
    if (ambient > 0.01) {
      ctx.save();
      ctx.lineWidth = 1.8;
      ctx.globalAlpha = 0.22 * ambient;
      [0.24, 0.53, 0.78].forEach((u, k) => {
        const x = u * cssW;
        ctx.strokeStyle = spectrum[k % spectrum.length];
        ctx.beginPath();
        ctx.moveTo(x + cssH * 0.42, 1);
        ctx.lineTo(x - cssH * 0.42, cssH - 1);
        ctx.stroke();
      });
      ctx.restore();
    }

    // 5. 唤醒扫光
    if ((state.wakeAmp || 0) > 0.01) {
      const sx = (state.wakeU || 0) * cssW;
      const wg = ctx.createLinearGradient(sx - 24, 0, sx + 24, 0);
      wg.addColorStop(0, 'rgba(255,255,255,0)');
      wg.addColorStop(0.5, `rgba(240,248,255,${(0.75 * state.wakeAmp).toFixed(3)})`);
      wg.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = wg;
      ctx.fillRect(0, 0, cssW, cssH);
    }

    // 6. 4 路异步冷白十字星芒（尖端色散）
    for (let i = 0; i < 4; i++) {
      const inten = glints[i] * Math.max(0.35, ambient);
      if (inten <= 0.05) continue;
      const a = CRYSTAL_GLINTS[i];
      const gx = a.u * cssW;
      const gy = a.v * cssH;
      ctx.save();
      ctx.globalAlpha = inten * (isDark ? 0.95 : 0.8);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(gx - 5.2, gy - 1.3);
      ctx.lineTo(gx + 5.2, gy + 1.3);
      ctx.moveTo(gx - 1.3, gy + 5.2);
      ctx.lineTo(gx + 1.3, gy - 5.2);
      ctx.stroke();
      if (tone !== 'mono') {
        ctx.fillStyle = spectrum[0];
        ctx.fillRect(gx - 7, gy - 2, 1.5, 1.5);
        ctx.fillStyle = spectrum[3];
        ctx.fillRect(gx + 6, gy + 1, 1.5, 1.5);
      }
      ctx.restore();
    }

    // 7. 右侧内壁激光微蚀刻晶锁印记
    const lx = cssW - 15.5;
    const ly = cssH * 0.5;
    ctx.save();
    ctx.strokeStyle = isDark ? `rgba(240,247,255,${(0.62 + prox * 0.28).toFixed(2)})` : `rgba(30,41,59,${(0.58 + prox * 0.25).toFixed(2)})`;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(lx, ly - 5);
    ctx.lineTo(lx + 4.2, ly);
    ctx.lineTo(lx, ly + 5);
    ctx.lineTo(lx - 4.2, ly);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    // 外缘高光棱线
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') ctx.roundRect(0.5, 0.5, cssW - 1, cssH - 1, r - 0.5);
    else ctx.rect(0.5, 0.5, cssW - 1, cssH - 1);
    ctx.lineWidth = 0.9;
    ctx.strokeStyle = isDark ? 'rgba(232,240,255,0.44)' : 'rgba(100,116,139,0.72)';
    ctx.stroke();
    ctx.restore();
  }

  /**
   * 绘制星空推理滑块轨道（Low -> Medium -> High -> Max 能量渐进 + 22 星尘右向左巡航 + 星座连线）
   */
  function drawStarryEffortTrack(ctx, cssW, cssH, state) {
    const r = cssH * 0.5;
    const isDark = state.isDark !== false;
    const tierIdx = clamp(state.tierIdx ?? 1, 0, 3);
    const tier = EFFORT_TIERS[tierIdx] || EFFORT_TIERS[1];
    const ratio = clamp(state.fillRatio ?? (tierIdx + 1) / 4, 0.005, 1);
    const fillW = Math.max(1, ratio * cssW);
    const knobW = clamp(Number(state.knobWidth) || 24, 0, cssW);
    const levelCount = Math.max(2, Math.round(Number(state.levelCount) || 4));
    const tSec = state.time || 0;
    const tone = state.accentTone || 'cobalt';

    ctx.save();
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') ctx.roundRect(0, 0, cssW, cssH, r);
    else ctx.rect(0, 0, cssW, cssH);
    ctx.clip();

    // 凹陷轨道底槽
    ctx.fillStyle = isDark ? 'rgba(18, 22, 34, 0.86)' : 'rgba(226, 232, 240, 0.92)';
    ctx.fillRect(0, 0, cssW, cssH);

    // 激活星云能量段
    const g = ctx.createLinearGradient(0, 0, fillW, 0);
    if (tone === 'mono') {
      g.addColorStop(0, isDark ? '#3F3F46' : '#52525B');
      g.addColorStop(1, isDark ? '#A1A1AA' : '#18181B');
    } else if (tone === 'amber') {
      g.addColorStop(0, '#92400E');
      g.addColorStop(0.55, '#D97706');
      g.addColorStop(1, '#FBBF24');
    } else if (tierIdx === 0) {
      g.addColorStop(0, '#1D4ED8');
      g.addColorStop(1, '#4D93F8');
    } else if (tierIdx === 1) {
      g.addColorStop(0, '#2563EB');
      g.addColorStop(0.6, '#6366F1');
      g.addColorStop(1, '#9333EA');
    } else if (tierIdx === 2) {
      g.addColorStop(0, '#312E81');
      g.addColorStop(0.5, '#7C3AED');
      g.addColorStop(1, '#A855F7');
    } else {
      g.addColorStop(0, '#3B0764');
      g.addColorStop(0.45, '#7C3AED');
      g.addColorStop(0.8, '#C084FC');
      g.addColorStop(1, '#5CC6FC');
    }

    ctx.save();
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') ctx.roundRect(0, 0, fillW, cssH, r);
    else ctx.rect(0, 0, fillW, cssH);
    ctx.clip();
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, fillW, cssH);

    // 高档/极高档星云流光扫掠
    if (tierIdx >= 2 && !state.reduceMotion) {
      const sweepX = ((tSec * 55 * tier.speed) % (fillW + 80)) - 40;
      const sg = ctx.createLinearGradient(sweepX - 32, 0, sweepX + 32, 0);
      sg.addColorStop(0, 'rgba(255,255,255,0)');
      sg.addColorStop(0.5, tierIdx === 3 ? 'rgba(232,213,255,0.34)' : 'rgba(216,180,254,0.22)');
      sg.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = sg;
      ctx.fillRect(0, 0, fillW, cssH);
    }

    // 22 颗确定性星空粒子 + 星座连线（Medium 及以上点亮星座连线）
    const activePts = [];
    const speedFactor = state.reduceMotion ? 0 : tier.speed * 0.085;
    for (let i = 0; i < tier.stars; i++) {
      const p = STAR_PARTICLES[i];
      let u = (p.phase - tSec * speedFactor) % 1;
      if (u < 0) u += 1;
      const sx = u * Math.max(24, fillW - 10) + 5;
      const sy = p.y * cssH;
      const tw = state.reduceMotion ? 1 : 0.65 + 0.35 * Math.sin(tSec * (2.2 + tier.speed) + p.twinklePhase);
      activePts.push({ x: sx, y: sy, a: p.brightness * tw, sz: p.size });
    }

    if (tierIdx >= 1) {
      const maxLinkDist = tierIdx >= 3 ? 44 : tierIdx === 2 ? 36 : 28;
      ctx.strokeStyle = tone === 'amber' ? 'rgba(254,243,199,0.28)' : 'rgba(224,231,255,0.30)';
      ctx.lineWidth = 0.75;
      for (let i = 0; i < activePts.length; i++) {
        for (let j = i + 1; j < activePts.length; j++) {
          const d = Math.hypot(activePts[i].x - activePts[j].x, activePts[i].y - activePts[j].y);
          if (d < maxLinkDist) {
            ctx.globalAlpha = (1 - d / maxLinkDist) * (tierIdx >= 2 ? 0.55 : 0.35);
            ctx.beginPath();
            ctx.moveTo(activePts[i].x, activePts[i].y);
            ctx.lineTo(activePts[j].x, activePts[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    for (const pt of activePts) {
      ctx.fillStyle = `rgba(255,255,255,${pt.a.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.sz, 0, Math.PI * 2);
      ctx.fill();
      if (tierIdx >= 2 && pt.sz > 1.7) {
        ctx.fillStyle = `rgba(224,242,254,${(pt.a * 0.45).toFixed(3)})`;
        ctx.fillRect(pt.x - 3.2, pt.y - 0.35, 6.4, 0.7);
        ctx.fillRect(pt.x - 0.35, pt.y - 3.2, 0.7, 6.4);
      }
    }
    ctx.restore();

    // 每个真实推理档位一颗刻度，圆心与白色滑块共用同一套可移动区间。
    for (let k = 0; k < levelCount; k++) {
      const tx = knobW / 2 + ((cssW - knobW) * k) / (levelCount - 1);
      const reached = fillW + 0.25 >= tx;
      ctx.fillStyle = reached ? 'rgba(255,255,255,0.82)' : isDark ? 'rgba(148,163,184,0.34)' : 'rgba(71,85,105,0.32)';
      ctx.beginPath();
      ctx.arc(tx, cssH * 0.5, reached ? 2.1 : 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 轨道外边框
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') ctx.roundRect(0.5, 0.5, cssW - 1, cssH - 1, r - 0.5);
    else ctx.rect(0.5, 0.5, cssW - 1, cssH - 1);
    ctx.lineWidth = 0.85;
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(15,23,42,0.12)';
    ctx.stroke();
    ctx.restore();
  }

  const crystalCore = {
    EFFORT_TIERS,
    STAR_PARTICLES,
    BRAND_PATHS,
    computeCrystalProximity,
    evalCrystalGlints,
    drawCutCrystalBar,
    drawStarryEffortTrack,
  };

  // ═════════════════════════════════════════════════════════════════════════════
  // 子模块 4: 像素伴侣物理引擎 (Clawd + 小紫猫 + 3 迷你蟹 + 5 层叠塔 + 彩虹极光彩蛋)
  // 移植自 dual-mascot-rig.js
  // ═════════════════════════════════════════════════════════════════════════════
  const PX = 3;
  const TICK_MS = 100;
  const DOZE_TICK_MS = 400;
  const rep = (s, n) => Array(n).fill(s);
  const mkF = (rows, ox = 0, oy = 0) => ({ rows, ox, oy });

  const MASCOT_PALETTES = {
    clawd: { '#': '#d97757', s: '#bf684c', o: '#141413', r: '#cc4f45', y: '#e8b64a', k: '#9c958c', a: '#c6d9f7', v: '#788eac', h: 'rgba(20,20,19,0.20)', B: '#5b8fb9' },
    cat: { '#': '#947fd6', s: '#735eb5', o: '#141413', r: '#cc4f45', y: '#e8b64a', k: '#a89fc4', a: '#c6d9f7', v: '#788eac', h: 'rgba(20,20,19,0.20)', B: '#6a8fd6' },
    cowboy: { '#': '#d97757', s: '#bf684c', o: '#141413', H: '#8b5e3c', R: '#a6744e', h: 'rgba(20,20,19,0.18)' },
    shades: { '#': '#e0896b', s: '#c16f53', o: '#141413', G: '#141413', g: '#6d778a', w: '#ffffff', h: 'rgba(20,20,19,0.18)' },
    wizard: { '#': '#8a74cf', s: '#6a56aa', o: '#141413', M: '#5c4b9e', y: '#e8b64a', b: '#cfe3ee', h: 'rgba(20,20,19,0.18)' },
  };

  // 全息彩虹极光五色光谱节点（evalChromaColorAt）
  const CHROMA_STOPS = [
    [0x42, 0x85, 0xf4],
    [0x9b, 0x72, 0xcb],
    [0xea, 0x43, 0x35],
    [0xfb, 0xbc, 0x04],
    [0x5c, 0xc6, 0xfc],
  ];
  const CHROMA_HEX = ['#4285F4', '#9B72CB', '#EA4335', '#FBBC04', '#5CC6FC'];

  function evalChromaColorAt(gx, gy, phase = 0, isShadow = false) {
    const raw = ((gx + gy) * 0.068 - phase) % 1;
    const u = (raw < 0 ? raw + 1 : raw) * CHROMA_STOPS.length;
    const i0 = Math.floor(u) % CHROMA_STOPS.length;
    const i1 = (i0 + 1) % CHROMA_STOPS.length;
    const t = u - Math.floor(u);
    const s = t * t * (3 - 2 * t);
    const c0 = CHROMA_STOPS[i0];
    const c1 = CHROMA_STOPS[i1];
    let r = c0[0] + (c1[0] - c0[0]) * s;
    let g = c0[1] + (c1[1] - c0[1]) * s;
    let b = c0[2] + (c1[2] - c0[2]) * s;
    if (isShadow) {
      r = r * 0.68 + 2.5;
      g = g * 0.68 + 3.1;
      b = b * 0.72 + 5.6;
    }
    const hex = (v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0');
    return `#${hex(r)}${hex(g)}${hex(b)}`;
  }

  // Clawd / 小紫猫 / 迷你三蟹像素骨架点阵
  const CLAWD_PARTS = {
    shadow: mkF(['hhhhhhhhhhhh'], 2, 10),
    body: {
      stand: mkF(rep('############', 8), 2, 0),
      squash: mkF(['.ssssssssssss.', ...rep('##############', 5)], 1, 2),
      flat: mkF(['ssssssssssss', '############', '############'], 2, 7),
    },
    eyes: {
      open: mkF(['o......o', 'o......o'], 4, 2),
      blink: mkF(['ss......ss'], 3, 3),
      happy: mkF(['.o......o.', 'o.o....o.o'], 3, 2),
      shut: mkF(['oo......oo'], 3, 3),
      wide: mkF(['oo......oo', 'oo......oo'], 3, 2),
    },
    mouth: {
      yawn: mkF(['ssss', '.ss.'], 6, 5),
    },
    legs: {
      stand: mkF(['.#.#....#.#.', '.#.#....#.#.'], 2, 8),
      walkA: mkF(['.#.s....#.s.', '.#......#...'], 2, 8),
      walkB: mkF(['.s.#....s.#.', '...#......#.'], 2, 8),
      dangle: mkF(['.#.#....#.#.', '.#.#........', '.#.#........'], 2, 8),
    },
    clawL: {
      stub: mkF(['##', '##'], 0, 5),
      up: mkF(['##', '##', '#.'], 0, -2),
      open: mkF(['##', '.#', '##'], 0, 4),
    },
    clawR: {
      stub: mkF(['##', '##'], 14, 5),
      up: mkF(['##', '##', '.#'], 14, -2),
      open: mkF(['##', '#.', '##'], 14, 4),
      write: mkF(['ss', 'ss'], 13, 6),
    },
  };

  const CAT_PARTS = {
    shadow: CLAWD_PARTS.shadow,
    ears: {
      stand: mkF(['#..........#', '##........##'], 2, -1),
      twitch: mkF(['...........#', '##........##'], 2, -1),
      loaf: mkF(['#..........#', '##........##'], 2, 2),
    },
    body: {
      stand: mkF(rep('############', 7), 2, 1),
      squash: mkF(['.ssssssssssss.', ...rep('##############', 4)], 1, 3),
      loaf: mkF(['.ssssssssssss.', ...rep('##############', 5)], 1, 4),
    },
    eyes: {
      open: mkF(['o......o', 'o......o'], 4, 3),
      blink: mkF(['ss......ss'], 3, 4),
      happy: mkF(['.o......o.', 'o.o....o.o'], 3, 3),
      shut: mkF(['oo......oo'], 3, 4),
      loafShut: mkF(['oo......oo'], 3, 6),
      wide: mkF(['oo......oo', 'oo......oo'], 3, 3),
    },
    mouth: {
      yawn: mkF(['ssss', '.ss.'], 6, 5),
    },
    legs: CLAWD_PARTS.legs,
    tail: {
      up: mkF(['.s', '.#', '.#', '##'], 14, 3),
      sway: mkF(['.#', '.#', 's#', '#.'], 14, 3),
      loaf: mkF(['.#', '.#', 's#'], 14, 6),
    },
  };

  const MASCOT_SYMS = {
    heart: mkF(['.r.r.', 'rrrrr', '.rrr.', '..r..'], 5, -7),
    spark: mkF(['..y..', '..y..', 'yyyyy', '..y..', '..y..'], 5, -8),
    dozeZ0: mkF(['kkk', '.k.', 'kkk'], 12, -3),
    dozeZ1: mkF(['kkkk', '..k.', '.k..', 'kkkk'], 13, -7),
    dozeZ2: mkF(['kkkkk', '...k.', '..k..', '.k...', 'kkkkk'], 14, -12),
    iceCrystal: mkF(['..av..', '.aavv.', 'aaavvv', '.aavv.', '..av..'], 5, -7),
    iceCrystalHi: mkF(['..av..', '.aavv.', 'aaavvv', '.aavv.', '..av..'], 5, -8),
    bang: mkF(['.r.', '.r.', '.r.', '...', '.r.'], 6, -8),
    q: mkF(['.kkk.', 'k...k', '...k.', '..k..', '.....', '..k..'], 5, -9),
    note: mkF(['..kk.', '..k.k', '..k..', 'kkk..', 'kk...'], 5, -8),
  };

  const MINI_SPRITES = {
    cowboy: mkF(
      [
        '.....HHHHHH.....',
        '...HHHHHHHHHH...',
        '..RRRRRRRRRRRR..',
        '..############..',
        '..##o######o##..',
        '################',
        '..############..',
        '...#.#....#.#...',
      ],
      0,
      -2
    ),
    shades: mkF(
      [
        '..############..',
        '..GGGGg##gGGGG..',
        '..GGGGGGGGGGGG..',
        '################',
        '..############..',
        '...#.#....#.#...',
      ],
      0,
      0
    ),
    wizard: mkF(
      [
        '.......MM.......',
        '......MyMM......',
        '.....MMMMMM.....',
        '..MMMMMMMMMMMM..',
        '..############..',
        '..##o######o##..',
        '################',
        '..############..',
        '...#.#....#.#...',
      ],
      0,
      -3
    ),
  };

  const MINI_TRICK_SPRITES = {
    cowboy: mkF(
      [
        '....HHHHHH......',
        '..HHHHHHHHHH....',
        '.RRRRRRRRRRRR...',
        '..############..',
        '..##o######o##..',
        '################',
        '..############..',
        '..#..#....#..#..',
      ],
      0,
      -3
    ),
    shades: mkF(
      [
        '..############..',
        '..GwGGw##GwGGw..',
        '..GGGGGGGGGGGG..',
        '################',
        '..############..',
        '...#.#....#.#...',
      ],
      0,
      0
    ),
    wizard: mkF(
      [
        '.....y..........',
        '....yMyMM.......',
        '.....MMMMMM.....',
        '..MMMMMMMMMMMM..',
        '..############..',
        '..##o######o##..',
        '################',
        '..############y.',
        '...#.#....#.#.y.',
      ],
      0,
      -3
    ),
  };

  function resolveGroundSeparation(bodies, stageMinX = 12, stageMaxX = 680, minGap = 6) {
    if (!Array.isArray(bodies) || bodies.length < 2) return bodies;
    const ordered = bodies.slice().sort((a, b) => a.cx - b.cx);
    for (let iter = 0; iter < 5; iter++) {
      let moved = false;
      for (let i = 0; i < ordered.length - 1; i++) {
        const l = ordered[i];
        const r = ordered[i + 1];
        const req = l.halfW + r.halfW + minGap;
        const dist = r.cx - l.cx;
        if (dist >= req - 0.01) continue;
        const ov = req - dist;
        moved = true;
        if (l.locked && r.locked) continue;
        if (l.locked) r.cx += ov;
        else if (r.locked) l.cx -= ov;
        else {
          l.cx -= ov * 0.5;
          r.cx += ov * 0.5;
        }
        if (!l.locked) l.cx = clamp(l.cx, stageMinX + l.halfW, stageMaxX - l.halfW);
        if (!r.locked) r.cx = clamp(r.cx, stageMinX + r.halfW, stageMaxX - r.halfW);
      }
      if (!moved) break;
    }
    return bodies;
  }

  function drawPixelSprite(ctx, oxGrid, oyGrid, pxSize, palette, layers, opts = {}) {
    const mirror = Boolean(opts.mirror);
    const chroma = Boolean(opts.chroma);
    const chromaPhase = opts.chromaPhase || 0;
    for (const part of layers) {
      if (!part || !part.rows) continue;
      for (let ry = 0; ry < part.rows.length; ry++) {
        const row = part.rows[ry];
        for (let rx = 0; rx < row.length; rx++) {
          const ch = row[rx];
          if (ch === '.' || ch === ' ') continue;
          const gx = part.ox + rx;
          const gy = part.oy + ry;
          const drawGx = mirror ? 15 - gx : gx;
          let color = palette[ch];
          if (chroma && (ch === '#' || ch === 's')) {
            color = evalChromaColorAt(gx, gy, chromaPhase, ch === 's');
          }
          if (!color) continue;
          ctx.fillStyle = color;
          ctx.fillRect((oxGrid + drawGx) * pxSize, (oyGrid + gy) * pxSize, pxSize, pxSize);
        }
      }
    }
  }

  /**
   * 挂载 5 宠像素伴侣舞台（Clawd + 小紫猫 + 3 迷你蟹）
   */
  function mountDualMascotStage(hostEl, options = {}) {
    if (!hostEl) return null;
    const doc = hostEl.ownerDocument || document;
    const win = doc.defaultView || G;
    const dpr = Math.min((win && win.devicePixelRatio) || 1, 2);
    const CANVAS_W = 96;
    const CANVAS_H = 84;
    const OX = 8;
    const OY = 17;

    let disposed = false;
    let tickIdx = 0;
    let miniPileEnabled = options.miniPileEnabled !== false;
    let orchestrator = Boolean(options.orchestrator);
    let streaming = Boolean(options.streaming);
    let reducedMotion = Boolean(options.reducedMotion);
    let dozing = false;
    let prismaticCoat = readStorage(STORAGE_CHROMA_KEY) === '1';
    let chromaPhase = 0;
    let lastActivityAt = nowPerf();
    let tickTimer = null;
    let currentTickMs = 0;
    const chromaTapTimes = [];
    const chromaSparks = [];
    const cleanups = [];
    const timers = new Set();

    const later = (ms, fn) => {
      const id = setTimeout(() => {
        timers.delete(id);
        if (!disposed) fn();
      }, ms);
      timers.add(id);
      return id;
    };

    hostEl.innerHTML = '';

    // 彩虹极光特效画布（覆盖在舞台上方，承载五彩星屑与 5 层满塔彩虹极光弧）
    const fxCanvas = doc.createElement('canvas');
    fxCanvas.className = 'dsh-mascot-fx-canvas';
    fxCanvas.setAttribute('aria-hidden', 'true');
    hostEl.appendChild(fxCanvas);

    const mkEnt = (id, kind, label, cx0) => ({
      id,
      kind,
      label,
      cx: cx0,
      y: 0,
      vx: 0,
      vy: 0,
      rot: 0,
      balRot: 0,
      dir: 1,
      mirror: false,
      dragging: false,
      stackedOn: null,
      flying: 0,
      pose: 'idle',
      overridePose: null,
      overrideUntil: 0,
      sym: null,
      symUntil: 0,
      pokeCount: 0,
      lastPokeAt: 0,
      nextBlink: 12 + Math.floor(Math.random() * 30),
      blinkAt: -99,
      el: null,
      canvas: null,
    });

    const stageWidth = () => Math.max(240, hostEl.clientWidth || 640);
    const w0 = stageWidth();
    const ents = [
      mkEnt('cowboy', 'mini', 'Cowboy Crab · 牛仔蟹', Math.max(46, w0 * 0.14)),
      mkEnt('shades', 'mini', 'Shades Crab · 墨镜蟹', Math.max(96, w0 * 0.24)),
      mkEnt('wizard', 'mini', 'Wizard Crab · 法师蟹', Math.max(146, w0 * 0.34)),
      mkEnt('cat', 'cat', 'Purple Cat · 小紫猫', Math.max(210, w0 - 138)),
      mkEnt('clawd', 'clawd', 'Clawd · 珊瑚蟹', Math.max(270, w0 - 68)),
    ];
    const byId = new Map(ents.map((e) => [e.id, e]));
    const isMini = (e) => e.kind === 'mini';
    const halfW = (e) => (isMini(e) ? 14 : 22);
    const stepH = (holderId) => (holderId === 'cat' || holderId === 'clawd' ? 25 : 15);
    const activeEnts = () => (miniPileEnabled ? ents : ents.filter((e) => !isMini(e)));
    const maxTowerDepth = () => (miniPileEnabled ? 5 : 2);

    const findRider = (holderId) => activeEnts().find((e) => e.stackedOn === holderId) || null;
    const getTowerRoot = (id) => {
      let cur = byId.get(id);
      const seen = new Set();
      while (cur && cur.stackedOn && !seen.has(cur.id)) {
        seen.add(cur.id);
        const base = byId.get(cur.stackedOn);
        if (!base) break;
        cur = base;
      }
      return cur;
    };
    const getTowerMembers = (anyId) => {
      const root = getTowerRoot(anyId);
      if (!root) return [];
      const chain = [root.id];
      const seen = new Set(chain);
      let curId = root.id;
      while (true) {
        const next = findRider(curId);
        if (!next || seen.has(next.id)) break;
        seen.add(next.id);
        chain.push(next.id);
        curId = next.id;
      }
      return chain;
    };
    const getStackTop = (anyId) => {
      const chain = getTowerMembers(anyId);
      return chain.length ? byId.get(chain[chain.length - 1]) : byId.get(anyId);
    };
    const getStackDepth = (id) => {
      const chain = getTowerMembers(id);
      const idx = chain.indexOf(id);
      return idx >= 0 ? idx : 0;
    };
    const computeFootY = (ent) => {
      if (!ent) return 0;
      if (!ent.stackedOn) return ent.y || 0;
      const chain = getTowerMembers(ent.id);
      const root = byId.get(chain[0]);
      let yAcc = root ? root.y || 0 : 0;
      for (let i = 1; i < chain.length; i++) {
        yAcc -= stepH(chain[i - 1]);
        if (chain[i] === ent.id) break;
      }
      return yAcc;
    };
    const listTowers = () => {
      const out = [];
      const vis = new Set();
      for (const e of activeEnts()) {
        if (vis.has(e.id)) continue;
        const chain = getTowerMembers(e.id);
        chain.forEach((cid) => vis.add(cid));
        if (chain.length >= 2) out.push(chain);
      }
      return out;
    };

    const spawnChromaBurst = (cx, footY, count = 16, gentle = false) => {
      for (let i = 0; i < count; i++) {
        if (chromaSparks.length >= 64) chromaSparks.shift();
        const ang = gentle
          ? -Math.PI * (0.25 + Math.random() * 0.5)
          : (i / Math.max(1, count)) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
        const spd = gentle ? 0.7 + Math.random() * 0.9 : 2.1 + (i % 2) * 1.1 + Math.random() * 0.7;
        chromaSparks.push({
          x: cx + (gentle ? (Math.random() - 0.5) * 18 : 0),
          y: footY - 16 + (gentle ? -Math.random() * 14 : 0),
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - (gentle ? 0.9 : 1.3),
          life: 0,
          maxLife: gentle ? 9 : 16,
          color: CHROMA_HEX[i % CHROMA_HEX.length],
          size: gentle ? 3 : i % 3 === 0 ? 4 : 3,
        });
      }
    };

    const triggerChromaAwaken = (forceOn, centerCx, centerY) => {
      const next = forceOn === undefined ? !prismaticCoat : Boolean(forceOn);
      prismaticCoat = next;
      writeStorage(STORAGE_CHROMA_KEY, prismaticCoat ? '1' : null);
      const cat = byId.get('cat');
      const cx = centerCx ?? (cat ? cat.cx : stageWidth() * 0.5);
      const fy = centerY ?? (cat ? computeFootY(cat) : 0);
      spawnChromaBurst(cx, fy, prismaticCoat ? 24 : 8, !prismaticCoat);
      if (cat && prismaticCoat) {
        cat.overridePose = 'happy';
        cat.overrideUntil = nowPerf() + 1600;
        cat.sym = 'spark';
        cat.symUntil = nowPerf() + 1800;
      }
      renderAll(nowPerf());
      return prismaticCoat;
    };

    const syncStackedFollowers = () => {
      for (const root of activeEnts()) {
        if (root.stackedOn) continue;
        const chain = getTowerMembers(root.id);
        if (chain.length < 2) continue;
        let yCursor = root.y || 0;
        for (let i = 1; i < chain.length; i++) {
          const prev = byId.get(chain[i - 1]);
          const rider = byId.get(chain[i]);
          if (!rider || rider.dragging) break;
          yCursor -= stepH(prev.id);
          rider.cx = root.cx;
          rider.y = yCursor;
        }
      }
    };

    const enforceSeparation = (lockedId = null) => {
      const w = stageWidth();
      const ground = activeEnts()
        .filter((e) => !e.stackedOn && !e.dragging && (e.y || 0) >= -3)
        .map((e) => ({ id: e.id, ent: e, cx: e.cx, halfW: halfW(e), locked: e.id === lockedId }));
      resolveGroundSeparation(ground, 16, w - 16, 8);
      for (const g of ground) {
        if (!g.locked) g.ent.cx = g.cx;
      }
      syncStackedFollowers();
    };

    const checkFiveTowerEasterEgg = (now) => {
      const towers = listTowers();
      const fullTower = towers.find((t) => t.length >= 5);
      if (fullTower) {
        const root = byId.get(fullTower[0]);
        if (!prismaticCoat) {
          triggerChromaAwaken(true, root ? root.cx : stageWidth() * 0.5, -80);
        } else if (root) {
          spawnChromaBurst(root.cx, -85, 10, false);
        }
        const top = byId.get(fullTower[fullTower.length - 1]);
        if (top && !isMini(top)) {
          top.sym = 'spark';
          top.symUntil = now + 2200;
        }
      }
    };

    const trySnapOntoTower = (mover, now = nowPerf()) => {
      if (!mover || mover.dragging) return false;
      const moverChain = getTowerMembers(mover.id);
      const maxDepth = maxTowerDepth();
      const seenRoots = new Set(moverChain);

      for (const cand of activeEnts()) {
        const root = getTowerRoot(cand.id);
        if (!root || seenRoots.has(root.id) || root.dragging || (root.y || 0) < -4) continue;
        seenRoots.add(root.id);
        const baseChain = getTowerMembers(root.id);
        if (baseChain.length + moverChain.length > maxDepth) continue;
        const top = byId.get(baseChain[baseChain.length - 1]);
        if (!top || top.dragging) continue;
        const perchY = computeFootY(top) - stepH(top.id);
        const dx = Math.abs(mover.cx - top.cx);
        if (dx <= 34 && (mover.y || 0) >= perchY - 32 && (mover.y || 0) <= perchY + 26) {
          mover.stackedOn = top.id;
          mover.y = 0;
          mover.vx = 0;
          mover.vy = 0;
          mover.rot = 0;
          if (!isMini(mover)) {
            mover.overridePose = 'happy';
            mover.overrideUntil = now + 950;
            mover.sym = 'heart';
            mover.symUntil = now + 1100;
          }
          syncStackedFollowers();
          checkFiveTowerEasterEgg(now);
          renderAll(now);
          return true;
        }
      }
      return false;
    };

    const startGravitySettle = (subRoot, targetHolderId) => {
      if (!subRoot) return;
      const subLen = getTowerMembers(subRoot.id).length;
      const settleId = (subRoot.flying += 1);
      if (reducedMotion) {
        const holder = targetHolderId ? byId.get(targetHolderId) : null;
        if (holder && !holder.dragging && getTowerMembers(holder.id).length + subLen <= maxTowerDepth()) {
          subRoot.stackedOn = holder.id;
          subRoot.y = 0;
        } else {
          subRoot.stackedOn = null;
          subRoot.y = 0;
          enforceSeparation();
        }
        syncStackedFollowers();
        renderAll(nowPerf());
        return;
      }
      let vy = 0.8;
      let prev = nowPerf();
      const step = (now) => {
        if (disposed || settleId !== subRoot.flying || subRoot.dragging) return;
        const k = clamp((now - prev) / 16.667, 0.5, 2.5);
        prev = now;
        let holder = targetHolderId ? byId.get(targetHolderId) : null;
        if (holder && (holder.dragging || getTowerMembers(holder.id).includes(subRoot.id) || getTowerMembers(holder.id).length + subLen > maxTowerDepth())) {
          holder = null;
        }
        const goalY = holder ? computeFootY(holder) - stepH(holder.id) : 0;
        if (holder) subRoot.cx += (holder.cx - subRoot.cx) * Math.min(1, 0.35 * k);
        vy = Math.min(14, vy + 0.55 * k);
        subRoot.y += vy * k;
        if (subRoot.y >= goalY) {
          subRoot.vx = 0;
          subRoot.vy = 0;
          subRoot.stackedOn = holder ? holder.id : null;
          subRoot.y = 0;
          if (!holder) enforceSeparation();
          syncStackedFollowers();
          renderAll(now);
          return;
        }
        syncStackedFollowers();
        renderAll(now);
        win.requestAnimationFrame?.(step);
      };
      win.requestAnimationFrame?.(step);
    };

    const detachWithGravitySettle = (pulledId) => {
      const pulled = byId.get(pulledId);
      if (!pulled) return;
      const lowerHolderId = pulled.stackedOn || null;
      const upperRider = findRider(pulledId);
      if (upperRider) {
        const fy = computeFootY(upperRider);
        upperRider.stackedOn = null;
        upperRider.y = fy;
      }
      pulled.stackedOn = null;
      if (upperRider) startGravitySettle(upperRider, lowerHolderId);
    };

    const startBallistic = (ent, vx0, vy0, noSnap = false) => {
      const flightId = (ent.flying += 1);
      if (reducedMotion) {
        ent.vx = 0;
        ent.vy = 0;
        ent.rot = 0;
        if (noSnap || !trySnapOntoTower(ent, nowPerf())) {
          ent.y = 0;
          enforceSeparation();
          renderAll(nowPerf());
        }
        return;
      }
      let vx = clamp(vx0, -15, 15);
      let vy = clamp(vy0, -15, 15);
      let bounces = 0;
      let prev = nowPerf();
      const step = (now) => {
        if (disposed || flightId !== ent.flying || ent.dragging) return;
        const k = clamp((now - prev) / 16.667, 0.5, 2.5);
        prev = now;
        vy += 0.45 * k;
        vx *= Math.pow(0.985, k);
        vy *= Math.pow(0.985, k);
        const w = stageWidth();
        const hw = halfW(ent);
        ent.cx += vx * k;
        if (ent.cx < 16 + hw) { ent.cx = 16 + hw; vx = -0.45 * vx; }
        else if (ent.cx > w - 16 - hw) { ent.cx = w - 16 - hw; vx = -0.45 * vx; }
        ent.y = Math.max(-170, (ent.y || 0) + vy * k);
        ent.rot = isMini(ent) ? 0 : clamp(-vx * 0.65, -14, 14);

        if (!noSnap && vy >= 0 && trySnapOntoTower(ent, now)) return;

        if (ent.y >= 0) {
          ent.y = 0;
          if (Math.abs(vy) > 2.5 && bounces < 1) {
            vy = -vy * 0.34;
            vx *= 0.78;
            bounces += 1;
          } else {
            ent.vx = 0;
            ent.vy = 0;
            ent.rot = 0;
            enforceSeparation();
            renderAll(now);
            return;
          }
        }
        syncStackedFollowers();
        renderAll(now);
        win.requestAnimationFrame?.(step);
      };
      win.requestAnimationFrame?.(step);
    };

    const wakeUp = () => {
      lastActivityAt = nowPerf();
      if (!dozing) return;
      dozing = false;
      for (const id of ['clawd', 'cat']) {
        const a = byId.get(id);
        if (a) {
          a.overridePose = 'happy';
          a.overrideUntil = nowPerf() + 850;
          a.sym = 'spark';
          a.symUntil = nowPerf() + 900;
        }
      }
      syncHeartbeat();
      renderAll(nowPerf());
    };

    const startDoze = (skipYawn = false) => {
      if (dozing) return;
      dozing = true;
      if (!skipYawn) {
        const cat = byId.get('cat');
        const clawd = byId.get('clawd');
        if (cat) { cat.overridePose = 'yawn'; cat.overrideUntil = nowPerf() + 1100; }
        later(380, () => {
          if (dozing && clawd) { clawd.overridePose = 'yawn'; clawd.overrideUntil = nowPerf() + 1100; }
        });
      }
      syncHeartbeat();
      renderAll(nowPerf());
    };

    // 创建每个伴侣 DOM 与指针拖拽绑定
    for (const ent of ents) {
      const wrap = doc.createElement('div');
      wrap.className = isMini(ent) ? 'dsh-mascot-actor is-mini' : 'dsh-mascot-actor is-main';
      wrap.setAttribute('data-mascot-id', ent.id);
      wrap.setAttribute('role', 'button');
      wrap.setAttribute('tabindex', '0');
      wrap.setAttribute('title', `${ent.label}（可拖拽叠塔 · 叠满5层或叠塔连点4下觉醒彩虹极光）`);

      const cv = doc.createElement('canvas');
      cv.className = 'dsh-mascot-canvas';
      const cw = isMini(ent) ? 40 : CANVAS_W;
      const ch = isMini(ent) ? 32 : CANVAS_H;
      cv.width = Math.round(cw * dpr);
      cv.height = Math.round(ch * dpr);
      cv.style.width = `${cw}px`;
      cv.style.height = `${ch}px`;
      wrap.appendChild(cv);
      hostEl.appendChild(wrap);
      ent.el = wrap;
      ent.canvas = cv;

      let downX = 0;
      let downY = 0;
      let startCx = 0;
      let startY = 0;
      let lastX = 0;
      let lastY = 0;
      let lastT = 0;
      let moved = false;

      const onDown = (ev) => {
        if (ev.button !== 0) return;
        ev.preventDefault();
        ev.stopPropagation();
        wakeUp();
        safe(() => wrap.setPointerCapture?.(ev.pointerId));
        downX = ev.clientX;
        downY = ev.clientY;
        startCx = ent.cx;
        startY = ent.stackedOn ? computeFootY(ent) : ent.y;
        lastX = ev.clientX;
        lastY = ev.clientY;
        lastT = nowPerf();
        moved = false;
        ent.flying += 1;
        ent.vx = 0;
        ent.vy = 0;
      };

      const onMove = (ev) => {
        if (!lastT) return;
        const dx = ev.clientX - downX;
        const dy = ev.clientY - downY;
        if (!moved && Math.hypot(dx, dy) > 4) {
          moved = true;
          detachWithGravitySettle(ent.id);
          ent.dragging = true;
          wrap.setAttribute('data-dragging', '1');
        }
        if (!moved) return;
        const now = nowPerf();
        const dt = Math.max(4, now - lastT);
        ent.vx = ent.vx * 0.4 + (((ev.clientX - lastX) / dt) * 16) * 0.6;
        ent.vy = ent.vy * 0.4 + (((ev.clientY - lastY) / dt) * 16) * 0.6;
        ent.rot = isMini(ent) ? 0 : clamp(-ent.vx * 0.7, -14, 14);
        lastX = ev.clientX;
        lastY = ev.clientY;
        lastT = now;

        const w = stageWidth();
        const hw = halfW(ent);
        ent.cx = clamp(startCx + dx, 14 + hw, w - 14 - hw);
        ent.y = clamp(startY + dy, -175, 0);
        renderAll(now);
      };

      const onUp = (ev) => {
        if (!lastT) return;
        safe(() => wrap.releasePointerCapture?.(ev.pointerId));
        const prevT = lastT;
        lastT = 0;
        const now = nowPerf();
        if (moved) {
          ent.dragging = false;
          wrap.removeAttribute('data-dragging');
          if (now - prevT > 40) { ent.vx = 0; ent.vy = 0; }
          if (Math.hypot(ent.vx, ent.vy) < 5.5 && trySnapOntoTower(ent, now)) {
            moved = false;
            return;
          }
          startBallistic(ent, ent.vx * 0.82, ent.vy * 0.82);
          moved = false;
          return;
        }

        // 点击交互：叠塔态 2.6s 内连点 4 下触发彩虹极光彩蛋，否则触发戳戳跳动
        const towerLen = getTowerMembers(ent.id).length;
        if (towerLen >= 2 && (ent.id === 'cat' || ent.id === 'clawd' || getStackTop(ent.id)?.id === ent.id)) {
          while (chromaTapTimes.length && now - chromaTapTimes[0] > 2600) chromaTapTimes.shift();
          chromaTapTimes.push(now);
          if (chromaTapTimes.length >= 4) {
            chromaTapTimes.length = 0;
            triggerChromaAwaken(undefined, ent.cx, computeFootY(ent));
            return;
          }
        }
        if (now - ent.lastPokeAt > 4000) ent.pokeCount = 0;
        ent.pokeCount += 1;
        ent.lastPokeAt = now;
        if (!isMini(ent)) {
          ent.overridePose = ent.pokeCount % 2 === 1 ? 'happy' : 'wow';
          ent.overrideUntil = now + 820;
          ent.sym = ent.pokeCount === 1 ? 'spark' : ent.pokeCount === 2 ? 'note' : ent.pokeCount === 3 ? 'q' : 'heart';
          ent.symUntil = now + 950;
        }
        if (towerLen < 2) startBallistic(ent, 0, -4.2, true);
        renderAll(now);
      };

      wrap.addEventListener('pointerdown', onDown);
      wrap.addEventListener('pointermove', onMove);
      wrap.addEventListener('pointerup', onUp);
      wrap.addEventListener('pointercancel', onUp);
      cleanups.push(() => {
        wrap.removeEventListener('pointerdown', onDown);
        wrap.removeEventListener('pointermove', onMove);
        wrap.removeEventListener('pointerup', onUp);
        wrap.removeEventListener('pointercancel', onUp);
      });
    }

    const renderFxOverlay = (now) => {
      const towers = listTowers();
      const fullTower = towers.find((t) => t.length >= 5);
      const needFx = prismaticCoat || Boolean(fullTower) || chromaSparks.length > 0;
      const w = stageWidth();
      const h = 156;
      if (!needFx) {
        if (fxCanvas.width !== 0) {
          fxCanvas.width = 0;
          fxCanvas.height = 0;
          fxCanvas.style.display = 'none';
        }
        return;
      }
      fxCanvas.style.display = 'block';
      const tw = Math.round(w * dpr);
      const th = Math.round(h * dpr);
      if (fxCanvas.width !== tw || fxCanvas.height !== th) {
        fxCanvas.width = tw;
        fxCanvas.height = th;
        fxCanvas.style.width = `${w}px`;
        fxCanvas.style.height = `${h}px`;
      }
      const ctx = fxCanvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // 彩虹极光弧光（觉醒态或 5 层满塔时在舞台上方展开全息极光带）
      if (prismaticCoat || fullTower) {
        const anchorEnt = fullTower ? byId.get(fullTower[0]) : byId.get('cat');
        const ax = anchorEnt ? anchorEnt.cx : w * 0.5;
        const ay = fullTower ? h - 118 : h - 56;
        const rad = fullTower ? 88 : 54;
        ctx.save();
        for (let band = 0; band < CHROMA_HEX.length; band++) {
          ctx.strokeStyle = CHROMA_HEX[(band + Math.floor(chromaPhase * 5)) % CHROMA_HEX.length];
          ctx.globalAlpha = fullTower ? 0.34 : 0.22;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(ax, ay + 18, rad - band * 4.5, Math.PI * 1.12, Math.PI * 1.88);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 步进并绘制彩虹星屑粒子
      for (let i = chromaSparks.length - 1; i >= 0; i--) {
        const sp = chromaSparks[i];
        sp.life += 1;
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vy += 0.14;
        if (sp.life >= sp.maxLife) {
          chromaSparks.splice(i, 1);
          continue;
        }
        const alpha = 1 - sp.life / sp.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = sp.color;
        const py = h + sp.y;
        ctx.fillRect(Math.round(sp.x), Math.round(py), sp.size, sp.size);
        ctx.restore();
      }
    };

    const renderAll = (now) => {
      if (disposed) return;
      const anyActive = activeEnts();
      const fullTowerIds = new Set(listTowers().find((t) => t.length >= 5) || []);

      for (const ent of ents) {
        const visible = !isMini(ent) || miniPileEnabled;
        if (ent.el) ent.el.style.display = visible ? 'block' : 'none';
        if (!visible) continue;

        const ctx = ent.canvas?.getContext?.('2d');
        if (!ctx) continue;
        const cw = isMini(ent) ? 40 : CANVAS_W;
        const ch = isMini(ent) ? 32 : CANVAS_H;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, cw, ch);
        ctx.imageSmoothingEnabled = false;

        const isChroma = prismaticCoat && (ent.id === 'cat' || fullTowerIds.has(ent.id));
        const depth = ent.stackedOn ? getStackDepth(ent.id) : 0;
        const footY = ent.stackedOn && !ent.dragging ? computeFootY(ent) : ent.y || 0;
        const sway = ent.stackedOn && !ent.dragging && !reducedMotion ? Math.sin(tickIdx * 0.28 + depth * 0.8) * (1.2 + depth * 0.9) : 0;

        if (isMini(ent)) {
          const isTrick = !reducedMotion && !dozing && (tickIdx + ent.cx) % 28 >= 22;
          const sprite = isTrick ? MINI_TRICK_SPRITES[ent.id] : MINI_SPRITES[ent.id];
          drawPixelSprite(ctx, 2, 5, 2, MASCOT_PALETTES[ent.id], [sprite], {
            mirror: ent.dir < 0,
            chroma: isChroma,
            chromaPhase,
          });
        } else {
          const isCat = ent.id === 'cat';
          const parts = isCat ? CAT_PARTS : CLAWD_PARTS;
          const pose = ent.dragging
            ? 'dangle'
            : ent.overridePose && now < ent.overrideUntil
              ? ent.overridePose
              : streaming
                ? isCat ? 'loaf' : 'write'
                : dozing
                  ? 'sleep'
                  : 'idle';
          const isBlinking = !dozing && tickIdx - ent.blinkAt >= 0 && tickIdx - ent.blinkAt < 2;
          const layers = [];
          if (!ent.dragging && !ent.stackedOn && footY >= -2) layers.push(parts.shadow);
          if (isCat) {
            layers.push(pose === 'sleep' || pose === 'loaf' ? parts.ears.loaf : tickIdx % 37 === 0 ? parts.ears.twitch : parts.ears.stand);
            layers.push(pose === 'sleep' || pose === 'loaf' ? parts.body.loaf : pose === 'happy' ? parts.body.squash : parts.body.stand);
            layers.push(pose === 'sleep' || pose === 'loaf' ? parts.tail.loaf : tickIdx % 6 < 3 ? parts.tail.up : parts.tail.sway);
            if (pose !== 'sleep' && pose !== 'loaf') {
              layers.push(pose === 'dangle' ? parts.legs.dangle : pose === 'walk' ? (tickIdx % 2 ? parts.legs.walkA : parts.legs.walkB) : parts.legs.stand);
            }
            layers.push(
              pose === 'sleep'
                ? parts.eyes.loafShut
                : pose === 'happy'
                  ? parts.eyes.happy
                  : pose === 'wow'
                    ? parts.eyes.wide
                    : isBlinking
                      ? parts.eyes.blink
                      : parts.eyes.open
            );
            if (pose === 'yawn') layers.push(parts.mouth.yawn);
          } else {
            layers.push(pose === 'dangle' ? parts.legs.dangle : pose === 'walk' ? (tickIdx % 2 ? parts.legs.walkA : parts.legs.walkB) : parts.legs.stand);
            layers.push(pose === 'happy' ? parts.body.squash : parts.body.stand);
            layers.push(
              pose === 'sleep'
                ? parts.eyes.shut
                : pose === 'happy'
                  ? parts.eyes.happy
                  : pose === 'wow'
                    ? parts.eyes.wide
                    : isBlinking
                      ? parts.eyes.blink
                      : parts.eyes.open
            );
            layers.push(pose === 'happy' || depth > 0 ? parts.clawL.up : parts.clawL.stub);
            layers.push(pose === 'write' ? parts.clawR.write : pose === 'happy' || depth > 0 ? parts.clawR.up : parts.clawR.stub);
            if (pose === 'yawn') layers.push(parts.mouth.yawn);
            if (orchestrator && !dozing) {
              layers.push(tickIdx % 8 < 4 ? MASCOT_SYMS.iceCrystal : MASCOT_SYMS.iceCrystalHi);
            }
          }

          if (dozing && pose === 'sleep') {
            const zPh = tickIdx % 12;
            layers.push(zPh < 4 ? MASCOT_SYMS.dozeZ0 : zPh < 8 ? MASCOT_SYMS.dozeZ1 : MASCOT_SYMS.dozeZ2);
          } else if (ent.sym && now < ent.symUntil && MASCOT_SYMS[ent.sym]) {
            layers.push(MASCOT_SYMS[ent.sym]);
          }

          drawPixelSprite(ctx, OX, OY, PX, MASCOT_PALETTES[ent.id], layers, {
            mirror: ent.mirror,
            chroma: isChroma,
            chromaPhase,
          });
        }

        const domX = Math.round(ent.cx - cw * 0.5);
        const domY = Math.round(footY);
        const rot = ent.dragging ? ent.rot : sway;
        ent.el.style.transform = `translate3d(${domX}px, ${domY}px, 0) rotate(${rot.toFixed(1)}deg)`;
        ent.el.style.zIndex = ent.dragging ? '45' : String(20 + depth * 3 + (isMini(ent) ? 0 : 1));
      }
      renderFxOverlay(now);
    };

    const onTick = () => {
      if (disposed || doc.hidden) return;
      tickIdx += 1;
      const now = nowPerf();
      if (prismaticCoat) {
        chromaPhase = (chromaPhase + 0.045) % 1;
        if (!reducedMotion && tickIdx % 6 === 0) {
          const cat = byId.get('cat');
          if (cat) spawnChromaBurst(cat.cx, computeFootY(cat), 1, true);
        }
      }

      // 闲置 45s（深夜 30s）自动打哈欠进入打盹
      const hour = new Date().getHours();
      const dozeLimit = hour >= 23 || hour < 6 ? 30000 : 45000;
      const anyDrag = activeEnts().some((e) => e.dragging);
      if (!streaming && !anyDrag && !dozing && now - lastActivityAt > dozeLimit) {
        startDoze(false);
      }

      // 眨眼与自由迷你蟹走廊微漫步
      for (const ent of activeEnts()) {
        if (tickIdx >= ent.nextBlink) {
          ent.blinkAt = tickIdx;
          ent.nextBlink = tickIdx + 24 + Math.floor(Math.random() * 40);
        }
        if (isMini(ent) && !ent.dragging && !ent.stackedOn && !dozing && !reducedMotion && ent.y === 0) {
          if (tickIdx % 3 === 0) {
            const w = stageWidth();
            ent.cx += ent.dir * 1.1;
            if (ent.cx < 32) { ent.cx = 32; ent.dir = 1; }
            if (ent.cx > w * 0.56) { ent.cx = w * 0.56; ent.dir = -1; }
            if (Math.random() < 0.025) ent.dir *= -1;
          }
        }
      }
      if (!anyDrag) enforceSeparation();
      renderAll(now);
    };

    function syncHeartbeat() {
      const target = disposed || doc.hidden || reducedMotion ? 0 : dozing ? DOZE_TICK_MS : TICK_MS;
      if (target === currentTickMs) return;
      if (tickTimer !== null) { clearInterval(tickTimer); tickTimer = null; }
      currentTickMs = target;
      if (target > 0) tickTimer = setInterval(onTick, target);
    }

    const onVis = () => {
      syncHeartbeat();
      if (!doc.hidden) renderAll(nowPerf());
    };
    doc.addEventListener('visibilitychange', onVis);
    cleanups.push(() => doc.removeEventListener('visibilitychange', onVis));

    enforceSeparation();
    renderAll(nowPerf());
    syncHeartbeat();

    // 快捷一键堆叠 5 层图腾塔并唤醒彩虹极光
    const stackFiveTower = () => {
      wakeUp();
      miniPileEnabled = true;
      const order = ['clawd', 'cat', 'cowboy', 'shades', 'wizard'];
      const baseX = clamp(stageWidth() * 0.52, 80, stageWidth() - 80);
      order.forEach((id, i) => {
        const e = byId.get(id);
        if (!e) return;
        e.flying += 1;
        e.dragging = false;
        e.cx = baseX;
        e.y = 0;
        e.stackedOn = i === 0 ? null : order[i - 1];
      });
      syncStackedFollowers();
      checkFiveTowerEasterEgg(nowPerf());
      renderAll(nowPerf());
      return listTowers();
    };

    const unstackAll = () => {
      wakeUp();
      const w = stageWidth();
      const spots = [w * 0.14, w * 0.25, w * 0.36, w - 138, w - 68];
      ents.forEach((e, idx) => {
        e.flying += 1;
        e.stackedOn = null;
        e.y = 0;
        e.vx = 0;
        e.vy = 0;
        e.cx = clamp(spots[idx], 26, w - 26);
      });
      enforceSeparation();
      renderAll(nowPerf());
    };

    return {
      setState(next = {}) {
        if (next.miniPileEnabled !== undefined) miniPileEnabled = Boolean(next.miniPileEnabled);
        if (next.orchestrator !== undefined) orchestrator = Boolean(next.orchestrator);
        if (next.streaming !== undefined) streaming = Boolean(next.streaming);
        if (next.reducedMotion !== undefined) reducedMotion = Boolean(next.reducedMotion);
        syncHeartbeat();
        enforceSeparation();
        renderAll(nowPerf());
      },
      notify(event) {
        wakeUp();
        const cat = byId.get('cat');
        const clawd = byId.get('clawd');
        if (event === 'complete' || event === 'celebrate') {
          [clawd, cat].forEach((a) => {
            if (!a) return;
            a.overridePose = 'happy';
            a.overrideUntil = nowPerf() + 1400;
            a.sym = 'heart';
            a.symUntil = nowPerf() + 1600;
            if (!a.stackedOn) startBallistic(a, 0, -4.8, true);
          });
        } else if (event === 'vial-opened' || event === 'model-shift') {
          if (clawd) { clawd.sym = 'spark'; clawd.symUntil = nowPerf() + 900; }
        }
        renderAll(nowPerf());
      },
      stackFiveTower,
      unstackAll,
      toggleRainbowAurora: (force) => triggerChromaAwaken(force),
      bumpMascots() {
        wakeUp();
        const now = nowPerf();
        const cat = byId.get('cat');
        const clawd = byId.get('clawd');
        if (cat && clawd) {
          if (cat.stackedOn) detachWithGravitySettle('cat');
          if (clawd.stackedOn) detachWithGravitySettle('clawd');
          cat.overridePose = 'wow';
          cat.overrideUntil = now + 900;
          cat.sym = 'spark';
          cat.symUntil = now + 1050;
          clawd.overridePose = 'happy';
          clawd.overrideUntil = now + 900;
          clawd.sym = 'bang';
          clawd.symUntil = now + 1050;
          startBallistic(cat, -2.6, -4.6, true);
          startBallistic(clawd, 2.6, -4.6, true);
        }
        for (const e of activeEnts()) {
          if (isMini(e) && !e.stackedOn) {
            e.dir *= -1;
            startBallistic(e, e.dir * 2.4, -3.4, true);
          }
        }
        renderAll(now);
      },
      triggerDemo(kind) {
        if (kind === 'doze' || kind === 'sleep') startDoze(false);
        else if (kind === 'wake') wakeUp();
        else if (kind === 'stack' || kind === 'stack5') stackFiveTower();
        else if (kind === 'unstack') unstackAll();
        else if (kind === 'aurora' || kind === 'rainbow') triggerChromaAwaken();
        else if (kind === 'bump') {
          this.bumpMascots();
        } else if (kind === 'celebrate') {
          wakeUp();
          const clawd = byId.get('clawd');
          if (clawd) { clawd.overridePose = 'happy'; clawd.overrideUntil = nowPerf() + 1200; clawd.sym = 'heart'; clawd.symUntil = nowPerf() + 1300; }
          renderAll(nowPerf());
        } else if (kind === 'toss') {
          wakeUp();
          const cat = byId.get('cat');
          if (cat) { detachWithGravitySettle('cat'); cat.y = -32; startBallistic(cat, -3.6, -7.2); }
        }
      },
      getLayoutSnapshot: () => ({
        miniPileEnabled,
        orchestrator,
        dozing,
        prismaticCoat,
        towers: listTowers(),
        actors: activeEnts().map((e) => ({ id: e.id, cx: Math.round(e.cx), y: Math.round(computeFootY(e)), stackedOn: e.stackedOn })),
      }),
      dispose() {
        disposed = true;
        if (tickTimer !== null) clearInterval(tickTimer);
        timers.forEach((t) => clearTimeout(t));
        timers.clear();
        cleanups.forEach((fn) => safe(fn));
        hostEl.innerHTML = '';
      },
    };
  }

  const mascotCore = {
    PX,
    TICK: TICK_MS,
    DOZE_TICK: DOZE_TICK_MS,
    PALETTES: MASCOT_PALETTES,
    CLAWD_PARTS,
    CAT_PARTS,
    MINI_SPRITES,
    evalChromaColorAt,
    resolveGroundSeparation,
    mountDualMascotStage,
  };

  // ═════════════════════════════════════════════════════════════════════════════
  // 兜底样式注入（使用 --ag-prism-* / --dsw-* 语义变量，与 prism-style.css 无缝融合）
  // ═════════════════════════════════════════════════════════════════════════════
  const FALLBACK_CSS = `
    .dsh-prism-vial-dock{display:inline-flex;align-items:center;gap:6px;position:relative;z-index:20;font-family:var(--dsw-font-family,var(--dsw-font-sans,Inter,system-ui,sans-serif))}
    .dsh-prism-vial-trigger{display:inline-flex;align-items:center;gap:7px;height:30px;padding:0 10px 0 7px;border-radius:var(--ag-prism-radius-pill,999px);border:1px solid var(--dsw-alias-border-l2,var(--ag-prism-border,rgba(148,163,184,.24)));background:var(--dsw-alias-bg-layer-2,var(--ag-prism-surface-2,rgba(20,24,34,.78)));color:var(--dsw-alias-label-primary,var(--ag-prism-fg,#eef1f7));font-size:12px;font-weight:500;cursor:pointer;backdrop-filter:blur(12px);transition:border-color .18s,background .18s,transform .16s}
    .dsh-prism-vial-trigger:hover{border-color:var(--ag-prism-accent,#3186ff);transform:translateY(-1px)}
    .dsh-prism-vial-trigger[data-critical="1"]{border-color:rgba(245,158,11,.65);color:#fbbf24}
    .dsh-prism-mini-capsule{position:relative;width:12px;height:18px;border-radius:6px;border:1px solid rgba(148,197,255,.55);background:rgba(15,23,42,.38);overflow:hidden;flex-shrink:0}
    .dsh-prism-mini-liquid{position:absolute;left:1px;right:1px;bottom:1px;border-radius:0 0 4px 4px;background:linear-gradient(180deg,var(--ag-prism-accent-hi,#5cc6fc),var(--ag-prism-accent,#3186ff));transition:height .35s cubic-bezier(.22,1,.36,1)}
    .dsh-prism-vial-trigger[data-streaming="1"] .dsh-prism-mini-liquid{animation:dshVialBreathe 1.8s ease-in-out infinite}
    .dsh-prism-vial-trigger[data-critical="1"] .dsh-prism-mini-liquid{background:linear-gradient(180deg,#fde047,#f59e0b,#ea580c)}
    @keyframes dshVialBreathe{0%,100%{filter:brightness(1)}50%{filter:brightness(1.28)}}
    .dsh-prism-vial-pct{font-variant-numeric:tabular-nums;font-weight:600;font-family:var(--dsw-font-mono,var(--ag-prism-mono,"JetBrains Mono",monospace))}
    .dsh-prism-vial-meta{font-size:11px;opacity:.74;font-variant-numeric:tabular-nums;font-family:var(--dsw-font-mono,var(--ag-prism-mono,"JetBrains Mono",monospace))}
    .dsh-prism-gear-btn{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:var(--ag-prism-radius-pill,999px);border:1px solid var(--dsw-alias-border-l2,var(--ag-prism-border,rgba(148,163,184,.24)));background:var(--dsw-alias-bg-layer-2,var(--ag-prism-surface-2,rgba(20,24,34,.78)));color:var(--dsw-alias-label-primary,var(--ag-prism-fg,#eef1f7));cursor:pointer;backdrop-filter:blur(12px);transition:border-color .18s,transform .22s}
    .dsh-prism-gear-btn:hover{border-color:var(--ag-prism-accent,#3186ff);transform:rotate(28deg)}
    .dsh-prism-vial-popover{position:fixed;z-index:9500;width:min(428px,calc(100vw - 24px));padding:12px;border-radius:var(--ag-prism-radius-lg,14px);border:1px solid var(--dsw-alias-border-l1,var(--ag-prism-border-strong,rgba(148,163,184,.28)));background:var(--dsw-alias-bg-layer-2,var(--ag-prism-popover-bg,rgba(14,16,23,.94)));color:var(--dsw-alias-label-primary,var(--ag-prism-fg,#eef1f7));box-shadow:0 20px 52px rgba(0,0,0,.44),inset 0 1px 0 rgba(255,255,255,.08);backdrop-filter:blur(22px) saturate(145%);display:grid;grid-template-columns:108px minmax(0,1fr);gap:12px;transform-origin:bottom right;animation:dshPopIn .18s cubic-bezier(.22,1,.36,1)}
    .dsh-prism-vial-popover[hidden]{display:none!important}
    .dsh-prism-vial-popover[data-mode="bar"]{grid-template-columns:1fr;width:min(336px,calc(100vw - 24px))}
    .dsh-prism-vial-popover[data-mode="bar"] .dsh-vial-well{display:none}
    @keyframes dshPopIn{from{opacity:0;transform:translateY(8px) scale(.96)}to{opacity:1;transform:none}}
    /* InputBar measures its two flex groups. Keep the dock in the leading group and
       compact against the row's own inline-size container, including split panes. */
    .dsh-prism-vial-dock[data-prism-composer-tools]{position:static;z-index:auto;flex:0 0 auto;gap:4px;white-space:nowrap}
    [data-prism-composer-tools] > button{box-sizing:border-box;height:28px}
    [data-prism-composer-tools] .dsh-prism-gear-btn{width:28px;padding:0}
    @container (max-width:700px){[data-prism-composer-tools] .dsh-prism-vial-meta{display:none}}
    @container (max-width:540px){
      [data-prism-composer-tools] .dsh-prism-vial-pct{display:none}
      [data-prism-composer-tools] .dsh-prism-vial-trigger{width:28px;padding:0;justify-content:center}
    }
    @container (max-width:235px){.dsh-prism-vial-dock[data-prism-composer-tools]{display:none}}
    .dsh-vial-well{display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:8px 4px;border-radius:11px;border:1px solid var(--ag-prism-border,rgba(148,163,184,.16));background:var(--ag-prism-console-well,rgba(7,9,15,.62));box-shadow:inset 0 2px 10px rgba(0,0,0,.38)}
    .dsh-vial-well-hd{width:100%;display:flex;align-items:baseline;justify-content:space-between;padding:0 6px;font-size:10px;opacity:.82;font-family:var(--ag-prism-mono,"JetBrains Mono",monospace)}
    .dsh-vial-well-hd strong{font-size:13px;color:var(--ag-prism-accent-hi,#5cc6fc)}
    .dsh-vial-canvas{width:96px;height:220px;cursor:pointer;display:block}
    .dsh-vial-well-ft{font-size:10.5px;opacity:.74;font-family:var(--ag-prism-mono,"JetBrains Mono",monospace)}
    .dsh-vial-panel{display:flex;flex-direction:column;gap:9px;min-width:0}
    .dsh-vial-head{display:flex;align-items:center;justify-content:space-between;gap:6px;cursor:grab;user-select:none}
    .dsh-vial-head:active{cursor:grabbing}
    .dsh-vial-title{font-size:12.5px;font-weight:600;display:flex;align-items:center;gap:6px}
    .dsh-vial-head-btns{display:inline-flex;align-items:center;gap:5px}
    .dsh-vial-pill-btn{height:22px;padding:0 8px;border-radius:999px;border:1px solid var(--ag-prism-border,rgba(148,163,184,.25));background:transparent;color:inherit;font-size:10.5px;cursor:pointer}
    .dsh-vial-pill-btn:hover{background:rgba(148,163,184,.15)}
    .dsh-vial-stackbar{display:flex;height:7px;border-radius:999px;overflow:hidden;background:rgba(148,163,184,.18);position:relative}
    .dsh-vial-seg{height:100%;transition:width .24s ease,filter .15s;cursor:pointer}
    .dsh-vial-seg:hover,.dsh-vial-seg[data-hover="1"]{filter:brightness(1.26)}
    .dsh-vial-threshold{position:absolute;left:85%;top:0;bottom:0;width:1.5px;background:rgba(245,158,11,.85);pointer-events:none}
    .dsh-vial-slices{display:grid;grid-template-columns:1fr 1fr;gap:5px}
    .dsh-vial-slice-row{display:flex;align-items:center;justify-content:space-between;gap:6px;padding:5px 7px;border-radius:7px;border:1px solid transparent;background:rgba(148,163,184,.07);font-size:11px;cursor:pointer;transition:border-color .15s,background .15s}
    .dsh-vial-slice-row:hover,.dsh-vial-slice-row[data-hover="1"]{border-color:var(--ag-prism-accent,#3186ff);background:rgba(49,134,255,.12)}
    .dsh-vial-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
    .dsh-vial-slice-lbl{display:inline-flex;align-items:center;gap:5px;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .dsh-vial-slice-val{font-family:var(--ag-prism-mono,"JetBrains Mono",monospace);font-variant-numeric:tabular-nums;font-weight:600;font-size:10.5px}
    .dsh-vial-quotas{border-top:1px solid var(--ag-prism-border,rgba(148,163,184,.15));padding-top:8px;display:flex;flex-direction:column;gap:6px}
    .dsh-vial-qhead{display:flex;align-items:center;justify-content:space-between;gap:6px;font-size:11px}
    .dsh-vial-pace{padding:1px 7px;border-radius:999px;font-size:10px;font-weight:600}
    .dsh-vial-pace[data-pace="ok"]{background:rgba(16,185,129,.16);color:#34d399}
    .dsh-vial-pace[data-pace="tight"]{background:rgba(245,158,11,.18);color:#fbbf24}
    .dsh-vial-pace[data-pace="exhaust"]{background:rgba(239,68,68,.2);color:#f87171}
    .dsh-vial-pace[data-pace="idle"]{background:rgba(148,163,184,.16);color:#94a3b8}
    .dsh-vial-qrow{display:grid;grid-template-columns:56px 1fr auto;align-items:center;gap:7px;font-size:10.5px}
    .dsh-vial-qbar{height:5px;border-radius:999px;background:rgba(148,163,184,.18);overflow:hidden}
    .dsh-vial-qfill{height:100%;border-radius:999px;background:linear-gradient(90deg,var(--ag-prism-accent,#3186ff),var(--ag-prism-accent-hi,#5cc6fc));transition:width .3s ease}
    .dsh-vial-qrow[data-warn="1"] .dsh-vial-qfill{background:linear-gradient(90deg,#d97706,#fbbf24)}
    .dsh-vial-qrow[data-warn="2"] .dsh-vial-qfill{background:linear-gradient(90deg,#dc2626,#f87171)}
    .dsh-vial-forecast{font-size:10.5px;opacity:.78;display:flex;justify-content:space-between;gap:6px;flex-wrap:wrap}

    .dsh-effort-widget{display:flex;flex-direction:column;gap:6px;min-width:236px;max-width:340px;font-family:var(--dsw-font-sans,Inter,system-ui,sans-serif)}
    .dsh-effort-head{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:11.5px}
    .dsh-effort-title{display:inline-flex;align-items:center;gap:5px;font-weight:600;color:var(--ag-prism-fg,#eef1f7)}
    .dsh-effort-badge{font-size:11px;font-weight:600;padding:1px 8px;border-radius:999px;background:rgba(49,134,255,.16);color:var(--ag-prism-accent-hi,#60a5fa);transition:all .2s}
    .dsh-effort-widget[data-orchestrator="1"] .dsh-effort-badge{background:linear-gradient(90deg,rgba(76,141,246,.22),rgba(155,114,203,.24),rgba(242,184,75,.2));color:#f8fafc;border:1px solid rgba(255,255,255,.22)}
    .dsh-effort-track-wrap{position:relative;height:28px;border-radius:999px;cursor:pointer;user-select:none;touch-action:none;overflow:visible}
    .dsh-effort-canvas{width:100%;height:28px;display:block;border-radius:999px}
    .dsh-effort-knob{position:absolute;top:2px;width:24px;height:24px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#dbeafe 65%,#93c5fd);box-shadow:0 2px 10px rgba(0,0,0,.38),0 0 0 1px rgba(255,255,255,.65);pointer-events:none;transition:left .18s cubic-bezier(.22,1,.36,1),opacity .2s,transform .16s}
    .dsh-effort-widget[data-orchestrator="1"] .dsh-effort-knob{opacity:0;transform:scale(.6)}
    .dsh-effort-labels{display:flex;justify-content:space-between;gap:2px}
    .dsh-effort-step-btn{border:0;background:transparent;color:var(--ag-prism-muted,#94a3b8);font-size:10px;padding:1px 4px;border-radius:5px;cursor:pointer;transition:color .15s,background .15s}
    .dsh-effort-step-btn:hover,.dsh-effort-step-btn[aria-pressed="true"]{color:var(--ag-prism-fg,#f8fafc);background:rgba(148,163,184,.16);font-weight:600}

    .dsh-mascot-stage{position:relative;width:100%;height:74px;margin-bottom:-4px;pointer-events:none;overflow:visible;z-index:15;user-select:none}
    .dsh-mascot-stage[data-prism-companion-stage]{position:absolute;inset:auto 6px calc(100% - 2px) 6px;width:auto;height:38px;margin:0;z-index:2;overflow:visible}
    .dsh-mascot-stage[data-prism-companion-stage]{pointer-events:none!important}
    .dsh-mascot-stage[data-prism-companion-stage] > [data-prism-companion]{pointer-events:auto!important}
    .dsh-mascot-stage[data-hidden="1"]{display:none!important}
    .dsh-mascot-fx-canvas{position:absolute;left:0;bottom:0;pointer-events:none;z-index:42;image-rendering:pixelated}
    .dsh-mascot-actor{position:absolute;left:0;bottom:0;pointer-events:auto;cursor:grab;touch-action:none;transform-origin:center bottom;will-change:transform}
    .dsh-mascot-actor[data-dragging="1"]{cursor:grabbing}
    .dsh-mascot-canvas{display:block;image-rendering:pixelated;image-rendering:crisp-edges}
  `;

  function injectFallbackCss(doc) {
    if (!doc || !doc.head || doc.getElementById(WIDGET_STYLE_ID)) return;
    const style = doc.createElement('style');
    style.id = WIDGET_STYLE_ID;
    style.textContent = FALLBACK_CSS;
    doc.head.appendChild(style);
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // 统一宿主装配控制器: window.DSHPrismWidgets.init(bridge, options)
  // ═════════════════════════════════════════════════════════════════════════════
  let activeInstance = null;

  function init(bridge, options = {}) {
    if (typeof document === 'undefined') return null;
    if (activeInstance) {
      safe(() => activeInstance.destroy());
      activeInstance = null;
    }

    const doc = options.doc || document;
    const win = options.win || G;
    const activeBridge = bridge || win.__agPrismBridge || null;
    injectFallbackCss(doc);

    let destroyed = false;
    const cleanups = [];
    const transientTimers = new Set();
    const on = (el, ev, fn, opt) => {
      if (!el?.addEventListener) return;
      el.addEventListener(ev, fn, opt);
      cleanups.push(() => el.removeEventListener(ev, fn, opt));
    };
    const safeTimeout = (fn, ms) => {
      const id = setTimeout(() => {
        transientTimers.delete(id);
        if (!destroyed) fn();
      }, ms);
      transientTimers.add(id);
      return id;
    };
    // 卸载时移除自行注入的兜底 <style>，确保热重载与卸载无残留
    cleanups.push(() => {
      transientTimers.forEach((t) => clearTimeout(t));
      transientTimers.clear();
      const st = doc.getElementById?.(WIDGET_STYLE_ID);
      if (st) safe(() => st.remove());
    });

    const readBridgeConfig = () => {
      const cfg = safe(() => activeBridge?.getConfig?.()) || safe(() => activeBridge?.config) || {};
      return cfg && typeof cfg === 'object' ? cfg : {};
    };

    const emptyTelemetry = () => ({
      model: null,
      maxTokens: null,
      usedTokens: null,
      usedFraction: null,
      slices: { system: null, conversation: null, tools: null },
      tps: null,
      ttftSeconds: null,
      streaming: false,
      billingMode: 'api',
      quotas: null,
    });
    const state = {
      vialOpen: false,
      vialMode: readStorage(STORAGE_VIAL_MODE_KEY) === 'bar' ? 'bar' : 'vial',
      hoveredSlice: -1,
      effort: null,
      mascotMode: readBridgeConfig().mascot || 'whale',
      telemetry: emptyTelemetry(),
    };

    // ── 辅助：真实 DSH Desktop React SPA 启发式定位与冲突避让引擎 ─────────────
    const isReactNode = (el) => {
      if (!el || typeof el !== 'object') return false;
      return Object.keys(el).some(
        (k) =>
          k.startsWith('__reactFiber$') ||
          k.startsWith('__reactProps$') ||
          k.startsWith('__reactContainer$') ||
          k.startsWith('__reactEvents$')
      );
    };

    const isVisibleEl = (el) => {
      if (!el || el.isConnected === false || el.hidden) return false;
      if (typeof el.getBoundingClientRect === 'function') {
        const r = el.getBoundingClientRect();
        if (!r || r.width <= 1 || r.height <= 1) return false;
      }
      if (typeof win.getComputedStyle === 'function') {
        const cs = safe(() => win.getComputedStyle(el));
        if (cs && (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity || '1') <= 0.01)) {
          return false;
        }
      }
      return true;
    };

    // 追踪 DSH 中央对话列（优先读取 dsh-better-sidebar 标注的 [data-dsh-center-col]，否则沿 [data-slot="main.conversation"] 上溯）
    const resolveCenterColumnEl = () => {
      const tagged = doc.querySelector('[data-dsh-center-col]');
      if (tagged && isVisibleEl(tagged)) return tagged;
      const slotHost = doc.querySelector('#root [data-slot="main.conversation"], #root [data-slot="conversation"]');
      if (slotHost) {
        let cur = slotHost.parentElement;
        while (cur && cur !== doc.body && cur !== doc.documentElement) {
          const disp = typeof win.getComputedStyle === 'function' ? safe(() => win.getComputedStyle(cur)?.display, '') : '';
          if (disp !== 'contents' && isVisibleEl(cur)) return cur;
          cur = cur.parentElement;
        }
      }
      const fallback = doc.querySelector('.dsh-main, main, [data-testid="conversation-view"]');
      return fallback && isVisibleEl(fallback) ? fallback : null;
    };

    // 读取右下角 dsh-whale-widget (.dshwv-root, z-index: 9999) 的实时包围盒用于主动避让
    const getWhaleAvoidRect = () => {
      const el = doc.querySelector('.dshwv-root');
      if (!el || !isVisibleEl(el) || typeof el.getBoundingClientRect !== 'function') return null;
      const r = el.getBoundingClientRect();
      if (!r || r.width <= 0 || r.height <= 0) return null;
      return { el, left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
    };

    const getSafeViewportBounds = () => {
      const vw = win.innerWidth || 1280;
      const vh = win.innerHeight || 800;
      const centerCol = resolveCenterColumnEl();
      const whale = getWhaleAvoidRect();
      let left = 12;
      let top = 12;
      let right = vw - 12;
      let bottom = vh - 12;
      if (centerCol && typeof centerCol.getBoundingClientRect === 'function') {
        const cr = centerCol.getBoundingClientRect();
        if (cr.width >= 260 && cr.height >= 120) {
          left = Math.max(8, cr.left + 8);
          top = Math.max(8, cr.top + 8);
          right = Math.min(vw - 8, cr.right - 8);
          bottom = Math.min(vh - 8, cr.bottom - 8);
        }
      }
      return { left, top, right, bottom, whale };
    };

    const rectsOverlap = (a, b, pad = 10) =>
      Boolean(a && b && a.left < b.right + pad && a.right > b.left - pad && a.top < b.bottom + pad && a.bottom > b.top - pad);

    const cardSelector = '[data-composer-seat][data-conversation-region="composer"] [data-composer-card]';
    const permissionSelector = '[data-slot="conversation.input.permission"]';
    const sessionSelector = '[data-conversation-content]';
    const findComposerCard = () => {
      const activeCard = doc.activeElement?.closest?.(cardSelector);
      if (isVisibleEl(activeCard)) return activeCard;
      return Array.from(doc.querySelectorAll(cardSelector)).find(isVisibleEl) || null;
    };
    const visiblePermissionSlot = (card) => {
      const slot = card?.querySelector(permissionSelector);
      // SlotOutlet uses display:contents and may exist without a contribution.
      const trigger = slot?.querySelector('button');
      return trigger && !trigger.closest('[hidden], [inert], [aria-hidden="true"]') && isVisibleEl(trigger) ? slot : null;
    };

    // React 受控输入框安全赋值工具（供 /compact 等快捷填入使用）
    const setComposerValueSafe = (ed, text) => {
      if (!ed) return false;
      ed.focus?.();
      const tag = String(ed.tagName || '').toUpperCase();
      if (tag === 'TEXTAREA' || tag === 'INPUT') {
        const proto = tag === 'TEXTAREA' ? win.HTMLTextAreaElement?.prototype : win.HTMLInputElement?.prototype;
        const nativeSetter = proto ? safe(() => Object.getOwnPropertyDescriptor(proto, 'value')?.set) : null;
        if (typeof nativeSetter === 'function') nativeSetter.call(ed, text);
        else ed.value = text;
        safe(() => ed.dispatchEvent?.(new Event('input', { bubbles: true })));
        safe(() => ed.dispatchEvent?.(new Event('change', { bubbles: true })));
        return true;
      }
      ed.textContent = text;
      safe(() => ed.dispatchEvent?.(new Event('input', { bubbles: true })));
      return true;
    };

    // Standalone preview supplies its own anchors. The app uses the real InputBar.
    const findExplicitSlot = (selector) => {
      const el = doc.querySelector(selector);
      if (!el || isReactNode(el)) return null;
      return el;
    };
    const explicitVialSlot = findExplicitSlot('#ag-pulse-status-bar, [data-dsh-vial-mount="true"], [data-testid="vial-mount"], [data-dsh-vial-slot], .dsh-vial-slot');
    const explicitMascotSlot = findExplicitSlot('#dsh-mascot-mount, [data-dsh-mascot-mount="true"], [data-dsh-mascot-slot], .dsh-mascot-slot');

    let mascotInst = null;
    let isComposing = false;
    on(doc, 'compositionstart', () => { isComposing = true; }, true);
    on(doc, 'compositionend', () => {
      isComposing = false;
      scheduleComposerSync();
    }, true);

    // ── 1. 构建 呼吸上下文试管触发器 + 遥测浮层 ─────────────────────────
    const vialDock = doc.createElement('div');
    vialDock.className = 'dsh-prism-vial-dock';
    vialDock.setAttribute('data-dsh-prism-owned', '1');

    const vialTrigger = doc.createElement('button');
    vialTrigger.type = 'button';
    vialTrigger.className = 'dsh-prism-vial-trigger';
    vialTrigger.setAttribute('data-testid', 'dsh-vial-trigger');
    vialTrigger.setAttribute('aria-expanded', 'false');
    vialTrigger.innerHTML =
      '<span class="dsh-prism-mini-capsule" aria-hidden="true"><span class="dsh-prism-mini-liquid"></span></span>' +
      '<span class="dsh-prism-vial-pct">—</span>' +
      '<span class="dsh-prism-vial-meta">— / —</span>';

    const gearBtn = doc.createElement('button');
    gearBtn.type = 'button';
    gearBtn.className = 'dsh-prism-gear-btn';
    gearBtn.setAttribute('data-testid', 'dsh-settings-trigger');
    gearBtn.setAttribute('title', 'Obsidian Prism 外观设置中心 (Ctrl+Shift+P)');
    gearBtn.setAttribute('aria-label', 'Open Obsidian Prism Settings');
    gearBtn.innerHTML =
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.85 1 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>' +
      '</svg>';

    vialDock.appendChild(vialTrigger);
    vialDock.appendChild(gearBtn);
    vialDock.setAttribute('data-prism-composer-tools', '');

    // 遥测浮层 DOM
    const popover = doc.createElement('div');
    popover.className = 'dsh-prism-vial-popover';
    popover.setAttribute('data-testid', 'dsh-vial-popover');
    popover.setAttribute('data-dsh-prism-owned', '1');
    popover.setAttribute('data-mode', state.vialMode);
    popover.hidden = true;
    popover.innerHTML = `
      <aside class="dsh-vial-well console-well">
        <div class="dsh-vial-well-hd"><span data-k="ctx-cap">—</span><strong data-k="pct">—</strong></div>
        <canvas class="dsh-vial-canvas" data-vial-canvas="true" width="96" height="220"></canvas>
        <div class="dsh-vial-well-ft" data-k="tps">—</div>
      </aside>
      <div class="dsh-vial-panel">
        <div class="dsh-vial-head" data-k="drag-head" title="按住横向拖拽可晃动试管液体">
          <span class="dsh-vial-title"><span data-k="model">—</span></span>
          <span class="dsh-vial-head-btns">
            <button type="button" class="dsh-vial-pill-btn" data-k="compact">/compact</button>
            <button type="button" class="dsh-vial-pill-btn" data-k="mode-toggle">极简长条</button>
          </span>
        </div>
        <div class="dsh-vial-stackbar">
          <span class="dsh-vial-seg" data-slice="0" style="background:#1B49B2"></span>
          <span class="dsh-vial-seg" data-slice="1" style="background:#3186FF"></span>
          <span class="dsh-vial-seg" data-slice="2" style="background:#5CC6FC"></span>
          <i class="dsh-vial-threshold" aria-hidden="true"></i>
        </div>
        <div class="dsh-vial-slices">
          <div class="dsh-vial-slice-row" data-slice="0"><span class="dsh-vial-slice-lbl"><i class="dsh-vial-dot" style="background:#1B49B2"></i><span data-k="lbl-sys">系统与规则</span></span><span class="dsh-vial-slice-val" data-k="val-sys">—</span></div>
          <div class="dsh-vial-slice-row" data-slice="1"><span class="dsh-vial-slice-lbl"><i class="dsh-vial-dot" style="background:#3186FF"></i><span data-k="lbl-conv">对话消息</span></span><span class="dsh-vial-slice-val" data-k="val-conv">—</span></div>
          <div class="dsh-vial-slice-row" data-slice="2"><span class="dsh-vial-slice-lbl"><i class="dsh-vial-dot" style="background:#5CC6FC"></i><span data-k="lbl-tool">代码与工具</span></span><span class="dsh-vial-slice-val" data-k="val-tool">—</span></div>
          <div class="dsh-vial-slice-row" data-slice="-1"><span class="dsh-vial-slice-lbl"><i class="dsh-vial-dot" style="background:rgba(148,163,184,.48)"></i><span data-k="lbl-rem">剩余容量</span></span><span class="dsh-vial-slice-val" data-k="val-rem">—</span></div>
        </div>
        <div class="dsh-vial-quotas" data-billing-mode="api">
          <div class="dsh-vial-qhead"><strong data-k="qpool-title">API 按量计费</strong></div>
          <div class="dsh-vial-forecast">
            <span data-k="qdetail">费用以 API 服务商账单为准</span><span data-k="book"></span>
          </div>
        </div>
      </div>
    `;
    doc.body.appendChild(popover);
    cleanups.push(() => {
      vialDock.remove();
      popover.remove();
    });

    const vialCanvas = popover.querySelector('canvas[data-vial-canvas="true"]');
    let vialInst = null;
    let vialRaf = 0;
    let lastVialMs = 0;

    const getSliceRatios = () => {
      const { maxTokens, slices } = state.telemetry;
      return [slices.system, slices.conversation, slices.tools].map((v) =>
        maxTokens && v !== null ? clamp(v / maxTokens, 0, 1) : 0
      );
    };

    const stepVialLoop = (now) => {
      vialRaf = 0;
      if (destroyed || !state.vialOpen || !vialInst || doc.hidden) return;
      const dt = lastVialMs > 0 ? clamp((now - lastVialMs) / 1000, 0.004, 0.05) : 0.016;
      lastVialMs = now;
      vialInst.step(dt);
      if (!vialInst.isSettled()) vialRaf = win.requestAnimationFrame?.(stepVialLoop) || 0;
    };

    const wakeVialLoop = () => {
      if (!vialInst || !state.vialOpen || destroyed || doc.hidden) return;
      if (!vialRaf) {
        lastVialMs = nowPerf();
        vialRaf = win.requestAnimationFrame?.(stepVialLoop) || 0;
      }
    };

    vialInst = mountPhysicalWaterVial(vialCanvas, {
      fill: state.telemetry.usedFraction,
      streaming: state.telemetry.streaming,
      reduceMotion: isMotionReduced(doc),
      onWake: wakeVialLoop,
      getState: () => {
        const meta = readRootThemeMeta(doc);
        const f = state.telemetry.usedFraction;
        const ratios = getSliceRatios();
        return {
          isDark: meta.isDark,
          accentTone: meta.accentTone,
          critical: f >= 0.85,
          fill: f,
          maxTokens: state.telemetry.maxTokens,
          hoveredSlice: ratios[state.hoveredSlice] > 0 ? state.hoveredSlice : -1,
          streaming: Boolean(state.telemetry.streaming),
          ratios,
        };
      },
    });
    cleanups.push(() => {
      if (vialRaf) win.cancelAnimationFrame?.(vialRaf);
      vialInst?.dispose?.();
    });

    const positionPopover = () => {
      if (!state.vialOpen) return;
      const tr = vialTrigger.getBoundingClientRect();
      const pw = popover.offsetWidth || (state.vialMode === 'bar' ? 336 : 428);
      const ph = popover.offsetHeight || 274;
      const bounds = getSafeViewportBounds();
      const minLeft = Math.max(10, bounds.left);
      const maxLeft = Math.max(minLeft, bounds.right - pw);
      let left = clamp(tr.right - pw, minLeft, maxLeft);
      let top = tr.top - ph - 10 > bounds.top ? tr.top - ph - 10 : clamp(tr.bottom + 10, bounds.top, Math.max(bounds.top, bounds.bottom - ph));

      // 主动避让右下角 dsh-whale-widget (.dshwv-root, z-index: 9999)
      if (bounds.whale) {
        const cand = { left, top, right: left + pw, bottom: top + ph };
        if (rectsOverlap(cand, bounds.whale, 12)) {
          const shiftedLeft = bounds.whale.left - pw - 12;
          if (shiftedLeft >= minLeft) {
            left = shiftedLeft;
          } else {
            const shiftedTop = bounds.whale.top - ph - 12;
            if (shiftedTop >= bounds.top) top = shiftedTop;
          }
        }
      }
      popover.style.left = `${Math.round(left)}px`;
      popover.style.top = `${Math.round(top)}px`;
    };

    const renderTelemetryUi = () => {
      const t = state.telemetry;
      const meta = readRootThemeMeta(doc);
      const lang = meta.lang;
      const { maxTokens, usedTokens, usedFraction, slices } = t;
      const percent = usedFraction === null ? '—' : Math.round(usedFraction * 100) + '%';
      const cap = formatContextTokens(maxTokens);
      const vialName = (resolveLang(lang) === 'en' ? 'Context usage' : '上下文用量') + ' · ' + percent;
      vialTrigger.setAttribute('aria-label', vialName);
      vialTrigger.title = vialName;
      const writeText = (node, value) => {
        if (node && node.textContent !== value) node.textContent = value;
      };
      const setK = (key, value) => writeText(popover.querySelector('[data-k="' + key + '"]'), value);

      vialTrigger.setAttribute('data-critical', usedFraction >= 0.85 ? '1' : '0');
      vialTrigger.setAttribute('data-streaming', t.streaming ? '1' : '0');
      const miniLiq = vialTrigger.querySelector('.dsh-prism-mini-liquid');
      if (miniLiq) miniLiq.style.height = usedFraction === null ? '0%' : percent;
      writeText(vialTrigger.querySelector('.dsh-prism-vial-pct'), percent);
      writeText(vialTrigger.querySelector('.dsh-prism-vial-meta'), formatContextTokens(usedTokens) + ' / ' + cap);
      popover.setAttribute('data-mode', state.vialMode);
      setK('ctx-cap', cap);
      setK('pct', percent);
      setK('tps', t.tps === null ? '—' : t.tps.toFixed(1) + ' tok/s');
      setK('model', t.model || '—');
      setK('mode-toggle', state.vialMode === 'vial' ? '极简长条' : '实体试管');
      setK('val-sys', formatContextTokens(slices.system));
      setK('val-conv', formatContextTokens(slices.conversation));
      setK('val-tool', formatContextTokens(slices.tools));
      setK('val-rem', formatContextTokens(maxTokens !== null && usedTokens !== null ? Math.max(0, maxTokens - usedTokens) : null));
      setK('book', usedTokens === null ? '' : matchBookYardstick(usedTokens, lang));

      const ratios = getSliceRatios();
      popover.querySelectorAll('.dsh-vial-seg').forEach((seg, i) => {
        seg.style.width = (ratios[i] * 100).toFixed(2) + '%';
        seg.setAttribute('data-hover', ratios[i] > 0 && state.hoveredSlice === i ? '1' : '0');
      });
      popover.querySelectorAll('.dsh-vial-slice-row').forEach((row) => {
        const i = Number(row.getAttribute('data-slice'));
        row.setAttribute('data-hover', ratios[i] > 0 && i === state.hoveredSlice ? '1' : '0');
      });

      if (vialInst && state.vialOpen) {
        vialInst.setReduceMotion(isMotionReduced(doc));
        vialInst.wake();
        wakeVialLoop();
      }
    };

    const setVialOpen = (open) => {
      state.vialOpen = Boolean(open && isVisibleEl(vialTrigger));
      popover.hidden = !state.vialOpen;
      vialTrigger.setAttribute('aria-expanded', String(state.vialOpen));
      if (state.vialOpen) {
        renderTelemetryUi();
        positionPopover();
        vialInst?.agitate(0.85);
        wakeVialLoop();
        mascotInst?.notify('vial-opened');
      } else if (vialRaf) {
        win.cancelAnimationFrame?.(vialRaf);
        vialRaf = 0;
      }
    };

    on(vialTrigger, 'click', (ev) => {
      ev.stopPropagation();
      setVialOpen(!state.vialOpen);
    });

    on(gearBtn, 'click', (ev) => {
      ev.stopPropagation();
      if (typeof win.DSHPrismWorkbench?.toggleSettings === 'function') {
        win.DSHPrismWorkbench.toggleSettings();
      } else {
        win.dispatchEvent?.(new CustomEvent('ag-prism:open-settings'));
      }
    });

    // 浮层内交互：切片悬停聚焦环、实体试管/极简长条切换、/compact 一键填入、标题拖拽晃动液体
    popover.querySelectorAll('[data-slice]').forEach((el) => {
      const idx = Number(el.getAttribute('data-slice'));
      on(el, 'pointerenter', () => {
        if (idx >= 0) {
          state.hoveredSlice = idx;
          renderTelemetryUi();
        }
      });
      on(el, 'pointerleave', () => {
        if (state.hoveredSlice === idx) {
          state.hoveredSlice = -1;
          renderTelemetryUi();
        }
      });
    });

    const modeToggleBtn = popover.querySelector('[data-k="mode-toggle"]');
    on(modeToggleBtn, 'click', () => {
      state.vialMode = state.vialMode === 'vial' ? 'bar' : 'vial';
      writeStorage(STORAGE_VIAL_MODE_KEY, state.vialMode);
      renderTelemetryUi();
      positionPopover();
    });

    const compactBtn = popover.querySelector('[data-k="compact"]');
    on(compactBtn, 'click', () => {
      const ed = (findComposerCard()?.querySelector('[data-composer-input]') ||
        explicitVialSlot?.closest('[data-dsh-composer]')?.querySelector('textarea, [contenteditable="true"]'));
      if (ed) setComposerValueSafe(ed, '/compact');
      safe(() => navigator?.clipboard?.writeText?.('/compact'));
      compactBtn.textContent = '✓ 已填入';
      safeTimeout(() => { compactBtn.textContent = '/compact'; }, 1200);
    });

    const dragHead = popover.querySelector('[data-k="drag-head"]');
    let draggingVialHead = false;
    let lastHeadX = 0;
    on(dragHead, 'pointerdown', (ev) => {
      if (ev.target.closest('button')) return;
      draggingVialHead = true;
      lastHeadX = ev.clientX;
    });
    on(win, 'pointermove', (ev) => {
      if (!draggingVialHead || !state.vialOpen) return;
      const dx = ev.clientX - lastHeadX;
      lastHeadX = ev.clientX;
      if (Math.abs(dx) >= 1) {
        vialInst?.impulse(clamp(dx * 0.16, -3.2, 3.2));
        wakeVialLoop();
      }
    });
    on(win, 'pointerup', () => { draggingVialHead = false; });

    on(doc, 'pointerdown', (ev) => {
      const inPop = typeof popover.contains === 'function' ? popover.contains(ev.target) : ev.target === popover;
      const inDock = typeof vialDock.contains === 'function' ? vialDock.contains(ev.target) : ev.target === vialDock;
      if (state.vialOpen && !inPop && !inDock) {
        setVialOpen(false);
      }
    });
    on(win, 'keydown', (ev) => {
      if (ev.key === 'Escape' && state.vialOpen) setVialOpen(false);
    });
    on(win, 'resize', positionPopover);

    // DSH 44.7 ModelSelect: the trigger owns one body portal via aria-controls.
    // Root rows drill down, the model catalog has role=group, and only the effort
    // pane has radio buttons directly inside a scrollable child of the outer menu.
    const triggerSelector = 'button[aria-haspopup="menu"]';
    const modelSelector = '[data-provider-id][data-model-id]';
    const ownerSelector = '[data-dsh-prism-owned="1"], [data-dsh-prism-portal]';
    const anchorOf = (el) => el?.style?.getPropertyValue?.('--dsh-model-anchor')?.trim() ||
      el?.getAttribute('style')?.match(/(?:^|;)\s*--dsh-model-anchor\s*:\s*([^;]+)/)?.[1].trim();
    const modelTrigger = (el) => el?.matches?.(triggerSelector) && !el.closest(ownerSelector) &&
      anchorOf(el) && el.querySelector(modelSelector);
    const captionEffort = (trigger) => {
      let caption = trigger?.querySelector(modelSelector);
      while (caption && caption.parentElement !== trigger) caption = caption.parentElement;
      const effort = caption?.nextElementSibling;
      return effort?.tagName === 'SPAN' ? effort.textContent.trim() || null : null;
    };
    const controlledSurface = (trigger) => {
      if (trigger?.getAttribute('aria-expanded') !== 'true') return null;
      const id = trigger.getAttribute('aria-controls');
      const menu = id && doc.getElementById(id); // React useId may contain colons.
      if (!menu || menu.parentElement !== doc.body || menu.hidden) return null;
      const menuAnchor = anchorOf(menu);
      return !menuAnchor || menuAnchor === anchorOf(trigger) ? menu : null;
    };
    const markerSelector = '[data-prism-native-efforts]';
    const radioSelector = 'button[role="menuitemradio"][aria-checked]';
    const drillSelector = 'button[role="menuitem"]';
    const isDisabled = (el) => el.disabled || el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true';
    const menuIsBusy = (trigger, menu) => isDisabled(trigger) || trigger.getAttribute('aria-busy') === 'true' || menu.getAttribute('aria-busy') === 'true';
    const modelKey = (trigger) => {
      const label = trigger?.querySelector(modelSelector);
      return label ? JSON.stringify([label.getAttribute('data-provider-id'), label.getAttribute('data-model-id')]) : null;
    };
    function uniqueLabel(options, label) {
      const matches = options.filter((option) => option.label === label);
      return matches.length === 1 ? matches[0] : null;
    }
    function idForLabel(catalog, label) {
      if (!label) return null;
      const entry = catalog && uniqueLabel(catalog, label);
      return entry ? entry.id : label.toLowerCase();
    }

    // The slot exists only on ModelSelect's root pane, after its two drill buttons.
    // Its session directory supplies native IDs, including null for provider default.
    function readRootEfforts(trigger, menu) {
      if (menu?.getAttribute('role') !== 'menu') return null;
      const [modelDrill, drill] = Array.from(menu.children).filter((el) => el.matches(drillSelector));
      if (!drill || modelKey(modelDrill) !== modelKey(trigger) || drill.querySelector(modelSelector)) return null;
      const [title, value] = drill.children;
      if (title?.tagName !== 'SPAN' || value?.tagName !== 'SPAN') return null;
      const markers = Array.from(menu.querySelectorAll(markerSelector)).filter((el) =>
        (el.hidden || el.hasAttribute('hidden')) && el.closest('[role="menu"]') === menu);
      if (markers.length !== 1) return null;
      const marker = markers[0];
      const labelNode = trigger.querySelector(modelSelector);
      for (const [markerAttr, modelAttr] of [['data-prism-native-model', 'data-model-id'], ['data-prism-native-provider', 'data-provider-id']]) {
        if (marker.hasAttribute(markerAttr) && marker.getAttribute(markerAttr) !== labelNode.getAttribute(modelAttr)) return null;
      }
      const raw = marker.getAttribute('data-prism-native-efforts');
      const entries = safe(() => JSON.parse(raw));
      if (!Array.isArray(entries) || !entries.length) return null;
      const ids = new Set(), catalog = [];
      for (const entry of entries) {
        if (!entry || (entry.id !== null && (typeof entry.id !== 'string' || !entry.id.trim())) ||
            typeof entry.label !== 'string' || !entry.label.trim() || ids.has(entry.id)) return null;
        ids.add(entry.id);
        catalog.push({ id: entry.id, label: entry.label.trim() });
      }
      const current = marker.getAttribute('data-prism-native-current');
      let selected;
      if (current !== null) {
        selected = catalog.find((item) => item.id === (current === '' ? null : current));
      } else {
        const caption = captionEffort(trigger), drillValue = value.textContent.trim();
        if (!caption || !drillValue || caption === drillValue) selected = uniqueLabel(catalog, drillValue || caption);
      }
      const disabled = !selected || isDisabled(drill) || menuIsBusy(trigger, menu);
      const rows = catalog.map((entry) => ({ ...entry, el: drill, checked: entry === selected,
        disabled: Boolean(disabled || !uniqueLabel(catalog, entry.label)) }));
      return { marker, raw, current, selected, drill, catalog, rows };
    }
    function readRadioRows(trigger, menu, catalog) {
      if (menu?.getAttribute('role') !== 'menu') return [];
      const group = Array.from(menu.children).find((el) => el.classList.contains('scrollable') && !el.hasAttribute('role'));
      if (!group) return [];
      const busy = menuIsBusy(trigger, menu);
      return Array.from(group.children).filter((el) => el.matches(radioSelector)).map((el) => {
        const label = (el.firstElementChild || el).textContent.trim();
        return { el, label, id: idForLabel(catalog, label), checked: el.getAttribute('aria-checked') === 'true',
          disabled: Boolean(busy || isDisabled(el)) };
      }).filter((row) => row.label);
    }

    function nativeSessionFor(trigger) {
      const card = trigger?.closest?.('[data-composer-card]');
      const source = card?.querySelector?.('[data-prism-context-session]');
      return source ? source.getAttribute('data-prism-context-session') : null;
    }
    function captureRootEffortService(root) {
      const fn = root?.marker?.prismSelectEffort;
      const label = trackedTrigger?.querySelector(modelSelector);
      if (typeof fn !== 'function' || !trackedTrigger || !trackedSurface || !label) return;
      capturedRootSelect = {
        fn,
        marker: root.marker,
        trigger: trackedTrigger,
        menu: trackedSurface,
        menuId: trackedSurface.id,
        session: nativeSessionFor(trackedTrigger),
        provider: label.getAttribute('data-provider-id'),
        model: label.getAttribute('data-model-id'),
      };
    }
    function clearRootEffortService() {
      capturedRootSelect = null;
    }
    function submitCapturedEffort(row) {
      const capture = capturedRootSelect;
      const trigger = trackedTrigger, menu = trackedSurface;
      if (!capture || typeof capture.fn !== 'function' || !row || !trigger || !menu) return false;
      const session = nativeSessionFor(trigger);
      if (capture.trigger !== trigger || capture.menu !== menu || capture.menuId !== menu.id ||
          !trigger.isConnected || !menu.isConnected || trigger.getAttribute('aria-expanded') !== 'true' ||
          trigger.getAttribute('aria-controls') !== menu.id || menu.getAttribute('role') !== 'menu' ||
          modelKey(trigger) !== JSON.stringify([capture.provider, capture.model]) ||
          (capture.session !== null && session !== capture.session)) return false;
      // The overlay/session marker can commit after the menu root. Adopt it once;
      // the native submit closure independently validates the session it captured.
      if (capture.session === null) capture.session = session;
      const accepted = safe(() => capture.fn(row.id) === true, false);
      if (accepted) queueEffortSync();
      return accepted;
    }

    const effortWrap = doc.createElement('div');
    effortWrap.className = 'dsh-effort-widget';
    effortWrap.setAttribute('data-testid', 'dsh-effort-slider');
    effortWrap.setAttribute('data-dsh-prism-owned', '1');
    effortWrap.setAttribute('data-integrated', '1');
    effortWrap.innerHTML = `
      <div class="dsh-effort-head">
        <span class="dsh-effort-title">推理等级</span><span class="dsh-effort-badge" data-k="effort-label">—</span>
      </div>
      <div class="dsh-effort-track-wrap" role="slider" tabindex="0" aria-label="推理等级" aria-valuemin="0">
        <canvas class="dsh-effort-canvas" width="280" height="28" aria-hidden="true"></canvas>
        <span class="dsh-effort-knob" aria-hidden="true"></span>
      </div>
      <div class="dsh-effort-labels"></div>`;
    const effortTrack = effortWrap.querySelector('[role="slider"]');
    const effortLabels = effortWrap.querySelector('.dsh-effort-labels');
    const effortCanvas = effortWrap.querySelector('.dsh-effort-canvas');
    const effortBadge = effortWrap.querySelector('[data-k="effort-label"]');
    const effortKnob = effortWrap.querySelector('.dsh-effort-knob');
    const menuBackButton = doc.createElement('button');
    menuBackButton.type = 'button';
    menuBackButton.className = 'dsh-prism-menu-back';
    menuBackButton.setAttribute('data-dsh-prism-owned', '1');
    menuBackButton.setAttribute('data-prism-menu-back', '1');
    menuBackButton.setAttribute('aria-label', '返回上一级');
    menuBackButton.innerHTML =
      '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="m14.5 6-6 6 6 6"/><path d="M8.5 12H20"/></svg><span>返回</span>';
    let effortEnabled = false;
    let trackedTrigger = null;
    let trackedSurface = null;
    let trackedModel = null;
    let rootCatalog = null;
    let rootSource = null;
    let effortPane = null;
    let pendingPick = null;
    let issuingDrill = false;
    let effortRows = [];
    let effortLabel = null;
    let checkedIndex = -1;
    let capturedRootSelect = null;
    let drag = null;
    // The public directory action resolves after React publishes the new route.
    // Hold the released drag position across that short gap so the knob does not
    // visibly travel back to the old tier and forward again.
    let pendingEffortHold = null;
    let effortRaf = null;
    let lastEffortMs = 0;
    let effortTime = 0;
    let knobMotion = null;
    let knobPosition = null;
    let crystalWake = 0;
    let crystalProx = 0;
    let crystalPtrLocal = { x: -9999, y: -9999 };
    const shownIndex = () => {
      if (drag) return drag.index;
      if (pendingEffortHold) {
        const held = effortRows.findIndex((row) => row.id === pendingEffortHold.id);
        if (held >= 0) return held;
      }
      return checkedIndex;
    };
    const shownPosition = () => {
      if (Number.isFinite(knobPosition)) return clamp(knobPosition, 0, 1);
      const index = shownIndex();
      return Math.max(0, index) / Math.max(1, effortRows.length - 1);
    };
    const knobLeftFor = (position) => {
      const trackRect = safe(() => effortTrack.getBoundingClientRect(), null);
      const knobRect = safe(() => effortKnob.getBoundingClientRect(), null);
      const trackWidth = Math.max(1, effortTrack.clientWidth || trackRect?.width || 236);
      const knobWidth = Math.max(0, Math.min(trackWidth,
        effortKnob.offsetWidth || knobRect?.width || 24));
      return clamp(position, 0, 1) * Math.max(0, trackWidth - knobWidth);
    };
    const setKnobPosition = (position) => {
      knobPosition = clamp(position, 0, 1);
      effortKnob.style.left = `${knobLeftFor(knobPosition)}px`;
    };
    function stopKnobMotion() {
      if (knobMotion?.raf !== null && knobMotion?.raf !== undefined) {
        safe(() => win.cancelAnimationFrame?.(knobMotion.raf));
      }
      if (knobMotion?.timer !== null && knobMotion?.timer !== undefined) clearTimeout(knobMotion.timer);
      if (knobMotion) effortKnob.style.willChange = '';
      knobMotion = null;
    }
    function moveKnob(position, { animate = true, fromPosition = null } = {}) {
      const target = clamp(position, 0, 1);
      if (!drag && knobMotion && knobMotion.target === target && fromPosition === null) return;
      stopKnobMotion();
      const reduced = isMotionReduced(doc);
      const start = fromPosition === null ? (knobPosition ?? target) : clamp(fromPosition, 0, 1);
      const direct = drag || !animate || reduced || Math.abs(target - start) < 0.0005;
      if (direct) {
        effortKnob.style.transition = 'none';
        setKnobPosition(target);
        if (!drag) effortKnob.style.transition = '';
        return;
      }
      // Drive this transition from the current rendered fraction instead of relying
      // only on CSS `left`. React may move the portal while an async native selection
      // settles; a frame-driven value keeps the knob moving through intermediate tiers.
      effortKnob.style.transition = 'none';
      effortKnob.style.willChange = 'left';
      setKnobPosition(start);
      safe(() => effortKnob.getBoundingClientRect());
      const started = nowPerf();
      const duration = 240;
      const motion = { target, raf: null, timer: null };
      knobMotion = motion;
      const frame = (now) => {
        if (knobMotion !== motion) return;
        const progress = clamp((now - started) / duration, 0, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        setKnobPosition(start + (target - start) * eased);
        if (progress < 1) {
          if (typeof win.requestAnimationFrame === 'function') motion.raf = win.requestAnimationFrame(frame);
          else motion.timer = setTimeout(() => frame(nowPerf()), 16);
          return;
        }
        knobMotion = null;
        setKnobPosition(target);
        effortKnob.style.willChange = '';
        effortKnob.style.transition = '';
      };
      if (typeof win.requestAnimationFrame === 'function') motion.raf = win.requestAnimationFrame(frame);
      else frame(started + duration);
    }
    // DSH Max/High share the active starfield. Only the explicit Orchestrator
    // effort keeps the upstream cut-crystal priority-bar treatment.
    const crystalStyle = (id) => id === 'orchestrator';
    const canPaintEffort = () => !destroyed && !doc.hidden && effortRows.length > 0 &&
      trackedSurface?.parentElement === doc.body && effortWrap.parentElement === trackedSurface;

    function stopEffortPaint() {
      if (effortRaf !== null) win.cancelAnimationFrame?.(effortRaf);
      effortRaf = null;
      lastEffortMs = 0;
    }
    function scheduleEffortPaint() {
      if (!canPaintEffort() || effortRaf !== null) return;
      if (!win.requestAnimationFrame) { paintEffort(nowPerf()); return; }
      effortRaf = win.requestAnimationFrame((now) => {
        effortRaf = null;
        if (canPaintEffort() && paintEffort(now)) scheduleEffortPaint();
      });
    }
    function paintEffort(now) {
      const ctx = effortCanvas.getContext('2d');
      if (!ctx) return false;
      const dt = lastEffortMs ? clamp((now - lastEffortMs) / 1000, 0, 0.05) : 0.016;
      lastEffortMs = now;
      const reduced = isMotionReduced(doc);
      if (!reduced) effortTime += dt;
      crystalWake = Math.max(0, crystalWake - dt / 0.72);
      const cssW = Math.max(1, effortTrack.clientWidth || 260);
      const cssH = effortTrack.clientHeight || 28;
      const dpr = Math.min(win.devicePixelRatio || 1, 2);
      const tw = Math.round(cssW * dpr), th = Math.round(cssH * dpr);
      if (effortCanvas.width !== tw || effortCanvas.height !== th) { effortCanvas.width = tw; effortCanvas.height = th; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);
      const meta = readRootThemeMeta(doc);
      const index = shownIndex();
      const position = shownPosition();
      if (index < 0) return false;
      if (crystalStyle(effortRows[index]?.id)) {
        const target = computeCrystalProximity(crystalPtrLocal.x, crystalPtrLocal.y, cssW, cssH, 105);
        crystalProx += (target - crystalProx) * Math.min(1, dt * (target > crystalProx ? 18 : 5));
        drawCutCrystalBar(ctx, cssW, cssH, {
          isDark: meta.isDark, accentTone: meta.rawAccent === 'follow' ? 'default' : meta.accentTone,
          ambient: meta.ambient, proximity: crystalProx, pointerLocal: crystalPtrLocal, time: effortTime,
          wakeU: 1 - crystalWake, wakeAmp: Math.sin(crystalWake * Math.PI), reduceMotion: reduced,
        });
        return !reduced && (crystalWake > 0.01 || crystalProx > 0.01 || meta.ambient > 0);
      }
      const knobRect = safe(() => effortKnob.getBoundingClientRect(), null);
      const knobWidth = Math.max(0, Math.min(cssW,
        effortKnob.offsetWidth || knobRect?.width || 24));
      const knobCenter = knobWidth / 2 + Math.max(0, cssW - knobWidth) * position;
      const fillWidth = knobCenter + knobWidth / 2 * Math.pow(position, 8);
      attr(effortWrap, 'data-fill-ratio', (fillWidth / cssW).toFixed(4));
      const levelCount = Math.max(2, effortRows.length);
      const tickRatios = Array.from({ length: levelCount }, (_, i) =>
        (knobWidth / 2 + Math.max(0, cssW - knobWidth) * i / (levelCount - 1)) / cssW);
      attr(effortWrap, 'data-tick-ratios', tickRatios.map(value => value.toFixed(4)).join(','));
      drawStarryEffortTrack(ctx, cssW, cssH, {
        isDark: meta.isDark, accentTone: meta.rawAccent === 'follow' ? 'cobalt' : meta.accentTone,
        tierIdx: Math.round(position * Math.max(0, effortRows.length - 1)),
        fillRatio: fillWidth / cssW, knobWidth, levelCount: effortRows.length,
        time: effortTime, reduceMotion: reduced,
      });
      return !reduced && Boolean(drag || pendingEffortHold || knobMotion || position > 0.001);
    }

    const ownedNode = (node) => (node?.nodeType === 1 ? node : node?.parentElement)?.closest?.(ownerSelector);
    const ownedMutation = (record) => {
      if (ownedNode(record.target)) return true;
      if (record.type !== 'childList') return false;
      const changed = [...record.addedNodes, ...record.removedNodes];
      return changed.length > 0 && changed.every(ownedNode);
    };
    const Observer = win.MutationObserver || (typeof MutationObserver === 'function' ? MutationObserver : null);
    let syncQueued = false;
    function queueEffortSync() {
      if (destroyed || !effortEnabled || syncQueued) return;
      syncQueued = true;
      Promise.resolve().then(() => {
        syncQueued = false;
        if (!destroyed && effortEnabled) mountEffortIntoNativeMenus();
      });
    }
    // A portal or trigger can be removed and reinserted before observer delivery.
    // Comparing the final DOM alone would let a gesture escape its original opening.
    function invalidatePickOwner(records) {
      const pick = pendingPick;
      if (!pick) return;
      const changed = records.some((m) => {
        if (m.type === 'childList') return Array.from(m.removedNodes).some((el) =>
          el.contains?.(pick.menu) || el.contains?.(pick.trigger) || el.contains?.(pick.modelLabel));
        if (m.target === pick.trigger || m.target === pick.modelLabel) {
          return m.oldValue !== m.target.getAttribute(m.attributeName);
        }
        return false;
      });
      if (changed) cancelPendingPick();
    }
    // Ignore chat updates unless they add/remove a model trigger or its portal.
    const discoveryObserver = Observer && new Observer((records) => {
      invalidatePickOwner(records);
      if (records.some((m) => {
        if (ownedMutation(m)) return false;
        if (m.target === trackedTrigger || modelTrigger(m.target.closest?.(triggerSelector))) return true;
        if (m.type !== 'childList') return false;
        const controls = trackedTrigger?.getAttribute('aria-controls');
        return [...m.addedNodes, ...m.removedNodes].some((el) => el.nodeType === 1 && (
          el === trackedTrigger || el === trackedSurface || (controls && el.id === controls) ||
          modelTrigger(el) || (el.children.length && Array.from(el.querySelectorAll(triggerSelector)).some(modelTrigger))
        ));
      })) queueEffortSync();
    });
    const nativeObserver = Observer && new Observer((records) => {
      // React may discard our subtree while retaining the very same menu element.
      if ((effortRows.length && effortWrap.parentElement !== trackedSurface) || records.some((m) => !ownedMutation(m))) queueEffortSync();
    });
    function observeNative(trigger, menu) {
      if (!nativeObserver) return;
      nativeObserver.disconnect();
      const options = { subtree: true, childList: true, characterData: true, attributes: true,
        attributeFilter: ['role', 'aria-checked', 'aria-busy', 'aria-disabled', 'disabled', 'class', 'hidden', 'style',
          'data-prism-native-efforts', 'data-prism-native-current', 'data-prism-native-model', 'data-prism-native-provider'] };
      if (trigger) nativeObserver.observe(trigger, options);
      if (menu) nativeObserver.observe(menu, options);
    }
    function clearDrag() {
      if (!drag) return;
      const { pointerId } = drag;
      drag = null;
      safe(() => { if (effortTrack.hasPointerCapture?.(pointerId)) effortTrack.releasePointerCapture(pointerId); });
    }
    function clearEffortHold(repaint = false) {
      if (pendingEffortHold) clearTimeout(pendingEffortHold.timer);
      pendingEffortHold = null;
      if (repaint && effortRows.length) updateEffortView();
    }
    function holdEffortTarget(row, fromId = effortRows[checkedIndex]?.id, fromPosition = knobPosition) {
      if (!row || row.disabled || row.id === fromId) return null;
      if (pendingEffortHold?.id === row.id && pendingEffortHold?.fromId === fromId) {
        return pendingEffortHold;
      }
      if (pendingEffortHold) clearTimeout(pendingEffortHold.timer);
      const hold = pendingEffortHold = { id: row.id, fromId, timer: 0 };
      hold.timer = setTimeout(() => {
        if (pendingEffortHold === hold) clearEffortHold(true);
      }, 1600);
      updateEffortView({ animate: true, fromPosition });
      return hold;
    }
    const attr = (el, key, value) => {
      if (value === null) { if (el.hasAttribute(key)) el.removeAttribute(key); }
      else if (el.getAttribute(key) !== String(value)) el.setAttribute(key, String(value));
    };
    function requestNativeMenuBack() {
      const surface = trackedSurface;
      if (!surface?.isConnected) return false;
      const KeyboardEventCtor = win.KeyboardEvent || win.Event;
      if (typeof KeyboardEventCtor !== 'function') return false;
      const event = new KeyboardEventCtor('keydown', {
        key: 'Escape', code: 'Escape', bubbles: true, cancelable: true,
      });
      try {
        Object.defineProperty(event, 'key', { configurable: true, value: 'Escape' });
        Object.defineProperty(event, 'code', { configurable: true, value: 'Escape' });
      } catch {}
      surface.dispatchEvent(event);
      queueEffortSync();
      return true;
    }
    function syncMenuBack(menu, paneKind) {
      if (!menu || !paneKind || destroyed) {
        menuBackButton.remove();
        return false;
      }
      attr(menuBackButton, 'data-pane', paneKind);
      if (menuBackButton.parentElement !== menu) menu.insertBefore(menuBackButton, menu.firstChild);
      return true;
    }
    for (const event of ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'click']) {
      on(menuBackButton, event, (ev) => {
        ev.preventDefault?.();
        ev.stopPropagation?.();
        if (event === 'click') requestNativeMenuBack();
      });
    }
    function updateEffortView(options = {}) {
      const index = shownIndex();
      const shown = effortRows[index];
      const previewing = Boolean(drag || pendingEffortHold);
      const crystal = crystalStyle(shown?.id);
      if (crystal && effortWrap.getAttribute('data-track-style') !== 'crystal') crystalWake = 1;
      attr(effortWrap, 'data-track-style', crystal ? 'crystal' : 'starry');
      attr(effortWrap, 'data-orchestrator', crystal ? '1' : '0'); // Existing crystal skin.
      attr(effortWrap, 'data-pane', effortPane);
      attr(effortWrap, 'data-effort', previewing ? shown?.id ?? state.effort : state.effort);
      attr(effortWrap, 'data-preview-effort', previewing ? shown?.id ?? null : null);
      attr(effortWrap, 'data-gesture', drag ? '1' : '0');
      const label = shown?.label || '—';
      if (effortBadge.textContent !== label) effortBadge.textContent = label;
      attr(effortTrack, 'aria-valuemax', effortRows.length - 1);
      attr(effortTrack, 'aria-valuenow', index < 0 ? null : index);
      attr(effortTrack, 'aria-valuetext', label);
      const disabled = effortRows.every((row) => row.disabled);
      attr(effortTrack, 'aria-disabled', disabled);
      attr(effortTrack, 'tabindex', disabled ? -1 : 0);
      effortKnob.style.visibility = shown ? '' : 'hidden';
      if (!shown) {
        stopKnobMotion();
        knobPosition = null;
        attr(effortWrap, 'data-knob-position', null);
      } else {
        const position = previewing && drag?.position !== undefined
          ? drag.position
          : Math.max(0, index) / Math.max(1, effortRows.length - 1);
        attr(effortWrap, 'data-knob-position', position.toFixed(4));
        moveKnob(position, {
          animate: options.animate !== false && !drag,
          fromPosition: options.fromPosition ?? null,
        });
      }
      while (effortLabels.children.length > effortRows.length) effortLabels.children[effortLabels.children.length - 1].remove();
      effortRows.forEach((row, i) => {
        let button = effortLabels.children[i];
        if (!button) {
          button = doc.createElement('button');
          button.type = 'button';
          button.className = 'dsh-effort-step-btn';
          button.setAttribute('tabindex', '-1'); // Native radios retain host keyboard navigation.
          button.setAttribute('data-effort-idx', String(i));
          effortLabels.appendChild(button);
        }
        if (button.textContent !== row.label) button.textContent = row.label;
        attr(button, 'data-effort-id', row.id ?? '');
        attr(button, 'aria-pressed', row.checked);
        if (button.disabled !== row.disabled) button.disabled = row.disabled;
      });
      scheduleEffortPaint();
    }
    function reflectEffort(label, id) {
      if (label === effortLabel && id === state.effort) return;
      const previous = effortLabel;
      effortLabel = label;
      state.effort = id;
      mascotInst?.setState({ orchestrator: crystalStyle(state.effort) });
      if (previous && label) mascotInst?.notify('model-shift');
      if (effortEnabled) {
        win.dispatchEvent?.(new CustomEvent('ag-prism:effort-change', { detail: {
          effort: state.effort, label, isOrchestrator: state.effort === 'orchestrator', source: 'native',
        } }));
      }
    }
    function cancelPendingPick() {
      if (!pendingPick) return;
      clearTimeout(pendingPick.timer);
      pendingPick = null;
    }
    function finishRootPick() {
      const pick = pendingPick;
      if (!pick || issuingDrill) return;
      const { trigger, menu } = pick;
      if (trigger !== trackedTrigger || menu !== trackedSurface || trackedModel !== pick.model ||
          menu.id !== pick.menuId || doc.hidden || nowPerf() >= pick.expires ||
          menu.getAttribute('role') !== 'menu' || menuIsBusy(trigger, menu)) {
        cancelPendingPick();
        return;
      }
      if (rootSource || pick.drill.parentElement === menu) {
        // React may defer its first pane change. A new root, catalog, selection or
        // disabled drill invalidates the gesture even if the portal ID was reused.
        if (pick.leftRoot || rootSource?.drill !== pick.drill || rootSource.marker !== pick.marker ||
            rootSource.raw !== pick.raw || rootSource.current !== pick.current ||
            rootSource.selected?.id !== pick.fromId || isDisabled(pick.drill)) cancelPendingPick();
        return;
      }
      pick.leftRoot = true;
      if (Array.from(menu.children).some((el) => el.matches(drillSelector))) { cancelPendingPick(); return; }
      if (effortPane !== 'effort') return; // A delayed empty pane can still receive its rows.
      const selected = effortRows.filter((row) => row.checked);
      const matches = effortRows.filter((row) => row.label === pick.label);
      if (selected.length > 1 || (selected.length && selected[0].id !== pick.fromId) ||
          matches.length > 1 || matches[0]?.disabled) { cancelPendingPick(); return; }
      if (!matches.length || !selected.length) return; // The native list may arrive in multiple commits.
      const radio = matches[0];
      cancelPendingPick(); // Even a synchronous rejection or auto-close cannot replay this click.
      if (radio.id === pick.id && radio.el.parentElement?.parentElement === menu) {
        radio.el.click();
        mountEffortIntoNativeMenus();
      }
    }
    function mountEffortIntoNativeMenus() {
      if (destroyed) return;
      if (pendingPick) invalidatePickOwner(discoveryObserver?.takeRecords() || []);
      const triggers = effortEnabled ? Array.from(doc.querySelectorAll(triggerSelector)).filter(modelTrigger) : [];
      const trigger = triggers.find((el) => el.getAttribute('aria-expanded') === 'true') ||
        (triggers.includes(trackedTrigger) ? trackedTrigger : triggers[0]) || null;
      const menu = controlledSurface(trigger);
      const model = modelKey(trigger);
      const newOwner = trigger !== trackedTrigger || menu !== trackedSurface;
      const newModel = model !== trackedModel;
      if (newOwner || newModel) clearEffortHold();
      // Keep the last service as a one-way guard. Once this host exposed a native
      // submit action, owner/model/session invalidation must reject, never DOM-click.
      if (newModel || trigger !== trackedTrigger || (menu && menu !== trackedSurface)) rootCatalog = null;
      if (newOwner) observeNative(trigger, menu);
      trackedTrigger = trigger;
      trackedSurface = menu;
      trackedModel = model;
      const root = readRootEfforts(trigger, menu);
      if (root) {
        rootCatalog = root.catalog;
        captureRootEffortService(root);
      }
      const rows = root ? root.rows : readRadioRows(trigger, menu, rootCatalog);
      const pane = root ? 'root' : rows.length ? 'effort' : null;
      const modelPane = !root && menu?.getAttribute?.('role') === 'group' &&
        Boolean(menu.querySelector?.('[role="menu"]'));
      syncMenuBack(menu, modelPane ? 'model' : pane === 'effort' ? 'effort' : null);
      const changed = newOwner || newModel || pane !== effortPane || root?.marker !== rootSource?.marker ||
        rows.length !== effortRows.length || rows.some((r, i) => {
          const old = effortRows[i];
          return r.el !== old.el || r.id !== old.id || r.label !== old.label || r.checked !== old.checked || r.disabled !== old.disabled;
        });
      if (changed) clearDrag();
      rootSource = root;
      effortPane = pane;
      effortRows = rows;
      checkedIndex = rows.findIndex((row) => row.checked);
      const checked = rows[checkedIndex];
      if (pendingEffortHold) {
        if (!rows.length || checked?.id === pendingEffortHold.id ||
            checked?.id !== pendingEffortHold.fromId) {
          clearEffortHold();
        }
      }
      const label = rows.length ? checked?.label ?? null : captionEffort(trigger);
      reflectEffort(label, checked ? checked.id : idForLabel(rootCatalog, label));
      if (rows.length) {
        const mount = effortWrap.parentElement !== menu;
        if (mount) menu.appendChild(effortWrap); // Only our sibling is added or moved.
        if (mount || changed) updateEffortView();
      } else {
        stopEffortPaint();
        if (effortWrap.parentElement) effortWrap.remove();
        crystalPtrLocal = { x: -9999, y: -9999 };
        crystalProx = 0;
      }
      finishRootPick();
    }
    function setEffortEnabled(enabled) {
      if (enabled === effortEnabled) return;
      effortEnabled = enabled;
      if (enabled) discoveryObserver?.observe(doc.body, { subtree: true, childList: true, attributes: true, attributeOldValue: true,
        attributeFilter: ['aria-expanded', 'aria-controls', 'aria-haspopup', 'data-provider-id', 'data-model-id'] });
      else {
        cancelPendingPick(); clearRootEffortService(); discoveryObserver?.disconnect();
        menuBackButton.remove();
      }
      mountEffortIntoNativeMenus();
    }

    function drillToRadio(row) {
      const { marker, drill, raw, current, selected } = rootSource;
      discoveryObserver?.takeRecords(); // The immediately preceding sync already incorporated these.
      const pick = { trigger: trackedTrigger, menu: trackedSurface, menuId: trackedSurface.id, model: trackedModel,
        modelLabel: trackedTrigger.querySelector(modelSelector), marker, drill, raw, current,
        fromId: selected.id, id: row.id, label: row.label,
        expires: nowPerf() + 1200, leftRoot: false, timer: 0 };
      pendingPick = pick;
      // The normal path is a React mutation. Probe once after the click, with a
      // bounded timer fallback only on hosts without MutationObserver.
      const probe = () => {
        if (pendingPick !== pick) return;
        mountEffortIntoNativeMenus();
        if (pendingPick !== pick) return;
        const remaining = Math.max(1, pick.expires - nowPerf());
        pick.timer = setTimeout(probe, Observer ? remaining : Math.min(40, remaining));
      };
      pick.timer = setTimeout(probe, 0);
      issuingDrill = true;
      try { drill.click(); }
      catch { cancelPendingPick(); return false; }
      finally { issuingDrill = false; }
      queueEffortSync();
      return true;
    }
    // Resolve again at release/click, including the original trigger, portal and
    // model. Stale labels must not select an identically named row in a new menu.
    function clickNativeRow(row) {
      if (destroyed || !effortEnabled || pendingPick || !row) return false;
      const menu = trackedSurface, model = trackedModel, marker = rootSource?.marker;
      mountEffortIntoNativeMenus();
      if (trackedSurface !== menu || trackedModel !== model || rootSource?.marker !== marker) return false;
      const live = effortRows.find((r) => r.el === row.el && r.id === row.id && r.label === row.label);
      if (!live || live.disabled || typeof live.el.click !== 'function') return false;
      const hold = holdEffortTarget(live, effortRows[checkedIndex]?.id, knobPosition);
      const reject = () => {
        if (hold && pendingEffortHold === hold) clearEffortHold(true);
      };
      // The native marker is the authoritative session action. Its false/throw
      // result must not silently degrade into a DOM radio click that closes the pane.
      if (capturedRootSelect) {
        const accepted = submitCapturedEffort(live);
        if (!accepted) reject();
        return accepted;
      }
      if (rootSource) {
        const accepted = drillToRadio(live);
        if (!accepted) reject();
        return accepted;
      }
      const accepted = safe(() => { live.el.click(); return true; }, false);
      if (!accepted) {
        reject();
        return false;
      }
      mountEffortIntoNativeMenus();
      return true;
    }
    function setEffort(value) {
      if (destroyed || !effortEnabled || pendingPick) return false;
      mountEffortIntoNativeMenus();
      if (Number.isInteger(value)) return clickNativeRow(effortRows[value]);
      if (value === null) return clickNativeRow(effortRows.find((r) => r.id === null));
      if (typeof value !== 'string') return false;
      const label = value.trim();
      const byId = effortRows.filter((r) => r.id === label);
      const matches = byId.length ? byId : effortRows.filter((r) => r.label === label);
      return matches.length === 1 && clickNativeRow(matches[0]);
    }

    function positionAt(clientX) {
      const rect = effortTrack.getBoundingClientRect();
      const fallback = Math.max(0, shownIndex()) / Math.max(1, effortRows.length - 1);
      if (!Number.isFinite(clientX) || !rect.width) return fallback;
      const knobWidth = Math.max(0, Math.min(rect.width,
        effortKnob.offsetWidth || effortKnob.getBoundingClientRect().width || 24));
      return clamp((clientX - rect.left - knobWidth / 2) / Math.max(1, rect.width - knobWidth), 0, 1);
    }
    function indexAtPosition(position) {
      return Math.round(clamp(position, 0, 1) * Math.max(0, effortRows.length - 1));
    }
    function cancelPreview() {
      clearEffortHold();
      if (!drag) return;
      clearDrag();
      if (effortRows.length) updateEffortView();
    }
    on(effortTrack, 'pointerdown', (ev) => {
      if (ev.isPrimary === false || (ev.button !== undefined && ev.button !== 0) || drag) return;
      mountEffortIntoNativeMenus();
      const position = positionAt(ev.clientX);
      const index = indexAtPosition(position);
      if (!effortRows[index] || effortRows[index].disabled) return;
      ev.preventDefault();
      effortTrack.focus?.({ preventScroll: true });
      drag = { pointerId: ev.pointerId, index, position };
      safe(() => effortTrack.setPointerCapture?.(ev.pointerId));
      updateEffortView({ animate: false });
    });
    on(effortTrack, 'pointermove', (ev) => {
      if (drag && drag.pointerId !== ev.pointerId) return;
      const rect = effortTrack.getBoundingClientRect();
      crystalPtrLocal = { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
      const position = positionAt(ev.clientX);
      const index = indexAtPosition(position);
      if (drag && effortRows[index] && !effortRows[index].disabled) {
        drag.index = index;
        drag.position = position;
        updateEffortView({ animate: false });
      } else if (crystalStyle(effortRows[shownIndex()]?.id)) scheduleEffortPaint();
    });
    on(effortTrack, 'pointerup', (ev) => {
      mountEffortIntoNativeMenus();
      if (!drag || drag.pointerId !== ev.pointerId) return;
      const releasedAt = positionAt(ev.clientX);
      const row = effortRows[indexAtPosition(releasedAt)];
      const fromId = effortRows[checkedIndex]?.id;
      const keepPosition = Boolean(row && !row.disabled && fromId !== row.id);
      clearDrag();
      if (keepPosition) holdEffortTarget(row, fromId, releasedAt);
      else updateEffortView({ animate: true, fromPosition: releasedAt });
      const accepted = clickNativeRow(row);
      if (!accepted) clearEffortHold(true);
    });
    for (const event of ['pointercancel', 'lostpointercapture']) {
      on(effortTrack, event, (ev) => { if (drag?.pointerId === ev.pointerId) cancelPreview(); });
    }
    on(effortTrack, 'pointerleave', () => {
      crystalPtrLocal = { x: -9999, y: -9999 };
      if (drag && !effortTrack.hasPointerCapture?.(drag.pointerId)) cancelPreview();
      if (crystalStyle(effortRows[shownIndex()]?.id)) scheduleEffortPaint();
    });
    on(win, 'blur', () => { cancelPendingPick(); cancelPreview(); });
    // User navigation takes precedence over a deferred drill. The compatibility
    // click generated after pointerup on the slider itself is part of the same gesture.
    for (const event of ['pointerdown', 'keydown', 'click']) {
      on(doc, event, (ev) => {
        if (!pendingPick || (issuingDrill && ev.target === pendingPick.drill)) return;
        if (event !== 'click' || ev.target.closest?.(drillSelector + ', ' + radioSelector + ', ' + triggerSelector)) cancelPendingPick();
      }, true);
    }
    on(effortTrack, 'keydown', (ev) => {
      if (ev.isComposing) return;
      const keys = ['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp', 'Home', 'End', 'Enter', ' '];
      if (!keys.includes(ev.key)) return; // Escape/Shift+Tab stay with ModelSelect.
      mountEffortIntoNativeMenus();
      const indices = effortRows.map((r, i) => r.disabled ? -1 : i).filter((i) => i >= 0);
      if (!indices.length) return;
      ev.preventDefault();
      ev.stopPropagation();
      let next = checkedIndex;
      if (ev.key === 'Home') next = indices[0];
      else if (ev.key === 'End') next = indices[indices.length - 1];
      else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowDown') next = indices.filter((i) => i < checkedIndex).pop() ?? indices[0];
      else if (ev.key === 'ArrowRight' || ev.key === 'ArrowUp') next = indices.find((i) => i > checkedIndex) ?? indices[indices.length - 1];
      clickNativeRow(effortRows[next < 0 ? indices[0] : next]);
    });
    on(effortLabels, 'click', (ev) => {
      const button = ev.target.closest?.('button[data-effort-idx]');
      if (button?.parentElement !== effortLabels) return;
      clickNativeRow(effortRows[Number(button.getAttribute('data-effort-idx'))]);
    });
    on(doc, 'visibilitychange', () => {
      if (doc.hidden) { cancelPendingPick(); cancelPreview(); stopEffortPaint(); }
      else { mountEffortIntoNativeMenus(); scheduleEffortPaint(); }
    });
    cleanups.push(() => {
      discoveryObserver?.disconnect();
      nativeObserver?.disconnect();
      clearDrag();
      clearEffortHold();
      stopKnobMotion();
      stopEffortPaint();
      effortWrap.remove();
      menuBackButton.remove();
      cancelPendingPick();
      clearRootEffortService();
      trackedTrigger = trackedSurface = trackedModel = rootSource = rootCatalog = null;
      effortRows = [];
      knobPosition = null;
    });

    // ── 3. 构建 DeepSeek 蓝鲸 / 虎鲸伴宠舞台 ─────────────────────────────────
    const mascotHost = doc.createElement('div');
    mascotHost.className = 'dsh-mascot-stage';
    mascotHost.setAttribute('data-testid', 'dsh-mascot-stage');
    mascotHost.setAttribute('data-dsh-prism-owned', '1');
    mascotHost.setAttribute('data-prism-companion-stage', '1');
    mascotHost.setAttribute('aria-hidden', 'true');
    mascotHost.style.pointerEvents = 'none';

    const normalizeMascotMode = (value) => {
      const bridgeNormalize = safe(() => win.DSHPrismBridge?.normalizeMascotMode, null);
      if (typeof bridgeNormalize === 'function') {
        const normalized = safe(() => bridgeNormalize(value), null);
        if (normalized === 'off' || normalized === 'whale' || normalized === 'orca') return normalized;
      }
      return value === 'off' ? 'off' : value === 'orca' || value === 'dual' ? 'orca' : 'whale';
    };
    const ensureMascotInstance = () => {
      if (mascotInst) return mascotInst;
      const api = win.DSHPrismCompanions || G.DSHPrismCompanions;
      if (!api || typeof api.mount !== 'function') return null;
      mascotInst = safe(() => api.mount(mascotHost, {
        mode: normalizeMascotMode(state.mascotMode),
        reducedMotion: isMotionReduced(doc),
        streaming: Boolean(state.telemetry.streaming),
      }), null);
      return mascotInst;
    };
    const mountCompanionStage = () => {
      if (destroyed || state.mascotMode === 'off' || !ensureMascotInstance()) {
        mascotHost.remove();
        return false;
      }
      const host = explicitMascotSlot?.isConnected ? explicitMascotSlot : findComposerCard();
      if (!host) {
        mascotHost.remove();
        return false;
      }
      if (mascotHost.parentElement !== host) host.appendChild(mascotHost);
      if (mascotHost.getAttribute('data-hidden') !== '0') mascotHost.setAttribute('data-hidden', '0');
      return true;
    };

    const applyMascotMode = (mode) => {
      const m = normalizeMascotMode(mode);
      state.mascotMode = m;
      // setState is called for off as well so stale spans/animation handles are
      // disposed by the companion module before the stage itself leaves the DOM.
      ensureMascotInstance()?.setState({
        mode: m,
        reducedMotion: isMotionReduced(doc),
        streaming: Boolean(state.telemetry.streaming),
      });
      if (m === 'off') mascotHost.remove();
      else mountCompanionStage();
    };
    applyMascotMode(state.mascotMode);
    cleanups.push(() => {
      mascotInst?.dispose?.();
      mascotInst = null;
      mascotHost.remove();
    });

    // estimateTelemetry(doc) also publishes its sample as a synchronous DOM event.
    // Compare the displayed measurements, not sampledAt or the identity of a cloned snapshot.
    const measurement = (value) => {
      if (typeof value !== 'number' && !(typeof value === 'string' && value.trim())) return null;
      const n = Number(value);
      return Number.isFinite(n) && n >= 0 ? n : null;
    };
    const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
    const updateTelemetry = (incoming) => {
      if (destroyed || !incoming || typeof incoming !== 'object') return false;
      const previous = state.telemetry;
      const model = has(incoming, 'model')
        ? (typeof incoming.model === 'string' && incoming.model.trim()) || null
        : previous.model;
      const base = model === previous.model ? previous : emptyTelemetry();
      const next = { ...base, model, slices: { ...base.slices } };
      for (const key of ['maxTokens', 'usedTokens', 'tps', 'ttftSeconds']) {
        if (has(incoming, key)) next[key] = measurement(incoming[key]);
      }
      if (next.maxTokens === 0) next.maxTokens = null;
      next.usedFraction = next.maxTokens !== null && next.usedTokens !== null
        ? clamp(next.usedTokens / next.maxTokens, 0, 1) : null;
      if (has(incoming, 'streaming')) next.streaming = incoming.streaming === true;
      if (has(incoming, 'slices')) {
        const slices = incoming.slices;
        for (const key of ['system', 'conversation', 'tools']) {
          if (!slices || typeof slices !== 'object') { next.slices[key] = null; continue; }
          const field = key === 'tools' && has(slices, 'codeTools') ? 'codeTools' : key;
          const value = slices[field]; // An explicit slice snapshot can withdraw individual measurements.
          next.slices[key] = measurement(value && typeof value === 'object' ? value.tokens : value);
        }
      }
      if (['model', 'maxTokens', 'usedTokens', 'tps', 'ttftSeconds', 'streaming'].every((k) => next[k] === previous[k]) &&
          Object.keys(next.slices).every((k) => next.slices[k] === previous.slices[k])) return false;
      state.telemetry = next;
      renderTelemetryUi();
      if (previous.model === model && previous.usedTokens !== null && next.usedTokens !== null &&
          Math.abs(next.usedTokens - previous.usedTokens) > 400) {
        vialInst?.impulse(next.usedTokens > previous.usedTokens ? 0.65 : -0.45);
      }
      if (next.streaming !== previous.streaming) mascotInst?.setState({ streaming: next.streaming });
      return true;
    };
    const syncFromBridge = () => {
      const before = state.telemetry;
      const tel = safe(() => activeBridge?.estimateTelemetry?.(doc)) ?? safe(() => activeBridge?.getTelemetry?.());
      if (tel && before === state.telemetry) updateTelemetry(tel);
      return state.telemetry !== before;
    };
    on(win, 'ag-prism:telemetry', (ev) => updateTelemetry(ev?.detail));
    on(win, 'ag-prism:config', (ev) => {
      const c = ev?.detail?.config || ev?.detail || readBridgeConfig();
      if (Object.prototype.hasOwnProperty.call(c, 'mascot')) applyMascotMode(c.mascot);
      if (c.effortSliderModule !== undefined) setEffortEnabled(c.effortSliderModule !== 'off');
      renderTelemetryUi();
      scheduleEffortPaint();
    });

    // ── 4. React 输入卡片内联挂载（只插入/移动插件自有节点） ────────────────
    let inlineSyncTimer = 0;
    let inlineSyncObserver = null;

    function syncComposerAttachments() {
      if (destroyed) return false;
      let dockAttached = false;
      if (explicitVialSlot?.isConnected) {
        if (vialDock.parentElement !== explicitVialSlot) explicitVialSlot.appendChild(vialDock);
        dockAttached = true;
      } else {
        // SlotOutlet may be display:contents, so the dock is inserted as its
        // next sibling inside the real tools/modes row.
        const permission = visiblePermissionSlot(findComposerCard());
        if (permission?.parentElement) {
          if (vialDock.parentElement !== permission.parentElement || vialDock.previousElementSibling !== permission) {
            permission.parentElement.insertBefore(vialDock, permission.nextElementSibling);
          }
          dockAttached = true;
        } else if (vialDock.parentElement) {
          vialDock.remove();
          if (state.vialOpen) setVialOpen(false);
        }
      }
      mountCompanionStage();
      return dockAttached;
    }

    function scheduleComposerSync() {
      if (destroyed || inlineSyncTimer) return;
      inlineSyncTimer = safeTimeout(() => {
        inlineSyncTimer = 0;
        if (destroyed || isComposing) return;
        syncComposerAttachments();
        if (state.vialOpen) positionPopover();
      }, 0);
    }

    if (Observer) {
      inlineSyncObserver = new Observer((records) => {
        if (destroyed || (records.length && records.every(ownedMutation))) return;
        scheduleComposerSync();
      });
      inlineSyncObserver.observe(doc.body, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['hidden', 'inert', 'aria-hidden', 'class', 'style', 'data-slot'],
      });
      cleanups.push(() => {
        inlineSyncObserver?.disconnect();
        inlineSyncObserver = null;
      });
    }
    on(win, 'resize', scheduleComposerSync, { passive: true });
    on(win, 'scroll', () => {
      if (state.vialOpen) positionPopover();
    }, { passive: true, capture: true });

    // 监听根节点主题/强调色/动效属性变更，确保 dsh-stage.html 直接切换主题时实时重绘
    if (typeof MutationObserver === 'function' && doc.documentElement) {
      const rootObs = new MutationObserver(() => {
        if (destroyed) return;
        renderTelemetryUi();
        scheduleEffortPaint();
        mascotInst?.setState({ reducedMotion: isMotionReduced(doc) });
        if (state.vialOpen) positionPopover();
      });
      rootObs.observe(doc.documentElement, {
        attributes: true,
        attributeFilter: ['data-prism-theme', 'data-ag-cs-theme', 'data-ag-cs-palette', 'data-ag-cs-light-preset', 'data-ag-cs-accent', 'data-ag-cs-motion', 'data-ag-cs-ambient', 'data-ag-cs-lang', 'style'],
      });
      cleanups.push(() => rootObs.disconnect());
    }

    const pollTimer = setInterval(() => {
      if (!destroyed && !doc.hidden) {
        syncFromBridge();
        mountEffortIntoNativeMenus();
        if (!isComposing) syncComposerAttachments();
        if (state.vialOpen) positionPopover();
      }
    }, 3000);
    cleanups.push(() => clearInterval(pollTimer));

    // 初始化渲染与输入卡片首次内联挂载
    setEffortEnabled(readBridgeConfig().effortSliderModule !== 'off');
    if (!syncFromBridge()) renderTelemetryUi();
    syncComposerAttachments();

    const instance = {
      destroy() {
        if (destroyed) return;
        destroyed = true;
        cleanups.forEach((fn) => safe(fn));
        cleanups.length = 0;
        if (activeInstance === instance) activeInstance = null;
      },
      getState: () => ({
        vialOpen: state.vialOpen,
        vialMode: state.vialMode,
        effort: state.effort,
        effortLabel,
        effortPane,
        effortPending: Boolean(pendingPick),
        effortOptions: effortRows.map(({ label, id, checked, disabled }) => ({ label, id, checked, disabled })),
        isOrchestrator: state.effort === 'orchestrator',
        mascotMode: state.mascotMode,
        portalMode: false,
        composerInline: Boolean(vialDock.parentElement),
        telemetry: { ...state.telemetry, slices: { ...state.telemetry.slices } },
        mascot: mascotInst?.getLayoutSnapshot?.() || null,
      }),
      syncLayout: () => {
        mountEffortIntoNativeMenus();
        syncComposerAttachments();
        if (state.vialOpen) positionPopover();
      },
      openVialPopover: () => setVialOpen(true),
      closeVialPopover: () => setVialOpen(false),
      toggleVialPopover: () => setVialOpen(!state.vialOpen),
      updateTelemetry,
      setVialTelemetry: updateTelemetry,
      setEffort,
      getEffort: () => state.effort,
      setMascotMode: applyMascotMode,
      stackFiveTower: () => mascotInst?.stackFiveTower?.(),
      stackMascots: () => mascotInst?.stackFiveTower?.(),
      unstackMascots: () => mascotInst?.unstackAll?.(),
      toggleRainbowAurora: (force) => mascotInst?.toggleRainbowAurora?.(force),
      triggerAurora: (force) => mascotInst?.toggleRainbowAurora?.(force),
      bumpMascots: () => mascotInst?.bumpMascots?.(),
      triggerMascotDemo: (kind) => mascotInst?.triggerDemo?.(kind),
      notifyMascot: (ev, payload) => mascotInst?.notify?.(ev, payload),
    };

    activeInstance = instance;
    return instance;
  }

  return {
    init,
    destroy: () => activeInstance?.destroy?.(),
    syncLayout: () => activeInstance?.syncLayout?.(),
    getState: () => activeInstance?.getState?.() || null,
    openVialPopover: () => activeInstance?.openVialPopover?.(),
    closeVialPopover: () => activeInstance?.closeVialPopover?.(),
    toggleVialPopover: () => activeInstance?.toggleVialPopover?.(),
    updateTelemetry: (t) => activeInstance?.updateTelemetry?.(t),
    setVialTelemetry: (t) => activeInstance?.updateTelemetry?.(t),
    setEffort: (l) => activeInstance?.setEffort?.(l) ?? false,
    getEffort: () => activeInstance?.getEffort?.() ?? null,
    setMascotMode: (m) => activeInstance?.setMascotMode?.(m),
    stackFiveTower: () => activeInstance?.stackFiveTower?.(),
    stackMascots: () => activeInstance?.stackFiveTower?.(),
    unstackMascots: () => activeInstance?.unstackMascots?.(),
    toggleRainbowAurora: (f) => activeInstance?.toggleRainbowAurora?.(f),
    triggerAurora: (f) => activeInstance?.toggleRainbowAurora?.(f),
    bumpMascots: () => activeInstance?.bumpMascots?.(),
    triggerMascotDemo: (k) => activeInstance?.triggerMascotDemo?.(k),
    notifyMascot: (e, p) => activeInstance?.notifyMascot?.(e, p),
    vialCore,
    usageCore,
    crystalCore,
    mascotCore,
  };
});
