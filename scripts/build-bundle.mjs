#!/usr/bin/env node
/**
 * Obsidian Prism for DeepSeek Harness (dsh) — 零依赖构建打包器
 * Copyright (C) 2026 RMvdesi (Upstream Obsidian Prism) & DSH Port Contributors
 * Licensed under GNU General Public License v3.0 (GPL-3.0-only)
 *
 * 功能：
 * 1. 按依赖顺序打包主题桥、光学引擎、原生图标、首页、微件与工作台模块，
 *    并附加幂等引导器 -> dist/dsh-prism.bundle.js
 * 2. 复制并附带开源许可头输出 src/prism-style.css -> dist/dsh-prism.css
 * 3. 生成同时兼容 Tampermonkey/Violentmonkey 与浏览器 DevTools 控制台直贴的注入脚本 -> dist/dsh-prism.userscript.js
 * 4. 编译生成符合真实 DeepSeek Harness Desktop (`__ModuleLoader__` + React + Cordis slots) 协议的客户端入口 -> lib/client.js
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_ROOT_DIR = path.resolve(__dirname, '..');

export const MODULE_ORDER = Object.freeze([
  'src/tokens-palettes.js',
  'src/dsh-bridge.js',
  'src/optics-motion.js',
  'src/deepseek-companions.js',
  'src/prism-native-icons.js',
  'src/responsive-workbench.js',
  'src/home-ripple-host.js',
  'src/home-studio-panel.js',
  'src/widgets-vial-mascot.js',
  'src/workbench-settings.js',
]);

export const STYLE_SOURCE_REL = 'src/prism-style.css';
export const STYLE_SOURCE_ORDER = Object.freeze([
  STYLE_SOURCE_REL,
  'src/deepseek-companions.css',
  'src/home-studio.css',
  'src/prism-native-icons.css',
  'src/responsive-workbench.css',
]);

const LICENSE_BANNER = [
  '/*!',
  ' * Obsidian Prism (黑曜棱镜) for DeepSeek Harness (dsh)',
  ' * Upstream Project: Obsidian Prism v1.0.7-beta.1 by RMvdesi (https://github.com/RMvdesi/obsidian-prism)',
  ' * License: GNU General Public License v3.0 (GPL-3.0-only)',
  ' * Downstream DSH Port Modified: 2026-11-22',
  ' */',
].join('\n');

/**
 * 计算 FNV-1a 32-bit 紧凑内容哈希，用于热重载与幂等防重入校验
 */
export function computeHash(input) {
  const str = String(input || '');
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

/**
 * 格式化字节大小用于终端输出
 */
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(2)} KB`;
}

/**
 * 包装单个浏览器模块：隔离词法作用域，并强制 UMD 模块走浏览器 globalThis/window 分支
 */
function wrapBrowserModule(relPath, rawCode, index, total) {
  const cleaned = String(rawCode || '').replace(/^\uFEFF/, '');
  return [
    `// === [${index + 1}/${total}] ${relPath} ===`,
    ';(function (root, window, self, document, module, exports) {',
    cleaned,
    '}).call(',
    '  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,',
    '  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : {},',
    '  typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : undefined),',
    '  typeof self !== "undefined" ? self : (typeof window !== "undefined" ? window : undefined),',
    '  typeof document !== "undefined" ? document : undefined,',
    '  undefined,',
    '  undefined',
    ');',
  ].join('\n');
}

/**
 * 生成附加到 dist/dsh-prism.bundle.js 与 lib/client.js 的统一引导器
 */
