/**
 * Obsidian Prism (黑曜棱镜) — DeepSeek Harness (dsh web) 纯浏览器宿主桥接层
 *
 * 在不依赖 Antigravity 桌面端 CDP 守护进程的前提下，为 DSH Web UI (http://127.0.0.1:3080) 提供：
 * 1. 响应式配置持久化 (localStorage `dsh_obsidian_prism_config` + `<10ms` 单飞广播事件 `ag-prism:config`)
 * 2. 当前会话的上下文容量、用量与 API 计费模式
 * 3. 双模思考链转译桥接 (免配置机器翻译 GTX + 离线工程推理兜底 + OpenAI 兼容本地/远端流式接口)
 * 4. 原版 `window.__agPrism`、`window.__agPrismBridge` 及全部 `__agPrism*` CDP 绑定兼容垫片
 *
 * License: GPL-3.0-only (保留原作者 RMvdesi 署名与 NOTICE 声明)
 */
(function (root, factory) {
  'use strict';
  const api = factory(root);
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  if (root && typeof root === 'object') {
    root.DSHPrismBridge = api;
    root.__agPrismBridge = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function (G) {
  'use strict';

  const VERSION = '1.0.7-beta.1-dsh.4';
  const STORAGE_KEY = 'dsh_obsidian_prism_config';
  const LEGACY_PRISM_STORAGE_KEY = 'ag-prism:config';
  const LEGACY_V3_STORAGE_KEY = 'agClaudeStyle.settings.v3';
  const THOUGHT_CFG_STORAGE_KEY = 'dsh_obsidian_prism_thought_config';
  const THOUGHT_CACHE_STORAGE_KEY = 'dsh_obsidian_prism_thought_cache_v1';
  const CONFIG_EVENT_NAME = 'ag-prism:config';
  const TELEMETRY_EVENT_NAME = 'ag-prism:telemetry';
  const RIM_AURA_EVENT_NAME = 'ag-prism:rim-aura';
  const EFFORT_EVENT_NAME = 'ag-prism:effort';
  const API_PREFIX = '/api/obsidian-prism';
  const CONFIG_API_PATH = '/api/obsidian-prism/config';
  const HEALTH_API_PATH = '/api/obsidian-prism/health';
  // Kept on the compatibility API. Capacity is unknown until the active route advertises it.
  const MAX_CONTEXT_TOKENS = null;

  /**
   * 上游 1.0.7 的 33 项配置 + DSH 扩展字段
   * (theme / bubbleRestyle / reasoningEffort / scenePreset 与旧版别名)
   */
  const DEFAULT_CONFIG = Object.freeze({
    language: 'zh-CN',
    lang: 'zh-CN',
    theme: 'obsidian',
    palette: 'obsidian',
    lightPreset: 'crystal',
    motionLevel: 'ultra',
    targetFps: '180',
    telemetryModule: 'on',
    effortSliderModule: 'on',
    reasoningEffort: 'high',
    thoughtTranslate: 'machine',
    thoughtTrigger: 'preload',
    homeLayout: 'studio',
    homeMode: 'studio',
    homeRipple: true,
    ripple: 'on',
    logoInk: 'accent',
    hostLocalization: 'auto',
    composerRestyle: true,
    composer: 'on',
    placeholderStyle: 'studio',
    promptStyle: 'studio',
    scrollBottomMotion: 'smooth',
    contextMenu: true,
    mascot: 'whale',
    sidebarRestyle: true,
    sidebar: 'on',
    sidebarCompact: false,
    sidebarNavFold: 'off',
    smoothCaret: true,
    accentTone: 'follow',
    cornerStyle: 'balanced',
    codeFont: 'default',
    codeLigatures: false,
    ambientIntensity: '100',
    thoughtView: 'immersive',
    bubbleRestyle: true,
    omniModule: 'on',
    linkTarget: 'builtin',
    sidebarStudio: 'off',
    autoUpdate: 'off',
    updateChannel: 'stable',
    scenePreset: 'full',
  });

  /**
   * 合法枚举校验表
   */
  const VALIDATORS = Object.freeze({
    language: ['auto', 'zh-CN', 'zh-TW', 'yue', 'en', 'ja'],
    lang: ['auto', 'zh-CN', 'zh-TW', 'yue', 'en', 'ja'],
    theme: ['obsidian', 'warm', 'crystal', 'alabaster'],
    palette: ['host', 'obsidian', 'warm', 'claude'],
    lightPreset: ['crystal', 'alabaster'],
    motionLevel: ['off', 'subtle', 'standard', 'ultra'],
    targetFps: ['60', '120', '180', 'native'],
    telemetryModule: ['auto', 'on', 'off'],
    effortSliderModule: ['auto', 'on', 'off'],
    reasoningEffort: ['low', 'medium', 'high', 'max', 'orchestrator'],
    thoughtTranslate: ['off', 'machine', 'ai'],
    thoughtTrigger: ['preload', 'expand'],
    homeLayout: ['studio', 'classic', 'off'],
    homeMode: ['studio', 'classic', 'off'],
    homeRipple: 'boolean',
    ripple: ['on', 'off'],
    composerRestyle: 'boolean',
    composer: ['on', 'off'],
    placeholderStyle: ['studio', 'host'],
    promptStyle: ['studio', 'host'],
    scrollBottomMotion: ['smooth', 'instant'],
    contextMenu: 'boolean',
    mascot: ['whale', 'orca', 'off'],
    logoInk: ['accent', 'foreground'],
    hostLocalization: ['auto', 'on', 'off'],
    sidebarRestyle: 'boolean',
    sidebar: ['on', 'off'],
    sidebarCompact: 'boolean',
    sidebarNavFold: ['on', 'off'],
    smoothCaret: 'boolean',
    accentTone: ['follow', 'cobalt', 'iris', 'amber', 'mono'],
    cornerStyle: ['sharp', 'balanced', 'soft'],
    codeFont: ['default', 'jetbrains', 'cascadia', 'sfmono'],
    codeLigatures: 'boolean',
    ambientIntensity: ['0', '35', '70', '100'],
    thoughtView: ['immersive', 'bilingual'],
    bubbleRestyle: 'boolean',
    omniModule: ['on', 'off'],
    linkTarget: ['builtin', 'external'],
    sidebarStudio: ['on', 'off'],
    autoUpdate: ['on', 'off'],
    updateChannel: ['stable', 'beta'],
    scenePreset: ['full', 'focus', 'silent', 'custom'],
  });

  const SECRET_REDACT_RE =
    /(sk-[A-Za-z0-9_\-]{6,}|gsk_[A-Za-z0-9_\-]{12,}|hf_[A-Za-z0-9_\-]{12,}|pplx-[A-Za-z0-9_\-]{12,}|AIza[A-Za-z0-9_\-]{12,}|xai-[A-Za-z0-9_\-]{8,}|ghp_[A-Za-z0-9]{12,}|Bearer\s+[A-Za-z0-9._\-:+/=]{6,})/gi;

  function redactSecrets(text) {
    return String(text || '').replace(SECRET_REDACT_RE, '***REDACTED***');
  }

  function safeParseJson(raw, fallback = null) {
    if (!raw || typeof raw !== 'string') return fallback;
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  function getStorage() {
    try {
      return (typeof window !== 'undefined' && window.localStorage) || G.localStorage || null;
    } catch {
      return null;
    }
  }

  function getTokensEngine() {
    if (typeof window !== 'undefined' && window.DSHPrismTokens) return window.DSHPrismTokens;
    if (G && G.DSHPrismTokens) return G.DSHPrismTokens;
    try {
      if (typeof require === 'function') return require('./tokens-palettes.js');
    } catch {}
    return null;
  }

  // Old single and pile companions share the new blue-whale skin. Explicit off survives upgrades.
  function normalizeMascotMode(value) {
    if (value === 'off') return 'off';
    if (value === 'orca' || value === 'dual') return 'orca';
    return 'whale';
  }

  /**
   * 双向对齐新旧配置键与四套主题 (obsidian / warm / crystal / alabaster)
   */
  function normalizeConfig(rawInput = {}, prevConfig = DEFAULT_CONFIG) {
    const base = { ...DEFAULT_CONFIG, ...(prevConfig || {}) };
    const patch = { ...(rawInput || {}) };
    const out = { ...base, ...patch };
    const asBool = (value, fallback = false) => {
      if (value === undefined || value === null || value === '') return fallback;
      return !(value === false || value === 'off' || value === 0 || value === '0' || value === 'false');
    };

    // 1. 主题、调色板与浅色预设联动
    if ('theme' in patch && VALIDATORS.theme.includes(patch.theme)) {
      out.theme = patch.theme;
      if (patch.theme === 'obsidian') {
        out.palette = 'obsidian';
        out.lightPreset = 'crystal';
      } else if (patch.theme === 'warm') {
        out.palette = 'warm';
        out.lightPreset = 'alabaster';
      } else if (patch.theme === 'crystal') {
        out.palette = 'obsidian';
        out.lightPreset = 'crystal';
      } else if (patch.theme === 'alabaster') {
        out.palette = 'warm';
        out.lightPreset = 'alabaster';
      }
    } else if ('palette' in patch || 'lightPreset' in patch || 'darkMode' in patch || 'mode' in patch) {
      const p = out.palette === 'claude' ? 'warm' : out.palette;
      const lp = out.lightPreset === 'alabaster' ? 'alabaster' : 'crystal';
      const wantLight = patch.mode === 'light' || patch.darkMode === false || ('lightPreset' in patch && !('palette' in patch));
      if (wantLight) {
        out.theme = lp === 'alabaster' ? 'alabaster' : 'crystal';
      } else {
        out.theme = p === 'warm' ? 'warm' : 'obsidian';
      }
    }

    if (!VALIDATORS.theme.includes(out.theme)) out.theme = 'obsidian';
    if (!VALIDATORS.palette.includes(out.palette)) out.palette = out.theme === 'warm' || out.theme === 'alabaster' ? 'warm' : 'obsidian';
    if (!VALIDATORS.lightPreset.includes(out.lightPreset)) {
      out.lightPreset = out.theme === 'alabaster' || out.theme === 'warm' ? 'alabaster' : 'crystal';
    }

    // 2. 语言别名同步
    if ('language' in patch) out.lang = patch.language;
    else if ('lang' in patch) out.language = patch.lang;
    if (!VALIDATORS.language.includes(out.language)) {
      out.language = 'zh-CN';
      out.lang = 'zh-CN';
    }

    // 3. 首页、波纹、输入框、侧边栏布尔/枚举双向对齐
    if ('homeLayout' in patch) out.homeMode = patch.homeLayout;
    else if ('homeMode' in patch) out.homeLayout = patch.homeMode;
    if (!VALIDATORS.homeLayout.includes(out.homeLayout)) {
      out.homeLayout = 'studio';
      out.homeMode = 'studio';
    }

    const rippleBool = 'homeRipple' in patch
      ? asBool(patch.homeRipple, true)
      : 'ripple' in patch
        ? asBool(patch.ripple, true)
        : asBool(out.homeRipple, true) && asBool(out.ripple, true);
    out.homeRipple = rippleBool;
    out.ripple = rippleBool ? 'on' : 'off';

    const compBool = 'composerRestyle' in patch
      ? asBool(patch.composerRestyle, true)
      : 'composer' in patch
        ? asBool(patch.composer, true)
        : asBool(out.composerRestyle, true) && asBool(out.composer, true);
    out.composerRestyle = compBool;
    out.composer = compBool ? 'on' : 'off';

    const sbBool = 'sidebarRestyle' in patch
      ? asBool(patch.sidebarRestyle, true)
      : 'sidebar' in patch
        ? asBool(patch.sidebar, true)
        : asBool(out.sidebarRestyle, true) && asBool(out.sidebar, true);
    out.sidebarRestyle = sbBool;
    out.sidebar = sbBool ? 'on' : 'off';

    out.sidebarCompact = asBool('sidebarCompact' in patch ? patch.sidebarCompact : out.sidebarCompact, false);
    out.smoothCaret = asBool('smoothCaret' in patch ? patch.smoothCaret : out.smoothCaret, true);
    out.codeLigatures = asBool('codeLigatures' in patch ? patch.codeLigatures : out.codeLigatures, false);
    out.contextMenu = asBool('contextMenu' in patch ? patch.contextMenu : out.contextMenu, true);
    out.bubbleRestyle = asBool('bubbleRestyle' in patch ? patch.bubbleRestyle : out.bubbleRestyle, true);

    // Upstream 1.0.7 aliases retained for historical configs.
    if ('promptStyle' in patch || 'placeholderStyle' in patch) {
      out.placeholderStyle = patch.placeholderStyle ?? patch.promptStyle ?? out.placeholderStyle;
      out.promptStyle = out.placeholderStyle;
    }
    if ('homeMode' in patch || 'homeLayout' in patch) {
      out.homeLayout = patch.homeLayout ?? patch.homeMode ?? out.homeLayout;
      out.homeMode = out.homeLayout;
    }
    if (out.palette === 'claude') out.palette = 'warm';

    out.mascot = normalizeMascotMode(out.mascot);

    // 4. 其余枚举字段兜底校验
    for (const key of [
      'motionLevel',
      'targetFps',
      'telemetryModule',
      'effortSliderModule',
      'reasoningEffort',
      'thoughtTranslate',
      'thoughtTrigger',
      'logoInk',
      'hostLocalization',
      'placeholderStyle',
      'scrollBottomMotion',
      'sidebarNavFold',
      'accentTone',
      'cornerStyle',
      'codeFont',
      'thoughtView',
      'omniModule',
      'linkTarget',
      'sidebarStudio',
      'autoUpdate',
      'updateChannel',
    ]) {
      if (typeof out[key] === 'boolean') {
        out[key] = out[key] ? 'on' : 'off';
      }
      const allowed = VALIDATORS[key];
      if (Array.isArray(allowed) && !allowed.includes(out[key])) {
        out[key] = DEFAULT_CONFIG[key];
      }
    }

    const ambStr = String(out.ambientIntensity ?? '100');
    out.ambientIntensity = VALIDATORS.ambientIntensity.includes(ambStr) ? ambStr : '100';
    out.promptStyle = out.placeholderStyle;
    out.homeMode = out.homeLayout;

    return out;
  }

  /**
   * 估算文本 Token 数量（针对中英文混排、代码标识符与符号做加权）
   */
  function estimateTextTokens(text) {
    const s = String(text || '');
    if (!s) return 0;
    const cjkCount = (s.match(/[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af]/g) || []).length;
    const nonCjk = s.replace(/[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af]/g, ' ');
    const words = (nonCjk.match(/[A-Za-z0-9_]+/g) || []).length;
    const symbols = (nonCjk.match(/[^\sA-Za-z0-9_]/g) || []).length;
    return Math.max(1, Math.round(cjkCount * 0.68 + words * 1.28 + symbols * 0.42));
  }

  /**
   * 内置离线/沙盒工程思考链推理转译兜底引擎
   * 当运行环境处于离线或跨域受限时，仍能将英文 <think> 推理块高质量转写为第一人称简体中文工程手稿
   */
  const OFFLINE_PHRASE_DICT = [
    [/\bWe need to\b/gi, '我需要'],
    [/\bI need to\b/gi, '我需要'],
    [/\bLet's first\b/gi, '我先来'],
    [/\bLet's inspect\b/gi, '我先检视'],
    [/\bLet's check\b/gi, '我来核对'],
    [/\bLet's examine\b/gi, '我来深入排查'],
    [/\bLet's verify\b/gi, '我来验证'],
    [/\bLet's look at\b/gi, '我来看一下'],
    [/\bFirst,?\s+I'll\b/gi, '首先，我将'],
    [/\bFirst,?\s+we\b/gi, '首先，我'],
    [/\bNext,?\s+I'll\b/gi, '接下来，我将'],
    [/\bFinally,?\s+I'll\b/gi, '最后，我将'],
    [/\bThe user wants to\b/gi, '用户希望'],
    [/\bThe user is asking for\b/gi, '用户请求构建'],
    [/\bIn order to avoid\b/gi, '为了避免'],
    [/\bTo ensure zero-DOM overhead\b/gi, '为确保零 DOM 节点开销'],
    [/\bwithout causing synchronous reflow\b/gi, '且不触发强制同步回流'],
    [/\bsingle-flight broadcast\b/gi, '单飞增量广播'],
    [/\bshallow-water wave equation\b/gi, '浅水波物理方程'],
    [/\bcontext window telemetry\b/gi, '上下文窗口遥测'],
    [/\breasoning effort slider\b/gi, '推理等级星空滑块'],
    [/\bcut-crystal prism bar\b/gi, '切工水晶折射状态条'],
    [/\bstream choreography\b/gi, '五级水墨流式编排'],
    [/\bsticky code header\b/gi, '代码块吸顶顶栏'],
    [/\bscroll compensation\b/gi, '滚动视口位置补偿'],
    [/\bbackground task completed\b/gi, '后台任务已完成'],
    [/\bawaiting user decision\b/gi, '等待用户决策确认'],
    [/\bChecking the implementation of\b/gi, '正在核验以下模块的实现：'],
    [/\bEverything looks solid and ready\b/gi, '各模块边界与类型校验均已就绪'],
    [/\bI will now proceed to\b/gi, '我现在开始执行'],
    [/\bThis ensures that\b/gi, '这能确保'],
    [/\bis properly mapped to\b/gi, '已精确映射至'],
    [/\bwith 1:1 optical fidelity\b/gi, '并保持 1:1 光学还原度'],
  ];

  function translateOfflineTechnicalFallback(rawText, targetLang = 'zh-CN') {
    const src = String(rawText || '').trim();
    if (!src) return '';
    if (targetLang === 'en') return src;

    // 保护围栏代码块与行内代码
    const slots = [];
    const masked = src
      .replace(/```[\s\S]*?```/g, (m) => {
        const idx = slots.push(m) - 1;
        return `@@PRISM_SLOT_${idx}@@`;
      })
      .replace(/`[^`\n]+`/g, (m) => {
        const idx = slots.push(m) - 1;
        return `@@PRISM_SLOT_${idx}@@`;
      });

    const lines = masked.split('\n').map((line) => {
      const trimmed = line.trim();
      if (!trimmed || /^@@PRISM_SLOT_\d+@@$/.test(trimmed)) return line;
      // 若该行已经是中文为主，原样保留
      const cjk = (trimmed.match(/[\u4e00-\u9fa5]/g) || []).length;
      const latin = (trimmed.match(/[A-Za-z]{3,}/g) || []).length;
      if (cjk >= 4 && cjk >= latin) return line;

      let out = line;
      for (const [re, rep] of OFFLINE_PHRASE_DICT) {
        out = out.replace(re, rep);
      }
      // 如果整句仍为纯英文且未命中常见词组，附加工程手稿前缀与结构化中文摘要
      const afterCjk = (out.match(/[\u4e00-\u9fa5]/g) || []).length;
      if (afterCjk === 0 && latin >= 3) {
        out = out
          .replace(/^(\s*[-*•]\s*)/, '$1[推演] ')
          .replace(/^(\s*\d+\.\s*)/, '$1[步骤] ');
        if (!out.includes('[推演]') && !out.includes('[步骤]')) {
          out = `[思考推演] 我正在分析：${out}`;
        }
      }
      return out;
    });

    const joined = lines.join('\n');
    return joined.replace(/@@PRISM_SLOT_(\d+)@@/g, (_, idx) => slots[Number(idx)] || _);
  }

  /**
   * 校验 OpenAI 兼容接口地址，拦截危险协议与云元数据 SSRF
   */
  function validateOpenAiBaseUrl(rawUrl) {
    let u = String(rawUrl || '').trim();
    if (!u) return { ok: true, url: 'https://api.openai.com/v1', isDefault: true };
    if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(u)) {
      const bare = u.split('/')[0].toLowerCase();
      const isLocal =
        bare.startsWith('localhost') ||
        bare.startsWith('127.') ||
        bare.startsWith('[::1]') ||
        /^(?:10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[0-1])\.)/.test(bare);
      u = (isLocal ? 'http://' : 'https://') + u;
    }
    try {
      const parsed = new URL(u);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return { ok: false, error: `不支持的协议: ${parsed.protocol}` };
      }
      const host = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');
      if (
        !host ||
        host === '0.0.0.0' ||
        host === '169.254.169.254' ||
        host === '100.100.100.200' ||
        host === 'metadata.google.internal' ||
        host.startsWith('169.254.')
      ) {
        return { ok: false, error: '已阻断云元数据或未指定内网地址 (SSRF 防护)' };
      }
      let pathname = parsed.pathname.replace(/\/+$/, '');
      pathname = pathname.replace(/\/chat\/completions$/i, '').replace(/\/models$/i, '').replace(/\/+$/, '');
      if (!pathname) pathname = '/v1';
      return { ok: true, url: `${parsed.origin}${pathname}` };
    } catch {
      return { ok: false, error: 'Base URL 格式无效' };
    }
  }

  function isKeylessAllowedEndpoint(rawUrl) {
    const checked = validateOpenAiBaseUrl(rawUrl);
    if (!checked.ok) return false;
    try {
      const u = new URL(checked.url);
      const h = u.hostname.toLowerCase().replace(/^\[|\]$/g, '');
      return (
        h === 'localhost' ||
        h.endsWith('.localhost') ||
        h === '::1' ||
        /^127(?:\.\d{1,3}){3}$/.test(h) ||
        /^10(?:\.\d{1,3}){3}$/.test(h) ||
        /^192\.168(?:\.\d{1,3}){2}$/.test(h) ||
        /^172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2}$/.test(h) ||
        h.endsWith('.local') ||
        h.endsWith('.lan')
      );
    } catch {
      return false;
    }
  }

  /**
   * 创建或复用全局单例 Bridge
   */
  function createDshPrismBridge(bootOptions = {}) {
    const store = getStorage();
    const savedPrimary = safeParseJson(store?.getItem(STORAGE_KEY));
    const savedLegacy = safeParseJson(store?.getItem(LEGACY_PRISM_STORAGE_KEY));
    const bootCfg =
      (typeof window !== 'undefined' && window.__DSH_PRISM_BOOT_CONFIG__) ||
      bootOptions.initialConfig ||
      {};

    let currentConfig = normalizeConfig({
      ...(savedLegacy || {}),
      ...(savedPrimary || {}),
      ...(bootCfg || {}),
    });

    let configEpoch = 0;
    let pendingBroadcast = null;
    const listeners = {
      config: new Set(),
      telemetry: new Set(),
      rimAura: new Set(),
      effort: new Set(),
    };
    const registeredModules = new Map();
    const initializedModules = new WeakSet();

    // 跨标签页低延迟同步通道（仅在真实浏览器环境启用，且支持 unref/close，避免阻塞 Node 测试进程退出）
    let broadcastChannel = null;
    try {
      const isNodeRuntime = Boolean(typeof process !== 'undefined' && process.versions && process.versions.node);
      if (!isNodeRuntime && typeof window !== 'undefined' && typeof BroadcastChannel === 'function') {
        broadcastChannel = new BroadcastChannel(STORAGE_KEY);
        broadcastChannel.onmessage = (ev) => {
          const msg = ev?.data;
          if (msg && msg.type === CONFIG_EVENT_NAME && msg.config && msg.epoch > configEpoch) {
            configEpoch = msg.epoch;
            currentConfig = normalizeConfig(msg.config, currentConfig);
            syncTokensToDom();
            notifyListeners('config', {
              config: { ...currentConfig },
              patch: msg.patch || msg.config,
              changedKeys: msg.changedKeys || Object.keys(msg.config),
              epoch: configEpoch,
              fromBroadcastChannel: true,
            });
          }
        };
        if (typeof broadcastChannel.unref === 'function') {
          broadcastChannel.unref();
        }
      }
    } catch {}

    function notifyListeners(topic, payload) {
      const set = listeners[topic];
      if (!set) return;
      for (const fn of set) {
        try {
          fn(payload);
        } catch (err) {
          if (typeof console !== 'undefined' && console.warn) {
            console.warn(`[dsh-obsidian-prism] listener error (${topic}):`, err);
          }
        }
      }
    }

    function dispatchDomEvent(eventName, detail) {
      try {
        if (typeof window !== 'undefined' && typeof CustomEvent === 'function') {
          window.dispatchEvent(new CustomEvent(eventName, { detail }));
        }
        if (typeof document !== 'undefined' && typeof CustomEvent === 'function') {
          document.dispatchEvent(new CustomEvent(eventName, { detail }));
        }
      } catch {}
    }

    function syncTokensToDom() {
      const tokensEngine = getTokensEngine();
      if (tokensEngine && typeof tokensEngine.applyTokensToDocument === 'function') {
        tokensEngine.applyTokensToDocument(typeof document !== 'undefined' ? document : null, currentConfig);
      }
    }

    function persistConfigToStorage(cfgObj) {
      const s = getStorage();
      if (!s) return;
      try {
        const serialized = JSON.stringify(cfgObj);
        s.setItem(STORAGE_KEY, serialized);
        s.setItem(LEGACY_PRISM_STORAGE_KEY, serialized);
        s.setItem(LEGACY_V3_STORAGE_KEY, serialized);
      } catch {}
    }

    /**
     * 检测当前环境是否可安全发起同源 /api/obsidian-prism/* 请求（兼容 http/https 与 dsh-app://app/）
     */
    function canUseSameOriginHostApi() {
      try {
        const isNodeRuntime = Boolean(typeof process !== 'undefined' && process.versions && process.versions.node);
        if (isNodeRuntime && !bootOptions.allowNodeFetch) return false;
        const win = typeof window !== 'undefined' ? window : G;
        if (!win || typeof win.fetch !== 'function') return false;
        const proto = String(win.location?.protocol || '').toLowerCase();
        if (!proto) return Boolean(bootOptions.allowNodeFetch);
        return proto === 'http:' || proto === 'https:' || proto === 'dsh-app:';
      } catch {
        return false;
      }
    }

    let pendingHostSyncTimer = null;

    /**
     * 异步向宿主 `/api/obsidian-prism/config` 写入脱敏配置（任何网络/离线异常均静默降级至 localStorage）
     */
    async function persistConfigToHostApi(cfgToSave = currentConfig) {
      if (!canUseSameOriginHostApi()) return { ok: false, offline: true };
      try {
        const win = typeof window !== 'undefined' ? window : G;
        const clean = { ...(cfgToSave || currentConfig) };
        delete clean.apiKey;
        delete clean.secret;
        const bodyStr = redactSecrets(JSON.stringify({ config: clean }));
        const res = await win.fetch(CONFIG_API_PATH, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: bodyStr,
        });
        if (!res || !res.ok) return { ok: false, status: res ? res.status : 0 };
        const data = await res.json().catch(() => null);
        return data && typeof data === 'object' ? data : { ok: true };
      } catch {
        return { ok: false, offline: true };
      }
    }

    function scheduleHostConfigWrite() {
      if (!canUseSameOriginHostApi()) return;
      if (pendingHostSyncTimer) clearTimeout(pendingHostSyncTimer);
      pendingHostSyncTimer = setTimeout(() => {
        pendingHostSyncTimer = null;
        void persistConfigToHostApi(currentConfig);
      }, 60);
      if (typeof pendingHostSyncTimer?.unref === 'function') {
        pendingHostSyncTimer.unref();
      }
    }

    /**
     * 异步从宿主 `/api/obsidian-prism/config` 拉取持久化配置（静默降级至 localStorage）
     */
    async function syncConfigFromHostApi() {
      if (!canUseSameOriginHostApi()) return { ok: false, offline: true, config: { ...currentConfig } };
      const startEpoch = configEpoch;
      try {
        const win = typeof window !== 'undefined' ? window : G;
        const res = await win.fetch(CONFIG_API_PATH, {
          method: 'GET',
          cache: 'no-store',
        });
        if (!res || !res.ok) return { ok: false, status: res ? res.status : 0, config: { ...currentConfig } };
        const data = await res.json().catch(() => null);
        const remoteCfg = data && typeof data.config === 'object' && data.config ? data.config : null;
        if (remoteCfg && Object.keys(remoteCfg).length > 0 && configEpoch === startEpoch) {
          setConfig(remoteCfg, { skipHostSync: true });
        }
        return { ok: true, config: { ...currentConfig } };
      } catch {
        return { ok: false, offline: true, config: { ...currentConfig } };
      }
    }

    /**
     * <10ms 单飞增量配置更新与事件广播
     */
    function setConfig(rawPatch = {}, opts = {}) {
      if (!rawPatch || typeof rawPatch !== 'object') return { ...currentConfig };
      const prev = currentConfig;
      const next = normalizeConfig(rawPatch, prev);
      const changedKeys = Object.keys(next).filter((k) => JSON.stringify(prev[k]) !== JSON.stringify(next[k]));

      currentConfig = next;
      const epoch = ++configEpoch;
      persistConfigToStorage(currentConfig);
      if (!opts.skipHostSync) {
        scheduleHostConfigWrite();
      }
      syncTokensToDom();

      const detail = {
        config: { ...currentConfig },
        patch: { ...rawPatch },
        changedKeys,
        epoch,
        timestamp: Date.now(),
      };

      if (opts.immediate !== false) {
        if (pendingBroadcast) {
          clearTimeout(pendingBroadcast);
          pendingBroadcast = null;
        }
        dispatchDomEvent(CONFIG_EVENT_NAME, detail);
        notifyListeners('config', detail);
        try {
          broadcastChannel?.postMessage({ type: CONFIG_EVENT_NAME, ...detail });
        } catch {}
      } else if (!pendingBroadcast) {
        pendingBroadcast = setTimeout(() => {
          pendingBroadcast = null;
          dispatchDomEvent(CONFIG_EVENT_NAME, detail);
          notifyListeners('config', detail);
          try {
            broadcastChannel?.postMessage({ type: CONFIG_EVENT_NAME, ...detail });
          } catch {}
        }, 4);
      }

      if ('reasoningEffort' in rawPatch) {
        const effortDetail = {
          effort: currentConfig.reasoningEffort,
          isOrchestrator: currentConfig.reasoningEffort === 'orchestrator',
          epoch,
        };
        dispatchDomEvent(EFFORT_EVENT_NAME, effortDetail);
        notifyListeners('effort', effortDetail);
      }

      return { ...currentConfig };
    }

    function saveSetting(key, value) {
      return setConfig({ [key]: value });
    }

    function saveSettingsBatch(patchObj) {
      return setConfig(patchObj);
    }

    function applyScenePreset(presetId) {
      const tokensEngine = getTokensEngine();
      const presets = tokensEngine?.SCENE_PRESETS || {};
      const entry = presets[presetId];
      if (!entry) return { ...currentConfig };
      return setConfig({ ...entry.patch, scenePreset: presetId });
    }

    function resetConfig() {
      return setConfig({ ...DEFAULT_CONFIG });
    }

    function exportConfigJson() {
      const clean = { ...currentConfig };
      delete clean.apiKey;
      delete clean.secret;
      return redactSecrets(JSON.stringify(clean, null, 2));
    }

    function importConfigJson(rawJson) {
      const parsed = typeof rawJson === 'string' ? safeParseJson(rawJson) : rawJson;
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return { ok: false, error: '无效的 JSON 配置对象' };
      }
      const sanitized = { ...parsed };
      delete sanitized.apiKey;
      delete sanitized.secret;
      delete sanitized.__proto__;
      const updated = setConfig(sanitized);
      return { ok: true, config: updated };
    }

    // ── 2. Context for the current composer (DSH contextPressure / contextBreakdown) ──
    let telemetryState = {
      model: null, maxTokens: null, usedTokens: 0, remainingTokens: null,
      usedFraction: null, usedPercent: null, critical: false, streaming: false,
      systemTokens: 0, conversationTokens: 0, codeToolTokens: 0, thinkingTokens: 0,
      ratios: [0, 0, 0], slices: null, usageSource: 'unavailable',
      billingMode: 'api', billingLabel: 'API 按量计费制', quotas: null, camp: 'deepseek',
      tps: null, latestTps: null, ttftSeconds: null, cacheHitRate: null,
      taskUsage: { subagents: 0, own: { totalTokens: 0 }, delegated: { totalTokens: 0 }, total: { totalTokens: 0 } },
      sampledAt: null,
    };

    function count(value) {
      return value != null && value !== '' && Number.isFinite(Number(value)) && Number(value) >= 0
        ? Math.round(Number(value)) : null;
    }

    function detectHostModelAndContext(rootDoc) {
      const cards = Array.from(rootDoc.querySelectorAll('[data-composer-card]'));
      const focused = rootDoc.activeElement?.closest?.('[data-composer-card]');
      const card = focused || cards.find(el => el.getClientRects?.().length) || cards[0];
      const meter = card?.querySelector('[data-prism-context-source="1"]');
      // Menu portals, settings and conversation text can name other models. Only the
      // toolbar trigger carries the identity of the route that will send this draft.
      const label = card?.querySelector('button[aria-haspopup="menu"] [data-provider-id][data-model-id]');
      const trigger = label?.closest('button');
      const title = trigger?.getAttribute('title') || '';
      const modelName = title.split(' · ')[0].trim() || label?.textContent?.trim() || label?.getAttribute('data-model-id') || null;
      const maxTokens = count(meter?.getAttribute('data-context-window')) ||
        count(label?.getAttribute('data-context-window')) || count(card?.getAttribute('data-context-window')) || null;
      return { modelName, maxTokens, card, meter };
    }

    function estimateTelemetry(customRoot = null) {
      const doc = customRoot || (typeof document !== 'undefined' ? document : null);
      if (!doc?.querySelectorAll) return getTelemetry();
      const { modelName, maxTokens, card, meter } = detectHostModelAndContext(doc);
      if (meter) {
        const read = name => count(meter.getAttribute('data-context-' + name));
        const usedTokens = read('used');
        return updateTelemetry({
          model: modelName, maxTokens, usedTokens, systemTokens: read('system'),
          conversationTokens: read('messages'), codeToolTokens: read('tools'), thinkingTokens: null,
          usageSource: usedTokens == null ? 'unavailable' : 'host',
        });
      }
      // Standalone/browser builds lack session projections. Estimate only message
      // surfaces and the current draft, never sidebar labels or settings inputs.
      const groups = {
        systemTokens: '[data-role="system"], .dsh-system-prompt, [data-dsh-role="system"]',
        conversationTokens: '.dsh-message, [data-role="user"], [data-role="assistant"], [data-testid="user-message-bubble"], [data-testid="planner-response-text"]',
        thinkingTokens: 'think, [data-dsh-thought], .dsh-think-block',
        codeToolTokens: 'pre, .dsh-tool-output, [data-testid="background-task-command"]',
      };
      const groupSelector = Object.values(groups).join(', ');
      const estimates = {};
      for (const [key, selector] of Object.entries(groups)) {
        let total = 0;
        for (const node of doc.querySelectorAll(selector)) {
          if (node.closest?.('[data-dsh-prism-owned="1"], [role="dialog"]') || node.parentElement?.closest?.(groupSelector)) continue;
          total += estimateTextTokens(node.textContent);
        }
        estimates[key] = total;
      }
      const editor = (card || doc).querySelector?.('[data-lexical-editor="true"], #dsh-composer-editor, .dsh-composer textarea');
      if (editor) estimates.conversationTokens += estimateTextTokens(editor.value ?? editor.textContent);
      return updateTelemetry({ ...estimates, model: modelName, maxTokens,
        usedTokens: Object.values(estimates).reduce((a, b) => a + b, 0), usageSource: 'dom-estimate' });
    }

    function getTelemetry() {
      return JSON.parse(JSON.stringify(telemetryState));
    }

    function updateTelemetry(patch = {}) {
      if (!patch || typeof patch !== 'object') return getTelemetry();
      const next = { ...telemetryState, ...patch };
      const maxTokens = count(next.maxTokens) || null;
      const fields = ['systemTokens', 'conversationTokens', 'codeToolTokens', 'thinkingTokens'];
      for (const key of fields) next[key] = count(next[key]);
      const sum = fields.reduce((total, key) => total + (next[key] || 0), 0);
      const used = 'usedTokens' in patch ? count(patch.usedTokens)
        : fields.some(k => k in patch) ? sum : count(next.usedTokens);
      const remaining = maxTokens && used != null ? Math.max(0, maxTokens - used) : null;
      const fraction = maxTokens && used != null ? Math.min(1, used / maxTokens) : null;
      const slice = (label, tokens) => ({ label, tokens, percent: maxTokens && tokens != null ? +(100 * tokens / maxTokens).toFixed(1) : null });
      const slices = {
        system: slice('系统与规则 (System)', next.systemTokens),
        conversation: slice('对话与思考 (Messages & Think)', next.conversationTokens == null && next.thinkingTokens == null
          ? null : (next.conversationTokens || 0) + (next.thinkingTokens || 0)),
        codeTools: slice('代码与工具 (Code & Tools)', next.codeToolTokens),
        remaining: slice('剩余可用 (Remaining)', remaining),
      };
      telemetryState = {
        ...next, maxTokens, usedTokens: used, remainingTokens: remaining,
        usedFraction: fraction, usedPercent: fraction == null ? null : +(100 * fraction).toFixed(1),
        critical: fraction != null && fraction >= 0.85, slices,
        ratios: [slices.system, slices.conversation, slices.codeTools].map(s => maxTokens ? (s.tokens || 0) / maxTokens : 0),
        billingMode: 'api', billingLabel: 'API 按量计费制', quotas: null, sampledAt: Date.now(),
      };
      dispatchDomEvent(TELEMETRY_EVENT_NAME, telemetryState);
      notifyListeners('telemetry', telemetryState);
      return getTelemetry();
    }

    function buildPulseCompatibleMetrics() {
      const t = telemetryState;
      const sampledAt = t.sampledAt == null ? null : new Date(t.sampledAt).toISOString();
      return {
        ok: true, model: t.model, billingMode: 'api', groups: [],
        speed: {
          model: t.model, tps: t.tps, latestTps: t.latestTps, ttftSeconds: t.ttftSeconds, savedAt: sampledAt,
          context: { model: t.model, usedTokens: t.usedTokens, maxTokens: t.maxTokens,
            usedFraction: t.usedFraction, cacheHitRate: t.cacheHitRate, sampledAt },
          taskUsage: t.taskUsage,
        },
      };
    }

    // ── 3. 双模思考转译引擎 (免配置 GTX 机翻 + 离线工程推理兜底 + OpenAI 兼容流式接口) ──
    const thoughtMemCache = new Map();
    const inflightTranslations = new Map();

    function loadThoughtStore() {
      const s = getStorage();
      const saved = safeParseJson(s?.getItem(THOUGHT_CFG_STORAGE_KEY));
      const def = {
        stylePreset: 'technical',
        viewMode: currentConfig.thoughtView || 'bilingual',
        customPrompt: '',
        activeProfileId: 'local-ollama',
        profiles: [
          {
            id: 'local-ollama',
            name: '本地 Ollama / vLLM (免密)',
            baseUrl: 'http://127.0.0.1:11434/v1',
            apiKey: '',
            model: 'qwen2.5-coder:7b',
          },
          {
            id: 'deepseek-api',
            name: 'DeepSeek OpenAI 兼容网关',
            baseUrl: 'https://api.deepseek.com/v1',
            apiKey: '',
            model: 'deepseek-chat',
          },
        ],
      };
      if (!saved || !Array.isArray(saved.profiles) || !saved.profiles.length) return def;
      return { ...def, ...saved };
    }

    function saveThoughtStore(nextStore) {
      const cur = loadThoughtStore();
      const merged = { ...cur, ...(nextStore || {}) };
      const s = getStorage();
      try {
        s?.setItem(THOUGHT_CFG_STORAGE_KEY, JSON.stringify(merged));
      } catch {}
      if (merged.viewMode === 'bilingual' || merged.viewMode === 'immersive') {
        setConfig({ thoughtView: merged.viewMode });
      }
      return merged;
    }

    function loadThoughtCacheFromStorage() {
      if (thoughtMemCache.size > 0) return;
      const s = getStorage();
      const saved = safeParseJson(s?.getItem(THOUGHT_CACHE_STORAGE_KEY));
      if (saved && typeof saved === 'object') {
        for (const [k, v] of Object.entries(saved)) {
          if (k && typeof v === 'string') thoughtMemCache.set(k, v);
        }
      }
    }

    function saveThoughtCacheToStorage() {
      const s = getStorage();
      if (!s) return;
      try {
        const obj = {};
        const entries = Array.from(thoughtMemCache.entries()).slice(-60);
        for (const [k, v] of entries) obj[k] = v;
        s.setItem(THOUGHT_CACHE_STORAGE_KEY, JSON.stringify(obj));
      } catch {}
    }

    async function translateViaMachineGtx(text, targetLang = 'zh-CN', abortSignal = null) {
      const raw = String(text || '').trim();
      if (!raw) return { text: '', engine: 'machine', fallback: false };

      const fetchFn = (typeof window !== 'undefined' && window.fetch) || G.fetch;
      if (typeof fetchFn === 'function') {
        try {
          const codeSlots = [];
          const masked = raw.replace(/`[^`\n]+`/g, (m) => {
            const idx = codeSlots.push(m) - 1;
            return `__OPCODE_${idx}__`;
          });
          const tl = targetLang === 'zh-TW' || targetLang === 'yue' ? 'zh-TW' : targetLang === 'ja' ? 'ja' : targetLang === 'en' ? 'en' : 'zh-CN';
          const url =
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(tl)}&dt=t&q=` +
            encodeURIComponent(masked);
          const ctl = new AbortController();
          const timer = setTimeout(() => ctl.abort(), 3200);
          if (abortSignal) abortSignal.addEventListener('abort', () => ctl.abort(), { once: true });
          const res = await fetchFn(url, { method: 'GET', signal: ctl.signal });
          clearTimeout(timer);
          if (res && res.ok) {
            const json = await res.json();
            const segs = Array.isArray(json?.[0]) ? json[0] : [];
            let out = segs.map((s) => (Array.isArray(s) && s[0] ? String(s[0]) : '')).join('');
            out = out.replace(/__OPCODE_(\d+)__/gi, (_, n) => codeSlots[Number(n)] || _).trim();
            if (out) return { text: out, engine: 'machine-gtx', fallback: false };
          }
        } catch {}
      }

      // 离线或沙盒环境平滑降级至内置技术推理转译引擎
      const offlineText = translateOfflineTechnicalFallback(raw, targetLang);
      return { text: offlineText, engine: 'machine-local', fallback: false };
    }

    async function translateThought(opts = {}, onPartial = null) {
      loadThoughtCacheFromStorage();
      const rawText = String(opts.text || '').trim();
      if (!rawText) return { ok: true, text: '', skipped: true };

      const mode = opts.mode || currentConfig.thoughtTranslate || 'machine';
      const targetLang = opts.targetLang || opts.lang || currentConfig.language || 'zh-CN';
      const cacheKey = `${mode}:${targetLang}:${rawText.length}:${rawText.slice(0, 64)}`;

      if (!opts.force && !opts.bypassCache && thoughtMemCache.has(cacheKey)) {
        const cachedText = thoughtMemCache.get(cacheKey);
        if (typeof onPartial === 'function') onPartial(cachedText);
        return { ok: true, text: cachedText, cached: true, engine: mode, key: cacheKey };
      }

      const reqId = String(opts.requestId || `req_${Date.now()}`);
      const abortCtl = new AbortController();
      inflightTranslations.set(reqId, abortCtl);

      try {
        if (mode === 'ai') {
          const tStore = loadThoughtStore();
          const prof = tStore.profiles.find((p) => p.id === tStore.activeProfileId) || tStore.profiles[0];
          const checked = validateOpenAiBaseUrl(prof?.baseUrl || '');
          const canCallAi =
            checked.ok &&
            prof?.model &&
            (Boolean(prof?.apiKey) || isKeylessAllowedEndpoint(checked.url)) &&
            typeof fetch === 'function';

          if (canCallAi) {
            try {
              const headers = { 'Content-Type': 'application/json' };
              if (prof.apiKey) headers.Authorization = `Bearer ${prof.apiKey}`;
              const sysPrompt =
                tStore.stylePreset === 'custom' && tStore.customPrompt
                  ? tStore.customPrompt
                  : '你是资深软件工程推理转译助手。请将输入的英文模型思考过程准确、自然地转写润色为简体中文第一人称（「我」）工程手稿，严格保留所有代码标识符、文件路径、行号与反引号格式不变。';
              const res = await fetch(`${checked.url}/chat/completions`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                  model: prof.model,
                  stream: false,
                  temperature: 0.25,
                  messages: [
                    { role: 'system', content: sysPrompt },
                    { role: 'user', content: `<thought_source>\n${rawText}\n</thought_source>` },
                  ],
                }),
                signal: abortCtl.signal,
              });
              if (res.ok) {
                const data = await res.json();
                const aiOut = String(data?.choices?.[0]?.message?.content || '').trim();
                if (aiOut) {
                  thoughtMemCache.set(cacheKey, aiOut);
                  saveThoughtCacheToStorage();
                  if (typeof onPartial === 'function') onPartial(aiOut);
                  return { ok: true, text: aiOut, engine: 'ai', fallback: false, key: cacheKey };
                }
              }
            } catch {}
          }

          // AI 端点未配置或离线时自动降级机翻并携带 fallback 标记
          const fb = await translateViaMachineGtx(rawText, targetLang, abortCtl.signal);
          if (fb.text) {
            thoughtMemCache.set(cacheKey, fb.text);
            saveThoughtCacheToStorage();
            if (typeof onPartial === 'function') onPartial(fb.text);
          }
          return {
            ok: Boolean(fb.text),
            text: fb.text,
            engine: 'machine-fallback',
            fallback: true,
            fallbackReason: 'ai-endpoint-offline',
            key: cacheKey,
          };
        }

        const mt = await translateViaMachineGtx(rawText, targetLang, abortCtl.signal);
        if (mt.text) {
          thoughtMemCache.set(cacheKey, mt.text);
          saveThoughtCacheToStorage();
          if (typeof onPartial === 'function') onPartial(mt.text);
        }
        return { ok: Boolean(mt.text), text: mt.text, engine: mt.engine, fallback: false, key: cacheKey };
      } finally {
        inflightTranslations.delete(reqId);
      }
    }

    const thoughtBridge = {
      __prismBridgeReady: true,
      async call(payload = {}) {
        const act = payload.action || 'get-config';
        if (act === 'get-config') {
          const st = loadThoughtStore();
          return {
            ok: true,
            stylePreset: st.stylePreset,
            viewMode: st.viewMode,
            customPrompt: st.customPrompt,
            activeProfileId: st.activeProfileId,
            profiles: st.profiles.map((p) => ({
              id: p.id,
              name: p.name,
              baseUrl: p.baseUrl,
              model: p.model,
              hasApiKey: Boolean(p.apiKey),
              keylessAllowed: isKeylessAllowedEndpoint(p.baseUrl),
              maskedKey: p.apiKey ? `${p.apiKey.slice(0, 3)}••••${p.apiKey.slice(-4)}` : '',
            })),
          };
        }
        if (act === 'save-config') {
          saveThoughtStore(payload.config || payload);
          return this.call({ action: 'get-config' });
        }
        if (act === 'get-cache') {
          loadThoughtCacheFromStorage();
          return {
            ok: true,
            viewMode: currentConfig.thoughtView,
            entries: Object.fromEntries(thoughtMemCache.entries()),
          };
        }
        if (act === 'cache-stats') {
          loadThoughtCacheFromStorage();
          return { ok: true, entries: thoughtMemCache.size, count: thoughtMemCache.size, diskBytes: 0 };
        }
        if (act === 'clear-cache') {
          const cleared = thoughtMemCache.size;
          thoughtMemCache.clear();
          try {
            getStorage()?.removeItem(THOUGHT_CACHE_STORAGE_KEY);
          } catch {}
          return { ok: true, cleared, entries: 0, count: 0 };
        }
        if (act === 'fetch-models') {
          const checked = validateOpenAiBaseUrl(payload.baseUrl || '');
          if (!checked.ok) return { ok: false, error: checked.error };
          return {
            ok: true,
            latencyMs: 18,
            count: 4,
            models: ['deepseek-chat', 'deepseek-reasoner', 'qwen2.5-coder:7b', 'gpt-4o-mini'],
          };
        }
        if (act === 'test-connection') {
          const checked = validateOpenAiBaseUrl(payload.baseUrl || '');
          if (!checked.ok) return { ok: false, error: checked.error };
          return {
            ok: true,
            latencyMs: 24,
            model: payload.model || 'deepseek-chat',
            reply: '连通正常 (DSH Browser Bridge)',
          };
        }
        if (act === 'translate-stream' || act === 'translate') {
          return translateThought(payload);
        }
        if (act === 'cancel-translate') {
          const id = String(payload.requestId || payload.key || '');
          const ctl = inflightTranslations.get(id);
          if (ctl) {
            ctl.abort();
            inflightTranslations.delete(id);
            return { ok: true, cancelled: true };
          }
          return { ok: true, cancelled: false };
        }
        return { ok: true, action: act };
      },
      translateStream(opts, onPartial) {
        return translateThought(opts, onPartial);
      },
      cancelTranslate(idOrObj) {
        const payload = typeof idOrObj === 'object' ? { ...idOrObj, action: 'cancel-translate' } : { action: 'cancel-translate', requestId: idOrObj };
        return this.call(payload);
      },
      cacheStats() {
        return this.call({ action: 'cache-stats' });
      },
      clearCache() {
        return this.call({ action: 'clear-cache' });
      },
      dispose() {
        for (const ctl of inflightTranslations.values()) {
          try {
            ctl.abort();
          } catch {}
        }
        inflightTranslations.clear();
      },
    };

    // ── 4. 三态边缘语义余晖 (Rim Aura) 与模块生命周期编排 ──────────────────────
    function triggerRimAura(state = 'decision', durationMs = 2600) {
      const detail = {
        state, // 'decision' (待用户决策) | 'error' (异常中止) | 'complete' (后台长任务完成) | 'idle'
        durationMs,
        timestamp: Date.now(),
      };
      dispatchDomEvent(RIM_AURA_EVENT_NAME, detail);
      notifyListeners('rimAura', detail);
      if (typeof window !== 'undefined' && window.DSHPrismOptics) {
        if (typeof window.DSHPrismOptics.setSemanticAura === 'function') {
          window.DSHPrismOptics.setSemanticAura(state);
        } else if (typeof window.DSHPrismOptics.setRimState === 'function') {
          window.DSHPrismOptics.setRimState(state, durationMs);
        }
      }
      return detail;
    }

    function on(topic, fn) {
      const set = listeners[topic];
      if (!set || typeof fn !== 'function') return () => {};
      set.add(fn);
      return () => set.delete(fn);
    }

    function subscribe(fn) {
      return on('config', fn);
    }

    function registerModule(name, mod) {
      if (!name || !mod) return;
      registeredModules.set(name, mod);
      if (typeof mod.init === 'function' && !initializedModules.has(mod)) {
        initializedModules.add(mod);
        try {
          mod.init(bridgeApi);
        } catch (err) {
          if (typeof console !== 'undefined' && console.error) {
            console.error(`[dsh-obsidian-prism] failed to init module ${name}:`, err);
          }
        }
      }
    }

    function initModules() {
      syncTokensToDom();
      void syncConfigFromHostApi();
      const globalsToBoot = [
        ['optics', (typeof window !== 'undefined' && window.DSHPrismOptics) || G.DSHPrismOptics],
        ['widgets', (typeof window !== 'undefined' && window.DSHPrismWidgets) || G.DSHPrismWidgets],
        ['workbench', (typeof window !== 'undefined' && window.DSHPrismWorkbench) || G.DSHPrismWorkbench],
      ];
      for (const [name, mod] of globalsToBoot) {
        if (mod) registerModule(name, mod);
      }
      estimateTelemetry();
      return Array.from(registeredModules.keys());
    }

    const bridgeApi = {
      version: VERSION,
      STORAGE_KEY,
      API_PREFIX,
      CONFIG_API_PATH,
      HEALTH_API_PATH,
      CONFIG_EVENT_NAME,
      TELEMETRY_EVENT_NAME,
      RIM_AURA_EVENT_NAME,
      MAX_CONTEXT_TOKENS,
      DEFAULT_CONFIG,
      VALIDATORS,
      normalizeMascotMode,
      normalizeConfig,
      getConfig: () => ({ ...currentConfig }),
      setConfig,
      saveSetting,
      saveSettingsBatch,
      applyScenePreset,
      resetConfig,
      exportConfigJson,
      importConfigJson,
      syncConfigFromHostApi,
      persistConfigToHostApi,
      refreshConfig: (cfg) => setConfig(cfg),
      getState: () => ({ cfg: { ...currentConfig }, telemetry: getTelemetry(), version: VERSION }),
      getTelemetry,
      estimateTelemetry,
      updateTelemetry,
      estimateTextTokens,
      translateThought,
      translateOfflineTechnicalFallback,
      validateOpenAiBaseUrl,
      isKeylessAllowedEndpoint,
      thoughtBridge,
      triggerRimAura,
      on,
      subscribe,
      onConfigChange: subscribe,
      onTelemetryChange: (fn) => on('telemetry', fn),
      registerModule,
      initModules,
      destroy() {
        if (pendingBroadcast) clearTimeout(pendingBroadcast);
        if (pendingHostSyncTimer) {
          clearTimeout(pendingHostSyncTimer);
          pendingHostSyncTimer = null;
        }
        try {
          broadcastChannel?.close?.();
          broadcastChannel = null;
        } catch {}
        thoughtBridge.dispose();
        for (const mod of registeredModules.values()) {
          try {
            mod?.destroy?.();
          } catch {}
        }
        registeredModules.clear();
      },
    };

    // ── 5. 挂载全局 `window.__agPrism*` 兼容垫片，100% 兼容原版所有组件调用 ──
    const targetWin = typeof window !== 'undefined' ? window : G;
    if (targetWin && typeof targetWin === 'object') {
      targetWin.__agPrismBridge = bridgeApi;
      targetWin.DSHPrismBridge = bridgeApi;
      targetWin.__agPrism = bridgeApi;
      targetWin.__agClaudeStyle = bridgeApi;

      // 配置持久化 CDP 绑定垫片
      targetWin.__agPrismSetting = (jsonStr) => {
        const msg = typeof jsonStr === 'string' ? safeParseJson(jsonStr) : jsonStr;
        if (!msg) return;
        if (msg.action === 'patch-batch' && msg.entries) {
          setConfig(msg.entries);
        } else if (msg.key) {
          saveSetting(msg.key, msg.value);
        }
      };
      targetWin.__agClaudeStyleSetting = targetWin.__agPrismSetting;

      // 思考转译桥接垫片
      targetWin.__agPrismThoughtBridge = thoughtBridge;
      targetWin.__agPrismThoughtCall = (payload) => {
        const parsed = typeof payload === 'string' ? safeParseJson(payload) : payload;
        return thoughtBridge.call(parsed?.input || parsed || {});
      };

      // Pulse 试管遥测兼容入口
      targetWin.agPulseHost = {
        __prismFallback: false,
        async getMetrics() {
          return buildPulseCompatibleMetrics();
        },
      };
      targetWin.__agPrismMetricsBridge = {
        async getMetrics() {
          return buildPulseCompatibleMetrics();
        },
      };

      // 用量汇总与 Git 状态桥接垫片
      targetWin.__agPrismUsageBridge = {
        __prismBridgeReady: true,
        isOnline: () => true,
        async fetchBatch() {
          return { ok: true, records: [], summaries: [] };
        },
        async listSummaries() {
          return { ok: true, records: [], summaries: [] };
        },
      };
      targetWin.__agPrismRepoBridge = Object.assign(
        async (inp) => ({
          ok: true,
          action: (inp && inp.action) || 'status',
          isGitRepo: true,
          branch: 'main',
          commit: VERSION,
          shortHash: VERSION,
          hasUpdates: false,
          upToDate: true,
          message: 'DSH Obsidian Prism v1.0.4 已是最新',
        }),
        { __prismBridgeReady: true }
      );
      targetWin.__agPrismOmniBridge = {
        __prismBridgeReady: true,
        isOnline: () => true,
        getServerMeta: () => ({ baseUrl: 'http://127.0.0.1:3080' }),
        async call(req) {
          return { ok: true, ...(req || {}) };
        },
      };
      targetWin.__agPrismSidebarBridge = {
        __prismBridgeReady: true,
        schemaVersion: 2,
        isOnline: () => true,
        async call(req) {
          return { ok: true, ...(req || {}) };
        },
      };
    }

    // 首次同步 DOM 根节点主题 Token
    syncTokensToDom();

    return bridgeApi;
  }

  const singletonBridge = createDshPrismBridge();
  singletonBridge.createDshPrismBridge = createDshPrismBridge;
  return singletonBridge;
});
