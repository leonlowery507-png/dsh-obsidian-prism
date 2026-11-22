// ============================================================================
// Obsidian Prism for DeepSeek Harness (dsh-obsidian-prism)
// 统一光学视觉与物理动效引擎 (src/optics-motion.js) — React SPA 安全架构版
//
// React SPA 零侵入设计：
//   - 所有自建光学覆层（地平线极光、三态语义边缘光晕、GPU 追光棱镜边、丝滑物理光标与测量镜像）
//     均挂载在独立的顶层 Portal 容器 `#dsh-obsidian-prism-optics-layer`（直接挂于 document.body，
//     z-index: 18，严格避让右下角 dsh-whale-widget 与右侧 dsh-better-sidebar），
//     绝不移动、包裹、增删任何 React 管理的子树节点，杜绝 reconciliation 冲突。
//   - 五阶水墨淡入完全基于只读 Range 与 CSS.highlights (Custom Highlight API)，零 DOM 改动。
//   - 内置防抖 MutationObserver（120ms）自动适配 React 路由/会话切换保活，
//     `destroy()` 彻底清理全部事件监听、RAF/定时器、Observer、CSS highlights 与自建节点。
//
// 浏览器全局入口：window.DSHPrismOptics.init(bridge)
// ============================================================================

(function (root, factory) {
  'use strict';
  const api = factory(root);
  if (root) {
    root.DSHPrismOptics = api;
    // 兼容 Obsidian Prism 原版模块全局命名空间，便于微件层无缝调用
    root.__agMotionEngine = api.motion;
    root.__agPrismRimCanvas = { createPrismRimCanvasController: api.createPrismRimCanvasController };
    root.__agPrismConvAura = {
      CONV_AURA_HEIGHT_RATIO: api.CONV_AURA_HEIGHT_RATIO,
      CONV_AURA_IDLE_SLEEP_MS: api.CONV_AURA_IDLE_SLEEP_MS,
      computeConvAuraOptics: api.computeConvAuraOptics,
      createConvAuraController: api.createConvAuraController,
    };
    root.__agCrystalPrismCore = api.crystal;
    root.__agCsRippleCore = api.ripple;
    root.__agPrismSmoothCaret = {
      createSmoothCaretController: api.createSmoothCaretController,
      snapDevicePx: api.snapDevicePx,
    };
    root.__agPrismStreamChoreography = {
      STREAM_FADE_MS: api.STREAM_FADE_MS,
      HIGHLIGHT_NAMES: api.HIGHLIGHT_NAMES,
      createInkStreamController: api.createInkStreamController,
    };
  }
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function (G) {
  'use strict';

  const TAU = Math.PI * 2;
  const PORTAL_ID = 'dsh-obsidian-prism-optics-layer';
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const nowMs = () => (typeof performance !== 'undefined' && typeof performance.now === 'function' ? performance.now() : Date.now());
  const docOf = () => (typeof document !== 'undefined' ? document : null);
  const winOf = () => (typeof window !== 'undefined' ? window : G);

  function setAttrIfChanged(el, name, val) {
    if (!el || typeof el.setAttribute !== 'function') return;
    const str = String(val);
    if (el.getAttribute(name) !== str) el.setAttribute(name, str);
  }

  function parseAmbientScale(raw) {
    if (raw === null || raw === undefined || raw === '') return 1;
    const n = Number(raw);
    if (!Number.isFinite(n)) return 1;
    if (n <= 0) return 0;
    return n > 1 ? clamp(n / 100, 0, 1) : clamp(n, 0, 1);
  }

  function isDarkThemeActive() {
    const d = docOf();
    const html = d?.documentElement;
    if (!html) return true;
    const theme = String(html.getAttribute('data-prism-theme') || '').toLowerCase();
    if (theme === 'crystal' || theme === 'alabaster') return false;
    if (theme === 'obsidian' || theme === 'warm') return true;
    const agTheme = String(html.getAttribute('data-ag-cs-theme') || '').toLowerCase();
    if (agTheme === 'light') return false;
    if (agTheme === 'dark') return true;
    const cls = `${html.className || ''} ${d.body?.className || ''}`;
    if (/\b(theme-light|light-theme|light)\b/.test(cls)) return false;
    return true;
  }

  function resolveSpectrumKey(dark) {
    const html = docOf()?.documentElement;
    const accent = String(
      html?.getAttribute('data-prism-accent') || html?.getAttribute('data-ag-cs-accent') || 'follow'
    ).toLowerCase();
    if (accent === 'mono' || accent === 'cobalt' || accent === 'iris' || accent === 'amber') return accent;
    const theme = String(html?.getAttribute('data-prism-theme') || '').toLowerCase();
    if (theme === 'warm' || theme === 'alabaster') return 'warm';
    const pal = String(html?.getAttribute('data-ag-cs-palette') || '').toLowerCase();
    if (pal === 'warm' || pal === 'claude') return 'warm';
    if (!dark && String(html?.getAttribute('data-ag-cs-light-preset') || '').toLowerCase() === 'alabaster') return 'warm';
    return 'default';
  }

  /**
   * 创建或获取独立于 React 子树的顶层光学挂载层 (#dsh-obsidian-prism-optics-layer)
   * 所有自建覆层 DOM 均置于此处，确保 React reconciliation 零冲突。
   */
  function ensureOpticsPortalLayer() {
    const d = docOf();
    if (!d || !d.body) return null;
    let layer = d.getElementById?.(PORTAL_ID) || d.querySelector?.(`#${PORTAL_ID}`);
    if (!layer) {
      layer = d.createElement('div');
      layer.id = PORTAL_ID;
      layer.setAttribute('data-prism-ignore', '1');
      layer.setAttribute('aria-hidden', 'true');
      layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:18;overflow:hidden;';
      d.body.appendChild(layer);
    }
    return layer;
  }

  function removeOpticsPortalLayer() {
    const d = docOf();
    if (!d) return;
    const layer = d.getElementById?.(PORTAL_ID) || d.querySelector?.(`#${PORTAL_ID}`);
    layer?.remove?.();
  }

  function isElementVisible(el) {
    if (!el || el.isConnected === false || el.hidden) return false;
    const r = el.getBoundingClientRect?.();
    if (!r || r.width < 8 || r.height < 8) return false;
    try {
      const cs = winOf()?.getComputedStyle?.(el);
      if (cs && (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0')) return false;
    } catch {}
    return true;
  }

  function isInsideForeignWidget(el) {
    if (!el || typeof el.closest !== 'function') return false;
    return Boolean(el.closest(`#${PORTAL_ID}, [data-prism-ignore], .dshwv-root, [class*="dshwv-"]`));
  }

  // ==========================================================================
  // 子系统一：四档弹簧物理动效编排引擎 (Unified 4-Tier Spring Choreography)
  // ==========================================================================
  const SPRING_PRESETS = Object.freeze({
    snappy: { stiffness: 420, damping: 30, mass: 0.9 },
    bouncy: { stiffness: 380, damping: 20, mass: 1 },
    default: { stiffness: 380, damping: 26, mass: 1 },
    gentle: { stiffness: 260, damping: 26, mass: 1.05 },
    micro: { stiffness: 440, damping: 24, mass: 0.85 },
    indicator: { stiffness: 430, damping: 32, mass: 0.9 },
  });

  const MOTION_TIERS = new Set(['off', 'subtle', 'standard', 'ultra']);
  const SPRING_CACHE = new Map();
  const ACTIVE_ANIMS = new WeakMap();
  const BOUND_ROOTS = new WeakMap();
  const HOVER_COOLDOWNS = new WeakMap();
  const FALLBACK_BEZIER = 'cubic-bezier(0.22, 1.25, 0.36, 1)';
  const THOUGHT_CLS_RE = /\b(ag-prism-thought-raw-toggle|ag-prism-thought-overlay|dshwv-)\b/;

  function isThoughtExcluded(el) {
    let cur = el;
    while (cur && typeof cur === 'object') {
      if (cur.hasAttribute?.('data-prism-ignore')) return true;
      const cls = String(cur.getAttribute?.('class') || cur.className || '');
      if (THOUGHT_CLS_RE.test(cls)) return true;
      cur = cur.parentElement || null;
    }
    return false;
  }

  function prefersReducedMotion(override) {
    if (typeof override === 'boolean') return override;
    try {
      return Boolean(winOf()?.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
    } catch {
      return false;
    }
  }

  function getMotionTier(override) {
    if (prefersReducedMotion(typeof override === 'boolean' ? override : undefined)) return 'off';
    if (typeof override === 'string' && MOTION_TIERS.has(override)) return override;
    const html = docOf()?.documentElement;
    const raw =
      html?.getAttribute?.('data-prism-motion') ||
      html?.getAttribute?.('data-ag-cs-motion') ||
      'ultra';
    return MOTION_TIERS.has(raw) ? raw : 'ultra';
  }

  function resolveMotionTier(opts) {
    if (opts && typeof opts.reducedMotion === 'boolean') {
      return opts.reducedMotion
        ? 'off'
        : opts.motionTier && MOTION_TIERS.has(opts.motionTier)
        ? opts.motionTier
        : getMotionTier(false);
    }
    return getMotionTier(opts?.motionTier);
  }

  function hasCssLinearEasing() {
    try {
      if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function') {
        return CSS.supports('animation-timing-function', 'linear(0, 1)');
      }
    } catch {}
    return true;
  }

  /**
   * 解析求解阻尼弹簧动力学方程，生成 CSS linear(...) 缓动曲线并 LRU 缓存
   */
  function springLinear(opts = {}) {
    const preset = typeof opts === 'string' ? SPRING_PRESETS[opts] : opts?.preset ? SPRING_PRESETS[opts.preset] : null;
    const k = clamp(+(opts?.stiffness ?? preset?.stiffness ?? 380), 20, 3000);
    const c = clamp(+(opts?.damping ?? preset?.damping ?? 26), 1, 400);
    const m = clamp(+(opts?.mass ?? preset?.mass ?? 1), 0.05, 20);
    const v0 = clamp(+(opts?.velocity ?? 0), -50, 50);
    const rD = clamp(+(opts?.restDelta ?? 0.001), 0.0001, 0.05);
    const rS = clamp(+(opts?.restSpeed ?? 0.001), 0.0001, 0.05);
    const n = Math.round(clamp(+(opts?.sampleCount ?? 40), 12, 96));
    const key = `${k}|${c}|${m}|${v0}|${rD}|${rS}|${n}`;
    if (SPRING_CACHE.has(key)) return SPRING_CACHE.get(key);

    const w0 = Math.sqrt(k / m);
    const z = c / (2 * Math.sqrt(k * m));
    let pos;
    let vel;
    if (z < 1 - 1e-5) {
      const wd = w0 * Math.sqrt(1 - z * z);
      const b = (v0 - z * w0) / wd;
      pos = (t) => (t <= 0 ? 0 : 1 + Math.exp(-z * w0 * t) * (-Math.cos(wd * t) + b * Math.sin(wd * t)));
      vel = (t) => {
        if (t <= 0) return v0;
        const cv = Math.cos(wd * t);
        const sv = Math.sin(wd * t);
        return Math.exp(-z * w0 * t) * (-z * w0 * (-cv + b * sv) + wd * sv + b * wd * cv);
      };
    } else if (z > 1 + 1e-5) {
      const g = w0 * Math.sqrt(z * z - 1);
      const r1 = -z * w0 + g;
      const r2 = -z * w0 - g;
      const c1 = (v0 + r2) / (2 * g);
      const c2 = -1 - c1;
      pos = (t) => (t <= 0 ? 0 : 1 + c1 * Math.exp(r1 * t) + c2 * Math.exp(r2 * t));
      vel = (t) => (t <= 0 ? v0 : c1 * r1 * Math.exp(r1 * t) + c2 * r2 * Math.exp(r2 * t));
    } else {
      const b = v0 - w0;
      pos = (t) => (t <= 0 ? 0 : 1 + Math.exp(-w0 * t) * (-1 + b * t));
      vel = (t) => (t <= 0 ? v0 : Math.exp(-w0 * t) * (-w0 * (-1 + b * t) + b));
    }

    const dt = 1 / 240;
    let endT = 0.08;
    for (let t = dt; t <= 3.6; t += dt) {
      if (Math.abs(1 - pos(t)) > rD || Math.abs(vel(t)) > rS) endT = t;
    }
    const sec = clamp(endT + dt, 0.08, 3.6);
    const samples = new Array(n);
    samples[0] = 0;
    for (let i = 1; i < n - 1; i++) samples[i] = +pos((i / (n - 1)) * sec).toFixed(4);
    samples[n - 1] = 1;

    const result = Object.freeze({
      easing: `linear(${samples.join(', ')})`,
      durationMs: Math.round(sec * 1000),
      samples: Object.freeze(samples),
      solveAt: pos,
    });
    if (SPRING_CACHE.size >= 64) SPRING_CACHE.delete(SPRING_CACHE.keys().next().value);
    SPRING_CACHE.set(key, result);
    return result;
  }

  const noopHandle = (durationMs = 0, easing = 'linear') => ({
    animation: null,
    durationMs,
    easing,
    finished: Promise.resolve(),
    cancel() {},
  });

  function commitFinalKeyframe(el, kf) {
    if (!el?.style || !kf) return;
    let last = Array.isArray(kf) ? kf[kf.length - 1] : null;
    if (!last && typeof kf === 'object') {
      last = {};
      for (const [p, v] of Object.entries(kf)) last[p] = Array.isArray(v) ? v[v.length - 1] : v;
    }
    if (!last) return;
    for (const [p, v] of Object.entries(last)) {
      if (p !== 'offset' && p !== 'easing' && p !== 'composite' && v != null) {
        try {
          el.style[p] = String(v);
        } catch {}
      }
    }
  }

  function spring(el, kf, opts = {}) {
    if (!el || !kf || isThoughtExcluded(el)) return noopHandle();
    const tier = resolveMotionTier(opts);
    const slot = String(opts.slot || 'default');
    let slots = ACTIVE_ANIMS.get(el);
    if (!slots) ACTIVE_ANIMS.set(el, (slots = new Map()));
    const prev = slots.get(slot);
    if (prev) {
      try {
        if (opts.interrupt === 'commit' && prev.commitStyles) prev.commitStyles();
        prev.cancel();
      } catch {}
      slots.delete(slot);
    }
    if (opts.transformBox && el.style) el.style.transformBox = opts.transformBox;
    if (opts.transformOrigin && el.style) el.style.transformOrigin = opts.transformOrigin;
    const fill = opts.fill || 'none';
    if (tier === 'off') {
      if (opts.commitFinal !== false && (fill === 'forwards' || fill === 'both' || opts.applyReducedFinal)) {
        commitFinalKeyframe(el, kf);
      }
      return noopHandle(0, 'step-end');
    }
    const sub = tier === 'subtle';
    const solved = sub ? null : springLinear(opts);
    const durationMs = sub ? 120 : Number.isFinite(opts.durationMs) ? Math.max(16, Math.round(opts.durationMs)) : solved.durationMs;
    const easing = sub ? 'ease-out' : hasCssLinearEasing() ? solved.easing : FALLBACK_BEZIER;
    const useKf = sub && Array.isArray(kf) && kf.length > 2 ? [kf[0], kf[kf.length - 1]] : kf;
    const delay = Math.max(0, +opts.delay || 0);
    if (typeof el.animate !== 'function') {
      if (fill === 'forwards' || fill === 'both') commitFinalKeyframe(el, useKf);
      return noopHandle(durationMs, easing);
    }
    let anim = null;
    try {
      anim = el.animate(useKf, { duration: durationMs, delay, easing, fill });
    } catch {
      try {
        anim = el.animate(useKf, { duration: Math.min(durationMs, 360), delay, easing: sub ? 'ease-out' : FALLBACK_BEZIER, fill });
      } catch {
        if (fill === 'forwards' || fill === 'both') commitFinalKeyframe(el, useKf);
        return noopHandle(durationMs, easing);
      }
    }
    slots.set(slot, anim);
    const clearSlot = () => {
      if (slots.get(slot) === anim) slots.delete(slot);
    };
    const finished =
      anim?.finished?.then
        ? anim.finished.then(() => {
            clearSlot();
            if (opts.commitOnFinish && anim.commitStyles) {
              try {
                anim.commitStyles();
                anim.cancel();
              } catch {}
            }
          }, clearSlot)
        : Promise.resolve();
    return {
      animation: anim,
      durationMs,
      easing,
      finished,
      cancel() {
        try {
          anim?.cancel();
        } catch {}
        clearSlot();
      },
    };
  }

  function groupHandles(handles) {
    Object.defineProperty(handles, 'finished', { value: Promise.all(handles.map((h) => h.finished)), enumerable: false });
    Object.defineProperty(handles, 'cancelAll', {
      value() {
        handles.forEach((h) => h.cancel());
      },
      enumerable: false,
    });
    return handles;
  }

  function stagger(els, kf, opts = {}) {
    let list = [];
    if (typeof els === 'string') {
      const sc = opts.root || docOf();
      if (sc?.querySelectorAll) list = Array.from(sc.querySelectorAll(els));
    } else if (els) {
      list = typeof els.length === 'number' ? Array.from(els).filter(Boolean) : [els];
    }
    const tier = resolveMotionTier(opts);
    const rawStep = clamp(+(opts.delayStep ?? opts.stepMs ?? 28), 0, 400);
    const rawMax = clamp(+(opts.maxDelay ?? 320), 0, 2000);
    const step = tier === 'off' ? 0 : tier === 'subtle' ? Math.min(rawStep, 16) : rawStep;
    const init = tier === 'off' ? 0 : Math.max(0, +(opts.initialDelay ?? 0));
    const maxD = tier === 'off' ? 0 : tier === 'subtle' ? Math.min(rawMax, 96) : rawMax;
    return groupHandles(
      list.map((el, i) =>
        spring(el, typeof kf === 'function' ? kf(el, i, list.length) : kf, {
          stiffness: 360,
          damping: 28,
          ...opts,
          delay: Math.min(maxD, init + i * step),
          slot: opts.slot || 'stagger',
        })
      )
    );
  }

  function toRectObj(r) {
    if (!r) return null;
    if (typeof r.getBoundingClientRect === 'function') r = r.getBoundingClientRect();
    return Number.isFinite(r.left) && Number.isFinite(r.top)
      ? { left: +r.left, top: +r.top, width: +r.width || 0, height: +r.height || 0 }
      : null;
  }

  function glideIndicator(el, prevR, nextR, opts = {}) {
    if (!el || resolveMotionTier(opts) === 'off') return noopHandle(0, 'step-end');
    const from = toRectObj(prevR);
    const to = toRectObj(nextR || el);
    if (!to || to.width <= 0 || to.height <= 0) return noopHandle();
    if (!from || from.width <= 0 || from.height <= 0) {
      return spring(el, [{ opacity: 0, transform: 'scale(0.94)' }, { opacity: 1, transform: 'scale(1)' }], {
        ...SPRING_PRESETS.indicator,
        ...opts,
        slot: 'glide',
      });
    }
    const dx = from.left - to.left;
    const dy = from.top - to.top;
    const sx = from.width / to.width;
    const sy = from.height / to.height;
    const noScale = Math.abs(sx - 1) < 0.025 && Math.abs(sy - 1) < 0.025;
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && noScale) return noopHandle();
    const scaleOn = opts.scaleAxis !== false && !noScale;
    const tf0 = scaleOn
      ? `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`
      : `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`;
    return spring(el, [{ transform: tf0 }, { transform: 'translate3d(0, 0, 0) scale(1, 1)' }], {
      ...SPRING_PRESETS.indicator,
      ...opts,
      transformOrigin: scaleOn ? '0 0' : '50% 50%',
      slot: 'glide',
    });
  }

  function drawStroke(rootEl, opts = {}) {
    if (!rootEl) return groupHandles([]);
    const sel = opts.selector || 'path, line, polyline, circle, ellipse';
    const nodes = [];
    if (rootEl.matches?.(sel)) nodes.push(rootEl);
    if (rootEl.querySelectorAll) nodes.push(...Array.from(rootEl.querySelectorAll(sel)));
    const tier = resolveMotionTier(opts);
    const stepMs = tier === 'subtle' ? Math.min(+(opts.staggerMs ?? 45), 20) : clamp(+(opts.staggerMs ?? 45), 0, 300);
    return groupHandles(
      nodes.map((node, i) => {
        let len = 28;
        if (typeof node.getTotalLength === 'function') {
          try {
            const m = node.getTotalLength();
            if (m > 0) len = m;
          } catch {}
        }
        const dash = `${Math.ceil(len + 1)}`;
        if (node.style) {
          node.style.strokeDasharray = dash;
          node.style.strokeDashoffset = tier === 'off' ? '0' : dash;
        }
        if (tier === 'off') return noopHandle(0, 'step-end');
        return spring(
          node,
          [
            { strokeDashoffset: dash, opacity: opts.fadeIn === false ? 1 : 0.35 },
            { strokeDashoffset: '0', opacity: 1 },
          ],
          {
            stiffness: opts.stiffness ?? 260,
            damping: opts.damping ?? 26,
            delay: (opts.delay || 0) + i * stepMs,
            fill: 'forwards',
            commitOnFinish: true,
            reducedMotion: opts.reducedMotion,
            motionTier: opts.motionTier,
            slot: 'stroke',
          }
        );
      })
    );
  }

  function isEditableEl(el) {
    if (!el) return false;
    const tag = String(el.tagName || '').toUpperCase();
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || Boolean(el.isContentEditable);
  }

  function findPressButton(target) {
    if (!target || isThoughtExcluded(target)) return null;
    let cur = target;
    while (cur) {
      if (isEditableEl(cur) || cur.hasAttribute?.('data-no-press-spring') || isThoughtExcluded(cur)) return null;
      const tag = String(cur.tagName || '').toUpperCase();
      if (tag === 'BUTTON' || cur.getAttribute?.('role') === 'button') {
        if (cur.disabled || cur.getAttribute?.('aria-disabled') === 'true') return null;
        const r = cur.getBoundingClientRect?.();
        if (r && (r.width > 420 || r.height > 96)) return null;
        return cur;
      }
      cur = cur.parentElement || null;
    }
    return null;
  }

  function bindMicroInteractions(rootEl, opts = {}) {
    const r = rootEl || docOf();
    if (!r || typeof r.addEventListener !== 'function') return { root: r, unbind() {} };
    if (BOUND_ROOTS.has(r)) return BOUND_ROOTS.get(r);
    const cd = clamp(+(opts.cooldownMs ?? 150), 40, 1000);
    const onDown = (e) => {
      if (!e || (typeof e.button === 'number' && e.button !== 0)) return;
      const tier = resolveMotionTier(opts);
      if (tier !== 'standard' && tier !== 'ultra') return;
      const btn = findPressButton(e.target);
      if (!btn) return;
      const now = Date.now();
      if (now - (HOVER_COOLDOWNS.get(btn) || 0) < cd) return;
      HOVER_COOLDOWNS.set(btn, now);
      spring(btn, [{ transform: 'scale(1)' }, { transform: 'scale(0.965)' }, { transform: 'scale(1)' }], {
        stiffness: 520,
        damping: 30,
        mass: 0.72,
        slot: 'btn-press',
      });
    };
    r.addEventListener('pointerdown', onDown, { passive: true });
    const binding = {
      root: r,
      unbind() {
        r.removeEventListener('pointerdown', onDown);
        BOUND_ROOTS.delete(r);
      },
    };
    BOUND_ROOTS.set(r, binding);
    return binding;
  }

  const motionEngine = Object.freeze({
    SPRING_PRESETS,
    prefersReducedMotion,
    getMotionTier,
    springLinear,
    spring,
    stagger,
    glideIndicator,
    drawStroke,
    bindMicroInteractions,
    isThoughtExcluded,
  });

  // ==========================================================================
  // 子系统二：地平线极光着色器与交互式水波纹核心 (ripple-core)
  // ==========================================================================
  const HORIZON_SPECTRUM_MODES = Object.freeze({
    default: 0,
    follow: 0,
    warm: 1,
    alabaster: 1,
    claude: 1,
    cobalt: 2,
    iris: 3,
    amber: 4,
    mono: 5,
  });

  const HORIZON_SEMANTIC_MODES = Object.freeze({
    none: 0,
    'awaiting-decision': 1,
    decision: 1,
    'error-halted': 2,
    error: 2,
    'long-task-complete': 3,
    'complete-jade': 3,
  });

  const DEFAULT_HORIZON_AURA = Object.freeze({ reach: 0.48, prism: 0.2, surge: 0, speed: 1 });

  function resolveHorizonSpectrumCode(mode) {
    if (typeof mode === 'number' && Number.isFinite(mode)) return clamp(Math.round(mode), 0, 5);
    const key = String(mode || '').trim().toLowerCase();
    return Object.prototype.hasOwnProperty.call(HORIZON_SPECTRUM_MODES, key) ? HORIZON_SPECTRUM_MODES[key] : 0;
  }

  function resolveHorizonSemanticCode(sem) {
    if (typeof sem === 'number' && Number.isFinite(sem)) return clamp(Math.round(sem), 0, 3);
    const key = String(sem || '').trim().toLowerCase();
    return Object.prototype.hasOwnProperty.call(HORIZON_SEMANTIC_MODES, key) ? HORIZON_SEMANTIC_MODES[key] : 0;
  }

  function resolveHorizonDpr(devicePixelRatio = 1, baseScale = 0.72) {
    const raw = Number.isFinite(Number(devicePixelRatio)) && Number(devicePixelRatio) > 0 ? Number(devicePixelRatio) : 1;
    const sc = Number.isFinite(Number(baseScale)) && Number(baseScale) > 0 ? Number(baseScale) : 0.72;
    if (raw <= 1) return Math.max(0.5, +(raw * sc).toFixed(3));
    return clamp(+(raw * Math.min(0.68, sc * 0.9)).toFixed(3), 0.72, 1.35);
  }

  const GLOW_VERT_SHADER = `#version 300 es
void main() {
  vec2 corner = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
}`;

  const HORIZON_FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uDpr;
uniform float uTime;
uniform float uDark;
uniform float uReach;
uniform float uIntensity;
uniform float uStretch;
uniform float uPresence;
uniform float uPrism;
uniform float uSurge;
uniform float uSpeed;
uniform float uSpectrum;
uniform float uSemantic;
out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; }
  return v;
}
vec3 semanticColor(float sem, float dark, float ph) {
  float w = 0.5 + 0.5 * sin(ph * 6.2831853);
  if (sem < 1.5) return dark > 0.5 ? mix(vec3(0.949, 0.722, 0.294), vec3(0.980, 0.835, 0.480), 0.35 * w) : mix(vec3(0.851, 0.467, 0.024), vec3(0.706, 0.325, 0.035), 0.40 * w);
  if (sem < 2.5) return dark > 0.5 ? mix(vec3(0.851, 0.345, 0.365), vec3(0.690, 0.235, 0.265), 0.40 * w) : mix(vec3(0.863, 0.149, 0.149), vec3(0.620, 0.110, 0.120), 0.35 * w);
  return dark > 0.5 ? mix(vec3(0.314, 0.745, 0.576), vec3(0.361, 0.776, 0.988), 0.38 * w) : mix(vec3(0.020, 0.588, 0.412), vec3(0.008, 0.518, 0.780), 0.42 * w);
}
vec3 spectrumBase(float spec, float dark, float ph) {
  float w = 0.5 + 0.5 * sin(ph * 6.2831853);
  if (spec > 4.5) return dark > 0.5 ? mix(vec3(0.62, 0.66, 0.73), vec3(0.85, 0.88, 0.93), w) : mix(vec3(0.27, 0.32, 0.40), vec3(0.42, 0.48, 0.57), w);
  if (spec > 3.5) return dark > 0.5 ? mix(vec3(0.82, 0.55, 0.20), vec3(0.95, 0.72, 0.29), w) : mix(vec3(0.85, 0.47, 0.02), vec3(0.71, 0.33, 0.04), w);
  if (spec > 2.5) return dark > 0.5 ? mix(vec3(0.44, 0.36, 0.82), vec3(0.65, 0.54, 0.97), w) : mix(vec3(0.49, 0.23, 0.93), vec3(0.31, 0.28, 0.90), w);
  if (spec > 1.5) return dark > 0.5 ? mix(vec3(0.19, 0.53, 1.00), vec3(0.36, 0.78, 0.99), w) : mix(vec3(0.15, 0.39, 0.92), vec3(0.01, 0.52, 0.78), w);
  if (spec > 0.5) return dark > 0.5 ? mix(vec3(0.58, 0.29, 0.20), vec3(0.85, 0.47, 0.34), w) : mix(vec3(0.76, 0.35, 0.20), vec3(0.85, 0.47, 0.02), w);
  return dark > 0.5 ? mix(vec3(0.26, 0.52, 0.96), mix(vec3(0.61, 0.45, 0.80), vec3(0.36, 0.78, 0.99), w), 0.5 + 0.5 * cos(ph * 4.2))
                    : mix(vec3(0.15, 0.39, 0.92), vec3(0.49, 0.23, 0.93), w);
}
void main() {
  vec2 uv = gl_FragCoord.xy / max(uRes, vec2(1.0));
  float reach = max(uReach, 0.05);
  float y = uv.y / reach;
  float t = uTime;
  float waveA = sin(uv.x * 5.2 - t * 0.68);
  float waveB = sin(uv.x * 8.6 + t * 0.46 + 1.4);
  float curtain = 0.5 + 0.32 * waveA + 0.18 * waveB;
  float jut = (fbm(vec2(uv.x * 4.0 + t * 0.14, t * 0.10)) - 0.5) * 0.52 + (waveA * 0.65 + waveB * 0.35) * 0.18;
  float h = max(0.0, y + uStretch * 0.34 * jut);
  float edgeFade = mix(0.35, 1.0, smoothstep(0.0, 0.28, uv.x) * (1.0 - smoothstep(0.72, 1.0, uv.x)));
  float glow = exp(-h * h * 3.8) * (0.76 + 0.42 * curtain) * edgeFade;
  float field = clamp(glow * 1.15, 0.0, 1.0);
  if (abs(uSurge) > 0.01) {
    float s = abs(uSurge);
    float arc = exp(-pow(y - (0.35 + 0.55 * s), 2.0) * 14.0) * sin(s * 3.14159) * edgeFade;
    field = clamp(field + arc * 0.48, 0.0, 1.0);
  }
  float ph = uv.x * 0.9 + t * 0.14 + 0.18 * fbm(uv * 3.0 + t * 0.12);
  vec3 col = uSemantic > 0.5 ? semanticColor(uSemantic, uDark, ph) : spectrumBase(uSpectrum, uDark, ph);
  float a = clamp(field * (uDark > 0.5 ? 0.52 : 0.44) * mix(0.68, 1.24, clamp(uIntensity, 0.0, 1.0)) * clamp(uPresence, 0.0, 1.0), 0.0, 0.92);
  outColor = vec4(col * a, a);
}`;

  function sampleSemanticRgb2D(spectrumCode, semanticCode, dark) {
    if (semanticCode === 1) return dark ? [242, 184, 75] : [217, 119, 6];
    if (semanticCode === 2) return dark ? [229, 83, 75] : [220, 38, 38];
    if (semanticCode === 3) return dark ? [80, 190, 147] : [5, 150, 105];
    if (spectrumCode === 5) return dark ? [196, 204, 218] : [71, 85, 105];
    if (spectrumCode === 4) return dark ? [242, 184, 75] : [217, 119, 6];
    if (spectrumCode === 3) return dark ? [165, 138, 248] : [124, 58, 237];
    if (spectrumCode === 2) return dark ? [92, 198, 252] : [37, 99, 235];
    if (spectrumCode === 1) return dark ? [217, 119, 87] : [194, 89, 52];
    return dark ? [66, 133, 244] : [37, 99, 235];
  }

  function createBrandHorizonGLRenderer(canvas) {
    const gl = canvas?.getContext?.('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, preserveDrawingBuffer: false });
    if (!gl) return null;
    let program = null;
    const u = {};
    function compile(type, src) {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        gl.deleteShader(sh);
        throw new Error('horizon shader compile error');
      }
      return sh;
    }
    try {
      const vs = compile(gl.VERTEX_SHADER, GLOW_VERT_SHADER);
      const fs = compile(gl.FRAGMENT_SHADER, HORIZON_FRAGMENT_SHADER);
      program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('horizon link error');
      gl.useProgram(program);
      for (const name of ['uRes', 'uDpr', 'uTime', 'uDark', 'uReach', 'uIntensity', 'uStretch', 'uPresence', 'uPrism', 'uSurge', 'uSpeed', 'uSpectrum', 'uSemantic']) {
        u[name] = gl.getUniformLocation(program, name);
      }
    } catch {
      if (program) gl.deleteProgram(program);
      return null;
    }
    return {
      mode: 'webgl2',
      clear() {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      },
      draw(w, h, dpr, timeSec, dark, intensity, presence, reach, prism, surge, speed, spectrumCode, semanticCode) {
        gl.viewport(0, 0, w, h);
        gl.useProgram(program);
        gl.uniform2f(u.uRes, w, h);
        gl.uniform1f(u.uDpr, dpr);
        gl.uniform1f(u.uTime, timeSec);
        gl.uniform1f(u.uDark, dark ? 1 : 0);
        gl.uniform1f(u.uReach, reach);
        gl.uniform1f(u.uIntensity, intensity);
        gl.uniform1f(u.uStretch, 0.6);
        gl.uniform1f(u.uPresence, presence);
        gl.uniform1f(u.uPrism, prism);
        gl.uniform1f(u.uSurge, surge);
        gl.uniform1f(u.uSpeed, speed);
        gl.uniform1f(u.uSpectrum, spectrumCode);
        gl.uniform1f(u.uSemantic, semanticCode);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      },
      dispose() {
        if (program) gl.deleteProgram(program);
        program = null;
      },
    };
  }

  function createBrandHorizon2DRenderer(canvas) {
    const ctx = canvas?.getContext?.('2d');
    if (!ctx) return null;
    return {
      mode: '2d',
      clear() {
        ctx.clearRect(0, 0, canvas.width || 0, canvas.height || 0);
      },
      draw(w, h, _dpr, timeSec, dark, intensity, presence, reach, _prism, _surge, _speed, spectrumCode, semanticCode) {
        if (!w || !h) return;
        ctx.clearRect(0, 0, w, h);
        const [r, g, b] = sampleSemanticRgb2D(spectrumCode, semanticCode, dark);
        const cx = w * (0.5 + 0.08 * Math.sin(timeSec * 0.45));
        const rad = Math.max(w * 0.56, h * (1.2 + reach));
        const grad = ctx.createRadialGradient(cx, h, 2, cx, h, rad);
        const alpha = clamp((dark ? 0.42 : 0.32) * intensity * presence, 0, 0.85);
        grad.addColorStop(0, `rgba(${r},${g},${b},${alpha.toFixed(3)})`);
        grad.addColorStop(0.55, `rgba(${r},${g},${b},${(alpha * 0.36).toFixed(3)})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      },
      dispose() {},
    };
  }

  function mountBrandHorizonGlow(canvas, options = {}) {
    if (!canvas) {
      return {
        mode: 'none',
        resize() {},
        invalidate() {},
        clear() {},
        draw() {},
        drawStaticSnapshot() { return false; },
        isSleeping() { return true; },
        dispose() {},
      };
    }
    const renderer = (options.force2D ? null : createBrandHorizonGLRenderer(canvas)) || createBrandHorizon2DRenderer(canvas);
    let dpr = clamp(Number(options.dpr || 1), 0.5, 1.75);
    let flowSec = 2.4;
    let lastClockMs = null;
    let sleeping = false;

    function resize(w, h, nextDpr) {
      const nw = Math.max(0, Math.round(Number(w || 0)));
      const nh = Math.max(0, Math.round(Number(h || 0)));
      const nd = clamp(Number(nextDpr || dpr || 1), 0.5, 1.75);
      dpr = nd;
      if (nw > 0 && nh > 0) {
        const pw = Math.max(1, Math.round(nw * nd));
        const ph = Math.max(1, Math.round(nh * nd));
        if (canvas.width !== pw || canvas.height !== ph) {
          canvas.width = pw;
          canvas.height = ph;
        }
      }
    }

    function render(nowInput, dark, strengthArg, extra = {}, forceStatic = false) {
      if (!renderer || canvas.width <= 0 || canvas.height <= 0) return false;
      const ambient = clamp(Number(extra.ambientIntensity ?? 1), 0, 1);
      const strength = clamp(Number(strengthArg ?? 1), 0, 1) * ambient;
      if (ambient <= 0 || (forceStatic && strength <= 0)) {
        renderer.clear();
        sleeping = true;
        return false;
      }
      const now = Number(nowInput || nowMs());
      const speed = clamp(Number(extra.speed ?? 1), 0, 3);
      if (forceStatic || extra.still) {
        sleeping = true;
        lastClockMs = now;
      } else {
        sleeping = false;
        if (lastClockMs !== null && now > lastClockMs) {
          flowSec += Math.min(0.12, (now - lastClockMs) / 1000) * speed;
        }
        lastClockMs = now;
      }
      const reach = clamp(Number(extra.reach ?? DEFAULT_HORIZON_AURA.reach), 0.08, 1);
      const prism = clamp(Number(extra.prism ?? DEFAULT_HORIZON_AURA.prism), 0, 1);
      const surge = clamp(Number(extra.surge ?? 0), -1, 1);
      const spectrumCode = resolveHorizonSpectrumCode(extra.spectrum ?? resolveSpectrumKey(dark));
      const semanticCode = resolveHorizonSemanticCode(extra.semantic ?? 'none');
      const breath = forceStatic ? 0.64 : 0.48 + 0.22 * Math.sin(flowSec * 1.15);
      renderer.draw(
        canvas.width,
        canvas.height,
        dpr,
        12 + flowSec,
        dark !== false,
        breath * (0.55 + 0.45 * strength),
        Math.pow(strength, 0.78),
        reach,
        prism,
        surge,
        speed,
        spectrumCode,
        semanticCode
      );
      return true;
    }

    return {
      mode: renderer ? renderer.mode : 'none',
      resize,
      invalidate() {},
      clear() {
        renderer?.clear?.();
        sleeping = true;
      },
      draw(nowInput, dark, strengthArg, extra) {
        return render(nowInput, dark, strengthArg, extra, false);
      },
      drawStaticSnapshot(nowInput, dark, strengthArg, extra) {
        return render(nowInput, dark, strengthArg, extra, true);
      },
      isSleeping() {
        return sleeping;
      },
      dispose() {
        sleeping = true;
        renderer?.dispose?.();
      },
    };
  }

  /**
   * 2D 波动方程水波场（能量衰减后自动归零 0fps 休眠）
   */
  function createWaveField(columns, rows) {
    const cols = Math.max(8, columns | 0);
    const rws = Math.max(8, rows | 0);
    const cells = cols * rws;
    const height = new Float32Array(cells);
    const velocity = new Float32Array(cells);
    let active = false;

    function disturb(col, row, amp = 1.2, radius = 3) {
      const c0 = clamp(Math.floor(col), 0, cols - 1);
      const r0 = clamp(Math.floor(row), 0, rws - 1);
      const rad = Math.max(1, Math.ceil(radius));
      for (let r = Math.max(0, r0 - rad); r <= Math.min(rws - 1, r0 + rad); r++) {
        for (let c = Math.max(0, c0 - rad); c <= Math.min(cols - 1, c0 + rad); c++) {
          const d2 = (c - c0) * (c - c0) + (r - r0) * (r - r0);
          if (d2 <= rad * rad) {
            height[r * cols + c] = clamp(height[r * cols + c] + amp * Math.exp(-d2 / (rad * 1.4)), -1.8, 1.8);
          }
        }
      }
      active = true;
    }

    function advance(dtSec = 0.016) {
      if (!active) return false;
      const dt = clamp(dtSec, 0.004, 0.032);
      const c2 = 42.0;
      const damp = 2.6;
      let peak = 0;
      for (let r = 1; r < rws - 1; r++) {
        const off = r * cols;
        for (let c = 1; c < cols - 1; c++) {
          const i = off + c;
          const lap = height[i - 1] + height[i + 1] + height[i - cols] + height[i + cols] - 4 * height[i];
          velocity[i] += (c2 * lap - damp * velocity[i]) * dt;
        }
      }
      for (let i = 0; i < cells; i++) {
        const h = (height[i] + velocity[i] * dt) * 0.985;
        height[i] = Math.abs(h) < 0.0008 && Math.abs(velocity[i]) < 0.0008 ? 0 : h;
        if (Math.abs(height[i]) > peak) peak = Math.abs(height[i]);
      }
      active = peak > 0.003;
      if (!active) {
        height.fill(0);
        velocity.fill(0);
      }
      return active;
    }

    return { cols, rows: rws, height, active: () => active, disturb, advance };
  }

  function mountInteractiveRipple(hostEl) {
    const d = docOf();
    const portal = ensureOpticsPortalLayer();
    if (!hostEl || !d || !portal) return null;
    const wrap = d.createElement('div');
    wrap.className = 'ag-cs-ripple-host';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.style.position = 'fixed';
    const cv = d.createElement('canvas');
    cv.className = 'ag-cs-ripple-canvas';
    wrap.appendChild(cv);
    portal.appendChild(wrap);

    const ctx = cv.getContext?.('2d');
    const glyphs = '0123456789abcdef.:-+*';
    let field = createWaveField(36, 18);
    let rafId = 0;
    let lastAt = 0;
    let destroyed = false;

    function syncRect() {
      const r = hostEl.getBoundingClientRect?.();
      const w = Math.max(120, Math.round(r?.width || hostEl.clientWidth || 320));
      const h = Math.max(80, Math.round(r?.height || hostEl.clientHeight || 180));
      wrap.style.left = `${Math.round(r?.left || 0)}px`;
      wrap.style.top = `${Math.round(r?.top || 0)}px`;
      wrap.style.width = `${w}px`;
      wrap.style.height = `${h}px`;
      const dpr = Math.min(winOf()?.devicePixelRatio || 1, 1.5);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      field = createWaveField(Math.max(16, Math.floor(w / 14)), Math.max(10, Math.floor(h / 18)));
    }

    function drawFrame(ts) {
      rafId = 0;
      if (destroyed || !ctx) return;
      const dt = lastAt > 0 ? (ts - lastAt) / 1000 : 0.016;
      lastAt = ts;
      const alive = field.advance(dt);
      const w = cv.width;
      const h = cv.height;
      ctx.clearRect(0, 0, w, h);
      const dark = isDarkThemeActive();
      const cw = w / field.cols;
      const ch = h / field.rows;
      ctx.font = `${Math.max(9, Math.round(ch * 0.62))}px ui-monospace, Consolas, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let r = 0; r < field.rows; r++) {
        for (let c = 0; c < field.cols; c++) {
          const val = Math.abs(field.height[r * field.cols + c]);
          if (val < 0.015) continue;
          const a = clamp(val * 0.72, 0.04, 0.85);
          ctx.fillStyle = dark ? `rgba(124, 226, 255, ${a.toFixed(3)})` : `rgba(37, 99, 235, ${a.toFixed(3)})`;
          ctx.fillText(glyphs[Math.floor((val * 13 + c + r) % glyphs.length)], (c + 0.5) * cw, (r + 0.5) * ch);
        }
      }
      if (alive) rafId = requestAnimationFrame(drawFrame);
      else lastAt = 0;
    }

    function wake() {
      if (!destroyed && !rafId && typeof requestAnimationFrame === 'function') {
        rafId = requestAnimationFrame(drawFrame);
      }
    }

    const onPointerDown = (ev) => {
      if (getMotionTier() === 'off') return;
      const r = hostEl.getBoundingClientRect();
      field.disturb(((ev.clientX - r.left) / Math.max(1, r.width)) * field.cols, ((ev.clientY - r.top) / Math.max(1, r.height)) * field.rows, 1.35, 3);
      wake();
    };

    syncRect();
    hostEl.addEventListener('pointerdown', onPointerDown, { passive: true });
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(syncRect) : null;
    ro?.observe(hostEl);

    return {
      disturbNormalized(nx, ny, amp = 1.2) {
        field.disturb(nx * field.cols, ny * field.rows, amp, 3);
        wake();
      },
      isSleeping: () => !rafId && !field.active(),
      dispose() {
        destroyed = true;
        if (rafId && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(rafId);
        ro?.disconnect();
        hostEl.removeEventListener('pointerdown', onPointerDown);
        wrap.remove();
      },
    };
  }

  const rippleCore = Object.freeze({
    HORIZON_SPECTRUM_MODES,
    HORIZON_SEMANTIC_MODES,
    DEFAULT_HORIZON_AURA,
    parseAmbientScale,
    resolveHorizonSpectrumCode,
    resolveHorizonSemanticCode,
    resolveHorizonDpr,
    createWaveField,
    mountBrandHorizonGlow,
    mountInteractiveRipple,
  });

  // ==========================================================================
  // 子系统三：React 安全零重排 GPU 指针追光棱镜边 (prism-rim-canvas)
  // 渲染至顶层 Portal 的单一全视口 Canvas，绝不向 React 组件内插入任何子元素
  // ==========================================================================
  const RIM_PALETTES = {
    default: {
      dark: [[0, 'rgba(255,255,255,0.96)'], [0.24, '#4285F4'], [0.5, '#9B72CB'], [0.74, '#EA4335'], [0.92, '#FBBC04'], [1, 'rgba(251,188,4,0)']],
      light: [[0, '#2563EB'], [0.32, '#7C3AED'], [0.64, '#EA4335'], [0.88, '#D97706'], [1, 'rgba(217,119,6,0)']],
    },
    warm: {
      dark: [[0, 'rgba(255,246,238,0.95)'], [0.26, '#F6BD60'], [0.54, '#F0A37E'], [0.82, '#D97757'], [1, 'rgba(217,119,87,0)']],
      light: [[0, '#9A3412'], [0.34, '#C25934'], [0.68, '#D97757'], [0.9, '#D97706'], [1, 'rgba(217,119,6,0)']],
    },
    cobalt: {
      dark: [[0, 'rgba(240,249,255,0.96)'], [0.26, '#7CE2FF'], [0.56, '#4285F4'], [0.86, '#1B49B2'], [1, 'rgba(27,73,178,0)']],
      light: [[0, '#1D4ED8'], [0.35, '#2563EB'], [0.7, '#0284C7'], [0.92, '#38BDF8'], [1, 'rgba(56,189,248,0)']],
    },
    iris: {
      dark: [[0, 'rgba(245,243,255,0.95)'], [0.26, '#DDD6FE'], [0.56, '#A58AF8'], [0.86, '#6D28D9'], [1, 'rgba(109,40,217,0)']],
      light: [[0, '#5B21B6'], [0.36, '#7C3AED'], [0.7, '#8B5CF6'], [0.92, '#A855F7'], [1, 'rgba(168,85,247,0)']],
    },
    amber: {
      dark: [[0, 'rgba(255,251,235,0.95)'], [0.26, '#FDE68A'], [0.56, '#F2B84B'], [0.86, '#D97706'], [1, 'rgba(217,119,6,0)']],
      light: [[0, '#92400E'], [0.36, '#B45309'], [0.7, '#D97706'], [0.92, '#F59E0B'], [1, 'rgba(245,158,11,0)']],
    },
    mono: {
      dark: [[0, 'rgba(248,250,252,0.92)'], [0.28, '#E2E8F0'], [0.6, '#94A3B8'], [0.88, '#64748B'], [1, 'rgba(100,116,139,0)']],
      light: [[0, '#1E293B'], [0.36, '#334155'], [0.7, '#64748B'], [0.92, '#94A3B8'], [1, 'rgba(148,163,184,0)']],
    },
  };

  function resolveComposerCardForEditor(ed) {
    let cur = ed?.parentElement || null;
    for (let depth = 0; depth < 5 && cur && cur !== docOf()?.body; depth++) {
      const r = cur.getBoundingClientRect?.();
      if (r && r.width >= 260 && r.height >= 44 && r.height <= 320) {
        if (
          cur.matches?.('.dsh-composer, .surface-composer-card, [data-dsh-composer], form') ||
          cur.querySelector?.('button')
        ) {
          return cur;
        }
      }
      cur = cur.parentElement;
    }
    return ed?.parentElement || null;
  }

  function createPrismRimCanvasController(opts = {}) {
    const isDestroyed = opts.isDestroyed || (() => false);
    const getAmbientIntensity =
      opts.getAmbientIntensity ||
      (() => docOf()?.documentElement?.getAttribute('data-prism-ambient') ?? docOf()?.documentElement?.getAttribute('data-ag-cs-ambient') ?? 1);
    const pointerPos = { x: -9999, y: -9999 };
    let rafId = 0;
    let cacheDirty = true;
    let trackedTargets = [];
    let overlayCv = null;
    let overlayCtx = null;
    let wasCleared = true;

    function isDisabled() {
      const tier = getMotionTier();
      return tier === 'off' || tier === 'subtle' || parseAmbientScale(getAmbientIntensity()) <= 0.001;
    }

    function ensureOverlayCanvas() {
      const d = docOf();
      const portal = ensureOpticsPortalLayer();
      if (!d || !portal) return null;
      if (overlayCv && overlayCv.isConnected) return { cv: overlayCv, ctx: overlayCtx };
      overlayCv = d.createElement('canvas');
      overlayCv.className = 'ag-cs-prism-rim-cv dsh-optics-rim-cv';
      overlayCv.setAttribute('aria-hidden', 'true');
      portal.appendChild(overlayCv);
      overlayCtx = overlayCv.getContext?.('2d') || null;
      return overlayCtx ? { cv: overlayCv, ctx: overlayCtx } : null;
    }

    function scanBoxes() {
      const d = docOf();
      if (!d) return;
      const boxSet = new Set();
      // 1. 显式标记的座舱与水晶条
      d.querySelectorAll('.dsh-composer, .surface-composer-card, [data-dsh-composer], [data-ag-cs-prism-box="1"], .ag-cs-orch-track').forEach((el) => {
        if (!isInsideForeignWidget(el) && isElementVisible(el)) boxSet.add(el);
      });
      // 2. 真实 DSH Desktop React SPA 启发式定位输入卡片（零 DOM 子树修改）
      d.querySelectorAll('textarea, [contenteditable="true"]').forEach((ed) => {
        if (isInsideForeignWidget(ed) || !isElementVisible(ed)) return;
        const card = resolveComposerCardForEditor(ed);
        if (card && !isInsideForeignWidget(card) && isElementVisible(card)) boxSet.add(card);
      });

      trackedTargets = Array.from(boxSet).map((box) => ({
        box,
        borderRadius: parseFloat(winOf()?.getComputedStyle?.(box)?.borderTopLeftRadius || '10') || 10,
      }));
      cacheDirty = false;
    }

    function clearOverlay() {
      if (overlayCtx && overlayCv && overlayCv.width > 0 && overlayCv.height > 0 && !wasCleared) {
        overlayCtx.clearRect(0, 0, overlayCv.width, overlayCv.height);
        wasCleared = true;
      }
    }

    function strokeRoundedRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, y, w, h, r);
        return;
      }
      const cr = Math.max(0, Math.min(r, w * 0.5, h * 0.5));
      ctx.moveTo(x + cr, y);
      ctx.arcTo(x + w, y, x + w, y + h, cr);
      ctx.arcTo(x + w, y + h, x, y + h, cr);
      ctx.arcTo(x, y + h, x, y, cr);
      ctx.arcTo(x, y, x + w, y, cr);
      ctx.closePath();
    }

    function drawFrame() {
      rafId = 0;
      if (isDestroyed()) return;
      if (isDisabled()) {
        clearOverlay();
        return;
      }
      const ov = ensureOverlayCanvas();
      if (!ov) return;
      if (cacheDirty || trackedTargets.length === 0) scanBoxes();

      const w = winOf();
      const vw = Math.max(1, w?.innerWidth || 1280);
      const vh = Math.max(1, w?.innerHeight || 720);
      const dpr = Math.min(w?.devicePixelRatio || 1, 2);
      const pw = Math.round(vw * dpr);
      const ph = Math.round(vh * dpr);
      if (ov.cv.width !== pw || ov.cv.height !== ph) {
        ov.cv.width = pw;
        ov.cv.height = ph;
      }

      const ctx = ov.ctx;
      ctx.clearRect(0, 0, pw, ph);

      const dark = isDarkThemeActive();
      const toneKey = resolveSpectrumKey(dark);
      const ambient = parseAmbientScale(getAmbientIntensity());
      const pal = RIM_PALETTES[toneKey] || RIM_PALETTES.default;
      const stops = dark ? pal.dark : pal.light;

      let paintedAny = false;
      for (const entry of trackedTargets) {
        if (!entry.box?.isConnected) continue;
        const r = entry.box.getBoundingClientRect();
        if (r.width < 12 || r.height < 12) continue;
        const maxRange = 260;
        if (
          pointerPos.x < r.left - maxRange ||
          pointerPos.x > r.right + maxRange ||
          pointerPos.y < r.top - maxRange ||
          pointerPos.y > r.bottom + maxRange
        ) {
          continue;
        }
        const gx = pointerPos.x * dpr;
        const gy = pointerPos.y * dpr;
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, 240 * dpr);
        for (let i = 0; i < stops.length; i++) g.addColorStop(stops[i][0], stops[i][1]);

        ctx.save();
        ctx.globalAlpha = clamp(ambient * (toneKey === 'mono' ? 0.58 : 1), 0, 1);
        strokeRoundedRect(
          ctx,
          r.left * dpr,
          r.top * dpr,
          r.width * dpr,
          r.height * dpr,
          Math.min(r.width * 0.5, r.height * 0.5, entry.borderRadius) * dpr
        );
        ctx.lineWidth = 1.45 * dpr;
        ctx.strokeStyle = g;
        ctx.stroke();
        ctx.restore();
        paintedAny = true;
      }
      wasCleared = !paintedAny;
    }

    function onPointerMove(ev) {
      if (isDestroyed()) return;
      pointerPos.x = Number(ev.clientX);
      pointerPos.y = Number(ev.clientY);
      if (!rafId && !isDisabled() && typeof requestAnimationFrame === 'function') {
        rafId = requestAnimationFrame(drawFrame);
      }
    }

    return {
      onPointerMove,
      markDirty() {
        cacheDirty = true;
        if (isDisabled()) clearOverlay();
      },
      invalidateMetrics() {
        cacheDirty = true;
        if (!rafId && typeof requestAnimationFrame === 'function') rafId = requestAnimationFrame(drawFrame);
      },
      teardown() {
        if (rafId && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(rafId);
        rafId = 0;
        clearOverlay();
        overlayCv?.remove?.();
        overlayCv = null;
        overlayCtx = null;
        trackedTargets = [];
      },
    };
  }

  // ==========================================================================
  // 子系统四：三态语义边缘光晕与自动 0fps 休眠控制器 (conv-aura)
  // 挂载在独立 Portal 层并动态对齐主对话视口，零侵入 React 树且避让外部挂件
  // ==========================================================================
  const CONV_AURA_HEIGHT_RATIO = 0.32;
  const CONV_AURA_START_MS = 1150;
  const CONV_AURA_IDLE_SLEEP_MS = 1200; // 空闲 1.2s 后自动进入 0fps 零耗电休眠
  const CONV_AURA_DECISION_BREATH_MS = 1600;
  const CONV_AURA_ERROR_MS = 900;
  const CONV_AURA_LONG_COMPLETE_MS = 1200;
  const CONV_AURA_FOCUS_FADE_MS = 600;

  function scaleConvReach(fullReach) {
    return clamp(+(fullReach / CONV_AURA_HEIGHT_RATIO).toFixed(4), 0.08, 0.98);
  }

  function computeConvAuraOptics(phase, phaseAt, now, dark, wasRunning) {
    const idleStr = dark ? 0.21 : 0.52;
    const runBase = dark ? 0.31 : 0.64;
    const idlePrism = dark ? 0.14 : 0.26;
    if (phase === 'start') {
      const p = clamp((now - phaseAt) / CONV_AURA_START_MS, 0, 1);
      const s = Math.sin(p * Math.PI);
      return {
        strength: idleStr + ((dark ? 0.46 : 0.78) - idleStr) * s,
        reach: scaleConvReach(0.16 + 0.1 * s),
        prism: idlePrism + (0.74 - idlePrism) * s,
        surge: +(0.5 * (1 - 0.32 * Math.pow(p, 2.4))).toFixed(4),
        speed: 1.8,
        semantic: 'none',
        frameMs: 22,
      };
    }
    if (phase === 'running') {
      return {
        strength: runBase + (dark ? 0.035 : 0.045) * Math.sin(now * 0.0021),
        reach: scaleConvReach(0.22),
        prism: 0.7,
        surge: 0.06 * Math.sin(now * 0.0024),
        speed: 1.45,
        semantic: 'none',
        frameMs: 32,
      };
    }
    if (phase === 'awaiting-decision') {
      const p = clamp((now - phaseAt) / CONV_AURA_DECISION_BREATH_MS, 0, 1);
      const wave = p < 1 ? Math.sin(p * Math.PI * 2) * (1 - 0.35 * p) : 0;
      return {
        strength: Math.max(0.08, (dark ? 0.24 : 0.44) + 0.05 * wave),
        reach: scaleConvReach(0.19 + 0.025 * Math.max(0, wave)),
        prism: 0.32,
        surge: p < 1 ? +(0.12 * wave).toFixed(4) : 0,
        speed: p < 1 ? 0.85 : 0,
        semantic: 'awaiting-decision',
        frameMs: 36,
      };
    }
    if (phase === 'error-halted') {
      const p = clamp((now - phaseAt) / CONV_AURA_ERROR_MS, 0, 1);
      const ease = 1 - Math.pow(1 - p, 2.2);
      return {
        strength: (dark ? 0.28 : 0.48) * (1 - ease),
        reach: scaleConvReach(0.22 - 0.09 * ease),
        prism: 0.36 * (1 - ease),
        surge: +(-0.44 * (1 - ease)).toFixed(4),
        speed: 0.9 * (1 - 0.6 * ease),
        semantic: 'error-halted',
        frameMs: 32,
      };
    }
    if (phase === 'long-task-complete') {
      const p = clamp((now - phaseAt) / CONV_AURA_LONG_COMPLETE_MS, 0, 1);
      const ease = 1 - Math.pow(1 - p, 2.05);
      const startStr = dark ? 0.38 : 0.62;
      const holdStr = dark ? 0.18 : 0.32;
      return {
        strength: startStr + (holdStr - startStr) * ease,
        reach: scaleConvReach(0.24 + (0.17 - 0.24) * ease),
        prism: 0.52 + (0.24 - 0.52) * ease,
        surge: +(-0.48 * (1 - ease * 0.92)).toFixed(4),
        speed: 1.25 + (0.55 - 1.25) * ease,
        semantic: 'long-task-complete',
        frameMs: 32,
      };
    }
    if (phase === 'focus-fade') {
      const p = clamp((now - phaseAt) / CONV_AURA_FOCUS_FADE_MS, 0, 1);
      const ease = 1 - Math.pow(1 - p, 2);
      return {
        strength: (dark ? 0.18 : 0.32) + (idleStr - (dark ? 0.18 : 0.32)) * ease,
        reach: scaleConvReach(0.17 + (0.16 - 0.17) * ease),
        prism: 0.24 + (idlePrism - 0.24) * ease,
        surge: 0,
        speed: 0.6,
        semantic: p < 0.7 ? 'long-task-complete' : 'none',
        frameMs: 32,
      };
    }
    return {
      strength: idleStr + (dark ? 0.024 : 0.038) * Math.sin(now * 0.0018),
      reach: scaleConvReach(0.16),
      prism: idlePrism,
      surge: 0,
      speed: 0.72,
      semantic: 'none',
      frameMs: 34,
    };
  }

  function createConvAuraController(opts = {}) {
    const isDestroyed = opts.isDestroyed || (() => false);
    const getAmbientIntensity =
      opts.getAmbientIntensity ||
      (() => docOf()?.documentElement?.getAttribute('data-prism-ambient') ?? docOf()?.documentElement?.getAttribute('data-ag-cs-ambient') ?? 1);
    let inst = null;

    function findTargetSeatRect() {
      const d = docOf();
      const w = winOf();
      const vw = w?.innerWidth || 1024;
      const vh = w?.innerHeight || 720;
      const fallback = { left: 0, top: 0, width: vw, height: vh };
      if (!d) return { el: null, rect: fallback };

      // 1. 识别左侧边栏与右侧边栏边界，确保极光与边缘光晕严格限定在对话主面板以内，绝不覆盖左边栏
      let sidebarRight = 0;
      let rightbarLeft = vw;
      try {
        const navCandidates = d.querySelectorAll('aside, nav, [data-prism-sidebar="1"], [data-dsh-sidebar], .dsh-sidebar');
        for (const nav of navCandidates) {
          if (!nav || isInsideForeignWidget(nav) || !isElementVisible(nav)) continue;
          const nr = nav.getBoundingClientRect();
          if (nr.height < vh * 0.45) continue;
          if (nr.left <= 36 && nr.width >= 140 && nr.width <= 460) {
            sidebarRight = Math.max(sidebarRight, nr.right);
          } else if (nr.right >= vw - 36 && nr.width >= 180 && nr.width <= 600) {
            rightbarLeft = Math.min(rightbarLeft, nr.left);
          }
        }
        // 兜底：若 DSH 使用 div 作为左栏容器且没有 <aside>/<nav> 标签
        if (sidebarRight === 0 && d.body?.children) {
          const scanNodes = [];
          const rootEl = d.getElementById?.('root') || d.body;
          const collect = (node, depth) => {
            if (!node || depth > 4 || !node.children) return;
            for (const c of node.children) {
              scanNodes.push(c);
              collect(c, depth + 1);
            }
          };
          collect(rootEl, 0);
          for (const el of scanNodes) {
            if (!el || isInsideForeignWidget(el) || !isElementVisible(el)) continue;
            const r = el.getBoundingClientRect();
            if (r.height >= vh * 0.6 && r.left <= 24 && r.width >= 180 && r.width <= 420 && r.right < vw * 0.45) {
              sidebarRight = Math.max(sidebarRight, r.right);
            }
          }
        }
      } catch {}

      const candidates = [
        d.querySelector('[data-dsh-chat]'),
        d.querySelector('.dsh-chat'),
        d.querySelector('.dsh-main'),
        d.querySelector('[data-testid="conversation-view"]'),
        d.querySelector('main'),
      ];
      for (const el of candidates) {
        if (el && !isInsideForeignWidget(el) && isElementVisible(el)) {
          const r = el.getBoundingClientRect();
          if (r.width >= 200 && r.height >= 160) {
            const left = Math.max(r.left, sidebarRight);
            const right = Math.min(r.right, rightbarLeft);
            if (right - left >= 200) {
              return { el, rect: { left, top: r.top, width: right - left, height: r.height } };
            }
          }
        }
      }
      const clampedLeft = Math.max(0, sidebarRight);
      const clampedWidth = Math.max(200, Math.min(vw, rightbarLeft) - clampedLeft);
      return { el: d.body, rect: { left: clampedLeft, top: 0, width: clampedWidth, height: vh } };
    }

    function syncPhaseAttrs(phase) {
      if (!inst) return;
      setAttrIfChanged(inst.host, 'data-aura-phase', phase);
      setAttrIfChanged(inst.rimOverlay, 'data-aura-phase', phase);
      const html = docOf()?.documentElement;
      if (html) setAttrIfChanged(html, 'data-prism-aura-phase', phase);
    }

    function enterSleep(reason = 'settled') {
      if (!inst) return;
      if (inst.timer) {
        clearTimeout(inst.timer);
        inst.timer = 0;
      }
      if (inst.rafId && typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(inst.rafId);
        inst.rafId = 0;
      }
      inst.sleeping = true;
      inst.sleepReason = reason;
      setAttrIfChanged(inst.host, 'data-aura-sleep', '1');
    }

    function syncBounds() {
      if (!inst) return;
      const { el, rect } = findTargetSeatRect();
      if (el && el !== inst.observedEl && inst.ro) {
        try {
          if (inst.observedEl) inst.ro.unobserve(inst.observedEl);
          inst.ro.observe(el);
          inst.observedEl = el;
        } catch {}
      }
      const left = Math.max(0, Math.round(rect.left));
      const top = Math.max(0, Math.round(rect.top));
      const width = Math.max(120, Math.round(rect.width));
      const height = Math.max(120, Math.round(rect.height));
      inst.bounds.style.left = `${left}px`;
      inst.bounds.style.top = `${top}px`;
      inst.bounds.style.width = `${width}px`;
      inst.bounds.style.height = `${height}px`;
      const glowH = Math.max(80, Math.round(height * CONV_AURA_HEIGHT_RATIO));
      const dpr = resolveHorizonDpr(winOf()?.devicePixelRatio || 1, 0.72);
      inst.width = width;
      inst.height = glowH;
      inst.glow.resize(width, glowH, dpr);
    }

    function drawFrame(nowInput) {
      if (!inst || isDestroyed()) return;
      inst.rafId = 0;
      const now = typeof nowInput === 'number' && nowInput > 0 ? nowInput : nowMs();
      const ambient = parseAmbientScale(getAmbientIntensity());
      const tier = getMotionTier();
      const allowFlow = (tier === 'standard' || tier === 'ultra') && !docOf()?.hidden;

      if (ambient <= 0.001) {
        inst.glow.clear();
        syncPhaseAttrs('idle');
        enterSleep('ambient-zero');
        return;
      }

      const elapsed = now - inst.phaseAt;
      const dark = isDarkThemeActive();

      if (inst.phase === 'start' && elapsed >= CONV_AURA_START_MS) {
        inst.phase = inst.running ? 'running' : 'idle';
        inst.phaseAt = now;
      } else if (inst.phase === 'error-halted' && elapsed >= CONV_AURA_ERROR_MS) {
        inst.phase = 'idle';
        inst.phaseAt = now - CONV_AURA_IDLE_SLEEP_MS;
        syncPhaseAttrs('idle');
        inst.glow.clear();
        enterSleep('error-cleared');
        return;
      } else if (inst.phase === 'focus-fade' && elapsed >= CONV_AURA_FOCUS_FADE_MS) {
        inst.phase = 'idle';
        inst.phaseAt = now - CONV_AURA_IDLE_SLEEP_MS;
      }

      syncPhaseAttrs(inst.phase);
      const opt = computeConvAuraOptics(inst.phase, inst.phaseAt, now, dark, inst.running);
      const pElapsed = now - inst.phaseAt;

      const settleIdle = inst.phase === 'idle' && pElapsed >= CONV_AURA_IDLE_SLEEP_MS;
      const settleDecision = inst.phase === 'awaiting-decision' && pElapsed >= CONV_AURA_DECISION_BREATH_MS;
      const settleLongDone = inst.phase === 'long-task-complete' && pElapsed >= CONV_AURA_LONG_COMPLETE_MS;
      const still = !allowFlow || settleIdle || settleDecision || settleLongDone;

      if (inst.width > 0 && inst.height > 0) {
        const extra = { ...opt, ambientIntensity: ambient, spectrum: resolveSpectrumKey(dark), still };
        if (still) inst.glow.drawStaticSnapshot(now, dark, opt.strength, extra);
        else inst.glow.draw(now, dark, opt.strength, extra);
        inst.drawCount += 1;
      }

      if (still) {
        enterSleep(settleDecision ? 'decision-hold' : settleLongDone ? 'complete-hold' : 'settled');
        return;
      }

      inst.sleeping = false;
      inst.sleepReason = '';
      inst.host.removeAttribute('data-aura-sleep');

      const nextDelay = Math.max(16, opt.frameMs || 32);
      clearTimeout(inst.timer);
      inst.timer = setTimeout(() => wake(false), nextDelay);
    }

    function wake(immediate = false) {
      if (!inst || isDestroyed()) return;
      if (inst.timer) {
        clearTimeout(inst.timer);
        inst.timer = 0;
      }
      if (immediate) {
        if (inst.rafId && typeof cancelAnimationFrame === 'function') {
          cancelAnimationFrame(inst.rafId);
          inst.rafId = 0;
        }
        drawFrame(nowMs());
        return;
      }
      if (!inst.rafId && typeof requestAnimationFrame === 'function') {
        inst.rafId = requestAnimationFrame(drawFrame);
      }
    }

    function mount() {
      const d = docOf();
      const portal = ensureOpticsPortalLayer();
      if (!d || !portal) return null;
      if (inst && inst.bounds.isConnected) {
        syncBounds();
        return inst;
      }
      unmount();

      const bounds = d.createElement('div');
      bounds.className = 'dsh-optics-conv-bounds';
      bounds.setAttribute('aria-hidden', 'true');

      const host = d.createElement('div');
      host.className = 'ag-cs-conv-aura-host';
      host.setAttribute('aria-hidden', 'true');
      const cv = d.createElement('canvas');
      cv.className = 'ag-cs-conv-glow';
      host.appendChild(cv);

      const rimOverlay = d.createElement('div');
      rimOverlay.className = 'dsh-semantic-rim-aura';
      rimOverlay.setAttribute('aria-hidden', 'true');

      bounds.appendChild(host);
      bounds.appendChild(rimOverlay);
      portal.appendChild(bounds);

      const glow = mountBrandHorizonGlow(cv);
      const initNow = nowMs();

      inst = {
        bounds,
        host,
        rimOverlay,
        canvas: cv,
        glow,
        observedEl: null,
        width: 0,
        height: 0,
        phase: 'idle',
        phaseAt: initNow,
        running: false,
        sleeping: false,
        sleepReason: '',
        drawCount: 0,
        rafId: 0,
        timer: 0,
        ro: null,
        onVis: null,
        onResize: null,
      };

      if (typeof ResizeObserver === 'function') {
        inst.ro = new ResizeObserver(() => {
          syncBounds();
          wake(true);
        });
      }
      inst.onVis = () => {
        if (d.hidden) enterSleep('hidden');
        else wake(true);
      };
      inst.onResize = () => {
        syncBounds();
        wake(true);
      };
      d.addEventListener('visibilitychange', inst.onVis);
      winOf()?.addEventListener?.('resize', inst.onResize, { passive: true });

      syncBounds();
      wake(true);
      return inst;
    }

    function unmount() {
      if (!inst) return;
      enterSleep('unmount');
      inst.ro?.disconnect();
      if (inst.onVis) docOf()?.removeEventListener('visibilitychange', inst.onVis);
      if (inst.onResize) winOf()?.removeEventListener?.('resize', inst.onResize);
      inst.glow?.dispose?.();
      inst.bounds?.remove?.();
      docOf()?.documentElement?.removeAttribute('data-prism-aura-phase');
      inst = null;
    }

    function setPhase(phase) {
      if (!inst) mount();
      if (!inst) return;
      const now = nowMs();
      inst.running = phase === 'running' || phase === 'start';
      inst.phase = phase;
      inst.phaseAt = now;
      inst.sleeping = false;
      inst.sleepReason = '';
      syncBounds();
      syncPhaseAttrs(phase);
      wake(true);
    }

    return {
      sync: mount,
      unmount,
      setPhase,
      triggerStart: () => setPhase('start'),
      triggerRunning: (on = true) => setPhase(on ? 'running' : 'idle'),
      triggerAwaitingDecision: (on = true) => setPhase(on ? 'awaiting-decision' : 'idle'),
      triggerErrorHalted: () => setPhase('error-halted'),
      triggerLongTaskComplete: () => setPhase('long-task-complete'),
      triggerIdle: () => setPhase('idle'),
      refreshTheme: () => wake(true),
      getState: () =>
        inst
          ? {
              phase: inst.phase,
              sleeping: inst.sleeping,
              sleepReason: inst.sleepReason,
              rendererMode: inst.glow.mode,
              drawCount: inst.drawCount,
            }
          : { phase: 'unmounted', sleeping: true, sleepReason: 'unmounted', rendererMode: 'none', drawCount: 0 },
    };
  }

  // ==========================================================================
  // 子系统五：切割白水晶棱镜着色器 (crystal-prism-core)
  // ==========================================================================
  const CRYSTAL_PROXIMITY_RADIUS_PX = 105;
  const CRYSTAL_GLINTS = [
    { u: 0.17, v: 0.3, freq: 0.2718282, phase: 0.15, wobFreq: 0.0713, wobAmp: 0.55, wobPhase: 0.4 },
    { u: 0.41, v: 0.64, freq: 0.381966, phase: 1.72, wobFreq: 0.0527, wobAmp: 0.62, wobPhase: 2.1 },
    { u: 0.63, v: 0.32, freq: 0.2236068, phase: 3.29, wobFreq: 0.0891, wobAmp: 0.48, wobPhase: 4.3 },
    { u: 0.83, v: 0.62, freq: 0.3141593, phase: 4.86, wobFreq: 0.0618, wobAmp: 0.58, wobPhase: 5.6 },
  ];

  const CRYSTAL_FALLBACK_SPECTRA = {
    0: ['#4c8df6', '#9b72cb', '#d96570', '#f2b84b'],
    1: ['#c25934', '#d97757', '#e59377', '#f6bd60'],
    2: ['#1d4ed8', '#3186ff', '#5cc6fc', '#8ce0ff'],
    3: ['#6d28d9', '#8b5cf6', '#a58af8', '#ddd6fe'],
    4: ['#b45309', '#d97706', '#f2b84b', '#fde68a'],
    5: ['#94a3b8', '#cbd5e1', '#e2e8f0', '#f8fafc'],
  };

  function resolveCrystalAccentCode(raw) {
    const k = String(raw || 'default').trim().toLowerCase();
    if (k === 'mono') return 5;
    if (k === 'amber') return 4;
    if (k === 'iris') return 3;
    if (k === 'cobalt') return 2;
    if (k === 'warm' || k === 'claude' || k === 'alabaster') return 1;
    return 0;
  }

  function computeProximityFactor(localX, localY, width, height, radius = CRYSTAL_PROXIMITY_RADIUS_PX) {
    if (!Number.isFinite(localX) || !Number.isFinite(localY) || localX < -2000 || localY < -2000) return 0;
    const w = Math.max(2, Number(width) || 0);
    const h = Math.max(2, Number(height) || 0);
    const r = Math.max(1, Number(radius) || CRYSTAL_PROXIMITY_RADIUS_PX);
    const capR = Math.min(w, h) * 0.5;
    const cx = localX - w * 0.5;
    const cy = localY - h * 0.5;
    const dx = Math.max(0, Math.abs(cx) - Math.max(0, w * 0.5 - capR));
    const dy = Math.abs(cy);
    const dist = Math.hypot(dx, dy) - capR;
    if (dist <= 0) return 1;
    if (dist >= r) return 0;
    const u = 1 - dist / r;
    return u * u * (3 - 2 * u);
  }

  function evaluateDeterministicGlints(timeSec, reduceMotion = false) {
    const t = Math.max(0, Number(timeSec) || 0);
    const staticVals = [0, 0.42, 0.24, 0];
    return CRYSTAL_GLINTS.map((a, idx) => {
      if (reduceMotion) return { u: a.u, v: a.v, intensity: staticVals[idx] };
      const wob = a.wobAmp * Math.sin(t * TAU * a.wobFreq + a.wobPhase);
      const wave = Math.sin(t * TAU * a.freq + a.phase + wob);
      return { u: a.u, v: a.v, intensity: wave > 0 ? Math.pow(wave, 16) : 0 };
    });
  }

  function mountCrystalPrismBar(canvas, options = {}) {
    if (!canvas?.getContext) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const getState =
      typeof options.getState === 'function'
        ? options.getState
        : () => ({ isDark: isDarkThemeActive(), prismStrength: 1, fillRatio: 1 });
    let pointerLocalX = -9999;
    let pointerLocalY = -9999;
    let currentProx = 0;
    let elapsed = 0.25;
    let wakeT = -1;
    let reduceMotion = Boolean(options.reduceMotion);

    function step(dtSec = 0.016) {
      const dt = clamp(Number(dtSec) || 0.016, 0.004, 0.06);
      if (!reduceMotion) elapsed += dt;
      const rect = canvas.getBoundingClientRect?.();
      const cssW = Math.max(40, rect?.width || canvas.clientWidth || 220);
      const cssH = Math.max(16, rect?.height || canvas.clientHeight || 28);
      const dpr = Math.min(2, winOf()?.devicePixelRatio || 1);
      const tw = Math.round(cssW * dpr);
      const th = Math.round(cssH * dpr);
      if (canvas.width !== tw || canvas.height !== th) {
        canvas.width = tw;
        canvas.height = th;
      }

      const st = getState() || {};
      const isDark = st.isDark !== false;
      const ambient = clamp(Number(st.ambientIntensity ?? 1), 0, 1);
      const fillRatio = st.fillRatio !== undefined ? clamp(Number(st.fillRatio), 0, 1) : 1;
      const accentCode = resolveCrystalAccentCode(st.accentTone ?? resolveSpectrumKey(isDark));
      const spectrum = CRYSTAL_FALLBACK_SPECTRA[accentCode] || CRYSTAL_FALLBACK_SPECTRA[0];

      const targetProx = !reduceMotion && ambient > 0.001 ? computeProximityFactor(pointerLocalX, pointerLocalY, cssW, cssH) : 0;
      const tau = targetProx > currentProx ? 0.045 : 0.28;
      currentProx += (targetProx - currentProx) * (1 - Math.exp(-dt / tau));

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);
      const r = cssH * 0.5;
      ctx.save();
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') ctx.roundRect(0, 0, cssW, cssH, r);
      else ctx.rect(0, 0, cssW, cssH);
      ctx.clip();

      const baseGrad = ctx.createLinearGradient(0, 0, 0, cssH);
      if (isDark) {
        baseGrad.addColorStop(0, '#c8d1de');
        baseGrad.addColorStop(0.24, '#e4eaf3');
        baseGrad.addColorStop(0.56, '#8c97aa');
        baseGrad.addColorStop(0.86, '#262b36');
        baseGrad.addColorStop(1, '#0b0c10');
      } else {
        baseGrad.addColorStop(0, '#eef2f9');
        baseGrad.addColorStop(0.25, '#ffffff');
        baseGrad.addColorStop(0.58, '#cbd4e2');
        baseGrad.addColorStop(1, '#5c6678');
      }
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, cssW, cssH);

      const cols = Math.max(5, Math.round(cssW / 34));
      for (let i = 0; i < cols; i++) {
        const x0 = (i / cols) * cssW;
        const x1 = ((i + 1) / cols) * cssW;
        const slant = cssH * 0.36;
        const mid = cssH * (0.42 + 0.18 * Math.sin(i * 2.4 + 0.7));
        const shade = 0.5 + 0.5 * Math.sin(i * 3.1 + 0.6);
        ctx.beginPath();
        ctx.moveTo(x0 + slant, 0);
        ctx.lineTo(x1 + slant, 0);
        ctx.lineTo(x1, mid);
        ctx.lineTo(x0, mid);
        ctx.closePath();
        ctx.fillStyle = shade > 0.5 ? `rgba(255,255,255,${((shade - 0.45) * 0.45).toFixed(3)})` : `rgba(12,16,24,${((0.55 - shade) * 0.35).toFixed(3)})`;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x0 + slant, 0);
        ctx.lineTo(x0, mid);
        ctx.lineTo(x0 - slant, cssH);
        ctx.lineWidth = 0.85;
        ctx.strokeStyle = shade > 0.45 ? 'rgba(255,255,255,0.68)' : 'rgba(15,23,42,0.22)';
        ctx.stroke();

        if (currentProx > 0.02 && accentCode !== 5) {
          const cx = (x0 + x1) * 0.5;
          const spot = currentProx * Math.max(0, 1 - Math.hypot(cx - pointerLocalX, cssH * 0.5 - pointerLocalY) / 95);
          if (spot > 0.04) {
            ctx.save();
            ctx.globalAlpha = spot * 0.28 * ambient;
            ctx.fillStyle = spectrum[i % spectrum.length];
            ctx.fillRect(x0, 0, x1 - x0, cssH);
            ctx.restore();
          }
        }
      }

      if (fillRatio < 0.995) {
        const splitX = fillRatio * cssW;
        const groove = ctx.createLinearGradient(0, 0, 0, cssH);
        groove.addColorStop(0, isDark ? '#080b12' : '#96a2b6');
        groove.addColorStop(1, isDark ? '#1a2234' : '#d6dfec');
        ctx.fillStyle = groove;
        ctx.fillRect(splitX, 0, cssW - splitX, cssH);
      }

      const glints = evaluateDeterministicGlints(elapsed, reduceMotion || ambient <= 0.001);
      for (let i = 0; i < glints.length; i++) {
        const inten = glints[i].intensity * ambient;
        if (inten <= 0.05) continue;
        const gx = glints[i].u * cssW;
        const gy = glints[i].v * cssH;
        ctx.save();
        ctx.globalAlpha = inten * 0.92;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(gx - 5, gy - 1.2);
        ctx.lineTo(gx + 5, gy + 1.2);
        ctx.moveTo(gx - 1.2, gy + 5);
        ctx.lineTo(gx + 1.2, gy - 5);
        ctx.stroke();
        ctx.restore();
      }

      if (wakeT >= 0) {
        wakeT += dt;
        const p = wakeT / 0.7;
        if (p >= 1) wakeT = -1;
        else {
          const sx = (-0.1 + 1.2 * p) * cssW;
          const g = ctx.createLinearGradient(sx - 18, 0, sx + 18, 0);
          g.addColorStop(0, 'rgba(235,244,255,0)');
          g.addColorStop(0.5, `rgba(235,244,255,${(0.65 * Math.sin(Math.PI * p)).toFixed(3)})`);
          g.addColorStop(1, 'rgba(235,244,255,0)');
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, cssW, cssH);
        }
      }

      ctx.restore();
      return true;
    }

    return {
      step,
      wake() {
        if (!reduceMotion) wakeT = 0;
      },
      setReduceMotion(flag) {
        reduceMotion = Boolean(flag);
      },
      setPointerClient(clientX, clientY) {
        const r = canvas.getBoundingClientRect?.();
        if (!r || clientX < -2000) {
          pointerLocalX = -9999;
          pointerLocalY = -9999;
          return;
        }
        pointerLocalX = clientX - r.left;
        pointerLocalY = clientY - r.top;
      },
      dispose() {},
    };
  }

  const crystalCore = Object.freeze({
    PROXIMITY_RADIUS_PX: CRYSTAL_PROXIMITY_RADIUS_PX,
    resolveCrystalAccentCode,
    computeProximityFactor,
    evaluateDeterministicGlints,
    mountCrystalPrismBar,
  });

  // ==========================================================================
  // 子系统六：五阶零 DOM 墨水淡入流式引擎 (CSS.highlights / Custom Highlight API)
  // 100% 只读 Range，绝不改动任何 React DOM 子树
  // ==========================================================================
  const STREAM_FADE_MS = 300;
  const STREAM_FADE_STEP_MS = 60;
  const MAX_FADE_RANGES = 48;
  const HIGHLIGHT_NAMES = Object.freeze(['ag-stream-f0', 'ag-stream-f1', 'ag-stream-f2', 'ag-stream-f3', 'ag-stream-f4']);

  function createInkStreamController(opts = {}) {
    const isDestroyed = opts.isDestroyed || (() => false);
    const fadeItems = [];
    const textLenMap = new WeakMap();
    let hlBuckets = null;
    let fadeRaf = 0;
    let fadeTimer = 0;
    let observer = null;
    let activeDemoTimer = 0;

    function canFade() {
      const tier = getMotionTier();
      return tier === 'standard' || tier === 'ultra';
    }

    function getHighlightBuckets() {
      const cssObj = typeof CSS !== 'undefined' ? CSS : G.CSS;
      const HlCtor = typeof Highlight === 'function' ? Highlight : G.Highlight;
      const d = docOf();
      if (!cssObj?.highlights?.set || typeof HlCtor !== 'function' || typeof d?.createRange !== 'function') return null;
      if (!hlBuckets) {
        hlBuckets = HIGHLIGHT_NAMES.map((name) => {
          const existing = cssObj.highlights.get?.(name) || new HlCtor();
          cssObj.highlights.set(name, existing);
          return existing;
        });
      }
      return hlBuckets;
    }

    function dropItem(it) {
      if (hlBuckets && it.b >= 0 && it.b < 5) {
        try {
          hlBuckets[it.b].delete(it.r);
        } catch {}
      }
      it.b = -1;
    }

    function clearHighlightFade(removeRegistry = false) {
      if (fadeTimer) {
        clearTimeout(fadeTimer);
        fadeTimer = 0;
      }
      if (fadeRaf && typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(fadeRaf);
        fadeRaf = 0;
      }
      for (let i = 0; i < fadeItems.length; i++) dropItem(fadeItems[i]);
      fadeItems.length = 0;
      if (removeRegistry) {
        const cssObj = typeof CSS !== 'undefined' ? CSS : G.CSS;
        for (const name of HIGHLIGHT_NAMES) {
          try {
            if (typeof cssObj?.highlights?.delete === 'function') cssObj.highlights.delete(name);
          } catch {}
        }
        hlBuckets = null;
      }
    }

    function stepFade(ts) {
      fadeRaf = 0;
      if (isDestroyed() || !canFade() || fadeItems.length === 0 || docOf()?.hidden) {
        clearHighlightFade(false);
        return;
      }
      const now = typeof ts === 'number' && Number.isFinite(ts) ? ts : nowMs();
      const buckets = getHighlightBuckets();
      if (!buckets) {
        clearHighlightFade(false);
        return;
      }
      let writeIdx = 0;
      let earliest = Infinity;
      for (let i = 0; i < fadeItems.length; i++) {
        const it = fadeItems[i];
        const tn = it.n;
        const val = tn ? tn.data ?? tn.nodeValue ?? '' : '';
        const age = Math.max(0, now - it.t);
        if (!tn || tn.isConnected === false || val.length < it.e || age >= STREAM_FADE_MS) {
          dropItem(it);
          continue;
        }
        const nextBucket = Math.min(4, (age / STREAM_FADE_STEP_MS) | 0);
        if (it.b !== nextBucket) {
          dropItem(it);
          try {
            buckets[nextBucket].add(it.r);
            it.b = nextBucket;
          } catch {
            continue;
          }
        }
        const due = it.t + (it.b + 1) * STREAM_FADE_STEP_MS;
        if (due < earliest) earliest = due;
        fadeItems[writeIdx++] = it;
      }
      fadeItems.length = writeIdx;
      if (writeIdx > 0) {
        const waitMs = Math.max(8, Math.round(earliest - now));
        fadeTimer = setTimeout(() => {
          fadeTimer = 0;
          if (!fadeRaf && fadeItems.length > 0 && typeof requestAnimationFrame === 'function') {
            fadeRaf = requestAnimationFrame(stepFade);
          }
        }, waitMs);
      } else {
        clearHighlightFade(false);
      }
    }

    function enqueueFadeRange(textNode, startOff, endOff) {
      if (!canFade() || !textNode || endOff <= startOff) return false;
      const d = docOf();
      if (!d || d.hidden) return false;
      const buckets = getHighlightBuckets();
      if (!buckets) return false;
      const raw = textNode.data ?? textNode.nodeValue ?? '';
      if (endOff > raw.length || !/\S/.test(raw.slice(startOff, endOff))) return false;

      const now = nowMs();
      const prev = fadeItems.length > 0 ? fadeItems[fadeItems.length - 1] : null;
      if (prev && prev.n === textNode && prev.e === startOff && now - prev.t <= 64) {
        try {
          prev.r.setEnd(textNode, endOff);
          prev.e = endOff;
          return true;
        } catch {}
      }
      if (fadeItems.length >= MAX_FADE_RANGES) {
        const old = fadeItems.shift();
        if (old) dropItem(old);
      }
      try {
        const range = d.createRange();
        range.setStart(textNode, startOff);
        range.setEnd(textNode, endOff);
        buckets[0].add(range);
        fadeItems.push({ n: textNode, s: startOff, e: endOff, r: range, b: 0, t: now });
        if (!fadeRaf && typeof requestAnimationFrame === 'function') {
          fadeRaf = requestAnimationFrame(stepFade);
        }
        return true;
      } catch {
        return false;
      }
    }

    const STREAM_CONTAINER_SEL =
      '.dsh-assistant-message, [data-dsh-role="assistant"], [data-dsh-stream-target], [data-testid="planner-response-text"], [data-testid="agent-response"], [class*="markdown"], [class*="assistant"], article, main';

    function handleMutations(mutations) {
      if (isDestroyed() || !canFade()) return;
      for (const m of mutations) {
        const target = m.target;
        const baseEl = target?.nodeType === 1 ? target : target?.parentElement;
        if (!baseEl || isInsideForeignWidget(baseEl)) continue;
        if (baseEl.closest?.('.ag-prism-thought-overlay, textarea, input, [contenteditable="true"], script, style, aside, nav, [role="dialog"]')) continue;
        if (!baseEl.closest?.(STREAM_CONTAINER_SEL)) continue;

        if (m.type === 'characterData' && target.nodeType === 3) {
          const newLen = (target.data ?? '').length;
          const prevLen = textLenMap.get(target);
          textLenMap.set(target, newLen);
          if (prevLen !== undefined && newLen > prevLen) {
            enqueueFadeRange(target, prevLen, newLen);
          } else if (prevLen === undefined && newLen > 0 && newLen <= 40) {
            enqueueFadeRange(target, 0, newLen);
          }
        } else if (m.type === 'childList' && m.addedNodes?.length) {
          for (const added of m.addedNodes) {
            if (added.nodeType === 3) {
              const s = added.data ?? '';
              textLenMap.set(added, s.length);
              if (s.length > 0 && s.length <= 64) enqueueFadeRange(added, 0, s.length);
            }
          }
        }
      }
    }

    function observe(rootEl) {
      const target = rootEl || docOf()?.body;
      if (!target || typeof MutationObserver !== 'function') return;
      if (observer) observer.disconnect();
      observer = new MutationObserver(handleMutations);
      observer.observe(target, { childList: true, characterData: true, subtree: true });
    }

    function streamText(targetEl, fullText, streamOpts = {}) {
      if (!targetEl) return { stop() {} };
      if (activeDemoTimer) {
        clearInterval(activeDemoTimer);
        activeDemoTimer = 0;
      }
      const d = docOf();
      const text = String(fullText || '');
      const chunkSize = Math.max(1, Number(streamOpts.chunkSize || 4));
      const intervalMs = Math.max(12, Number(streamOpts.intervalMs || 28));
      targetEl.textContent = '';
      const tn = d.createTextNode('');
      targetEl.appendChild(tn);
      textLenMap.set(tn, 0);
      let cursor = 0;
      streamOpts.onStart?.();
      activeDemoTimer = setInterval(() => {
        if (isDestroyed() || !tn.isConnected) {
          clearInterval(activeDemoTimer);
          activeDemoTimer = 0;
          return;
        }
        const nextEnd = Math.min(text.length, cursor + chunkSize);
        tn.appendData(text.slice(cursor, nextEnd));
        textLenMap.set(tn, nextEnd);
        enqueueFadeRange(tn, cursor, nextEnd);
        cursor = nextEnd;
        if (cursor >= text.length) {
          clearInterval(activeDemoTimer);
          activeDemoTimer = 0;
          streamOpts.onComplete?.();
        }
      }, intervalMs);

      return {
        stop() {
          if (activeDemoTimer) {
            clearInterval(activeDemoTimer);
            activeDemoTimer = 0;
          }
        },
      };
    }

    return {
      observe,
      enqueueFadeRange,
      streamText,
      clearHighlightFade: () => clearHighlightFade(false),
      getHighlightFadeState: () => ({
        supported: Boolean(getHighlightBuckets()),
        activeCount: fadeItems.length,
        rafActive: Boolean(fadeRaf || fadeTimer),
        buckets: hlBuckets ? hlBuckets.map((h) => h.size ?? 0) : [],
      }),
      dispose() {
        if (activeDemoTimer) {
          clearInterval(activeDemoTimer);
          activeDemoTimer = 0;
        }
        observer?.disconnect();
        observer = null;
        clearHighlightFade(true);
      },
    };
  }

  // ==========================================================================
  // 子系统七：React 安全丝滑物理光标引擎 (smooth-caret)
  // 光标与 textarea 镜像全部挂载于顶层 Portal，绝不侵入 React 编辑器父节点
  // ==========================================================================
  function snapDevicePx(value, dpr = 1) {
    const v = Number(value) || 0;
    const d = Number.isFinite(Number(dpr)) && Number(dpr) > 0 ? Math.min(4, Number(dpr)) : 1;
    return +(Math.round(v * d) / d).toFixed(3);
  }

  function measureTextareaCaret(ta, portal) {
    const d = docOf();
    if (!d || !ta || !portal) return null;
    const selStart = ta.selectionStart;
    const selEnd = ta.selectionEnd;
    if (typeof selStart !== 'number' || selStart !== selEnd) return { collapsed: false };
    const cs = winOf()?.getComputedStyle?.(ta);
    if (!cs) return null;

    let mirror = d.getElementById?.('dsh-prism-caret-mirror');
    if (!mirror) {
      mirror = d.createElement('div');
      mirror.id = 'dsh-prism-caret-mirror';
      mirror.setAttribute('aria-hidden', 'true');
      mirror.style.cssText = 'position:fixed;top:-9999px;left:-9999px;visibility:hidden;pointer-events:none;white-space:pre-wrap;word-wrap:break-word;overflow-wrap:break-word;';
      portal.appendChild(mirror);
    }

    const props = [
      'boxSizing', 'width', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
      'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
      'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'lineHeight', 'tabSize',
    ];
    for (const p of props) mirror.style[p] = cs[p];

    mirror.textContent = ta.value.slice(0, selStart);
    const marker = d.createElement('span');
    marker.textContent = '\u200b';
    mirror.appendChild(marker);

    const taRect = ta.getBoundingClientRect();
    const mRect = mirror.getBoundingClientRect();
    const kRect = marker.getBoundingClientRect();
    const lineH = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.45 || 20;
    const left = taRect.left + (kRect.left - mRect.left) - (ta.scrollLeft || 0);
    const top = taRect.top + (kRect.top - mRect.top) - (ta.scrollTop || 0);
    if (top < taRect.top - 4 || top > taRect.bottom + 4) return { collapsed: false };
    return {
      collapsed: true,
      left,
      top,
      height: Math.max(15, Math.min(26, kRect.height || lineH)),
    };
  }

  function createSmoothCaretController(opts = {}) {
    const isDestroyed = opts.isDestroyed || (() => false);
    const isEnabled =
      opts.isEnabled ||
      (() => getMotionTier() !== 'off' && docOf()?.documentElement?.getAttribute('data-prism-smooth-caret') !== 'off');
    let rafId = 0;
    let typingTimer = 0;
    let bound = false;
    let caretEl = null;
    let lastEditor = null;

    function ensureCaretEl(portal) {
      const d = docOf();
      if (!d || !portal) return null;
      if (caretEl && caretEl.isConnected) return caretEl;
      caretEl = d.createElement('div');
      caretEl.className = 'ag-cs-smooth-caret';
      caretEl.setAttribute('aria-hidden', 'true');
      portal.appendChild(caretEl);
      return caretEl;
    }

    function hideCaret() {
      if (caretEl) caretEl.removeAttribute('data-ag-cs-caret-visible');
      if (lastEditor) {
        lastEditor.removeAttribute?.('data-ag-cs-smooth-caret');
        lastEditor = null;
      }
    }

    function measureContentEditable(ed) {
      const sel = docOf()?.getSelection?.();
      if (!sel || sel.rangeCount === 0) return null;
      const range = sel.getRangeAt(0);
      if (!range.collapsed || !ed.contains(range.startContainer)) return { collapsed: false };
      const rects = range.getClientRects?.();
      const r0 = rects?.length ? rects[rects.length - 1] : range.getBoundingClientRect?.();
      if (r0 && r0.height > 0 && (r0.left > 0 || r0.top > 0)) {
        return { collapsed: true, left: r0.left, top: r0.top, height: r0.height };
      }
      const edRect = ed.getBoundingClientRect();
      const cs = winOf()?.getComputedStyle?.(ed);
      return {
        collapsed: true,
        left: edRect.left + (parseFloat(cs?.paddingLeft || '6') || 6),
        top: edRect.top + (parseFloat(cs?.paddingTop || '6') || 6),
        height: Math.max(16, parseFloat(cs?.fontSize || '14') * 1.3),
      };
    }

    function sync(isTyping = false) {
      const d = docOf();
      if (!d || isDestroyed() || !isEnabled()) {
        hideCaret();
        return;
      }
      const activeEl = d.activeElement;
      const isSupportedEditor =
        activeEl &&
        !isInsideForeignWidget(activeEl) &&
        (activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable || activeEl.getAttribute?.('contenteditable') === 'true');
      if (!isSupportedEditor || !isElementVisible(activeEl)) {
        hideCaret();
        return;
      }
      const portal = ensureOpticsPortalLayer();
      const caret = ensureCaretEl(portal);
      if (!caret) return;

      const box = activeEl.tagName === 'TEXTAREA' ? measureTextareaCaret(activeEl, portal) : measureContentEditable(activeEl);
      if (!box || !box.collapsed) {
        hideCaret();
        return;
      }

      if (lastEditor && lastEditor !== activeEl) {
        lastEditor.removeAttribute?.('data-ag-cs-smooth-caret');
      }
      lastEditor = activeEl;

      const dpr = winOf()?.devicePixelRatio || 1;
      const x = snapDevicePx(box.left, dpr);
      const y = snapDevicePx(box.top, dpr);
      const h = Math.max(15, snapDevicePx(box.height || 18, dpr));
      caret.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      caret.style.height = `${h}px`;
      setAttrIfChanged(caret, 'data-ag-cs-caret-visible', '1');
      setAttrIfChanged(activeEl, 'data-ag-cs-smooth-caret', '1');

      if (isTyping) {
        setAttrIfChanged(caret, 'data-ag-cs-caret-typing', '1');
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
          caret?.removeAttribute('data-ag-cs-caret-typing');
        }, 420);
      }
    }

    function queue(isTyping = false) {
      if (isDestroyed() || !isEnabled()) return;
      if (rafId && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(rafId);
      if (typeof requestAnimationFrame === 'function') {
        rafId = requestAnimationFrame(() => {
          rafId = 0;
          sync(isTyping);
        });
      }
    }

    const onInput = () => queue(true);
    const onNav = () => queue(false);

    function bind() {
      const d = docOf();
      if (!d || bound) return;
      bound = true;
      d.addEventListener('input', onInput, true);
      d.addEventListener('keyup', onNav, true);
      d.addEventListener('mouseup', onNav, true);
      d.addEventListener('focusin', onNav, true);
      d.addEventListener('focusout', onNav, true);
      d.addEventListener('selectionchange', onNav, true);
      d.addEventListener('scroll', onNav, true);
    }

    function teardown() {
      const d = docOf();
      if (rafId && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(rafId);
      rafId = 0;
      clearTimeout(typingTimer);
      typingTimer = 0;
      if (d && bound) {
        d.removeEventListener('input', onInput, true);
        d.removeEventListener('keyup', onNav, true);
        d.removeEventListener('mouseup', onNav, true);
        d.removeEventListener('focusin', onNav, true);
        d.removeEventListener('focusout', onNav, true);
        d.removeEventListener('selectionchange', onNav, true);
        d.removeEventListener('scroll', onNav, true);
        bound = false;
      }
      hideCaret();
      d?.querySelectorAll?.('[data-ag-cs-smooth-caret]')?.forEach?.((n) => n.removeAttribute('data-ag-cs-smooth-caret'));
      caretEl?.remove?.();
      caretEl = null;
      d?.getElementById?.('dsh-prism-caret-mirror')?.remove?.();
    }

    return { bind, sync, queue, teardown };
  }

  // ==========================================================================
  // 统一入口：window.DSHPrismOptics.init(bridge)
  // ==========================================================================
  let activeInstance = null;

  function applyConfigAttributes(cfg = {}) {
    const html = docOf()?.documentElement;
    if (!html) return;
    setAttrIfChanged(html, 'data-ag-cs-style', '1');

    const rawTheme = String(cfg.theme || '').toLowerCase();
    if (['obsidian', 'warm', 'crystal', 'alabaster'].includes(rawTheme)) {
      setAttrIfChanged(html, 'data-prism-theme', rawTheme);
      const isLight = rawTheme === 'crystal' || rawTheme === 'alabaster';
      setAttrIfChanged(html, 'data-ag-cs-theme', isLight ? 'light' : 'dark');
      setAttrIfChanged(html, 'data-ag-cs-palette', rawTheme === 'warm' ? 'warm' : 'obsidian');
      if (isLight) setAttrIfChanged(html, 'data-ag-cs-light-preset', rawTheme);
    } else if (!html.hasAttribute('data-prism-theme')) {
      setAttrIfChanged(html, 'data-prism-theme', 'obsidian');
      setAttrIfChanged(html, 'data-ag-cs-theme', 'dark');
      setAttrIfChanged(html, 'data-ag-cs-palette', 'obsidian');
    }

    if (cfg.accent || cfg.accentTone) {
      const acc = String(cfg.accent || cfg.accentTone).toLowerCase();
      setAttrIfChanged(html, 'data-prism-accent', acc);
      setAttrIfChanged(html, 'data-ag-cs-accent', acc);
    }
    if (cfg.corners || cfg.cornerStyle) {
      const cor = String(cfg.corners || cfg.cornerStyle).toLowerCase();
      setAttrIfChanged(html, 'data-prism-corners', cor);
      setAttrIfChanged(html, 'data-ag-cs-corners', cor);
    }
    if (cfg.motion || cfg.motionLevel) {
      const mot = String(cfg.motion || cfg.motionLevel).toLowerCase();
      setAttrIfChanged(html, 'data-prism-motion', mot);
      setAttrIfChanged(html, 'data-ag-cs-motion', mot);
    }
    if (cfg.ambient !== undefined || cfg.ambientIntensity !== undefined) {
      const amb = String(cfg.ambient ?? cfg.ambientIntensity);
      setAttrIfChanged(html, 'data-prism-ambient', amb);
      setAttrIfChanged(html, 'data-ag-cs-ambient', amb);
    }
    if (cfg.codeFont) {
      setAttrIfChanged(html, 'data-prism-code-font', String(cfg.codeFont));
      setAttrIfChanged(html, 'data-ag-cs-code-font', String(cfg.codeFont));
    }
    if (cfg.codeLigatures !== undefined) {
      const lig = cfg.codeLigatures ? '1' : '0';
      setAttrIfChanged(html, 'data-prism-ligatures', lig);
      setAttrIfChanged(html, 'data-ag-cs-ligatures', lig);
    }
    if (cfg.smoothCaret !== undefined) {
      setAttrIfChanged(html, 'data-prism-smooth-caret', cfg.smoothCaret ? 'on' : 'off');
    }
  }

  function init(bridge) {
    if (activeInstance) {
      activeInstance.destroy();
      activeInstance = null;
    }

    const runtimeBridge = bridge || winOf()?.__agPrismBridge || null;
    let destroyed = false;
    let spaKeepAliveTimer = 0;
    const cleanups = [];

    const readConfig = () => {
      try {
        return (typeof runtimeBridge?.getConfig === 'function' ? runtimeBridge.getConfig() : runtimeBridge?.config) || {};
      } catch {
        return {};
      }
    };

    const getAmbient = () => {
      const c = readConfig();
      if (c.ambient !== undefined) return c.ambient;
      if (c.ambientIntensity !== undefined) return c.ambientIntensity;
      return docOf()?.documentElement?.getAttribute('data-prism-ambient') ?? 1;
    };

    try {
      applyConfigAttributes(readConfig());
      ensureOpticsPortalLayer();
    } catch {}

    const micro = bindMicroInteractions(docOf());
    const rimCanvas = createPrismRimCanvasController({ isDestroyed: () => destroyed, getAmbientIntensity: getAmbient });
    const convAura = createConvAuraController({ isDestroyed: () => destroyed, getAmbientIntensity: getAmbient });
    const inkStream = createInkStreamController({ isDestroyed: () => destroyed });
    const smoothCaret = createSmoothCaretController({ isDestroyed: () => destroyed });

    const d = docOf();
    const w = winOf();

    try {
      convAura.sync();
      inkStream.observe();
      smoothCaret.bind();
    } catch {}

    const onPtrMove = (ev) => rimCanvas.onPointerMove(ev);
    const onWinBlur = () => setAttrIfChanged(d?.documentElement, 'data-ag-cs-win-blur', '1');
    const onWinFocus = () => d?.documentElement?.removeAttribute('data-ag-cs-win-blur');

    if (w && typeof w.addEventListener === 'function') {
      w.addEventListener('pointermove', onPtrMove, { passive: true });
      w.addEventListener('blur', onWinBlur, { passive: true });
      w.addEventListener('focus', onWinFocus, { passive: true });
      cleanups.push(() => {
        w.removeEventListener('pointermove', onPtrMove);
        w.removeEventListener('blur', onWinBlur);
        w.removeEventListener('focus', onWinFocus);
      });
    }

    function syncConfig(nextCfg) {
      if (destroyed) return;
      try {
        applyConfigAttributes(nextCfg || readConfig());
        rimCanvas.invalidateMetrics();
        convAura.refreshTheme();
        smoothCaret.queue(false);
      } catch {}
    }

    const onCfgEvent = (ev) => syncConfig(ev?.detail || readConfig());
    if (w && typeof w.addEventListener === 'function') {
      w.addEventListener('ag-prism:config', onCfgEvent);
      cleanups.push(() => w.removeEventListener('ag-prism:config', onCfgEvent));
    }
    if (typeof runtimeBridge?.onConfigChange === 'function') {
      const unsub = runtimeBridge.onConfigChange(syncConfig);
      if (typeof unsub === 'function') cleanups.push(unsub);
    } else if (typeof runtimeBridge?.subscribe === 'function') {
      const unsub = runtimeBridge.subscribe(syncConfig);
      if (typeof unsub === 'function') cleanups.push(unsub);
    }

    // 1. 监听根元素主题/动效属性变化
    if (d?.documentElement && typeof MutationObserver === 'function') {
      const attrObs = new MutationObserver(() => {
        if (destroyed) return;
        rimCanvas.invalidateMetrics();
        convAura.refreshTheme();
      });
      attrObs.observe(d.documentElement, {
        attributes: true,
        attributeFilter: [
          'data-prism-theme',
          'data-prism-accent',
          'data-prism-motion',
          'data-prism-ambient',
          'data-prism-corners',
          'data-ag-cs-theme',
          'data-ag-cs-palette',
          'data-ag-cs-accent',
          'data-ag-cs-motion',
          'data-ag-cs-ambient',
        ],
      });
      cleanups.push(() => attrObs.disconnect());
    }

    // 2. React SPA 路由/会话切换防抖保活 MutationObserver（忽略自建 Portal 内变更）
    if (d?.body && typeof MutationObserver === 'function') {
      const spaObs = new MutationObserver((mutations) => {
        if (destroyed) return;
        let hasExternalStructuralMut = false;
        for (let i = 0; i < mutations.length; i++) {
          const t = mutations[i]?.target;
          if (!t || isInsideForeignWidget(t)) continue;
          if (mutations[i].addedNodes?.length || mutations[i].removedNodes?.length) {
            hasExternalStructuralMut = true;
            break;
          }
        }
        if (!hasExternalStructuralMut) return;
        if (spaKeepAliveTimer) clearTimeout(spaKeepAliveTimer);
        spaKeepAliveTimer = setTimeout(() => {
          spaKeepAliveTimer = 0;
          if (destroyed) return;
          try {
            ensureOpticsPortalLayer();
            rimCanvas.markDirty();
            convAura.sync();
            smoothCaret.queue(false);
          } catch {}
        }, 120);
      });
      spaObs.observe(d.body, { childList: true, subtree: true });
      cleanups.push(() => {
        spaObs.disconnect();
        if (spaKeepAliveTimer) {
          clearTimeout(spaKeepAliveTimer);
          spaKeepAliveTimer = 0;
        }
      });
    }

    const controller = {
      motion: motionEngine,
      rimCanvas,
      convAura,
      inkStream,
      smoothCaret,
      crystal: crystalCore,
      ripple: rippleCore,
      syncConfig,
      refresh() {
        if (destroyed) return;
        try {
          ensureOpticsPortalLayer();
          rimCanvas.markDirty();
          convAura.sync();
          inkStream.observe();
          smoothCaret.queue(false);
        } catch {}
      },
      setSemanticAura: (phase) => convAura.setPhase(phase),
      triggerAwaitingDecision: (active = true) => convAura.triggerAwaitingDecision(active),
      triggerErrorHalted: () => convAura.triggerErrorHalted(),
      triggerLongTaskComplete: () => convAura.triggerLongTaskComplete(),
      triggerRunning: (active = true) => convAura.triggerRunning(active),
      triggerIdle: () => convAura.triggerIdle(),
      streamText: (el, text, opts) => inkStream.streamText(el, text, opts),
      mountCrystalBar: (canvas, opts) => mountCrystalPrismBar(canvas, opts),
      mountRipple: (hostEl, opts) => mountInteractiveRipple(hostEl, opts),
      getState: () => ({
        motionTier: getMotionTier(),
        isDark: isDarkThemeActive(),
        ambientScale: parseAmbientScale(getAmbient()),
        portalMounted: Boolean(docOf()?.getElementById?.(PORTAL_ID)),
        aura: convAura.getState(),
        inkStream: inkStream.getHighlightFadeState(),
      }),
      destroy() {
        if (destroyed) return;
        destroyed = true;
        if (spaKeepAliveTimer) {
          clearTimeout(spaKeepAliveTimer);
          spaKeepAliveTimer = 0;
        }
        while (cleanups.length) {
          try {
            cleanups.pop()();
          } catch {}
        }
        try {
          micro.unbind();
          rimCanvas.teardown();
          convAura.unmount();
          inkStream.dispose();
          smoothCaret.teardown();
          docOf()?.documentElement?.removeAttribute?.('data-ag-cs-win-blur');
          removeOpticsPortalLayer();
        } catch {}
        if (activeInstance === controller) activeInstance = null;
      },
    };

    activeInstance = controller;
    return controller;
  }

  return Object.freeze({
    PORTAL_ID,
    init,
    getInstance: () => activeInstance,
    motion: motionEngine,
    crystal: crystalCore,
    ripple: rippleCore,
    CONV_AURA_HEIGHT_RATIO,
    CONV_AURA_IDLE_SLEEP_MS,
    STREAM_FADE_MS,
    HIGHLIGHT_NAMES,
    snapDevicePx,
    computeConvAuraOptics,
    createPrismRimCanvasController,
    createConvAuraController,
    createInkStreamController,
    createSmoothCaretController,
  });
});