function createBootstrapBlock(version, codeHash) {
  return `
// === [Bootstrap] Obsidian Prism DSH Runtime Initializer ===
;(function (G) {
  'use strict';
  if (!G) return;

  var VERSION = ${JSON.stringify(version)};
  var CODE_HASH = ${JSON.stringify(codeHash)};
  var ACTIVE_INST = null;
  var BOOT_SCHEDULED = false;

  function resolveBridge(opts) {
    var bridge = G.__agPrismBridge || G.DSHPrismBridge || null;
    if (bridge && typeof bridge.init === 'function') {
      var res = bridge.init(opts || {});
      if (res && typeof res === 'object') bridge = res;
    } else if (bridge && typeof bridge.createDshPrismBridge === 'function' && !bridge.getConfig) {
      bridge = bridge.createDshPrismBridge(opts || {});
      G.__agPrismBridge = bridge;
    }
    return bridge;
  }

  function bootstrap(opts) {
    if (typeof document === 'undefined') {
      return { ok: false, reason: 'no-document', version: VERSION, codeHash: CODE_HASH };
    }
    if (ACTIVE_INST && ACTIVE_INST.booted && (!opts || !opts.force)) {
      return ACTIVE_INST;
    }

    if (G.__dshObsidianPrism && G.__dshObsidianPrism !== ACTIVE_INST && typeof G.__dshObsidianPrism.destroy === 'function') {
      try { G.__dshObsidianPrism.destroy(); } catch (_) {}
    }

    // 1. 获取纯浏览器桥接器并应用宿主传入的非空引导配置
    var bridge = resolveBridge(opts);
    var bootCfg = (opts && opts.config) || G.__DSH_PRISM_BOOT_CONFIG__ || null;
    if (bridge && bootCfg && typeof bootCfg === 'object' && Object.keys(bootCfg).length > 0) {
      try {
        if (typeof bridge.setConfig === 'function') bridge.setConfig(bootCfg, { skipHostSync: true });
      } catch (_) {}
    } else if (bridge && typeof bridge.syncConfigFromHostApi === 'function') {
      // The Desktop config can have changed while the renderer was closed.
      void bridge.syncConfigFromHostApi();
    }

    // 2. 同步调色板与深浅令牌至根节点
    var tokensApi = G.DSHPrismTokens || G.__agPrismTokens || null;
    if (tokensApi && typeof tokensApi.applyTokensToDocument === 'function') {
      try {
        var curCfg = bridge && typeof bridge.getConfig === 'function' ? bridge.getConfig() : {};
        tokensApi.applyTokensToDocument(document, curCfg);
      } catch (_) {}
    }

    // 3. 初始化光学与动效引擎（4 档弹簧、0fps 休眠、3 态边缘光晕、CSS.highlights 流式水墨、平滑光标）
    var optics = G.DSHPrismOptics || null;
    if (optics && typeof optics.init === 'function') {
      optics.init(bridge);
    }

    // 4. 初始化灵魂挂件（动态上下文呼吸水试管、星空/切工水晶推理滑块、DeepSeek 鲸伴宠）
    var widgets = G.DSHPrismWidgets || null;
    if (widgets && typeof widgets.init === 'function') {
      widgets.init(bridge);
    }

    // 5. 初始化工作台增强与外观设置中心（吸顶代码块/48行折叠、章节轨道、双模思考译文、设置弹窗）
    var workbench = G.DSHPrismWorkbench || null;
    if (workbench && typeof workbench.init === 'function') {
      workbench.init(bridge);
    }

    // 6. 初始化 1.0.7 原生动态图标、模型 Glyph 与响应式工作台增强
    var nativeIcons = G.DSHPrismNativeIcons || null;
    if (nativeIcons && typeof nativeIcons.init === 'function') {
      nativeIcons.init(bridge);
    }
    var responsiveWorkbench = G.DSHPrismResponsiveWorkbench || null;
    if (responsiveWorkbench && typeof responsiveWorkbench.init === 'function') {
      responsiveWorkbench.init(bridge);
    }

    // 7. 初始化首页地平线波纹与 Home Studio 仪表盘
    var homeRipple = G.DSHPrismHomeRipple || null;
    if (homeRipple && typeof homeRipple.init === 'function') {
      homeRipple.init(bridge);
    }
    var homeStudio = G.DSHPrismHomeStudio || null;
    if (homeStudio && typeof homeStudio.init === 'function') {
      homeStudio.init(bridge);
    }

    // 8. 立即执行一次 DOM 上下文遥测估算并通知挂件刷新
    if (bridge && typeof bridge.estimateTelemetry === 'function') {
      try { bridge.estimateTelemetry(); } catch (_) {}
    }

    ACTIVE_INST = {
      version: VERSION,
      codeHash: CODE_HASH,
      booted: true,
      bridge: bridge,
      optics: optics,
      widgets: widgets,
      workbench: workbench,
      nativeIcons: nativeIcons,
      responsiveWorkbench: responsiveWorkbench,
      homeRipple: homeRipple,
      homeStudio: homeStudio,
      tokens: tokensApi,
      bootstrap: bootstrap,
      reinit: function (nextOpts) {
        ACTIVE_INST.destroy();
        return bootstrap(Object.assign({}, nextOpts || {}, { force: true }));
      },
      destroy: function () {
        if (!ACTIVE_INST || !ACTIVE_INST.booted) return;
        ACTIVE_INST.booted = false;
        try {
          if (responsiveWorkbench && typeof responsiveWorkbench.destroy === 'function') responsiveWorkbench.destroy();
        } catch (_) {}
        try {
          if (homeStudio && typeof homeStudio.destroy === 'function') homeStudio.destroy();
        } catch (_) {}
        try {
          if (homeRipple && typeof homeRipple.destroy === 'function') homeRipple.destroy();
        } catch (_) {}
        try {
          if (nativeIcons && typeof nativeIcons.destroy === 'function') nativeIcons.destroy();
        } catch (_) {}
        try {
          if (workbench && typeof workbench.destroy === 'function') workbench.destroy();
        } catch (_) {}
        try {
          if (widgets && typeof widgets.destroy === 'function') widgets.destroy();
        } catch (_) {}
        try {
          if (optics && typeof optics.destroy === 'function') optics.destroy();
        } catch (_) {}
        try { bridge && typeof bridge.destroy === 'function' && bridge.destroy(); } catch (_) {}
      },
      getStatus: function () {
        return {
          version: VERSION,
          codeHash: CODE_HASH,
          booted: Boolean(ACTIVE_INST && ACTIVE_INST.booted),
          hasBridge: Boolean(bridge),
          hasOptics: Boolean(optics),
          hasWidgets: Boolean(widgets),
          hasWorkbench: Boolean(workbench),
          hasNativeIcons: Boolean(nativeIcons),
          hasResponsiveWorkbench: Boolean(responsiveWorkbench),
          hasHomeRipple: Boolean(homeRipple),
          hasHomeStudio: Boolean(homeStudio),
          config: bridge && typeof bridge.getConfig === 'function' ? bridge.getConfig() : null,
        };
      },
    };

    G.__dshObsidianPrism = ACTIVE_INST;

    try {
      var evt = typeof CustomEvent === 'function'
        ? new CustomEvent('dsh-prism:ready', { detail: ACTIVE_INST.getStatus() })
        : null;
      if (evt) {
        G.dispatchEvent && G.dispatchEvent(evt);
        document.dispatchEvent && document.dispatchEvent(evt);
      }
    } catch (_) {}

    return ACTIVE_INST;
  }

  G.__dshObsidianPrismBootstrap = bootstrap;
  if (!G.__dshObsidianPrism) {
    G.__dshObsidianPrism = {
      version: VERSION,
      codeHash: CODE_HASH,
      booted: false,
      bootstrap: bootstrap,
      destroy: function () {
        if (ACTIVE_INST && typeof ACTIVE_INST.destroy === 'function') ACTIVE_INST.destroy();
      },
    };
  }

  // 自动挂载：若宿主未显式禁用自动启动且当前位于浏览器 DOM 环境，则在 DOM 就绪时启动
  if (typeof document !== 'undefined' && G.__DSH_PRISM_NO_AUTO_BOOT__ !== true) {
    if (document.readyState === 'loading') {
      if (!BOOT_SCHEDULED) {
        BOOT_SCHEDULED = true;
        document.addEventListener('DOMContentLoaded', function onReady() {
          document.removeEventListener('DOMContentLoaded', onReady);
          bootstrap();
        });
      }
    } else {
      bootstrap();
    }
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : null);
`;
}

/**
 * 构建完整样式表文本与校验
 */
function buildCssOutput(cssSource) {
  const cleaned = String(cssSource || '').replace(/^\uFEFF/, '');
  const charsetMatch = cleaned.match(/^\s*@charset\s+[^;]+;/i);
  if (charsetMatch) {
    const rest = cleaned.slice(charsetMatch[0].length).replace(/^\s+/, '');
    return `${charsetMatch[0]}\n${LICENSE_BANNER}\n${rest}\n`;
  }
  return `${LICENSE_BANNER}\n${cleaned.trimEnd()}\n`;
}

/**
 * 构建可粘贴到浏览器控制台及 Tampermonkey/Violentmonkey 的 Userscript 注入器
 */
function buildUserscriptOutput({ version, codeHash, cssContent, bundleContent }) {
  const header = [
    '// ==UserScript==',
    '// @name         Obsidian Prism for DeepSeek Harness (dsh)',
    '// @namespace    https://github.com/RMvdesi/obsidian-prism',
    `// @version      ${version}`,
    '// @description  Obsidian Prism (黑曜棱镜) 光学主题、动态上下文呼吸水试管、切工水晶推理滑块、DeepSeek 鲸伴宠与双模思考译文套件',
    '// @author       RMvdesi & DSH Port Contributors',
    '// @license      GPL-3.0-only',
    '// @match        http://127.0.0.1:3080/*',
    '// @match        http://localhost:3080/*',
    '// @match        http://127.0.0.1:*/*',
    '// @match        https://*/dsh/*',
    '// @grant        none',
    '// @run-at       document-idle',
    '// ==/UserScript==',
    '',
  ].join('\n');

  const cssJson = JSON.stringify(cssContent);

  return [
    header,
    LICENSE_BANNER,
    ';(function () {',
    "  'use strict';",
    `  var PRISM_CSS_ID = 'dsh-obsidian-prism-style';`,
    `  var PRISM_CODE_HASH = ${JSON.stringify(codeHash)};`,
    `  var PRISM_CSS_TEXT = ${cssJson};`,
    '',
    '  function injectPrismStyles() {',
    "    if (typeof document === 'undefined') return null;",
    '    var head = document.head || document.documentElement;',
    '    if (!head) return null;',
    '    var styleEl = document.getElementById(PRISM_CSS_ID);',
    '    if (!styleEl) {',
    "      styleEl = document.createElement('style');",
    '      styleEl.id = PRISM_CSS_ID;',
    "      styleEl.setAttribute('data-prism-source', 'userscript');",
    '      head.appendChild(styleEl);',
    '    }',
    "    if (styleEl.getAttribute('data-prism-hash') !== PRISM_CODE_HASH) {",
    '      styleEl.textContent = PRISM_CSS_TEXT;',
    "      styleEl.setAttribute('data-prism-hash', PRISM_CODE_HASH);",
    '    }',
    '    return styleEl;',
    '  }',
    '',
    '  function runWhenReady() {',
    '    injectPrismStyles();',
    '    ;(function () {',
    bundleContent,
    '    })();',
    '  }',
    '',
    "  if (typeof document !== 'undefined' && document.readyState === 'loading') {",
    "    document.addEventListener('DOMContentLoaded', runWhenReady, { once: true });",
    '  } else {',
    '    runWhenReady();',
    '  }',
    '})();',
    '',
  ].join('\n');
}

/**
 * 构建真实 DeepSeek Harness Desktop 客户端插件入口 (`lib/client.js`)
 * 包裹于 window.__ModuleLoader__.load 中，零非内置裸包依赖、零阻塞顶层 inject
 */
function buildDshClientOutput({ version, codeHash, cssContent, combinedModules }) {
  const bootstrapCode = createBootstrapBlock(version, codeHash);
  const cssJson = JSON.stringify(cssContent);

  return `${LICENSE_BANNER}
/* DeepSeek Harness Desktop Native Client Entry | Build Hash: ${codeHash} | Version: ${version} */
window.__ModuleLoader__.load({
  id: 'dsh-obsidian-prism',
  factory: function (require) {
    'use strict';
    var module = { exports: {} };
    var exports = module.exports;

    var ReactMod = require('react');
    var React = ReactMod && ReactMod.default ? ReactMod.default : ReactMod;
    var h = React.createElement;
    var Component = React.Component;
    var useEffect = React.useEffect;
    var useRef = React.useRef;

    var STYLE_ID = 'dsh-obsidian-prism-styles';
    var CODE_HASH = ${JSON.stringify(codeHash)};
    var PRISM_CSS_TEXT = ${cssJson};

    function warnSafe(msg, err) {
      try {
        if (typeof console !== 'undefined' && typeof console.warn === 'function') {
          console.warn('[dsh-obsidian-prism] ' + msg, err);
        }
      } catch (_) {}
    }

    function ensurePrismModulesLoaded() {
      var G = typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : null);
      if (!G) return;
      if (G.__dshObsidianPrismModulesLoaded === CODE_HASH && typeof G.__dshObsidianPrismBootstrap === 'function') {
        return;
      }
      if (G.__dshObsidianPrism && typeof G.__dshObsidianPrism.destroy === 'function') {
        try { G.__dshObsidianPrism.destroy(); } catch (_) {}
      }
      var prevNoAuto = G.__DSH_PRISM_NO_AUTO_BOOT__;
      G.__DSH_PRISM_NO_AUTO_BOOT__ = true;
      try {
        (function (require, module, exports) {
          ${combinedModules}
          ${bootstrapCode}
        })(undefined, undefined, undefined);
        G.__dshObsidianPrismModulesLoaded = CODE_HASH;
      } finally {
        if (prevNoAuto === undefined) {
          try { delete G.__DSH_PRISM_NO_AUTO_BOOT__; } catch (_) { G.__DSH_PRISM_NO_AUTO_BOOT__ = false; }
        } else {
          G.__DSH_PRISM_NO_AUTO_BOOT__ = prevNoAuto;
        }
      }
    }

    function injectStyles() {
      if (typeof document === 'undefined') return null;
      var head = document.head || document.documentElement;
      if (!head) return null;
      var styleEl = document.getElementById(STYLE_ID);
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = STYLE_ID;
        styleEl.setAttribute('data-prism-source', 'dsh-client');
        head.appendChild(styleEl);
      }
      if (styleEl.getAttribute('data-prism-hash') !== CODE_HASH) {
        styleEl.textContent = PRISM_CSS_TEXT;
        styleEl.setAttribute('data-prism-hash', CODE_HASH);
      }
      return styleEl;
    }

    function removeStyles() {
      if (typeof document === 'undefined') return;
      var el = document.getElementById(STYLE_ID);
      if (!el) return;
      if (typeof el.remove === 'function') {
        el.remove();
      } else if (el.parentNode && typeof el.parentNode.removeChild === 'function') {
        el.parentNode.removeChild(el);
      }
    }

    function startPrismRuntime() {
      try {
        injectStyles();
      } catch (err) {
        warnSafe('inject styles failed:', err);
      }
      try {
        ensurePrismModulesLoaded();
        var G = typeof globalThis !== 'undefined' ? globalThis : window;
        if (G && typeof G.__dshObsidianPrismBootstrap === 'function') {
          G.__dshObsidianPrismBootstrap({ force: true });
        }
      } catch (err) {
        warnSafe('runtime bootstrap failed:', err);
      }
    }

    function stopPrismRuntime() {
      try {
        var G = typeof globalThis !== 'undefined' ? globalThis : window;
        if (G && G.__dshObsidianPrism && typeof G.__dshObsidianPrism.destroy === 'function') {
          G.__dshObsidianPrism.destroy();
        }
      } catch (err) {
        warnSafe('runtime destroy failed:', err);
      }
      try {
        removeStyles();
      } catch (err) {
        warnSafe('remove styles failed:', err);
      }
    }

    // 设置页 React ErrorBoundary：确保任何渲染异常不会导致整个 DSH 设置弹层白屏
    class PrismSettingsErrorBoundary extends Component {
      constructor(props) {
        super(props);
        this.state = { error: null };
      }

      static getDerivedStateFromError(error) {
        return { error: error };
      }

      componentDidCatch(error) {
        warnSafe('settings section render failed:', error);
      }

      render() {
        if (this.state.error !== null && this.state.error !== undefined) {
          var errMsg = this.state.error && this.state.error.message
            ? String(this.state.error.message)
            : String(this.state.error);
          return h('div', {
            className: 'dsh-prism-settings-error',
            style: {
              padding: '14px 16px',
              borderRadius: '10px',
              border: '1px solid var(--dsw-alias-state-error-primary, rgba(229, 83, 75, 0.45))',
              background: 'rgba(229, 83, 75, 0.08)',
              color: 'var(--dsw-alias-label-primary, #F2F2F5)',
              fontSize: '13px',
              lineHeight: 1.6,
            },
          }, [
            h('div', { key: 't', style: { fontWeight: 600, marginBottom: '6px' } }, 'Obsidian Prism 设置面板渲染异常'),
            h('div', { key: 'm', style: { opacity: 0.85, fontSize: '12px' } }, errMsg),
          ]);
        }
        return this.props.children;
      }
    }

    // DSH 原生设置弹层一级分区容器（settings.section -> 黑曜棱镜）
    function PrismSettingsSection() {
      var hostRef = useRef(null);

      useEffect(function () {
        var el = hostRef.current;
        if (!el) return;
        var mountedCleanup = null;
        try {
          if (typeof window !== 'undefined') {
            ensurePrismModulesLoaded();
            if (!window.__dshObsidianPrism || !window.__dshObsidianPrism.booted) {
              if (typeof window.__dshObsidianPrismBootstrap === 'function') {
                window.__dshObsidianPrismBootstrap({ force: true });
              }
            }
            var wb = window.DSHPrismWorkbench || null;
            var bridge = window.__agPrismBridge || window.DSHPrismBridge || null;
            if (wb && typeof wb.mountSettingsIntoElement === 'function') {
              mountedCleanup = wb.mountSettingsIntoElement(el, bridge);
            } else {
              el.textContent = 'Obsidian Prism 外观设置中心正在就绪，也可使用 Ctrl+Shift+P 呼出浮窗。';
            }
          }
        } catch (err) {
          warnSafe('mountSettingsIntoElement failed:', err);
        }

        return function () {
          try {
            if (typeof mountedCleanup === 'function') {
              mountedCleanup();
            } else if (mountedCleanup && typeof mountedCleanup.destroy === 'function') {
              mountedCleanup.destroy();
            } else if (mountedCleanup && typeof mountedCleanup.unmount === 'function') {
              mountedCleanup.unmount();
            }
          } catch (err) {
            warnSafe('unmount settings section failed:', err);
          }
        };
      }, []);

      return h('div', {
        ref: hostRef,
        className: 'dsh-prism-native-settings-host',
        'data-testid': 'dsh-prism-settings-section',
        style: { width: '100%', minHeight: '240px' },
      });
    }

    // A session-scoped slot supplies the same projection hook as the native ContextMeter.
    function PrismContextSource({ useProjection, sessionId }) {
      var pressure = useProjection('contextPressure');
      var breakdown = useProjection('contextBreakdown');
      return h('span', {
        hidden: true,
        'aria-hidden': true,
        'data-prism-context-source': '1',
        'data-prism-context-session': sessionId,
        'data-context-window': pressure?.contextWindow,
        'data-context-used': pressure?.projectedTokens ?? pressure?.pressureTokens,
        'data-context-system': breakdown?.systemTokens,
        'data-context-messages': breakdown?.messageTokens,
        'data-context-tools': breakdown?.toolsTokens,
      });
    }

    // ModelSelect's root pane has drill-down rows. Its own directory supplies
    // the ordered effort IDs here before React mounts the native radio buttons.
    function PrismNativeEfforts({ prismModelStore, prismModelDirectory, prismSessionId, locked, reportFailure, t }) {
      var markerRef = useRef(null);
      var selecting = useRef(false);
      var state = React.useSyncExternalStore(
        notify => prismModelStore.subscribe(notify), () => prismModelStore.getSnapshot()
      );
      var current = state.current;
      // The host radio handler calls closeAfterSelection. The directory's public action
      // performs the same session update without taking focus or dismissing this pane.
      (React.useLayoutEffect || useEffect)(function () {
        var marker = markerRef.current;
        if (!marker || !current || typeof prismModelDirectory?.select !== 'function') return;
        var menu = marker.closest('[role="menu"]');
        var trigger = menu && Array.from(menu.ownerDocument.querySelectorAll('button[aria-controls]'))
          .find(el => el.getAttribute('aria-controls') === menu.id);
        if (!trigger) return;
        var model = current.model, provider = current.provider;
        var submit = function (effortId) {
          var snapshot = prismModelStore.getSnapshot();
          var active = snapshot.current;
          if (!menu.isConnected || !trigger.isConnected || trigger.disabled || locked || selecting.current ||
              trigger.getAttribute('aria-expanded') !== 'true' || trigger.getAttribute('aria-controls') !== menu.id ||
              snapshot.pending != null || snapshot.status === 'loading' || active?.model !== model || active?.provider !== provider) return false;
          var source = trigger.closest('[data-composer-card]')?.querySelector('[data-prism-context-session]');
          if (source && source.getAttribute('data-prism-context-session') !== prismSessionId) return false;
          var reasoning = snapshot.groups.find(group => group.id === provider)?.models.find(item => item.id === model)?.reasoning;
          if (!reasoning || (effortId === null ? reasoning.defaultEffort !== undefined :
              !reasoning.efforts.some(item => item.id === effortId))) return false;
          if ((active.reasoningEffort ?? reasoning.defaultEffort ?? null) === effortId) return true;
          var selection = { provider: provider, model: model };
          if (effortId !== null) selection.reasoningEffort = effortId;
          var failed = function (error) {
            if (!menu.isConnected) return;
            var message = error?.code === 'session/writer-held' ? t('error.sessionInUse') :
              t('error.action', { message: error?.message || String(error) });
            if (typeof reportFailure === 'function') reportFailure(message);
            else warnSafe('model effort selection failed:', error);
          };
          selecting.current = true;
          try {
            Promise.resolve(prismModelDirectory.select(selection)).then(function (result) {
              if (result?.ok === false) failed(result.error);
            }, failed).finally(function () { selecting.current = false; });
          } catch (error) {
            selecting.current = false;
            failed(error);
          }
          return true;
        };
        marker.prismSelectEffort = submit;
        // ModelSelect removes its options slot while drilling into effort radios. An
        // existing opening may retain submit until the portal or its owner changes.
        return function () { delete marker.prismSelectEffort; };
      }, [prismModelStore, prismModelDirectory, prismSessionId, current?.model, current?.provider, state.groups, locked, reportFailure, t]);
      if (!current) return null;
      var group = state.groups.find(group => group.id === current.provider);
      var reasoning = group?.models.find(model => model.id === current.model)?.reasoning;
      if (!reasoning) return null;
      var options = reasoning.efforts.map(effort => ({ id: effort.id, label: effort.name }));
      if (reasoning.defaultEffort === undefined) {
        options.unshift({ id: null, label: t('effort.providerDefault') });
      }
      return h('span', {
        ref: markerRef, hidden: true, 'aria-hidden': true,
        'data-prism-native-efforts': JSON.stringify(options),
        'data-prism-native-model': current.model,
        'data-prism-native-provider': current.provider,
        'data-prism-native-current': current.reasoningEffort ?? reasoning.defaultEffort ?? '',
      });
    }

    function registerNativeSlot(slots, meta, render) {
      var register = function () { return slots.register(meta, render); };
      return typeof slots.inject === 'function' ? slots.inject(meta.name, register) : register();
    }

    function apply(ctx) {
      // 1. 通过 ctx.effect 管理样式表与运行时完整生命周期
      if (ctx && typeof ctx.effect === 'function') {
        ctx.effect(function () {
          startPrismRuntime();
          return function () {
            stopPrismRuntime();
          };
        }, 'dsh-obsidian-prism: runtime');
      } else {
        startPrismRuntime();
        if (ctx && typeof ctx.on === 'function') {
          ctx.on('dispose', stopPrismRuntime);
        }
      }

      // 2. 非阻塞安全探测 ctx.slots（不存在时通过 ctx.inject(['slots'], ...) 延迟注册）
      var slotDisposers = new Map();
      function attachSlots(targetCtx) {
        var slots = targetCtx && targetCtx.slots;
        if (!slots || typeof slots.register !== 'function') return;
        function attach(meta, render) {
          if (slotDisposers.has(meta.name)) return;
          try {
            slotDisposers.set(meta.name, registerNativeSlot(slots, meta, render));
          } catch (err) {
            warnSafe('register ' + meta.name + ' failed:', err);
          }
        }
        attach({
          name: 'settings.section', id: 'obsidian-prism', order: 48,
          label: function () { return '黑曜棱镜'; },
        }, function (props) {
          return h(PrismSettingsErrorBoundary, null, h(PrismSettingsSection, props || {}));
        });
        attach({ name: 'conversation.input.overlay', id: 'obsidian-prism-context-source' }, function (props) {
          return typeof props?.useProjection === 'function' ? h(PrismContextSource, props) : null;
        });
      }

      function cleanupSlots() {
        slotDisposers.forEach(function (dispose, name) {
          if (typeof dispose !== 'function') return;
          try { dispose(); } catch (err) { warnSafe('dispose ' + name + ' failed:', err); }
        });
        slotDisposers.clear();
      }

      if (ctx && typeof ctx.inject === 'function') {
        try {
          ctx.inject(['modelDirectories'], function (scope) {
            if (!scope?.modelDirectories || !scope.slots) return;
            return registerNativeSlot(scope.slots, {
              name: 'conversation.input.model.options', id: 'obsidian-prism-native-efforts', locale: 'model',
              inject: function (sessionId) {
                var directory = scope.modelDirectories.directoryFor(sessionId);
                return { prismModelStore: directory.store, prismModelDirectory: directory, prismSessionId: sessionId };
              },
            }, PrismNativeEfforts);
          });
        } catch (err) {
          warnSafe('register conversation.input.model.options failed:', err);
        }
      }

      if (ctx && ctx.slots) {
        attachSlots(ctx);
      } else if (ctx && typeof ctx.inject === 'function') {
        try {
          ctx.inject(['slots'], function (scopedCtx) {
            attachSlots(scopedCtx);
            if (scopedCtx && typeof scopedCtx.effect === 'function') {
              scopedCtx.effect(function () {
                return cleanupSlots;
              }, 'dsh-obsidian-prism: slots');
            }
            return cleanupSlots;
          });
        } catch (err) {
          warnSafe('lazy inject slots failed:', err);
        }
      }

      if (ctx && typeof ctx.effect === 'function') {
        ctx.effect(function () {
          return cleanupSlots;
        }, 'dsh-obsidian-prism: slots-cleanup');
      } else if (ctx && typeof ctx.on === 'function') {
        ctx.on('dispose', cleanupSlots);
      }
    }

    module.exports = {
      name: 'obsidian-prism',
      inject: ['slots'],
      apply: apply,
    };
    return module.exports;
  },
});
`;
}

/**
 * 执行完整打包流程
 */
export function buildBundle(options = {}) {
  const rootDir = path.resolve(options.rootDir || DEFAULT_ROOT_DIR);
  const quiet = Boolean(options.quiet);
  const pkgPath = path.join(rootDir, 'package.json');
  const distDir = path.join(rootDir, 'dist');
  const libDir = path.join(rootDir, 'lib');

  let version = '1.0.7-beta.1-dsh.4';
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      if (pkg && pkg.version) version = String(pkg.version);
    } catch {}
  }

  const missingFiles = [];
  for (const rel of [...MODULE_ORDER, ...STYLE_SOURCE_ORDER]) {
    const abs = path.join(rootDir, rel);
    if (!fs.existsSync(abs)) {
      missingFiles.push(rel);
    }
  }
  if (missingFiles.length > 0) {
    throw new Error(`Missing required source files:\n  - ${missingFiles.join('\n  - ')}`);
  }

  const moduleParts = MODULE_ORDER.map((rel, idx) => {
    const abs = path.join(rootDir, rel);
    const code = fs.readFileSync(abs, 'utf8');
    return wrapBrowserModule(rel, code, idx, MODULE_ORDER.length);
  });

  const combinedModules = moduleParts.join('\n\n');
  const cssRaw = STYLE_SOURCE_ORDER.map(rel => fs.readFileSync(path.join(rootDir, rel), 'utf8')).join('\n');
  const cssOutput = buildCssOutput(cssRaw);
  const codeHash = computeHash(combinedModules + '\n' + cssOutput);

  const bundleOutput = [
    LICENSE_BANNER,
    `/* Build Hash: ${codeHash} | Version: ${version} */`,
    combinedModules,
    createBootstrapBlock(version, codeHash),
  ].join('\n\n');

  const userscriptOutput = buildUserscriptOutput({
    version,
    codeHash,
    cssContent: cssOutput,
    bundleContent: bundleOutput,
  });

  const clientOutput = buildDshClientOutput({
    version,
    codeHash,
    cssContent: cssOutput,
    combinedModules,
  });

  fs.mkdirSync(distDir, { recursive: true });
  fs.mkdirSync(libDir, { recursive: true });

  const outBundlePath = path.join(distDir, 'dsh-prism.bundle.js');
  const outCssPath = path.join(distDir, 'dsh-prism.css');
  const outUserscriptPath = path.join(distDir, 'dsh-prism.userscript.js');
  const outClientPath = path.join(libDir, 'client.js');

  fs.writeFileSync(outBundlePath, bundleOutput, 'utf8');
  fs.writeFileSync(outCssPath, cssOutput, 'utf8');
  fs.writeFileSync(outUserscriptPath, userscriptOutput, 'utf8');
  fs.writeFileSync(outClientPath, clientOutput, 'utf8');

  const summary = {
    version,
    codeHash,
    files: [
      { name: 'dist/dsh-prism.bundle.js', path: outBundlePath, bytes: Buffer.byteLength(bundleOutput, 'utf8') },
      { name: 'dist/dsh-prism.css', path: outCssPath, bytes: Buffer.byteLength(cssOutput, 'utf8') },
      { name: 'dist/dsh-prism.userscript.js', path: outUserscriptPath, bytes: Buffer.byteLength(userscriptOutput, 'utf8') },
      { name: 'lib/client.js', path: outClientPath, bytes: Buffer.byteLength(clientOutput, 'utf8') },
    ],
  };

  if (!quiet) {
    console.log(`[build-bundle] Obsidian Prism for DSH v${version} (hash: ${codeHash})`);
    for (const f of summary.files) {
      console.log(`  ✓ ${f.name} (${formatBytes(f.bytes)})`);
    }
  }

  return summary;
}

const isDirectCli =
  typeof process !== 'undefined' &&
  Array.isArray(process.argv) &&
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(__filename);

if (isDirectCli) {
  try {
    buildBundle();
  } catch (err) {
    console.error('[build-bundle] Build failed:', err?.message || err);
    process.exitCode = 1;
  }
}
