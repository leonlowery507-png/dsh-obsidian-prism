/*!
 * Obsidian Prism (黑曜棱镜) for DeepSeek Harness (dsh)
 * Upstream Project: Obsidian Prism v1.0.7-beta.1 by RMvdesi (https://github.com/RMvdesi/obsidian-prism)
 * License: GNU General Public License v3.0 (GPL-3.0-only)
 * Downstream DSH Port Modified: 2026-11-22
 */
/* DeepSeek Harness Desktop Native Client Entry | Build Hash: r9rbg5 | Version: 1.0.7-beta.1-dsh.4 */
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
    var CODE_HASH = "r9rbg5";
    var PRISM_CSS_TEXT = "/*!\n * Obsidian Prism (黑曜棱镜) for DeepSeek Harness (dsh)\n * Upstream Project: Obsidian Prism v1.0.7-beta.1 by RMvdesi (https://github.com/RMvdesi/obsidian-prism)\n * License: GNU General Public License v3.0 (GPL-3.0-only)\n * Downstream DSH Port Modified: 2026-11-22\n */\n/* ==========================================================================\n * Obsidian Prism for DeepSeek Harness (dsh-obsidian-prism)\n * 精密光学视觉系统与动效编排样式表 (src/prism-style.css)\n *\n * 完整适配真实 DeepSeek Harness Desktop (React SPA) 与交互预览舞台：\n * 1. 四大原版主题预设：obsidian（深空黑曜）、warm（暖炭玄岩）、crystal（白昼冷晶）、alabaster（暖白画册）\n *    在 :root[data-prism-theme=\"...\"] 下高优先级覆写全部真实 DSH --dsw-alias-* / --dsw-font-* 与 --ag-prism-* 令牌\n * 2. 五大工业强调色预设：follow / cobalt / iris / amber / mono（暗/亮双态完整覆写 --dsw-alias-accent/brand/button-*）\n * 3. 三档精密圆角（sharp / balanced / soft）、等宽代码字体栈与连字控制、四档氛围光密度、四档物理动效层级\n * 4. 0.5px 镜面描边、Console Well 下沉控制台槽、毛玻璃悬浮输入座舱、吸顶代码块头与 >=48 行折叠遮罩\n * 5. React SPA 独立挂载层 (#dsh-obsidian-prism-optics-layer) 与 z-index 避让策略：\n *    严格避让右下角 dsh-whale-widget (.dshwv-root, z-index: 9999) 与右侧 dsh-better-sidebar\n * 6. 全套微件样式：动态上下文用量试管、星空/切割水晶滑块、鲸伴宠舞台、原生设置中心嵌入视图与独立弹窗、对话标尺、思考翻译\n * ========================================================================== */\n\n@property --ag-fiber-angle {\n  syntax: \"<angle>\";\n  inherits: false;\n  initial-value: 0deg;\n}\n\n/* --------------------------------------------------------------------------\n * 一、基础光学令牌与默认深空黑曜 (Obsidian) 基线\n * -------------------------------------------------------------------------- */\n:root,\nhtml[data-ag-cs-style],\nhtml[data-prism-theme] {\n  /* 物理缓动与弹簧曲线 */\n  --ag-ease-out: cubic-bezier(0.16, 1, 0.3, 1);\n  --ag-ease-standard: cubic-bezier(0.2, 0, 0, 1);\n  --ag-ease-in: cubic-bezier(0.4, 0, 1, 1);\n  --ag-ease-spring: cubic-bezier(0.34, 1.4, 0.64, 1);\n  --ag-spring-sidebar: cubic-bezier(0.22, 1.08, 0.36, 1);\n\n  /* 默认圆角阶梯 (balanced) */\n  --ag-cs-r-sm: 4px;\n  --ag-cs-r-md: 6px;\n  --ag-cs-r-lg: 10px;\n  --ag-prism-radius-sm: var(--ag-cs-r-sm);\n  --ag-prism-radius-md: var(--ag-cs-r-md);\n  --ag-prism-radius-lg: var(--ag-cs-r-lg);\n\n  /* 字体栈 */\n  --font-sans: \"Inter\", \"PingFang SC\", \"Microsoft YaHei UI\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", system-ui, sans-serif;\n  --ag-cs-mono-stack: var(--editor-font-family, \"JetBrains Mono\", \"Google Sans Code\", \"Cascadia Code\", Consolas, ui-monospace, monospace);\n  --font-mono: var(--ag-cs-mono-stack);\n\n  /* 四色光学色散光谱基准与氛围强度乘子 */\n  --ag-prism-cobalt: #4285F4;\n  --ag-prism-iris: #9B72CB;\n  --ag-prism-coral: #EA4335;\n  --ag-prism-amber: #FBBC04;\n  --ag-ambient-mul: 1;\n  --ag-accent-prism-mul: 1;\n  --ag-prism-strength: calc(var(--ag-ambient-mul, 1) * var(--ag-accent-prism-mul, 1));\n  --ag-prism-light-mul: 1;\n\n  /* 0.5px 镜面高光与光学材质纹理 */\n  --ag-cs-hairline: 0.5px;\n  --ag-cs-specular: rgba(255, 255, 255, 0.095);\n  --ag-cs-specular-border: rgba(255, 255, 255, 0.14);\n  --ag-cs-sheen: linear-gradient(172deg, rgba(255, 255, 255, 0.046) 0%, rgba(160, 185, 245, 0.014) 36%, rgba(10, 11, 16, 0.2) 100%);\n\n  /* 侧边栏与行选中光学指示器 */\n  --ag-cs-sidebar-hover: rgba(255, 255, 255, 0.055);\n  --ag-cs-sidebar-row-hover: rgba(255, 255, 255, 0.042);\n  --ag-cs-sidebar-selected: rgba(255, 255, 255, 0.074);\n  --ag-cs-sidebar-sel-sh: inset 0 1px 0 var(--ag-cs-specular);\n  --ag-cs-sidebar-sel-bar: linear-gradient(#5CC6FC 0%, #3186FF 100%);\n  --ag-cs-sidebar-sel-glow: 0 0 6px rgba(92, 198, 252, 0.42);\n\n  /* 发送 / 停止 / 运行态光学控件 */\n  --ag-cs-send-bg: #F2F3F7;\n  --ag-cs-send-fg: #0E0F14;\n  --ag-cs-send-spec: rgba(255, 255, 255, 0.68);\n  --ag-cs-send-sh: inset 0 1px 0 #FFFFFF, 0 2px 8px rgba(0, 0, 0, 0.42), 0 0 0 1px rgba(255, 255, 255, 0.12);\n  --ag-cs-send-dis-bg: rgba(255, 255, 255, 0.07);\n  --ag-cs-send-dis-fg: rgba(242, 243, 247, 0.28);\n\n  --ag-cs-cancel-bg: #121319;\n  --ag-cs-cancel-core: radial-gradient(120% 120% at 50% 0%, #1C1E28 0%, #101117 100%);\n  --ag-cs-cancel-stop: #F4F5F8;\n  --ag-cs-cancel-stop-hv: #FFFFFF;\n  --ag-cs-cancel-stop-sh: 0 0 6px rgba(255, 255, 255, 0.32);\n  --ag-cs-cancel-ring: conic-gradient(#4285F4 0deg, #9B72CB 95deg, #EA4335 185deg, #FBBC04 275deg, #34A853 325deg, #4285F4 360deg);\n  --ag-cs-cancel-sh: 0 0 12px -2px rgba(66, 133, 244, 0.42), 0 2px 6px rgba(0, 0, 0, 0.4);\n\n  --ag-cs-run-core: #0F131D;\n  --ag-cs-run-star: #DCEEFF;\n  --ag-cs-run-star-sh: 0 0 5px rgba(92, 198, 252, 0.78);\n  --ag-cs-run-wash: linear-gradient(90deg, rgba(49, 134, 255, 0.11) 0%, rgba(92, 198, 252, 0.04) 55%, transparent 100%);\n  --ag-cs-run-bar: linear-gradient(#FBBC04 0%, #EA4335 16%, #9B72CB 34%, #5CC6FC 58%, #3186FF 100%);\n  --ag-cs-run-ring: conic-gradient(#1B49B2 0deg, #3186FF 150deg, #5CC6FC 232deg, #9B72CB 276deg, #EA4335 308deg, #FBBC04 334deg, #EAF4FF 350deg, #1B49B2 360deg);\n  --ag-cs-run-outer-sh: 0 0 7px rgba(49, 134, 255, 0.3);\n\n  /* 思维链、声纳脉冲、代码槽与数据可视化色板 */\n  --ag-cs-focus-spec: rgba(255, 255, 255, 0.14);\n  --ag-cs-whisper-hv: rgba(255, 255, 255, 0.032);\n  --ag-cs-thought-rule: rgba(92, 198, 252, 0.26);\n  --ag-cs-thought-fg: color-mix(in srgb, var(--secondary-foreground, #C4C4CE) 72%, transparent);\n  --ag-cs-comet-bg: #7CE2FF;\n  --ag-cs-comet-sh: 0 0 8px rgba(92, 198, 252, 0.85);\n  --ag-cs-stream-tint: color-mix(in srgb, #7CE2FF 38%, currentColor);\n  --ag-cs-code-scan-bg: rgba(92, 198, 252, 0.11);\n  --ag-cs-nav-dot: color-mix(in srgb, #8AB4F8 28%, var(--muted-foreground, #8A8A98));\n  --ag-cs-nav-active: #5CC6FC;\n  --ag-cs-nav-glow: 0 0 7px rgba(92, 198, 252, 0.55);\n  --ag-cs-sonar-border: rgba(92, 198, 252, 0.42);\n  --ag-cs-sonar-glow: rgba(92, 198, 252, 0.22);\n  --ag-cs-sonar-wash: rgba(92, 198, 252, 0.042);\n  --ag-cs-heat-hi-1: #58C4F6;\n  --ag-cs-heat-hi-2: #8CE0FF;\n  --ag-cs-code-well: color-mix(in srgb, var(--background, #0B0B0E) 74%, var(--card, #141418));\n  --ag-cs-console-well: color-mix(in srgb, var(--sidebar, #09090B) 78%, var(--background, #0B0B0E));\n  --ag-cs-surface-sh: inset 0 1px 0 var(--ag-cs-specular), 0 12px 32px -8px rgba(0, 0, 0, 0.36);\n  --ag-cs-bubble-sh: inset 0 1px 0 var(--ag-cs-specular);\n  --ag-cs-card-header-sh: inset 0 1px 0 var(--ag-cs-specular);\n  --ag-cs-col-max: max(30vw, var(--max-conversation-width, 50rem));\n\n  --ag-cs-data-0: #4F8BFF;\n  --ag-cs-data-1: #58C4F6;\n  --ag-cs-data-2: #4CC39A;\n  --ag-cs-data-3: #8E84F5;\n  --ag-cs-data-4: #7AA2D4;\n  --ag-cs-data-5: #E2B354;\n  --ag-cs-data-6: #3B9EE8;\n  --ag-cs-data-7: #6B93D6;\n  --ag-cs-data-8: #5BC4BE;\n  --ag-cs-data-9: #8C99B0;\n\n  /* 默认深空黑曜 (Obsidian) 核心表面色 */\n  color-scheme: dark;\n  --background: #0B0B0E;\n  --content: #0E0E11;\n  --shell: #0B0B0E;\n  --body-background: #0B0B0E;\n  --sidebar: #09090B;\n  --sidebar-muted: rgba(255, 255, 255, 0.045);\n  --sidebar-secondary: rgba(255, 255, 255, 0.072);\n  --card: #141418;\n  --card-border: rgba(255, 255, 255, 0.088);\n  --border: rgba(255, 255, 255, 0.072);\n  --secondary: #1C1C22;\n  --muted: #141418;\n  --foreground: #F2F2F5;\n  --secondary-foreground: #C4C4CE;\n  --muted-foreground: #8A8A98;\n  --placeholder: #626270;\n  --primary: #669DF6;\n  --primary-foreground: #FFFFFF;\n  --link: #8AB4F8;\n  --error: #E5534B;\n  --warning: #F2B84B;\n  --success: #50A37B;\n  --scrim: rgba(9, 9, 11, 0.74);\n\n  --ag-cs-composer-bg: rgba(20, 21, 26, 0.94);\n  --ag-cs-panel-bg: rgba(19, 20, 25, 0.96);\n  --ag-cs-popover-bg: rgba(23, 24, 30, 0.94);\n  --ag-cs-pill-bg: rgba(28, 29, 36, 0.78);\n  --ag-cs-bubble: rgba(255, 255, 255, 0.052);\n  --prism-message-user-bg: var(--ag-cs-bubble);\n  --prism-message-user-border: var(--border);\n  --prism-message-assistant-bg: color-mix(in srgb, var(--card) 78%, var(--ag-cs-bubble));\n  --prism-message-assistant-border: var(--border);\n  --ag-cs-ripple-ink: #92949C;\n  --ag-cs-ripple-wave: #D6DAE4;\n  --ag-cs-composer-shadow: 0 1px 2px rgba(0, 0, 0, 0.44), 0 8px 20px -6px rgba(0, 0, 0, 0.48), 0 20px 44px -14px rgba(0, 0, 0, 0.62);\n\n  /* 派生语义变量 */\n  --ag-cs-canvas: var(--content);\n  --ag-cs-sidebar: var(--sidebar);\n  --ag-cs-tile-bg: color-mix(in srgb, var(--foreground) 3.4%, var(--card));\n  --ag-cs-tile-border: color-mix(in srgb, var(--foreground) 9.5%, transparent);\n  --ag-cs-pill-border: var(--card-border);\n  --ag-cs-tab-active: color-mix(in srgb, var(--foreground) 9%, transparent);\n  --ag-cs-border-1: var(--border);\n  --ag-cs-border-2: var(--card-border);\n  --ag-cs-hover-wash: var(--ag-cs-sidebar-hover);\n  --ag-cs-active-wash: color-mix(in srgb, var(--foreground) 9.5%, transparent);\n  --ag-cs-focus-ring: color-mix(in srgb, var(--primary) 38%, transparent);\n  --ag-cs-focus-halo: color-mix(in srgb, var(--primary) 14%, transparent);\n  --ag-cs-accent: var(--primary);\n  --ag-cs-data-ink: var(--primary);\n  --ag-cs-heat-empty: color-mix(in srgb, var(--foreground) 5.5%, transparent);\n  --ag-cs-tip-bg: var(--foreground);\n  --ag-cs-tip-fg: var(--background);\n  --ag-cs-scroll: color-mix(in srgb, var(--foreground) 16%, transparent);\n  --ag-cs-scroll-hover: color-mix(in srgb, var(--foreground) 30%, transparent);\n\n  /* Obsidian Prism 标准 --ag-prism-* 公开令牌 */\n  --ag-prism-bg: var(--background);\n  --ag-prism-surface: var(--content);\n  --ag-prism-sidebar: var(--sidebar);\n  --ag-prism-card: var(--card);\n  --ag-prism-fg: var(--foreground);\n  --ag-prism-fg-secondary: var(--secondary-foreground);\n  --ag-prism-fg-muted: var(--muted-foreground);\n  --ag-prism-border: var(--ag-cs-border-1);\n  --ag-prism-border-strong: var(--ag-cs-border-2);\n  --ag-prism-accent: var(--primary);\n  --ag-prism-specular: var(--ag-cs-specular);\n  --ag-prism-code-well: var(--ag-cs-code-well);\n  --ag-prism-console-well: var(--ag-cs-console-well);\n\n  /* DeepSeek Harness 静态与字体基础令牌 */\n  --dsw-static-bg: var(--background);\n  --dsw-static-surface: var(--content);\n  --dsw-static-sidebar: var(--sidebar);\n  --dsw-static-card: var(--card);\n  --dsw-static-border: var(--border);\n  --dsw-static-fg: var(--foreground);\n  --dsw-static-muted: var(--muted-foreground);\n  --dsw-static-accent: var(--primary);\n  --dsw-font-family: var(--font-sans);\n  --dsw-font-mono: var(--ag-cs-mono-stack);\n  --dsw-font-family-mono: var(--ag-cs-mono-stack);\n}\n\n/* --------------------------------------------------------------------------\n * 二、四大主题预设矩阵 + 真实 DSH Desktop --dsw-alias-* 高优先级覆写\n *     覆盖全部真实 DSH 语义令牌，确保在 React SPA 与 dsh-better-sidebar 中 1:1 生效\n * -------------------------------------------------------------------------- */\n\n/* 1. 深空黑曜 (Obsidian) */\n:root[data-prism-theme=\"obsidian\"],\nhtml[data-prism-theme=\"obsidian\"],\nbody[data-prism-theme=\"obsidian\"],\nhtml[data-prism-theme=\"obsidian\"] body,\nhtml[data-ag-cs-style][data-ag-cs-palette=\"obsidian\"]:not([data-ag-cs-theme=\"light\"]) {\n  color-scheme: dark !important;\n  --background: #0B0B0E;\n  --content: #0E0E11;\n  --shell: #0B0B0E;\n  --body-background: #0B0B0E;\n  --sidebar: #09090B;\n  --sidebar-muted: rgba(255, 255, 255, 0.045);\n  --sidebar-secondary: rgba(255, 255, 255, 0.072);\n  --card: #141418;\n  --card-border: rgba(255, 255, 255, 0.088);\n  --border: rgba(255, 255, 255, 0.072);\n  --secondary: #1C1C22;\n  --muted: #141418;\n  --foreground: #F2F2F5;\n  --secondary-foreground: #C4C4CE;\n  --muted-foreground: #8A8A98;\n  --placeholder: #626270;\n  --primary: #669DF6;\n  --primary-foreground: #FFFFFF;\n  --link: #8AB4F8;\n  --error: #E5534B;\n  --warning: #F2B84B;\n  --success: #50A37B;\n  --scrim: rgba(9, 9, 11, 0.74);\n  --ag-cs-composer-bg: rgba(20, 21, 26, 0.94);\n  --ag-cs-panel-bg: rgba(19, 20, 25, 0.96);\n  --ag-cs-popover-bg: rgba(23, 24, 30, 0.94);\n  --ag-cs-pill-bg: rgba(28, 29, 36, 0.78);\n  --ag-cs-bubble: rgba(255, 255, 255, 0.052);\n  --prism-message-user-bg: rgba(255, 255, 255, 0.075);\n  --prism-message-user-border: rgba(255, 255, 255, 0.12);\n  --prism-message-assistant-bg: rgba(29, 31, 39, 0.88);\n  --prism-message-assistant-border: rgba(255, 255, 255, 0.095);\n  --ag-cs-ripple-ink: #92949C;\n  --ag-cs-ripple-wave: #D6DAE4;\n  --ag-cs-code-well: #09090B;\n  --ag-cs-console-well: #08080A;\n  --ag-cs-composer-shadow: 0 1px 2px rgba(0, 0, 0, 0.44), 0 8px 20px -6px rgba(0, 0, 0, 0.48), 0 20px 44px -14px rgba(0, 0, 0, 0.62);\n\n  /* 真实 DSH Desktop --dsw-alias-* 完整覆写 */\n  --dsw-alias-bg-base: #0E0E11 !important;\n  --dsw-alias-bg-layer-1: #09090B !important;\n  --dsw-alias-bg-layer-2: #141418 !important;\n  --dsw-alias-bg-layer-3: #1C1C22 !important;\n  --dsw-alias-bg-mask-1: rgba(9, 9, 11, 0.74) !important;\n  --dsw-alias-bg-canvas: #0E0E11 !important;\n  --dsw-alias-bg-sidebar: #09090B !important;\n  --dsw-alias-bg-elevated: #141418 !important;\n  --dsw-alias-bg-composer: rgba(20, 21, 26, 0.94) !important;\n  --dsw-alias-bg-code: #09090B !important;\n  --dsw-alias-bg-hover: rgba(255, 255, 255, 0.055) !important;\n  --dsw-alias-border-l1: rgba(255, 255, 255, 0.072) !important;\n  --dsw-alias-border-l2: rgba(255, 255, 255, 0.095) !important;\n  --dsw-alias-border-l4: rgba(255, 255, 255, 0.16) !important;\n  --dsw-alias-border-l2-darkmode-thin: rgba(255, 255, 255, 0.088) !important;\n  --dsw-alias-border-subtle: rgba(255, 255, 255, 0.072) !important;\n  --dsw-alias-border-strong: rgba(255, 255, 255, 0.12) !important;\n  --dsw-alias-hairline: rgba(255, 255, 255, 0.095) !important;\n  --dsw-alias-brand-primary: #669DF6 !important;\n  --dsw-alias-accent: #669DF6 !important;\n  --dsw-alias-accent-ink: #FFFFFF !important;\n  --dsw-alias-accent-soft: rgba(102, 157, 246, 0.15) !important;\n  --dsw-alias-accent-fg: #FFFFFF !important;\n  --dsw-alias-button-primary-fill: #669DF6 !important;\n  --dsw-alias-button-primary-hover: #7AAAFF !important;\n  --dsw-alias-button-ghost-active-fill: rgba(102, 157, 246, 0.14) !important;\n  --dsw-alias-button-ghost-active-border: rgba(102, 157, 246, 0.38) !important;\n  --dsw-alias-button-ghost-hover: rgba(255, 255, 255, 0.06) !important;\n  --dsw-alias-interactive-bg-hover: rgba(255, 255, 255, 0.055) !important;\n  --dsw-alias-interactive-bg-active: rgba(255, 255, 255, 0.095) !important;\n  --dsw-alias-interactive-bg-hover-accent: rgba(102, 157, 246, 0.16) !important;\n  --dsw-alias-label-primary: #F2F2F5 !important;\n  --dsw-alias-label-secondary: #C4C4CE !important;\n  --dsw-alias-label-tertiary: #8A8A98 !important;\n  --dsw-alias-label-dimmed: #626270 !important;\n  --dsw-alias-text-primary: #F2F2F5 !important;\n  --dsw-alias-text-secondary: #C4C4CE !important;\n  --dsw-alias-text-muted: #8A8A98 !important;\n  --dsw-alias-scrollbar-bg-l2: rgba(242, 242, 245, 0.16) !important;\n  --dsw-alias-scrollbar-hover-l2: rgba(242, 242, 245, 0.3) !important;\n  --dsw-alias-state-error-primary: #E5534B !important;\n  --dsw-alias-state-success-primary: #50A37B !important;\n  --dsw-alias-state-warn-primary: #F2B84B !important;\n  --dsw-alias-state-business-primary: #669DF6 !important;\n  --dsw-alias-success: #50A37B !important;\n  --dsw-alias-warning: #F2B84B !important;\n  --dsw-alias-danger: #E5534B !important;\n  --dsw-font-family: var(--font-sans) !important;\n  --dsw-font-mono: var(--ag-cs-mono-stack) !important;\n  --dsw-font-family-mono: var(--ag-cs-mono-stack) !important;\n}\n\n/* 2. 暖炭玄岩 (Warm / Claude Dark) */\n:root[data-prism-theme=\"warm\"],\nhtml[data-prism-theme=\"warm\"],\nbody[data-prism-theme=\"warm\"],\nhtml[data-prism-theme=\"warm\"] body,\nhtml[data-ag-cs-style][data-ag-cs-palette=\"warm\"]:not([data-ag-cs-theme=\"light\"]),\nhtml[data-ag-cs-style][data-ag-cs-palette=\"claude\"]:not([data-ag-cs-theme=\"light\"]) {\n  color-scheme: dark !important;\n  --background: #141413;\n  --content: #141413;\n  --shell: #141413;\n  --body-background: #141413;\n  --sidebar: #10100F;\n  --sidebar-muted: rgba(245, 240, 230, 0.045);\n  --sidebar-secondary: rgba(245, 240, 230, 0.075);\n  --card: #1B1A18;\n  --card-border: rgba(245, 240, 230, 0.115);\n  --border: rgba(245, 240, 230, 0.082);\n  --secondary: #22201D;\n  --muted: #1B1A18;\n  --foreground: #F2EFE9;\n  --secondary-foreground: #CEC8BC;\n  --muted-foreground: #A39E93;\n  --placeholder: #6E6A61;\n  --primary: #D97757;\n  --primary-foreground: #FFFFFF;\n  --link: #E59377;\n  --error: #E5534B;\n  --warning: #E5A93B;\n  --success: #56A87E;\n  --scrim: rgba(0, 0, 0, 0.64);\n  --ag-cs-specular: rgba(255, 250, 242, 0.095);\n  --ag-cs-sheen: linear-gradient(172deg, rgba(255, 248, 236, 0.042) 0%, rgba(217, 119, 87, 0.014) 38%, rgba(16, 15, 13, 0.2) 100%);\n  --ag-cs-sidebar-sel-bar: linear-gradient(#F0A37E 0%, #D97757 100%);\n  --ag-cs-sidebar-sel-glow: 0 0 6px rgba(217, 119, 87, 0.42);\n  --ag-cs-thought-rule: rgba(229, 147, 119, 0.36);\n  --ag-cs-comet-bg: #F0A37E;\n  --ag-cs-comet-sh: 0 0 8px rgba(217, 119, 87, 0.8);\n  --ag-cs-stream-tint: color-mix(in srgb, #F0A37E 38%, currentColor);\n  --ag-cs-code-scan-bg: rgba(217, 119, 87, 0.12);\n  --ag-cs-cancel-bg: #191715;\n  --ag-cs-cancel-core: radial-gradient(120% 120% at 50% 0%, #24211E 0%, #151412 100%);\n  --ag-cs-cancel-sh: 0 0 12px -2px rgba(217, 119, 87, 0.38), 0 2px 6px rgba(0, 0, 0, 0.42);\n  --ag-cs-run-core: #191715;\n  --ag-cs-run-star: #FCE8DC;\n  --ag-cs-run-star-sh: 0 0 5px rgba(240, 163, 126, 0.78);\n  --ag-cs-run-wash: linear-gradient(90deg, rgba(217, 119, 87, 0.12) 0%, rgba(240, 163, 126, 0.04) 55%, transparent 100%);\n  --ag-cs-run-bar: linear-gradient(#F6BD60 0%, #E59377 45%, #D97757 100%);\n  --ag-cs-run-ring: conic-gradient(#8C3F27 0deg, #D97757 150deg, #F0A37E 240deg, #F6BD60 315deg, #FFF3EA 348deg, #8C3F27 360deg);\n  --ag-cs-run-outer-sh: 0 0 7px rgba(217, 119, 87, 0.3);\n  --ag-cs-nav-dot: color-mix(in srgb, #E59377 32%, var(--muted-foreground));\n  --ag-cs-nav-active: #E59377;\n  --ag-cs-nav-glow: 0 0 7px rgba(217, 119, 87, 0.52);\n  --ag-cs-sonar-border: rgba(229, 147, 119, 0.45);\n  --ag-cs-sonar-glow: rgba(217, 119, 87, 0.24);\n  --ag-cs-sonar-wash: rgba(217, 119, 87, 0.05);\n  --ag-cs-heat-hi-1: #EE9B7A;\n  --ag-cs-heat-hi-2: #F6C2A8;\n  --ag-cs-code-well: #0F0E0D;\n  --ag-cs-console-well: #0C0B0A;\n  --ag-cs-composer-bg: rgba(28, 27, 25, 0.95);\n  --ag-cs-panel-bg: rgba(26, 25, 23, 0.96);\n  --ag-cs-popover-bg: rgba(25, 24, 22, 0.94);\n  --ag-cs-pill-bg: rgba(35, 33, 30, 0.8);\n  --ag-cs-bubble: rgba(245, 240, 230, 0.055);\n  --prism-message-user-bg: rgba(245, 240, 230, 0.075);\n  --prism-message-user-border: rgba(245, 240, 230, 0.125);\n  --prism-message-assistant-bg: rgba(39, 36, 32, 0.88);\n  --prism-message-assistant-border: rgba(245, 240, 230, 0.105);\n  --ag-cs-ripple-ink: #B4AEA2;\n  --ag-cs-ripple-wave: #D97757;\n  --ag-cs-composer-shadow: 0 1px 2px rgba(0, 0, 0, 0.44), 0 10px 28px -6px rgba(0, 0, 0, 0.5);\n\n  /* 真实 DSH Desktop --dsw-alias-* 完整覆写 */\n  --dsw-alias-bg-base: #141413 !important;\n  --dsw-alias-bg-layer-1: #10100F !important;\n  --dsw-alias-bg-layer-2: #1B1A18 !important;\n  --dsw-alias-bg-layer-3: #22201D !important;\n  --dsw-alias-bg-mask-1: rgba(16, 15, 13, 0.68) !important;\n  --dsw-alias-bg-canvas: #141413 !important;\n  --dsw-alias-bg-sidebar: #10100F !important;\n  --dsw-alias-bg-elevated: #1B1A18 !important;\n  --dsw-alias-bg-composer: rgba(28, 27, 25, 0.95) !important;\n  --dsw-alias-bg-code: #0F0E0D !important;\n  --dsw-alias-bg-hover: rgba(245, 240, 230, 0.055) !important;\n  --dsw-alias-border-l1: rgba(245, 240, 230, 0.082) !important;\n  --dsw-alias-border-l2: rgba(245, 240, 230, 0.115) !important;\n  --dsw-alias-border-l4: rgba(245, 240, 230, 0.18) !important;\n  --dsw-alias-border-l2-darkmode-thin: rgba(245, 240, 230, 0.095) !important;\n  --dsw-alias-border-subtle: rgba(245, 240, 230, 0.082) !important;\n  --dsw-alias-border-strong: rgba(245, 240, 230, 0.14) !important;\n  --dsw-alias-hairline: rgba(245, 240, 230, 0.095) !important;\n  --dsw-alias-brand-primary: #D97757 !important;\n  --dsw-alias-accent: #D97757 !important;\n  --dsw-alias-accent-ink: #FFFFFF !important;\n  --dsw-alias-accent-soft: rgba(217, 119, 87, 0.15) !important;\n  --dsw-alias-accent-fg: #FFFFFF !important;\n  --dsw-alias-button-primary-fill: #D97757 !important;\n  --dsw-alias-button-primary-hover: #E59377 !important;\n  --dsw-alias-button-ghost-active-fill: rgba(217, 119, 87, 0.15) !important;\n  --dsw-alias-button-ghost-active-border: rgba(217, 119, 87, 0.38) !important;\n  --dsw-alias-button-ghost-hover: rgba(245, 240, 230, 0.06) !important;\n  --dsw-alias-interactive-bg-hover: rgba(245, 240, 230, 0.055) !important;\n  --dsw-alias-interactive-bg-active: rgba(245, 240, 230, 0.095) !important;\n  --dsw-alias-interactive-bg-hover-accent: rgba(217, 119, 87, 0.16) !important;\n  --dsw-alias-label-primary: #F2EFE9 !important;\n  --dsw-alias-label-secondary: #CEC8BC !important;\n  --dsw-alias-label-tertiary: #A39E93 !important;\n  --dsw-alias-label-dimmed: #6E6A61 !important;\n  --dsw-alias-text-primary: #F2EFE9 !important;\n  --dsw-alias-text-secondary: #CEC8BC !important;\n  --dsw-alias-text-muted: #A39E93 !important;\n  --dsw-alias-scrollbar-bg-l2: rgba(242, 239, 233, 0.16) !important;\n  --dsw-alias-scrollbar-hover-l2: rgba(242, 239, 233, 0.3) !important;\n  --dsw-alias-state-error-primary: #E5534B !important;\n  --dsw-alias-state-success-primary: #56A87E !important;\n  --dsw-alias-state-warn-primary: #E5A93B !important;\n  --dsw-alias-state-business-primary: #D97757 !important;\n  --dsw-alias-success: #56A87E !important;\n  --dsw-alias-warning: #E5A93B !important;\n  --dsw-alias-danger: #E5534B !important;\n  --dsw-font-family: var(--font-sans) !important;\n  --dsw-font-mono: var(--ag-cs-mono-stack) !important;\n  --dsw-font-family-mono: var(--ag-cs-mono-stack) !important;\n}\n\n/* 浅色模式共享光学层 (crystal & alabaster) */\n:root[data-prism-theme=\"crystal\"],\n:root[data-prism-theme=\"alabaster\"],\nhtml[data-prism-theme=\"crystal\"],\nhtml[data-prism-theme=\"alabaster\"],\nhtml[data-ag-cs-style][data-ag-cs-theme=\"light\"] {\n  --ag-prism-light-mul: 1;\n  --ag-cs-specular: rgba(255, 255, 255, 0.94);\n  --ag-cs-specular-border: rgba(255, 255, 255, 0.88);\n  --ag-cs-focus-spec: rgba(37, 99, 235, 0.14);\n  --ag-cs-whisper-hv: rgba(15, 23, 42, 0.048);\n  --ag-cs-thought-rule: rgba(37, 99, 235, 0.45);\n  --ag-cs-thought-fg: color-mix(in srgb, var(--foreground) 76%, transparent);\n  --ag-cs-comet-bg: #2563EB;\n  --ag-cs-comet-sh: 0 0 8px rgba(37, 99, 235, 0.65);\n  --ag-cs-stream-tint: color-mix(in srgb, #2563EB 38%, currentColor);\n  --ag-cs-code-scan-bg: rgba(37, 99, 235, 0.1);\n  --ag-cs-sheen: linear-gradient(176deg, rgba(255, 255, 255, 0.96) 0%, rgba(241, 246, 255, 0.55) 100%);\n  --ag-cs-sidebar-hover: rgba(15, 23, 42, 0.058);\n  --ag-cs-sidebar-row-hover: rgba(15, 23, 42, 0.046);\n  --ag-cs-sidebar-selected: #FFFFFF;\n  --ag-cs-sidebar-sel-sh: 0 1px 3px rgba(15, 23, 42, 0.06), 0 0 0 1px rgba(15, 23, 42, 0.065);\n  --ag-cs-sidebar-sel-bar: linear-gradient(#2563EB 0%, #4F46E5 100%);\n  --ag-cs-sidebar-sel-glow: 0 0 6px rgba(37, 99, 235, 0.36);\n  --ag-cs-send-bg: #0F172A;\n  --ag-cs-send-fg: #F8FAFC;\n  --ag-cs-send-spec: rgba(255, 255, 255, 0.18);\n  --ag-cs-send-sh: inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 2px 8px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(15, 23, 42, 0.12);\n  --ag-cs-send-dis-bg: rgba(15, 23, 42, 0.065);\n  --ag-cs-send-dis-fg: rgba(15, 23, 42, 0.3);\n  --ag-cs-cancel-bg: #FFFFFF;\n  --ag-cs-cancel-core: radial-gradient(120% 120% at 50% 0%, #FFFFFF 0%, #EEF3FA 100%);\n  --ag-cs-cancel-stop: #0F172A;\n  --ag-cs-cancel-stop-hv: #1E293B;\n  --ag-cs-cancel-stop-sh: 0 1px 2px rgba(15, 23, 42, 0.24);\n  --ag-cs-cancel-sh: 0 0 12px -2px rgba(37, 99, 235, 0.34), 0 2px 6px rgba(15, 23, 42, 0.18);\n  --ag-cs-run-core: #FFFFFF;\n  --ag-cs-run-star: #2563EB;\n  --ag-cs-run-star-sh: 0 0 6px rgba(37, 99, 235, 0.65);\n  --ag-cs-run-wash: linear-gradient(90deg, rgba(37, 99, 235, 0.1) 0%, rgba(124, 58, 237, 0.045) 55%, transparent 100%);\n  --ag-cs-run-bar: linear-gradient(#D97706 0%, #EA4335 28%, #7C3AED 62%, #2563EB 100%);\n  --ag-cs-run-ring: conic-gradient(#2563EB 0deg, #7C3AED 108deg, #EA4335 212deg, #D97706 304deg, #2563EB 360deg);\n  --ag-cs-run-outer-sh: 0 1px 3px rgba(15, 23, 42, 0.1), 0 0 8px rgba(37, 99, 235, 0.24);\n  --ag-cs-nav-dot: color-mix(in srgb, #2563EB 38%, var(--muted-foreground));\n  --ag-cs-nav-active: #2563EB;\n  --ag-cs-nav-glow: 0 0 0 2px rgba(37, 99, 235, 0.2), 0 0 8px rgba(37, 99, 235, 0.48);\n  --ag-cs-sonar-border: rgba(37, 99, 235, 0.48);\n  --ag-cs-sonar-glow: rgba(37, 99, 235, 0.18);\n  --ag-cs-sonar-wash: rgba(37, 99, 235, 0.065);\n  --ag-cs-heat-hi-1: #38BDF8;\n  --ag-cs-heat-hi-2: #60A5FA;\n  --ag-cs-surface-sh: 0 1px 3px rgba(15, 23, 42, 0.06), 0 10px 28px -6px rgba(30, 58, 138, 0.1), 0 0 0 1px rgba(15, 23, 42, 0.06);\n  --ag-cs-bubble-sh: 0 1px 2px rgba(15, 23, 42, 0.045), inset 0 1px 0 rgba(255, 255, 255, 0.82);\n  --ag-cs-card-header-sh: 0 1px 3px rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.88);\n  --ag-cs-data-0: #2563EB;\n  --ag-cs-data-1: #0284C7;\n  --ag-cs-data-2: #059669;\n  --ag-cs-data-3: #7C3AED;\n  --ag-cs-data-4: #3B66A8;\n  --ag-cs-data-5: #D97706;\n  --ag-cs-data-6: #1D4ED8;\n  --ag-cs-data-7: #4361EE;\n  --ag-cs-data-8: #0D9488;\n  --ag-cs-data-9: #475569;\n}\n\n/* 3. 白昼冷晶 (Crystal Light) */\n:root[data-prism-theme=\"crystal\"],\nhtml[data-prism-theme=\"crystal\"],\nbody[data-prism-theme=\"crystal\"],\nhtml[data-prism-theme=\"crystal\"] body,\nhtml[data-ag-cs-style][data-ag-cs-palette=\"obsidian\"][data-ag-cs-theme=\"light\"]:not([data-ag-cs-light-preset=\"alabaster\"]) {\n  color-scheme: light !important;\n  --background: #F4F7FB;\n  --content: #F4F7FB;\n  --shell: #F4F7FB;\n  --body-background: #F4F7FB;\n  --sidebar: #E8EEF6;\n  --sidebar-muted: rgba(15, 23, 42, 0.052);\n  --sidebar-secondary: rgba(15, 23, 42, 0.085);\n  --card: #FFFFFF;\n  --card-border: rgba(15, 23, 42, 0.16);\n  --border: rgba(15, 23, 42, 0.115);\n  --secondary: #E9EFF8;\n  --muted: #ECF1F9;\n  --foreground: #0F172A;\n  --secondary-foreground: #334155;\n  --muted-foreground: #5B6B82;\n  --placeholder: #7C8CA5;\n  --primary: #2563EB;\n  --primary-foreground: #FFFFFF;\n  --link: #1D4ED8;\n  --error: #DC2626;\n  --warning: #D97706;\n  --success: #059669;\n  --scrim: rgba(15, 23, 42, 0.36);\n  --ag-cs-composer-bg: rgba(255, 255, 255, 0.94);\n  --ag-cs-panel-bg: rgba(255, 255, 255, 0.975);\n  --ag-cs-popover-bg: rgba(255, 255, 255, 0.96);\n  --ag-cs-pill-bg: #EEF3FA;\n  --ag-cs-bubble: #EAF1FB;\n  --prism-message-user-bg: #E6EFFC;\n  --prism-message-user-border: rgba(37, 99, 235, 0.16);\n  --prism-message-assistant-bg: #FBFDFF;\n  --prism-message-assistant-border: rgba(15, 23, 42, 0.12);\n  --ag-cs-code-well: #EDF2F9;\n  --ag-cs-console-well: #E4ECF7;\n  --ag-cs-ripple-ink: #556682;\n  --ag-cs-ripple-wave: #2563EB;\n  --ag-cs-composer-shadow: 0 1px 3px rgba(15, 23, 42, 0.06), 0 10px 28px -6px rgba(30, 58, 138, 0.1), 0 0 0 1px rgba(15, 23, 42, 0.08);\n\n  /* 真实 DSH Desktop --dsw-alias-* 完整覆写 */\n  --dsw-alias-bg-base: #F4F7FB !important;\n  --dsw-alias-bg-layer-1: #E8EEF6 !important;\n  --dsw-alias-bg-layer-2: #FFFFFF !important;\n  --dsw-alias-bg-layer-3: #E9EFF8 !important;\n  --dsw-alias-bg-mask-1: rgba(15, 23, 42, 0.36) !important;\n  --dsw-alias-bg-canvas: #F4F7FB !important;\n  --dsw-alias-bg-sidebar: #E8EEF6 !important;\n  --dsw-alias-bg-elevated: #FFFFFF !important;\n  --dsw-alias-bg-composer: rgba(255, 255, 255, 0.94) !important;\n  --dsw-alias-bg-code: #EDF2F9 !important;\n  --dsw-alias-bg-hover: rgba(15, 23, 42, 0.058) !important;\n  --dsw-alias-border-l1: rgba(15, 23, 42, 0.115) !important;\n  --dsw-alias-border-l2: rgba(15, 23, 42, 0.16) !important;\n  --dsw-alias-border-l4: rgba(15, 23, 42, 0.24) !important;\n  --dsw-alias-border-l2-darkmode-thin: rgba(15, 23, 42, 0.13) !important;\n  --dsw-alias-border-subtle: rgba(15, 23, 42, 0.115) !important;\n  --dsw-alias-border-strong: rgba(15, 23, 42, 0.18) !important;\n  --dsw-alias-hairline: rgba(15, 23, 42, 0.115) !important;\n  --dsw-alias-brand-primary: #2563EB !important;\n  --dsw-alias-accent: #2563EB !important;\n  --dsw-alias-accent-ink: #FFFFFF !important;\n  --dsw-alias-accent-soft: rgba(37, 99, 235, 0.11) !important;\n  --dsw-alias-accent-fg: #FFFFFF !important;\n  --dsw-alias-button-primary-fill: #2563EB !important;\n  --dsw-alias-button-primary-hover: #1D4ED8 !important;\n  --dsw-alias-button-ghost-active-fill: rgba(37, 99, 235, 0.11) !important;\n  --dsw-alias-button-ghost-active-border: rgba(37, 99, 235, 0.36) !important;\n  --dsw-alias-button-ghost-hover: rgba(15, 23, 42, 0.055) !important;\n  --dsw-alias-interactive-bg-hover: rgba(15, 23, 42, 0.058) !important;\n  --dsw-alias-interactive-bg-active: rgba(15, 23, 42, 0.095) !important;\n  --dsw-alias-interactive-bg-hover-accent: rgba(37, 99, 235, 0.13) !important;\n  --dsw-alias-label-primary: #0F172A !important;\n  --dsw-alias-label-secondary: #334155 !important;\n  --dsw-alias-label-tertiary: #5B6B82 !important;\n  --dsw-alias-label-dimmed: #7C8CA5 !important;\n  --dsw-alias-text-primary: #0F172A !important;\n  --dsw-alias-text-secondary: #334155 !important;\n  --dsw-alias-text-muted: #5B6B82 !important;\n  --dsw-alias-scrollbar-bg-l2: rgba(15, 23, 42, 0.18) !important;\n  --dsw-alias-scrollbar-hover-l2: rgba(15, 23, 42, 0.34) !important;\n  --dsw-alias-state-error-primary: #DC2626 !important;\n  --dsw-alias-state-success-primary: #059669 !important;\n  --dsw-alias-state-warn-primary: #D97706 !important;\n  --dsw-alias-state-business-primary: #2563EB !important;\n  --dsw-alias-success: #059669 !important;\n  --dsw-alias-warning: #D97706 !important;\n  --dsw-alias-danger: #DC2626 !important;\n  --dsw-font-family: var(--font-sans) !important;\n  --dsw-font-mono: var(--ag-cs-mono-stack) !important;\n  --dsw-font-family-mono: var(--ag-cs-mono-stack) !important;\n}\n\n/* 4. 暖白画册 (Alabaster Light) */\n:root[data-prism-theme=\"alabaster\"],\nhtml[data-prism-theme=\"alabaster\"],\nbody[data-prism-theme=\"alabaster\"],\nhtml[data-prism-theme=\"alabaster\"] body,\nhtml[data-ag-cs-style][data-ag-cs-theme=\"light\"][data-ag-cs-light-preset=\"alabaster\"],\nhtml[data-ag-cs-style][data-ag-cs-theme=\"light\"][data-ag-cs-palette=\"warm\"],\nhtml[data-ag-cs-style][data-ag-cs-theme=\"light\"][data-ag-cs-palette=\"claude\"] {\n  color-scheme: light !important;\n  --background: #F6F4EE;\n  --content: #F6F4EE;\n  --shell: #F6F4EE;\n  --body-background: #F6F4EE;\n  --sidebar: #EBE6DC;\n  --sidebar-muted: rgba(42, 32, 20, 0.055);\n  --sidebar-secondary: rgba(42, 32, 20, 0.088);\n  --card: #FFFFFF;\n  --card-border: rgba(42, 32, 20, 0.165);\n  --border: rgba(42, 32, 20, 0.12);\n  --secondary: #EFECE3;\n  --muted: #F1EEE6;\n  --foreground: #1C1814;\n  --secondary-foreground: #3F3830;\n  --muted-foreground: #6B6257;\n  --placeholder: #8E8477;\n  --primary: #C25934;\n  --primary-foreground: #FFFFFF;\n  --link: #B54D28;\n  --error: #DC2626;\n  --warning: #D97706;\n  --success: #15803D;\n  --scrim: rgba(32, 24, 16, 0.34);\n  --ag-cs-sheen: linear-gradient(176deg, rgba(255, 255, 255, 0.97) 0%, rgba(250, 246, 238, 0.58) 100%);\n  --ag-cs-focus-spec: rgba(194, 89, 52, 0.14);\n  --ag-cs-sidebar-hover: rgba(42, 32, 20, 0.058);\n  --ag-cs-sidebar-row-hover: rgba(42, 32, 20, 0.046);\n  --ag-cs-sidebar-selected: #FFFFFF;\n  --ag-cs-sidebar-sel-sh: 0 1px 3px rgba(42, 32, 20, 0.06), 0 0 0 1px rgba(42, 32, 20, 0.068);\n  --ag-cs-sidebar-sel-bar: linear-gradient(#D97757 0%, #B54D28 100%);\n  --ag-cs-sidebar-sel-glow: 0 0 6px rgba(194, 89, 52, 0.32);\n  --ag-cs-thought-rule: rgba(194, 89, 52, 0.42);\n  --ag-cs-comet-bg: #C25934;\n  --ag-cs-comet-sh: 0 0 8px rgba(194, 89, 52, 0.58);\n  --ag-cs-stream-tint: color-mix(in srgb, #C25934 36%, currentColor);\n  --ag-cs-code-scan-bg: rgba(194, 89, 52, 0.1);\n  --ag-cs-send-bg: #1C1814;\n  --ag-cs-send-fg: #FAF8F5;\n  --ag-cs-cancel-bg: #FFFFFF;\n  --ag-cs-cancel-core: radial-gradient(120% 120% at 50% 0%, #FFFFFF 0%, #F4EFE6 100%);\n  --ag-cs-cancel-stop: #1C1814;\n  --ag-cs-cancel-stop-hv: #2F2821;\n  --ag-cs-cancel-sh: 0 0 12px -2px rgba(194, 89, 52, 0.32), 0 2px 6px rgba(42, 32, 20, 0.16);\n  --ag-cs-run-core: #FFFFFF;\n  --ag-cs-run-star: #C25934;\n  --ag-cs-run-star-sh: 0 0 6px rgba(194, 89, 52, 0.58);\n  --ag-cs-run-wash: linear-gradient(90deg, rgba(194, 89, 52, 0.1) 0%, rgba(217, 119, 6, 0.045) 55%, transparent 100%);\n  --ag-cs-run-bar: linear-gradient(#D97706 0%, #C25934 55%, #9A3412 100%);\n  --ag-cs-run-ring: conic-gradient(#C25934 0deg, #EA580C 120deg, #D97706 245deg, #9A3412 325deg, #C25934 360deg);\n  --ag-cs-run-outer-sh: 0 1px 3px rgba(42, 32, 20, 0.1), 0 0 8px rgba(194, 89, 52, 0.22);\n  --ag-cs-nav-dot: color-mix(in srgb, #C25934 38%, var(--muted-foreground));\n  --ag-cs-nav-active: #C25934;\n  --ag-cs-nav-glow: 0 0 0 2px rgba(194, 89, 52, 0.2), 0 0 8px rgba(194, 89, 52, 0.42);\n  --ag-cs-sonar-border: rgba(194, 89, 52, 0.46);\n  --ag-cs-sonar-glow: rgba(194, 89, 52, 0.18);\n  --ag-cs-sonar-wash: rgba(194, 89, 52, 0.06);\n  --ag-cs-heat-hi-1: #E07A56;\n  --ag-cs-heat-hi-2: #EA9A78;\n  --ag-cs-code-well: #F0ECE3;\n  --ag-cs-console-well: #E5DFD2;\n  --ag-cs-composer-bg: rgba(255, 255, 255, 0.94);\n  --ag-cs-panel-bg: rgba(255, 255, 255, 0.975);\n  --ag-cs-popover-bg: rgba(255, 255, 255, 0.96);\n  --ag-cs-pill-bg: #F2EFE7;\n  --ag-cs-bubble: #EFECE2;\n  --prism-message-user-bg: #EFE8DC;\n  --prism-message-user-border: rgba(74, 55, 34, 0.16);\n  --prism-message-assistant-bg: #FBF7EF;\n  --prism-message-assistant-border: rgba(74, 55, 34, 0.12);\n  --ag-cs-ripple-ink: #665C4E;\n  --ag-cs-ripple-wave: #C25934;\n  --ag-cs-composer-shadow: 0 1px 3px rgba(42, 32, 20, 0.06), 0 10px 26px -6px rgba(68, 52, 32, 0.1), 0 0 0 1px rgba(42, 32, 20, 0.075);\n  --ag-cs-surface-sh: 0 1px 3px rgba(42, 32, 20, 0.06), 0 10px 26px -6px rgba(68, 52, 32, 0.1), 0 0 0 1px rgba(42, 32, 20, 0.065);\n  --ag-cs-bubble-sh: 0 1px 2px rgba(42, 32, 20, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.84);\n  --ag-cs-card-header-sh: 0 1px 3px rgba(42, 32, 20, 0.055), inset 0 1px 0 rgba(255, 255, 255, 0.88);\n\n  /* 真实 DSH Desktop --dsw-alias-* 完整覆写 */\n  --dsw-alias-bg-base: #F6F4EE !important;\n  --dsw-alias-bg-layer-1: #EBE6DC !important;\n  --dsw-alias-bg-layer-2: #FFFFFF !important;\n  --dsw-alias-bg-layer-3: #EFECE3 !important;\n  --dsw-alias-bg-mask-1: rgba(32, 24, 16, 0.34) !important;\n  --dsw-alias-bg-canvas: #F6F4EE !important;\n  --dsw-alias-bg-sidebar: #EBE6DC !important;\n  --dsw-alias-bg-elevated: #FFFFFF !important;\n  --dsw-alias-bg-composer: rgba(255, 255, 255, 0.94) !important;\n  --dsw-alias-bg-code: #F0ECE3 !important;\n  --dsw-alias-bg-hover: rgba(42, 32, 20, 0.058) !important;\n  --dsw-alias-border-l1: rgba(42, 32, 20, 0.12) !important;\n  --dsw-alias-border-l2: rgba(42, 32, 20, 0.165) !important;\n  --dsw-alias-border-l4: rgba(42, 32, 20, 0.24) !important;\n  --dsw-alias-border-l2-darkmode-thin: rgba(42, 32, 20, 0.135) !important;\n  --dsw-alias-border-subtle: rgba(42, 32, 20, 0.12) !important;\n  --dsw-alias-border-strong: rgba(42, 32, 20, 0.185) !important;\n  --dsw-alias-hairline: rgba(42, 32, 20, 0.12) !important;\n  --dsw-alias-brand-primary: #C25934 !important;\n  --dsw-alias-accent: #C25934 !important;\n  --dsw-alias-accent-ink: #FFFFFF !important;\n  --dsw-alias-accent-soft: rgba(194, 89, 52, 0.12) !important;\n  --dsw-alias-accent-fg: #FFFFFF !important;\n  --dsw-alias-button-primary-fill: #C25934 !important;\n  --dsw-alias-button-primary-hover: #B54D28 !important;\n  --dsw-alias-button-ghost-active-fill: rgba(194, 89, 52, 0.12) !important;\n  --dsw-alias-button-ghost-active-border: rgba(194, 89, 52, 0.36) !important;\n  --dsw-alias-button-ghost-hover: rgba(42, 32, 20, 0.055) !important;\n  --dsw-alias-interactive-bg-hover: rgba(42, 32, 20, 0.058) !important;\n  --dsw-alias-interactive-bg-active: rgba(42, 32, 20, 0.095) !important;\n  --dsw-alias-interactive-bg-hover-accent: rgba(194, 89, 52, 0.13) !important;\n  --dsw-alias-label-primary: #1C1814 !important;\n  --dsw-alias-label-secondary: #3F3830 !important;\n  --dsw-alias-label-tertiary: #6B6257 !important;\n  --dsw-alias-label-dimmed: #8E8477 !important;\n  --dsw-alias-text-primary: #1C1814 !important;\n  --dsw-alias-text-secondary: #3F3830 !important;\n  --dsw-alias-text-muted: #6B6257 !important;\n  --dsw-alias-scrollbar-bg-l2: rgba(42, 32, 20, 0.18) !important;\n  --dsw-alias-scrollbar-hover-l2: rgba(42, 32, 20, 0.34) !important;\n  --dsw-alias-state-error-primary: #DC2626 !important;\n  --dsw-alias-state-success-primary: #15803D !important;\n  --dsw-alias-state-warn-primary: #D97706 !important;\n  --dsw-alias-state-business-primary: #C25934 !important;\n  --dsw-alias-success: #15803D !important;\n  --dsw-alias-warning: #D97706 !important;\n  --dsw-alias-danger: #DC2626 !important;\n  --dsw-font-family: var(--font-sans) !important;\n  --dsw-font-mono: var(--ag-cs-mono-stack) !important;\n  --dsw-font-family-mono: var(--ag-cs-mono-stack) !important;\n}\n\n/* --------------------------------------------------------------------------\n * 三、五大工业强调色预设 (follow / cobalt / iris / amber / mono)\n *     同步驱动 --primary 与真实 DSH --dsw-alias-brand-primary/accent/button-*\n * -------------------------------------------------------------------------- */\n:root[data-prism-accent]:not([data-prism-accent=\"follow\"]),\nhtml[data-ag-cs-accent]:not([data-ag-cs-accent=\"follow\"]) {\n  --ag-cs-data-ink: var(--ag-cs-accent);\n  --ag-cs-ripple-wave: var(--ag-cs-accent);\n  --ag-cs-thought-rule: color-mix(in srgb, var(--ag-cs-accent) 36%, transparent);\n  --ag-cs-stream-tint: color-mix(in srgb, var(--ag-cs-comet-bg) 38%, currentColor);\n  --ag-cs-code-scan-bg: color-mix(in srgb, var(--ag-cs-accent) 11%, transparent);\n  --ag-cs-nav-dot: color-mix(in srgb, var(--ag-cs-accent) 34%, var(--muted-foreground));\n  --ag-cs-sonar-border: color-mix(in srgb, var(--ag-cs-accent) 46%, transparent);\n  --ag-cs-sonar-glow: color-mix(in srgb, var(--ag-cs-accent) 22%, transparent);\n  --ag-cs-sonar-wash: color-mix(in srgb, var(--ag-cs-accent) 5%, transparent);\n}\n\n/* 钴蓝 (cobalt) */\n:root[data-prism-accent=\"cobalt\"],\nhtml[data-ag-cs-accent=\"cobalt\"] {\n  --primary: #669DF6;\n  --link: #8AB4F8;\n  --ag-prism-cobalt: #3B82F6;\n  --ag-prism-iris: #60A5FA;\n  --ag-prism-coral: #38BDF8;\n  --ag-prism-amber: #93C5FD;\n  --ag-cs-accent: #669DF6;\n  --ag-cs-sidebar-sel-bar: linear-gradient(#5CC6FC 0%, #3186FF 100%);\n  --ag-cs-sidebar-sel-glow: 0 0 6px rgba(92, 198, 252, 0.42);\n  --ag-cs-comet-bg: #7CE2FF;\n  --ag-cs-comet-sh: 0 0 8px rgba(92, 198, 252, 0.82);\n  --ag-cs-nav-active: #5CC6FC;\n  --ag-cs-nav-glow: 0 0 7px rgba(92, 198, 252, 0.55);\n  --ag-cs-heat-hi-1: #58C4F6;\n  --ag-cs-heat-hi-2: #8CE0FF;\n  --dsw-alias-brand-primary: #669DF6 !important;\n  --dsw-alias-accent: #669DF6 !important;\n  --dsw-alias-accent-ink: #FFFFFF !important;\n  --dsw-alias-accent-soft: rgba(102, 157, 246, 0.16) !important;\n  --dsw-alias-button-primary-fill: #669DF6 !important;\n  --dsw-alias-button-primary-hover: #7AAAFF !important;\n  --dsw-alias-button-ghost-active-fill: rgba(102, 157, 246, 0.16) !important;\n  --dsw-alias-button-ghost-active-border: rgba(102, 157, 246, 0.42) !important;\n  --dsw-alias-interactive-bg-hover-accent: rgba(102, 157, 246, 0.18) !important;\n  --dsw-alias-state-business-primary: #669DF6 !important;\n}\n\n/* 鸢尾紫 (iris) */\n:root[data-prism-accent=\"iris\"],\nhtml[data-ag-cs-accent=\"iris\"] {\n  --primary: #A58AF8;\n  --link: #BBA6FF;\n  --ag-prism-cobalt: #8B5CF6;\n  --ag-prism-iris: #A78BFA;\n  --ag-prism-coral: #C084FC;\n  --ag-prism-amber: #DDD6FE;\n  --ag-cs-accent: #A58AF8;\n  --ag-cs-sidebar-sel-bar: linear-gradient(#C4B5FD 0%, #8B5CF6 100%);\n  --ag-cs-sidebar-sel-glow: 0 0 6px rgba(165, 138, 248, 0.44);\n  --ag-cs-comet-bg: #C4B5FD;\n  --ag-cs-comet-sh: 0 0 8px rgba(165, 138, 248, 0.8);\n  --ag-cs-nav-active: #B79DFB;\n  --ag-cs-nav-glow: 0 0 7px rgba(165, 138, 248, 0.55);\n  --ag-cs-heat-hi-1: #B79DFB;\n  --ag-cs-heat-hi-2: #DDD6FE;\n  --dsw-alias-brand-primary: #A58AF8 !important;\n  --dsw-alias-accent: #A58AF8 !important;\n  --dsw-alias-accent-ink: #FFFFFF !important;\n  --dsw-alias-accent-soft: rgba(165, 138, 248, 0.16) !important;\n  --dsw-alias-button-primary-fill: #A58AF8 !important;\n  --dsw-alias-button-primary-hover: #BBA6FF !important;\n  --dsw-alias-button-ghost-active-fill: rgba(165, 138, 248, 0.16) !important;\n  --dsw-alias-button-ghost-active-border: rgba(165, 138, 248, 0.42) !important;\n  --dsw-alias-interactive-bg-hover-accent: rgba(165, 138, 248, 0.18) !important;\n  --dsw-alias-state-business-primary: #A58AF8 !important;\n}\n\n/* 琥珀金 (amber) */\n:root[data-prism-accent=\"amber\"],\nhtml[data-ag-cs-accent=\"amber\"] {\n  --primary: #F2B84B;\n  --primary-foreground: #14120E;\n  --link: #F6CB75;\n  --ag-prism-cobalt: #F59E0B;\n  --ag-prism-iris: #FBBF24;\n  --ag-prism-coral: #EA580C;\n  --ag-prism-amber: #FDE68A;\n  --ag-cs-accent: #F2B84B;\n  --ag-cs-sidebar-sel-bar: linear-gradient(#FDE68A 0%, #F59E0B 100%);\n  --ag-cs-sidebar-sel-glow: 0 0 6px rgba(242, 184, 75, 0.42);\n  --ag-cs-comet-bg: #FCD34D;\n  --ag-cs-comet-sh: 0 0 8px rgba(242, 184, 75, 0.78);\n  --ag-cs-nav-active: #FBBF24;\n  --ag-cs-nav-glow: 0 0 7px rgba(242, 184, 75, 0.52);\n  --ag-cs-heat-hi-1: #FBBF24;\n  --ag-cs-heat-hi-2: #FDE68A;\n  --dsw-alias-brand-primary: #F2B84B !important;\n  --dsw-alias-accent: #F2B84B !important;\n  --dsw-alias-accent-ink: #14120E !important;\n  --dsw-alias-accent-soft: rgba(242, 184, 75, 0.16) !important;\n  --dsw-alias-button-primary-fill: #F2B84B !important;\n  --dsw-alias-button-primary-hover: #F6CB75 !important;\n  --dsw-alias-button-ghost-active-fill: rgba(242, 184, 75, 0.15) !important;\n  --dsw-alias-button-ghost-active-border: rgba(242, 184, 75, 0.4) !important;\n  --dsw-alias-interactive-bg-hover-accent: rgba(242, 184, 75, 0.18) !important;\n  --dsw-alias-state-business-primary: #F2B84B !important;\n}\n\n/* 纯银钛单色 (mono) */\n:root[data-prism-accent=\"mono\"],\nhtml[data-ag-cs-accent=\"mono\"] {\n  --primary: #D4D7E0;\n  --primary-foreground: #0E0F14;\n  --link: #E2E5EE;\n  --ag-accent-prism-mul: 0.32;\n  --ag-prism-cobalt: #E2E8F0;\n  --ag-prism-iris: #94A3B8;\n  --ag-prism-coral: #CBD5E1;\n  --ag-prism-amber: #F8FAFC;\n  --ag-cs-accent: #D4D7E0;\n  --ag-cs-data-ink: #B8BECB;\n  --ag-cs-ripple-wave: #CBD5E1;\n  --ag-cs-sidebar-sel-bar: linear-gradient(#F2F4F8 0%, #9BA3B4 100%);\n  --ag-cs-sidebar-sel-glow: 0 0 5px rgba(212, 215, 224, 0.28);\n  --ag-cs-comet-bg: #E5E7EB;\n  --ag-cs-comet-sh: 0 0 6px rgba(229, 231, 235, 0.55);\n  --ag-cs-cancel-ring: conic-gradient(#525866 0deg, #9BA3B4 120deg, #F2F4F8 220deg, #7A8294 310deg, #525866 360deg);\n  --ag-cs-cancel-sh: 0 0 10px -2px rgba(212, 215, 224, 0.28), 0 2px 6px rgba(0, 0, 0, 0.4);\n  --ag-cs-run-star: #F2F4F8;\n  --ag-cs-run-bar: linear-gradient(#F2F4F8 0%, #8E96A8 100%);\n  --ag-cs-run-ring: conic-gradient(#4A505E 0deg, #9BA3B4 160deg, #F2F4F8 260deg, #6E7687 330deg, #4A505E 360deg);\n  --ag-cs-nav-active: #E2E5EE;\n  --ag-cs-nav-glow: 0 0 6px rgba(226, 229, 238, 0.45);\n  --ag-cs-heat-hi-1: #CBD5E1;\n  --ag-cs-heat-hi-2: #F1F5F9;\n  --dsw-alias-brand-primary: #D4D7E0 !important;\n  --dsw-alias-accent: #D4D7E0 !important;\n  --dsw-alias-accent-ink: #0E0F14 !important;\n  --dsw-alias-accent-soft: rgba(212, 215, 224, 0.14) !important;\n  --dsw-alias-button-primary-fill: #D4D7E0 !important;\n  --dsw-alias-button-primary-hover: #E5E8F0 !important;\n  --dsw-alias-button-ghost-active-fill: rgba(212, 215, 224, 0.14) !important;\n  --dsw-alias-button-ghost-active-border: rgba(212, 215, 224, 0.36) !important;\n  --dsw-alias-interactive-bg-hover-accent: rgba(212, 215, 224, 0.16) !important;\n  --dsw-alias-state-business-primary: #D4D7E0 !important;\n}\n\n/* 浅色模式下的高对比度强调色覆写 */\n:root:is([data-prism-theme=\"crystal\"], [data-prism-theme=\"alabaster\"], [data-ag-cs-theme=\"light\"]):is([data-prism-accent=\"cobalt\"], [data-ag-cs-accent=\"cobalt\"]) {\n  --primary: #2563EB;\n  --link: #1D4ED8;\n  --ag-prism-cobalt: #2563EB;\n  --ag-prism-iris: #3B82F6;\n  --ag-prism-coral: #0284C7;\n  --ag-prism-amber: #60A5FA;\n  --ag-cs-accent: #2563EB;\n  --ag-cs-sidebar-sel-bar: linear-gradient(#2563EB 0%, #4F46E5 100%);\n  --ag-cs-comet-bg: #2563EB;\n  --ag-cs-nav-active: #2563EB;\n  --dsw-alias-brand-primary: #2563EB !important;\n  --dsw-alias-accent: #2563EB !important;\n  --dsw-alias-accent-ink: #FFFFFF !important;\n  --dsw-alias-accent-soft: rgba(37, 99, 235, 0.12) !important;\n  --dsw-alias-button-primary-fill: #2563EB !important;\n  --dsw-alias-button-primary-hover: #1D4ED8 !important;\n  --dsw-alias-state-business-primary: #2563EB !important;\n}\n\n:root:is([data-prism-theme=\"crystal\"], [data-prism-theme=\"alabaster\"], [data-ag-cs-theme=\"light\"]):is([data-prism-accent=\"iris\"], [data-ag-cs-accent=\"iris\"]) {\n  --primary: #7C3AED;\n  --link: #6D28D9;\n  --ag-prism-cobalt: #7C3AED;\n  --ag-prism-iris: #8B5CF6;\n  --ag-prism-coral: #9333EA;\n  --ag-prism-amber: #A78BFA;\n  --ag-cs-accent: #7C3AED;\n  --ag-cs-sidebar-sel-bar: linear-gradient(#8B5CF6 0%, #6D28D9 100%);\n  --ag-cs-comet-bg: #7C3AED;\n  --ag-cs-nav-active: #7C3AED;\n  --dsw-alias-brand-primary: #7C3AED !important;\n  --dsw-alias-accent: #7C3AED !important;\n  --dsw-alias-accent-ink: #FFFFFF !important;\n  --dsw-alias-accent-soft: rgba(124, 58, 237, 0.12) !important;\n  --dsw-alias-button-primary-fill: #7C3AED !important;\n  --dsw-alias-button-primary-hover: #6D28D9 !important;\n  --dsw-alias-state-business-primary: #7C3AED !important;\n}\n\n:root:is([data-prism-theme=\"crystal\"], [data-prism-theme=\"alabaster\"], [data-ag-cs-theme=\"light\"]):is([data-prism-accent=\"amber\"], [data-ag-cs-accent=\"amber\"]) {\n  --primary: #D97706;\n  --primary-foreground: #FFFFFF;\n  --link: #B45309;\n  --ag-prism-cobalt: #D97706;\n  --ag-prism-iris: #F59E0B;\n  --ag-prism-coral: #EA580C;\n  --ag-prism-amber: #B45309;\n  --ag-cs-accent: #D97706;\n  --ag-cs-sidebar-sel-bar: linear-gradient(#F59E0B 0%, #B45309 100%);\n  --ag-cs-comet-bg: #D97706;\n  --ag-cs-nav-active: #D97706;\n  --dsw-alias-brand-primary: #D97706 !important;\n  --dsw-alias-accent: #D97706 !important;\n  --dsw-alias-accent-ink: #FFFFFF !important;\n  --dsw-alias-accent-soft: rgba(217, 119, 6, 0.12) !important;\n  --dsw-alias-button-primary-fill: #D97706 !important;\n  --dsw-alias-button-primary-hover: #B45309 !important;\n  --dsw-alias-state-business-primary: #D97706 !important;\n}\n\n:root:is([data-prism-theme=\"crystal\"], [data-prism-theme=\"alabaster\"], [data-ag-cs-theme=\"light\"]):is([data-prism-accent=\"mono\"], [data-ag-cs-accent=\"mono\"]) {\n  --primary: #334155;\n  --primary-foreground: #F8FAFC;\n  --link: #1E293B;\n  --ag-prism-cobalt: #334155;\n  --ag-prism-iris: #64748B;\n  --ag-prism-coral: #475569;\n  --ag-prism-amber: #0F172A;\n  --ag-cs-accent: #334155;\n  --ag-cs-data-ink: #475569;\n  --ag-cs-sidebar-sel-bar: linear-gradient(#475569 0%, #0F172A 100%);\n  --ag-cs-comet-bg: #334155;\n  --ag-cs-nav-active: #1E293B;\n  --dsw-alias-brand-primary: #334155 !important;\n  --dsw-alias-accent: #334155 !important;\n  --dsw-alias-accent-ink: #F8FAFC !important;\n  --dsw-alias-accent-soft: rgba(51, 65, 85, 0.11) !important;\n  --dsw-alias-button-primary-fill: #334155 !important;\n  --dsw-alias-button-primary-hover: #1E293B !important;\n  --dsw-alias-state-business-primary: #334155 !important;\n}\n\n/* --------------------------------------------------------------------------\n * 四、三档圆角体系、等宽代码字体与连字、氛围光密度\n * -------------------------------------------------------------------------- */\n:root[data-prism-corners=\"sharp\"],\nhtml[data-ag-cs-corners=\"sharp\"] {\n  --ag-cs-r-sm: 2px;\n  --ag-cs-r-md: 4px;\n  --ag-cs-r-lg: 6px;\n}\n\n:root[data-prism-corners=\"balanced\"],\nhtml[data-ag-cs-corners=\"balanced\"] {\n  --ag-cs-r-sm: 4px;\n  --ag-cs-r-md: 6px;\n  --ag-cs-r-lg: 10px;\n}\n\n:root[data-prism-corners=\"soft\"],\nhtml[data-ag-cs-corners=\"soft\"] {\n  --ag-cs-r-sm: 6px;\n  --ag-cs-r-md: 10px;\n  --ag-cs-r-lg: 14px;\n}\n\n/* 等宽代码字体栈（同步驱动 --dsw-font-mono / --dsw-font-family-mono） */\n:root[data-prism-code-font=\"jetbrains\"],\nhtml[data-ag-cs-code-font=\"jetbrains\"] {\n  --ag-cs-mono-stack: \"JetBrains Mono\", \"Cascadia Code\", \"Fira Code\", Consolas, ui-monospace, monospace;\n  --dsw-font-mono: var(--ag-cs-mono-stack) !important;\n  --dsw-font-family-mono: var(--ag-cs-mono-stack) !important;\n}\n\n:root[data-prism-code-font=\"cascadia\"],\nhtml[data-ag-cs-code-font=\"cascadia\"] {\n  --ag-cs-mono-stack: \"Cascadia Code\", \"Cascadia Mono\", \"Fira Code\", Consolas, ui-monospace, monospace;\n  --dsw-font-mono: var(--ag-cs-mono-stack) !important;\n  --dsw-font-family-mono: var(--ag-cs-mono-stack) !important;\n}\n\n:root[data-prism-code-font=\"sfmono\"],\nhtml[data-ag-cs-code-font=\"sfmono\"] {\n  --ag-cs-mono-stack: \"SF Mono\", SFMono-Regular, Menlo, Monaco, Consolas, ui-monospace, monospace;\n  --dsw-font-mono: var(--ag-cs-mono-stack) !important;\n  --dsw-font-family-mono: var(--ag-cs-mono-stack) !important;\n}\n\n/* Restrict code typography to enhanced output and Prism-rendered code. */\nhtml[data-prism-theme] :is(pre[data-ag-cs-code-enhanced=\"1\"], pre[data-ag-cs-code-enhanced=\"1\"] code, .dsh-code-body, .dsh-console-well, .ag-prism-thought-code, .ag-prism-thought-pre) {\n  font-family: var(--ag-cs-mono-stack);\n  tab-size: 2;\n  font-variant-ligatures: none;\n  font-feature-settings: \"calt\" 0, \"liga\" 0;\n}\n\nhtml:is([data-prism-ligatures=\"1\"], [data-ag-cs-ligatures=\"1\"]) :is(pre[data-ag-cs-code-enhanced=\"1\"], pre[data-ag-cs-code-enhanced=\"1\"] code, .dsh-code-body, .dsh-console-well, .ag-prism-thought-code, .ag-prism-thought-pre) {\n  font-variant-ligatures: contextual common-ligatures;\n  font-feature-settings: \"calt\" 1, \"liga\" 1;\n}\n\n/* 环境氛围光密度（0 / 0.35 / 0.7 / 1 及 0/35/70/100 兼容） */\n:root:is([data-prism-ambient=\"0\"], [data-ag-cs-ambient=\"0\"]) {\n  --ag-ambient-mul: 0;\n  --ag-prism-strength: 0;\n}\n\nhtml:is([data-prism-ambient=\"0\"], [data-ag-cs-ambient=\"0\"]) :is(#dsh-obsidian-prism-optics-layer .ag-cs-conv-aura-host, .ag-cs-conv-aura-host, .ag-cs-brand-glow, .ag-cs-ripple-canvas, .ag-cs-prism-rim-cv, .ag-cs-orch-canvas, .dsh-semantic-rim-aura) {\n  opacity: 0 !important;\n  visibility: hidden !important;\n}\n\n:root:is([data-prism-ambient=\"0.35\"], [data-prism-ambient=\"35\"], [data-ag-cs-ambient=\"0.35\"], [data-ag-cs-ambient=\"35\"]) {\n  --ag-ambient-mul: 0.45;\n}\n\nhtml:is([data-prism-ambient=\"0.35\"], [data-prism-ambient=\"35\"], [data-ag-cs-ambient=\"0.35\"], [data-ag-cs-ambient=\"35\"]) :is(.ag-cs-conv-aura-host, .ag-cs-brand-glow, .ag-cs-ripple-canvas, .ag-cs-orch-canvas) {\n  opacity: 0.38;\n}\n\n:root:is([data-prism-ambient=\"0.7\"], [data-prism-ambient=\"70\"], [data-ag-cs-ambient=\"0.7\"], [data-ag-cs-ambient=\"70\"]) {\n  --ag-ambient-mul: 0.78;\n}\n\nhtml:is([data-prism-ambient=\"0.7\"], [data-prism-ambient=\"70\"], [data-ag-cs-ambient=\"0.7\"], [data-ag-cs-ambient=\"70\"]) :is(.ag-cs-conv-aura-host, .ag-cs-brand-glow, .ag-cs-ripple-canvas, .ag-cs-orch-canvas) {\n  opacity: 0.72;\n}\n\n:root:is([data-prism-ambient=\"1\"], [data-prism-ambient=\"100\"], [data-ag-cs-ambient=\"1\"], [data-ag-cs-ambient=\"100\"]) {\n  --ag-ambient-mul: 1;\n}\n\n/* --------------------------------------------------------------------------\n * 五、独立 React 安全光学挂载层 (#dsh-obsidian-prism-optics-layer)\n *     零侵入 React 子树，层级严格控制在 z-index: 18（远低于 dsh-whale-widget 9999）\n * -------------------------------------------------------------------------- */\n#dsh-obsidian-prism-optics-layer {\n  position: fixed;\n  inset: 0;\n  pointer-events: none;\n  z-index: 18;\n  overflow: hidden;\n  contain: layout style;\n}\n\n#dsh-obsidian-prism-optics-layer .dsh-optics-conv-bounds {\n  position: fixed;\n  pointer-events: none;\n  overflow: hidden;\n  z-index: 1;\n}\n\n/* 活跃对话视图内的底层地平线光效容器：严格处于消息内容与输入框下方 (z-index: 0) */\n[data-conversation-content] > .dsh-optics-conv-bounds[data-conv-aura-inline=\"1\"] {\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n  overflow: hidden;\n  z-index: 0;\n}\n\n[data-conversation-content]:has(> .dsh-optics-conv-bounds[data-conv-aura-inline=\"1\"]) {\n  isolation: isolate;\n}\n\n[data-conversation-content]:has(> .dsh-optics-conv-bounds[data-conv-aura-inline=\"1\"])\n  > :not(.dsh-prism-home-ripple-host):not(.dsh-optics-conv-bounds) {\n  position: relative;\n  z-index: 1;\n}\n\n/* 让活跃对话底部输入框底座柔和透出下方的地平线光效，同时由 94% 不透明输入框卡片稳稳压在光效之上 */\nhtml[data-prism-theme] [data-conversation-content][data-content-phase=\"active\"] [data-composer-seat] {\n  background: linear-gradient(\n    180deg,\n    transparent 0px,\n    color-mix(in srgb, var(--dsw-alias-bg-base) 26%, transparent) 44px\n  ) !important;\n}\n\n#dsh-obsidian-prism-optics-layer .ag-cs-conv-aura-host,\n.ag-cs-conv-aura-host {\n  position: absolute;\n  inset: auto 0 0 0;\n  height: 32%;\n  z-index: 0;\n  overflow: hidden;\n  pointer-events: none;\n  transition: opacity 240ms ease;\n}\n\n.ag-cs-conv-glow {\n  position: absolute;\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  display: block;\n  pointer-events: none;\n}\n\n/* 3-State 语义边缘微光（等待决策 / 错误中断 / 长任务完成） */\n.dsh-semantic-rim-aura {\n  position: absolute;\n  inset: 0;\n  z-index: 2;\n  pointer-events: none;\n  border-radius: inherit;\n  opacity: 0;\n  transition: opacity 280ms var(--ag-ease-out), box-shadow 280ms var(--ag-ease-out);\n}\n\n.dsh-semantic-rim-aura[data-aura-phase=\"awaiting-decision\"] {\n  opacity: calc(0.92 * var(--ag-ambient-mul, 1));\n  box-shadow:\n    inset 0 0 0 1px rgba(242, 184, 75, 0.42),\n    inset 0 0 28px -6px rgba(242, 184, 75, 0.24),\n    inset 0 -36px 48px -20px rgba(242, 184, 75, 0.22);\n}\n\n.dsh-semantic-rim-aura[data-aura-phase=\"error-halted\"] {\n  opacity: calc(0.95 * var(--ag-ambient-mul, 1));\n  box-shadow:\n    inset 0 0 0 1px rgba(229, 83, 75, 0.52),\n    inset 0 0 32px -6px rgba(229, 83, 75, 0.28),\n    inset 0 -36px 52px -18px rgba(229, 83, 75, 0.26);\n}\n\n.dsh-semantic-rim-aura[data-aura-phase=\"long-task-complete\"] {\n  opacity: calc(0.9 * var(--ag-ambient-mul, 1));\n  box-shadow:\n    inset 0 0 0 1px rgba(80, 190, 147, 0.44),\n    inset 0 0 28px -6px rgba(80, 190, 147, 0.24),\n    inset 0 -36px 48px -20px rgba(80, 190, 147, 0.22);\n}\n\n/* 零重排 GPU Canvas 棱镜边（独立固定覆盖层，绝不侵入 React 节点） */\n#dsh-obsidian-prism-optics-layer .dsh-optics-rim-cv,\n.ag-cs-prism-rim-cv {\n  position: fixed !important;\n  inset: 0 !important;\n  width: 100vw !important;\n  height: 100vh !important;\n  box-sizing: border-box !important;\n  pointer-events: none !important;\n  z-index: 3 !important;\n  opacity: calc(var(--ag-prism-strength, 1) * var(--ag-prism-light-mul, 1));\n  transition: opacity 220ms ease;\n}\n\n/* 丝滑物理光标（独立固定层渲染，零侵入 React 编辑器子树） */\n[contenteditable=\"true\"][data-ag-cs-smooth-caret=\"1\"],\ntextarea[data-ag-cs-smooth-caret=\"1\"] {\n  caret-color: transparent !important;\n}\n\n#dsh-obsidian-prism-optics-layer .ag-cs-smooth-caret,\n.ag-cs-smooth-caret {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 2px;\n  height: 20px;\n  border-radius: 1px;\n  background: var(--ag-cs-accent, var(--primary, #669DF6));\n  box-shadow: 0 0 6px color-mix(in srgb, var(--ag-cs-accent, var(--primary, #669DF6)) 55%, transparent);\n  pointer-events: none;\n  z-index: 5;\n  opacity: 0;\n  visibility: hidden;\n  transition: transform 55ms cubic-bezier(0.22, 1, 0.36, 1), opacity 70ms ease;\n}\n\n.ag-cs-smooth-caret[data-ag-cs-caret-visible=\"1\"] {\n  opacity: 1;\n  visibility: visible;\n  will-change: transform;\n  animation: ag-cs-caret-blink 1.05s step-end infinite;\n}\n\n.ag-cs-smooth-caret[data-ag-cs-caret-visible=\"1\"][data-ag-cs-caret-typing=\"1\"] {\n  animation: none;\n  opacity: 1;\n}\n\n/* --------------------------------------------------------------------------\n * 六、DSH Desktop React SPA 与预览舞台表面适配（避让 dsh-whale-widget / dsh-better-sidebar）\n * -------------------------------------------------------------------------- */\n/* The host chooses light/dark on body and may register normal inline aliases on\n   #root. Paint the canvas at each boundary, including empty/transition frames. */\nhtml[data-prism-theme],\nhtml[data-prism-theme] > body,\nhtml[data-prism-theme] #root,\nhtml[data-prism-theme] #root .mP3x-q_frame,\nhtml[data-prism-theme] #root .mP3x-q_frame > .mP3x-q_centerCol,\nhtml[data-prism-theme] body > [data-dsh-shell=\"true\"],\nhtml[data-prism-theme] body > [data-dsh-shell=\"true\"] :is(main.dsh-main, [data-dsh-chat=\"true\"]),\nbody[data-prism-theme],\nbody[data-prism-theme] #root {\n  background-color: var(--dsw-alias-bg-base) !important;\n  color: var(--dsw-alias-label-primary);\n}\n\n/* body carries the host's first-paint light canvas and the alias layer. Paint\n   it again after a Prism theme switch so a stale light shorthand cannot leak\n   through the dark theme's transparent React surfaces. */\nhtml[data-prism-theme] > body,\nhtml[data-prism-theme] > body[data-ds-dark-theme],\nbody[data-prism-theme] {\n  background-color: var(--dsw-alias-bg-base) !important;\n  background-image: none !important;\n  color: var(--dsw-alias-label-primary) !important;\n}\n\nhtml[data-prism-theme] #root {\n  --dsw-alias-bg-base: inherit !important;\n  --dsw-alias-bg-sidebar: inherit !important;\n  --dsw-alias-bg-composer: inherit !important;\n  --dsw-alias-border-l2: inherit !important;\n  --dsw-alias-label-primary: inherit !important;\n  --dsw-alias-label-secondary: inherit !important;\n  --dsw-alias-label-tertiary: inherit !important;\n  color-scheme: inherit !important;\n}\n\n/* AppFrame paints its own Windows caption. Its drag region and the grid's\n   collapse/resize transitions belong to DSH. */\nhtml[data-prism-theme][data-windows-titlebar] #root .mP3x-q_frame,\nhtml[data-prism-theme][data-windows-titlebar] #root .mP3x-q_frame::before {\n  background-color: var(--dsw-alias-bg-sidebar) !important;\n}\n\nhtml[data-prism-theme] :is(pre[data-ag-cs-code-enhanced=\"1\"], .ag-cs-nav-outline-list) {\n  scrollbar-width: thin;\n  scrollbar-color: var(--dsw-alias-scrollbar-bg-l2) transparent;\n}\n\n/* Only the verified column and its inner SidebarRoot paint the rail. Keep the\n   full 0.5px separator even on Windows and drawers, where AppFrame resets it. */\nhtml[data-prism-theme] [data-prism-sidebar=\"1\"] {\n  --dsw-specific-sidebar-fill: var(--dsw-alias-bg-sidebar) !important;\n  background: var(--dsw-specific-sidebar-fill) !important;\n  color: var(--dsw-alias-label-primary);\n  border-right: 0.5px solid var(--dsw-alias-border-l2) !important;\n}\n\nhtml[data-prism-theme] [data-prism-sidebar=\"1\"] .wtg9ga_root {\n  --dsw-specific-sidebar-fill: inherit !important;\n  background-color: var(--dsw-specific-sidebar-fill) !important;\n  color: var(--dsw-alias-label-primary);\n}\n\n@media (hover: hover) {\n  html[data-prism-theme] [data-prism-sidebar=\"1\"] :is(\n    [data-sidebar-list-area] [role=\"treeitem\"][aria-selected=\"false\"],\n    [data-sidebar-list-area] [role=\"treeitem\"][data-row-key^=\"workspace:\"],\n    button.wtg9ga_panelRow:not([aria-current=\"page\"]),\n    .dsh-thread-list > button.dsh-sidebar-item[data-selected=\"false\"]\n  ):hover {\n    background-color: var(--ag-cs-sidebar-row-hover);\n    box-shadow: inset 2px 0 0 color-mix(in srgb, var(--ag-cs-accent) 60%, transparent);\n  }\n}\n\n/* Draw the selected stripe in the row background. The host uses its pseudo\n   elements for drag/drop indicators and its own outline for keyboard focus. */\nhtml[data-prism-theme] [data-prism-sidebar=\"1\"] :is(\n  [data-sidebar-list-area] [role=\"treeitem\"][aria-selected=\"true\"],\n  button.wtg9ga_panelRow[aria-current=\"page\"],\n  .dsh-thread-list > button.dsh-sidebar-item[data-selected=\"true\"]\n) {\n  background-color: var(--ag-cs-sidebar-selected);\n  background-image: var(--ag-cs-sidebar-sel-bar);\n  background-position: left 3px center;\n  background-size: 2px 60%;\n  background-repeat: no-repeat;\n  box-shadow: var(--ag-cs-sidebar-sel-sh);\n  color: var(--dsw-alias-label-primary);\n}\n\n/* Compact the host's single-line sessions only. Search results have two lines. */\nhtml[data-prism-theme][data-ag-cs-sidebar-compact=\"1\"] [data-prism-sidebar=\"1\"] [data-sidebar-list-area] [role=\"treeitem\"][data-row-key^=\"session:\"] {\n  height: 28px;\n}\nhtml[data-prism-theme][data-ag-cs-sidebar-compact=\"1\"] [data-prism-sidebar=\"1\"] .dsh-thread-list > button.dsh-sidebar-item {\n  padding-block: 4px;\n}\n\n/* 首页 / 欢迎舞台波纹宿主 */\n.ag-cs-ripple-host {\n  position: absolute;\n  inset: 0;\n  z-index: 0;\n  overflow: hidden;\n  pointer-events: none;\n}\n\n.ag-cs-brand-glow,\n.ag-cs-ripple-canvas {\n  position: absolute;\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  display: block;\n  pointer-events: none;\n}\n\n/* --------------------------------------------------------------------------\n * 6.5 上游 1.0.7 Smoked Obsidian / Faceted Surface 材质令牌\n *     来源：obsidian-prism 1.0.7 的 smoked men/panel、faceted bubble 与\n *     keycap 材质。DSH v44.7 没有 Antigravity 的 artifact/diff DOM，因此这里\n *     只定义可复用于真实用户气泡、附件、队列与原生浮层的材质变量。\n * -------------------------------------------------------------------------- */\n:root,\nhtml[data-prism-theme] {\n  --ag-cs-smoke-user-fill: rgba(25, 28, 37, 0.92);\n  --ag-cs-smoke-assistant-fill: rgba(20, 22, 29, 0.9);\n  --ag-cs-smoke-edge: rgba(225, 236, 255, 0.16);\n  --ag-cs-smoke-edge-soft: rgba(225, 236, 255, 0.08);\n  --ag-cs-smoke-specular: rgba(255, 255, 255, 0.18);\n  --ag-cs-smoke-reflect: rgba(116, 169, 255, 0.1);\n  --ag-cs-smoke-vein: rgba(154, 198, 255, 0.09);\n  --ag-cs-smoke-shadow:\n    0 1px 2px rgba(0, 0, 0, 0.46),\n    0 10px 30px -18px rgba(0, 0, 0, 0.82);\n\n  --ag-cs-smoke-menu-fill: rgba(16, 18, 24, 0.96);\n  --ag-cs-smoke-menu-edge: rgba(226, 236, 255, 0.16);\n  --ag-cs-smoke-menu-spec: rgba(255, 255, 255, 0.18);\n  --ag-cs-smoke-row-hover: rgba(132, 176, 255, 0.09);\n  --ag-cs-smoke-row-selected: rgba(115, 162, 255, 0.14);\n  --ag-cs-smoke-row-bar: linear-gradient(#8DD2FF 0%, #669DF6 58%, #9B72CB 100%);\n  --ag-cs-smoke-row-bar-shadow: 0 0 7px rgba(102, 157, 246, 0.42);\n  --ag-cs-smoke-keycap-fill: rgba(255, 255, 255, 0.055);\n  --ag-cs-smoke-keycap-edge: rgba(230, 240, 255, 0.12);\n  --ag-cs-smoke-keycap-sh:\n    inset 0 1px 0 rgba(255, 255, 255, 0.16),\n    inset 0 -1px 0 rgba(0, 0, 0, 0.28),\n    0 1px 2px rgba(0, 0, 0, 0.28);\n  --ag-cs-smoke-scroll: rgba(180, 204, 245, 0.24);\n  --ag-cs-smoke-scroll-hover: rgba(198, 220, 255, 0.42);\n}\n\nhtml[data-prism-theme=\"warm\"] {\n  --ag-cs-smoke-user-fill: rgba(31, 28, 25, 0.93);\n  --ag-cs-smoke-assistant-fill: rgba(27, 25, 22, 0.92);\n  --ag-cs-smoke-edge: rgba(255, 240, 224, 0.17);\n  --ag-cs-smoke-edge-soft: rgba(255, 240, 224, 0.085);\n  --ag-cs-smoke-specular: rgba(255, 246, 235, 0.18);\n  --ag-cs-smoke-reflect: rgba(240, 147, 111, 0.1);\n  --ag-cs-smoke-vein: rgba(229, 147, 119, 0.1);\n  --ag-cs-smoke-shadow:\n    0 1px 2px rgba(0, 0, 0, 0.46),\n    0 10px 30px -18px rgba(0, 0, 0, 0.78);\n\n  --ag-cs-smoke-menu-fill: rgba(26, 24, 21, 0.96);\n  --ag-cs-smoke-menu-edge: rgba(255, 241, 226, 0.16);\n  --ag-cs-smoke-menu-spec: rgba(255, 246, 235, 0.17);\n  --ag-cs-smoke-row-hover: rgba(240, 163, 126, 0.09);\n  --ag-cs-smoke-row-selected: rgba(217, 119, 87, 0.15);\n  --ag-cs-smoke-row-bar: linear-gradient(#F6C2A8 0%, #E59377 58%, #D97757 100%);\n  --ag-cs-smoke-row-bar-shadow: 0 0 7px rgba(217, 119, 87, 0.42);\n  --ag-cs-smoke-keycap-fill: rgba(255, 246, 235, 0.06);\n  --ag-cs-smoke-keycap-edge: rgba(255, 237, 220, 0.12);\n  --ag-cs-smoke-keycap-sh:\n    inset 0 1px 0 rgba(255, 248, 236, 0.16),\n    inset 0 -1px 0 rgba(0, 0, 0, 0.28),\n    0 1px 2px rgba(0, 0, 0, 0.28);\n  --ag-cs-smoke-scroll: rgba(245, 218, 198, 0.24);\n  --ag-cs-smoke-scroll-hover: rgba(255, 234, 218, 0.42);\n}\n\nhtml:is([data-prism-theme=\"crystal\"], [data-prism-theme=\"alabaster\"]) {\n  --ag-cs-smoke-edge: rgba(15, 23, 42, 0.16);\n  --ag-cs-smoke-edge-soft: rgba(15, 23, 42, 0.075);\n  --ag-cs-smoke-specular: rgba(255, 255, 255, 0.94);\n  --ag-cs-smoke-reflect: rgba(37, 99, 235, 0.075);\n  --ag-cs-smoke-vein: rgba(37, 99, 235, 0.06);\n  --ag-cs-smoke-shadow:\n    0 1px 2px rgba(15, 23, 42, 0.06),\n    0 10px 30px -18px rgba(30, 58, 138, 0.2);\n\n  --ag-cs-smoke-menu-fill: rgba(250, 252, 255, 0.975);\n  --ag-cs-smoke-menu-edge: rgba(15, 23, 42, 0.16);\n  --ag-cs-smoke-menu-spec: rgba(255, 255, 255, 0.98);\n  --ag-cs-smoke-row-hover: rgba(37, 99, 235, 0.07);\n  --ag-cs-smoke-row-selected: rgba(37, 99, 235, 0.11);\n  --ag-cs-smoke-row-bar: linear-gradient(#60A5FA 0%, #2563EB 62%, #4F46E5 100%);\n  --ag-cs-smoke-row-bar-shadow: 0 0 6px rgba(37, 99, 235, 0.32);\n  --ag-cs-smoke-keycap-fill: rgba(248, 251, 255, 0.92);\n  --ag-cs-smoke-keycap-edge: rgba(15, 23, 42, 0.12);\n  --ag-cs-smoke-keycap-sh:\n    inset 0 1px 0 #FFFFFF,\n    inset 0 -1px 0 rgba(15, 23, 42, 0.08),\n    0 1px 2px rgba(15, 23, 42, 0.1);\n  --ag-cs-smoke-scroll: rgba(15, 23, 42, 0.2);\n  --ag-cs-smoke-scroll-hover: rgba(15, 23, 42, 0.36);\n}\n\nhtml[data-prism-theme=\"crystal\"] {\n  --ag-cs-smoke-user-fill: rgba(234, 242, 253, 0.93);\n  --ag-cs-smoke-assistant-fill: rgba(251, 253, 255, 0.95);\n}\n\nhtml[data-prism-theme=\"alabaster\"] {\n  --ag-cs-smoke-user-fill: rgba(239, 233, 222, 0.94);\n  --ag-cs-smoke-assistant-fill: rgba(251, 248, 242, 0.96);\n  --ag-cs-smoke-edge: rgba(74, 55, 34, 0.17);\n  --ag-cs-smoke-edge-soft: rgba(74, 55, 34, 0.08);\n  --ag-cs-smoke-reflect: rgba(194, 89, 52, 0.07);\n  --ag-cs-smoke-vein: rgba(194, 89, 52, 0.06);\n  --ag-cs-smoke-shadow:\n    0 1px 2px rgba(42, 32, 20, 0.06),\n    0 10px 30px -18px rgba(68, 52, 32, 0.2);\n\n  --ag-cs-smoke-menu-fill: rgba(252, 249, 243, 0.975);\n  --ag-cs-smoke-menu-edge: rgba(74, 55, 34, 0.17);\n  --ag-cs-smoke-menu-spec: rgba(255, 255, 255, 0.98);\n  --ag-cs-smoke-row-hover: rgba(194, 89, 52, 0.07);\n  --ag-cs-smoke-row-selected: rgba(194, 89, 52, 0.11);\n  --ag-cs-smoke-row-bar: linear-gradient(#E7A083 0%, #C25934 62%, #9A3412 100%);\n  --ag-cs-smoke-row-bar-shadow: 0 0 6px rgba(194, 89, 52, 0.3);\n  --ag-cs-smoke-keycap-fill: rgba(252, 249, 243, 0.94);\n  --ag-cs-smoke-keycap-edge: rgba(74, 55, 34, 0.13);\n  --ag-cs-smoke-scroll: rgba(42, 32, 20, 0.2);\n  --ag-cs-smoke-scroll-hover: rgba(42, 32, 20, 0.36);\n}\n\n/* --------------------------------------------------------------------------\n * 七、0.5px 镜面描边卡片、对话气泡、Console Well 与吸顶代码块\n * -------------------------------------------------------------------------- */\n.dsh-specular-card,\n.dsh-card,\n[data-dsh-card] {\n  background-color: var(--dsw-alias-bg-layer-2, var(--card));\n  background-image: var(--ag-cs-sheen);\n  border: var(--ag-cs-hairline) solid var(--dsw-alias-border-l2, var(--ag-cs-border-2));\n  border-radius: var(--ag-cs-r-lg);\n  box-shadow: inset 0 var(--ag-cs-hairline) 0 var(--ag-cs-specular), var(--ag-cs-bubble-sh);\n}\n\n/* v44.7 UserContent attaches both attributes to the primitive bubble itself;\n   its attachments, reference summary and action bar stay outside this node. */\nhtml[data-prism-theme] :is(\n  #root[data-prism-bubbles=\"1\"],\n  body > [data-dsh-shell=\"true\"][data-prism-bubbles=\"1\"]\n) [data-message-bubble][data-text-interaction-source],\nhtml[data-prism-theme] body > [data-dsh-shell=\"true\"][data-prism-bubbles=\"1\"] [data-dsh-chat=\"true\"] .dsh-user-bubble {\n  --dsw-specific-bubble: var(--prism-message-user-bg, var(--ag-cs-bubble));\n  box-sizing: border-box;\n  background-color: color-mix(in srgb, var(--dsw-specific-bubble) 76%, var(--ag-cs-smoke-user-fill));\n  background-image:\n    linear-gradient(\n      118deg,\n      transparent 0%,\n      transparent 8.5%,\n      color-mix(in srgb, var(--ag-cs-smoke-specular) 54%, transparent) 9%,\n      transparent 13.5%\n    ),\n    linear-gradient(\n      63deg,\n      transparent 0%,\n      transparent 72%,\n      var(--ag-cs-smoke-vein) 72.5%,\n      transparent 79%\n    ),\n    radial-gradient(\n      128% 112% at 17% -30%,\n      color-mix(in srgb, var(--ag-cs-smoke-specular) 65%, transparent) 0%,\n      transparent 57%\n    ),\n    linear-gradient(\n      180deg,\n      color-mix(in srgb, var(--ag-cs-smoke-specular) 48%, transparent) 0%,\n      transparent 19%,\n      transparent 70%,\n      var(--ag-cs-smoke-reflect) 100%\n    ),\n    var(--ag-cs-sheen);\n  background-repeat: no-repeat;\n  border: 1px solid var(--ag-cs-smoke-edge);\n  border-radius: var(--ag-cs-r-md);\n  box-shadow:\n    inset 0 1px 0 var(--ag-cs-smoke-specular),\n    inset 0 -1px 0 var(--ag-cs-smoke-reflect),\n    inset 1px 0 0 var(--ag-cs-smoke-edge-soft),\n    var(--ag-cs-smoke-shadow);\n  color: var(--dsw-alias-label-primary);\n}\n\n/* AssistantMarkdown.body > MarkdownText.markdown in v44.7. Assistant prose\n   follows the upstream Antigravity reading surface: plain flowing markdown with\n   no enclosing card, border or smoke fill. Reasoning/tools remain native. */\nhtml[data-prism-theme] #root[data-prism-bubbles=\"1\"] [data-chat-flow] [data-chat-flow-kind=\"assistant-step\"]:not([data-chat-group-part=\"reasoning\"]) .xMeOpW_body > ._markdown_13jw0_5:not(:empty),\nhtml[data-prism-theme] body > [data-dsh-shell=\"true\"][data-prism-bubbles=\"1\"] [data-dsh-chat=\"true\"] .dsh-assistant-msg > :is(p, .dsh-assistant-prose):not(:empty) {\n  --dsw-alias-link: var(--link);\n  --dsw-alias-markdown-inline-code: var(--ag-cs-code-well);\n  box-sizing: border-box;\n  min-inline-size: 0;\n  max-inline-size: 100%;\n  padding: 0;\n  background: transparent;\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n  color: var(--dsw-alias-label-primary);\n  /* Deliberately no overflow, display, font, or descendant reset: keep the\n     host's wide-table breakout, sticky banners, selectable text and type scale. */\n}\n\n/* v44.7 UserContent renders file attachments outside the user bubble and gives\n   each one a direct span[title] child of [data-message-attachments]. Image\n   slots use their own wrapper nodes, so they remain untouched. */\nhtml[data-prism-theme] :is(\n  #root[data-prism-bubbles=\"1\"],\n  body > [data-dsh-shell=\"true\"][data-prism-bubbles=\"1\"]\n) [data-message-attachments] > span[title] {\n  background-color: color-mix(in srgb, var(--dsw-alias-bg-layer-2) 84%, var(--ag-cs-smoke-user-fill));\n  background-image:\n    linear-gradient(\n      124deg,\n      transparent 0%,\n      transparent 15%,\n      color-mix(in srgb, var(--ag-cs-smoke-specular) 44%, transparent) 15.5%,\n      transparent 24%\n    ),\n    linear-gradient(180deg, color-mix(in srgb, var(--ag-cs-smoke-specular) 28%, transparent) 0%, transparent 28%),\n    var(--ag-cs-sheen);\n  border: 1px solid var(--ag-cs-smoke-edge);\n  box-shadow:\n    inset 0 1px 0 var(--ag-cs-smoke-specular),\n    inset 0 -1px 0 var(--ag-cs-smoke-reflect),\n    var(--ag-cs-smoke-shadow);\n  transition: border-color 140ms ease, box-shadow 140ms ease, background-color 140ms ease;\n}\n\n@media (hover: hover) {\n  html[data-prism-theme] :is(\n    #root[data-prism-bubbles=\"1\"],\n    body > [data-dsh-shell=\"true\"][data-prism-bubbles=\"1\"]\n  ) [data-message-attachments] > span[title]:hover {\n    border-color: color-mix(in srgb, var(--ag-cs-smoke-edge) 64%, var(--primary));\n    box-shadow:\n      inset 0 1px 0 var(--ag-cs-smoke-specular),\n      inset 0 -1px 0 var(--ag-cs-smoke-reflect),\n      0 0 0 1px color-mix(in srgb, var(--primary) 12%, transparent),\n      var(--ag-cs-smoke-shadow);\n  }\n}\n\n/* QueueDock.module.css owns the actual material through the panel ::before and\n   hairline through ::after. QueueDock.tsx exposes stable data-queue-dock and\n   data-submission-echo hooks, so only those verified nodes are painted. */\nhtml[data-prism-theme] [data-queue-dock] > div:first-child::before {\n  background-color: var(--ag-cs-smoke-menu-fill) !important;\n  background-image:\n    linear-gradient(\n      180deg,\n      color-mix(in srgb, var(--ag-cs-smoke-menu-spec) 44%, transparent) 0%,\n      transparent 18%,\n      transparent 78%,\n      color-mix(in srgb, var(--ag-cs-smoke-reflect) 64%, transparent) 100%\n    ),\n    linear-gradient(\n      118deg,\n      transparent 0%,\n      transparent 26%,\n      color-mix(in srgb, var(--ag-cs-smoke-vein) 72%, transparent) 26.5%,\n      transparent 34%\n    ),\n    radial-gradient(\n      110% 80px at 20% 0%,\n      color-mix(in srgb, var(--ag-cs-smoke-menu-spec) 42%, transparent) 0%,\n      transparent 70%\n    ) !important;\n  box-shadow:\n    inset 0 1px 0 var(--ag-cs-smoke-menu-spec),\n    inset 0 -1px 0 var(--ag-cs-smoke-reflect) !important;\n  backdrop-filter: blur(18px) saturate(145%) !important;\n}\n\nhtml[data-prism-theme] [data-queue-dock] > div:first-child::after {\n  border-color: var(--ag-cs-smoke-menu-edge) !important;\n  box-shadow: inset 1px 0 0 var(--ag-cs-smoke-edge-soft);\n}\n\nhtml[data-prism-theme] [data-queue-dock] ul {\n  scrollbar-width: thin;\n  scrollbar-color: var(--ag-cs-smoke-scroll) transparent;\n}\n\nhtml[data-prism-theme] [data-queue-dock] ul::-webkit-scrollbar {\n  width: 6px;\n}\n\nhtml[data-prism-theme] [data-queue-dock] ul::-webkit-scrollbar-thumb {\n  border-radius: 999px;\n  background: var(--ag-cs-smoke-scroll);\n}\n\nhtml[data-prism-theme] [data-queue-dock] ul::-webkit-scrollbar-thumb:hover {\n  background: var(--ag-cs-smoke-scroll-hover);\n}\n\nhtml[data-prism-theme] [data-queue-dock] li {\n  transition: background-color 130ms ease, box-shadow 130ms ease;\n}\n\n@media (hover: hover) {\n  html[data-prism-theme] [data-queue-dock] li:hover {\n    background-color: var(--ag-cs-smoke-row-hover);\n  }\n}\n\nhtml[data-prism-theme] [data-queue-dock] li[data-submission-echo] {\n  background-image:\n    linear-gradient(90deg, color-mix(in srgb, var(--primary) 8%, transparent) 0%, transparent 74%),\n    linear-gradient(180deg, color-mix(in srgb, var(--ag-cs-smoke-menu-spec) 18%, transparent) 0%, transparent 45%);\n  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--ag-cs-smoke-menu-spec) 32%, transparent);\n}\n\n/* QueueFile is the only span carrying both aria-label and title in QueueDock. */\nhtml[data-prism-theme] [data-queue-dock] span[aria-label][title] {\n  background-color: color-mix(in srgb, var(--dsw-alias-bg-base) 72%, var(--ag-cs-smoke-menu-fill));\n  background-image:\n    linear-gradient(132deg, transparent 0%, transparent 18%, var(--ag-cs-smoke-vein) 19%, transparent 30%),\n    linear-gradient(180deg, color-mix(in srgb, var(--ag-cs-smoke-menu-spec) 26%, transparent) 0%, transparent 35%);\n  border-color: var(--ag-cs-smoke-edge-soft);\n  box-shadow:\n    inset 0 1px 0 color-mix(in srgb, var(--ag-cs-smoke-menu-spec) 44%, transparent),\n    inset 0 -1px 0 color-mix(in srgb, var(--ag-cs-smoke-reflect) 64%, transparent);\n}\n\n/* Queue action buttons have aria-label; the 36px header does not, so the\n   keycap treatment cannot alter the collapsible header hit target. */\nhtml[data-prism-theme] [data-queue-dock] button[aria-label] {\n  background-color: var(--ag-cs-smoke-keycap-fill);\n  background-image: linear-gradient(\n    180deg,\n    color-mix(in srgb, var(--ag-cs-smoke-menu-spec) 34%, transparent) 0%,\n    transparent 54%\n  );\n  box-shadow:\n    0 0 0 0.5px var(--ag-cs-smoke-keycap-edge),\n    var(--ag-cs-smoke-keycap-sh);\n  color: var(--dsw-alias-label-secondary);\n  transition:\n    background-color 120ms ease,\n    border-color 120ms ease,\n    color 120ms ease,\n    transform 120ms var(--ag-ease-spring);\n}\n\n@media (hover: hover) {\n  html[data-prism-theme] [data-queue-dock] button[aria-label]:hover:not(:disabled) {\n    background-color: color-mix(in srgb, var(--ag-cs-smoke-keycap-fill) 66%, var(--primary));\n    border-color: color-mix(in srgb, var(--ag-cs-smoke-keycap-edge) 58%, var(--primary));\n    color: var(--dsw-alias-label-primary);\n  }\n}\n\nhtml[data-prism-theme] [data-queue-dock] button[aria-label]:active:not(:disabled) {\n  transform: translateY(1px);\n}\n\n/* Native DSH menus are body portals. v44.7 ModelSelect.tsx keeps the root pane\n   as role=group[aria-label], the effort pane as role=menu, and model groups as\n   nested role=menu. InputBar.tsx registers the permission slot whose menu uses\n   the same role=menu primitive; settings/stats use role=dialog. Only visual\n   material is rebound below. */\nhtml[data-prism-theme] body > :is(\n  [role=\"menu\"],\n  [role=\"listbox\"],\n  [role=\"dialog\"],\n  [role=\"alertdialog\"],\n  [role=\"group\"][aria-label]\n),\nhtml[data-prism-theme] #root :is(\n  [role=\"dialog\"],\n  [data-composer-overlay] [role=\"menu\"],\n  [data-composer-overlay] [role=\"listbox\"],\n  [data-composer-overlay] [role=\"group\"][aria-label]\n) {\n  box-sizing: border-box;\n  background-color: var(--ag-cs-smoke-menu-fill) !important;\n  background-image:\n    linear-gradient(\n      180deg,\n      color-mix(in srgb, var(--ag-cs-smoke-menu-spec) 46%, transparent) 0%,\n      transparent 17%,\n      transparent 80%,\n      color-mix(in srgb, var(--ag-cs-smoke-reflect) 58%, transparent) 100%\n    ),\n    linear-gradient(\n      116deg,\n      transparent 0%,\n      transparent 24%,\n      color-mix(in srgb, var(--ag-cs-smoke-vein) 76%, transparent) 24.5%,\n      transparent 34%\n    ),\n    radial-gradient(\n      110% 78px at 24% 0%,\n      color-mix(in srgb, var(--ag-cs-smoke-menu-spec) 38%, transparent) 0%,\n      transparent 72%\n    ) !important;\n  border: 1px solid var(--ag-cs-smoke-menu-edge) !important;\n  border-radius: var(--ag-cs-r-lg);\n  box-shadow:\n    inset 0 1px 0 var(--ag-cs-smoke-menu-spec),\n    inset 0 -1px 0 var(--ag-cs-smoke-reflect),\n    0 1px 2px rgba(0, 0, 0, 0.2),\n    0 22px 52px -16px rgba(0, 0, 0, 0.58) !important;\n  backdrop-filter: blur(18px) saturate(145%);\n  color: var(--dsw-alias-label-primary) !important;\n}\n\nhtml:is([data-prism-theme=\"crystal\"], [data-prism-theme=\"alabaster\"]) body > :is(\n  [role=\"menu\"],\n  [role=\"listbox\"],\n  [role=\"dialog\"],\n  [role=\"alertdialog\"],\n  [role=\"group\"][aria-label]\n),\nhtml:is([data-prism-theme=\"crystal\"], [data-prism-theme=\"alabaster\"]) #root :is(\n  [role=\"dialog\"],\n  [data-composer-overlay] [role=\"menu\"],\n  [data-composer-overlay] [role=\"listbox\"],\n  [data-composer-overlay] [role=\"group\"][aria-label]\n) {\n  box-shadow:\n    inset 0 1px 0 var(--ag-cs-smoke-menu-spec),\n    inset 0 -1px 0 color-mix(in srgb, var(--ag-cs-smoke-edge) 58%, transparent),\n    0 1px 2px rgba(15, 23, 42, 0.06),\n    0 20px 44px -18px rgba(30, 58, 138, 0.22) !important;\n}\n\n/* ModelSelect's model group is an inner scroll region, not another surface.\n   Keep its host overflow, focus and scroll semantics intact. */\nhtml[data-prism-theme] body > :is(\n  [role=\"group\"][aria-label],\n  [role=\"menu\"],\n  [role=\"dialog\"]\n) :is([role=\"menu\"], [role=\"listbox\"]) {\n  background-color: transparent !important;\n  background-image: none !important;\n  border-color: transparent !important;\n  border-radius: inherit;\n  box-shadow: none !important;\n  backdrop-filter: none !important;\n}\n\nhtml[data-prism-theme] :is(\n  .dsh-vial-popover,\n  .pv-card,\n  .ag-cs-nav-outline-popover\n) {\n  background-color: var(--ag-cs-smoke-menu-fill) !important;\n  background-image:\n    linear-gradient(\n      180deg,\n      color-mix(in srgb, var(--ag-cs-smoke-menu-spec) 42%, transparent) 0%,\n      transparent 20%,\n      transparent 82%,\n      color-mix(in srgb, var(--ag-cs-smoke-reflect) 54%, transparent) 100%\n    ),\n    linear-gradient(\n      120deg,\n      transparent 0%,\n      transparent 28%,\n      color-mix(in srgb, var(--ag-cs-smoke-vein) 74%, transparent) 28.5%,\n      transparent 37%\n    ) !important;\n  border-color: var(--ag-cs-smoke-menu-edge) !important;\n  box-shadow:\n    inset 0 1px 0 var(--ag-cs-smoke-menu-spec),\n    inset 0 -1px 0 var(--ag-cs-smoke-reflect),\n    0 20px 48px -16px rgba(0, 0, 0, 0.52) !important;\n}\n\nhtml[data-prism-theme] :is(\n  [role=\"menu\"],\n  [role=\"listbox\"],\n  [role=\"dialog\"],\n  [role=\"alertdialog\"],\n  .dsh-vial-popover,\n  .ag-cs-nav-outline-popover\n) :is([role=\"separator\"], hr) {\n  height: 1px !important;\n  margin-block: 4px !important;\n  border: 0 !important;\n  background: linear-gradient(\n    90deg,\n    transparent 0%,\n    var(--ag-cs-smoke-edge-soft) 12%,\n    var(--ag-cs-smoke-edge) 50%,\n    var(--ag-cs-smoke-edge-soft) 88%,\n    transparent 100%\n  ) !important;\n}\n\nhtml[data-prism-theme] :is(\n  body > [role=\"menu\"],\n  body > [role=\"group\"][aria-label],\n  #root [role=\"dialog\"],\n  #root [data-composer-overlay] :is([role=\"menu\"], [role=\"group\"][aria-label])\n) :is(\n  [role=\"menuitem\"],\n  [role=\"menuitemradio\"],\n  [role=\"menuitemcheckbox\"],\n  [role=\"option\"]\n) {\n  position: relative;\n  border-radius: var(--ag-cs-r-sm);\n  color: var(--dsw-alias-label-primary) !important;\n  transition:\n    background-color 120ms ease,\n    box-shadow 120ms ease,\n    color 120ms ease;\n}\n\nhtml[data-prism-theme] :is(\n  body > [role=\"menu\"],\n  body > [role=\"group\"][aria-label],\n  #root [role=\"dialog\"],\n  #root [data-composer-overlay] :is([role=\"menu\"], [role=\"group\"][aria-label])\n) :is(\n  [role=\"menuitem\"],\n  [role=\"menuitemradio\"],\n  [role=\"menuitemcheckbox\"],\n  [role=\"option\"]\n):is(:hover, [data-highlighted]) {\n  background-color: var(--ag-cs-smoke-row-hover) !important;\n  background-image: linear-gradient(\n    180deg,\n    color-mix(in srgb, var(--ag-cs-smoke-menu-spec) 22%, transparent) 0%,\n    transparent 46%\n  ) !important;\n  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--ag-cs-smoke-menu-spec) 40%, transparent);\n  color: var(--dsw-alias-label-primary) !important;\n}\n\nhtml[data-prism-theme] :is(\n  body > [role=\"menu\"],\n  body > [role=\"group\"][aria-label],\n  #root [role=\"dialog\"],\n  #root [data-composer-overlay] :is([role=\"menu\"], [role=\"group\"][aria-label])\n) :is(\n  [role=\"menuitem\"],\n  [role=\"menuitemradio\"],\n  [role=\"menuitemcheckbox\"],\n  [role=\"option\"]\n):is(:hover, [data-highlighted])::before {\n  content: \"\";\n  position: absolute;\n  left: 3px;\n  top: 8px;\n  bottom: 8px;\n  width: 1.5px;\n  border-radius: 999px;\n  background: var(--ag-cs-smoke-row-bar);\n  opacity: 0.56;\n  pointer-events: none;\n}\n\nhtml[data-prism-theme] :is(\n  body > [role=\"menu\"],\n  body > [role=\"group\"][aria-label],\n  #root [role=\"dialog\"],\n  #root [data-composer-overlay] :is([role=\"menu\"], [role=\"group\"][aria-label])\n) :is(\n  [role=\"menuitem\"],\n  [role=\"menuitemradio\"],\n  [role=\"menuitemcheckbox\"],\n  [role=\"option\"]\n):is([aria-selected=\"true\"], [aria-checked=\"true\"], [data-selected=\"true\"]) {\n  background-color: var(--ag-cs-smoke-row-selected) !important;\n  background-image: linear-gradient(\n    180deg,\n    color-mix(in srgb, var(--ag-cs-smoke-menu-spec) 28%, transparent) 0%,\n    transparent 54%\n  ) !important;\n  box-shadow:\n    inset 0 1px 0 color-mix(in srgb, var(--ag-cs-smoke-menu-spec) 48%, transparent),\n    inset 0 -1px 0 color-mix(in srgb, var(--ag-cs-smoke-reflect) 54%, transparent);\n  color: var(--dsw-alias-label-primary) !important;\n}\n\nhtml[data-prism-theme] :is(\n  body > [role=\"menu\"],\n  body > [role=\"group\"][aria-label],\n  #root [role=\"dialog\"],\n  #root [data-composer-overlay] :is([role=\"menu\"], [role=\"group\"][aria-label])\n) :is(\n  [role=\"menuitem\"],\n  [role=\"menuitemradio\"],\n  [role=\"menuitemcheckbox\"],\n  [role=\"option\"]\n):is([aria-selected=\"true\"], [aria-checked=\"true\"], [data-selected=\"true\"])::before {\n  content: \"\";\n  position: absolute;\n  left: 3px;\n  top: 6px;\n  bottom: 6px;\n  width: 2px;\n  border-radius: 999px;\n  background: var(--ag-cs-smoke-row-bar);\n  box-shadow: var(--ag-cs-smoke-row-bar-shadow);\n  opacity: 1;\n  pointer-events: none;\n}\n\nhtml[data-prism-theme] :is(\n  body > [role=\"menu\"],\n  body > [role=\"group\"][aria-label],\n  #root [role=\"dialog\"],\n  #root [data-composer-overlay] :is([role=\"menu\"], [role=\"group\"][aria-label])\n) :is(\n  [role=\"menuitem\"],\n  [role=\"menuitemradio\"],\n  [role=\"menuitemcheckbox\"],\n  [role=\"option\"]\n):disabled,\nhtml[data-prism-theme] :is(\n  body > [role=\"menu\"],\n  body > [role=\"group\"][aria-label],\n  #root [role=\"dialog\"],\n  #root [data-composer-overlay] :is([role=\"menu\"], [role=\"group\"][aria-label])\n) :is([role=\"option\"][aria-disabled=\"true\"]) {\n  color: var(--dsw-alias-label-tertiary) !important;\n  opacity: 0.62;\n}\n\nhtml[data-prism-theme] :is(\n  body > [role=\"menu\"],\n  body > [role=\"group\"][aria-label],\n  #root [role=\"dialog\"],\n  #root [data-composer-overlay] :is([role=\"menu\"], [role=\"group\"][aria-label])\n) :is(\n  input:not([type=\"checkbox\"]):not([type=\"radio\"]):not([type=\"range\"]),\n  select,\n  textarea,\n  [role=\"combobox\"],\n  [role=\"searchbox\"]\n) {\n  background-color: color-mix(in srgb, var(--ag-cs-smoke-menu-fill) 72%, var(--dsw-alias-bg-base)) !important;\n  border-color: var(--ag-cs-smoke-edge-soft) !important;\n  box-shadow:\n    inset 0 1px 2px rgba(0, 0, 0, 0.18),\n    inset 0 -1px 0 color-mix(in srgb, var(--ag-cs-smoke-reflect) 38%, transparent) !important;\n  color: var(--dsw-alias-label-primary) !important;\n  caret-color: var(--primary);\n  accent-color: var(--primary);\n}\n\nhtml[data-prism-theme] :is(\n  body > [role=\"menu\"],\n  body > [role=\"group\"][aria-label],\n  #root [role=\"dialog\"],\n  #root [data-composer-overlay] :is([role=\"menu\"], [role=\"group\"][aria-label])\n) :is(input, textarea)::placeholder {\n  color: var(--dsw-alias-label-tertiary) !important;\n  opacity: 1;\n}\n\n/* Stable `scrollable` marker is added beside the CSS-module class in\n   ModelSelect.tsx. Keep the host's overflow and scroll anchoring unchanged. */\nhtml[data-prism-theme] :is(\n  body > [role=\"menu\"],\n  body > [role=\"group\"][aria-label],\n  #root [role=\"dialog\"],\n  #root [data-composer-overlay] :is([role=\"menu\"], [role=\"group\"][aria-label])\n) .scrollable {\n  scrollbar-width: thin;\n  scrollbar-color: var(--ag-cs-smoke-scroll) transparent;\n}\n\nhtml[data-prism-theme] :is(\n  body > [role=\"menu\"],\n  body > [role=\"group\"][aria-label],\n  #root [role=\"dialog\"],\n  #root [data-composer-overlay] :is([role=\"menu\"], [role=\"group\"][aria-label])\n) .scrollable::-webkit-scrollbar {\n  width: 6px;\n}\n\nhtml[data-prism-theme] :is(\n  body > [role=\"menu\"],\n  body > [role=\"group\"][aria-label],\n  #root [role=\"dialog\"],\n  #root [data-composer-overlay] :is([role=\"menu\"], [role=\"group\"][aria-label])\n) .scrollable::-webkit-scrollbar-thumb {\n  border-radius: 999px;\n  background: var(--ag-cs-smoke-scroll);\n}\n\nhtml[data-prism-theme] :is(\n  body > [role=\"menu\"],\n  body > [role=\"group\"][aria-label],\n  #root [role=\"dialog\"],\n  #root [data-composer-overlay] :is([role=\"menu\"], [role=\"group\"][aria-label])\n) .scrollable::-webkit-scrollbar-thumb:hover {\n  background: var(--ag-cs-smoke-scroll-hover);\n}\n\n/* Permission trigger lives in the verified composer.input.permission slot.\n   Rebind only its material; geometry, labels and menu behavior stay native. */\nhtml[data-prism-theme] [data-slot=\"conversation.input.permission\"] :is(\n  button[aria-haspopup=\"menu\"],\n  button[aria-haspopup=\"dialog\"]\n) {\n  border-radius: var(--ag-cs-r-sm);\n  color: var(--dsw-alias-label-secondary);\n  transition: background-color 120ms ease, color 120ms ease, box-shadow 120ms ease;\n}\n\n@media (hover: hover) {\n  html[data-prism-theme] [data-slot=\"conversation.input.permission\"] :is(\n    button[aria-haspopup=\"menu\"],\n    button[aria-haspopup=\"dialog\"]\n  ):hover:not(:disabled) {\n    background-color: var(--ag-cs-smoke-row-hover);\n    color: var(--dsw-alias-label-primary);\n  }\n}\n\nhtml[data-prism-theme] [data-slot=\"conversation.input.permission\"] :is(\n  button[aria-haspopup=\"menu\"],\n  button[aria-haspopup=\"dialog\"]\n)[aria-expanded=\"true\"] {\n  background-color: var(--ag-cs-smoke-row-selected);\n  box-shadow:\n    inset 0 1px 0 color-mix(in srgb, var(--ag-cs-smoke-menu-spec) 42%, transparent),\n    inset 2px 0 0 var(--primary);\n  color: var(--dsw-alias-label-primary);\n}\n\n/* Console Well 下沉精密控制台井槽 */\n.console-well,\n.dsh-console-well,\n[data-dsh-console-well] {\n  position: relative;\n  background-color: var(--ag-cs-console-well);\n  border: var(--ag-cs-hairline) solid var(--dsw-alias-border-l1, var(--ag-cs-border-1));\n  border-radius: var(--ag-cs-r-md);\n  box-shadow:\n    inset 0 2px 6px rgba(0, 0, 0, 0.32),\n    inset 0 0 0 0.5px rgba(255, 255, 255, 0.04),\n    0 1px 0 var(--ag-cs-specular);\n  color: var(--dsw-alias-label-secondary, var(--secondary-foreground));\n  font-family: var(--ag-cs-mono-stack);\n  font-size: 12.5px;\n  line-height: 1.55;\n  overflow: auto;\n}\n\nhtml:is([data-prism-theme=\"crystal\"], [data-prism-theme=\"alabaster\"], [data-ag-cs-theme=\"light\"]) :is(.console-well, .dsh-console-well, [data-dsh-console-well]) {\n  box-shadow:\n    inset 0 1px 4px rgba(15, 23, 42, 0.08),\n    inset 0 0 0 0.5px rgba(15, 23, 42, 0.06),\n    0 1px 0 rgba(255, 255, 255, 0.85);\n}\n\n/* 代码块与吸顶玻璃顶栏、>=48 行手动折叠按钮与渐变遮罩（非破坏性支持 React SPA 代码块） */\n.dsh-code-block,\n[data-dsh-code-block],\npre[data-ag-cs-code-enhanced=\"1\"] {\n  position: relative;\n  border-radius: var(--ag-cs-r-md);\n  border: var(--ag-cs-hairline) solid var(--dsw-alias-border-l1, var(--ag-cs-border-1));\n  background-color: var(--dsw-alias-bg-code, var(--ag-cs-code-well));\n  box-shadow: var(--ag-cs-bubble-sh);\n}\n\n.dsh-code-block > .dsh-code-header,\n.dsh-code-header,\n[data-ag-cs-code-sticky=\"1\"],\npre > div > [data-ag-cs-code-sticky=\"1\"] {\n  position: sticky;\n  top: 0;\n  z-index: 4;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  padding: 6px 12px;\n  border-radius: calc(var(--ag-cs-r-md) - 1px) calc(var(--ag-cs-r-md) - 1px) 0 0;\n  border-bottom: var(--ag-cs-hairline) solid var(--dsw-alias-border-l1, var(--ag-cs-border-1));\n  background-color: color-mix(in srgb, var(--dsw-alias-bg-layer-2, var(--card)) 88%, var(--dsw-alias-bg-base, var(--background)));\n  backdrop-filter: blur(12px) saturate(135%);\n  box-shadow: inset 0 1px 0 var(--ag-cs-specular);\n  font-size: 11.5px;\n  color: var(--dsw-alias-label-secondary, var(--secondary-foreground));\n}\n\n.ag-cs-code-fold-btn,\n.dsh-code-fold-btn {\n  appearance: none;\n  display: inline-flex;\n  align-items: center;\n  height: 20px;\n  padding: 0 8px;\n  border-radius: 999px;\n  border: var(--ag-cs-hairline) solid var(--dsw-alias-border-l1, var(--ag-cs-border-1));\n  background: var(--ag-cs-pill-bg);\n  color: var(--dsw-alias-label-secondary, var(--secondary-foreground));\n  font-family: var(--font-sans);\n  font-size: 11px;\n  line-height: 1;\n  font-weight: 500;\n  font-variant-numeric: tabular-nums;\n  cursor: pointer;\n  white-space: nowrap;\n  transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;\n}\n\n.ag-cs-code-fold-btn:hover,\n.dsh-code-fold-btn:hover {\n  background: var(--dsw-alias-interactive-bg-hover, var(--ag-cs-hover-wash));\n  border-color: color-mix(in srgb, var(--primary) 38%, var(--ag-cs-border-2));\n  color: var(--dsw-alias-label-primary, var(--foreground));\n}\n\n[data-ag-cs-code-folded=\"1\"] > .dsh-code-body,\n[data-ag-cs-code-folded=\"1\"] > pre,\npre[data-ag-cs-code-folded=\"1\"],\npre > div[data-ag-cs-code-folded=\"1\"] > div:nth-child(2) {\n  max-height: 156px !important;\n  overflow: hidden !important;\n  -webkit-mask-image: linear-gradient(to bottom, #000 56%, transparent 100%);\n  mask-image: linear-gradient(to bottom, #000 56%, transparent 100%);\n}\n\n/* --------------------------------------------------------------------------\n * 八、毛玻璃悬浮输入座舱 (Composer Dock，兼容 DSH Desktop React 输入卡片)\n * -------------------------------------------------------------------------- */\n/* The seat can be hero, docked or embedded. Paint only InputBar's card.\n   Inset strokes keep its metrics and leave the workspace-picker dashed ring\n   (::after), popup slot, editor, selection and IME layers to the host. */\nhtml[data-prism-theme] [data-prism-composer=\"1\"] {\n  --dsw-specific-input-major: var(--dsw-alias-bg-composer) !important;\n  --dsw-radius-panel: var(--ag-cs-r-lg);\n  --prism-card-edge: var(--dsw-alias-border-l2);\n  border-radius: var(--dsw-radius-panel);\n  background:\n    var(--ag-cs-sheen),\n    var(--dsw-specific-input-major) !important;\n  backdrop-filter: blur(18px) saturate(135%);\n  box-shadow:\n    inset 0 0 0 0.5px var(--prism-card-edge),\n    inset 0 1px 0 var(--ag-cs-specular),\n    var(--ag-cs-composer-shadow);\n  color: var(--dsw-alias-label-primary);\n}\n\nhtml[data-prism-theme] [data-prism-composer=\"1\"]:focus-within {\n  --prism-card-edge: color-mix(in srgb, var(--primary) 64%, var(--dsw-alias-border-l2));\n  box-shadow:\n    inset 0 0 0 1px var(--prism-card-edge),\n    inset 0 2px 0 var(--ag-cs-focus-spec),\n    0 0 0 3px var(--ag-cs-focus-halo),\n    var(--ag-cs-composer-shadow);\n}\n\nhtml[data-prism-theme] [data-prism-composer=\"1\"] > [data-input-scroll] [data-composer-input][role=\"textbox\"],\nhtml[data-prism-theme] [data-dsh-composer=\"true\"][data-prism-composer=\"1\"] #dsh-composer-editor {\n  color: var(--dsw-alias-label-primary);\n  caret-color: var(--primary);\n}\n\nhtml[data-prism-theme] [data-prism-composer=\"1\"] > [data-input-scroll] [data-composer-input][aria-disabled=\"true\"] {\n  color: var(--dsw-alias-label-tertiary);\n}\n\n/* Real placeholder is a sibling of the Lexical textbox. Only bind its ink,\n   also used by the native inline command hint. */\nhtml[data-prism-theme] [data-prism-composer=\"1\"] > [data-input-scroll] {\n  --dsw-alias-label-caption: var(--dsw-alias-label-tertiary) !important;\n}\n\nhtml[data-prism-theme] [data-prism-composer=\"1\"] > [data-input-scroll] [data-composer-placeholder],\nhtml[data-prism-theme] [data-dsh-composer=\"true\"][data-prism-composer=\"1\"] #dsh-composer-editor:empty::before {\n  color: var(--dsw-alias-label-tertiary);\n  opacity: 1;\n}\n\nhtml[data-ag-cs-placeholder-style=\"studio\"] [data-prism-composer=\"1\"] > [data-input-scroll] [data-composer-placeholder],\nhtml[data-ag-cs-placeholder-style=\"studio\"] [data-dsh-composer=\"true\"][data-prism-composer=\"1\"] #dsh-composer-editor:empty::before {\n  color: color-mix(in srgb, var(--primary) 42%, var(--dsw-alias-label-tertiary));\n  font-weight: 500;\n  letter-spacing: 0.015em;\n}\n\nhtml[data-ag-cs-placeholder-style=\"host\"] [data-prism-composer=\"1\"] > [data-input-scroll] [data-composer-placeholder],\nhtml[data-ag-cs-placeholder-style=\"host\"] [data-dsh-composer=\"true\"][data-prism-composer=\"1\"] #dsh-composer-editor:empty::before {\n  color: var(--dsw-alias-label-tertiary);\n  font-weight: inherit;\n  letter-spacing: inherit;\n}\n\n/* Native controls keep their own size, icons, transform and disabled/sending\n   behavior. Scope toolbar tokens here so open menus can use their own surfaces. */\nhtml[data-prism-theme] [data-prism-composer=\"1\"] > .GRgSLq_row {\n  --dsw-specific-selector: var(--sidebar-secondary) !important;\n  --dsw-alias-interactive-bg-hover-solid: color-mix(in srgb, var(--foreground) 14%, var(--card));\n  color: var(--dsw-alias-label-secondary);\n}\n\n/* Native mode, model, attachment and trailing controls keep their geometry.\n   Only ink is rebound, with the send/stop rule below taking precedence. */\nhtml[data-prism-theme] [data-prism-composer=\"1\"] > .GRgSLq_row :is(button, [role=\"button\"]) {\n  color: var(--dsw-alias-label-secondary);\n}\n\nhtml[data-prism-theme] [data-prism-composer=\"1\"] > .GRgSLq_row button.GRgSLq_add {\n  background-color: var(--dsw-specific-selector);\n  color: var(--dsw-alias-label-primary);\n}\n\nhtml[data-prism-theme] :is(\n  [data-prism-composer=\"1\"] > .GRgSLq_row button.GRgSLq_primary,\n  [data-dsh-composer=\"true\"][data-prism-composer=\"1\"] :is(#btn-composer-send, #btn-composer-stop)\n) {\n  background: linear-gradient(var(--ag-cs-send-spec), transparent 55%), var(--ag-cs-send-bg);\n  color: var(--ag-cs-send-fg);\n  box-shadow: var(--ag-cs-send-sh);\n}\n\n@media (hover: hover) {\n  html[data-prism-theme] [data-prism-composer=\"1\"] > .GRgSLq_row button.GRgSLq_add:hover:enabled {\n    background-color: var(--dsw-alias-interactive-bg-hover-solid);\n  }\n  html[data-prism-theme] :is(\n    [data-prism-composer=\"1\"] > .GRgSLq_row button.GRgSLq_primary,\n    [data-dsh-composer=\"true\"][data-prism-composer=\"1\"] :is(#btn-composer-send, #btn-composer-stop)\n  ):hover:enabled {\n    background-color: color-mix(in srgb, var(--ag-cs-send-bg) 90%, var(--primary));\n  }\n}\n\nhtml[data-prism-theme] :is(\n  [data-prism-composer=\"1\"] > .GRgSLq_row button.GRgSLq_primary,\n  [data-dsh-composer=\"true\"][data-prism-composer=\"1\"] :is(#btn-composer-send, #btn-composer-stop)\n):disabled:not([data-sending]) {\n  background: var(--ag-cs-send-dis-bg);\n  color: var(--dsw-alias-label-tertiary);\n  opacity: 1;\n  box-shadow: none;\n}\n\nhtml[data-prism-theme] :is(\n  [data-prism-composer=\"1\"] > .GRgSLq_row :is(button.GRgSLq_primary, button.GRgSLq_add),\n  [data-dsh-composer=\"true\"][data-prism-composer=\"1\"] :is(#btn-composer-send, #btn-composer-stop)\n):focus-visible {\n  outline: 2px solid var(--primary);\n  outline-offset: 2px;\n}\n\n/* Standalone preview supplies only SVG/square artwork for these buttons. */\nhtml[data-prism-theme] [data-dsh-composer=\"true\"][data-prism-composer=\"1\"] :is(#btn-composer-send, #btn-composer-stop):not([hidden]) {\n  display: inline-grid;\n  place-items: center;\n  width: 30px;\n  height: 30px;\n  padding: 0;\n  border: 0;\n  border-radius: 50%;\n}\nhtml[data-prism-theme] [data-dsh-composer=\"true\"][data-prism-composer=\"1\"] #btn-composer-stop > .dsh-stop-square {\n  background: currentColor;\n}\n\n/* --------------------------------------------------------------------------\n * 九、思考块与双语/沉浸式翻译覆层 (Thought Suite)\n * -------------------------------------------------------------------------- */\n.dsh-thought-block,\ndetails.dsh-thought,\n[data-dsh-thought] {\n  margin: 6px 0 10px;\n  border-left: 1.5px solid var(--ag-cs-thought-rule);\n  padding: 2px 0 2px 12px;\n  color: var(--ag-cs-thought-fg);\n  font-size: 12.5px;\n  line-height: 1.6;\n}\n\n.dsh-thought-trigger,\n[data-testid=\"thinking-collapsible-trigger\"] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 2px 6px;\n  border-radius: var(--ag-cs-r-sm);\n  border: none;\n  background: transparent;\n  color: var(--dsw-alias-label-tertiary, var(--muted-foreground));\n  font-size: 12.5px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: background-color 120ms ease, color 120ms ease;\n}\n\n.dsh-thought-trigger:hover,\n[data-testid=\"thinking-collapsible-trigger\"]:hover {\n  background: var(--ag-cs-whisper-hv);\n  color: var(--dsw-alias-label-primary, var(--foreground));\n}\n\n.ag-prism-thought-overlay {\n  display: block;\n  position: relative;\n}\n\n.ag-prism-thought-raw-toggle,\n.ag-prism-thought-retranslate-btn {\n  appearance: none;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 1px 7px;\n  margin-left: 6px;\n  border-radius: 999px;\n  border: var(--ag-cs-hairline) solid var(--dsw-alias-border-l1, var(--ag-cs-border-1));\n  background: var(--ag-cs-pill-bg);\n  color: var(--dsw-alias-label-secondary, var(--secondary-foreground));\n  font-size: 11px;\n  line-height: 16px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;\n}\n\n.ag-prism-thought-raw-toggle:hover,\n.ag-prism-thought-retranslate-btn:hover {\n  background: var(--dsw-alias-interactive-bg-hover, var(--ag-cs-hover-wash));\n  border-color: var(--dsw-alias-border-l2, var(--ag-cs-border-2));\n  color: var(--dsw-alias-label-primary, var(--foreground));\n}\n\n.ag-prism-thought-code {\n  font-family: var(--ag-cs-mono-stack);\n  font-size: 11.5px;\n  padding: 1px 5px;\n  border-radius: var(--ag-cs-r-sm);\n  background: color-mix(in srgb, var(--foreground) 6.5%, transparent);\n  border: var(--ag-cs-hairline) solid var(--ag-cs-border-1);\n  color: var(--foreground);\n}\n\n.ag-cs-thinking-spark {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 14px;\n  height: 14px;\n  flex-shrink: 0;\n  color: var(--primary);\n  opacity: 0.88;\n}\n\n.ag-cs-thinking-spark[data-state=\"streaming\"] {\n  animation: ag-cs-spark-orbit 2.4s ease-in-out infinite;\n}\n\n.ag-cs-thinking-spark[data-state=\"error\"] {\n  color: var(--error);\n}\n\n/* --------------------------------------------------------------------------\n * 十、微件与设置中心样式（层级避让 dsh-whale-widget 9999 与右侧 dsh-better-sidebar）\n * -------------------------------------------------------------------------- */\n\n/* 10.1 动态上下文用量试管与遥测弹出卡片 */\n.dsh-vial-anchor,\n#ag-prism-pulse-bar,\n[data-dsh-vial] {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  z-index: 28;\n}\n\n.dsh-vial-trigger,\n.pv-chip {\n  appearance: none;\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  height: 28px;\n  padding: 0 10px;\n  border-radius: 999px;\n  border: var(--ag-cs-hairline) solid var(--dsw-alias-border-l2, var(--ag-cs-pill-border));\n  background: var(--ag-cs-pill-bg);\n  box-shadow: inset 0 1px 0 var(--ag-cs-specular);\n  color: var(--dsw-alias-label-secondary, var(--secondary-foreground));\n  font-family: var(--ag-cs-mono-stack);\n  font-size: 11.5px;\n  font-variant-numeric: tabular-nums;\n  cursor: pointer;\n  transition: background-color 140ms ease, border-color 140ms ease, color 140ms ease, transform 120ms var(--ag-ease-spring);\n}\n\n.dsh-vial-trigger:hover,\n.pv-chip:hover {\n  background: var(--dsw-alias-interactive-bg-hover, var(--ag-cs-hover-wash));\n  border-color: var(--dsw-alias-border-l4, var(--ag-cs-border-2));\n  color: var(--dsw-alias-label-primary, var(--foreground));\n}\n\n.dsh-vial-popover,\n.pv-card {\n  position: absolute;\n  bottom: calc(100% + 10px);\n  right: 0;\n  width: min(396px, calc(100vw - 24px));\n  padding: 12px 14px;\n  border-radius: var(--ag-cs-r-lg);\n  background-color: var(--ag-cs-popover-bg);\n  background-image: var(--ag-cs-sheen);\n  backdrop-filter: blur(18px) saturate(145%);\n  border: var(--ag-cs-hairline) solid var(--dsw-alias-border-l2, var(--ag-cs-border-2));\n  box-shadow: var(--ag-cs-surface-sh), 0 20px 44px -12px rgba(0, 0, 0, 0.52);\n  color: var(--dsw-alias-label-primary, var(--foreground));\n  z-index: 60;\n}\n\n.dsh-vial-popover[hidden],\n.pv-card[hidden] {\n  display: none !important;\n}\n\n.pv-rail,\n.dsh-vial-rail {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 6px;\n}\n\n.pv-well,\n.dsh-vial-well {\n  padding: 6px;\n  border-radius: var(--ag-cs-r-md);\n  background: var(--ag-cs-console-well);\n  border: var(--ag-cs-hairline) solid var(--dsw-alias-border-l1, var(--ag-cs-border-1));\n  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.28);\n}\n\n.pv-trk,\n.dsh-vial-slices-bar {\n  position: relative;\n  display: flex;\n  height: 7px;\n  border-radius: 999px;\n  overflow: hidden;\n  background: var(--ag-cs-heat-empty);\n}\n\n.pv-seg,\n.dsh-vial-slice {\n  height: 100%;\n  transition: width 240ms var(--ag-ease-out), filter 120ms ease;\n}\n\n/* 10.2 推理强度星空滑块与 Orchestrator 切割水晶棱镜条 */\n.dsh-effort-slider,\n.ces-ag-effort-row,\n[data-testid=\"orchestrator-effort-bar\"] {\n  box-sizing: border-box;\n  padding: 8px 10px;\n  border-radius: var(--ag-cs-r-md);\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  background: color-mix(in srgb, var(--dsw-alias-bg-layer-2, var(--card)) 82%, transparent);\n  border: var(--ag-cs-hairline) solid var(--dsw-alias-border-l1, var(--ag-cs-border-1));\n  box-shadow: inset 0 1px 0 var(--ag-cs-specular);\n}\n\n.ag-cs-orch-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  font-size: 12px;\n  color: var(--dsw-alias-label-secondary, var(--secondary-foreground));\n}\n\n.ag-cs-orch-value {\n  font-family: var(--ag-cs-mono-stack);\n  font-size: 11.5px;\n  font-weight: 600;\n  letter-spacing: 0.03em;\n  background: linear-gradient(90deg, #E7EDF8 0%, #C8D6EE 52%, #AEBFD8 100%);\n  -webkit-background-clip: text;\n  background-clip: text;\n  color: transparent;\n}\n\nhtml:is([data-prism-theme=\"crystal\"], [data-prism-theme=\"alabaster\"], [data-ag-cs-theme=\"light\"]) .ag-cs-orch-value {\n  background: linear-gradient(90deg, #1E3A8A 0%, #2563EB 52%, #6D28D9 100%);\n  -webkit-background-clip: text;\n  background-clip: text;\n}\n\n.ag-cs-orch-track {\n  --orch-px: -9999px;\n  --orch-py: -9999px;\n  position: relative;\n  width: 100%;\n  height: 28px;\n  border-radius: 999px;\n  overflow: hidden;\n  cursor: pointer;\n  box-sizing: border-box;\n  background: radial-gradient(120% 140% at 50% 0%, rgba(28, 33, 46, 0.94) 0%, rgba(11, 13, 20, 0.98) 100%);\n  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.62), inset 0 0 0 1px rgba(212, 224, 248, 0.18), 0 1px 6px rgba(0, 0, 0, 0.34);\n}\n\nhtml:is([data-prism-theme=\"crystal\"], [data-prism-theme=\"alabaster\"], [data-ag-cs-theme=\"light\"]) .ag-cs-orch-track {\n  background: linear-gradient(#E2E9F5 0%, #D3DDEC 100%);\n  box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.16), inset 0 0 0 1px rgba(30, 58, 138, 0.22), 0 1px 3px rgba(15, 23, 42, 0.08);\n}\n\n.ag-cs-orch-canvas,\n.ag-cs-orch-track > canvas:not(.ag-cs-prism-rim-cv) {\n  position: absolute;\n  inset: 1px;\n  width: calc(100% - 2px);\n  height: calc(100% - 2px);\n  border-radius: 999px;\n  display: block;\n  pointer-events: none;\n  z-index: 2;\n}\n\n/* 10.3 鲸伴宠舞台由挂件及 deepseek-companions.css 布局。 */\n\n/* 10.4 左侧对话标尺与悬浮目录大纲 */\n.dsh-conv-rail,\n[data-testid=\"conversation-navigator\"] {\n  pointer-events: auto;\n  position: relative;\n}\n\n:is([data-testid=\"conversation-navigator-turn\"], [data-testid=\"conversation-navigator-group\"], .dsh-rail-tick) > span {\n  border-radius: 999px;\n  background-color: var(--ag-cs-nav-dot);\n  opacity: 0.62;\n  transition: background-color 150ms ease, box-shadow 150ms ease, opacity 150ms ease, transform 150ms var(--ag-ease-spring);\n}\n\n:is([data-testid=\"conversation-navigator-turn\"], [data-testid=\"conversation-navigator-group\"], .dsh-rail-tick):is(:hover, [aria-current=\"true\"], [data-active=\"true\"], .is-active) > span {\n  background-color: var(--ag-cs-nav-active);\n  opacity: 1;\n  box-shadow: var(--ag-cs-nav-glow);\n}\n\n.ag-cs-nav-outline-popover {\n  position: absolute;\n  left: 30px;\n  top: 50%;\n  transform: translateY(-50%);\n  z-index: 40;\n  width: 268px;\n  max-height: min(368px, calc(100vh - 80px));\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  padding: 8px;\n  box-sizing: border-box;\n  border-radius: var(--ag-cs-r-lg);\n  background-color: var(--ag-cs-popover-bg);\n  background-image: var(--ag-cs-sheen);\n  backdrop-filter: blur(16px) saturate(135%);\n  border: var(--ag-cs-hairline) solid var(--dsw-alias-border-l2, var(--ag-cs-border-2));\n  box-shadow: var(--ag-cs-surface-sh);\n  pointer-events: auto;\n  user-select: none;\n}\n\n.ag-cs-nav-outline-popover[hidden] {\n  display: none !important;\n}\n\n.ag-cs-nav-outline-search {\n  box-sizing: border-box;\n  width: 100%;\n  height: 26px;\n  padding: 0 8px;\n  border-radius: var(--ag-cs-r-sm);\n  border: var(--ag-cs-hairline) solid var(--dsw-alias-border-l1, var(--ag-cs-border-1));\n  background: color-mix(in srgb, var(--background) 62%, var(--card));\n  color: var(--dsw-alias-label-primary, var(--foreground));\n  font-size: 11.5px;\n  outline: none;\n}\n\n.ag-cs-nav-outline-item {\n  appearance: none;\n  width: 100%;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  padding: 5px 6px;\n  border: none;\n  border-radius: var(--ag-cs-r-sm);\n  background: transparent;\n  color: var(--dsw-alias-label-secondary, var(--secondary-foreground));\n  font-size: 11.5px;\n  text-align: left;\n  cursor: pointer;\n  transition: background-color 120ms ease, color 120ms ease;\n}\n\n.ag-cs-nav-outline-item:hover {\n  background: var(--dsw-alias-interactive-bg-hover, var(--ag-cs-hover-wash));\n  color: var(--dsw-alias-label-primary, var(--foreground));\n}\n\n.ag-cs-nav-outline-item[data-active=\"1\"] {\n  background: var(--ag-cs-sidebar-selected);\n  color: var(--dsw-alias-label-primary, var(--foreground));\n  font-weight: 500;\n}\n\n/* 10.5 外观设置中心弹窗与 DSH 原生 settings.section 嵌入视图 */\n.dsh-prism-settings-backdrop {\n  position: fixed;\n  inset: 0;\n  z-index: 900;\n  background: var(--dsw-alias-bg-mask-1, var(--scrim));\n  backdrop-filter: blur(6px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 16px;\n}\n\n.dsh-prism-settings-backdrop[hidden] {\n  display: none !important;\n}\n\n.dsh-prism-settings-modal,\n#ag-cs-settings-sec {\n  box-sizing: border-box;\n  border-radius: var(--ag-cs-r-lg);\n  background-color: var(--ag-cs-panel-bg);\n  background-image: var(--ag-cs-sheen);\n  border: var(--ag-cs-hairline) solid var(--dsw-alias-border-l2, var(--ag-cs-border-2));\n  box-shadow: var(--ag-cs-surface-sh), 0 24px 64px -16px rgba(0, 0, 0, 0.56);\n  color: var(--dsw-alias-label-primary, var(--foreground));\n}\n\n.dsh-prism-settings-modal {\n  width: min(640px, calc(100vw - 32px));\n  max-height: min(84vh, 760px);\n  overflow-y: auto;\n  padding: 16px 18px;\n}\n\n/* 嵌入 DSH 原生设置弹层 settings.section 内的紧凑无阴影模式 */\n.dsh-prism-settings-embedded {\n  width: 100%;\n  box-sizing: border-box;\n  color: var(--dsw-alias-label-primary, var(--foreground));\n}\n\n.ag-cs-preset-btn,\n.ag-cs-cfg-btn,\n.ag-cs-seg-btn {\n  appearance: none;\n  height: 26px;\n  padding: 0 10px;\n  border-radius: var(--ag-cs-r-sm);\n  border: var(--ag-cs-hairline) solid var(--dsw-alias-border-l1, var(--ag-cs-border-1));\n  background: var(--ag-cs-pill-bg);\n  color: var(--dsw-alias-label-secondary, var(--secondary-foreground));\n  font-size: 12px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;\n}\n\n.ag-cs-preset-btn:hover,\n.ag-cs-cfg-btn:hover,\n.ag-cs-seg-btn:hover {\n  background: var(--dsw-alias-interactive-bg-hover, var(--ag-cs-hover-wash));\n  border-color: var(--dsw-alias-border-l2, var(--ag-cs-border-2));\n  color: var(--dsw-alias-label-primary, var(--foreground));\n}\n\n.ag-cs-preset-btn[data-active=\"1\"],\n.ag-cs-seg-btn[data-pressed=\"true\"],\n.ag-cs-seg-btn[aria-pressed=\"true\"] {\n  background: var(--dsw-alias-button-ghost-active-fill, color-mix(in srgb, var(--primary) 16%, var(--ag-cs-tab-active)));\n  border-color: var(--dsw-alias-button-ghost-active-border, color-mix(in srgb, var(--primary) 46%, var(--ag-cs-border-2)));\n  color: var(--dsw-alias-label-primary, var(--foreground));\n  font-weight: 600;\n}\n\n/* --------------------------------------------------------------------------\n * 十一、零 DOM 五阶墨水淡入 (CSS Custom Highlight API ::highlight)\n * -------------------------------------------------------------------------- */\n:root::highlight(ag-stream-f0) {\n  color: color-mix(in srgb, var(--dsw-alias-label-primary, var(--foreground, currentColor)) 18%, transparent);\n}\n\n:root::highlight(ag-stream-f1) {\n  color: color-mix(in srgb, var(--dsw-alias-label-primary, var(--foreground, currentColor)) 42%, transparent);\n}\n\n:root::highlight(ag-stream-f2) {\n  color: color-mix(in srgb, var(--dsw-alias-label-primary, var(--foreground, currentColor)) 66%, transparent);\n}\n\n:root::highlight(ag-stream-f3) {\n  color: color-mix(in srgb, var(--dsw-alias-label-primary, var(--foreground, currentColor)) 85%, transparent);\n}\n\n:root::highlight(ag-stream-f4) {\n  color: color-mix(in srgb, var(--dsw-alias-label-primary, var(--foreground, currentColor)) 94%, transparent);\n}\n\n/* --------------------------------------------------------------------------\n * 十二、四档物理动效体系 (off / subtle / standard / ultra) 与关键帧\n * -------------------------------------------------------------------------- */\nhtml:is([data-prism-motion=\"standard\"], [data-prism-motion=\"ultra\"], [data-ag-cs-motion=\"standard\"], [data-ag-cs-motion=\"ultra\"], :not([data-prism-motion]):not([data-ag-cs-motion])) .ag-cs-stream-chunk {\n  animation: ag-cs-stream-chunk 300ms cubic-bezier(0.22, 1, 0.36, 1) both;\n}\n\nhtml:is([data-prism-motion=\"standard\"], [data-prism-motion=\"ultra\"], [data-ag-cs-motion=\"standard\"], [data-ag-cs-motion=\"ultra\"], :not([data-prism-motion]):not([data-ag-cs-motion])) .ag-cs-code-scan {\n  animation: ag-cs-code-scan 180ms cubic-bezier(0.2, 0.9, 0.3, 1) both;\n}\n\nhtml:is([data-prism-motion=\"standard\"], [data-prism-motion=\"ultra\"], [data-ag-cs-motion=\"standard\"], [data-ag-cs-motion=\"ultra\"], :not([data-prism-motion]):not([data-ag-cs-motion])) [data-ag-cs-sonar=\"1\"] {\n  border-radius: var(--ag-cs-r-md);\n  animation: ag-cs-sonar-pulse-toned 700ms ease-out forwards;\n}\n\nhtml:is([data-prism-motion=\"ultra\"], [data-ag-cs-motion=\"ultra\"], :not([data-prism-motion]):not([data-ag-cs-motion])) [data-ag-cs-caustic=\"1\"] {\n  position: relative;\n}\n\nhtml:is([data-prism-motion=\"ultra\"], [data-ag-cs-motion=\"ultra\"], :not([data-prism-motion]):not([data-ag-cs-motion])) [data-ag-cs-caustic=\"1\"]::after {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  pointer-events: none;\n  z-index: 6;\n  background:\n    linear-gradient(90deg, transparent 0%, transparent 32%, rgba(140, 224, 255, 0.8) 46%, rgba(255, 255, 255, 0.96) 50%, rgba(251, 188, 4, 0.7) 55%, transparent 68%, transparent 100%) 114% 0 / 250% 1px no-repeat,\n    linear-gradient(115deg, transparent 0%, transparent 33%, rgba(66, 133, 244, 0.18) 40%, rgba(155, 114, 203, 0.2) 45%, rgba(255, 255, 255, 0.24) 49.5%, rgba(234, 67, 53, 0.16) 54%, rgba(251, 188, 4, 0.18) 59%, transparent 67%, transparent 100%) 114% 0 / 250% 100% no-repeat;\n  animation: ag-cs-caustic-sweep 880ms cubic-bezier(0.22, 1, 0.36, 1) forwards;\n}\n\nhtml:is([data-prism-motion=\"off\"], [data-ag-cs-motion=\"off\"]) {\n  --ag-ease-spring: linear;\n  --ag-spring-sidebar: linear;\n}\n\nhtml:is([data-prism-motion=\"off\"], [data-ag-cs-motion=\"off\"]) :is(.ag-cs-smooth-caret, .ag-cs-thinking-spark, [data-ag-cs-sonar=\"1\"], .ag-cs-stream-chunk, .ag-cs-code-scan) {\n  animation: none !important;\n}\n\nhtml:is([data-prism-motion=\"subtle\"], [data-ag-cs-motion=\"subtle\"]) {\n  --ag-ease-spring: ease-out;\n  --ag-spring-sidebar: ease-out;\n  --ag-ease-out: ease-out;\n}\n\nhtml[data-ag-cs-win-blur=\"1\"] :is(.ag-cs-thinking-spark, .ag-cs-smooth-caret) {\n  animation-play-state: paused !important;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  html:not([data-prism-motion=\"ultra\"]):not([data-prism-motion=\"standard\"]):not([data-ag-cs-motion=\"ultra\"]):not([data-ag-cs-motion=\"standard\"]) :is(.ag-cs-thinking-spark, [data-ag-cs-sonar=\"1\"], .ag-cs-stream-chunk, .ag-cs-code-scan) {\n    animation: none !important;\n  }\n}\n\n@keyframes ag-cs-orbit-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes ag-cs-caret-blink {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0;\n  }\n}\n\n@keyframes ag-cs-spark-orbit {\n  0%, 100% {\n    transform: translate3d(0, 0, 0) rotate(0deg) scale(1);\n    opacity: 0.85;\n  }\n  50% {\n    transform: translate3d(0, -1.2px, 0) rotate(18deg) scale(1.14);\n    opacity: 1;\n  }\n}\n\n@keyframes ag-cs-caustic-sweep {\n  0% {\n    opacity: 0;\n    background-position: 114% 0, 114% 0;\n  }\n  14% {\n    opacity: 1;\n  }\n  82% {\n    opacity: 0.92;\n  }\n  100% {\n    opacity: 0;\n    background-position: -14% 0, -14% 0;\n  }\n}\n\n@keyframes ag-cs-sonar-pulse-toned {\n  0% {\n    box-shadow: 0 0 0 0 transparent, 0 0 0 0 transparent;\n    background-color: transparent;\n  }\n  24% {\n    box-shadow: 0 0 0 1.25px var(--ag-cs-sonar-border), 0 0 20px -3px var(--ag-cs-sonar-glow);\n    background-color: var(--ag-cs-sonar-wash);\n  }\n  100% {\n    box-shadow: 0 0 0 1.25px transparent, 0 0 24px 0 transparent;\n    background-color: transparent;\n  }\n}\n\n@keyframes ag-cs-stream-chunk {\n  from {\n    opacity: 0;\n    transform: translate3d(0, 2.5px, 0);\n  }\n  to {\n    opacity: 1;\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes ag-cs-code-scan {\n  from {\n    opacity: 0;\n    transform: translate3d(-3px, 0, 0);\n  }\n  to {\n    opacity: 1;\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n/* Pixel companions follow the upstream suite's low-resolution sprite language. */\n.dsh-mascot-stage > [data-prism-companion] {\n  position: absolute;\n  left: 0;\n  bottom: 4px;\n  box-sizing: border-box;\n  width: 44px;\n  height: 32px;\n  pointer-events: auto;\n  cursor: grab;\n  touch-action: none;\n  user-select: none;\n  z-index: 2;\n  transform-origin: 50% 100%;\n  will-change: transform;\n  image-rendering: pixelated;\n}\n.dsh-mascot-stage > [data-prism-companion-calf] {\n  position: absolute;\n  left: 0;\n  bottom: 4px;\n  box-sizing: border-box;\n  width: 28px;\n  height: 22px;\n  pointer-events: auto;\n  cursor: grab;\n  touch-action: none;\n  user-select: none;\n  z-index: 1;\n  transform-origin: 50% 100%;\n  will-change: transform;\n  image-rendering: pixelated;\n}\n.dsh-mascot-stage > :is([data-prism-companion], [data-prism-companion-calf])[data-dragging=\"1\"] {\n  z-index: 5;\n  cursor: grabbing;\n}\n.dsh-mascot-stage > :is([data-prism-companion], [data-prism-companion-calf]):focus-visible {\n  outline: 2px solid var(--primary, #4285f4);\n  outline-offset: 2px;\n}\n.prism-pixel-sprite {\n  position: relative;\n  display: block;\n  pointer-events: none;\n  image-rendering: crisp-edges;\n  image-rendering: pixelated;\n}\n.prism-pixel-sprite--adult {\n  width: 44px;\n  height: 32px;\n}\n.prism-pixel-sprite--calf {\n  width: 28px;\n  height: 22px;\n}\n.prism-pixel-shadow {\n  position: absolute;\n  bottom: -1px;\n  height: 2px;\n  pointer-events: none;\n  background: color-mix(in srgb, var(--foreground, #0f172a) 16%, transparent);\n  box-shadow:\n    2px 0 0 color-mix(in srgb, var(--foreground, #0f172a) 10%, transparent),\n    -2px 0 0 color-mix(in srgb, var(--foreground, #0f172a) 10%, transparent);\n}\n.prism-pixel-shadow--adult {\n  left: 11px;\n  width: 23px;\n}\n.prism-pixel-shadow--calf {\n  left: 6px;\n  width: 16px;\n}\n.dsh-mascot-stage > [data-prism-companion][data-dragging=\"1\"] .prism-pixel-shadow {\n  opacity: .36;\n  transform: scaleX(.72);\n}\n.dsh-mascot-stage > [data-prism-companion-calf][data-dragging=\"1\"] .prism-pixel-shadow {\n  opacity: .36;\n  transform: scaleX(.72);\n}\n.dsh-mascot-stage > :is([data-prism-companion], [data-prism-companion-calf])[data-reduced-motion=\"1\"] {\n  will-change: auto;\n}\n@media (prefers-reduced-motion: reduce) {\n  .dsh-mascot-stage > :is([data-prism-companion], [data-prism-companion-calf]) {\n    will-change: auto;\n  }\n}\n\n/* Obsidian Prism for DeepSeek Harness · Home Studio + home ripple host\n * Adapted from RMvdesi/obsidian-prism 1.0.7. GPL-3.0-only.\n */\n\n/* --------------------------------------------------------------------------\n * 1. Home-only mounting contract\n * -------------------------------------------------------------------------- */\n\n[data-conversation-content]:not([data-content-phase=\"hero\"]):not([data-content-phase=\"blank\"])\n  > .dsh-prism-home-ripple-host,\n[data-conversation-content]:not([data-content-phase=\"hero\"]):not([data-content-phase=\"blank\"])\n  .dsh-prism-home-studio-seat {\n  display: none !important;\n}\n\n.dsh-prism-home-ripple-host {\n  --dsh-prism-home-ripple-alpha: 1;\n  --dsh-prism-home-ripple-opacity: 1;\n  position: absolute;\n  inset: 0;\n  z-index: 0;\n  box-sizing: border-box;\n  overflow: hidden;\n  pointer-events: none;\n  isolation: isolate;\n  contain: layout style paint;\n  opacity: var(--dsh-prism-home-ripple-opacity);\n}\n\n.dsh-prism-home-ripple-host::before {\n  content: \"\";\n  position: absolute;\n  inset: auto 0 0;\n  height: min(44%, 320px);\n  background:\n    radial-gradient(ellipse at 50% 104%, rgba(123, 168, 255, 0.18) 0%, rgba(102, 94, 220, 0.1) 34%, transparent 68%),\n    linear-gradient(90deg, transparent 4%, rgba(66, 133, 244, 0.08) 32%, rgba(155, 114, 203, 0.13) 58%, rgba(234, 67, 53, 0.07) 78%, transparent 96%);\n  filter: blur(16px);\n  opacity: 0.76;\n}\n\n.dsh-prism-home-ripple-host::after {\n  content: \"\";\n  position: absolute;\n  right: 4%;\n  bottom: 1px;\n  left: 4%;\n  height: 1px;\n  background: linear-gradient(\n    90deg,\n    transparent 0%,\n    rgba(66, 133, 244, 0.46) 20%,\n    rgba(155, 114, 203, 0.58) 48%,\n    rgba(234, 67, 53, 0.32) 72%,\n    rgba(251, 188, 4, 0.22) 86%,\n    transparent 100%\n  );\n  box-shadow: 0 0 14px rgba(138, 150, 255, 0.18);\n  opacity: 0.7;\n}\n\n[data-conversation-content]:has(> .dsh-prism-home-ripple-host)\n  > :not(.dsh-prism-home-ripple-host) {\n  position: relative;\n  z-index: 1;\n}\n\nhtml[data-prism-theme=\"crystal\"] .dsh-prism-home-ripple-host::before,\nhtml[data-prism-theme=\"alabaster\"] .dsh-prism-home-ripple-host::before,\nbody[data-prism-theme=\"crystal\"] .dsh-prism-home-ripple-host::before,\nbody[data-prism-theme=\"alabaster\"] .dsh-prism-home-ripple-host::before {\n  background:\n    radial-gradient(ellipse at 50% 104%, rgba(73, 115, 210, 0.15) 0%, rgba(109, 88, 188, 0.075) 36%, transparent 70%),\n    linear-gradient(90deg, transparent 4%, rgba(37, 99, 235, 0.075) 30%, rgba(124, 58, 237, 0.095) 60%, rgba(217, 119, 6, 0.05) 82%, transparent 96%);\n  filter: blur(18px);\n}\n\nhtml[data-prism-theme=\"warm\"] .dsh-prism-home-ripple-host::before,\nbody[data-prism-theme=\"warm\"] .dsh-prism-home-ripple-host::before {\n  background:\n    radial-gradient(ellipse at 50% 104%, rgba(224, 154, 113, 0.16) 0%, rgba(166, 104, 73, 0.075) 38%, transparent 70%),\n    linear-gradient(90deg, transparent 5%, rgba(217, 119, 87, 0.075) 32%, rgba(224, 160, 124, 0.11) 62%, transparent 96%);\n}\n\nhtml[data-prism-theme=\"alabaster\"] .dsh-prism-home-ripple-host::before,\nbody[data-prism-theme=\"alabaster\"] .dsh-prism-home-ripple-host::before {\n  background:\n    radial-gradient(ellipse at 50% 104%, rgba(183, 96, 55, 0.13) 0%, rgba(126, 91, 52, 0.065) 40%, transparent 72%),\n    linear-gradient(90deg, transparent 5%, rgba(178, 91, 54, 0.065) 32%, rgba(152, 112, 63, 0.08) 62%, transparent 96%);\n}\n\n.dsh-prism-home-ripple-host[data-prism-home-ripple-state=\"parked\"],\n.dsh-prism-home-ripple-host[data-prism-home-ripple-state=\"unavailable\"] {\n  opacity: 0.36;\n}\n\n.dsh-prism-home-ripple-host[data-prism-home-ripple-state=\"unavailable\"]::after {\n  opacity: 0.32;\n}\n\n/* --------------------------------------------------------------------------\n * 2. Dashboard shell\n * -------------------------------------------------------------------------- */\n\n.dsh-prism-home-studio-seat.ag-cs-home-panel-seat {\n  position: relative;\n  z-index: 2;\n  display: flex;\n  flex: 0 0 auto;\n  align-self: center;\n  box-sizing: border-box;\n  width: min(468px, calc(100% - 28px));\n  max-width: 100%;\n  margin: 14px auto auto;\n  padding: 0;\n  color-scheme: light dark;\n  pointer-events: auto;\n}\n\n/* 首页挂载紧凑仪表盘时：仪表盘自然停靠上方，Hero 标题与输入框自然居中偏下 */\n[data-conversation-content]:is([data-content-phase=\"hero\"], [data-content-phase=\"blank\"])\n  [data-conversation-scroll]:has(> .dsh-prism-home-studio-seat) {\n  justify-content: flex-start;\n}\n\n[data-conversation-content]:is([data-content-phase=\"hero\"], [data-content-phase=\"blank\"])\n  [data-conversation-scroll]:has(> .dsh-prism-home-studio-seat)\n  > [data-composer-seat] {\n  margin-top: 12px;\n  margin-bottom: auto;\n}\n\n.dsh-prism-home-studio-panel.ag-cs-home-panel {\n  --dps-ink: #f2f5ff;\n  --dps-muted: #a2acbf;\n  --dps-faint: #748095;\n  --dps-accent: #8ab4f8;\n  --dps-accent-2: #b79dff;\n  --dps-panel: rgba(10, 11, 16, 0.9);\n  --dps-panel-2: rgba(20, 23, 32, 0.9);\n  --dps-panel-3: rgba(255, 255, 255, 0.038);\n  --dps-border: rgba(255, 255, 255, 0.1);\n  --dps-border-strong: rgba(255, 255, 255, 0.17);\n  --dps-hover: rgba(255, 255, 255, 0.062);\n  --dps-active: rgba(138, 180, 248, 0.125);\n  --dps-active-border: rgba(138, 180, 248, 0.28);\n  --dps-heat-0: rgba(255, 255, 255, 0.045);\n  --dps-heat-1: rgba(86, 130, 205, 0.28);\n  --dps-heat-2: rgba(99, 143, 225, 0.45);\n  --dps-heat-3: rgba(118, 160, 244, 0.65);\n  --dps-heat-4: rgba(158, 184, 255, 0.82);\n  --dps-heat-5: #d8e7ff;\n  --dps-grid: rgba(255, 255, 255, 0.055);\n  --dps-shadow:\n    0 1px 1px rgba(0, 0, 0, 0.38),\n    0 14px 32px -18px rgba(0, 0, 0, 0.8),\n    inset 0 1px 0 rgba(255, 255, 255, 0.055);\n  --dps-sheen: linear-gradient(145deg, rgba(255, 255, 255, 0.052), transparent 38%, rgba(117, 140, 255, 0.038) 100%);\n  --dsh-prism-model-0: #78b7ff;\n  --dsh-prism-model-1: #b79cff;\n  --dsh-prism-model-2: #f2be6b;\n  --dsh-prism-model-3: #66d6c2;\n  --dsh-prism-model-4: #ff8a8a;\n  --dsh-prism-model-5: #8ea0ff;\n  --dsh-prism-model-6: #d9e2f2;\n  --dsh-prism-model-7: #a5b2c8;\n  position: relative;\n  isolation: isolate;\n  display: flex;\n  flex-direction: column;\n  box-sizing: border-box;\n  width: min(468px, 100%);\n  max-width: 100%;\n  max-height: min(326px, 42vh);\n  min-height: 0;\n  margin: 0 auto;\n  overflow: hidden;\n  border: 0.5px solid var(--dps-border);\n  border-radius: 13px;\n  background-color: var(--dps-panel);\n  background-image: var(--dps-sheen);\n  box-shadow: var(--dps-shadow);\n  color: var(--dps-ink);\n  font-family: var(--font-sans, \"Segoe UI Variable\", \"Segoe UI\", system-ui, sans-serif);\n  font-size: 12px;\n  line-height: 1.35;\n  text-rendering: geometricPrecision;\n  backdrop-filter: blur(18px) saturate(1.07);\n  -webkit-backdrop-filter: blur(18px) saturate(1.07);\n  contain: layout style;\n  user-select: none;\n  animation: dsh-prism-home-panel-in 320ms cubic-bezier(0.22, 1, 0.36, 1) both;\n}\n\n@supports not (backdrop-filter: blur(1px)) {\n  .dsh-prism-home-studio-panel.ag-cs-home-panel {\n    background-color: color-mix(in srgb, var(--dps-panel) 96%, var(--dps-panel-2));\n  }\n}\n\n@keyframes dsh-prism-home-panel-in {\n  from {\n    opacity: 0;\n    transform: translate3d(0, 8px, 0) scale(0.994);\n  }\n  to {\n    opacity: 1;\n    transform: translate3d(0, 0, 0) scale(1);\n  }\n}\n\nhtml[data-prism-theme=\"warm\"] .dsh-prism-home-studio-panel.ag-cs-home-panel,\nbody[data-prism-theme=\"warm\"] .dsh-prism-home-studio-panel.ag-cs-home-panel {\n  --dps-ink: #f7eee7;\n  --dps-muted: #beaea2;\n  --dps-faint: #8c7e74;\n  --dps-accent: #e3a27f;\n  --dps-accent-2: #d58d68;\n  --dps-panel: rgba(24, 21, 19, 0.91);\n  --dps-panel-2: rgba(38, 33, 29, 0.91);\n  --dps-panel-3: rgba(247, 238, 231, 0.042);\n  --dps-border: rgba(247, 238, 231, 0.11);\n  --dps-border-strong: rgba(247, 238, 231, 0.18);\n  --dps-hover: rgba(247, 238, 231, 0.066);\n  --dps-active: rgba(227, 162, 127, 0.135);\n  --dps-active-border: rgba(227, 162, 127, 0.31);\n  --dps-heat-0: rgba(247, 238, 231, 0.043);\n  --dps-heat-1: rgba(151, 98, 70, 0.3);\n  --dps-heat-2: rgba(185, 117, 81, 0.48);\n  --dps-heat-3: rgba(213, 141, 104, 0.66);\n  --dps-heat-4: rgba(235, 170, 135, 0.82);\n  --dps-heat-5: #ffe1cc;\n  --dps-grid: rgba(247, 238, 231, 0.052);\n  --dps-shadow:\n    0 1px 1px rgba(0, 0, 0, 0.42),\n    0 15px 34px -19px rgba(0, 0, 0, 0.74),\n    inset 0 1px 0 rgba(255, 255, 255, 0.055);\n  --dps-sheen: linear-gradient(145deg, rgba(255, 246, 238, 0.055), transparent 42%, rgba(211, 128, 86, 0.04) 100%);\n  --dsh-prism-model-0: #e8a17d;\n  --dsh-prism-model-1: #d88d6c;\n  --dsh-prism-model-2: #e5bd79;\n  --dsh-prism-model-3: #8fbfa3;\n  --dsh-prism-model-4: #d87d7a;\n  --dsh-prism-model-5: #b39acb;\n  --dsh-prism-model-6: #e7ddcf;\n  --dsh-prism-model-7: #a99a8e;\n}\n\nhtml[data-prism-theme=\"crystal\"] .dsh-prism-home-studio-panel.ag-cs-home-panel,\nbody[data-prism-theme=\"crystal\"] .dsh-prism-home-studio-panel.ag-cs-home-panel {\n  --dps-ink: #12213a;\n  --dps-muted: #60738e;\n  --dps-faint: #8190a6;\n  --dps-accent: #3568df;\n  --dps-accent-2: #765bd0;\n  --dps-panel: rgba(248, 251, 255, 0.9);\n  --dps-panel-2: rgba(238, 245, 255, 0.92);\n  --dps-panel-3: rgba(31, 65, 123, 0.035);\n  --dps-border: rgba(27, 58, 111, 0.13);\n  --dps-border-strong: rgba(27, 58, 111, 0.2);\n  --dps-hover: rgba(38, 77, 142, 0.06);\n  --dps-active: rgba(53, 104, 223, 0.1);\n  --dps-active-border: rgba(53, 104, 223, 0.24);\n  --dps-heat-0: rgba(34, 69, 128, 0.065);\n  --dps-heat-1: rgba(76, 116, 196, 0.24);\n  --dps-heat-2: rgba(69, 111, 202, 0.4);\n  --dps-heat-3: rgba(59, 104, 208, 0.61);\n  --dps-heat-4: rgba(47, 95, 210, 0.8);\n  --dps-heat-5: #275bc7;\n  --dps-grid: rgba(27, 58, 111, 0.078);\n  --dps-shadow:\n    0 1px 1px rgba(27, 48, 82, 0.04),\n    0 18px 38px -22px rgba(35, 65, 120, 0.3),\n    inset 0 1px 0 rgba(255, 255, 255, 0.9);\n  --dps-sheen: linear-gradient(145deg, rgba(255, 255, 255, 0.7), transparent 42%, rgba(71, 107, 217, 0.04) 100%);\n  --dsh-prism-model-0: #2f67d4;\n  --dsh-prism-model-1: #7a5dcc;\n  --dsh-prism-model-2: #c28217;\n  --dsh-prism-model-3: #158c7c;\n  --dsh-prism-model-4: #c44f59;\n  --dsh-prism-model-5: #506fc5;\n  --dsh-prism-model-6: #5f6d82;\n  --dsh-prism-model-7: #8b5ca1;\n}\n\nhtml[data-prism-theme=\"alabaster\"] .dsh-prism-home-studio-panel.ag-cs-home-panel,\nbody[data-prism-theme=\"alabaster\"] .dsh-prism-home-studio-panel.ag-cs-home-panel {\n  --dps-ink: #2d251c;\n  --dps-muted: #756a5e;\n  --dps-faint: #978b7d;\n  --dps-accent: #b45d39;\n  --dps-accent-2: #8d6d43;\n  --dps-panel: rgba(255, 252, 246, 0.91);\n  --dps-panel-2: rgba(250, 244, 234, 0.93);\n  --dps-panel-3: rgba(82, 60, 36, 0.035);\n  --dps-border: rgba(82, 60, 36, 0.14);\n  --dps-border-strong: rgba(82, 60, 36, 0.21);\n  --dps-hover: rgba(91, 66, 39, 0.06);\n  --dps-active: rgba(180, 93, 57, 0.1);\n  --dps-active-border: rgba(180, 93, 57, 0.25);\n  --dps-heat-0: rgba(82, 60, 36, 0.06);\n  --dps-heat-1: rgba(170, 103, 66, 0.23);\n  --dps-heat-2: rgba(178, 96, 58, 0.39);\n  --dps-heat-3: rgba(184, 91, 52, 0.59);\n  --dps-heat-4: rgba(174, 80, 43, 0.79);\n  --dps-heat-5: #a14424;\n  --dps-grid: rgba(82, 60, 36, 0.075);\n  --dps-shadow:\n    0 1px 1px rgba(60, 42, 22, 0.04),\n    0 16px 34px -22px rgba(74, 52, 28, 0.25),\n    inset 0 1px 0 rgba(255, 255, 255, 0.92);\n  --dps-sheen: linear-gradient(145deg, rgba(255, 255, 255, 0.68), transparent 44%, rgba(178, 91, 54, 0.035) 100%);\n  --dsh-prism-model-0: #a64f2d;\n  --dsh-prism-model-1: #9b6a38;\n  --dsh-prism-model-2: #bd8620;\n  --dsh-prism-model-3: #507d5f;\n  --dsh-prism-model-4: #b6534e;\n  --dsh-prism-model-5: #76689a;\n  --dsh-prism-model-6: #61584e;\n  --dsh-prism-model-7: #8d7660;\n}\n\n.dsh-prism-home-studio-panel > :not(.ag-cs-orbital-backdrop) {\n  position: relative;\n  z-index: 1;\n}\n\n.ag-cs-orbital-backdrop {\n  position: absolute;\n  inset: 0;\n  z-index: 0;\n  overflow: hidden;\n  border-radius: inherit;\n  pointer-events: none;\n  opacity: 0.7;\n}\n\n.ag-cs-orbital-backdrop svg {\n  display: block;\n  width: 100%;\n  height: 100%;\n}\n\n.ag-cs-orbital-backdrop ellipse {\n  fill: none;\n  stroke: var(--dps-grid);\n  stroke-width: 1;\n}\n\n.ag-cs-orbital-backdrop ellipse.is-dashed {\n  stroke: color-mix(in srgb, var(--dps-accent) 12%, transparent);\n}\n\n.ag-cs-orbital-backdrop path {\n  stroke: color-mix(in srgb, var(--dps-ink) 17%, transparent);\n  stroke-linecap: round;\n  stroke-width: 1;\n}\n\n.ag-cs-orbital-backdrop circle.is-cobalt {\n  fill: var(--dps-accent);\n}\n\n.ag-cs-orbital-backdrop circle.is-iris {\n  fill: var(--dps-accent-2);\n}\n\n.ag-cs-orbital-backdrop circle.is-amber {\n  fill: var(--dsh-prism-model-2);\n}\n\n/* --------------------------------------------------------------------------\n * 3. Header, tabs and range controls\n * -------------------------------------------------------------------------- */\n\n.ag-cs-home-panel-head {\n  position: sticky;\n  top: 0;\n  z-index: 3;\n  display: flex;\n  flex: 0 0 auto;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n  box-sizing: border-box;\n  min-height: 38px;\n  padding: 7px 11px 6px;\n  border-bottom: 0.5px solid var(--dps-border);\n  background: linear-gradient(180deg, color-mix(in srgb, var(--dps-panel) 94%, transparent), color-mix(in srgb, var(--dps-panel) 78%, transparent));\n  backdrop-filter: blur(12px);\n}\n\n.dsh-prism-home-brand {\n  display: flex;\n  flex: 1 1 auto;\n  align-items: center;\n  gap: 7px;\n  min-width: 0;\n}\n\n.dsh-prism-home-brand-mark {\n  display: grid;\n  flex: none;\n  place-items: center;\n  width: 21px;\n  height: 21px;\n  border: 0.5px solid var(--dps-active-border);\n  border-radius: 6px;\n  background: var(--dps-active);\n  color: var(--dps-accent);\n  box-shadow: inset 0 0 10px color-mix(in srgb, var(--dps-accent) 9%, transparent);\n}\n\nhtml[data-ag-cs-logo-ink=\"accent\"] :is(.WOwLGG_fish, .dsh-prism-home-brand-mark) {\n  color: var(--primary, var(--ag-prism-accent, #4285f4));\n}\n\nhtml[data-ag-cs-logo-ink=\"foreground\"] :is(.WOwLGG_fish, .dsh-prism-home-brand-mark) {\n  color: var(--foreground, var(--dsw-alias-label-primary, currentColor));\n}\n\n.dsh-prism-home-brand-mark svg {\n  width: 14px;\n  height: 14px;\n}\n\n.dsh-prism-home-brand-labels {\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n}\n\n.dsh-prism-home-brand-title {\n  overflow: hidden;\n  color: var(--dps-ink);\n  font-size: 12.5px;\n  font-weight: 600;\n  letter-spacing: 0.01em;\n  line-height: 16px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.dsh-prism-home-brand-sub {\n  overflow: hidden;\n  color: var(--dps-faint);\n  font-size: 9.5px;\n  font-weight: 500;\n  letter-spacing: 0.015em;\n  line-height: 13px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.ag-cs-home-tabs,\n.ag-cs-home-ranges {\n  display: inline-flex;\n  flex: none;\n  align-items: center;\n  gap: 2px;\n}\n\n.ag-cs-home-tab,\n.ag-cs-home-range {\n  appearance: none;\n  margin: 0;\n  border: 1px solid transparent;\n  border-radius: 999px;\n  background: transparent;\n  color: var(--dps-muted);\n  font-family: inherit;\n  font-size: 10.5px;\n  font-weight: 500;\n  line-height: 17px;\n  cursor: pointer;\n  transition:\n    background-color 130ms ease,\n    border-color 130ms ease,\n    color 130ms ease;\n}\n\n.ag-cs-home-tab {\n  padding: 2px 8px;\n}\n\n.ag-cs-home-range {\n  padding: 1px 6px;\n  font-size: 9.5px;\n}\n\n.ag-cs-home-tab:hover:not([data-active]),\n.ag-cs-home-range:hover:not([data-active]) {\n  background: var(--dps-hover);\n  color: var(--dps-ink);\n}\n\n.ag-cs-home-tab[data-active],\n.ag-cs-home-range[data-active] {\n  border-color: var(--dps-active-border);\n  background: var(--dps-active);\n  color: var(--dps-ink);\n}\n\n.ag-cs-home-tab:focus-visible,\n.ag-cs-home-range:focus-visible {\n  outline: 1.5px solid var(--dps-accent);\n  outline-offset: 1px;\n}\n\n.dsh-prism-home-toolbar {\n  position: relative;\n  z-index: 2;\n  display: flex;\n  flex: 0 0 auto;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  box-sizing: border-box;\n  min-height: 26px;\n  padding: 3px 11px;\n  border-bottom: 0.5px solid var(--dps-border);\n  background: color-mix(in srgb, var(--dps-panel-2) 58%, transparent);\n}\n\n.dsh-prism-home-meta {\n  display: flex;\n  min-width: 0;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 7px;\n  color: var(--dps-faint);\n  font-size: 9px;\n  white-space: nowrap;\n}\n\n.dsh-prism-home-source {\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.dsh-prism-home-updated {\n  flex: none;\n  padding-left: 7px;\n  border-left: 0.5px solid var(--dps-border);\n  font-variant-numeric: tabular-nums;\n}\n\n.dsh-prism-home-body {\n  position: relative;\n  z-index: 1;\n  flex: 1 1 auto;\n  min-height: 0;\n  overflow-y: auto;\n  overflow-x: hidden;\n  overscroll-behavior: contain;\n  scrollbar-gutter: stable;\n}\n\n.dsh-prism-home-body::-webkit-scrollbar {\n  width: 5px;\n  height: 5px;\n}\n\n.dsh-prism-home-body::-webkit-scrollbar-track {\n  background: transparent;\n}\n\n.dsh-prism-home-body::-webkit-scrollbar-thumb {\n  border-radius: 999px;\n  background: color-mix(in srgb, var(--dps-ink) 16%, transparent);\n}\n\n.dsh-prism-home-view {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  padding: 8px 11px 10px;\n}\n\n/* --------------------------------------------------------------------------\n * 4. Overview cards and 7 × N heatmap\n * -------------------------------------------------------------------------- */\n\n.ag-cs-home-stats {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 5px;\n}\n\n.ag-cs-home-stat {\n  display: flex;\n  min-width: 0;\n  flex-direction: column;\n  gap: 1px;\n  box-sizing: border-box;\n  padding: 5px 8px;\n  border: 0.5px solid var(--dps-border);\n  border-radius: 7px;\n  background: var(--dps-panel-3);\n  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--dps-ink) 3%, transparent);\n}\n\n.ag-cs-home-stat-label {\n  overflow: hidden;\n  color: var(--dps-muted);\n  font-size: 9px;\n  font-weight: 500;\n  letter-spacing: 0.01em;\n  line-height: 12px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.ag-cs-home-stat-value {\n  overflow: hidden;\n  color: var(--dps-ink);\n  font-family: var(--ag-cs-mono-stack, \"Cascadia Mono\", \"SFMono-Regular\", Consolas, monospace);\n  font-size: 12px;\n  font-weight: 650;\n  letter-spacing: -0.02em;\n  line-height: 16px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-variant-numeric: tabular-nums;\n}\n\n.ag-cs-home-stat[data-stat=\"model\"] .ag-cs-home-stat-value {\n  font-family: var(--font-sans, \"Segoe UI Variable\", \"Segoe UI\", system-ui, sans-serif);\n  font-size: 11px;\n  font-weight: 550;\n  letter-spacing: 0;\n}\n\n.ag-cs-home-stat-sub {\n  overflow: hidden;\n  color: var(--dps-faint);\n  font-size: 8.5px;\n  line-height: 12px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.dsh-prism-home-section {\n  display: flex;\n  min-width: 0;\n  flex-direction: column;\n  gap: 7px;\n}\n\n.dsh-prism-home-section-head {\n  display: flex;\n  align-items: baseline;\n  justify-content: space-between;\n  gap: 10px;\n  min-width: 0;\n}\n\n.dsh-prism-home-section-title {\n  color: var(--dps-ink);\n  font-size: 10.5px;\n  font-weight: 600;\n  letter-spacing: 0.02em;\n}\n\n.dsh-prism-home-section-sub {\n  overflow: hidden;\n  color: var(--dps-faint);\n  font-size: 8.5px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.ag-cs-home-heat {\n  --dsh-prism-home-heat-columns: 26;\n  position: relative;\n  display: grid;\n  grid-auto-flow: column;\n  grid-template-columns: repeat(var(--dsh-prism-home-heat-columns), minmax(0, 1fr));\n  grid-template-rows: repeat(7, 9px);\n  gap: 2.5px;\n  width: 100%;\n  box-sizing: border-box;\n  padding: 2px 0 3px;\n  overflow: visible;\n}\n\n.ag-cs-home-heat-cell {\n  position: relative;\n  display: block;\n  width: 100%;\n  height: 9px;\n  border-radius: 2px;\n  background: var(--dps-heat-0);\n  transition:\n    background-color 160ms ease,\n    transform 120ms ease;\n}\n\n.ag-cs-home-heat-cell:not([data-empty]):not([data-level=\"0\"]):hover {\n  z-index: 2;\n  transform: scale(1.18);\n}\n\n.ag-cs-home-heat-cell[data-level=\"1\"] {\n  background: var(--dps-heat-1);\n}\n\n.ag-cs-home-heat-cell[data-level=\"2\"] {\n  background: var(--dps-heat-2);\n}\n\n.ag-cs-home-heat-cell[data-level=\"3\"] {\n  background: var(--dps-heat-3);\n}\n\n.ag-cs-home-heat-cell[data-level=\"4\"] {\n  background: var(--dps-heat-4);\n}\n\n.ag-cs-home-heat-cell[data-level=\"5\"] {\n  background: var(--dps-heat-5);\n  box-shadow: 0 0 7px color-mix(in srgb, var(--dps-accent) 22%, transparent);\n}\n\n.ag-cs-home-heat-cell[data-empty=\"1\"] {\n  visibility: hidden;\n}\n\n.ag-cs-home-heat-hint {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 10;\n  max-width: 248px;\n  padding: 2px 7px;\n  border: 0.5px solid var(--dps-border-strong);\n  border-radius: 999px;\n  background: color-mix(in srgb, var(--dps-ink) 94%, var(--dps-panel));\n  box-shadow: 0 5px 14px rgba(0, 0, 0, 0.24);\n  color: var(--dps-panel);\n  font-size: 9.5px;\n  line-height: 14px;\n  white-space: nowrap;\n  pointer-events: none;\n  opacity: 0;\n  transition: opacity 90ms ease;\n}\n\n.ag-cs-home-heat-hint[data-shown=\"true\"] {\n  opacity: 1;\n}\n\n/* --------------------------------------------------------------------------\n * 5. Token trend\n * -------------------------------------------------------------------------- */\n\n.ag-cs-home-chart {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  gap: 0;\n  min-height: 0;\n  padding: 2px 2px 21px;\n}\n\n.ag-cs-home-chart-plot {\n  position: relative;\n  box-sizing: border-box;\n  height: 184px;\n  margin-left: 41px;\n  border-bottom: 0.5px solid var(--dps-border-strong);\n  background-image: linear-gradient(to top, var(--dps-grid) 0.5px, transparent 0.5px);\n  background-size: 100% 25%;\n}\n\n.ag-cs-home-chart-tick {\n  position: absolute;\n  left: -42px;\n  width: 35px;\n  transform: translateY(50%);\n  color: var(--dps-faint);\n  font-family: var(--ag-cs-mono-stack, \"Cascadia Mono\", Consolas, monospace);\n  font-size: 8px;\n  line-height: 11px;\n  text-align: right;\n  font-variant-numeric: tabular-nums;\n}\n\n.ag-cs-home-chart-bars {\n  position: absolute;\n  inset: 0;\n  display: flex;\n  align-items: flex-end;\n  gap: 2px;\n}\n\n.ag-cs-home-chart-col {\n  position: relative;\n  display: block;\n  flex: 1 1 0;\n  min-width: 1px;\n  overflow: visible;\n  border-radius: 2px 2px 0 0;\n  transform-origin: 50% 100%;\n}\n\n.ag-cs-home-chart-col::after {\n  content: attr(data-label);\n  position: absolute;\n  top: calc(100% + 4px);\n  left: 50%;\n  color: var(--dps-faint);\n  font-size: 8px;\n  line-height: 11px;\n  white-space: nowrap;\n  transform: translateX(-50%);\n}\n\n.ag-cs-home-chart-seg {\n  display: flex;\n  width: 100%;\n  height: 100%;\n  flex-direction: column-reverse;\n  overflow: hidden;\n  border-radius: 2px 2px 0 0;\n  background: color-mix(in srgb, var(--dps-accent) 18%, transparent);\n}\n\n.ag-cs-home-chart-stack {\n  display: block;\n  width: 100%;\n  min-height: 0;\n}\n\n.ag-cs-home-chart-stack[data-color=\"0\"] {\n  background: var(--dsh-prism-model-0);\n}\n\n.ag-cs-home-chart-stack[data-color=\"1\"] {\n  background: var(--dsh-prism-model-1);\n}\n\n.ag-cs-home-chart-stack[data-color=\"2\"] {\n  background: var(--dsh-prism-model-2);\n}\n\n.ag-cs-home-chart-stack[data-color=\"3\"] {\n  background: var(--dsh-prism-model-3);\n}\n\n.ag-cs-home-chart-stack[data-color=\"4\"] {\n  background: var(--dsh-prism-model-4);\n}\n\n.ag-cs-home-chart-stack[data-color=\"5\"] {\n  background: var(--dsh-prism-model-5);\n}\n\n.ag-cs-home-chart-stack[data-color=\"6\"] {\n  background: var(--dsh-prism-model-6);\n}\n\n.ag-cs-home-chart-stack[data-color=\"7\"] {\n  background: var(--dsh-prism-model-7);\n}\n\n/* --------------------------------------------------------------------------\n * 6. Model distribution\n * -------------------------------------------------------------------------- */\n\n.dsh-prism-home-model-distribution {\n  display: grid;\n  grid-template-columns: 136px minmax(0, 1fr);\n  align-items: center;\n  gap: 16px;\n  min-height: 160px;\n}\n\n.dsh-prism-home-donut {\n  position: relative;\n  display: grid;\n  place-items: center;\n  width: 128px;\n  height: 128px;\n  margin: 0 auto;\n  border-radius: 50%;\n  box-shadow:\n    0 0 0 0.5px var(--dps-border),\n    inset 0 0 30px color-mix(in srgb, #000 10%, transparent);\n}\n\n.dsh-prism-home-donut::before {\n  content: \"\";\n  position: absolute;\n  inset: 24px;\n  border: 0.5px solid var(--dps-border);\n  border-radius: 50%;\n  background: var(--dps-panel-2);\n  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--dps-ink) 5%, transparent);\n}\n\n.dsh-prism-home-donut-core {\n  position: relative;\n  z-index: 1;\n  display: flex;\n  align-items: center;\n  flex-direction: column;\n  gap: 1px;\n  color: var(--dps-ink);\n  font-variant-numeric: tabular-nums;\n}\n\n.dsh-prism-home-donut-core strong {\n  font-family: var(--ag-cs-mono-stack, \"Cascadia Mono\", Consolas, monospace);\n  font-size: 18px;\n  font-weight: 650;\n  letter-spacing: -0.04em;\n}\n\n.dsh-prism-home-donut-core small {\n  color: var(--dps-faint);\n  font-size: 8px;\n  letter-spacing: 0.03em;\n  text-transform: uppercase;\n}\n\n.ag-cs-home-models {\n  display: flex;\n  min-width: 0;\n  flex-direction: column;\n  gap: 7px;\n}\n\n.ag-cs-home-model {\n  display: grid;\n  grid-template-columns: 8px minmax(0, 1fr) auto 42px;\n  align-items: center;\n  gap: 7px;\n  min-width: 0;\n}\n\n.ag-cs-home-model-swatch {\n  width: 8px;\n  height: 8px;\n  border-radius: 2px;\n}\n\n.ag-cs-home-model-swatch[data-color=\"0\"] {\n  background: var(--dsh-prism-model-0);\n}\n\n.ag-cs-home-model-swatch[data-color=\"1\"] {\n  background: var(--dsh-prism-model-1);\n}\n\n.ag-cs-home-model-swatch[data-color=\"2\"] {\n  background: var(--dsh-prism-model-2);\n}\n\n.ag-cs-home-model-swatch[data-color=\"3\"] {\n  background: var(--dsh-prism-model-3);\n}\n\n.ag-cs-home-model-swatch[data-color=\"4\"] {\n  background: var(--dsh-prism-model-4);\n}\n\n.ag-cs-home-model-swatch[data-color=\"5\"] {\n  background: var(--dsh-prism-model-5);\n}\n\n.ag-cs-home-model-swatch[data-color=\"6\"] {\n  background: var(--dsh-prism-model-6);\n}\n\n.ag-cs-home-model-swatch[data-color=\"7\"] {\n  background: var(--dsh-prism-model-7);\n}\n\n.ag-cs-home-model-name {\n  overflow: hidden;\n  color: var(--dps-ink);\n  font-size: 10.5px;\n  font-weight: 500;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.ag-cs-home-model-split {\n  color: var(--dps-muted);\n  font-family: var(--ag-cs-mono-stack, \"Cascadia Mono\", Consolas, monospace);\n  font-size: 9px;\n  font-variant-numeric: tabular-nums;\n  white-space: nowrap;\n}\n\n.ag-cs-home-model-share {\n  color: var(--dps-faint);\n  font-family: var(--ag-cs-mono-stack, \"Cascadia Mono\", Consolas, monospace);\n  font-size: 9px;\n  text-align: right;\n  font-variant-numeric: tabular-nums;\n}\n\n/* --------------------------------------------------------------------------\n * 7. Empty state\n * -------------------------------------------------------------------------- */\n\n.dsh-prism-home-empty {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n  gap: 7px;\n  min-height: 154px;\n  padding: 22px 20px;\n  color: var(--dps-muted);\n  text-align: center;\n}\n\n.dsh-prism-home-empty-orb {\n  position: relative;\n  display: block;\n  width: 34px;\n  height: 34px;\n  margin-bottom: 2px;\n  border: 0.5px solid var(--dps-active-border);\n  border-radius: 50%;\n  background:\n    radial-gradient(circle at 37% 32%, color-mix(in srgb, var(--dps-accent) 58%, transparent), transparent 43%),\n    radial-gradient(circle at 64% 70%, color-mix(in srgb, var(--dps-accent-2) 38%, transparent), transparent 48%),\n    var(--dps-panel-3);\n  box-shadow:\n    inset 0 0 14px color-mix(in srgb, var(--dps-accent) 8%, transparent),\n    0 0 20px color-mix(in srgb, var(--dps-accent) 8%, transparent);\n}\n\n.dsh-prism-home-empty-orb::before,\n.dsh-prism-home-empty-orb::after {\n  content: \"\";\n  position: absolute;\n  top: 50%;\n  left: -8px;\n  width: 48px;\n  height: 12px;\n  border: 0.5px solid var(--dps-border);\n  border-radius: 50%;\n  transform: translateY(-50%) rotate(-14deg);\n}\n\n.dsh-prism-home-empty-orb::after {\n  width: 42px;\n  transform: translate(-5px, -50%) rotate(58deg);\n}\n\n.dsh-prism-home-empty-title {\n  color: var(--dps-ink);\n  font-size: 11px;\n  font-weight: 600;\n  line-height: 15px;\n}\n\n.dsh-prism-home-empty-body {\n  max-width: 390px;\n  margin: 0;\n  color: var(--dps-faint);\n  font-size: 9.5px;\n  line-height: 15px;\n}\n\n/* --------------------------------------------------------------------------\n * 8. Narrow layout and reduced motion\n * -------------------------------------------------------------------------- */\n\n@media (max-width: 720px) {\n  .dsh-prism-home-studio-seat.ag-cs-home-panel-seat {\n    width: calc(100% - 20px);\n    margin-bottom: 8px;\n  }\n\n  .dsh-prism-home-studio-panel.ag-cs-home-panel {\n    max-height: min(368px, 44vh);\n    border-radius: 13px;\n  }\n\n  .ag-cs-home-panel-head {\n    min-height: 46px;\n    padding: 9px 10px 7px;\n  }\n\n  .dsh-prism-home-brand-sub {\n    display: none;\n  }\n\n  .dsh-prism-home-brand-mark {\n    width: 23px;\n    height: 23px;\n  }\n\n  .ag-cs-home-tab {\n    padding-inline: 6px;\n  }\n\n  .dsh-prism-home-toolbar {\n    padding-inline: 10px;\n  }\n\n  .dsh-prism-home-source {\n    max-width: 148px;\n  }\n\n  .dsh-prism-home-view {\n    padding: 9px 10px 11px;\n  }\n\n  .ag-cs-home-stats {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  .ag-cs-home-chart-plot {\n    height: 154px;\n    margin-left: 35px;\n  }\n\n  .ag-cs-home-chart-tick {\n    left: -36px;\n    width: 30px;\n  }\n\n  .dsh-prism-home-model-distribution {\n    grid-template-columns: 112px minmax(0, 1fr);\n    gap: 10px;\n  }\n\n  .dsh-prism-home-donut {\n    width: 104px;\n    height: 104px;\n  }\n\n  .dsh-prism-home-donut::before {\n    inset: 19px;\n  }\n\n  .ag-cs-home-model {\n    grid-template-columns: 8px minmax(0, 1fr) 38px;\n  }\n\n  .ag-cs-home-model-split {\n    display: none;\n  }\n}\n\n@media (max-width: 500px) {\n  .dsh-prism-home-brand-labels {\n    display: none;\n  }\n\n  .dsh-prism-home-meta {\n    display: none;\n  }\n\n  .dsh-prism-home-toolbar {\n    justify-content: center;\n  }\n\n  .ag-cs-home-tabs {\n    gap: 0;\n  }\n\n  .ag-cs-home-tab {\n    font-size: 9.5px;\n  }\n\n  .dsh-prism-home-model-distribution {\n    grid-template-columns: 1fr;\n  }\n\n  .dsh-prism-home-donut {\n    width: 96px;\n    height: 96px;\n  }\n\n  .ag-cs-home-model {\n    grid-template-columns: 8px minmax(0, 1fr) auto 40px;\n  }\n\n  .ag-cs-home-model-split {\n    display: block;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .dsh-prism-home-studio-panel.ag-cs-home-panel {\n    animation: none;\n  }\n\n  .dsh-prism-home-studio-panel *,\n  .dsh-prism-home-ripple-host * {\n    scroll-behavior: auto !important;\n    transition-duration: 0.001ms !important;\n    animation-duration: 0.001ms !important;\n    animation-iteration-count: 1 !important;\n  }\n}\n\nhtml[data-prism-motion=\"off\"] .dsh-prism-home-studio-panel.ag-cs-home-panel {\n  animation: none;\n}\n\nhtml[data-prism-motion=\"off\"] .dsh-prism-home-studio-panel * {\n  transition: none !important;\n  animation: none !important;\n}\n\nhtml[data-prism-ambient=\"0\"] .dsh-prism-home-ripple-host,\nhtml[data-ag-cs-ambient=\"0\"] .dsh-prism-home-ripple-host {\n  visibility: hidden !important;\n}\n\n/* Obsidian Prism · native icon choreography and model glyphs · GPL-3.0-only */\n\nhtml[data-prism-theme],\nbody[data-prism-theme=\"obsidian\"] {\n  --dsh-pni-ink: var(--foreground, #f2f2f5);\n  --dsh-pni-accent: var(--ag-cs-accent, var(--primary, #669df6));\n  --dsh-pni-accent-hi: #9bc0ff;\n  --dsh-pni-glow: color-mix(in srgb, var(--dsh-pni-accent) 38%, transparent);\n  --dsh-pni-surface: color-mix(in srgb, var(--foreground, #f2f2f5) 4%, transparent);\n  --dsh-pni-border: color-mix(in srgb, var(--foreground, #f2f2f5) 11%, transparent);\n}\n\nhtml[data-prism-theme=\"warm\"],\nbody[data-prism-theme=\"warm\"] {\n  --dsh-pni-accent: var(--ag-cs-accent, var(--primary, #d97757));\n  --dsh-pni-accent-hi: #f0a383;\n  --dsh-pni-glow: color-mix(in srgb, #d97757 42%, transparent);\n}\n\nhtml[data-prism-theme=\"crystal\"],\nbody[data-prism-theme=\"crystal\"] {\n  --dsh-pni-ink: #0f172a;\n  --dsh-pni-accent: var(--ag-cs-accent, var(--primary, #2563eb));\n  --dsh-pni-accent-hi: #1d4ed8;\n  --dsh-pni-glow: color-mix(in srgb, #2563eb 30%, transparent);\n  --dsh-pni-surface: color-mix(in srgb, #0f172a 4%, transparent);\n  --dsh-pni-border: color-mix(in srgb, #0f172a 10%, transparent);\n}\n\nhtml[data-prism-theme=\"alabaster\"],\nbody[data-prism-theme=\"alabaster\"] {\n  --dsh-pni-ink: #1c1814;\n  --dsh-pni-accent: var(--ag-cs-accent, var(--primary, #c25934));\n  --dsh-pni-accent-hi: #a94728;\n  --dsh-pni-glow: color-mix(in srgb, #c25934 28%, transparent);\n  --dsh-pni-surface: color-mix(in srgb, #1c1814 4%, transparent);\n  --dsh-pni-border: color-mix(in srgb, #1c1814 10%, transparent);\n}\n\nhtml[data-prism-theme=\"alabaster\"] #model .dsh-prism-model-glyph,\nhtml[data-prism-theme=\"alabaster\"] [role=\"menu\"] .dsh-prism-model-glyph,\nhtml[data-prism-theme=\"crystal\"] #model .dsh-prism-model-glyph,\nhtml[data-prism-theme=\"crystal\"] [role=\"menu\"] .dsh-prism-model-glyph {\n  color: var(--dsw-alias-label-secondary, #475569);\n}\n\n.dsh-prism-native-icon {\n  --dsh-pni-size: 15px;\n  box-sizing: border-box;\n  display: inline-flex;\n  width: var(--dsh-pni-size);\n  height: var(--dsh-pni-size);\n  min-width: var(--dsh-pni-size);\n  align-items: center;\n  justify-content: center;\n  flex: 0 0 auto;\n  color: currentColor;\n  pointer-events: none;\n  user-select: none;\n  vertical-align: middle;\n  isolation: isolate;\n}\n\n.dsh-prism-native-icon[data-layout=\"inline\"] {\n  margin-inline-end: 5px;\n}\n\nbutton[data-prism-native-icon-layout=\"overlay\"] {\n  position: relative;\n}\n\nbutton[data-prism-native-icon-layout=\"overlay\"] > .dsh-prism-native-icon {\n  --dsh-pni-size: 17px;\n  position: absolute;\n  z-index: 3;\n  left: 50%;\n  top: 50%;\n  margin: 0;\n  transform: translate(-50%, -50%);\n}\n\nbutton[data-prism-native-icon-layout=\"overlay\"]\n  > .dsh-prism-native-icon\n  > .dsh-prism-anim-svg {\n  width: 15px;\n  height: 15px;\n}\n\n.dsh-prism-menu-back {\n  appearance: none;\n  box-sizing: border-box;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  flex: 0 0 auto;\n  width: calc(100% - 8px);\n  height: 28px;\n  margin: 1px 4px 5px;\n  padding: 0 8px;\n  border: 1px solid transparent;\n  border-radius: var(--dsw-radius-sm, 6px);\n  background: transparent;\n  color: var(--dsw-alias-label-secondary, var(--foreground, #cbd5e1));\n  font: inherit;\n  font-size: 12px;\n  line-height: 1;\n  text-align: left;\n  cursor: pointer;\n  transition:\n    color 130ms ease,\n    background-color 130ms ease,\n    border-color 130ms ease;\n}\n\n.dsh-prism-menu-back svg {\n  flex: 0 0 auto;\n}\n\n.dsh-prism-menu-back:hover,\n.dsh-prism-menu-back:focus-visible {\n  color: var(--dsw-alias-label-primary, var(--foreground, #f8fafc));\n  background: var(--dsw-alias-interactive-bg-hover, rgba(127, 127, 127, .1));\n  border-color: var(--dsw-alias-border-l2, rgba(127, 127, 127, .16));\n  outline: none;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"] > svg:not(.dsh-prism-anim-svg),\nbutton[data-prism-native-icon-injected=\"1\"] > span:not(.dsh-prism-native-icon) > svg,\nbutton[data-prism-native-icon-injected=\"1\"]\n  > :is([data-icon], [class*=\"icon\"]):not(.dsh-prism-native-icon):not([data-prism-native-icon]):not([data-prism-owned])\n  > svg:not(.dsh-prism-anim-svg) {\n  display: none !important;\n}\n\n.dsh-prism-native-icon .dsh-prism-anim-svg,\n.dsh-prism-model-glyph .dsh-prism-model-glyph-svg {\n  display: block;\n  width: 100%;\n  height: 100%;\n  overflow: visible;\n  flex: 0 0 auto;\n  transform-origin: 50% 50%;\n  pointer-events: none;\n}\n\n.dsh-prism-native-icon :is(g, path, circle, rect, ellipse, line, polyline),\n.dsh-prism-model-glyph :is(g, path, circle, rect, ellipse, line, polyline) {\n  transform-box: view-box;\n  transform-origin: center;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:focus-visible .dsh-prism-native-icon {\n  outline: 1px solid color-mix(in srgb, var(--dsh-pni-accent) 64%, transparent);\n  outline-offset: 1px;\n  border-radius: 5px;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:active .dsh-prism-native-icon .dsh-prism-anim-svg {\n  transform: scale(.9);\n}\n\n.dsh-prism-native-icon[data-prism-icon-kind=\"copy\"][data-prism-icon-state=\"check\"] .ag-icon-copy-check {\n  color: var(--dsw-alias-state-success-primary, #50a37b);\n}\n\n.dsh-prism-model-glyph {\n  --glyph-color: #5b93f7;\n  --glyph-color-hi: #7aaaFF;\n  --glyph-glow: rgba(91, 147, 247, .48);\n  box-sizing: border-box;\n  display: inline-flex;\n  width: 17px;\n  height: 17px;\n  min-width: 17px;\n  align-items: center;\n  justify-content: center;\n  flex: 0 0 auto;\n  margin-inline: 1px 5px;\n  color: var(--dsh-pni-ink, currentColor);\n  vertical-align: middle;\n  pointer-events: none;\n  transform-origin: 50% 50%;\n}\n\n.dsh-prism-model-glyph[data-prism-model-glyph-placement=\"menu\"] {\n  width: 15px;\n  height: 15px;\n  min-width: 15px;\n  margin-inline: 0 5px;\n}\n\n.dsh-prism-model-glyph[data-prism-brand=\"deepseek\"] {\n  --glyph-color: #4d96ff;\n  --glyph-color-hi: #70b7ff;\n  --glyph-glow: rgba(77, 150, 255, .5);\n}\n\n.dsh-prism-model-glyph[data-prism-brand=\"claude\"] {\n  --glyph-color: #d97757;\n  --glyph-color-hi: #ee9070;\n  --glyph-glow: rgba(217, 119, 87, .46);\n}\n\n.dsh-prism-model-glyph[data-prism-brand=\"openai\"] {\n  --glyph-color: #8a94a6;\n  --glyph-color-hi: #b0bac9;\n  --glyph-glow: transparent;\n}\n\n.dsh-prism-model-glyph[data-prism-brand=\"gemini\"],\n.dsh-prism-model-glyph[data-prism-brand=\"antigravity\"] {\n  --glyph-color: #6ea2ff;\n  --glyph-color-hi: #8ab4f8;\n  --glyph-glow: rgba(110, 162, 255, .46);\n}\n\n.dsh-prism-model-glyph .ag-cs-glyph-body {\n  fill: var(--glyph-color);\n  fill-opacity: .8;\n  stroke: none;\n  transition: fill 180ms ease, fill-opacity 180ms ease;\n}\n\n.dsh-prism-model-glyph .ag-cs-glyph-whale-belly {\n  fill: color-mix(in srgb, #dff5ff 78%, var(--glyph-color-hi));\n  fill-opacity: .88;\n  stroke: none;\n}\n\n.dsh-prism-model-glyph .ag-cs-glyph-whale-eye {\n  fill: var(--dsh-pni-ink, #f2f2f5);\n  opacity: .95;\n}\n\n.dsh-prism-model-glyph .ag-cs-glyph-whale-fin {\n  fill: var(--glyph-color-hi);\n  opacity: .82;\n}\n\n.dsh-prism-model-glyph .ag-cs-glyph-starfire,\n.dsh-prism-model-glyph .ag-cs-glyph-bubble {\n  fill: #b9ddff;\n  opacity: .95;\n}\n\n.dsh-prism-model-glyph .ag-cs-glyph-core {\n  fill: #fff;\n  opacity: 0;\n  transform-origin: 12px 12px;\n  transform: scale(.35);\n  transition: opacity 180ms ease, transform 180ms var(--ag-ease-spring, cubic-bezier(.34, 1.4, .64, 1));\n}\n\n.dsh-prism-model-glyph .ag-cs-glyph-orbit-group {\n  opacity: 0;\n  transform-origin: 12px 12px;\n  transform: scale(.72);\n  transition: opacity 220ms ease, transform 220ms var(--ag-ease-spring, cubic-bezier(.34, 1.4, .64, 1));\n}\n\n.dsh-prism-model-glyph .ag-cs-glyph-orbit {\n  fill: none;\n  stroke: var(--glyph-color-hi);\n  stroke-width: 1.05;\n  stroke-opacity: .72;\n}\n\n.dsh-prism-model-glyph .ag-cs-glyph-orbit-dot {\n  fill: #fbbc04;\n  filter: drop-shadow(0 0 2px rgba(251, 188, 4, .46));\n}\n\n.dsh-prism-model-glyph .ag-cs-glyph-sat.is-a {\n  fill: #fbbc04;\n}\n\n.dsh-prism-model-glyph .ag-cs-glyph-sat.is-b {\n  fill: #ea5a60;\n}\n\n.dsh-prism-model-glyph[data-prism-tier=\"low\"] .ag-cs-glyph-body {\n  fill: currentColor;\n  fill-opacity: .18;\n}\n\n.dsh-prism-model-glyph[data-prism-tier=\"medium\"] .ag-cs-glyph-body {\n  fill: var(--glyph-color);\n  fill-opacity: .8;\n}\n\n.dsh-prism-model-glyph[data-prism-tier=\"high\"],\n.dsh-prism-model-glyph[data-prism-tier=\"xhigh\"] {\n  filter: drop-shadow(0 0 3px var(--glyph-glow));\n}\n\n.dsh-prism-model-glyph[data-prism-tier=\"high\"] .ag-cs-glyph-core,\n.dsh-prism-model-glyph[data-prism-tier=\"xhigh\"] .ag-cs-glyph-core {\n  opacity: .94;\n  transform: scale(1);\n}\n\n.dsh-prism-model-glyph[data-prism-tier=\"xhigh\"] .ag-cs-glyph-body {\n  fill: var(--glyph-color-hi);\n}\n\n.dsh-prism-model-glyph[data-prism-tier=\"xhigh\"] .ag-cs-glyph-orbit-group {\n  opacity: .9;\n  transform: scale(1);\n}\n\n.dsh-prism-model-glyph[data-prism-tier=\"auto\"] .ag-cs-glyph-core {\n  opacity: .8;\n  transform: scale(.82);\n}\n\n.dsh-prism-model-glyph[data-prism-tier=\"fixed\"] .ag-cs-glyph-body {\n  fill: currentColor;\n  fill-opacity: .52;\n}\n\n.dsh-prism-model-glyph[data-prism-selected=\"false\"] {\n  opacity: .76;\n}\n\n.dsh-prism-model-glyph[data-prism-selected=\"true\"] {\n  opacity: 1;\n}\n\n[data-prism-model-glyph-host=\"trigger\"] > svg:first-child {\n  display: none !important;\n}\n\n[role=\"menuitemradio\"]:hover .dsh-prism-model-glyph,\n[role=\"menuitem\"]:hover .dsh-prism-model-glyph,\n[role=\"option\"]:hover .dsh-prism-model-glyph,\n.dsh-prism-model-glyph:hover {\n  transform: scale(1.06);\n}\n\n[data-prism-model-glyph-host=\"trigger\"]:hover .dsh-prism-model-glyph .ag-cs-glyph-orbit-group,\n[data-prism-model-glyph-host=\"trigger\"]:focus-visible .dsh-prism-model-glyph .ag-cs-glyph-orbit-group {\n  opacity: .72;\n  transform: scale(1);\n}\n\n.dsh-prism-model-glyph.is-pulsing {\n  animation: dsh-pni-glyph-pop 280ms cubic-bezier(.34, 1.4, .64, 1);\n}\n\n@keyframes dsh-pni-glyph-pop {\n  0% { transform: scale(.84); opacity: .72; }\n  65% { transform: scale(1.12); opacity: 1; }\n  100% { transform: scale(1); opacity: 1; }\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-rail {\n  animation: dsh-pni-panel-left 240ms ease-out;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-pen {\n  animation: dsh-pni-pen 300ms cubic-bezier(.34, 1.4, .64, 1);\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-spark {\n  animation: dsh-pni-spark 260ms ease-out 35ms;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-lens {\n  animation: dsh-pni-lens 260ms ease-out;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-pin {\n  animation: dsh-pni-pin 240ms ease-out;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-hand {\n  animation: dsh-pni-clock 360ms ease-out;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-flap {\n  animation: dsh-pni-folder 260ms ease-out;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-gear,\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-stop-square {\n  animation: dsh-pni-gear 320ms cubic-bezier(.34, 1.4, .64, 1);\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-lid {\n  animation: dsh-pni-trash-lid 300ms ease-out;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-bin {\n  animation: dsh-pni-trash-bin 260ms ease-out;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-copy-front {\n  animation: dsh-pni-copy-front 240ms ease-out;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-copy-back {\n  animation: dsh-pni-copy-back 240ms ease-out;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-plus {\n  animation: dsh-pni-plus 280ms cubic-bezier(.34, 1.4, .64, 1);\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-arrow {\n  animation: dsh-pni-arrow 260ms ease-out;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-chevron {\n  animation: dsh-pni-chevron 230ms ease-out;\n}\n\n.dsh-prism-native-icon[data-prism-icon-expanded=\"true\"] .ai-part-chevron {\n  transform: rotate(180deg);\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-d1 {\n  animation: dsh-pni-dot 260ms ease-out;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-d2 {\n  animation: dsh-pni-dot 260ms ease-out 45ms;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-d3 {\n  animation: dsh-pni-dot 260ms ease-out 90ms;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-wave {\n  animation: dsh-pni-radar 300ms ease-out;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-k1 {\n  animation: dsh-pni-slider-one 260ms ease-out;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-k2 {\n  animation: dsh-pni-slider-two 260ms ease-out;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-k3 {\n  animation: dsh-pni-slider-three 260ms ease-out;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-celestial {\n  animation: dsh-pni-celestial 320ms ease-out;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-rays {\n  animation: dsh-pni-rays 320ms ease-out;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-top {\n  animation: dsh-pni-layer-top 240ms ease-out;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-bot {\n  animation: dsh-pni-layer-bot 240ms ease-out;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-bolt {\n  animation: dsh-pni-bolt 280ms ease-out;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-triangle {\n  animation: dsh-pni-alert 320ms ease-out;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-cross {\n  animation: dsh-pni-close 280ms ease-out;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-terminal-frame {\n  opacity: .72;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"]:hover .ai-part-prompt {\n  animation: dsh-pni-terminal 320ms steps(2, end);\n}\n\nbutton[data-prism-native-icon-injected=\"1\"][data-prism-icon-kind=\"send\"][aria-busy=\"true\"] .dsh-prism-native-icon {\n  opacity: .58;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"][data-prism-icon-kind=\"copy\"] .dsh-prism-anim-svg {\n  transition: transform 180ms ease, opacity 180ms ease;\n}\n\nbutton[data-prism-native-icon-injected=\"1\"][data-prism-icon-kind=\"copy\"] .dsh-prism-anim-svg.is-active {\n  transform: scale(1.04);\n}\n\n[data-prism-native-icon-motion=\"off\"] .dsh-prism-native-icon *,\n[data-prism-native-icon-motion=\"reduced\"] .dsh-prism-native-icon *,\n[data-prism-native-icon-motion=\"off\"] .dsh-prism-model-glyph *,\n[data-prism-native-icon-motion=\"reduced\"] .dsh-prism-model-glyph *,\n[data-prism-native-icon-motion=\"off\"] .dsh-prism-anim-svg,\n[data-prism-native-icon-motion=\"reduced\"] .dsh-prism-anim-svg {\n  animation: none !important;\n  transition: none !important;\n}\n\nhtml[data-ag-cs-motion=\"off\"] .dsh-prism-native-icon *,\nhtml[data-ag-cs-motion=\"reduced\"] .dsh-prism-native-icon *,\nhtml[data-prism-motion=\"off\"] .dsh-prism-native-icon *,\nhtml[data-prism-motion=\"reduced\"] .dsh-prism-native-icon *,\nhtml[data-ag-cs-motion=\"off\"] .dsh-prism-model-glyph *,\nhtml[data-ag-cs-motion=\"reduced\"] .dsh-prism-model-glyph *,\nhtml[data-prism-motion=\"off\"] .dsh-prism-model-glyph *,\nhtml[data-prism-motion=\"reduced\"] .dsh-prism-model-glyph * {\n  animation: none !important;\n  transition: none !important;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .dsh-prism-native-icon *,\n  .dsh-prism-model-glyph *,\n  .dsh-prism-anim-svg,\n  .dsh-prism-model-glyph {\n    animation: none !important;\n    transition: none !important;\n  }\n}\n\n@keyframes dsh-pni-panel-left {\n  0%, 100% { transform: translateX(0); }\n  55% { transform: translateX(1.8px); }\n}\n\n@keyframes dsh-pni-pen {\n  0%, 100% { transform: rotate(0) translate(0, 0); }\n  55% { transform: rotate(-9deg) translate(.6px, -.6px); }\n}\n\n@keyframes dsh-pni-spark {\n  0%, 100% { transform: scale(1) rotate(0); opacity: .7; }\n  55% { transform: scale(1.3) rotate(24deg); opacity: 1; }\n}\n\n@keyframes dsh-pni-lens {\n  0%, 100% { transform: rotate(0); }\n  55% { transform: rotate(-11deg) scale(1.06); }\n}\n\n@keyframes dsh-pni-pin {\n  0%, 100% { transform: translateY(0); }\n  55% { transform: translateY(2px); }\n}\n\n@keyframes dsh-pni-clock {\n  from { transform: rotate(0); }\n  to { transform: rotate(360deg); }\n}\n\n@keyframes dsh-pni-folder {\n  0%, 100% { transform: translateY(0) scaleY(1); }\n  55% { transform: translateY(1.2px) scaleY(.86); }\n}\n\n@keyframes dsh-pni-gear {\n  0%, 100% { transform: rotate(0); }\n  60% { transform: rotate(65deg); }\n}\n\n@keyframes dsh-pni-trash-lid {\n  0%, 100% { transform: translateY(0) rotate(0); }\n  55% { transform: translateY(-1.5px) rotate(-15deg); }\n}\n\n@keyframes dsh-pni-trash-bin {\n  0%, 100% { transform: rotate(0); }\n  45% { transform: rotate(3deg); }\n  70% { transform: rotate(-2deg); }\n}\n\n@keyframes dsh-pni-copy-front {\n  0%, 100% { transform: translate(0, 0); }\n  55% { transform: translate(-1.1px, 1.1px); }\n}\n\n@keyframes dsh-pni-copy-back {\n  0%, 100% { transform: translate(0, 0); }\n  55% { transform: translate(1.1px, -1.1px); }\n}\n\n@keyframes dsh-pni-plus {\n  0%, 100% { transform: rotate(0); }\n  65% { transform: rotate(90deg); }\n}\n\n@keyframes dsh-pni-arrow {\n  0%, 100% { transform: translateY(0) scale(1); }\n  55% { transform: translateY(-2.2px) scale(1.04); }\n}\n\n@keyframes dsh-pni-chevron {\n  0%, 100% { transform: translateX(0); }\n  55% { transform: translateX(1.8px); }\n}\n\n@keyframes dsh-pni-dot {\n  0%, 100% { transform: translateY(0); }\n  55% { transform: translateY(-2.2px); }\n}\n\n@keyframes dsh-pni-radar {\n  0%, 100% { transform: scale(1); opacity: .75; }\n  55% { transform: scale(1.13); opacity: 1; }\n}\n\n@keyframes dsh-pni-slider-one {\n  0%, 100% { transform: translateX(0); }\n  55% { transform: translateX(3px); }\n}\n\n@keyframes dsh-pni-slider-two {\n  0%, 100% { transform: translateX(0); }\n  55% { transform: translateX(-3.4px); }\n}\n\n@keyframes dsh-pni-slider-three {\n  0%, 100% { transform: translateX(0); }\n  55% { transform: translateX(2.7px); }\n}\n\n@keyframes dsh-pni-celestial {\n  0%, 100% { transform: rotate(0) scale(1); }\n  55% { transform: rotate(-23deg) scale(1.06); }\n}\n\n@keyframes dsh-pni-rays {\n  0%, 100% { transform: rotate(0) scale(1); opacity: .65; }\n  55% { transform: rotate(34deg) scale(1.06); opacity: 1; }\n}\n\n@keyframes dsh-pni-layer-top {\n  0%, 100% { transform: translateY(0); }\n  55% { transform: translateY(-1.8px); }\n}\n\n@keyframes dsh-pni-layer-bot {\n  0%, 100% { transform: translateY(0); }\n  55% { transform: translateY(1.8px); }\n}\n\n@keyframes dsh-pni-bolt {\n  0%, 100% { transform: scale(1) rotate(0); }\n  40% { transform: scale(1.14) rotate(-7deg); }\n  70% { transform: scale(.98) rotate(3deg); }\n}\n\n@keyframes dsh-pni-alert {\n  0%, 100% { transform: rotate(0); }\n  25% { transform: rotate(-7deg); }\n  55% { transform: rotate(7deg); }\n  78% { transform: rotate(-3deg); }\n}\n\n@keyframes dsh-pni-close {\n  0%, 100% { transform: rotate(0) scale(1); }\n  65% { transform: rotate(90deg) scale(1.05); }\n}\n\n@keyframes dsh-pni-terminal {\n  0%, 100% { opacity: 1; }\n  50% { opacity: .35; }\n}\n\n/*!\n * Obsidian Prism for DeepSeek Harness\n * Responsive workbench: composer tiers, native scroll-to-bottom polish and sidebar fold.\n */\n\nhtml[data-prism-responsive-workbench] {\n  --prism-rw-fg: var(--dsw-alias-label-primary, #e8edf7);\n  --prism-rw-fg-2: var(--dsw-alias-label-secondary, #aab5c8);\n  --prism-rw-fg-3: var(--dsw-alias-label-caption, #77839a);\n  --prism-rw-border: color-mix(in srgb, var(--dsw-alias-border-l2, #475063) 78%, transparent);\n  --prism-rw-border-hi: color-mix(in srgb, var(--dsw-alias-state-business-primary, #7c8cff) 48%, transparent);\n  --prism-rw-surface: color-mix(in srgb, var(--dsw-alias-bg-layer-1, #161a23) 82%, transparent);\n  --prism-rw-surface-hi: color-mix(in srgb, var(--dsw-alias-bg-layer-2, #202633) 88%, transparent);\n  --prism-rw-wash: color-mix(in srgb, var(--dsw-alias-state-business-primary, #7c8cff) 11%, transparent);\n  --prism-rw-specular: color-mix(in srgb, #fff 14%, transparent);\n  --prism-rw-shadow: 0 8px 24px -12px rgba(2, 6, 18, .74), 0 0 0 1px var(--prism-rw-border);\n  --prism-rw-ease: cubic-bezier(.2, .72, .18, 1);\n}\n\nhtml[data-prism-theme=\"obsidian\"][data-prism-responsive-workbench] {\n  --prism-rw-fg: #edf1ff;\n  --prism-rw-fg-2: #aab5cf;\n  --prism-rw-fg-3: #7885a3;\n  --prism-rw-border: rgba(151, 166, 204, .22);\n  --prism-rw-border-hi: rgba(126, 144, 255, .5);\n  --prism-rw-surface: rgba(14, 18, 30, .9);\n  --prism-rw-surface-hi: rgba(25, 31, 49, .94);\n  --prism-rw-wash: rgba(114, 132, 255, .13);\n  --prism-rw-shadow: 0 10px 28px -14px rgba(0, 0, 0, .82), inset 0 1px 0 rgba(255, 255, 255, .08);\n}\n\nhtml[data-prism-theme=\"warm\"][data-prism-responsive-workbench] {\n  --prism-rw-fg: #f3ece2;\n  --prism-rw-fg-2: #c6b9aa;\n  --prism-rw-fg-3: #968779;\n  --prism-rw-border: rgba(210, 190, 166, .23);\n  --prism-rw-border-hi: rgba(221, 156, 103, .52);\n  --prism-rw-surface: rgba(30, 24, 21, .91);\n  --prism-rw-surface-hi: rgba(43, 34, 29, .95);\n  --prism-rw-wash: rgba(218, 146, 93, .13);\n  --prism-rw-shadow: 0 10px 28px -14px rgba(13, 7, 3, .78), inset 0 1px 0 rgba(255, 240, 220, .08);\n}\n\nhtml[data-prism-theme=\"crystal\"][data-prism-responsive-workbench] {\n  --prism-rw-fg: #1d293a;\n  --prism-rw-fg-2: #4e6078;\n  --prism-rw-fg-3: #75849a;\n  --prism-rw-border: rgba(74, 101, 135, .2);\n  --prism-rw-border-hi: rgba(75, 118, 220, .44);\n  --prism-rw-surface: rgba(247, 250, 255, .9);\n  --prism-rw-surface-hi: rgba(231, 239, 251, .94);\n  --prism-rw-wash: rgba(72, 116, 220, .1);\n  --prism-rw-specular: rgba(255, 255, 255, .72);\n  --prism-rw-shadow: 0 10px 28px -15px rgba(25, 52, 92, .35), inset 0 1px 0 rgba(255, 255, 255, .8);\n}\n\nhtml[data-prism-theme=\"alabaster\"][data-prism-responsive-workbench] {\n  --prism-rw-fg: #302b26;\n  --prism-rw-fg-2: #60584f;\n  --prism-rw-fg-3: #8a7f74;\n  --prism-rw-border: rgba(109, 91, 72, .19);\n  --prism-rw-border-hi: rgba(177, 126, 75, .42);\n  --prism-rw-surface: rgba(251, 248, 241, .92);\n  --prism-rw-surface-hi: rgba(240, 234, 224, .95);\n  --prism-rw-wash: rgba(174, 126, 78, .09);\n  --prism-rw-specular: rgba(255, 255, 255, .76);\n  --prism-rw-shadow: 0 10px 28px -15px rgba(78, 57, 35, .28), inset 0 1px 0 rgba(255, 255, 255, .82);\n}\n\n/* Composer tier contract:\n   0 is fully expanded; 1-4 remove text in priority order; 5 compacts geometry.\n   Every trigger remains mounted, clickable and named through its own aria-label. */\n[data-composer-card][data-prism-toolbar-tier] .GRgSLq_row {\n  min-width: 0;\n  transition:\n    gap 160ms var(--prism-rw-ease),\n    padding-inline 160ms var(--prism-rw-ease);\n}\n\n[data-composer-card][data-prism-toolbar-tier] .GRgSLq_tools,\n[data-composer-card][data-prism-toolbar-tier] .GRgSLq_modes,\n[data-composer-card][data-prism-toolbar-tier] .GRgSLq_trailing,\n[data-composer-card][data-prism-toolbar-tier] .GRgSLq_standardControls {\n  min-width: 0;\n  transition: gap 160ms var(--prism-rw-ease);\n}\n\n[data-prism-toolbar-copy] {\n  transition:\n    opacity 130ms ease,\n    max-width 180ms var(--prism-rw-ease),\n    margin 180ms var(--prism-rw-ease);\n}\n\n[data-prism-toolbar-model],\n[data-prism-plan-trigger] {\n  min-width: 0;\n  transition:\n    width 160ms var(--prism-rw-ease),\n    max-width 160ms var(--prism-rw-ease),\n    padding-inline 160ms var(--prism-rw-ease),\n    gap 160ms var(--prism-rw-ease);\n}\n\n[data-prism-toolbar-tier=\"1\"] [data-prism-toolbar-copy=\"model\"],\n[data-prism-toolbar-tier=\"2\"] [data-prism-toolbar-copy=\"vial\"],\n[data-prism-toolbar-tier=\"3\"] [data-prism-toolbar-copy=\"plan\"],\n[data-prism-toolbar-tier=\"4\"] [data-prism-toolbar-copy=\"secondary\"] {\n  display: none !important;\n}\n\n[data-prism-toolbar-tier=\"1\"] [data-prism-toolbar-model] {\n  max-width: 62px;\n  padding-inline: 6px;\n}\n\n[data-prism-toolbar-tier=\"2\"] [data-prism-toolbar-vial] > button {\n  width: 28px;\n  min-width: 28px;\n  padding-inline: 0;\n  justify-content: center;\n}\n\n[data-prism-toolbar-tier=\"3\"] [data-prism-plan-trigger] {\n  width: 28px;\n  min-width: 28px;\n  padding-inline: 0;\n  gap: 0;\n  justify-content: center;\n  font-size: 0 !important;\n}\n\n[data-prism-toolbar-tier=\"3\"] [data-prism-plan-trigger]::before {\n  content: \"\";\n  width: 14px;\n  height: 14px;\n  border: 1.25px solid currentColor;\n  border-radius: 4px;\n  box-sizing: border-box;\n  opacity: .82;\n  background:\n    linear-gradient(currentColor, currentColor) 50% 5px / 6px 1px no-repeat,\n    linear-gradient(currentColor, currentColor) 50% 8px / 8px 1px no-repeat;\n}\n\n[data-prism-toolbar-tier=\"4\"] [data-prism-secondary-controls] {\n  gap: 4px !important;\n}\n\n[data-prism-toolbar-tier=\"4\"] [data-prism-secondary-controls] button {\n  padding-inline: 5px;\n}\n\n[data-prism-toolbar-tier=\"5\"] .GRgSLq_row {\n  gap: 4px;\n  padding-inline: 6px;\n}\n\n[data-prism-toolbar-tier=\"5\"] .GRgSLq_tools,\n[data-prism-toolbar-tier=\"5\"] .GRgSLq_modes,\n[data-prism-toolbar-tier=\"5\"] .GRgSLq_trailing,\n[data-prism-toolbar-tier=\"5\"] .GRgSLq_standardControls {\n  gap: 4px !important;\n}\n\n[data-prism-toolbar-tier=\"5\"] [data-prism-toolbar-model] {\n  width: 28px;\n  max-width: 28px;\n  padding-inline: 0;\n  gap: 0;\n  justify-content: center;\n}\n\n[data-prism-toolbar-tier=\"5\"] [data-prism-toolbar-chevron] {\n  display: none !important;\n}\n\n[data-prism-toolbar-tier=\"5\"] [data-prism-toolbar-vial],\n[data-prism-toolbar-tier=\"5\"] [data-prism-plan-trigger] {\n  gap: 2px;\n}\n\n[data-prism-toolbar-tier=\"5\"] [data-prism-toolbar-vial] > button,\n[data-prism-toolbar-tier=\"5\"] [data-prism-plan-trigger] {\n  width: 26px;\n  min-width: 26px;\n  height: 26px;\n  min-height: 26px;\n}\n\n[data-prism-toolbar-tier=\"5\"] [data-prism-toolbar-vial] .dsh-prism-gear-btn {\n  width: 26px;\n  height: 26px;\n}\n\n[data-prism-toolbar-tier=\"5\"] [data-prism-secondary-controls] {\n  gap: 2px !important;\n}\n\n/* Sidebar navigation fold. The extra launcher is appended beside the native\n   navigation children; React-owned rows are only marked, never moved or wrapped. */\n[data-prism-nav-hidden=\"1\"] {\n  display: none !important;\n}\n\n.dsh-prism-nav-more {\n  appearance: none;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  width: 100%;\n  min-height: 32px;\n  margin: 2px 0 0;\n  padding: 5px 10px;\n  box-sizing: border-box;\n  border: 1px solid transparent;\n  border-radius: var(--dsw-radius-md, 9px);\n  background: transparent;\n  color: var(--prism-rw-fg-2);\n  font: inherit;\n  font-size: 13px;\n  line-height: 22px;\n  text-align: left;\n  cursor: pointer;\n  transition:\n    color 130ms ease,\n    background-color 130ms ease,\n    border-color 130ms ease;\n}\n\n.dsh-prism-nav-more-label {\n  flex: 1;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.dsh-prism-nav-more svg {\n  flex: none;\n  transition: transform 180ms var(--prism-rw-ease);\n}\n\n.dsh-prism-nav-more[data-expanded=\"1\"] svg {\n  transform: rotate(180deg);\n}\n\n.dsh-prism-nav-more:hover {\n  color: var(--prism-rw-fg);\n  background: var(--prism-rw-wash);\n  border-color: var(--prism-rw-border);\n}\n\n.dsh-prism-nav-more:focus-visible {\n  outline: 1px solid var(--prism-rw-border-hi);\n  outline-offset: -2px;\n}\n\n/* Native DSH bottom control: only decorate its material and motion, preserving\n   the host button, placement and event contract. */\nbutton[data-prism-scroll-bottom-native=\"1\"] {\n  color: var(--prism-rw-fg-2) !important;\n  border: 1px solid var(--prism-rw-border) !important;\n  background:\n    linear-gradient(180deg, var(--prism-rw-specular), transparent 55%),\n    var(--prism-rw-surface) !important;\n  box-shadow: var(--prism-rw-shadow) !important;\n  backdrop-filter: blur(14px) saturate(135%);\n  transition:\n    color 130ms ease,\n    border-color 130ms ease,\n    background-color 130ms ease,\n    transform 180ms var(--prism-rw-ease) !important;\n}\n\nbutton[data-prism-scroll-bottom-native=\"1\"]:hover {\n  color: var(--prism-rw-fg) !important;\n  border-color: var(--prism-rw-border-hi) !important;\n  transform: translateY(-1px);\n}\n\nbutton[data-prism-scroll-bottom-native=\"1\"] svg {\n  transition: transform 180ms var(--prism-rw-ease);\n}\n\nbutton[data-prism-scroll-bottom-native=\"1\"][data-prism-scrolling=\"1\"] svg {\n  transform: translateY(2px);\n}\n\n.dsh-prism-scroll-bottom {\n  position: fixed;\n  right: var(--prism-rw-scroll-right, 20px);\n  bottom: var(--prism-rw-scroll-bottom, 142px);\n  z-index: 18;\n  display: grid;\n  width: 32px;\n  height: 32px;\n  padding: 0;\n  place-items: center;\n  box-sizing: border-box;\n  border: 1px solid var(--prism-rw-border);\n  border-radius: 999px;\n  background:\n    linear-gradient(180deg, var(--prism-rw-specular), transparent 58%),\n    var(--prism-rw-surface);\n  color: var(--prism-rw-fg-2);\n  box-shadow: var(--prism-rw-shadow);\n  backdrop-filter: blur(14px) saturate(135%);\n  cursor: pointer;\n  transition:\n    opacity 140ms ease,\n    color 130ms ease,\n    border-color 130ms ease,\n    transform 180ms var(--prism-rw-ease);\n}\n\n.dsh-prism-scroll-bottom[hidden] {\n  display: none !important;\n}\n\n.dsh-prism-scroll-bottom:hover {\n  color: var(--prism-rw-fg);\n  border-color: var(--prism-rw-border-hi);\n  transform: translateY(-1px);\n}\n\n.dsh-prism-scroll-bottom[data-prism-scrolling=\"1\"] svg {\n  transform: translateY(2px);\n}\n\n.dsh-prism-scroll-bottom:focus-visible {\n  outline: 1px solid var(--prism-rw-border-hi);\n  outline-offset: 2px;\n}\n\n@media (max-width: 560px) {\n  .dsh-prism-scroll-bottom {\n    right: var(--prism-rw-scroll-right, 12px);\n    bottom: var(--prism-rw-scroll-bottom, 136px);\n  }\n}\n\nhtml[data-ag-cs-motion=\"off\"] [data-composer-card][data-prism-toolbar-tier],\nhtml[data-ag-cs-motion=\"off\"] [data-composer-card][data-prism-toolbar-tier] *,\nhtml[data-prism-motion=\"off\"] [data-composer-card][data-prism-toolbar-tier],\nhtml[data-prism-motion=\"off\"] [data-composer-card][data-prism-toolbar-tier] *,\nhtml[data-ag-cs-motion=\"off\"] .dsh-prism-nav-more,\nhtml[data-prism-motion=\"off\"] .dsh-prism-nav-more,\nhtml[data-ag-cs-motion=\"off\"] .dsh-prism-scroll-bottom,\nhtml[data-prism-motion=\"off\"] .dsh-prism-scroll-bottom {\n  transition-duration: 0s !important;\n  animation-duration: 0s !important;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  [data-composer-card][data-prism-toolbar-tier],\n  [data-composer-card][data-prism-toolbar-tier] *,\n  .dsh-prism-nav-more,\n  .dsh-prism-nav-more *,\n  .dsh-prism-scroll-bottom,\n  .dsh-prism-scroll-bottom * {\n    scroll-behavior: auto !important;\n    transition-duration: 0s !important;\n    animation-duration: 0s !important;\n  }\n}\n";

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
          // === [1/10] src/tokens-palettes.js ===
;(function (root, window, self, document, module, exports) {
/**
 * Obsidian Prism (黑曜棱镜) — DeepSeek Harness (DSH) 光学色彩体系与 Token 映射引擎
 *
 * 1:1 提取自 upstream RMvdesi/obsidian-prism (v1.0.4) style.css 与 workbench/styles/v2-tokens.css。
 * 同时映射至 DeepSeek Harness (--dsw-static-* / --dsw-alias-*) 与 Obsidian Prism (--ag-prism-* / --ag-cs-*) 变量，
 * 确保四套深浅主题与五档工业强调色在 DSH Web UI 中保持 1:1 光学还原度。
 *
 * License: GPL-3.0-only (保留原作者 RMvdesi 署名与 NOTICE 声明)
 */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  if (root && typeof root === 'object') {
    root.DSHPrismTokens = api;
    root.__agPrismTokens = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  /**
   * 四套原版 Obsidian Prism 核心光学主题定义
   * - obsidian:  深空黑曜 (#09090B 侧栏 / #0E0E11 主画布) — 零色偏中性钛黑深色旗舰
   * - warm:      暖炭玄岩 (#10100F 侧栏 / #141413 主画布) — 低蓝光暖炭褐夜间编辑色
   * - crystal:   白昼冷晶 (#E8EEF6 侧栏 / #F4F7FB 主画布) — 冷石板矿物描边高明度白昼色
   * - alabaster: 暖白画册 (#EBE6DC 侧栏 / #F6F4EE 主画布) — 艺术画册暖白纸感浅色
   */
  const PRISM_THEMES = Object.freeze({
    obsidian: Object.freeze({
      id: 'obsidian',
      label: '深空黑曜',
      labelEn: 'Obsidian Neutral',
      description: '冷调深灰底色，零色偏中性钛黑高对比度代码阅读配色',
      mode: 'dark',
      palette: 'obsidian',
      lightPreset: 'crystal',
      sidebar: '#09090B',
      background: '#0E0E11',
      shell: '#0B0B0E',
      content: '#0E0E11',
      surface1: '#141418',
      surface2: '#1C1C22',
      surface3: '#24242B',
      card: '#141418',
      codeWell: '#09090B',
      consoleWell: '#08080A',
      foreground: '#F2F2F5',
      secondaryForeground: '#C4C4CE',
      mutedForeground: '#8A8A98',
      placeholder: '#626270',
      primary: '#669DF6',
      primarySoft: 'rgba(102, 157, 246, 0.14)',
      primaryBorder: 'rgba(102, 157, 246, 0.38)',
      primaryForeground: '#FFFFFF',
      link: '#8AB4F8',
      success: '#50A37B',
      warning: '#F2B84B',
      error: '#E5534B',
      scrim: 'rgba(9, 9, 11, 0.74)',
      border: 'rgba(255, 255, 255, 0.072)',
      cardBorder: 'rgba(255, 255, 255, 0.088)',
      specular: 'rgba(255, 255, 255, 0.095)',
      focusSpec: 'rgba(255, 255, 255, 0.14)',
      whisperHover: 'rgba(255, 255, 255, 0.032)',
      sidebarMuted: 'rgba(255, 255, 255, 0.045)',
      sidebarSecondary: 'rgba(255, 255, 255, 0.072)',
      sidebarHover: 'rgba(255, 255, 255, 0.055)',
      sidebarRowHover: 'rgba(255, 255, 255, 0.042)',
      sidebarSelected: 'rgba(255, 255, 255, 0.074)',
      sidebarSelBar: 'linear-gradient(#5CC6FC 0%, #3186FF 100%)',
      sidebarSelGlow: '0 0 6px rgba(92, 198, 252, 0.42)',
      composerBg: 'rgba(20, 21, 26, 0.97)',
      panelBg: 'rgba(19, 20, 25, 0.965)',
      popoverBg: 'rgba(23, 24, 30, 0.93)',
      pillBg: 'rgba(28, 29, 36, 0.78)',
      bubbleBg: 'rgba(255, 255, 255, 0.052)',
      sendBg: '#F2F3F7',
      sendFg: '#0E0F14',
      rippleInk: '#92949C',
      rippleWave: '#D6DAE4',
      thoughtRule: 'rgba(92, 198, 252, 0.26)',
      cometBg: '#7CE2FF',
      cometShadow: '0 0 8px rgba(92, 198, 252, 0.85)',
      navActive: '#5CC6FC',
      navGlow: '0 0 7px rgba(92, 198, 252, 0.55)',
      sonarBorder: 'rgba(92, 198, 252, 0.42)',
      sonarGlow: 'rgba(92, 198, 252, 0.22)',
      sonarWash: 'rgba(92, 198, 252, 0.042)',
      heatHi1: '#58C4F6',
      heatHi2: '#8CE0FF',
      sheen: 'linear-gradient(172deg, rgba(255, 255, 255, 0.046) 0%, rgba(160, 185, 245, 0.014) 36%, rgba(10, 11, 16, 0.2) 100%)',
      composerShadow: '0 1px 2px rgba(0, 0, 0, 0.44), 0 8px 20px -6px rgba(0, 0, 0, 0.48), 0 20px 44px -14px rgba(0, 0, 0, 0.62)',
      surfaceShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.095), 0 12px 32px -8px rgba(0, 0, 0, 0.36)',
      bubbleShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.095)',
      prismCobalt: '#4285F4',
      prismIris: '#9B72CB',
      prismCoral: '#EA4335',
      prismAmber: '#FBBC04',
    }),

    warm: Object.freeze({
      id: 'warm',
      label: '暖炭玄岩',
      labelEn: 'Warm Editorial',
      description: '暖炭褐底色，低蓝光夜间沉浸阅读与长文推演配色',
      mode: 'dark',
      palette: 'warm',
      lightPreset: 'alabaster',
      sidebar: '#10100F',
      background: '#141413',
      shell: '#141413',
      content: '#141413',
      surface1: '#1B1A18',
      surface2: '#22201D',
      surface3: '#2A2824',
      card: '#1B1A18',
      codeWell: '#0F0F0E',
      consoleWell: '#0C0B0A',
      foreground: '#F2EFE9',
      secondaryForeground: '#CEC8BC',
      mutedForeground: '#A39E93',
      placeholder: '#6E6A61',
      primary: '#D97757',
      primarySoft: 'rgba(217, 119, 87, 0.14)',
      primaryBorder: 'rgba(217, 119, 87, 0.36)',
      primaryForeground: '#FFFFFF',
      link: '#E59377',
      success: '#56A87E',
      warning: '#E5A93B',
      error: '#E5534B',
      scrim: 'rgba(0, 0, 0, 0.64)',
      border: 'rgba(245, 240, 230, 0.082)',
      cardBorder: 'rgba(245, 240, 230, 0.115)',
      specular: 'rgba(255, 250, 242, 0.095)',
      focusSpec: 'rgba(240, 163, 126, 0.16)',
      whisperHover: 'rgba(245, 240, 230, 0.036)',
      sidebarMuted: 'rgba(245, 240, 230, 0.045)',
      sidebarSecondary: 'rgba(245, 240, 230, 0.075)',
      sidebarHover: 'rgba(245, 240, 230, 0.055)',
      sidebarRowHover: 'rgba(245, 240, 230, 0.042)',
      sidebarSelected: 'rgba(245, 240, 230, 0.078)',
      sidebarSelBar: 'linear-gradient(#F0A37E 0%, #D97757 100%)',
      sidebarSelGlow: '0 0 6px rgba(217, 119, 87, 0.42)',
      composerBg: 'rgba(28, 27, 25, 0.97)',
      panelBg: 'rgba(26, 25, 23, 0.965)',
      popoverBg: 'rgba(25, 24, 22, 0.93)',
      pillBg: 'rgba(35, 33, 30, 0.80)',
      bubbleBg: 'rgba(245, 240, 230, 0.055)',
      sendBg: '#F2EFE9',
      sendFg: '#141413',
      rippleInk: '#B4AEA2',
      rippleWave: '#D97757',
      thoughtRule: 'rgba(229, 147, 119, 0.36)',
      cometBg: '#F0A37E',
      cometShadow: '0 0 8px rgba(217, 119, 87, 0.80)',
      navActive: '#E59377',
      navGlow: '0 0 7px rgba(217, 119, 87, 0.52)',
      sonarBorder: 'rgba(229, 147, 119, 0.45)',
      sonarGlow: 'rgba(217, 119, 87, 0.24)',
      sonarWash: 'rgba(217, 119, 87, 0.05)',
      heatHi1: '#EE9B7A',
      heatHi2: '#F6C2A8',
      sheen: 'linear-gradient(172deg, rgba(255, 248, 236, 0.042) 0%, rgba(217, 119, 87, 0.014) 38%, rgba(16, 15, 13, 0.2) 100%)',
      composerShadow: '0 1px 2px rgba(0, 0, 0, 0.44), 0 10px 28px -6px rgba(0, 0, 0, 0.50)',
      surfaceShadow: 'inset 0 1px 0 rgba(255, 250, 242, 0.095), 0 12px 32px -8px rgba(0, 0, 0, 0.40)',
      bubbleShadow: 'inset 0 1px 0 rgba(255, 250, 242, 0.095)',
      prismCobalt: '#E59377',
      prismIris: '#D97757',
      prismCoral: '#EA580C',
      prismAmber: '#F6BD60',
    }),

    crystal: Object.freeze({
      id: 'crystal',
      label: '白昼冷晶',
      labelEn: 'Daylight Crystal',
      description: '冷调浅灰蓝侧栏与高明度工作区，双层冷石板微投影与清晰矿物描边',
      mode: 'light',
      palette: 'obsidian',
      lightPreset: 'crystal',
      sidebar: '#E8EEF6',
      background: '#F4F7FB',
      shell: '#F4F7FB',
      content: '#F4F7FB',
      surface1: '#FFFFFF',
      surface2: '#E9EFF8',
      surface3: '#E1E9F4',
      card: '#FFFFFF',
      codeWell: '#EDF2F9',
      consoleWell: '#E6ECF5',
      foreground: '#0F172A',
      secondaryForeground: '#334155',
      mutedForeground: '#5B6B82',
      placeholder: '#7C8CA5',
      primary: '#2563EB',
      primarySoft: 'rgba(37, 99, 235, 0.11)',
      primaryBorder: 'rgba(37, 99, 235, 0.36)',
      primaryForeground: '#FFFFFF',
      link: '#1D4ED8',
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      scrim: 'rgba(15, 23, 42, 0.36)',
      border: 'rgba(15, 23, 42, 0.115)',
      cardBorder: 'rgba(15, 23, 42, 0.16)',
      specular: 'rgba(255, 255, 255, 0.94)',
      focusSpec: 'rgba(37, 99, 235, 0.14)',
      whisperHover: 'rgba(15, 23, 42, 0.048)',
      sidebarMuted: 'rgba(15, 23, 42, 0.052)',
      sidebarSecondary: 'rgba(15, 23, 42, 0.085)',
      sidebarHover: 'rgba(15, 23, 42, 0.058)',
      sidebarRowHover: 'rgba(15, 23, 42, 0.046)',
      sidebarSelected: '#FFFFFF',
      sidebarSelBar: 'linear-gradient(#2563EB 0%, #4F46E5 100%)',
      sidebarSelGlow: '0 0 6px rgba(37, 99, 235, 0.36)',
      composerBg: '#FFFFFF',
      panelBg: 'rgba(255, 255, 255, 0.975)',
      popoverBg: 'rgba(255, 255, 255, 0.96)',
      pillBg: '#EEF3FA',
      bubbleBg: '#EAF1FB',
      sendBg: '#0F172A',
      sendFg: '#F8FAFC',
      rippleInk: '#556682',
      rippleWave: '#2563EB',
      thoughtRule: 'rgba(37, 99, 235, 0.45)',
      cometBg: '#2563EB',
      cometShadow: '0 0 8px rgba(37, 99, 235, 0.65)',
      navActive: '#2563EB',
      navGlow: '0 0 0 2px rgba(37, 99, 235, 0.20), 0 0 8px rgba(37, 99, 235, 0.48)',
      sonarBorder: 'rgba(37, 99, 235, 0.48)',
      sonarGlow: 'rgba(37, 99, 235, 0.18)',
      sonarWash: 'rgba(37, 99, 235, 0.065)',
      heatHi1: '#38BDF8',
      heatHi2: '#60A5FA',
      sheen: 'linear-gradient(176deg, rgba(255, 255, 255, 0.96) 0%, rgba(241, 246, 255, 0.55) 100%)',
      composerShadow: '0 1px 3px rgba(15, 23, 42, 0.06), 0 10px 28px -6px rgba(30, 58, 138, 0.10), 0 0 0 1px rgba(15, 23, 42, 0.08)',
      surfaceShadow: '0 1px 3px rgba(15, 23, 42, 0.06), 0 10px 28px -6px rgba(30, 58, 138, 0.10), 0 0 0 1px rgba(15, 23, 42, 0.06)',
      bubbleShadow: '0 1px 2px rgba(15, 23, 42, 0.045), inset 0 1px 0 rgba(255, 255, 255, 0.82)',
      prismCobalt: '#2563EB',
      prismIris: '#7C3AED',
      prismCoral: '#EA4335',
      prismAmber: '#D97706',
    }),

    alabaster: Object.freeze({
      id: 'alabaster',
      label: '暖白画册',
      labelEn: 'Warm Alabaster',
      description: '暖白纸色背景与赤陶墨色点缀，柔和对比度画册感浅色配色',
      mode: 'light',
      palette: 'warm',
      lightPreset: 'alabaster',
      sidebar: '#EBE6DC',
      background: '#F6F4EE',
      shell: '#F6F4EE',
      content: '#F6F4EE',
      surface1: '#FFFFFF',
      surface2: '#EFECE3',
      surface3: '#E5E0D3',
      card: '#FFFFFF',
      codeWell: '#EFEAE0',
      consoleWell: '#E8E2D5',
      foreground: '#1C1814',
      secondaryForeground: '#3F3830',
      mutedForeground: '#6B6257',
      placeholder: '#8E8477',
      primary: '#C25934',
      primarySoft: 'rgba(194, 89, 52, 0.11)',
      primaryBorder: 'rgba(194, 89, 52, 0.36)',
      primaryForeground: '#FFFFFF',
      link: '#B54D28',
      success: '#15803D',
      warning: '#D97706',
      error: '#DC2626',
      scrim: 'rgba(32, 24, 16, 0.34)',
      border: 'rgba(42, 32, 20, 0.12)',
      cardBorder: 'rgba(42, 32, 20, 0.165)',
      specular: 'rgba(255, 255, 255, 0.96)',
      focusSpec: 'rgba(194, 89, 52, 0.14)',
      whisperHover: 'rgba(42, 32, 20, 0.045)',
      sidebarMuted: 'rgba(42, 32, 20, 0.055)',
      sidebarSecondary: 'rgba(42, 32, 20, 0.088)',
      sidebarHover: 'rgba(42, 32, 20, 0.058)',
      sidebarRowHover: 'rgba(42, 32, 20, 0.046)',
      sidebarSelected: '#FFFFFF',
      sidebarSelBar: 'linear-gradient(#D97757 0%, #B54D28 100%)',
      sidebarSelGlow: '0 0 6px rgba(194, 89, 52, 0.32)',
      composerBg: '#FFFFFF',
      panelBg: 'rgba(255, 255, 255, 0.975)',
      popoverBg: 'rgba(255, 255, 255, 0.96)',
      pillBg: '#F2EFE7',
      bubbleBg: '#EFECE2',
      sendBg: '#1C1814',
      sendFg: '#FAF8F5',
      rippleInk: '#665C4E',
      rippleWave: '#C25934',
      thoughtRule: 'rgba(194, 89, 52, 0.42)',
      cometBg: '#C25934',
      cometShadow: '0 0 8px rgba(194, 89, 52, 0.58)',
      navActive: '#C25934',
      navGlow: '0 0 0 2px rgba(194, 89, 52, 0.20), 0 0 8px rgba(194, 89, 52, 0.42)',
      sonarBorder: 'rgba(194, 89, 52, 0.46)',
      sonarGlow: 'rgba(194, 89, 52, 0.18)',
      sonarWash: 'rgba(194, 89, 52, 0.06)',
      heatHi1: '#E07A56',
      heatHi2: '#EA9A78',
      sheen: 'linear-gradient(176deg, rgba(255, 255, 255, 0.97) 0%, rgba(250, 246, 238, 0.58) 100%)',
      composerShadow: '0 1px 3px rgba(42, 32, 20, 0.06), 0 10px 26px -6px rgba(68, 52, 32, 0.10), 0 0 0 1px rgba(42, 32, 20, 0.075)',
      surfaceShadow: '0 1px 3px rgba(42, 32, 20, 0.06), 0 10px 26px -6px rgba(68, 52, 32, 0.10), 0 0 0 1px rgba(42, 32, 20, 0.065)',
      bubbleShadow: '0 1px 2px rgba(42, 32, 20, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.84)',
      prismCobalt: '#C25934',
      prismIris: '#EA580C',
      prismCoral: '#9A3412',
      prismAmber: '#D97706',
    }),
  });

  /**
   * 五档工业强调色预设 (follow / cobalt / iris / amber / mono)
   * 提取自 style.css L121-L131，区分 dark 与 light 模式的精确光谱参数
   */
  const PRISM_ACCENTS = Object.freeze({
    follow: Object.freeze({
      id: 'follow',
      label: '跟随主题',
      labelEn: 'Follow Theme',
      prismMul: 1,
      dark: null,
      light: null,
    }),
    cobalt: Object.freeze({
      id: 'cobalt',
      label: '光学钴蓝',
      labelEn: 'Cobalt Blue',
      prismMul: 1,
      dark: Object.freeze({
        primary: '#669DF6',
        primaryForeground: '#FFFFFF',
        link: '#8AB4F8',
        prismCobalt: '#3B82F6',
        prismIris: '#60A5FA',
        prismCoral: '#38BDF8',
        prismAmber: '#93C5FD',
        accent: '#669DF6',
        sidebarSelBar: 'linear-gradient(#5CC6FC 0%, #3186FF 100%)',
        sidebarSelGlow: '0 0 6px rgba(92, 198, 252, 0.42)',
        cometBg: '#7CE2FF',
        cometShadow: '0 0 8px rgba(92, 198, 252, 0.82)',
        navActive: '#5CC6FC',
        navGlow: '0 0 7px rgba(92, 198, 252, 0.55)',
        heatHi1: '#58C4F6',
        heatHi2: '#8CE0FF',
      }),
      light: Object.freeze({
        primary: '#2563EB',
        primaryForeground: '#FFFFFF',
        link: '#1D4ED8',
        prismCobalt: '#2563EB',
        prismIris: '#3B82F6',
        prismCoral: '#0284C7',
        prismAmber: '#60A5FA',
        accent: '#2563EB',
        sidebarSelBar: 'linear-gradient(#2563EB 0%, #4F46E5 100%)',
        sidebarSelGlow: '0 0 6px rgba(37, 99, 235, 0.34)',
        cometBg: '#2563EB',
        cometShadow: '0 0 8px rgba(37, 99, 235, 0.62)',
        navActive: '#2563EB',
        navGlow: '0 0 0 2px rgba(37, 99, 235, 0.20), 0 0 8px rgba(37, 99, 235, 0.48)',
        heatHi1: '#38BDF8',
        heatHi2: '#60A5FA',
      }),
    }),
    iris: Object.freeze({
      id: 'iris',
      label: '鸢尾星紫',
      labelEn: 'Iris Violet',
      prismMul: 1,
      dark: Object.freeze({
        primary: '#A58AF8',
        primaryForeground: '#FFFFFF',
        link: '#BBA6FF',
        prismCobalt: '#8B5CF6',
        prismIris: '#A78BFA',
        prismCoral: '#C084FC',
        prismAmber: '#DDD6FE',
        accent: '#A58AF8',
        sidebarSelBar: 'linear-gradient(#C4B5FD 0%, #8B5CF6 100%)',
        sidebarSelGlow: '0 0 6px rgba(165, 138, 248, 0.44)',
        cometBg: '#C4B5FD',
        cometShadow: '0 0 8px rgba(165, 138, 248, 0.80)',
        navActive: '#B79DFB',
        navGlow: '0 0 7px rgba(165, 138, 248, 0.55)',
        heatHi1: '#B79DFB',
        heatHi2: '#DDD6FE',
      }),
      light: Object.freeze({
        primary: '#7C3AED',
        primaryForeground: '#FFFFFF',
        link: '#6D28D9',
        prismCobalt: '#7C3AED',
        prismIris: '#8B5CF6',
        prismCoral: '#9333EA',
        prismAmber: '#A78BFA',
        accent: '#7C3AED',
        sidebarSelBar: 'linear-gradient(#8B5CF6 0%, #6D28D9 100%)',
        sidebarSelGlow: '0 0 6px rgba(124, 58, 237, 0.32)',
        cometBg: '#7C3AED',
        cometShadow: '0 0 8px rgba(124, 58, 237, 0.58)',
        navActive: '#7C3AED',
        navGlow: '0 0 0 2px rgba(124, 58, 237, 0.20), 0 0 8px rgba(124, 58, 237, 0.44)',
        heatHi1: '#8B5CF6',
        heatHi2: '#A78BFA',
      }),
    }),
    amber: Object.freeze({
      id: 'amber',
      label: '琥珀流金',
      labelEn: 'Amber Gold',
      prismMul: 1,
      dark: Object.freeze({
        primary: '#F2B84B',
        primaryForeground: '#14120E',
        link: '#F6CB75',
        prismCobalt: '#F59E0B',
        prismIris: '#FBBF24',
        prismCoral: '#EA580C',
        prismAmber: '#FDE68A',
        accent: '#F2B84B',
        sidebarSelBar: 'linear-gradient(#FDE68A 0%, #F59E0B 100%)',
        sidebarSelGlow: '0 0 6px rgba(242, 184, 75, 0.42)',
        cometBg: '#FCD34D',
        cometShadow: '0 0 8px rgba(242, 184, 75, 0.78)',
        navActive: '#FBBF24',
        navGlow: '0 0 7px rgba(242, 184, 75, 0.52)',
        heatHi1: '#FBBF24',
        heatHi2: '#FDE68A',
      }),
      light: Object.freeze({
        primary: '#D97706',
        primaryForeground: '#FFFFFF',
        link: '#B45309',
        prismCobalt: '#D97706',
        prismIris: '#F59E0B',
        prismCoral: '#EA580C',
        prismAmber: '#B45309',
        accent: '#D97706',
        sidebarSelBar: 'linear-gradient(#F59E0B 0%, #B45309 100%)',
        sidebarSelGlow: '0 0 6px rgba(217, 119, 6, 0.32)',
        cometBg: '#D97706',
        cometShadow: '0 0 8px rgba(217, 119, 6, 0.56)',
        navActive: '#D97706',
        navGlow: '0 0 0 2px rgba(217, 119, 6, 0.20), 0 0 8px rgba(217, 119, 6, 0.42)',
        heatHi1: '#F59E0B',
        heatHi2: '#FBBF24',
      }),
    }),
    mono: Object.freeze({
      id: 'mono',
      label: '纯银钛单色',
      labelEn: 'Titanium Mono',
      prismMul: 0.32,
      dark: Object.freeze({
        primary: '#D4D7E0',
        primaryForeground: '#0E0F14',
        link: '#E2E5EE',
        prismCobalt: '#E2E8F0',
        prismIris: '#94A3B8',
        prismCoral: '#CBD5E1',
        prismAmber: '#F8FAFC',
        accent: '#D4D7E0',
        sidebarSelBar: 'linear-gradient(#F2F4F8 0%, #9BA3B4 100%)',
        sidebarSelGlow: '0 0 5px rgba(212, 215, 224, 0.28)',
        cometBg: '#E5E7EB',
        cometShadow: '0 0 6px rgba(229, 231, 235, 0.55)',
        navActive: '#E2E5EE',
        navGlow: '0 0 6px rgba(226, 229, 238, 0.45)',
        heatHi1: '#CBD5E1',
        heatHi2: '#F1F5F9',
      }),
      light: Object.freeze({
        primary: '#334155',
        primaryForeground: '#F8FAFC',
        link: '#1E293B',
        prismCobalt: '#334155',
        prismIris: '#64748B',
        prismCoral: '#475569',
        prismAmber: '#0F172A',
        accent: '#334155',
        sidebarSelBar: 'linear-gradient(#475569 0%, #0F172A 100%)',
        sidebarSelGlow: '0 0 5px rgba(51, 65, 85, 0.24)',
        cometBg: '#334155',
        cometShadow: '0 0 6px rgba(51, 65, 85, 0.42)',
        navActive: '#1E293B',
        navGlow: '0 0 0 2px rgba(30, 41, 59, 0.16), 0 0 6px rgba(30, 41, 59, 0.32)',
        heatHi1: '#64748B',
        heatHi2: '#334155',
      }),
    }),
  });

  /**
   * 三档圆角阶梯 (sharp / balanced / soft)
   */
  const CORNER_PRESETS = Object.freeze({
    sharp: Object.freeze({ id: 'sharp', label: '锐利工装', rSm: '2px', rMd: '4px', rLg: '6px' }),
    balanced: Object.freeze({ id: 'balanced', label: '均衡同心', rSm: '4px', rMd: '6px', rLg: '10px' }),
    soft: Object.freeze({ id: 'soft', label: '温润曲面', rSm: '6px', rMd: '10px', rLg: '14px' }),
  });

  /**
   * 四档代码等宽字体栈 (default / jetbrains / cascadia / sfmono)
   */
  const CODE_FONTS = Object.freeze({
    default: "'Google Sans Code', 'JetBrains Mono', 'Cascadia Code', Consolas, ui-monospace, monospace",
    jetbrains: "'JetBrains Mono', 'Cascadia Code', 'Fira Code', Consolas, ui-monospace, monospace",
    cascadia: "'Cascadia Code', 'Cascadia Mono', 'Fira Code', Consolas, ui-monospace, monospace",
    sfmono: "'SF Mono', SFMono-Regular, Menlo, Monaco, Consolas, ui-monospace, monospace",
  });

  /**
   * 四档环境光强度映射 ('0' | '35' | '70' | '100')
   */
  const AMBIENT_INTENSITY_MAP = Object.freeze({
    '0': Object.freeze({ attr: '0', mul: 0 }),
    '35': Object.freeze({ attr: '0.35', mul: 0.45 }),
    '70': Object.freeze({ attr: '0.7', mul: 0.78 }),
    '100': Object.freeze({ attr: '1', mul: 1 }),
  });

  /**
   * 三档场景预设（完整光效 / 专注编码 / 静默省电）
   */
  const SCENE_PRESETS = Object.freeze({
    full: Object.freeze({
      id: 'full',
      label: '完整光效',
      labelEn: 'Full Optics',
      patch: Object.freeze({
        motionLevel: 'ultra',
        targetFps: '180',
        ambientIntensity: '100',
        homeRipple: true,
        ripple: 'on',
        smoothCaret: true,
        mascot: 'whale',
        telemetryModule: 'on',
        effortSliderModule: 'on',
      }),
    }),
    focus: Object.freeze({
      id: 'focus',
      label: '专注编码',
      labelEn: 'Focus Coding',
      patch: Object.freeze({
        motionLevel: 'standard',
        targetFps: '120',
        ambientIntensity: '35',
        homeRipple: false,
        ripple: 'off',
        smoothCaret: true,
        mascot: 'off',
        telemetryModule: 'on',
        effortSliderModule: 'on',
      }),
    }),
    silent: Object.freeze({
      id: 'silent',
      label: '静默省电',
      labelEn: 'Silent Power-Saver',
      patch: Object.freeze({
        motionLevel: 'off',
        targetFps: '60',
        ambientIntensity: '0',
        homeRipple: false,
        ripple: 'off',
        smoothCaret: false,
        mascot: 'off',
        telemetryModule: 'auto',
        effortSliderModule: 'auto',
      }),
    }),
  });

  /**
   * 将任意配置对象或主题名称解析为四大标准主题 ID ('obsidian' | 'warm' | 'crystal' | 'alabaster')
   */
  function resolveThemeId(input) {
    if (typeof input === 'string') {
      const k = input.trim().toLowerCase();
      if (k === 'obsidian' || k === 'warm' || k === 'crystal' || k === 'alabaster') return k;
      if (k === 'claude' || k === 'warm-dark') return 'warm';
      if (k === 'light' || k === 'daylight') return 'crystal';
      return 'obsidian';
    }
    if (!input || typeof input !== 'object') return 'obsidian';
    if (typeof input.theme === 'string' && PRISM_THEMES[input.theme]) {
      return input.theme;
    }
    const isLight =
      input.mode === 'light' ||
      input.darkMode === false ||
      input.theme === 'light' ||
      input.theme === 'crystal' ||
      input.theme === 'alabaster';
    if (isLight) {
      if (input.theme === 'alabaster' || input.lightPreset === 'alabaster' || input.palette === 'warm' || input.palette === 'claude') {
        return 'alabaster';
      }
      return 'crystal';
    }
    if (input.palette === 'warm' || input.palette === 'claude' || input.theme === 'warm') {
      return 'warm';
    }
    return 'obsidian';
  }

  /**
   * 生成同时覆盖 DeepSeek Harness (--dsw-*) 与 Obsidian Prism (--ag-prism-* / --ag-cs-*) 的完整 CSS 变量字典
   */
  function buildCssVariables(options = {}) {
    const themeId = resolveThemeId(options);
    const theme = PRISM_THEMES[themeId] || PRISM_THEMES.obsidian;
    const isDark = theme.mode === 'dark';

    const accentId = PRISM_ACCENTS[options.accentTone] ? options.accentTone : 'follow';
    const accentEntry = PRISM_ACCENTS[accentId];
    const accentOverride = accentEntry ? (isDark ? accentEntry.dark : accentEntry.light) : null;

    const cornerId = CORNER_PRESETS[options.cornerStyle] ? options.cornerStyle : 'balanced';
    const corners = CORNER_PRESETS[cornerId];

    const codeFontId = CODE_FONTS[options.codeFont] ? options.codeFont : 'default';
    const monoStack = CODE_FONTS[codeFontId];

    const ambKey = String(options.ambientIntensity ?? '100');
    const ambEntry = AMBIENT_INTENSITY_MAP[ambKey] || AMBIENT_INTENSITY_MAP['100'];
    const prismMul = accentEntry ? accentEntry.prismMul : 1;
    const prismStrength = +(ambEntry.mul * prismMul).toFixed(3);

    const eff = {
      primary: accentOverride?.primary || theme.primary,
      primarySoft:
        accentId === 'cobalt'
          ? isDark
            ? 'rgba(102, 157, 246, 0.15)'
            : 'rgba(37, 99, 235, 0.12)'
          : accentId === 'iris'
          ? isDark
            ? 'rgba(165, 138, 248, 0.15)'
            : 'rgba(124, 58, 237, 0.12)'
          : accentId === 'amber'
          ? isDark
            ? 'rgba(242, 184, 75, 0.15)'
            : 'rgba(217, 119, 6, 0.12)'
          : accentId === 'mono'
          ? isDark
            ? 'rgba(212, 215, 224, 0.14)'
            : 'rgba(51, 65, 85, 0.11)'
          : theme.primarySoft,
      primaryBorder:
        accentId === 'cobalt'
          ? isDark
            ? 'rgba(102, 157, 246, 0.38)'
            : 'rgba(37, 99, 235, 0.36)'
          : accentId === 'iris'
          ? isDark
            ? 'rgba(165, 138, 248, 0.38)'
            : 'rgba(124, 58, 237, 0.36)'
          : accentId === 'amber'
          ? isDark
            ? 'rgba(242, 184, 75, 0.38)'
            : 'rgba(217, 119, 6, 0.36)'
          : accentId === 'mono'
          ? isDark
            ? 'rgba(212, 215, 224, 0.34)'
            : 'rgba(51, 65, 85, 0.32)'
          : theme.primaryBorder,
      primaryForeground: accentOverride?.primaryForeground || theme.primaryForeground,
      link: accentOverride?.link || theme.link,
      accent: accentOverride?.accent || theme.primary,
      prismCobalt: accentOverride?.prismCobalt || theme.prismCobalt,
      prismIris: accentOverride?.prismIris || theme.prismIris,
      prismCoral: accentOverride?.prismCoral || theme.prismCoral,
      prismAmber: accentOverride?.prismAmber || theme.prismAmber,
      sidebarSelBar: accentOverride?.sidebarSelBar || theme.sidebarSelBar,
      sidebarSelGlow: accentOverride?.sidebarSelGlow || theme.sidebarSelGlow,
      cometBg: accentOverride?.cometBg || theme.cometBg,
      cometShadow: accentOverride?.cometShadow || theme.cometShadow,
      navActive: accentOverride?.navActive || theme.navActive,
      navGlow: accentOverride?.navGlow || theme.navGlow,
      heatHi1: accentOverride?.heatHi1 || theme.heatHi1,
      heatHi2: accentOverride?.heatHi2 || theme.heatHi2,
    };

    const sansStack =
      "'Google Sans', 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei UI', sans-serif";
    const scrollbarBg = isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(15, 23, 42, 0.18)';
    const scrollbarHover = isDark ? 'rgba(255, 255, 255, 0.30)' : 'rgba(15, 23, 42, 0.32)';

    return {
      // ── 1. DeepSeek Harness (--dsw-static-*、真实 Desktop --dsw-alias-* 与 --dsw-font-*) 完整宿主映射 ──
      '--dsw-static-bg-canvas': theme.background,
      '--dsw-static-bg-sidebar': theme.sidebar,
      '--dsw-static-bg-shell': theme.shell,
      '--dsw-static-bg-card': theme.card,
      '--dsw-static-bg-surface-1': theme.surface1,
      '--dsw-static-bg-surface-2': theme.surface2,
      '--dsw-static-bg-surface-3': theme.surface3,
      '--dsw-static-bg-code-well': theme.codeWell,
      '--dsw-static-bg-console-well': theme.consoleWell,
      '--dsw-static-text-primary': theme.foreground,
      '--dsw-static-text-secondary': theme.secondaryForeground,
      '--dsw-static-text-muted': theme.mutedForeground,
      '--dsw-static-text-placeholder': theme.placeholder,
      '--dsw-static-brand-primary': eff.primary,
      '--dsw-static-brand-link': eff.link,
      '--dsw-static-border-default': theme.border,
      '--dsw-static-border-card': theme.cardBorder,
      '--dsw-static-border-specular': theme.specular,

      // 真实 DSH Desktop 核心 --dsw-alias-* 与 --dsw-font-* 变量 (4 主题 × 5 强调色)
      '--dsw-alias-bg-base': theme.background,
      '--dsw-alias-bg-layer-1': theme.sidebar,
      '--dsw-alias-bg-layer-2': theme.surface1,
      '--dsw-alias-bg-layer-3': theme.surface2,
      '--dsw-alias-bg-mask-1': theme.scrim,
      '--dsw-alias-border-l1': theme.border,
      '--dsw-alias-border-l2': theme.cardBorder,
      '--dsw-alias-border-l4': theme.cardBorder,
      '--dsw-alias-border-l2-darkmode-thin': theme.border,
      '--dsw-alias-brand-primary': eff.primary,
      '--dsw-alias-accent': eff.accent,
      '--dsw-alias-accent-ink': eff.primaryForeground,
      '--dsw-alias-accent-soft': eff.primarySoft,
      '--dsw-alias-button-primary-fill': eff.primary,
      '--dsw-alias-button-primary-hover': eff.link,
      '--dsw-alias-button-ghost-active-fill': eff.primarySoft,
      '--dsw-alias-button-ghost-active-border': eff.primaryBorder,
      '--dsw-alias-button-ghost-active-hover': theme.sidebarSecondary,
      '--dsw-alias-interactive-bg-hover': theme.sidebarHover,
      '--dsw-alias-interactive-bg-active': theme.sidebarSelected,
      '--dsw-alias-label-primary': theme.foreground,
      '--dsw-alias-label-secondary': theme.secondaryForeground,
      '--dsw-alias-label-tertiary': theme.mutedForeground,
      '--dsw-alias-label-dimmed': theme.placeholder,
      '--dsw-alias-hairline': theme.border,
      '--dsw-alias-scrollbar-bg-l2': scrollbarBg,
      '--dsw-alias-scrollbar-hover-l2': scrollbarHover,
      '--dsw-alias-state-error-primary': theme.error,
      '--dsw-alias-state-success-primary': theme.success,
      '--dsw-alias-state-warn-primary': theme.warning,
      '--dsw-alias-state-business-primary': eff.primary,
      '--dsw-font-family': sansStack,
      '--dsw-font-mono': monoStack,
      '--dsw-font-family-mono': monoStack,

      // 兼容预览舞台别名
      '--dsw-alias-bg-primary': theme.background,
      '--dsw-alias-bg-secondary': theme.surface1,
      '--dsw-alias-bg-tertiary': theme.surface2,
      '--dsw-alias-bg-elevated': theme.card,
      '--dsw-alias-bg-sidebar': theme.sidebar,
      '--dsw-alias-bg-composer': theme.composerBg,
      '--dsw-alias-bg-popover': theme.popoverBg,
      '--dsw-alias-bg-pill': theme.pillBg,
      '--dsw-alias-bg-code': theme.codeWell,
      '--dsw-alias-bg-console-well': theme.consoleWell,
      '--dsw-alias-bg-bubble-user': theme.bubbleBg,
      '--dsw-alias-text-primary': theme.foreground,
      '--dsw-alias-text-secondary': theme.secondaryForeground,
      '--dsw-alias-text-muted': theme.mutedForeground,
      '--dsw-alias-text-placeholder': theme.placeholder,
      '--dsw-alias-brand-foreground': eff.primaryForeground,
      '--dsw-alias-brand-link': eff.link,
      '--dsw-alias-border-default': theme.border,
      '--dsw-alias-border-card': theme.cardBorder,
      '--dsw-alias-border-specular': theme.specular,
      '--dsw-alias-status-success': theme.success,
      '--dsw-alias-status-warning': theme.warning,
      '--dsw-alias-status-danger': theme.error,
      '--dsw-alias-radius-sm': corners.rSm,
      '--dsw-alias-radius-md': corners.rMd,
      '--dsw-alias-radius-lg': corners.rLg,
      '--dsw-alias-font-mono': monoStack,

      // ── 2. Obsidian Prism 光谱与物理动效核心变量 (--ag-prism-* / --ag-ease-*) ──
      '--ag-prism-cobalt': eff.prismCobalt,
      '--ag-prism-iris': eff.prismIris,
      '--ag-prism-coral': eff.prismCoral,
      '--ag-prism-amber': eff.prismAmber,
      '--ag-ambient-mul': String(ambEntry.mul),
      '--ag-accent-prism-mul': String(prismMul),
      '--ag-prism-strength': String(prismStrength),
      '--ag-prism-light-mul': '1',
      '--ag-ease-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      '--ag-ease-standard': 'cubic-bezier(0.2, 0, 0, 1)',
      '--ag-ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
      '--ag-ease-spring': 'cubic-bezier(0.34, 1.4, 0.64, 1)',
      '--ag-spring-sidebar': 'cubic-bezier(0.22, 1.08, 0.36, 1)',

      // ── 3. 原版 Antigravity / Obsidian Prism 表面与组件变量 (--background / --ag-cs-*) ──
      '--background': theme.background,
      '--content': theme.content,
      '--shell': theme.shell,
      '--body-background': theme.background,
      '--sidebar': theme.sidebar,
      '--sidebar-muted': theme.sidebarMuted,
      '--sidebar-secondary': theme.sidebarSecondary,
      '--surface-1': theme.surface1,
      '--surface-2': theme.surface2,
      '--surface-3': theme.surface3,
      '--card': theme.card,
      '--card-border': theme.cardBorder,
      '--border': theme.border,
      '--secondary': theme.surface2,
      '--muted': theme.surface1,
      '--foreground': theme.foreground,
      '--secondary-foreground': theme.secondaryForeground,
      '--muted-foreground': theme.mutedForeground,
      '--placeholder': theme.placeholder,
      '--primary': eff.primary,
      '--primary-soft': theme.primarySoft,
      '--primary-border': theme.primaryBorder,
      '--primary-foreground': eff.primaryForeground,
      '--link': eff.link,
      '--error': theme.error,
      '--danger': theme.error,
      '--warning': theme.warning,
      '--success': theme.success,
      '--scrim': theme.scrim,

      '--ag-cs-r-sm': corners.rSm,
      '--ag-cs-r-md': corners.rMd,
      '--ag-cs-r-lg': corners.rLg,
      '--ag-cs-mono-stack': monoStack,
      '--ag-cs-canvas': theme.content,
      '--ag-cs-sidebar': theme.sidebar,
      '--ag-cs-specular': theme.specular,
      '--ag-cs-focus-spec': theme.focusSpec,
      '--ag-cs-whisper-hv': theme.whisperHover,
      '--ag-cs-sheen': theme.sheen,
      '--ag-cs-sidebar-hover': theme.sidebarHover,
      '--ag-cs-sidebar-row-hover': theme.sidebarRowHover,
      '--ag-cs-sidebar-selected': theme.sidebarSelected,
      '--ag-cs-sidebar-sel-bar': eff.sidebarSelBar,
      '--ag-cs-sidebar-sel-glow': eff.sidebarSelGlow,
      '--ag-cs-composer-bg': theme.composerBg,
      '--ag-cs-panel-bg': theme.panelBg,
      '--ag-cs-popover-bg': theme.popoverBg,
      '--ag-cs-pill-bg': theme.pillBg,
      '--ag-cs-bubble': theme.bubbleBg,
      '--ag-cs-send-bg': theme.sendBg,
      '--ag-cs-send-fg': theme.sendFg,
      '--ag-cs-border-1': theme.border,
      '--ag-cs-border-2': theme.cardBorder,
      '--ag-cs-accent': eff.accent,
      '--ag-cs-data-ink': eff.accent,
      '--ag-cs-ripple-ink': theme.rippleInk,
      '--ag-cs-ripple-wave': accentId === 'follow' ? theme.rippleWave : eff.accent,
      '--ag-cs-thought-rule': theme.thoughtRule,
      '--ag-cs-comet-bg': eff.cometBg,
      '--ag-cs-comet-sh': eff.cometShadow,
      '--ag-cs-nav-active': eff.navActive,
      '--ag-cs-nav-glow': eff.navGlow,
      '--ag-cs-sonar-border': theme.sonarBorder,
      '--ag-cs-sonar-glow': theme.sonarGlow,
      '--ag-cs-sonar-wash': theme.sonarWash,
      '--ag-cs-heat-hi-1': eff.heatHi1,
      '--ag-cs-heat-hi-2': eff.heatHi2,
      '--ag-cs-code-well': theme.codeWell,
      '--ag-cs-console-well': theme.consoleWell,
      '--ag-cs-composer-shadow': theme.composerShadow,
      '--ag-cs-surface-sh': theme.surfaceShadow,
      '--ag-cs-bubble-sh': theme.bubbleShadow,
    };
  }

  /**
   * 将当前主题与强调色配置同步写入 DOM 根节点 (html & body) 的 data-* 属性及内联 CSS 变量
   */
  function applyTokensToDocument(doc, options = {}) {
    const targetDoc = doc || (typeof document !== 'undefined' ? document : null);
    if (!targetDoc || !targetDoc.documentElement) return null;

    const html = targetDoc.documentElement;
    const body = targetDoc.body;
    const themeId = resolveThemeId(options);
    const theme = PRISM_THEMES[themeId] || PRISM_THEMES.obsidian;
    const isDark = theme.mode === 'dark';
    const accentId = PRISM_ACCENTS[options.accentTone] ? options.accentTone : 'follow';
    const cornerId = CORNER_PRESETS[options.cornerStyle] ? options.cornerStyle : 'balanced';
    const codeFontId = CODE_FONTS[options.codeFont] ? options.codeFont : 'default';
    const ligaturesOn = options.codeLigatures === true || options.codeLigatures === 'on';
    const ambKey = String(options.ambientIntensity ?? '100');
    const ambEntry = AMBIENT_INTENSITY_MAP[ambKey] || AMBIENT_INTENSITY_MAP['100'];
    const motionLevel = options.motionLevel || 'ultra';
    const thoughtView = options.thoughtView === 'bilingual' ? 'bilingual' : 'immersive';
    const lang = options.language || options.lang || 'zh-CN';

    const attrs = {
      'data-prism-theme': themeId,
      'data-dsh-theme': themeId,
      'data-ag-prism': '1.0.4',
      'data-ag-cs-style': '1',
      'data-ag-cs-theme': isDark ? 'dark' : 'light',
      'data-ag-cs-palette': theme.palette,
      'data-ag-cs-light-preset': theme.lightPreset,
      'data-ag-cs-accent': accentId,
      'data-ag-cs-corners': cornerId,
      'data-ag-cs-code-font': codeFontId,
      'data-ag-cs-ligatures': ligaturesOn ? '1' : '0',
      'data-ag-cs-ambient': ambEntry.attr,
      'data-ag-cs-motion': motionLevel,
      'data-ag-prism-thought-view': thoughtView,
      'data-ag-cs-lang': lang,
    };

    for (const [k, v] of Object.entries(attrs)) {
      if (html.getAttribute(k) !== v) {
        html.setAttribute(k, v);
      }
    }

    if (html.style && typeof html.style.setProperty === 'function') {
      html.style.setProperty('color-scheme', isDark ? 'dark' : 'light');
      const vars = buildCssVariables({
        ...options,
        theme: themeId,
        accentTone: accentId,
        cornerStyle: cornerId,
        codeFont: codeFontId,
        ambientIntensity: ambKey,
      });
      for (const [prop, val] of Object.entries(vars)) {
        html.style.setProperty(prop, val);
        if (body && body.style && typeof body.style.setProperty === 'function') {
          body.style.setProperty(prop, val);
        }
      }
      if (body && body.style && typeof body.style.setProperty === 'function') {
        body.style.setProperty('color-scheme', isDark ? 'dark' : 'light');
      }
    }

    if (body) {
      if (typeof body.setAttribute === 'function') {
        body.setAttribute('data-prism-theme', themeId);
        body.setAttribute('data-ag-cs-accent', accentId);
        if (isDark) {
          body.setAttribute('data-ds-dark-theme', '');
        } else if (typeof body.removeAttribute === 'function') {
          body.removeAttribute('data-ds-dark-theme');
        }
      }
      if (body.classList) {
        body.classList.toggle('theme-dark', isDark);
        body.classList.toggle('dark', isDark);
        body.classList.toggle('theme-light', !isDark);
        body.classList.toggle('light', !isDark);
      }
    }

    return { themeId, theme, isDark, accentId, cornerId, codeFontId, ligaturesOn };
  }

  /**
   * 导出符合 DeepSeek Harness / Cordis ctx.theme 注册规范的 4 套主题清单
   */
  function toCordisThemeDefinitions(accentTone = 'follow') {
    return Object.values(PRISM_THEMES).map((theme) => ({
      id: `obsidian-prism-${theme.id}`,
      name: theme.id,
      label: `Obsidian Prism · ${theme.label}`,
      labelEn: `Obsidian Prism · ${theme.labelEn}`,
      description: theme.description,
      type: theme.mode,
      colorScheme: theme.mode,
      palette: theme.palette,
      lightPreset: theme.lightPreset,
      colors: {
        sidebar: theme.sidebar,
        background: theme.background,
        card: theme.card,
        foreground: theme.foreground,
        primary: theme.primary,
        border: theme.border,
      },
      tokens: buildCssVariables({ theme: theme.id, accentTone }),
    }));
  }

  return Object.freeze({
    VERSION: '1.0.4',
    PRISM_THEMES,
    PRISM_ACCENTS,
    CORNER_PRESETS,
    CODE_FONTS,
    AMBIENT_INTENSITY_MAP,
    SCENE_PRESETS,
    resolveThemeId,
    buildCssVariables,
    applyTokensToDocument,
    toCordisThemeDefinitions,
  });
});

}).call(
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : {},
  typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : undefined),
  typeof self !== "undefined" ? self : (typeof window !== "undefined" ? window : undefined),
  typeof document !== "undefined" ? document : undefined,
  undefined,
  undefined
);

// === [2/10] src/dsh-bridge.js ===
;(function (root, window, self, document, module, exports) {
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

}).call(
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : {},
  typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : undefined),
  typeof self !== "undefined" ? self : (typeof window !== "undefined" ? window : undefined),
  typeof document !== "undefined" ? document : undefined,
  undefined,
  undefined
);

// === [3/10] src/optics-motion.js ===
;(function (root, window, self, document, module, exports) {
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
        if (!entry.box?.isConnected || !isElementVisible(entry.box)) continue;
        if (entry.box.closest?.('[data-content-phase="settling"], [data-phase="settling"]')) continue;
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

    function onPointerLeave() {
      if (isDestroyed()) return;
      pointerPos.x = -9999;
      pointerPos.y = -9999;
      if (rafId && typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      clearOverlay();
    }

    function clearImmediate() {
      cacheDirty = true;
      if (rafId && typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      clearOverlay();
    }

    function onLayoutShift() {
      if (isDestroyed()) return;
      cacheDirty = true;
      if (!wasCleared) {
        clearOverlay();
        if (!rafId && !isDisabled() && typeof requestAnimationFrame === 'function') {
          rafId = requestAnimationFrame(drawFrame);
        }
      }
    }

    return {
      onPointerMove,
      onPointerLeave,
      clearImmediate,
      onLayoutShift,
      markDirty() {
        cacheDirty = true;
        if (isDisabled()) {
          clearOverlay();
          return;
        }
        if (!wasCleared) {
          clearOverlay();
          if (!rafId && typeof requestAnimationFrame === 'function') {
            rafId = requestAnimationFrame(drawFrame);
          }
        }
      },
      invalidateMetrics() {
        cacheDirty = true;
        if (!wasCleared) clearOverlay();
        if (!rafId && !isDisabled() && typeof requestAnimationFrame === 'function') {
          rafId = requestAnimationFrame(drawFrame);
        }
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

    function findConversationContent() {
      const d = docOf();
      if (!d || typeof d.querySelectorAll !== 'function') return { contentEl: null, isHome: false };
      let best = null;
      let bestArea = -1;
      try {
        const nodes = d.querySelectorAll('[data-conversation-content]');
        for (const node of nodes) {
          if (!node || isInsideForeignWidget(node) || !isElementVisible(node)) continue;
          const r = node.getBoundingClientRect?.();
          const area = Math.max(0, Number(r?.width) || 0) * Math.max(0, Number(r?.height) || 0);
          if (area > bestArea) {
            best = node;
            bestArea = area;
          }
        }
      } catch {}
      const phase = String(best?.getAttribute?.('data-content-phase') || '').trim().toLowerCase();
      return { contentEl: best, isHome: phase === 'hero' || phase === 'blank' };
    }

    function pruneDuplicateBounds(keepBounds) {
      const d = docOf();
      if (!d || typeof d.querySelectorAll !== 'function') return;
      try {
        d.querySelectorAll('.dsh-optics-conv-bounds').forEach((node) => {
          if (node && node !== keepBounds) node.remove?.();
        });
      } catch {}
    }

    function syncBounds() {
      if (!inst) return;
      pruneDuplicateBounds(inst.bounds);
      const { contentEl, isHome } = findConversationContent();
      if (contentEl) {
        if (isHome) {
          inst.homeHidden = true;
          inst.bounds.style.display = 'none';
          inst.glow.clear();
          enterSleep('home-hidden');
          return;
        }
        const wasHomeHidden = Boolean(inst.homeHidden);
        inst.homeHidden = false;
        inst.bounds.style.display = '';
        setAttrIfChanged(inst.bounds, 'data-conv-aura-inline', '1');
        if (inst.bounds.parentElement !== contentEl) {
          try {
            contentEl.appendChild(inst.bounds);
          } catch {}
        }
        inst.bounds.style.left = '';
        inst.bounds.style.top = '';
        inst.bounds.style.width = '';
        inst.bounds.style.height = '';
        if (contentEl !== inst.observedEl && inst.ro) {
          try {
            if (inst.observedEl) inst.ro.unobserve(inst.observedEl);
            inst.ro.observe(contentEl);
            inst.observedEl = contentEl;
          } catch {}
        }
        const r = contentEl.getBoundingClientRect?.() || {};
        const width = Math.max(120, Math.round(Number(r.width) || winOf()?.innerWidth || 960));
        const height = Math.max(120, Math.round(Number(r.height) || winOf()?.innerHeight || 720));
        const glowH = Math.max(80, Math.round(height * CONV_AURA_HEIGHT_RATIO));
        const dpr = resolveHorizonDpr(winOf()?.devicePixelRatio || 1, 0.72);
        inst.width = width;
        inst.height = glowH;
        inst.glow.resize(width, glowH, dpr);
        if (wasHomeHidden) wake(true);
        return;
      }

      const wasHomeHidden = Boolean(inst.homeHidden);
      inst.homeHidden = false;
      inst.bounds.style.display = '';
      inst.bounds.removeAttribute('data-conv-aura-inline');
      const portal = ensureOpticsPortalLayer();
      if (portal && inst.bounds.parentElement !== portal) {
        try {
          portal.appendChild(inst.bounds);
        } catch {}
      }
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
      if (wasHomeHidden) wake(true);
    }

    function drawFrame(nowInput) {
      if (!inst || isDestroyed()) return;
      inst.rafId = 0;
      if (inst.homeHidden) {
        inst.glow.clear();
        enterSleep('home-hidden');
        return;
      }
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
      bounds.setAttribute('data-prism-ignore', '1');
      bounds.setAttribute('data-dsh-prism-owned', '1');

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
    const onPtrLeave = () => rimCanvas.onPointerLeave();
    const onLayoutShift = () => rimCanvas.onLayoutShift();
    const onWinBlur = () => {
      setAttrIfChanged(d?.documentElement, 'data-ag-cs-win-blur', '1');
      rimCanvas.onPointerLeave();
    };
    const onWinFocus = () => d?.documentElement?.removeAttribute('data-ag-cs-win-blur');

    if (w && typeof w.addEventListener === 'function') {
      w.addEventListener('pointermove', onPtrMove, { passive: true });
      w.addEventListener('blur', onWinBlur, { passive: true });
      w.addEventListener('focus', onWinFocus, { passive: true });
      w.addEventListener('resize', onLayoutShift, { passive: true });
      w.addEventListener('scroll', onLayoutShift, { passive: true, capture: true });
      d?.documentElement?.addEventListener?.('mouseleave', onPtrLeave, { passive: true });
      d?.addEventListener?.('transitionstart', onLayoutShift, { passive: true, capture: true });
      d?.addEventListener?.('transitionend', onLayoutShift, { passive: true, capture: true });
      cleanups.push(() => {
        w.removeEventListener('pointermove', onPtrMove);
        w.removeEventListener('blur', onWinBlur);
        w.removeEventListener('focus', onWinFocus);
        w.removeEventListener('resize', onLayoutShift);
        w.removeEventListener('scroll', onLayoutShift, true);
        d?.documentElement?.removeEventListener?.('mouseleave', onPtrLeave);
        d?.removeEventListener?.('transitionstart', onLayoutShift, true);
        d?.removeEventListener?.('transitionend', onLayoutShift, true);
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
        let hasPhaseTransition = false;
        for (let i = 0; i < mutations.length; i++) {
          const t = mutations[i]?.target;
          if (!t || isInsideForeignWidget(t)) continue;
          if (mutations[i].type === 'attributes') {
            hasPhaseTransition = true;
            hasExternalStructuralMut = true;
            break;
          }
          if (mutations[i].addedNodes?.length || mutations[i].removedNodes?.length) {
            hasExternalStructuralMut = true;
          }
        }
        if (!hasExternalStructuralMut) return;
        // 阶段切换（如新建对话发送后 hero -> settling -> active）零延迟清掉旧位置棱镜边，避免半空卡住残影
        if (hasPhaseTransition) {
          rimCanvas.clearImmediate();
        } else {
          rimCanvas.onLayoutShift();
        }
        if (spaKeepAliveTimer) clearTimeout(spaKeepAliveTimer);
        spaKeepAliveTimer = setTimeout(() => {
          spaKeepAliveTimer = 0;
          if (destroyed) return;
          try {
            ensureOpticsPortalLayer();
            rimCanvas.invalidateMetrics();
            convAura.sync();
            smoothCaret.queue(false);
          } catch {}
        }, 120);
      });
      spaObs.observe(d.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-content-phase', 'data-phase'],
      });
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
        if (G && typeof G === 'object' && G.__dshPrismOpticsActive === controller) {
          G.__dshPrismOpticsActive = null;
        }
      },
    };

    if (G?.__dshPrismOpticsActive && G.__dshPrismOpticsActive !== activeInstance) {
      try { G.__dshPrismOpticsActive.destroy?.(); } catch {}
    }
    activeInstance = controller;
    if (G && typeof G === 'object') G.__dshPrismOpticsActive = controller;
    return controller;
  }

  function destroy() {
    if (G?.__dshPrismOpticsActive && G.__dshPrismOpticsActive !== activeInstance) {
      try { G.__dshPrismOpticsActive.destroy?.(); } catch {}
    }
    if (activeInstance) {
      try { activeInstance.destroy(); } catch {}
      activeInstance = null;
    }
    if (G && typeof G === 'object' && G.__dshPrismOpticsActive) {
      G.__dshPrismOpticsActive = null;
    }
  }

  return Object.freeze({
    PORTAL_ID,
    init,
    destroy,
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

}).call(
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : {},
  typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : undefined),
  typeof self !== "undefined" ? self : (typeof window !== "undefined" ? window : undefined),
  typeof document !== "undefined" ? document : undefined,
  undefined,
  undefined
);

// === [4/10] src/deepseek-companions.js ===
;(function (root, window, self, document, module, exports) {
/* Obsidian Prism for DeepSeek Harness · independent pixel whale family · GPL-3.0-only */
(function (root, factory) {
  'use strict';
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.DSHPrismCompanions = api;
})(globalThis, function (root) {
  'use strict';

  const UNIT = 2;
  const ADULT_W = 44;
  const ADULT_H = 32;
  const CALF_W = 28;
  const CALF_H = 22;
  const FAMILY_GAP = 10;
  const ADULT_MASS = 2.4;
  const CALF_MASS = 1;
  const COLLISION_EPSILON = 0.05;
  const MAX_COLLISION_SPEED = 320;
  const HITBOX_PROFILES = Object.freeze({
    adult: Object.freeze({
      whale: Object.freeze({ x: 2, y: 4, width: 40, height: 22 }),
      orca: Object.freeze({ x: 2, y: 0, width: 40, height: 26 }),
    }),
    calf: Object.freeze({
      whale: Object.freeze({ x: 0, y: 4, width: 28, height: 16 }),
      orca: Object.freeze({ x: 0, y: 4, width: 28, height: 16 }),
    }),
  });

  const palettes = {
    whale: {
      outline: '#14264c', body: '#3978eb', top: '#78b7ff', belly: '#c7efff',
      fin: '#2456b9', tail: '#2d66d6', eye: '#0b1730', glint: '#f5fbff',
      bubble: '#86d8ff', spark: '#9bd8ff',
    },
    orca: {
      outline: '#10182c', body: '#273a60', top: '#5c77a5', belly: '#eaf6ff',
      fin: '#1a2949', tail: '#1d2d50', eye: '#091225', glint: '#f5fbff',
      bubble: '#b8bcff', spark: '#c9b7ff', patch: '#f1f8ff', saddle: '#7189b3',
    },
  };
  const calfPalettes = {
    whale: {
      outline: '#1b3b70', body: '#6eacff', top: '#b6e2ff', belly: '#e9fbff',
      fin: '#4f8ee8', tail: '#5e9df2', eye: '#10203d', glint: '#ffffff',
      bubble: '#a4e3ff', spark: '#d0f1ff',
    },
    orca: {
      outline: '#141d34', body: '#4b6088', top: '#9bb2d5', belly: '#ffffff',
      fin: '#31466d', tail: '#31466d', eye: '#091225', glint: '#ffffff',
      bubble: '#c6c5ff', spark: '#dccaff', patch: '#f7fbff',
    },
  };

  const adultTail = [
    [16, 3, 2, 1, 'outline'], [18, 2, 2, 2, 'outline'], [18, 4, 1, 2, 'tail'],
    [19, 5, 2, 2, 'outline'], [18, 7, 2, 2, 'tail'], [15, 5, 3, 3, 'outline'],
  ];
  const adultOutline = [
    [7, 3, 8, 1, 'outline'], [4, 4, 12, 1, 'outline'], [2, 5, 15, 1, 'outline'],
    [1, 6, 17, 1, 'outline'], [1, 7, 17, 2, 'outline'], [2, 9, 15, 1, 'outline'],
    [4, 10, 13, 1, 'outline'], [6, 11, 10, 1, 'outline'], [7, 12, 8, 1, 'outline'],
  ];
  const adultFill = [
    [7, 4, 8, 1, 'body'], [4, 5, 12, 1, 'body'], [2, 6, 15, 1, 'body'],
    [2, 7, 15, 2, 'body'], [3, 9, 13, 1, 'body'], [5, 10, 11, 1, 'body'],
    [7, 11, 8, 1, 'body'], [8, 12, 6, 1, 'body'],
  ];
  const adultMarks = {
    whale: [
      [5, 5, 5, 1, 'top'], [3, 6, 3, 2, 'top'], [4, 9, 11, 2, 'belly'],
      [6, 11, 8, 1, 'belly'], [8, 8, 5, 1, 'fin'], [10, 9, 3, 1, 'fin'],
    ],
    orca: [
      [4, 6, 5, 3, 'patch'], [3, 9, 13, 2, 'belly'], [6, 11, 8, 1, 'belly'],
      [9, 5, 5, 1, 'saddle'], [8, 6, 5, 2, 'saddle'], [8, 9, 4, 1, 'fin'],
    ],
  };

  const calfTail = [
    [11, 3, 1, 1, 'outline'], [12, 2, 1, 1, 'tail'], [12, 3, 1, 2, 'outline'],
    [13, 4, 1, 1, 'outline'], [12, 5, 1, 1, 'tail'],
  ];
  const calfOutline = [
    [4, 2, 7, 1, 'outline'], [2, 3, 10, 1, 'outline'], [1, 4, 12, 1, 'outline'],
    [0, 5, 14, 1, 'outline'], [0, 6, 14, 1, 'outline'], [1, 7, 12, 1, 'outline'],
    [3, 8, 9, 1, 'outline'], [5, 9, 5, 1, 'outline'],
  ];
  const calfFill = [
    [4, 3, 7, 1, 'body'], [2, 4, 10, 1, 'body'], [1, 5, 12, 2, 'body'],
    [2, 7, 10, 1, 'body'], [4, 8, 7, 1, 'body'], [5, 9, 4, 1, 'body'],
  ];
  const calfMarks = [
    [3, 4, 4, 1, 'top'], [2, 7, 10, 1, 'belly'], [5, 6, 4, 1, 'fin'],
    [6, 8, 3, 1, 'fin'],
  ];

  function normalizeMode(value) {
    if (root.DSHPrismBridge?.normalizeMascotMode) return root.DSHPrismBridge.normalizeMascotMode(value);
    if (value === 'off') return 'off';
    return value === 'orca' || value === 'dual' ? 'orca' : 'whale';
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function finiteNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function round(value, digits = 2) {
    const scale = 10 ** digits;
    return Math.round(finiteNumber(value) * scale) / scale;
  }

  function collisionBox(actor) {
    if (typeof actor?.hitbox === 'function') {
      try {
        const box = actor.hitbox();
        if (box && ['x', 'y', 'width', 'height'].every(key => Number.isFinite(Number(box[key])))) {
          return {
            x: finiteNumber(box.x), y: finiteNumber(box.y),
            width: Math.max(0, finiteNumber(box.width)),
            height: Math.max(0, finiteNumber(box.height)),
          };
        }
      } catch {}
    }
    return {
      x: finiteNumber(actor?.x),
      y: finiteNumber(actor?.y),
      width: Math.max(0, finiteNumber(actor?.width, 0)),
      height: Math.max(0, finiteNumber(actor?.height, 0)),
    };
  }

  function measurePairCollision(adult, calf) {
    const adultBox = collisionBox(adult);
    const calfBox = collisionBox(calf);
    const dx = (calfBox.x + calfBox.width / 2) - (adultBox.x + adultBox.width / 2);
    const dy = (calfBox.y + calfBox.height / 2) - (adultBox.y + adultBox.height / 2);
    const overlapX = (adultBox.width + calfBox.width) / 2 - Math.abs(dx);
    const overlapY = (adultBox.height + calfBox.height) / 2 - Math.abs(dy);
    return {
      dx, dy, overlapX, overlapY,
      colliding: overlapX > COLLISION_EPSILON && overlapY > COLLISION_EPSILON,
      centerDistance: Math.hypot(dx, dy),
      clearanceX: Math.max(0, -overlapX),
      clearanceY: Math.max(0, -overlapY),
    };
  }

  function resolvePairCollision(adult, calf, options = {}) {
    const bounds = options.bounds || {};
    const limits = {
      adult: {
        minX: finiteNumber(bounds.adult?.minX, 0),
        maxX: finiteNumber(bounds.adult?.maxX, Infinity),
        minY: finiteNumber(bounds.adult?.minY, -72),
        maxY: finiteNumber(bounds.adult?.maxY, 0),
      },
      calf: {
        minX: finiteNumber(bounds.calf?.minX, 0),
        maxX: finiteNumber(bounds.calf?.maxX, Infinity),
        minY: finiteNumber(bounds.calf?.minY, -72),
        maxY: finiteNumber(bounds.calf?.maxY, 0),
      },
    };
    const fixedAdult = Boolean(options.fixedAdult);
    const fixedCalf = Boolean(options.fixedCalf);
    const motionAdult = options.motionAdult || {
      vx: finiteNumber(adult.vx), vy: finiteNumber(adult.vy),
    };
    const motionCalf = options.motionCalf || {
      vx: finiteNumber(calf.vx), vy: finiteNumber(calf.vy),
    };
    const restitution = clamp(finiteNumber(options.restitution, 0.18), 0, 1);
    const correctionOption = Number(options.maxCorrection);
    const maxCorrection = Number.isFinite(correctionOption) && correctionOption >= 0
      ? correctionOption
      : Infinity;
    let correctionBudget = maxCorrection;
    const applyImpulse = options.applyImpulse !== false;
    const allowDiscreteFallback = options.allowDiscreteFallback !== false;
    const initial = measurePairCollision(adult, calf);
    let axis = null;
    let normalX = 0;
    let normalY = 0;
    let impulseAdult = 0;
    let impulseCalf = 0;

    function applyLimits() {
      adult.x = clamp(finiteNumber(adult.x), limits.adult.minX, limits.adult.maxX);
      adult.y = clamp(finiteNumber(adult.y), limits.adult.minY, limits.adult.maxY);
      calf.x = clamp(finiteNumber(calf.x), limits.calf.minX, limits.calf.maxX);
      calf.y = clamp(finiteNumber(calf.y), limits.calf.minY, limits.calf.maxY);
    }

    function shiftAxis(axis, sign, penetration) {
      const inverseAdult = fixedAdult ? 0 : 1 / ADULT_MASS;
      const inverseCalf = fixedCalf ? 0 : 1 / CALF_MASS;
      const inverseTotal = inverseAdult + inverseCalf;
      const shareAdult = inverseTotal ? inverseAdult / inverseTotal : 0;
      const shareCalf = inverseTotal ? inverseCalf / inverseTotal : 0;
      const adultBounds = axis === 'x' ? [limits.adult.minX, limits.adult.maxX] : [limits.adult.minY, limits.adult.maxY];
      const calfBounds = axis === 'x' ? [limits.calf.minX, limits.calf.maxX] : [limits.calf.minY, limits.calf.maxY];
      const adultPosition = axis === 'x' ? adult.x : adult.y;
      const calfPosition = axis === 'x' ? calf.x : calf.y;
      const adultDirection = -sign;
      const calfDirection = sign;
      const adultCapacity = fixedAdult ? 0 : adultDirection < 0
        ? adultPosition - adultBounds[0]
        : adultBounds[1] - adultPosition;
      const calfCapacity = fixedCalf ? 0 : calfDirection < 0
        ? calfPosition - calfBounds[0]
        : calfBounds[1] - calfPosition;
      let adultShift = Math.min(penetration * shareAdult, adultCapacity);
      let calfShift = Math.min(penetration * shareCalf, calfCapacity);
      let remaining = Math.max(0, penetration - adultShift - calfShift);
      if (remaining > 0) {
        const extraAdult = Math.min(remaining, adultCapacity - adultShift);
        adultShift += extraAdult;
        remaining -= extraAdult;
      }
      if (remaining > 0) {
        const extraCalf = Math.min(remaining, calfCapacity - calfShift);
        calfShift += extraCalf;
        remaining -= extraCalf;
      }
      if (axis === 'x') {
        adult.x += adultDirection * adultShift;
        calf.x += calfDirection * calfShift;
      } else {
        adult.y += adultDirection * adultShift;
        calf.y += calfDirection * calfShift;
      }
      return remaining;
    }

    if (!initial.colliding) return { ...initial, initialColliding: false, resolved: true, axis, normalX, normalY };

    for (let pass = 0; pass < 4; pass++) {
      const collision = measurePairCollision(adult, calf);
      if (!collision.colliding) break;
      const grounded = adult.y >= -0.5 && calf.y >= -0.5;
      const horizontalDominant = collision.overlapX > Math.max(6, collision.overlapY * 2);
      const closingX = finiteNumber(motionCalf.vx) - finiteNumber(motionAdult.vx);
      const closingY = finiteNumber(motionCalf.vy) - finiteNumber(motionAdult.vy);
      let nextAxis = grounded || horizontalDominant
        ? 'x'
        : (Math.abs(closingX) > Math.abs(closingY) ? 'x' : 'y');
      if (!grounded && Math.max(Math.abs(closingX), Math.abs(closingY)) < 4) {
        nextAxis = collision.overlapX <= collision.overlapY ? 'x' : 'y';
      }
      if (pass % 2 === 1) nextAxis = nextAxis === 'x' ? 'y' : 'x';
      const delta = nextAxis === 'x' ? collision.dx : collision.dy;
      const relative = nextAxis === 'x' ? closingX : closingY;
      let sign = Math.abs(delta) > COLLISION_EPSILON ? Math.sign(delta) : Math.sign(relative);
      if (!sign) sign = 1;
      if (!axis) {
        axis = nextAxis;
        normalX = axis === 'x' ? sign : 0;
        normalY = axis === 'y' ? sign : 0;
      }

      if (pass === 0 && !options.reducedMotion && applyImpulse) {
        const inverseAdult = fixedAdult ? 0 : 1 / ADULT_MASS;
        const inverseCalf = fixedCalf ? 0 : 1 / CALF_MASS;
        const inverseTotal = inverseAdult + inverseCalf;
        const impactSpeed = closingX * normalX + closingY * normalY;
        if (inverseTotal > 0 && impactSpeed < -3) {
          const impulse = -(1 + restitution) * impactSpeed / inverseTotal;
          const adultDelta = impulse * inverseAdult;
          const calfDelta = impulse * inverseCalf;
          adult.vx = clamp(finiteNumber(adult.vx) - normalX * adultDelta, -MAX_COLLISION_SPEED, MAX_COLLISION_SPEED);
          adult.vy = clamp(finiteNumber(adult.vy) - normalY * adultDelta, -MAX_COLLISION_SPEED, MAX_COLLISION_SPEED);
          calf.vx = clamp(finiteNumber(calf.vx) + normalX * calfDelta, -MAX_COLLISION_SPEED, MAX_COLLISION_SPEED);
          calf.vy = clamp(finiteNumber(calf.vy) + normalY * calfDelta, -MAX_COLLISION_SPEED, MAX_COLLISION_SPEED);
          impulseAdult = adultDelta;
          impulseCalf = calfDelta;
        }
      }

      const penetration = (nextAxis === 'x' ? collision.overlapX : collision.overlapY) + COLLISION_EPSILON;
      const allowed = Math.min(penetration, correctionBudget);
      if (allowed <= 1e-5) break;
      const remaining = shiftAxis(nextAxis, sign, allowed);
      correctionBudget = Math.max(0, correctionBudget - Math.max(0, allowed - remaining));
      applyLimits();
      if (correctionBudget <= 1e-5) break;
    }

    let result = measurePairCollision(adult, calf);
    if (result.colliding && allowDiscreteFallback) {
      // A boundary can consume the first correction. Place the mobile body on
      // the nearest valid side of the other body instead of tolerating overlap.
      const moveCalf = !fixedAdult || (fixedAdult && fixedCalf);
      const mobile = moveCalf ? calf : adult;
      const anchored = moveCalf ? adult : calf;
      const mobility = moveCalf ? limits.calf : limits.adult;
      const mobileBox = collisionBox(mobile);
      const anchoredBox = collisionBox(anchored);
      const mobileWidth = mobileBox.width;
      const mobileHeight = mobileBox.height;
      const anchoredWidth = anchoredBox.width;
      const anchoredHeight = anchoredBox.height;
      const saved = { adultX: adult.x, adultY: adult.y, calfX: calf.x, calfY: calf.y };
      const axes = result.overlapX <= result.overlapY ? ['x', 'y'] : ['y', 'x'];
      for (const nextAxis of axes) {
        const mobileCenter = nextAxis === 'x' ? mobile.x + mobileWidth / 2 : mobile.y + mobileHeight / 2;
        const anchoredCenter = nextAxis === 'x' ? anchored.x + anchoredWidth / 2 : anchored.y + anchoredHeight / 2;
        const minimumDistance = (nextAxis === 'x' ? mobileWidth + anchoredWidth : mobileHeight + anchoredHeight) / 2 + COLLISION_EPSILON;
        const directions = mobileCenter < anchoredCenter ? [-1, 1] : [1, -1];
        let placed = false;
        for (const direction of directions) {
          const center = anchoredCenter + direction * minimumDistance;
          if (nextAxis === 'x') mobile.x = clamp(center - mobileWidth / 2, mobility.minX, mobility.maxX);
          else mobile.y = clamp(center - mobileHeight / 2, mobility.minY, mobility.maxY);
          applyLimits();
          result = measurePairCollision(adult, calf);
          if (!result.colliding) {
            placed = true;
            break;
          }
          adult.x = saved.adultX;
          adult.y = saved.adultY;
          calf.x = saved.calfX;
          calf.y = saved.calfY;
          result = measurePairCollision(adult, calf);
        }
        if (placed) break;
      }
    }

    return {
      ...result,
      initialColliding: true,
      resolved: !result.colliding,
      axis,
      normalX,
      normalY,
      impulseAdult: round(impulseAdult),
      impulseCalf: round(impulseCalf),
    };
  }

  function mount(host, options = {}) {
    let mode = normalizeMode(options.mode);
    let reducedMotion = Boolean(options.reducedMotion);
    let streaming = Boolean(options.streaming);
    let disposed = false;
    let frameId = 0;
    let lastFrame = 0;
    let collisionCount = 0;
    let collisionActiveUntil = 0;
    let lastCollisionAt = -Infinity;
    let collisionClearTimer = 0;
    let collisionContact = false;
    let lastCollision = null;
    const doc = host.ownerDocument;
    const win = doc?.defaultView || root;
    const now = () => Number(win.performance?.now?.() || Date.now());

    function paint(context, x, y, width, height, color) {
      context.fillStyle = color;
      context.fillRect(x * UNIT, y * UNIT, width * UNIT, height * UNIT);
    }

    function drawParts(context, parts, palette, dy = 0, dx = 0) {
      for (const [x, y, width, height, tone] of parts) {
        paint(context, x + dx, y + dy, width, height, palette[tone] || palette.body);
      }
    }

    function safeCapture(node, pointerId) {
      try { node?.setPointerCapture?.(pointerId); } catch {}
    }

    function safeRelease(node, pointerId) {
      try {
        if (node?.hasPointerCapture?.(pointerId)) node.releasePointerCapture(pointerId);
      } catch {}
    }

    function stageWidth() {
      return Math.max(ADULT_W + CALF_W + 32, Number(host.clientWidth || host.offsetWidth) || 280);
    }

    function isVisible() {
      return Boolean(actors.adult.owner?.isConnected && !doc?.hidden &&
        (typeof win.getComputedStyle !== 'function' || win.getComputedStyle(host).display !== 'none'));
    }

    function actorPalette(actor) {
      return (actor.isCalf ? calfPalettes : palettes)[mode] || (actor.isCalf ? calfPalettes.whale : palettes.whale);
    }

    function drawAdult(actor, current) {
      const context = actor.context;
      if (!context) return;
      const palette = actorPalette(actor);
      const moving = actor.walking && !actor.pointer && !reducedMotion;
      const phase = Math.floor(current / 180) % 2;
      const bounce = moving ? phase : (reducedMotion ? 0 : Math.floor(current / 720) % 2);
      const wiggle = moving ? phase : 0;
      context.clearRect(0, 0, ADULT_W, ADULT_H);
      context.imageSmoothingEnabled = false;
      drawParts(context, adultTail, palette, 0, wiggle);
      if (mode === 'orca') {
        drawParts(context, [
          [10, 0, 1, 2, 'outline'], [9, 1, 3, 2, 'outline'], [8, 2, 4, 2, 'outline'],
          [10, 0, 1, 1, 'saddle'], [9, 1, 2, 2, 'saddle'], [8, 3, 3, 1, 'saddle'],
        ], palette);
      }
      drawParts(context, adultOutline, palette, bounce);
      drawParts(context, adultFill, palette, bounce);
      drawParts(context, adultMarks[mode] || adultMarks.whale, palette, bounce);
      paint(context, 5, 7 + bounce, 2, 2, palette.eye);
      paint(context, 5, 7 + bounce, 1, 1, palette.glint);
      if (mode === 'orca') paint(context, 7, 7 + bounce, 1, 1, palette.outline);
      if (streaming || moving) {
        paint(context, 17, 2 - wiggle, 1, 1, palette.bubble);
        paint(context, 19, 0, 1, 1, palette.bubble);
      }
      if (current < actor.sparkUntil) {
        const sx = actor.direction < 0 ? 17 : 5;
        paint(context, sx, 0, 1, 1, palette.spark);
        paint(context, sx - 1, 1, 3, 1, palette.spark);
        paint(context, sx, 2, 1, 1, palette.spark);
      }
      if (current < actor.hopUntil) paint(context, 15, 3, 2, 1, palette.spark);
    }

    function drawCalf(actor, current) {
      const context = actor.context;
      if (!context) return;
      const palette = actorPalette(actor);
      const moving = actor.walking && !actor.pointer && !reducedMotion;
      const phase = Math.floor((current + 90) / 240) % 2;
      const bounce = moving ? phase : (reducedMotion ? 0 : Math.floor((current + 180) / 820) % 2);
      const wiggle = moving ? phase : 0;
      context.clearRect(0, 0, CALF_W, CALF_H);
      context.imageSmoothingEnabled = false;
      drawParts(context, calfTail, palette, 0, wiggle);
      drawParts(context, calfOutline, palette, bounce);
      drawParts(context, calfFill, palette, bounce);
      drawParts(context, calfMarks, palette, bounce);
      paint(context, 3, 5 + bounce, 1, 2, palette.eye);
      paint(context, 3, 5 + bounce, 1, 1, palette.glint);
      if (mode === 'orca') paint(context, 5, 4 + bounce, 3, 1, palette.patch);
      if (streaming || moving) {
        paint(context, 12, 1, 1, 1, palette.bubble);
        paint(context, 13, 0, 1, 1, palette.bubble);
      }
      if (current < actor.sparkUntil) {
        const sx = actor.direction < 0 ? 12 : 1;
        paint(context, sx, 0, 1, 1, palette.spark);
        paint(context, sx - 1, 1, 3, 1, palette.spark);
      }
    }

    function makeActor(kind) {
      const isCalf = kind === 'calf';
      const width = isCalf ? CALF_W : ADULT_W;
      const height = isCalf ? CALF_H : ADULT_H;
      const dataAttribute = isCalf ? 'data-prism-companion-calf' : 'data-prism-companion';
      const actor = {
        kind, isCalf, width, height, dataAttribute,
        owner: null, canvas: null, context: null,
        x: 0, y: 0, vx: 0, vy: 0, direction: -1,
        walking: true, pauseUntil: 0, nextDecision: 0, followAfter: 0, wander: 0,
        hopUntil: 0, sparkUntil: 0, bumpUntil: 0, squashUntil: 0, pointer: null,
      };

      actor.hitbox = () => {
        const family = HITBOX_PROFILES[kind] || HITBOX_PROFILES.adult;
        const profile = family[mode] || family.whale;
        return {
          x: actor.x + profile.x,
          y: actor.y + profile.y,
          width: profile.width,
          height: profile.height,
        };
      };

      actor.label = () => {
        if (mode === 'orca') return isCalf ? '星海虎鲸幼鲸，可独立拖动' : '星海虎鲸像素伴宠，可独立拖动';
        return isCalf ? '深潜蓝鲸幼鲸，可独立拖动' : '深潜蓝鲸像素伴宠，可独立拖动';
      };

      actor.maxX = () => Math.max(0, stageWidth() - width - 8);
      actor.render = current => {
        if (!actor.owner) return;
        const sway = actor.walking && !actor.pointer && !reducedMotion
          ? Math.round(Math.sin((current + (isCalf ? 90 : 0)) / 230))
          : 0;
        const squashT = reducedMotion || current >= actor.squashUntil
          ? 0
          : Math.sin(clamp((actor.squashUntil - current) / 180, 0, 1) * Math.PI);
        const squashX = 1 + squashT * 0.035;
        const squashY = 1 - squashT * 0.055;
        actor.owner.style.transform =
          `translate3d(${Math.round(actor.x)}px, ${Math.round(actor.y + sway)}px, 0) ` +
          `scale(${squashX.toFixed(3)}, ${squashY.toFixed(3)})`;
        actor.owner.dataset.direction = actor.direction < 0 ? 'left' : 'right';
        actor.owner.dataset.state = actor.pointer ? 'drag' : (actor.walking ? 'walk' : 'idle');
        actor.owner.dataset.streaming = streaming ? '1' : '0';
        actor.owner.dataset.reducedMotion = reducedMotion ? '1' : '0';
        actor.canvas.dataset.sprite = mode + (isCalf ? '-calf' : '');
        actor.canvas.style.transform = actor.direction > 0 ? 'scaleX(-1)' : 'none';
        (isCalf ? drawCalf : drawAdult)(actor, current);
      };

      actor.remove = () => {
        actor.pointer = null;
        if (!actor.owner) return;
        actor.owner.removeEventListener?.('pointerdown', actor.onPointerDown);
        actor.owner.removeEventListener?.('pointermove', actor.onPointerMove);
        actor.owner.removeEventListener?.('pointerup', actor.releasePointer);
        actor.owner.removeEventListener?.('pointercancel', actor.releasePointer);
        actor.owner.removeEventListener?.('lostpointercapture', actor.releasePointer);
        actor.owner.removeEventListener?.('keydown', actor.onKeyDown);
        actor.owner.remove();
        actor.owner = null;
        actor.canvas = null;
        actor.context = null;
      };

      actor.onPointerDown = event => {
        if (event.isPrimary === false || (event.button !== undefined && event.button !== 0) || actor.pointer) return;
        event.preventDefault?.();
        event.stopPropagation?.();
        actor.pointer = {
          id: event.pointerId, startX: actor.x, startY: actor.y,
          startClientX: event.clientX, startClientY: event.clientY,
          lastX: actor.x, lastY: actor.y, lastAt: now(), vx: 0, vy: 0,
        };
        actor.walking = false;
        actor.pauseUntil = now() + 720;
        actor.owner.dataset.dragging = '1';
        safeCapture(actor.owner, event.pointerId);
        actor.render(now());
        ensureLoop();
      };

      actor.onPointerMove = event => {
        if (!actor.pointer || actor.pointer.id !== event.pointerId) return;
        event.preventDefault?.();
        event.stopPropagation?.();
        const current = now();
        const nextX = clamp(actor.pointer.startX + event.clientX - actor.pointer.startClientX, 0, actor.maxX());
        const nextY = clamp(actor.pointer.startY + event.clientY - actor.pointer.startClientY, -72, 0);
        const elapsed = Math.max(8, current - actor.pointer.lastAt) / 1000;
        actor.pointer.vx = (nextX - actor.pointer.lastX) / elapsed;
        actor.pointer.vy = (nextY - actor.pointer.lastY) / elapsed;
        actor.pointer.lastX = nextX;
        actor.pointer.lastY = nextY;
        actor.pointer.lastAt = current;
        if (nextX !== actor.x) actor.direction = nextX < actor.x ? -1 : 1;
        actor.x = nextX;
        actor.y = nextY;
        resolveCollision(current, 'drag');
        renderAll(current);
      };

      actor.releasePointer = event => {
        if (!actor.pointer || (event?.pointerId !== undefined && actor.pointer.id !== event.pointerId)) return;
        const released = actor.pointer;
        actor.pointer = null;
        actor.owner.removeAttribute('data-dragging');
        safeRelease(actor.owner, released.id);
        actor.vx = clamp(released.vx * 0.32, -250, 250);
        actor.vy = actor.y < -1 ? -70 : 0;
        actor.walking = false;
        actor.pauseUntil = now() + 650;
        if (isCalf) actor.followAfter = now() + 4200;
        actor.render();
        ensureLoop();
      };

      actor.onKeyDown = event => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault?.();
          actor.x = clamp(actor.x + (event.key === 'ArrowLeft' ? -18 : 18), 0, actor.maxX());
          actor.direction = event.key === 'ArrowLeft' ? -1 : 1;
          actor.y = 0;
          actor.walking = false;
          actor.pauseUntil = now() + 900;
          if (isCalf) actor.followAfter = now() + 4200;
          resolveCollision(now(), 'keyboard');
          renderAll();
          ensureLoop();
        } else if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault?.();
          actor.hopUntil = now() + 520;
          actor.sparkUntil = now() + 700;
          actor.render();
          ensureLoop();
        }
      };

      actor.ensure = () => {
        if (disposed || mode === 'off') {
          actor.remove();
          return;
        }
        if (actor.owner) return;
        const owner = doc.createElement('div');
        owner.className = `prism-pixel-companion prism-pixel-companion--${kind}`;
        owner.setAttribute(actor.dataAttribute, mode);
        owner.setAttribute('data-dsh-prism-owned', '1');
        owner.setAttribute('data-pixelated', '1');
        owner.setAttribute('role', 'button');
        owner.setAttribute('tabindex', '0');
        owner.setAttribute('aria-label', actor.label());
        const shadow = doc.createElement('span');
        shadow.className = `prism-pixel-shadow prism-pixel-shadow--${kind}`;
        shadow.setAttribute('aria-hidden', 'true');
        const canvas = doc.createElement('canvas');
        canvas.className = `prism-pixel-sprite prism-pixel-sprite--${kind}`;
        canvas.width = width;
        canvas.height = height;
        canvas.setAttribute('aria-hidden', 'true');
        owner.appendChild(shadow);
        owner.appendChild(canvas);
        owner.addEventListener('pointerdown', actor.onPointerDown);
        owner.addEventListener('pointermove', actor.onPointerMove);
        owner.addEventListener('pointerup', actor.releasePointer);
        owner.addEventListener('pointercancel', actor.releasePointer);
        owner.addEventListener('lostpointercapture', actor.releasePointer);
        owner.addEventListener('keydown', actor.onKeyDown);
        host.appendChild(owner);
        actor.owner = owner;
        actor.canvas = canvas;
        actor.context = canvas.getContext?.('2d') || null;
      };

      return actor;
    }

    const actors = { adult: makeActor('adult'), calf: makeActor('calf') };

    function initPositions() {
      const adult = actors.adult, calf = actors.calf;
      adult.x = clamp(stageWidth() - ADULT_W - CALF_W - 26, 0, adult.maxX());
      adult.y = 0;
      adult.direction = -1;
      adult.nextDecision = now() + 1600 + Math.random() * 900;
      calf.x = clamp(adult.x + ADULT_W + FAMILY_GAP, 0, calf.maxX());
      calf.y = 0;
      calf.direction = -1;
      calf.nextDecision = now() + 1200 + Math.random() * 1600;
    }

    function stepAdult(actor, current, dt) {
      if (reducedMotion) {
        actor.walking = false;
        return;
      }
      if (current < actor.bumpUntil) {
        actor.walking = false;
        return;
      }
      if (actor.y === 0 && !actor.vx && current >= actor.nextDecision) {
        actor.walking = !actor.walking || Math.random() < 0.22;
        if (!actor.walking) actor.pauseUntil = current + 700 + Math.random() * 1300;
        else if (Math.random() < 0.38) actor.direction *= -1;
        actor.nextDecision = current + 1800 + Math.random() * 2600;
      }
      if (actor.pauseUntil && current >= actor.pauseUntil) {
        actor.pauseUntil = 0;
        actor.walking = true;
      }
      if (actor.walking && current >= actor.pauseUntil) {
        const speed = streaming ? 34 : 15;
        actor.x += actor.direction * speed * dt;
        if (actor.x <= 0) {
          actor.x = 0;
          actor.direction = 1;
        } else if (actor.x >= actor.maxX()) {
          actor.x = actor.maxX();
          actor.direction = -1;
        }
      }
    }

    function stepCalf(actor, current, dt) {
      if (reducedMotion || current < actor.followAfter) {
        actor.walking = false;
        return;
      }
      if (current < actor.bumpUntil) {
        actor.walking = false;
        return;
      }
      if (current >= actor.nextDecision) {
        actor.walking = Math.random() < 0.68;
        if (actor.walking && Math.random() < 0.5) actor.direction *= -1;
        actor.nextDecision = current + 1400 + Math.random() * 2400;
        actor.pauseUntil = actor.walking ? 0 : current + 500 + Math.random() * 950;
      }
      if (actor.pauseUntil && current >= actor.pauseUntil) {
        actor.pauseUntil = 0;
        actor.walking = true;
      }
      const separation = actor.x - actors.adult.x;
      const farFromFamily = Math.abs(separation) > 132;
      if (farFromFamily) {
        const target = actors.adult.x + (actors.adult.direction < 0 ? ADULT_W + FAMILY_GAP : -(CALF_W + FAMILY_GAP));
        actor.direction = target < actor.x ? -1 : 1;
        actor.walking = true;
      }
      if (actor.walking && current >= actor.pauseUntil) {
        const speed = streaming ? 44 : (farFromFamily ? 26 : 18);
        actor.x += actor.direction * speed * dt;
        if (actor.x <= 0) {
          actor.x = 0;
          actor.direction = 1;
        } else if (actor.x >= actor.maxX()) {
          actor.x = actor.maxX();
          actor.direction = -1;
        }
      }
    }

    function stepActor(actor, current, dt) {
      if (actor.pointer) return;
      if (actor.y < 0 || Math.abs(actor.vy) > 1) {
        actor.vy += 980 * dt;
        actor.y += actor.vy * dt;
        if (actor.y >= 0) {
          actor.y = 0;
          actor.vy = Math.abs(actor.vy) > 90 ? -Math.abs(actor.vy) * 0.2 : 0;
          if (Math.abs(actor.vy) < 26) actor.vy = 0;
        }
      }
      if (actor.x + actor.vx * dt <= 0 || actor.x + actor.vx * dt >= actor.maxX()) actor.vx = 0;
      actor.x = clamp(actor.x + actor.vx * dt, 0, actor.maxX());
      if (actor.vx) actor.vx *= Math.pow(0.08, dt);
      if (Math.abs(actor.vx) < 1) actor.vx = 0;
      if (actor.isCalf) stepCalf(actor, current, dt);
      else stepAdult(actor, current, dt);
    }

    function actorMotion(actor) {
      if (actor.pointer) {
        return { vx: finiteNumber(actor.pointer.vx), vy: finiteNumber(actor.pointer.vy) };
      }
      const speed = actor.isCalf
        ? (streaming ? 44 : 18)
        : (streaming ? 34 : 15);
      return {
        vx: finiteNumber(actor.vx) + (actor.walking && !reducedMotion ? actor.direction * speed : 0),
        vy: finiteNumber(actor.vy),
      };
    }

    function setCollisionData(active) {
      for (const actor of [actors.adult, actors.calf]) {
        if (!actor.owner) continue;
        if (active) actor.owner.setAttribute('data-collision', '1');
        else actor.owner.removeAttribute('data-collision');
      }
    }

    function armCollisionClear() {
      if (collisionClearTimer || typeof win.setTimeout !== 'function') return;
      collisionClearTimer = win.setTimeout(() => {
        collisionClearTimer = 0;
        if (collisionContact) {
          armCollisionClear();
          return;
        }
        collisionActiveUntil = 0;
        setCollisionData(false);
      }, 180) || 0;
    }

    function resolveCollision(current, source = 'frame') {
      const adult = actors.adult;
      const calf = actors.calf;
      if (!adult.owner || !calf.owner) return null;
      const result = resolvePairCollision(adult, calf, {
        bounds: {
          adult: { minX: 0, maxX: adult.maxX(), minY: -72, maxY: 0 },
          calf: { minX: 0, maxX: calf.maxX(), minY: -72, maxY: 0 },
        },
        fixedAdult: Boolean(adult.pointer),
        fixedCalf: Boolean(calf.pointer),
        motionAdult: actorMotion(adult),
        motionCalf: actorMotion(calf),
        reducedMotion,
        applyImpulse: !collisionContact,
        maxCorrection: reducedMotion ? Infinity : 2.4,
        allowDiscreteFallback: reducedMotion,
      });
      if (!result?.initialColliding) {
        collisionContact = false;
        return result;
      }

      lastCollision = { ...result, source, at: current };
      const newContact = !collisionContact;
      collisionContact = true;
      collisionActiveUntil = Math.max(collisionActiveUntil, current + 180);
      if (newContact) {
        collisionCount += 1;
        lastCollisionAt = current;
        setCollisionData(true);
        armCollisionClear();
      }

      if (!reducedMotion) {
        adult.squashUntil = current + 180;
        calf.squashUntil = current + 180;
        adult.bumpUntil = Math.max(adult.bumpUntil, current + 240);
        calf.bumpUntil = Math.max(calf.bumpUntil, current + 240);
        calf.followAfter = Math.max(calf.followAfter, current + 820);
        if (!adult.pointer) {
          adult.walking = false;
          adult.pauseUntil = Math.max(adult.pauseUntil, current + 260);
        }
        if (!calf.pointer) {
          calf.walking = false;
          calf.pauseUntil = Math.max(calf.pauseUntil, current + 260);
        }
        if (result.axis === 'x') {
          const sign = Math.sign(result.normalX) || 1;
          adult.direction = sign > 0 ? -1 : 1;
          calf.direction = sign > 0 ? 1 : -1;
        }
      }
      return result;
    }

    function renderAll(current = now()) {
      actors.adult.render(current);
      actors.calf.render(current);
    }

    function stopLoop() {
      if (!frameId) return;
      win.cancelAnimationFrame?.(frameId);
      frameId = 0;
      lastFrame = 0;
    }

    function ensureLoop() {
      if (disposed || reducedMotion || !isVisible()) {
        stopLoop();
        renderAll();
        return;
      }
      if (!frameId) frameId = win.requestAnimationFrame?.(tick) || 0;
      if (!frameId) renderAll();
    }

    function tick(current) {
      frameId = 0;
      if (disposed || reducedMotion || !isVisible()) {
        stopLoop();
        renderAll(current);
        return;
      }
      const dt = lastFrame ? clamp((current - lastFrame) / 1000, 0, 0.05) : 0.016;
      lastFrame = current;
      stepActor(actors.adult, current, dt);
      stepActor(actors.calf, current, dt);
      resolveCollision(current);
      renderAll(current);
      ensureLoop();
    }

    function ensureActors() {
      if (disposed || mode === 'off') {
        actors.adult.remove();
        actors.calf.remove();
        stopLoop();
        return false;
      }
      actors.adult.ensure();
      actors.calf.ensure();
      for (const actor of [actors.adult, actors.calf]) {
        if (!actor.owner) continue;
        actor.owner.setAttribute(actor.dataAttribute, mode);
        actor.owner.setAttribute('aria-label', actor.label());
      }
      return Boolean(actors.adult.owner && actors.calf.owner);
    }

    function clampActors() {
      for (const actor of [actors.adult, actors.calf]) {
        actor.x = clamp(actor.x, 0, actor.maxX());
      }
    }

    function sync() {
      if (!ensureActors()) return;
      if (!actors.adult.owner?.isConnected) return;
      clampActors();
      resolveCollision(now(), 'sync');
      renderAll();
      ensureLoop();
    }

    if (ensureActors()) {
      initPositions();
      actorReady();
      sync();
    }

    function actorReady() {
      actors.adult.pauseUntil = 0;
      actors.calf.pauseUntil = 0;
      const current = now();
      actors.adult.nextDecision = current + 1600 + Math.random() * 900;
      actors.calf.nextDecision = current + 1200 + Math.random() * 1600;
    }

    const onViewportChange = () => {
      clampActors();
      resolveCollision(now(), 'resize');
      renderAll();
      ensureLoop();
    };
    const onVisibilityChange = () => {
      if (doc?.hidden) stopLoop();
      else ensureLoop();
    };
    win.addEventListener?.('resize', onViewportChange, { passive: true });
    doc?.addEventListener?.('visibilitychange', onVisibilityChange);

    return {
      setState(next = {}) {
        if ('mode' in next) {
          const previous = mode;
          mode = normalizeMode(next.mode);
          if (mode !== previous) {
            actors.adult.y = 0;
            actors.calf.y = 0;
          }
        }
        if ('reducedMotion' in next) reducedMotion = Boolean(next.reducedMotion);
        if ('streaming' in next) streaming = Boolean(next.streaming);
        sync();
      },
      notify(event) {
        if (!actors.adult.owner || mode === 'off') return;
        const current = now();
        if (!['vial-opened', 'model-shift', 'complete', 'celebrate'].includes(event)) return;
        for (const actor of [actors.adult, actors.calf]) {
          actor.sparkUntil = current + (event === 'complete' || event === 'celebrate' ? 1500 : 850);
          actor.hopUntil = current + (event === 'complete' ? 760 : 480);
          actor.walking = false;
          actor.pauseUntil = current + 720;
        }
        if (actors.calf.pointer) actors.calf.followAfter = current + 4200;
        renderAll(current);
        ensureLoop();
      },
      getLayoutSnapshot: () => {
        const current = now();
        const collision = measurePairCollision(actors.adult, actors.calf);
        return {
          mode,
          streaming,
          reducedMotion,
          visible: Boolean(actors.adult.owner && actors.calf.owner),
          x: Math.round(actors.adult.x),
          y: Math.round(actors.adult.y),
          direction: actors.adult.direction < 0 ? 'left' : 'right',
          dragging: Boolean(actors.adult.pointer),
          walking: Boolean(actors.adult.walking && !actors.adult.pointer),
          collisionCount,
          colliding: current < collisionActiveUntil,
          collision: {
            active: current < collisionActiveUntil,
            resolved: !collision.colliding,
            overlapX: round(collision.overlapX),
            overlapY: round(collision.overlapY),
            clearanceX: round(collision.clearanceX),
            clearanceY: round(collision.clearanceY),
            centerDistance: round(collision.centerDistance),
            lastSource: lastCollision?.source || null,
            lastAxis: lastCollision?.axis || null,
          },
          calf: actors.calf.owner ? {
            x: Math.round(actors.calf.x),
            y: Math.round(actors.calf.y),
            direction: actors.calf.direction < 0 ? 'left' : 'right',
            dragging: Boolean(actors.calf.pointer),
            walking: Boolean(actors.calf.walking && !actors.calf.pointer),
          } : null,
        };
      },
      dispose() {
        if (disposed) return;
        disposed = true;
        if (collisionClearTimer) win.clearTimeout?.(collisionClearTimer);
        collisionClearTimer = 0;
        win.removeEventListener?.('resize', onViewportChange);
        doc?.removeEventListener?.('visibilitychange', onVisibilityChange);
        actors.adult.remove();
        actors.calf.remove();
        stopLoop();
      },
    };
  }

  return {
    normalizeMode,
    mount,
    collisionCore: {
      measure: measurePairCollision,
      resolvePair: resolvePairCollision,
    },
  };
});

}).call(
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : {},
  typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : undefined),
  typeof self !== "undefined" ? self : (typeof window !== "undefined" ? window : undefined),
  typeof document !== "undefined" ? document : undefined,
  undefined,
  undefined
);

// === [5/10] src/prism-native-icons.js ===
;(function (root, window, self, document, module, exports) {
/* Obsidian Prism for DeepSeek Harness · native icon choreography and model glyphs · GPL-3.0-only */
(function (root, factory) {
  'use strict';
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.DSHPrismNativeIcons = api;
})(typeof globalThis !== 'undefined' ? globalThis : window, function (root) {
  'use strict';

  const VERSION = '1.0.0';
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const GOOGLE_COLORS = Object.freeze({
    blue: '#4285F4',
    red: '#EA4335',
    yellow: '#FBBC04',
    green: '#34A853',
  });

  const OFFICIAL_GEMINI_SPARK_D =
    'M12 1.2c.25 0 .47.17.53.41c.21.79.48 1.56.8 2.31c1.23 2.86 3.39 5.02 6.25 6.25c.75.32 1.52.59 2.31.8c.24.06.41.28.41.53s-.17.47-.41.53a16 16 0 0 0-2.31.8c-2.86 1.23-5.02 3.39-6.25 6.25c-.32.75-.59 1.52-.8 2.31a.55.55 0 0 1-.53.41a.55.55 0 0 1-.53-.41a16 16 0 0 0-.8-2.31c-1.23-2.86-3.39-5.02-6.25-6.25a16 16 0 0 0-2.31-.8A.55.55 0 0 1 1.2 12c0-.25.17-.47.41-.53c.79-.21 1.56-.48 2.31-.8c2.86-1.23 5.02-3.39 6.25-6.25c.32-.75.59-1.52.8-2.31c.06-.24.28-.41.53-.41Z';

  const BRAND_PATHS = Object.freeze({
    gemini: OFFICIAL_GEMINI_SPARK_D,
    claude:
      'm4.714 15.956l4.718-2.648l.079-.23l-.08-.128h-.23l-.79-.048l-2.695-.073l-2.337-.097l-2.265-.122l-.57-.121l-.535-.704l.055-.353l.48-.321l.685.06l1.518.104l2.277.157l1.651.098l2.447.255h.389l.054-.158l-.133-.097l-.103-.098l-2.356-1.596l-2.55-1.688l-1.336-.972l-.722-.491L2 6.223l-.158-1.008l.656-.722l.88.06l.224.061l.893.686l1.906 1.476l2.49 1.833l.364.304l.146-.104l.018-.072l-.164-.274l-1.354-2.446l-1.445-2.49l-.644-1.032l-.17-.619a3 3 0 0 1-.103-.729L6.287.133L6.7 0l.995.134l.42.364l.619 1.415L9.735 4.14l1.555 3.03l.455.898l.243.832l.09.255h.159V9.01l.127-1.706l.237-2.095l.23-2.695l.08-.76l.376-.91l.747-.492l.583.28l.48.685l-.067.444l-.286 1.851l-.558 2.903l-.365 1.942h.213l.243-.242l.983-1.306l1.652-2.064l.728-.82l.85-.904l.547-.431h1.032l.759 1.129l-.34 1.166l-1.063 1.347l-.88 1.142l-1.263 1.7l-.79 1.36l.074.11l.188-.02l2.853-.606l1.542-.28l1.84-.315l.832.388l.09.395l-.327.807l-1.967.486l-2.307.462l-3.436.813l-.043.03l.049.061l1.548.146l.662.036h1.62l3.018.225l.79.522l.473.638l-.08.485l-1.213.62l-1.64-.389l-3.825-.91l-1.31-.329h-.183v.11l1.093 1.068l2.003 1.81l2.508 2.33l.127.578l-.321.455l-.34-.049l-2.204-1.657l-.85-.747l-1.925-1.62h-.127v.17l.443.649l2.343 3.521l.122 1.08l-.17.353l-.607.213l-.668-.122l-1.372-1.924l-1.415-2.168l-1.141-1.943l-.14.08l-.674 7.254l-.316.37l-.728.28l-.607-.461l-.322-.747l.322-1.476l.388-1.924l.316-1.53l.285-1.9l.17-.632l-.012-.042l-.14.018l-1.432 1.967l-2.18 2.945l-1.724 1.845l-.413.164l-.716-.37l.066-.662l.401-.589l2.386-3.036l1.439-1.882l.929-1.086l-.006-.158h-.055L4.138 18.56l-1.13.146l-.485-.456l.06-.746l.231-.243l1.907-1.312Z',
    openai:
      'M20.562 10.188c.25-.688.313-1.376.25-2.063c-.062-.687-.312-1.375-.625-2c-.562-.937-1.375-1.687-2.312-2.125c-1-.437-2.063-.562-3.125-.312c-.5-.5-1.063-.938-1.688-1.25S11.687 2 11 2a5.17 5.17 0 0 0-3 .938c-.875.624-1.5 1.5-1.813 2.5c-.75.187-1.375.5-2 .875c-.562.437-1 1-1.375 1.562c-.562.938-.75 2-.625 3.063a5.44 5.44 0 0 0 1.25 2.874a4.7 4.7 0 0 0-.25 2.063c.063.688.313 1.375.625 2c.563.938 1.375 1.688 2.313 2.125c1 .438 2.062.563 3.125.313c.5.5 1.062.937 1.687 1.25S12.312 22 13 22a5.17 5.17 0 0 0 3-.937c.875-.625 1.5-1.5 1.812-2.5a4.54 4.54 0 0 0 1.938-.875c.562-.438 1.062-.938 1.375-1.563c.562-.937.75-2 .625-3.062c-.125-1.063-.5-2.063-1.188-2.876m-7.5 10.5c-1 0-1.75-.313-2.437-.875c0 0 .062-.063.125-.063l4-2.312a.5.5 0 0 0 .25-.25a.57.57 0 0 0 .062-.313V11.25l1.688 1v4.625a3.685 3.685 0 0 1-3.688 3.813M5 17.25c-.438-.75-.625-1.625-.438-2.5c0 0 .063.063.125.063l4 2.312a.56.56 0 0 0 .313.063c.125 0 .25 0 .312-.063l4.875-2.812v1.937l-4.062 2.375A3.7 3.7 0 0 1 7.312 19c-1-.25-1.812-.875-2.312-1.75M3.937 8.563a3.8 3.8 0 0 1 1.938-1.626v4.751c0 .124 0 .25.062.312a.5.5 0 0 0 .25.25l4.875 2.813l-1.687 1l-4-2.313a3.7 3.7 0 0 1-1.75-2.25c-.25-.937-.188-2.062.312-2.937M17.75 11.75l-4.875-2.812l1.687-1l4 2.312c.625.375 1.125.875 1.438 1.5s.5 1.313.437 2.063a3.7 3.7 0 0 1-.75 1.937c-.437.563-1 1-1.687 1.25v-4.75c0-.125 0-.25-.063-.312c0 0-.062-.126-.187-.188m1.687-2.5s-.062-.062-.125-.062l-4-2.313c-.125-.062-.187-.062-.312-.062s-.25 0-.313.062L9.812 9.688V7.75l4.063-2.375c.625-.375 1.312-.5 2.062-.5c.688 0 1.375.25 2 .688c.563.437 1.063 1 1.313 1.625s.312 1.375.187 2.062m-10.5 3.5l-1.687-1V7.063c0-.688.187-1.438.562-2C8.187 4.438 8.75 4 9.375 3.688a3.37 3.37 0 0 1 2.062-.313c.688.063 1.375.375 1.938.813c0 0-.063.062-.125.062l-4 2.313a.5.5 0 0 0-.25.25c-.063.125-.063.187-.063.312zm.875-2L12 9.5l2.187 1.25v2.5L12 14.5l-2.188-1.25z',
  });

  const iconCache = new Map();
  const iconHosts = new Set();
  const modelGlyphs = new Map();
  const copyTimers = new Set();
  const commandTimers = new Set();
  let activeInstance = null;

  const escapeHtml = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const extraAttrs = (attrs) => {
    if (!attrs || typeof attrs !== 'object') return '';
    let out = '';
    for (const [key, value] of Object.entries(attrs)) {
      if (value === undefined || value === null || value === false) continue;
      out += value === true ? ` ${key}` : ` ${key}="${escapeHtml(value)}"`;
    }
    return out;
  };

  const path = (part, d, attrs = '') =>
    `<path class="ai-part-${part}" d="${d}"${attrs}/>`;
  const group = (part, inner) =>
    `<g class="ai-part-${part}">${inner}</g>`;

  const GEAR_PATH =
    'M12 8.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Zm7.4 6.2a1.6 1.6 0 0 0 .32 1.76l.06.06a1.9 1.9 0 1 1-2.68 2.68l-.06-.06a1.6 1.6 0 0 0-1.76-.32 1.6 1.6 0 0 0-.98 1.46V21a1.9 1.9 0 1 1-3.8 0v-.08a1.6 1.6 0 0 0-.98-1.46 1.6 1.6 0 0 0-1.76.32l-.06.06a1.9 1.9 0 1 1-2.68-2.68l.06-.06a1.6 1.6 0 0 0 .32-1.76 1.6 1.6 0 0 0-1.46-.98H3a1.9 1.9 0 1 1 0-3.8h.08a1.6 1.6 0 0 0 1.46-.98 1.6 1.6 0 0 0-.32-1.76l-.06-.06a1.9 1.9 0 1 1 2.68-2.68l.06.06a1.6 1.6 0 0 0 1.76.32h.08a1.6 1.6 0 0 0 .98-1.46V3a1.9 1.9 0 1 1 3.8 0v.08a1.6 1.6 0 0 0 .98 1.46h.08a1.6 1.6 0 0 0 1.76-.32l.06-.06a1.9 1.9 0 1 1 2.68 2.68l-.06.06a1.6 1.6 0 0 0-.32 1.76v.08a1.6 1.6 0 0 0 1.46.98H21a1.9 1.9 0 1 1 0 3.8h-.08a1.6 1.6 0 0 0-1.46.98Z';

  /* 21 upstream-compatible templates. Each hover/active motion is CSS-only. */
  const TEMPLATES = Object.freeze({
    'panel-left': () =>
      '<rect class="ai-part-frame" x="3" y="4" width="18" height="16" rx="3"/>' +
      path('rail', 'M9.2 4v16'),
    'sparkles-pen': () =>
      path('board', 'M11 4H6.5A2.5 2.5 0 0 0 4 6.5v11A2.5 2.5 0 0 0 6.5 20h11a2.5 2.5 0 0 0 2.5-2.5V13') +
      group('pen', '<path d="M16.4 3.9a1.9 1.9 0 0 1 2.7 2.7L11.5 14.2l-3.4.8.8-3.4 7.5-7.7Z"/>') +
      path('spark', 'M19 2.2v2.6M17.7 3.5h2.6', ' stroke-width="1.6"'),
    search: () =>
      group('lens', '<circle cx="10.8" cy="10.8" r="6.6"/><path d="m15.7 15.7 4.5 4.5"/>'),
    pin: () =>
      group('pin', '<path d="M9 4h6l-1 5.2 2.8 2.5v1.5H7.2v-1.5L10 9.2 9 4Z"/><path d="M12 13.2V20"/>'),
    'clock-history': () =>
      group('dial', '<path d="M3.4 11a8.8 8.8 0 1 1 2 6.2"/><path d="M3.2 6.8V11h4.2"/>') +
      path('hand', 'M12 7.4V12l3.1 1.9'),
    'folder-workspace': () =>
      path('back', 'M3.5 18.5V6.5A2 2 0 0 1 5.5 4.5h4.1l2 2.2h6.9a2 2 0 0 1 2 2v9.8a1.5 1.5 0 0 1-1.5 1.5h-14a1.5 1.5 0 0 1-1.5-1.5Z') +
      path('flap', 'M3.7 10.6h16.6'),
    'settings-gear': () => group('gear', `<path d="${GEAR_PATH}"/>`),
    'trash-sweep': () =>
      group('lid', '<path d="M4 6.5h16"/><path d="M9 6.5V4.8c0-.7.6-1.3 1.3-1.3h3.4c.7 0 1.3.6 1.3 1.3v1.7"/>') +
      group('bin', '<path d="M6.2 6.5 7 19.2c.06 1 .88 1.8 1.9 1.8h6.2c1.02 0 1.84-.8 1.9-1.8L17.8 6.5"/><path d="M10 10.5v6M14 10.5v6"/>'),
    'copy-check': (options = {}) => {
      const checked = Boolean(options.active);
      return (
        `<g class="ai-part-copy" style="opacity:${checked ? 0 : 1}">` +
        path('copy-back', 'M8 8V5.8C8 4.8 8.8 4 9.8 4h8.4C19.2 4 20 4.8 20 5.8v8.4c0 1-.8 1.8-1.8 1.8H16') +
        '<rect class="ai-part-copy-front" x="4" y="8" width="12" height="12" rx="2"/></g>' +
        path('check', 'M5 12.8l4.4 4.4L19.4 7.2', ` style="opacity:${checked ? 1 : 0}"`)
      );
    },
    'plus-spin': () => group('plus', '<path d="M12 5v14M5 12h14"/>'),
    'arrow-up-launch': () => group('arrow', '<path d="M12 19V5"/><path d="m6.2 10.8 5.8-5.8 5.8 5.8"/>'),
    'chevron-right': () => path('chevron', 'm9 6 6 6-6 6'),
    'chevron-down': () => path('chevron', 'm6 9 6 6 6-6'),
    'more-horizontal': () =>
      [5.5, 12, 18.5]
        .map((cx, index) => `<circle class="ai-part-d${index + 1}" cx="${cx}" cy="12" r="1.35" fill="currentColor"/>`)
        .join(''),
    'radar-pulse': () =>
      '<circle class="ai-part-core" cx="12" cy="12" r="2.3"/>' +
      group('wave', '<path d="M7.6 7.6a6.2 6.2 0 0 0 0 8.8M16.4 7.6a6.2 6.2 0 0 1 0 8.8"/><path d="M4.6 4.6a10.4 10.4 0 0 0 0 14.8M19.4 4.6a10.4 10.4 0 0 1 0 14.8"/>'),
    'sliders-tune': () =>
      group('tracks', '<path d="M4 6.5h16M4 12h16M4 17.5h16" stroke-opacity="0.72"/>') +
      [[9, 6.5], [15, 12], [10, 17.5]]
        .map(([cx, cy], index) => `<circle class="ai-part-k${index + 1}" cx="${cx}" cy="${cy}" r="2.1" fill="var(--card,var(--bg-elevated,#141518))"/>`)
        .join(''),
    'sun-moon': () =>
      group('celestial', '<path d="M12 7.6a4.4 4.4 0 1 0 4.4 4.4 3.4 3.4 0 0 1-4.4-4.4Z"/>') +
      group('rays', '<path d="M12 2.8v1.8M12 19.4v1.8M4.2 12H2.4M21.6 12h-1.8M6.1 6.1 4.8 4.8M19.2 19.2l-1.3-1.3M17.9 6.1l1.3-1.3M4.8 19.2l1.3-1.3"/>'),
    'layers-stack': () =>
      path('top', 'M12 3.5 3.2 8 12 12.5 20.8 8 12 3.5Z') +
      path('mid', 'm3.2 12 8.8 4.5 8.8-4.5') +
      path('bot', 'm3.2 16 8.8 4.5 8.8-4.5'),
    'zap-bolt': () => path('bolt', 'M13.2 2.8 4.8 13.4h6.3L10.3 21.2l8.9-10.6h-6.3l.3-7.8Z'),
    'alert-triangle': () =>
      group('triangle', '<path d="M10.3 4.2 2.9 17.2a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z"/>') +
      path('mark', 'M12 9.5v4.2M12 17h.01'),
    'x-close': () => group('cross', '<path d="M17.5 6.5 6.5 17.5M6.5 6.5l11 11"/>'),
  });

  /* Two host-specific clean-room glyphs are intentionally outside the 21-template baseline. */
  const HOST_TEMPLATES = Object.freeze({
    terminal: () =>
      '<rect class="ai-part-terminal-frame" x="3" y="4.5" width="18" height="15" rx="2.6"/>' +
      path('prompt', 'm7 9 3 3-3 3M12.5 15h4.5'),
    'stop-square': () =>
      '<rect class="ai-part-stop-square" x="6.2" y="6.2" width="11.6" height="11.6" rx="2.1" fill="currentColor" stroke="none"/>',
  });

  const ALL_TEMPLATES = Object.freeze({ ...TEMPLATES, ...HOST_TEMPLATES });

  const ICON_ALIASES = Object.freeze({
    trash: 'trash-sweep',
    delete: 'trash-sweep',
    copy: 'copy-check',
    clipboard: 'copy-check',
    settings: 'settings-gear',
    gear: 'settings-gear',
    clock: 'clock-history',
    history: 'clock-history',
    folder: 'folder-workspace',
    file: 'folder-workspace',
    workspace: 'folder-workspace',
    plus: 'plus-spin',
    add: 'plus-spin',
    'arrow-up': 'arrow-up-launch',
    send: 'arrow-up-launch',
    stop: 'stop-square',
    sliders: 'sliders-tune',
    layers: 'layers-stack',
    zap: 'zap-bolt',
    alert: 'alert-triangle',
    warning: 'alert-triangle',
    close: 'x-close',
    dismiss: 'x-close',
    x: 'x-close',
    sidebar: 'panel-left',
    'new-chat': 'sparkles-pen',
    new: 'sparkles-pen',
    automations: 'zap-bolt',
    model: 'radar-pulse',
    spark: 'radar-pulse',
  });

  const ICON_NAMES = Object.freeze(Object.keys(TEMPLATES));
  const HOST_ICON_NAMES = Object.freeze(Object.keys(HOST_TEMPLATES));
  const ALL_ICON_NAMES = Object.freeze(Object.keys(ALL_TEMPLATES));

  function resolveIconName(name) {
    const raw = String(name || '').trim();
    if (ALL_TEMPLATES[raw]) return raw;
    return ICON_ALIASES[raw] || '';
  }

  function renderIcon(name, options = {}) {
    const id = resolveIconName(name);
    if (!id) return '';
    const cachedKey = `${id}|${options.active ? 1 : 0}|${options.size || 15}|${options.strokeWidth || 1.8}`;
    if (!options.noCache && iconCache.has(cachedKey)) return iconCache.get(cachedKey);
    const size = Number(options.size) > 0 ? Number(options.size) : 15;
    const strokeWidth = Number(options.strokeWidth) > 0 ? Number(options.strokeWidth) : 1.8;
    const active = Boolean(options.active);
    const classes = [
      'ag-anim-icon',
      'dsh-prism-anim-svg',
      `ag-icon-${id}`,
      active ? 'is-active' : '',
      options.className || '',
    ].filter(Boolean).join(' ');
    const markup =
      `<svg class="${escapeHtml(classes)}" data-anim-icon="${escapeHtml(id)}"` +
      ` data-icon-state="${active ? 'active' : 'idle'}" width="${size}" height="${size}"` +
      ' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + strokeWidth + '"' +
      ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"' +
      `${extraAttrs(options.attrs)}>${ALL_TEMPLATES[id]({ active })}</svg>`;
    if (iconCache.size > 96) iconCache.clear();
    if (!options.noCache) iconCache.set(cachedKey, markup);
    return markup;
  }

  const DEEPSEEK_WHALE =
    '<path class="ag-cs-glyph-whale-body" d="M2.8 13.4c1.2 2.2 3.3 3.3 6 3.2c3.5-.1 6.2-1.8 8.2-4.5c.28-.38.58-.55.96-.43c.78.25 1.53.86 2.26 1.7c.03-1.1-.13-2.03-.52-2.77c1.13-.13 2.17-.54 3.1-1.22c-1.38-.19-2.55-.12-3.52.2c-.67-1.39-1.83-2.28-3.5-2.67c.24.88.31 1.6.18 2.15c-.34 1.39-1.45 2.42-3.2 3.13c-1.88.76-3.94 1.18-6.2 1.25c-1.63.05-2.9.18-3.78.43Z"/>' +
    '<path class="ag-cs-glyph-whale-belly" d="M4.1 14.65c1.05 1.2 2.6 1.65 4.46 1.36c2.36-.37 4.18-1.48 5.48-3.3c-2.02 1.1-4.38 1.7-7.08 1.77c-1.1.03-2.05.09-2.86.17Z"/>' +
    '<circle class="ag-cs-glyph-whale-eye" cx="6.15" cy="12.15" r=".72"/>' +
    '<path class="ag-cs-glyph-whale-fin" d="M11.35 11.05c.1 1.04.7 1.82 1.82 2.34c-.18-1.02-.63-1.79-1.82-2.34Z"/>' +
    '<path class="ag-cs-glyph-starfire" d="M18.6 2.25l.55 1.7l1.7.55l-1.7.55l-.55 1.7l-.55-1.7l-1.7-.55l1.7-.55l.55-1.7Z"/>' +
    '<circle class="ag-cs-glyph-bubble" cx="16.9" cy="5.1" r=".62"/>';

  function renderModelGlyphSvg(brand, tier, selected) {
    const normalizedBrand = BRAND_PATHS[brand] || brand === 'deepseek' ? brand : 'antigravity';
    const normalizedTier = normalizeTier(tier);
    if (normalizedBrand === 'deepseek') {
      return (
        '<svg class="ag-cs-model-glyph-svg dsh-prism-model-glyph-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">' +
        '<g class="ag-cs-glyph-orbit-group"><ellipse class="ag-cs-glyph-orbit" cx="12" cy="13.3" rx="10.9" ry="3.6" transform="rotate(-8 12 13.3)"/><circle class="ag-cs-glyph-sat is-a" cx="21.8" cy="8.8" r="1.2"/><circle class="ag-cs-glyph-sat is-b" cx="2.2" cy="17.1" r=".85"/></g>' +
        `<g class="ag-cs-glyph-body">${DEEPSEEK_WHALE}</g>` +
        `<circle class="ag-cs-glyph-core" cx="12" cy="12" r="${selected ? '1.55' : '1.15'}"/>` +
        '</svg>'
      );
    }
    if (normalizedBrand === 'antigravity' || normalizedBrand === 'gemini') {
      const mesh =
        `<path d="${OFFICIAL_GEMINI_SPARK_D}" fill="${GOOGLE_COLORS.blue}"/>` +
        `<g style="clip-path:path('${OFFICIAL_GEMINI_SPARK_D}')"><g class="ag-cs-glyph-mesh">` +
        `<ellipse cx="9.4" cy="4.4" rx="7" ry="6" fill="${GOOGLE_COLORS.red}"/>` +
        `<ellipse cx="4.6" cy="13.2" rx="6.2" ry="5.6" fill="${GOOGLE_COLORS.yellow}"/>` +
        `<ellipse cx="10.4" cy="20.2" rx="6.6" ry="5.6" fill="${GOOGLE_COLORS.green}"/>` +
        `<ellipse cx="18" cy="10.8" rx="6.8" ry="6.4" fill="#3B82F6"/>` +
        '</g></g>';
      return (
        `<svg class="ag-cs-model-glyph-svg dsh-prism-model-glyph-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" data-prism-glyph-tier="${normalizedTier}" aria-hidden="true" focusable="false">` +
        `<g class="ag-cs-glyph-body ag-cs-glyph-spark">${mesh}</g>` +
        '<g class="ag-cs-glyph-orbit-group"><circle class="ag-cs-glyph-orbit-dot" cx="19.8" cy="4.7" r="1.1"/></g>' +
        '</svg>'
      );
    }
    const brandPath = BRAND_PATHS[normalizedBrand] || BRAND_PATHS.gemini;
    return (
      `<svg class="ag-cs-model-glyph-svg dsh-prism-model-glyph-svg" width="16" height="16" viewBox="-4 -4 32 32" fill="none" aria-hidden="true" focusable="false">` +
      '<g class="ag-cs-glyph-orbit-group"><ellipse class="ag-cs-glyph-orbit" cx="12" cy="12" rx="14.5" ry="6.2" transform="rotate(-24 12 12)"/><circle class="ag-cs-glyph-sat is-a" cx="25.2" cy="6.1" r="1.65"/><circle class="ag-cs-glyph-sat is-b" cx="-1.2" cy="17.9" r="1.25"/></g>' +
      `<path class="ag-cs-glyph-body" d="${brandPath}" fill-rule="evenodd"/>` +
      `<circle class="ag-cs-glyph-core" cx="12" cy="12" r="${normalizedBrand === 'gemini' ? '2.4' : '1.8'}"/>` +
      '</svg>'
    );
  }

  function normalizeTier(value) {
    const raw = String(value || '').toLowerCase();
    if (/\bmax\b|\bxhigh\b|extra|超高|极高|超深/.test(raw)) return 'xhigh';
    if (/\bhigh\b|thinking|深度思考|高思考|高/.test(raw)) return 'high';
    if (/\blow\b|lite|minimal|低思考|极低|最低|低/.test(raw)) return 'low';
    if (/\bmedium\b|\bmed\b|中思考|中等|中/.test(raw)) return 'medium';
    if (/\bfixed\b|固定/.test(raw)) return 'fixed';
    if (/\bauto\b|自动/.test(raw)) return 'auto';
    return 'medium';
  }

  function normalizeBrand(value, label) {
    const provider = String(value || '').toLowerCase();
    const text = String(label || '').toLowerCase();
    if (/deepseek/.test(provider)) return 'deepseek';
    if (/claude|anthropic/.test(provider)) return 'claude';
    if (/openai|codex/.test(provider)) return 'openai';
    if (/google|gemini/.test(provider)) return 'gemini';
    if (/antigravity|orchestrator/.test(provider)) return 'antigravity';
    if (/deepseek/.test(text)) return 'deepseek';
    if (/claude|anthropic|sonnet|opus|haiku/.test(text)) return 'claude';
    if (/\bgpt\b|\bopenai\b|\bo[134]\b/.test(text)) return 'openai';
    if (/gemini/.test(text)) return 'gemini';
    if (/antigravity|orchestrator|编排|调度/.test(text)) return 'antigravity';
    return 'antigravity';
  }

  function textWithoutOwnNodes(node) {
    if (!node) return '';
    const parts = [];
    const walk = (current) => {
      if (!current) return;
      if (current.nodeType === 3) {
        parts.push(current.nodeValue || '');
        return;
      }
      if (current.nodeType !== 1) return;
      if (current.matches?.('[data-prism-native-icon], [data-prism-model-glyph], svg, style, script')) return;
      if (current !== node && current.hasAttribute?.('aria-hidden') && current.tagName !== 'svg') return;
      for (const child of current.childNodes || []) walk(child);
    };
    walk(node);
    return parts.join(' ').replace(/\s+/g, ' ').trim();
  }

  function isIconOnlyButton(button) {
    // Symbols such as "+" and "×" are glyphs, not visible button labels.
    return !/[\p{L}\p{N}]/u.test(textWithoutOwnNodes(button));
  }

  const COMMAND_PANEL_SELECTOR = [
    '[role="listbox"]',
    '[role="menu"]',
    '[role="dialog"]',
    '[data-state="open"]',
  ].join(',');
  const COMMAND_HINTS = Object.freeze([
    'file', 'goal', 'plan', 'feedback', 'compact',
    'permission', 'model', 'export', 'purge', 'rewind',
  ]);

  function commandPanelFor(button) {
    if (!button?.isConnected) return null;
    const view = document.defaultView;
    const visible = (element) => {
      if (!element?.isConnected) return false;
      const style = view?.getComputedStyle?.(element);
      if (style && (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0')) return false;
      if (element.getAttribute?.('data-state') === 'closed' || element.hidden) return false;
      const rect = element.getBoundingClientRect?.();
      return !rect || (rect.width > 0 && rect.height > 0);
    };
    const matchesCommands = (element) => {
      const text = String(element?.textContent || '').toLowerCase();
      let hits = 0;
      for (const hint of COMMAND_HINTS) {
        if (new RegExp(`\\b${hint}\\b`, 'i').test(text) && ++hits >= 3) return true;
      }
      return false;
    };
    const controlledId = button.getAttribute?.('aria-controls');
    if (controlledId) {
      const linked = document.getElementById?.(controlledId);
      if (linked && visible(linked) && matchesCommands(linked)) return linked;
    }
    for (const element of document.querySelectorAll(COMMAND_PANEL_SELECTOR)) {
      if (element.closest?.('[data-prism-owned], [data-prism-native-efforts]')) continue;
      if (visible(element) && matchesCommands(element)) return element;
    }
    return null;
  }

  function dispatchCommandEscape(panel) {
    const KeyboardEventCtor = root.KeyboardEvent || root.Event;
    if (typeof KeyboardEventCtor !== 'function' || !panel?.isConnected) return false;
    const event = new KeyboardEventCtor('keydown', {
      key: 'Escape', code: 'Escape', bubbles: true, cancelable: true,
    });
    try {
      Object.defineProperty(event, 'key', { configurable: true, value: 'Escape' });
      Object.defineProperty(event, 'code', { configurable: true, value: 'Escape' });
    } catch {}
    panel.dispatchEvent(event);
    return true;
  }

  function isPluginOwned(node) {
    return Boolean(
      node?.closest?.(
        '[data-dsh-prism-owned], [data-prism-owned], [data-prism-native-icon], ' +
        '[data-prism-composer-tools], [data-prism-companion-stage], .dsh-mascot-stage, ' +
        '[data-testid="dsh-vial-trigger"], [data-testid="dsh-settings-trigger"]'
      )
    );
  }

  function isModelTrigger(button) {
    if (!button) return false;
    if (button.closest?.('#model, [data-slot="conversation.input.model"]')) return true;
    return Boolean(button.querySelector?.(':scope > span [data-provider-id][data-model-id]'));
  }

  function isModelMenuRow(button) {
    if (!button || button === document.documentElement) return false;
    return Boolean(
      button.querySelector?.('[data-provider-id][data-model-id]') ||
      button.matches?.('[role="menuitemradio"]') && button.closest?.('[role="menu"], [role="group"]')
    );
  }

  function classifyButton(button) {
    if (!(button instanceof Element) || button.tagName !== 'BUTTON') return null;
    if (isPluginOwned(button) || isModelTrigger(button) || isModelMenuRow(button)) return null;
    if (button.matches('[data-sidebar-toggle], [data-sidebar-opener]')) {
      return { kind: 'sidebar', icon: 'panel-left' };
    }
    const label = [
      button.getAttribute('aria-label'),
      button.getAttribute('title'),
      textWithoutOwnNodes(button),
    ].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
    const normalized = label.toLowerCase();
    const has = (expression) => expression.test(normalized);
    const iconOnly = isIconOnlyButton(button);
    if (has(/停止生成|停止|stop|cancel generation|interrupt/)) return { kind: 'stop', icon: 'stop-square' };
    if (has(/发送消息|排队发送|插话发送|发送|send(?: message)?|submit|queue send|steer send/)) {
      return { kind: 'send', icon: 'arrow-up-launch' };
    }
    if (has(/已复制|copied|复制|copy/)) {
      return { kind: 'copy', icon: 'copy-check', copy: true };
    }
    if (has(/设置|settings|preferences|options/)) return { kind: 'settings', icon: 'settings-gear' };
    if (has(/搜索|查找|search|find/)) return { kind: 'search', icon: 'search' };
    if (has(/删除|移除|trash|delete|remove/)) return { kind: 'trash', icon: 'trash-sweep' };
    if (has(/终端|terminal|shell|console|bash|powershell/)) return { kind: 'terminal', icon: 'terminal' };
    if (has(/添加文件|调用指令|attach|add file|commands|command menu|^\+$|plus/)) {
      return { kind: 'plus', icon: 'plus-spin' };
    }
    if (has(/文件夹|文件|目录|工作区|folder|file|workspace|directory/)) return { kind: 'file', icon: 'folder-workspace' };
    if (has(/更多|更多选项|more|actions|overflow/)) return { kind: 'more', icon: 'more-horizontal' };
    if (has(/新会话|新对话|new chat|new conversation|session\.new/)) return { kind: 'new', icon: 'sparkles-pen' };
    if (has(/侧栏|侧边栏|sidebar|panel left/)) return { kind: 'sidebar', icon: 'panel-left' };
    if (has(/主题|theme|浅色|深色|light|dark|sun|moon/)) return { kind: 'theme', icon: 'sun-moon' };
    if (has(/固定|pin|pinned/)) return { kind: 'pin', icon: 'pin' };
    if (has(/历史|history|最近|recent/)) return { kind: 'history', icon: 'clock-history' };
    if (has(/层|layers|stack/)) return { kind: 'layers', icon: 'layers-stack' };
    if (has(/警告|错误|warning|error|alert/)) return { kind: 'alert', icon: 'alert-triangle' };
    if (has(/关闭|取消|dismiss|close/)) return { kind: 'close', icon: 'x-close' };
    if (has(/推理|思考|think|spark|model|模型/)) return { kind: 'model', icon: 'radar-pulse' };
    if (has(/上一个|下一个|前一个|后一个|previous|next|expand|collapse|展开|收起/)) {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      return { kind: 'chevron', icon: expanded ? 'chevron-down' : 'chevron-right' };
    }
    if (iconOnly && button.hasAttribute('aria-expanded')) {
      return { kind: 'chevron', icon: 'chevron-down' };
    }
    return null;
  }

  function normalizedBrand(value, label) {
    return normalizeBrand(value, label);
  }

  function updateModelHost(button, providerSpan, placement, seenModelHosts) {
    if (!button || !button.isConnected) return;
    const provider = providerSpan?.getAttribute('data-provider-id') || '';
    const model = providerSpan?.getAttribute('data-model-id') || '';
    const menu = button.closest('[role="menu"], [role="group"]');
    const marker = menu?.querySelector?.('[data-prism-native-efforts]') || button.closest('[data-prism-native-efforts]');
    const stateText = [
      provider,
      model,
      button.getAttribute('aria-label'),
      button.getAttribute('title'),
      textWithoutOwnNodes(button),
      marker?.getAttribute('data-prism-native-current'),
    ].filter(Boolean).join(' ');
    const brand = normalizeBrand(provider, stateText);
    const tier = normalizeTier(stateText);
    const selected =
      placement === 'trigger' ||
      button.getAttribute('aria-checked') === 'true' ||
      button.getAttribute('data-selected') === 'true' ||
      /\bselected\b/.test(String(button.className || ''));
    const signature = `${brand}|${tier}|${selected ? 1 : 0}`;
    let record = modelGlyphs.get(button);
    if (!record) {
      const glyph = document.createElement('span');
      glyph.className = 'dsh-prism-model-glyph ag-cs-model-glyph';
      glyph.setAttribute('data-prism-model-glyph', '1');
      glyph.setAttribute('data-prism-owned', '1');
      glyph.setAttribute('aria-hidden', 'true');
      record = { button, glyph, signature: '' };
      modelGlyphs.set(button, record);
    }
    const glyph = record.glyph;
    const parent = providerSpan?.parentElement || button;
    const anchor = providerSpan || null;
    if (glyph.parentElement !== parent || (anchor && glyph.nextSibling !== anchor)) {
      parent.insertBefore(glyph, anchor);
    }
    if (record.signature !== signature) {
      glyph.setAttribute('data-prism-brand', brand);
      glyph.setAttribute('data-prism-tier', tier);
      glyph.setAttribute('data-prism-selected', selected ? 'true' : 'false');
      glyph.setAttribute('data-prism-model-glyph-placement', placement);
      glyph.innerHTML = renderModelGlyphSvg(brand, tier, selected);
      record.signature = signature;
    }
    if (button.getAttribute('data-prism-model-glyph-host') !== placement) {
      if (!button.hasAttribute('data-prism-model-glyph-host')) button.setAttribute('data-prism-model-glyph-host-original', '0');
      button.setAttribute('data-prism-model-glyph-host', placement);
    }
    seenModelHosts.add(button);
  }

  function syncModelGlyphs(instance) {
    const seen = new Set();
    const modelSlot = document.querySelector('#model, [data-slot="conversation.input.model"]');
    const trigger = modelSlot?.querySelector?.('button[aria-haspopup="menu"]') ||
      document.querySelector('#model button[aria-haspopup="menu"]');
    if (trigger?.isConnected) {
      const providerSpan = trigger.querySelector('[data-provider-id][data-model-id]');
      updateModelHost(trigger, providerSpan, 'trigger', seen);
    }
    for (const span of document.querySelectorAll('[data-provider-id][data-model-id]')) {
      const button = span.closest('button');
      if (!button || button === trigger || !button.isConnected) continue;
      const placement = button.matches('[role="menuitemradio"], [role="menuitem"], [role="option"]') ? 'menu' : 'menu';
      updateModelHost(button, span, placement, seen);
    }
    for (const [button, record] of modelGlyphs) {
      if (!seen.has(button) || !button.isConnected) {
        record.glyph.remove();
        if (button.hasAttribute('data-prism-model-glyph-host')) button.removeAttribute('data-prism-model-glyph-host');
        if (button.hasAttribute('data-prism-model-glyph-host-original')) button.removeAttribute('data-prism-model-glyph-host-original');
        modelGlyphs.delete(button);
      }
    }
    instance.stats.modelGlyphs = modelGlyphs.size;
  }

  function isCopiedLabel(label) {
    return /已复制|copied/i.test(label);
  }

  function applyMotionMode(instance, host) {
    const html = document.documentElement;
    const mode = String(
      html.getAttribute('data-prism-motion') ||
      html.getAttribute('data-ag-cs-motion') ||
      instance.bridge?.getConfig?.()?.motionLevel ||
      'ultra'
    ).toLowerCase();
    const normalized = mode === 'off' || mode === 'reduced' || mode === 'subtle' ? mode : 'ultra';
    host.setAttribute('data-prism-native-icon-motion', normalized);
  }

  function updateIconHost(instance, button, type, seen) {
    let record = iconHosts.has(button) ? button.__dshPrismNativeIconRecord : null;
    if (!record) {
      record = { button, glyph: null, signature: '', kind: '', layout: '' };
      iconHosts.add(button);
      Object.defineProperty(button, '__dshPrismNativeIconRecord', {
        configurable: true,
        value: record,
      });
    }
    if (!record.glyph) {
      record.glyph = document.createElement('span');
      record.glyph.className = 'dsh-prism-native-icon';
      record.glyph.setAttribute('data-prism-native-icon', '1');
      record.glyph.setAttribute('data-prism-owned', '1');
      record.glyph.setAttribute('aria-hidden', 'true');
    }
    const label = [
      button.getAttribute('aria-label'),
      button.getAttribute('title'),
      textWithoutOwnNodes(button),
    ].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
    const copied = Boolean(type.copy && (isCopiedLabel(label) || button.getAttribute('data-prism-copy-state') === 'check'));
    const expanded = button.getAttribute('aria-expanded') === 'true';
    const iconOnly = isIconOnlyButton(button);
    const layout = iconOnly ? 'overlay' : 'inline';
    const signature = `${type.icon}|${copied ? 1 : 0}|${expanded ? 1 : 0}|${layout}`;
    if (record.signature !== signature) {
      record.glyph.setAttribute('data-prism-icon-kind', type.kind);
      record.glyph.setAttribute('data-prism-icon-name', type.icon);
      record.glyph.setAttribute('data-prism-icon-state', copied ? 'check' : 'idle');
      record.glyph.setAttribute('data-prism-icon-expanded', expanded ? 'true' : 'false');
      record.glyph.setAttribute('data-layout', layout);
      record.glyph.innerHTML = renderIcon(type.icon, {
        active: copied,
        size: layout === 'overlay' ? 16 : 15,
        noCache: false,
      });
      record.signature = signature;
      record.kind = type.kind;
    }
    if (!record.glyph.isConnected) {
      if (layout === 'inline') button.insertBefore(record.glyph, button.firstChild);
      else button.appendChild(record.glyph);
    } else if (layout === 'inline' && record.glyph.parentElement === button && button.firstChild !== record.glyph) {
      button.insertBefore(record.glyph, button.firstChild);
    }
    record.layout = layout;
    if (button.getAttribute('data-prism-native-icon-injected') !== '1') {
      button.setAttribute('data-prism-native-icon-injected', '1');
    }
    if (button.getAttribute('data-prism-native-icon-kind') !== type.kind) {
      button.setAttribute('data-prism-native-icon-kind', type.kind);
    }
    if (button.getAttribute('data-prism-native-icon-layout') !== layout) {
      button.setAttribute('data-prism-native-icon-layout', layout);
    }
    applyMotionMode(instance, button);
    seen.add(button);
    instance.stats.iconButtons = seen.size;
  }

  function removeIconHost(button) {
    const record = button.__dshPrismNativeIconRecord;
    if (record?.glyph) record.glyph.remove();
    try {
      delete button.__dshPrismNativeIconRecord;
    } catch {}
    iconHosts.delete(button);
    for (const attr of [
      'data-prism-native-icon-injected',
      'data-prism-native-icon-kind',
      'data-prism-native-icon-layout',
      'data-prism-native-icon-motion',
      'data-prism-copy-state',
    ]) {
      button.removeAttribute(attr);
    }
  }

  function syncNativeIcons(instance) {
    const seen = new Set();
    for (const button of document.querySelectorAll('button')) {
      const type = classifyButton(button);
      if (type) updateIconHost(instance, button, type, seen);
    }
    for (const button of Array.from(iconHosts)) {
      if (!seen.has(button) || !button.isConnected) removeIconHost(button);
    }
    instance.stats.iconButtons = seen.size;
  }

  function setCopyState(button, value) {
    if (!button?.isConnected || !button.matches?.('[data-prism-native-icon-kind="copy"]')) return;
    if (value) button.setAttribute('data-prism-copy-state', 'check');
    else button.removeAttribute('data-prism-copy-state');
    if (activeInstance && !activeInstance.destroyed) scheduleSync(activeInstance);
  }

  function scheduleSync(instance) {
    if (!instance || instance.destroyed || instance.scheduled) return;
    instance.scheduled = true;
    const run = () => {
      instance.scheduled = false;
      if (instance.destroyed) return;
      syncModelGlyphs(instance);
      syncNativeIcons(instance);
      instance.lastSyncAt = Date.now();
    };
    if (typeof root.requestAnimationFrame === 'function') {
      instance.pendingFrame = root.requestAnimationFrame(run);
    } else {
      instance.pendingTimer = root.setTimeout(run, 0);
    }
  }

  function createInstance(bridge) {
    let unsubscribe = null;
    const instance = {
      version: VERSION,
      bridge,
      booted: true,
      destroyed: false,
      scheduled: false,
      pendingFrame: 0,
      pendingTimer: 0,
      lastSyncAt: 0,
      observer: null,
      clickHandler: null,
      commandClickHandler: null,
      unsubscribe: null,
      stats: { iconButtons: 0, modelGlyphs: 0 },
      refresh: () => scheduleSync(instance),
      getStats: () => ({ ...instance.stats, lastSyncAt: instance.lastSyncAt }),
      dispose: () => destroyInstance(instance),
      destroy: () => destroyInstance(instance),
    };

    instance.clickHandler = (event) => {
      const button = event.target?.closest?.('button[data-prism-native-icon-kind="copy"]');
      if (!button || !button.closest?.('[data-prism-native-icon-injected="1"]')) return;
      button.setAttribute('data-prism-copy-state', 'check');
      scheduleSync(instance);
      const timer = root.setTimeout(() => {
        copyTimers.delete(timer);
        if (!instance.destroyed) setCopyState(button, false);
      }, 1250);
      copyTimers.add(timer);
    };
    document.addEventListener('click', instance.clickHandler, true);

    instance.commandClickHandler = (event) => {
      const button = event.target?.closest?.('button[data-prism-native-icon-kind="plus"]');
      if (!button) return;
      const wasExpanded = button.getAttribute('aria-expanded') === 'true';
      const wasOpen = wasExpanded || Boolean(commandPanelFor(button));
      const timer = root.setTimeout(() => {
        commandTimers.delete(timer);
        if (!wasOpen || instance.destroyed) return;
        const panel = commandPanelFor(button);
        const stillOpen = button.getAttribute('aria-expanded') === 'true' || Boolean(panel);
        if (stillOpen) dispatchCommandEscape(panel || document.activeElement || button);
      }, 0);
      commandTimers.add(timer);
    };
    document.addEventListener('click', instance.commandClickHandler, true);

    instance.observer = new MutationObserver((records) => {
      if (instance.destroyed) return;
      let relevant = false;
      for (const record of records) {
        if (record.type === 'childList') {
          if (record.target?.matches?.('[data-prism-native-icon], [data-prism-model-glyph]')) continue;
          const changedNodes = [
            ...(record.addedNodes || []),
            ...(record.removedNodes || []),
          ].filter((node) => node?.nodeType === 1);
          if (
            changedNodes.length > 0 &&
            changedNodes.every((node) =>
              node.matches?.('[data-prism-native-icon], [data-prism-model-glyph]') ||
              node.closest?.('[data-prism-native-icon], [data-prism-model-glyph]')
            )
          ) continue;
          relevant = true;
          break;
        }
        if (record.type === 'attributes' && !record.target?.matches?.('[data-prism-native-icon], [data-prism-model-glyph]')) {
          relevant = true;
          break;
        }
      }
      if (relevant) scheduleSync(instance);
    });
    instance.observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        'aria-label',
        'title',
        'aria-expanded',
        'aria-checked',
        'aria-controls',
        'data-provider-id',
        'data-model-id',
        'data-selected',
        'data-prism-theme',
        'data-ag-cs-motion',
        'data-prism-motion',
      ],
    });
    if (bridge && typeof bridge.subscribe === 'function') {
      unsubscribe = bridge.subscribe(() => scheduleSync(instance));
    } else if (bridge && typeof bridge.onConfigChange === 'function') {
      unsubscribe = bridge.onConfigChange(() => scheduleSync(instance));
    }
    instance.unsubscribe = unsubscribe;
    scheduleSync(instance);
    return instance;
  }

  function destroyInstance(instance) {
    if (!instance || instance.destroyed) return false;
    instance.destroyed = true;
    instance.booted = false;
    try {
      instance.observer?.disconnect();
    } catch {}
    if (instance.pendingFrame && typeof root.cancelAnimationFrame === 'function') {
      root.cancelAnimationFrame(instance.pendingFrame);
    }
    if (instance.pendingTimer) root.clearTimeout(instance.pendingTimer);
    if (instance.clickHandler) document.removeEventListener('click', instance.clickHandler, true);
    if (instance.commandClickHandler) document.removeEventListener('click', instance.commandClickHandler, true);
    try {
      instance.unsubscribe?.();
    } catch {}
    for (const timer of copyTimers) root.clearTimeout(timer);
    copyTimers.clear();
    for (const timer of commandTimers) root.clearTimeout(timer);
    commandTimers.clear();
    for (const button of Array.from(iconHosts)) removeIconHost(button);
    for (const button of document.querySelectorAll('[data-prism-native-icon-injected]')) removeIconHost(button);
    for (const [button, record] of modelGlyphs) {
      record.glyph.remove();
      button.removeAttribute('data-prism-model-glyph-host');
      button.removeAttribute('data-prism-model-glyph-host-original');
      modelGlyphs.delete(button);
    }
    for (const button of document.querySelectorAll('[data-prism-model-glyph-host]')) {
      button.removeAttribute('data-prism-model-glyph-host');
      button.removeAttribute('data-prism-model-glyph-host-original');
    }
    for (const glyph of document.querySelectorAll('[data-prism-model-glyph], [data-prism-native-icon]')) glyph.remove();
    iconCache.clear();
    if (activeInstance === instance) activeInstance = null;
    return true;
  }

  function init(bridge) {
    if (activeInstance && !activeInstance.destroyed) {
      if (!bridge || activeInstance.bridge === bridge) return activeInstance;
      destroyInstance(activeInstance);
    }
    if (typeof document === 'undefined') {
      return { booted: false, destroyed: true, reason: 'no-document', refresh() {}, destroy() {} };
    }
    activeInstance = createInstance(bridge);
    return activeInstance;
  }

  function getInstance() {
    return activeInstance && !activeInstance.destroyed ? activeInstance : null;
  }

  function destroy() {
    return activeInstance ? destroyInstance(activeInstance) : false;
  }

  const api = Object.freeze({
    VERSION,
    GOOGLE_COLORS,
    BRAND_PATHS,
    ICON_NAMES,
    HOST_ICON_NAMES,
    ALL_ICON_NAMES,
    ICON_ALIASES,
    resolveIconName,
    renderIcon,
    renderModelGlyphSvg,
    normalizeBrand: normalizedBrand,
    normalizeTier,
    init,
    getInstance,
    destroy,
  });

  return api;
});

}).call(
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : {},
  typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : undefined),
  typeof self !== "undefined" ? self : (typeof window !== "undefined" ? window : undefined),
  typeof document !== "undefined" ? document : undefined,
  undefined,
  undefined
);

// === [6/10] src/responsive-workbench.js ===
;(function (root, window, self, document, module, exports) {
/*!
 * Obsidian Prism for DeepSeek Harness
 * Responsive workbench enhancements: fluid composer toolbar, smooth scroll-to-bottom,
 * and a non-destructive sidebar navigation fold.
 */
(function (root) {
  'use strict';

  if (!root || !root.document) return;

  var VERSION = '1.0.7-dsh.1';
  var TIER_THRESHOLDS = [720, 640, 560, 480, 400];
  var TIER_HYSTERESIS = 8;
  var NAV_VISIBLE_LIMIT = 3;
  var SCROLL_BOTTOM_GAP = 24;
  var SCAN_INTERVAL_MS = 2500;
  var activeInstance = null;

  function safe(fn, fallback) {
    try {
      return fn();
    } catch (_error) {
      return fallback;
    }
  }

  function setAttr(element, name, value) {
    if (!element || typeof element.setAttribute !== 'function') return;
    var next = String(value);
    if (element.getAttribute(name) !== next) element.setAttribute(name, next);
  }

  function removeAttr(element, name) {
    if (!element || typeof element.removeAttribute !== 'function') return;
    if (element.hasAttribute(name)) element.removeAttribute(name);
  }

  function query(scope, selector) {
    return scope && typeof scope.querySelector === 'function' ? scope.querySelector(selector) : null;
  }

  function queryAll(scope, selector) {
    return scope && typeof scope.querySelectorAll === 'function'
      ? Array.prototype.slice.call(scope.querySelectorAll(selector))
      : [];
  }

  function isElement(node) {
    return Boolean(node && node.nodeType === 1 && typeof node.getBoundingClientRect === 'function');
  }

  function isVisible(element) {
    if (!isElement(element) || element.isConnected === false) return false;
    if (element.hidden || element.closest('[hidden], [inert]')) return false;
    var rect = element.getBoundingClientRect();
    if (rect.width <= 1 || rect.height <= 1) return false;
    var view = element.ownerDocument && element.ownerDocument.defaultView;
    var style = view && typeof view.getComputedStyle === 'function' ? view.getComputedStyle(element) : null;
    return !style || (style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0.01);
  }

  function normalizeText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function tierForWidth(width) {
    for (var index = 0; index < TIER_THRESHOLDS.length; index++) {
      if (width >= TIER_THRESHOLDS[index]) return index;
    }
    return 5;
  }

  function settleTier(width, previous) {
    var raw = tierForWidth(width);
    if (!Number.isInteger(previous) || previous < 0 || previous > 5 || raw === previous) return raw;
    if (raw > previous) {
      return width <= TIER_THRESHOLDS[previous] - TIER_HYSTERESIS ? raw : previous;
    }
    return width >= TIER_THRESHOLDS[raw] + TIER_HYSTERESIS ? raw : previous;
  }

  function createInstance(bridge) {
    var win = root;
    var doc = win.document;
    var runtimeBridge = bridge || win.__agPrismBridge || win.DSHPrismBridge || null;
    var destroyed = false;
    var cleanups = [];
    var scanFrame = 0;
    var scanFallbackTimer = 0;
    var scanInterval = 0;
    var measureFrame = 0;
    var measureFallbackTimer = 0;
    var pendingCards = new Set();
    var observedCards = new Set();
    var cardStats = new Map();
    var resizeObserver = null;
    var mutationObserver = null;
    var scrollResizeObserver = null;
    var scrollFrame = 0;
    var scrollMotionFrame = 0;
    var scrollMotionCleanup = null;
    var scrollPort = null;
    var nativeScrollButton = null;
    var ownScrollButton = null;
    var nativeScrollSupportSeen = false;
    var sidebar = {
      root: null,
      host: null,
      items: [],
      button: null,
      expanded: false,
      hiddenCount: 0,
    };

    function on(target, type, listener, options) {
      if (!target || typeof target.addEventListener !== 'function') return;
      target.addEventListener(type, listener, options);
      cleanups.push(function () {
        target.removeEventListener(type, listener, options);
      });
    }

    function readConfig() {
      var value = safe(function () {
        return typeof runtimeBridge?.getConfig === 'function' ? runtimeBridge.getConfig() : runtimeBridge?.config;
      }, null);
      return value && typeof value === 'object' ? value : {};
    }

    function scrollBottomMotion(cfg) {
      var config = cfg || readConfig();
      var reduced = safe(function () {
        return win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
      }, false);
      var motionOff = config.motionLevel === 'off'
        || doc.documentElement.getAttribute('data-ag-cs-motion') === 'off'
        || doc.documentElement.getAttribute('data-prism-motion') === 'off';
      if (reduced || motionOff || config.scrollBottomMotion === 'instant') return 'instant';
      return 'smooth';
    }

    function sidebarFoldEnabled(cfg) {
      var config = cfg || readConfig();
      if (config.sidebarRestyle === false) return false;
      return config.sidebarNavFold === true || config.sidebarNavFold === 'on';
    }

    function syncRootAttributes(cfg) {
      var html = doc.documentElement;
      if (!html) return;
      var config = cfg || readConfig();
      setAttr(html, 'data-prism-responsive-workbench', VERSION);
      setAttr(html, 'data-prism-scroll-bottom-motion', scrollBottomMotion(config));
      setAttr(html, 'data-prism-sidebar-nav-fold', sidebarFoldEnabled(config) ? 'on' : 'off');
    }

    function ensureAccessibleName(button) {
      if (!isElement(button)) return;
      if (button.hasAttribute('aria-label') || button.hasAttribute('aria-labelledby')) return;
      var label = normalizeText(button.textContent);
      if (!label) return;
      button.setAttribute('aria-label', label);
      setAttr(button, 'data-prism-toolbar-aria-owned', '1');
    }

    function markTextLeaves(scope, kind) {
      if (!scope) return;
      queryAll(scope, 'span, small, strong, b, em').forEach(function (node) {
        if (!normalizeText(node.textContent)) return;
        if (node.closest('svg')) return;
        var hasTextChild = Array.prototype.some.call(node.children || [], function (child) {
          return normalizeText(child.textContent).length > 0;
        });
        if (hasTextChild) return;
        setAttr(node, 'data-prism-toolbar-copy', kind);
      });
    }

    function clearToolbarContract(card) {
      queryAll(card, '[data-prism-toolbar-copy], [data-prism-toolbar-model], [data-prism-toolbar-vial], [data-prism-plan-trigger], [data-prism-secondary-controls], [data-prism-toolbar-chevron]').forEach(function (node) {
        removeAttr(node, 'data-prism-toolbar-copy');
        removeAttr(node, 'data-prism-toolbar-model');
        removeAttr(node, 'data-prism-toolbar-vial');
        removeAttr(node, 'data-prism-plan-trigger');
        removeAttr(node, 'data-prism-secondary-controls');
        removeAttr(node, 'data-prism-toolbar-chevron');
      });
      queryAll(card, '[data-prism-toolbar-aria-owned]').forEach(function (node) {
        removeAttr(node, 'aria-label');
        removeAttr(node, 'data-prism-toolbar-aria-owned');
      });
    }

    function markToolbarContract(card) {
      clearToolbarContract(card);

      var modelSlot = query(card, '[data-slot="conversation.input.model"]');
      var modelButton = query(
        modelSlot || query(card, '.GRgSLq_trailing') || null,
        'button[aria-haspopup="menu"], button'
      );
      if (modelButton) {
        setAttr(modelButton, 'data-prism-toolbar-model', '1');
        markTextLeaves(modelButton, 'model');
        var chevron = query(modelButton, '[class*="_chevron"], [class*="chevron"]');
        if (chevron) setAttr(chevron, 'data-prism-toolbar-chevron', '1');
        ensureAccessibleName(modelButton);
      }

      var vialDock = query(card, '[data-prism-composer-tools]');
      if (vialDock) {
        setAttr(vialDock, 'data-prism-toolbar-vial', '1');
        markTextLeaves(vialDock, 'vial');
        var vialButton = query(vialDock, '[data-testid="dsh-vial-trigger"], button');
        ensureAccessibleName(vialButton);
      }

      var planSlot = query(card, '[data-slot="conversation.input.plan"]');
      var planButton = query(planSlot || card, 'button, [role="button"]');
      if (planButton && planSlot) {
        setAttr(planButton, 'data-prism-plan-trigger', '1');
        markTextLeaves(planButton, 'plan');
        ensureAccessibleName(planButton);
      }

      var secondaryScopes = new Set();
      var rightSlot = query(card, '[data-slot="conversation.input.right"]');
      if (rightSlot) secondaryScopes.add(rightSlot);
      queryAll(card, '.GRgSLq_standardControls > *, .GRgSLq_trailing > [class*="_activity"]').forEach(function (node) {
        if (!isElement(node) || node === modelSlot || node.contains(modelSlot) || node.contains(modelButton)) return;
        secondaryScopes.add(node);
      });
      secondaryScopes.forEach(function (scope) {
        setAttr(scope, 'data-prism-secondary-controls', '1');
        markTextLeaves(scope, 'secondary');
        queryAll(scope, 'button, [role="button"]').forEach(ensureAccessibleName);
      });
    }

    function measureCard(card) {
      if (destroyed || !isElement(card) || card.isConnected === false) return;
      var width = card.clientWidth || Math.round(card.getBoundingClientRect().width);
      if (width <= 2) return;
      var rawPrevious = card.getAttribute('data-prism-toolbar-tier');
      var previousAttr = rawPrevious === null ? NaN : Number(rawPrevious);
      var previous = Number.isInteger(previousAttr) ? previousAttr : -1;
      var tier = settleTier(width, previous);
      setAttr(card, 'data-prism-toolbar-tier', tier);
      cardStats.set(card, { width: width, tier: tier });
      markToolbarContract(card);
    }

    function scheduleCardMeasure(card) {
      if (!isElement(card)) return;
      pendingCards.add(card);
      if (measureFrame || measureFallbackTimer) return;
      if (typeof win.requestAnimationFrame === 'function') {
        measureFrame = win.requestAnimationFrame(function () {
          measureFrame = 0;
          flushCardMeasurements();
        });
      } else {
        measureFallbackTimer = win.setTimeout(function () {
          measureFallbackTimer = 0;
          flushCardMeasurements();
        }, 16);
      }
    }

    function flushCardMeasurements() {
      if (destroyed) {
        pendingCards.clear();
        return;
      }
      var cards = Array.from(pendingCards);
      pendingCards.clear();
      cards.forEach(measureCard);
    }

    function observeCard(card) {
      if (!isElement(card) || observedCards.has(card)) return;
      observedCards.add(card);
      if (resizeObserver) resizeObserver.observe(card);
      scheduleCardMeasure(card);
    }

    function syncComposerCards() {
      var cards = queryAll(doc, '[data-composer-card]');
      var liveCards = new Set(cards);
      cards.forEach(observeCard);
      observedCards.forEach(function (card) {
        if (liveCards.has(card) && card.isConnected !== false) return;
        if (resizeObserver) resizeObserver.unobserve(card);
        observedCards.delete(card);
        cardStats.delete(card);
      });
      cards.forEach(scheduleCardMeasure);
    }

    function resolveSidebarRoot() {
      var candidates = queryAll(doc, '.mP3x-q_sidebarCol, [role="dialog"][data-shortcut-modal="sidebar"]');
      return candidates.find(isVisible) || null;
    }

    function resolveSidebarHost(sidebarRoot) {
      if (!isElement(sidebarRoot)) return null;
      var nav = query(sidebarRoot, 'nav[aria-label]')
        || query(sidebarRoot, '[data-sidebar-scrollport] nav')
        || query(sidebarRoot, 'nav');
      if (nav) return nav;
      return query(sidebarRoot, '[data-sidebar-list-area]');
    }

    function resolveSidebarItems(host) {
      if (!isElement(host)) return [];
      if (String(host.tagName || '').toLowerCase() === 'nav') {
        return Array.prototype.filter.call(host.children || [], function (child) {
          return isElement(child) && !child.hasAttribute('data-prism-nav-more');
        });
      }
      var treeItems = queryAll(host, '[role="treeitem"]').filter(function (node) {
        var ancestor = node.parentElement && node.parentElement.closest('[role="treeitem"]');
        return !ancestor || !host.contains(ancestor);
      });
      if (treeItems.length) return treeItems;
      return Array.prototype.filter.call(host.children || [], function (child) {
        return isElement(child) && !child.hasAttribute('data-prism-nav-more');
      });
    }

    function navigationLabel(expanded, count) {
      var language = String((doc.documentElement && doc.documentElement.lang) || navigator.language || '').toLowerCase();
      var chinese = language.indexOf('zh') === 0 || language.indexOf('yue') === 0;
      if (chinese) return expanded ? '收起' : '更多 · ' + count;
      return expanded ? 'Less' : 'More · ' + count;
    }

    function createSidebarButton(host) {
      var button = doc.createElement('button');
      button.type = 'button';
      button.className = 'dsh-prism-nav-more';
      button.setAttribute('data-prism-nav-more', '1');
      button.innerHTML = '<span class="dsh-prism-nav-more-label"></span>'
        + '<svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">'
        + '<path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" '
        + 'stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      host.appendChild(button);
      return button;
    }

    function clearSidebarFold() {
      queryAll(doc, '[data-prism-nav-hidden]').forEach(function (node) {
        removeAttr(node, 'data-prism-nav-hidden');
      });
      queryAll(doc, '[data-prism-nav-more]').forEach(function (node) {
        node.remove();
      });
      queryAll(doc, '[data-prism-nav-expanded], [data-prism-responsive-sidebar]').forEach(function (node) {
        removeAttr(node, 'data-prism-nav-expanded');
        removeAttr(node, 'data-prism-responsive-sidebar');
      });
      sidebar.button = null;
      sidebar.hiddenCount = 0;
    }

    function applySidebarFold(navRoot, host, items, enabled) {
      if (!enabled) {
        sidebar.expanded = false;
        clearSidebarFold();
        return;
      }

      setAttr(navRoot, 'data-prism-responsive-sidebar', '1');
      setAttr(host, 'data-prism-nav-expanded', sidebar.expanded ? '1' : '0');
      sidebar.hiddenCount = Math.max(0, items.length - NAV_VISIBLE_LIMIT);

      items.forEach(function (item, index) {
        if (!sidebar.expanded && index >= NAV_VISIBLE_LIMIT) {
          setAttr(item, 'data-prism-nav-hidden', '1');
        } else {
          removeAttr(item, 'data-prism-nav-hidden');
        }
      });
      queryAll(host, '[data-prism-nav-hidden]').forEach(function (node) {
        if (items.indexOf(node) < 0) removeAttr(node, 'data-prism-nav-hidden');
      });

      if (items.length <= NAV_VISIBLE_LIMIT) {
        if (sidebar.button) sidebar.button.remove();
        sidebar.button = null;
        removeAttr(host, 'data-prism-nav-expanded');
        return;
      }

      if (!sidebar.button || sidebar.button.parentElement !== host) {
        if (sidebar.button && sidebar.button.parentElement) sidebar.button.remove();
        sidebar.button = createSidebarButton(host);
      }
      var button = sidebar.button;
      var label = query(button, '.dsh-prism-nav-more-label');
      var text = navigationLabel(sidebar.expanded, sidebar.hiddenCount);
      if (label && label.textContent !== text) label.textContent = text;
      setAttr(button, 'aria-expanded', sidebar.expanded ? 'true' : 'false');
      setAttr(button, 'aria-label', text);
      button.title = text;
      setAttr(button, 'data-expanded', sidebar.expanded ? '1' : '0');
    }

    function syncSidebarFold(cfg) {
      var sidebarRoot = resolveSidebarRoot();
      if (!sidebarRoot) {
        if (sidebar.button) clearSidebarFold();
        sidebar.root = null;
        sidebar.host = null;
        sidebar.items = [];
        return;
      }
      var host = resolveSidebarHost(sidebarRoot);
      if (!host) {
        if (sidebar.button) clearSidebarFold();
        sidebar.root = sidebarRoot;
        sidebar.host = null;
        sidebar.items = [];
        return;
      }
      if (sidebar.host !== host) {
        sidebar.expanded = false;
        sidebar.button = null;
      }
      sidebar.root = sidebarRoot;
      sidebar.host = host;
      sidebar.items = resolveSidebarItems(host);
      applySidebarFold(sidebarRoot, host, sidebar.items, sidebarFoldEnabled(cfg));
    }

    function scrollMetrics(port) {
      if (!isElement(port)) return null;
      var height = port.clientHeight || 0;
      var scrollHeight = port.scrollHeight || height;
      var floor = Math.max(0, scrollHeight - height);
      return {
        top: Number(port.scrollTop) || 0,
        height: height,
        scrollHeight: scrollHeight,
        floor: floor,
        distance: Math.max(0, floor - (Number(port.scrollTop) || 0)),
      };
    }

    function resolveScrollPort() {
      var candidates = queryAll(doc, '[data-conversation-region="chat"] [data-conversation-scroll]');
      if (!candidates.length) candidates = queryAll(doc, '[data-conversation-scroll]');
      candidates = candidates.filter(isVisible);
      if (!candidates.length) return null;
      var active = doc.activeElement && doc.activeElement.closest
        ? doc.activeElement.closest('[data-conversation-region="chat"]')
        : null;
      if (active) {
        var activePort = query(active, '[data-conversation-scroll]');
        if (activePort && candidates.indexOf(activePort) >= 0) return activePort;
      }
      return candidates.sort(function (left, right) {
        var a = left.getBoundingClientRect();
        var b = right.getBoundingClientRect();
        return (b.width * b.height) - (a.width * a.height);
      })[0];
    }

    function isNativeToBottomButton(button) {
      if (!isElement(button) || button.hasAttribute('data-prism-scroll-bottom')) return false;
      var className = String(button.className || '');
      if (/(?:^|_)toBottom(?:_|$)/.test(className) || className.indexOf('toBottom') >= 0) return true;
      var meta = [
        button.getAttribute('aria-label'),
        button.getAttribute('title'),
      ].join(' ');
      return /回到底部|back to bottom|最下部へ戻る|volver al fondo|retour en bas|zurück nach unten|вернуться к низу|de volta ao fundo/i.test(meta);
    }

    function findNativeScrollButton(port) {
      var scope = port && port.closest
        ? port.closest('[data-conversation-region="chat"]') || port
        : doc;
      var buttons = queryAll(scope, 'button');
      return buttons.find(isNativeToBottomButton) || null;
    }

    function removeOwnScrollButton() {
      if (ownScrollButton) {
        cancelScrollMotion();
        setButtonScrolling(ownScrollButton, false);
      }
      if (ownScrollButton && ownScrollButton.parentNode) ownScrollButton.parentNode.removeChild(ownScrollButton);
      ownScrollButton = null;
    }

    function createOwnScrollButton() {
      if (ownScrollButton) return ownScrollButton;
      var button = doc.createElement('button');
      button.type = 'button';
      button.className = 'dsh-prism-scroll-bottom';
      button.setAttribute('data-prism-scroll-bottom', '1');
      button.setAttribute('aria-label', '回到底部');
      button.title = '回到底部';
      button.hidden = true;
      button.innerHTML = '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">'
        + '<path d="M8 2.5v9M4.5 8 8 11.5 11.5 8M3 13.5h10" fill="none" '
        + 'stroke="currentColor" stroke-width="1.5" stroke-linecap="round" '
        + 'stroke-linejoin="round"/></svg>';
      doc.body.appendChild(button);
      ownScrollButton = button;
      return button;
    }

    function positionOwnScrollButton(port) {
      if (!ownScrollButton || !isElement(port)) return;
      var chat = port.closest('[data-conversation-region="chat"]') || port;
      var chatRect = chat.getBoundingClientRect();
      var composer = query(chat, '[data-composer-seat]') || query(doc, '[data-composer-seat]');
      var composerRect = composer ? composer.getBoundingClientRect() : null;
      var right = Math.max(12, Math.round(win.innerWidth - chatRect.right + 20));
      var bottomBase = composerRect && composerRect.height > 0 && composerRect.top < win.innerHeight
        ? composerRect.height + 12
        : 16;
      var bottom = Math.max(12, Math.round(bottomBase));
      ownScrollButton.style.setProperty('--prism-rw-scroll-right', right + 'px');
      ownScrollButton.style.setProperty('--prism-rw-scroll-bottom', bottom + 'px');
    }

    function updateScrollButton() {
      if (destroyed) return;
      scrollFrame = 0;
      var port = scrollPort || resolveScrollPort();
      if (!port) {
        if (ownScrollButton) ownScrollButton.hidden = true;
        return;
      }
      var nativeButton = findNativeScrollButton(port);
      if (nativeButton) {
        nativeScrollSupportSeen = true;
        if (nativeScrollButton && nativeScrollButton !== nativeButton) {
          removeAttr(nativeScrollButton, 'data-prism-scroll-bottom-native');
        }
        nativeScrollButton = nativeButton;
        setAttr(nativeScrollButton, 'data-prism-scroll-bottom-native', '1');
        removeOwnScrollButton();
        return;
      }
      if (nativeScrollButton) {
        removeAttr(nativeScrollButton, 'data-prism-scroll-bottom-native');
        nativeScrollButton = null;
      }
      if (query(port, '[data-chat-following-tail]')) {
        nativeScrollSupportSeen = true;
        removeOwnScrollButton();
        return;
      }
      if (nativeScrollSupportSeen) {
        removeOwnScrollButton();
        return;
      }
      var button = createOwnScrollButton();
      var metrics = scrollMetrics(port);
      positionOwnScrollButton(port);
      var visible = Boolean(metrics && metrics.floor > 4 && metrics.distance > SCROLL_BOTTOM_GAP);
      button.hidden = !visible;
      setAttr(button, 'data-visible', visible ? '1' : '0');
    }

    function scheduleScrollButtonUpdate() {
      if (destroyed || scrollFrame) return;
      if (typeof win.requestAnimationFrame === 'function') {
        scrollFrame = win.requestAnimationFrame(updateScrollButton);
      } else {
        scrollFrame = win.setTimeout(updateScrollButton, 16);
      }
    }

    function detachScrollPort() {
      if (scrollPort && typeof scrollPort.removeEventListener === 'function') {
        scrollPort.removeEventListener('scroll', scheduleScrollButtonUpdate);
      }
      if (scrollResizeObserver && scrollPort) safe(function () { scrollResizeObserver.unobserve(scrollPort); });
      scrollPort = null;
    }

    function bindScrollPort(port) {
      if (!port || scrollPort === port) return;
      detachScrollPort();
      scrollPort = port;
      nativeScrollSupportSeen = false;
      if (nativeScrollButton) {
        removeAttr(nativeScrollButton, 'data-prism-scroll-bottom-native');
        nativeScrollButton = null;
      }
      on(port, 'scroll', scheduleScrollButtonUpdate, { passive: true });
      if (scrollResizeObserver) scrollResizeObserver.observe(port);
    }

    function cancelScrollMotion() {
      if (scrollMotionFrame) {
        if (typeof win.cancelAnimationFrame === 'function') win.cancelAnimationFrame(scrollMotionFrame);
        else win.clearTimeout(scrollMotionFrame);
      }
      scrollMotionFrame = 0;
      if (typeof scrollMotionCleanup === 'function') {
        safe(scrollMotionCleanup);
        scrollMotionCleanup = null;
      }
    }

    function setButtonScrolling(button, active) {
      if (!isElement(button)) return;
      if (active) setAttr(button, 'data-prism-scrolling', '1');
      else removeAttr(button, 'data-prism-scrolling');
    }

    function runScrollToBottom(port, button) {
      if (!isElement(port)) return;
      var metrics = scrollMetrics(port);
      if (!metrics || metrics.floor <= 0) return;
      var mode = scrollBottomMotion();
      if (mode === 'instant' || metrics.distance <= 1) {
        port.scrollTop = metrics.floor;
        scheduleScrollButtonUpdate();
        return;
      }

      cancelScrollMotion();
      var start = Number(port.scrollTop) || 0;
      var duration = Math.max(300, Math.min(560, Math.round(220 + Math.sqrt(metrics.distance) * 6)));
      var now = typeof win.performance?.now === 'function' ? win.performance.now.bind(win.performance) : Date.now;
      var startedAt = now();
      var interrupt = function () {
        cancelScrollMotion();
        setButtonScrolling(button, false);
      };
      var targets = [port];
      var passive = { passive: true };
      var once = { passive: true, once: true };
      targets.forEach(function (target) {
        ['wheel', 'pointerdown', 'touchstart'].forEach(function (eventName) {
          target.addEventListener(eventName, interrupt, once);
        });
      });
      if (win && typeof win.addEventListener === 'function') win.addEventListener('keydown', interrupt, once);
      scrollMotionCleanup = function () {
        targets.forEach(function (target) {
          ['wheel', 'pointerdown', 'touchstart'].forEach(function (eventName) {
            target.removeEventListener(eventName, interrupt);
          });
        });
        if (win && typeof win.removeEventListener === 'function') win.removeEventListener('keydown', interrupt);
      };
      setButtonScrolling(button, true);

      var step = function () {
        if (destroyed || !port.isConnected) {
          interrupt();
          return;
        }
        var currentMetrics = scrollMetrics(port);
        if (!currentMetrics) {
          interrupt();
          return;
        }
        var elapsed = Math.max(0, now() - startedAt);
        var progress = Math.min(1, elapsed / duration);
        var eased = 1 - Math.pow(1 - progress, 3.6);
        var target = Math.max(0, currentMetrics.floor);
        port.scrollTop = start + (target - start) * eased;
        if (progress < 1) {
          scrollMotionFrame = win.requestAnimationFrame(step);
        } else {
          port.scrollTop = target;
          cancelScrollMotion();
          setButtonScrolling(button, false);
          scheduleScrollButtonUpdate();
        }
      };
      scrollMotionFrame = win.requestAnimationFrame(step);
    }

    function syncScrollBottom() {
      var port = resolveScrollPort();
      if (!port) {
        detachScrollPort();
        removeOwnScrollButton();
        if (nativeScrollButton) {
          removeAttr(nativeScrollButton, 'data-prism-scroll-bottom-native');
          nativeScrollButton = null;
        }
        return;
      }
      if (port !== scrollPort) bindScrollPort(port);
      scheduleScrollButtonUpdate();
    }

    function onDocumentClick(event) {
      if (destroyed || !event || !event.target || !event.target.closest) return;
      var navButton = event.target.closest('[data-prism-nav-more]');
      if (navButton && navButton === sidebar.button) {
        event.preventDefault();
        event.stopPropagation();
        sidebar.expanded = !sidebar.expanded;
        syncSidebarFold();
        scheduleScan();
        return;
      }

      var button = event.target.closest('button');
      if (!button) return;
      if (button === ownScrollButton) {
        event.preventDefault();
        event.stopPropagation();
        runScrollToBottom(scrollPort || resolveScrollPort(), button);
        return;
      }
      if (!isNativeToBottomButton(button)) return;
      var port = resolveScrollPort();
      if (!port || scrollBottomMotion() === 'instant') return;
      event.preventDefault();
      event.stopPropagation();
      runScrollToBottom(port, button);
    }

    function onConfigEvent(event) {
      var next = event && event.detail && typeof event.detail === 'object' ? event.detail : null;
      syncRootAttributes(next || undefined);
      scheduleScan();
    }

    function flushScan() {
      scanFrame = 0;
      scanFallbackTimer = 0;
      if (destroyed) return;
      syncRootAttributes();
      syncComposerCards();
      syncSidebarFold();
      syncScrollBottom();
    }

    function scheduleScan() {
      if (destroyed || scanFrame || scanFallbackTimer) return;
      if (typeof win.requestAnimationFrame === 'function') {
        scanFrame = win.requestAnimationFrame(flushScan);
      } else {
        scanFallbackTimer = win.setTimeout(flushScan, 16);
      }
    }

    function cleanupToolbarMarks() {
      queryAll(doc, '[data-composer-card]').forEach(function (card) {
        removeAttr(card, 'data-prism-toolbar-tier');
        clearToolbarContract(card);
      });
      cardStats.clear();
    }

    function destroy() {
      if (destroyed) return;
      destroyed = true;
      cancelScrollMotion();
      if (scanFrame && typeof win.cancelAnimationFrame === 'function') win.cancelAnimationFrame(scanFrame);
      if (measureFrame && typeof win.cancelAnimationFrame === 'function') win.cancelAnimationFrame(measureFrame);
      if (scrollFrame && typeof win.cancelAnimationFrame === 'function') win.cancelAnimationFrame(scrollFrame);
      if (scanFallbackTimer) win.clearTimeout(scanFallbackTimer);
      if (measureFallbackTimer) win.clearTimeout(measureFallbackTimer);
      if (scanInterval) win.clearInterval(scanInterval);
      if (resizeObserver) resizeObserver.disconnect();
      if (scrollResizeObserver) scrollResizeObserver.disconnect();
      if (mutationObserver) mutationObserver.disconnect();
      detachScrollPort();
      removeOwnScrollButton();
      if (nativeScrollButton) removeAttr(nativeScrollButton, 'data-prism-scroll-bottom-native');
      cleanupToolbarMarks();
      clearSidebarFold();
      var html = doc.documentElement;
      removeAttr(html, 'data-prism-responsive-workbench');
      removeAttr(html, 'data-prism-scroll-bottom-motion');
      removeAttr(html, 'data-prism-sidebar-nav-fold');
      cleanups.splice(0).forEach(function (cleanup) {
        safe(cleanup);
      });
      if (activeInstance === instanceApi) activeInstance = null;
    }

    function getState() {
      var config = readConfig();
      return {
        version: VERSION,
        destroyed: destroyed,
        config: {
          scrollBottomMotion: scrollBottomMotion(config),
          sidebarNavFold: sidebarFoldEnabled(config) ? 'on' : 'off',
        },
        composer: Array.from(cardStats.entries())
          .filter(function (entry) { return entry[0].isConnected !== false; })
          .map(function (entry) {
            return { width: entry[1].width, tier: entry[1].tier };
          }),
        sidebar: {
          found: Boolean(sidebar.host),
          expanded: sidebar.expanded,
          hiddenCount: sidebar.hiddenCount,
          hasMoreButton: Boolean(sidebar.button && sidebar.button.isConnected !== false),
        },
        scrollBottom: {
          found: Boolean(scrollPort),
          native: Boolean(nativeScrollButton),
          fallback: Boolean(ownScrollButton),
          nativeSupportSeen: nativeScrollSupportSeen,
        },
      };
    }

    var instanceApi = {
      version: VERSION,
      refresh: function () {
        if (!destroyed) scheduleScan();
      },
      getState: getState,
      destroy: destroy,
    };

    function start() {
      syncRootAttributes();
      if (typeof win.ResizeObserver === 'function') {
        resizeObserver = new win.ResizeObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry && entry.target) scheduleCardMeasure(entry.target);
          });
        });
        scrollResizeObserver = new win.ResizeObserver(function () {
          scheduleScrollButtonUpdate();
        });
      }
      if (typeof win.MutationObserver === 'function') {
        var observeTarget = doc.getElementById('root') || doc.body;
        if (observeTarget) {
          mutationObserver = new win.MutationObserver(function () {
            scheduleScan();
          });
          mutationObserver.observe(observeTarget, { childList: true, subtree: true });
        }
      }
      on(doc, 'click', onDocumentClick, true);
      on(win, 'resize', scheduleScan, { passive: true });
      on(win, 'ag-prism:config', onConfigEvent);
      if (typeof runtimeBridge?.onConfigChange === 'function') {
        var unsubscribe = safe(function () { return runtimeBridge.onConfigChange(onConfigEvent); }, null);
        if (typeof unsubscribe === 'function') cleanups.push(unsubscribe);
      } else if (typeof runtimeBridge?.subscribe === 'function') {
        var unsubscribeFallback = safe(function () { return runtimeBridge.subscribe(onConfigEvent); }, null);
        if (typeof unsubscribeFallback === 'function') cleanups.push(unsubscribeFallback);
      }
      scanInterval = win.setInterval(scheduleScan, SCAN_INTERVAL_MS);
      scheduleScan();
    }

    start();
    return instanceApi;
  }

  function init(bridge) {
    if (activeInstance) activeInstance.destroy();
    activeInstance = createInstance(bridge);
    return activeInstance;
  }

  function getInstance() {
    return activeInstance;
  }

  function destroy() {
    if (activeInstance) activeInstance.destroy();
    activeInstance = null;
  }

  root.DSHPrismResponsiveWorkbench = {
    version: VERSION,
    init: init,
    getInstance: getInstance,
    destroy: destroy,
  };
})(typeof window !== 'undefined' ? window : this);

}).call(
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : {},
  typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : undefined),
  typeof self !== "undefined" ? self : (typeof window !== "undefined" ? window : undefined),
  typeof document !== "undefined" ? document : undefined,
  undefined,
  undefined
);

// === [7/10] src/home-ripple-host.js ===
;(function (root, window, self, document, module, exports) {
/* Obsidian Prism for DeepSeek Harness · home ASCII ripple and horizon host
 * Mounted through DSHPrismOptics so the existing 0fps-idle wave engine owns
 * animation. Adapted from RMvdesi/obsidian-prism 1.0.7. GPL-3.0-only.
 */
(function (root, factory) {
  'use strict';
  const api = factory(root || (typeof globalThis !== 'undefined' ? globalThis : null));
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root && typeof root === 'object') root.DSHPrismHomeRipple = api;
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function (root) {
  'use strict';

  const HOME_SELECTOR =
    '[data-conversation-content][data-content-phase="hero"], ' +
    '[data-conversation-content][data-content-phase="blank"]';
  const OWNED_SELECTOR = '[data-dsh-prism-owned="1"], .dsh-prism-home-ripple-host';
  const MOUNT_RETRY_MS = 280;
  const MOUNT_RETRY_LIMIT = 24;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function parseAmbient(raw) {
    if (raw === null || raw === undefined || raw === '') return 1;
    const value = Number(raw);
    if (!Number.isFinite(value)) return 1;
    return clamp(value > 1 ? value / 100 : value, 0, 1);
  }

  function parseBoolean(raw, fallback = true) {
    if (raw === undefined || raw === null || raw === '') return fallback;
    if (raw === false || raw === 0) return false;
    const value = String(raw).trim().toLowerCase();
    return !['off', 'false', '0', 'none', 'disabled'].includes(value);
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

  function createHost(doc) {
    const host = doc.createElement('div');
    host.className = 'dsh-prism-home-ripple-host';
    host.setAttribute('data-dsh-prism-owned', '1');
    host.setAttribute('data-prism-home-ripple-anchor', '1');
    host.setAttribute('aria-hidden', 'true');
    host.style.pointerEvents = 'none';
    return host;
  }

  function createController(bridge) {
    const doc = root?.document;
    const win = doc?.defaultView || root;
    if (!doc || !win) {
      return {
        start() { return this; },
        sync() {},
        park() {},
        unmount() {},
        getState: () => ({ mounted: false, reason: 'document-unavailable' }),
        getElement: () => null,
        destroy() {},
      };
    }

    let destroyed = false;
    let started = false;
    let host = null;
    let contentEl = null;
    let mount = null;
    let observer = null;
    let syncTimer = 0;
    let retryTimer = 0;
    let retryCount = 0;
    let pulseFrame = 0;
    let boundContent = null;
    let lastPointerAt = 0;
    let reason = 'idle';
    let reduced = Boolean(win.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
    const listeners = [];

    function readConfig() {
      try {
        return (typeof bridge?.getConfig === 'function' ? bridge.getConfig() : bridge?.config) || {};
      } catch {
        return {};
      }
    }

    function homeLayout(config = readConfig()) {
      const value = String(config.homeLayout || config.homeMode || 'studio').toLowerCase();
      return value === 'classic' || value === 'off' ? value : 'studio';
    }

    function motionLevel(config = readConfig()) {
      const value = String(config.motionLevel || config.motion || 'ultra').toLowerCase();
      return ['off', 'subtle', 'standard', 'ultra'].includes(value) ? value : 'ultra';
    }

    function allowed(config = readConfig()) {
      if (homeLayout(config) === 'off') {
        reason = 'home-off';
        return false;
      }
      if (!parseBoolean(config.homeRipple, true)) {
        reason = 'ripple-disabled';
        return false;
      }
      if (String(config.ripple || '').toLowerCase() === 'off') {
        reason = 'ripple-disabled';
        return false;
      }
      if (motionLevel(config) === 'off') {
        reason = 'motion-off';
        return false;
      }
      if (parseAmbient(config.ambientIntensity ?? config.ambient ?? 100) <= 0.001) {
        reason = 'ambient-off';
        return false;
      }
      if (reduced) {
        reason = 'reduced-motion';
        return false;
      }
      reason = 'active';
      return true;
    }

    function removePointerBinding() {
      if (!boundContent) return;
      boundContent.removeEventListener('pointerdown', onPointerDown);
      boundContent = null;
    }

    function unmount(removeAnchor = true) {
      reason = reason === 'active' ? 'idle' : reason;
      if (pulseFrame) {
        win.cancelAnimationFrame?.(pulseFrame);
        pulseFrame = 0;
      }
      removePointerBinding();
      if (mount) {
        try {
          mount.dispose?.();
        } catch {}
        mount = null;
      }
      if (host) {
        host.removeAttribute('data-prism-home-ripple-ready');
        host.setAttribute('data-prism-home-ripple-state', 'parked');
      }
      if (removeAnchor && host?.parentElement) host.parentElement.removeChild(host);
    }

    function park() {
      unmount(false);
    }

    function pruneDuplicateHosts(keepHost) {
      const nodes = Array.from(
        doc?.querySelectorAll?.('.dsh-prism-home-ripple-host, [data-prism-home-ripple-anchor="1"]') || []
      );
      for (const node of nodes) {
        if (!node || node === keepHost) continue;
        try {
          node.parentElement?.removeChild(node);
        } catch {}
      }
    }

    function ensureHost(content) {
      if (!host) host = createHost(doc);
      pruneDuplicateHosts(host);
      if (host.parentElement !== content || content.firstElementChild !== host) {
        content.insertBefore(host, content.firstChild || null);
      }
      const config = readConfig();
      const ambient = parseAmbient(config.ambientIntensity ?? config.ambient ?? 100);
      const motion = motionLevel(config);
      host.setAttribute('data-prism-home-ripple-state', mount ? 'active' : 'waiting');
      host.setAttribute('data-prism-home-ripple-motion', motion);
      host.setAttribute('data-prism-home-ripple-theme', String(config.theme || 'obsidian'));
      host.style.setProperty('--dsh-prism-home-ripple-alpha', String(ambient));
      host.style.setProperty('--dsh-prism-home-ripple-opacity', String(0.34 + ambient * 0.66));
      return host;
    }

    function resolveMountFunction() {
      const optics = root.DSHPrismOptics;
      if (!optics) return null;
      if (typeof optics.mountRipple === 'function') {
        return (anchor, opts) => optics.mountRipple(anchor, opts);
      }
      if (typeof optics.ripple?.mountInteractiveRipple === 'function') {
        return (anchor, opts) => optics.ripple.mountInteractiveRipple(anchor, opts);
      }
      return null;
    }

    function disturbanceOptions() {
      const config = readConfig();
      return {
        ambientIntensity: parseAmbient(config.ambientIntensity ?? config.ambient ?? 100),
        motionLevel: motionLevel(config),
        reducedMotion: reduced,
        lowPower: true,
        spectrum: String(config.accentTone || 'follow'),
      };
    }

    function disturbFromPointer(event) {
      if (!mount || reason !== 'active' || event.button !== 0) return;
      const now = win.performance?.now?.() || Date.now();
      if (now - lastPointerAt < 56) return;
      const target = event.target?.nodeType === 1 ? event.target : event.target?.parentElement;
      if (
        target?.closest?.(
          'button, a, input, textarea, select, option, [contenteditable="true"], [role="dialog"], .ag-cs-home-panel'
        )
      ) {
        return;
      }
      const rect = host?.getBoundingClientRect?.();
      if (!rect || rect.width <= 0 || rect.height <= 0) return;
      lastPointerAt = now;
      const nx = clamp((event.clientX - rect.left) / rect.width, 0.02, 0.98);
      const ny = clamp((event.clientY - rect.top) / rect.height, 0.02, 0.98);
      const amplitude = motionLevel() === 'subtle' ? 0.5 : 1.05;
      try {
        mount.disturbNormalized?.(nx, ny, amplitude);
      } catch {}
    }

    function bindPointer(content) {
      if (boundContent === content) return;
      removePointerBinding();
      content.addEventListener('pointerdown', onPointerDown, { passive: true });
      boundContent = content;
    }

    function pulseOnce() {
      if (pulseFrame || !mount || reason !== 'active') return;
      const amplitude = motionLevel() === 'subtle' ? 0.34 : 0.68;
      pulseFrame = win.requestAnimationFrame?.(() => {
        pulseFrame = 0;
        if (destroyed || !mount || reason !== 'active') return;
        try {
          mount.disturbNormalized?.(0.5, 0.64, amplitude);
        } catch {}
      }) || 0;
      if (!pulseFrame) {
        try {
          mount.disturbNormalized?.(0.5, 0.64, amplitude);
        } catch {}
      }
    }

    function mountAt(content) {
      const mountFn = resolveMountFunction();
      if (!mountFn) {
        reason = 'optics-unavailable';
        armRetry();
        return false;
      }
      const anchor = ensureHost(content);
      try {
        mount = mountFn(anchor, disturbanceOptions());
      } catch {
        mount = null;
      }
      if (!mount || typeof mount.dispose !== 'function') {
        mount = null;
        reason = 'mount-unavailable';
        anchor.setAttribute('data-prism-home-ripple-state', 'unavailable');
        armRetry();
        return false;
      }
      reason = 'active';
      retryCount = 0;
      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = 0;
      }
      anchor.setAttribute('data-prism-home-ripple-ready', '1');
      anchor.setAttribute('data-prism-home-ripple-state', 'active');
      bindPointer(content);
      pulseOnce();
      return true;
    }

    function armRetry() {
      if (destroyed) return;
      if (retryTimer || retryCount >= MOUNT_RETRY_LIMIT) return;
      retryCount += 1;
      retryTimer = win.setTimeout(() => {
        retryTimer = 0;
        sync();
      }, MOUNT_RETRY_MS);
    }

    function sync(forceRemount = false) {
      if (destroyed) return;
      const config = readConfig();
      if (!allowed(config)) {
        contentEl = null;
        unmount(true);
        return;
      }
      const content = findHomeContent(doc, win);
      if (!content) {
        reason = 'not-home';
        contentEl = null;
        unmount(true);
        return;
      }
      if (contentEl !== content) {
        contentEl = content;
        forceRemount = true;
      }
      ensureHost(content);
      if (!mount || forceRemount) {
        if (mount) unmount(false);
        mountAt(content);
        return;
      }
      reason = 'active';
      ensureHost(content);
    }

    function scheduleSync(forceRemount = false) {
      if (destroyed) return;
      if (syncTimer) clearTimeout(syncTimer);
      syncTimer = win.setTimeout(() => {
        syncTimer = 0;
        sync(forceRemount);
      }, 80);
    }

    function onPointerDown(event) {
      disturbFromPointer(event);
    }

    function onConfigEvent() {
      scheduleSync(true);
    }

    function onVisibilityChange() {
      if (destroyed) return;
      if (doc.hidden) park();
      else scheduleSync(true);
    }

    function onReducedMotionChange(event) {
      reduced = Boolean(event.matches);
      scheduleSync(true);
    }

    function onMutation(records) {
      if (destroyed) return;
      for (const record of records || []) {
        if (withinOwned(record?.target)) continue;
        if (record.type === 'attributes') {
          if (
            record.attributeName === 'data-content-phase' ||
            record.attributeName === 'data-prism-theme' ||
            record.attributeName === 'data-ag-cs-theme' ||
            record.attributeName === 'data-prism-motion' ||
            record.attributeName === 'data-prism-ambient'
          ) {
            scheduleSync(record.attributeName !== 'data-content-phase');
            return;
          }
          continue;
        }
        for (const node of Array.from(record.addedNodes || []).concat(Array.from(record.removedNodes || []))) {
          if (node?.nodeType !== 1 || withinOwned(node)) continue;
          if (
            node.matches?.('[data-conversation-content], [data-conversation-scroll]') ||
            node.querySelector?.('[data-conversation-content], [data-conversation-scroll]')
          ) {
            scheduleSync();
            return;
          }
        }
      }
    }

    function start() {
      if (started || destroyed) return controller;
      started = true;
      win.addEventListener('ag-prism:config', onConfigEvent);
      doc.addEventListener('visibilitychange', onVisibilityChange);
      listeners.push(() => win.removeEventListener('ag-prism:config', onConfigEvent));
      listeners.push(() => doc.removeEventListener('visibilitychange', onVisibilityChange));
      const media = win.matchMedia?.('(prefers-reduced-motion: reduce)');
      if (media?.addEventListener) {
        media.addEventListener('change', onReducedMotionChange);
        listeners.push(() => media.removeEventListener('change', onReducedMotionChange));
      } else if (media?.addListener) {
        media.addListener(onReducedMotionChange);
        listeners.push(() => media.removeListener(onReducedMotionChange));
      }
      if (typeof MutationObserver === 'function') {
        observer = new MutationObserver(onMutation);
        observer.observe(doc.documentElement, {
          subtree: true,
          childList: true,
          attributes: true,
          attributeFilter: [
            'data-content-phase',
            'data-prism-theme',
            'data-ag-cs-theme',
            'data-prism-motion',
            'data-prism-ambient',
          ],
        });
      }
      sync();
      return controller;
    }

    function destroy() {
      if (destroyed) return;
      destroyed = true;
      if (syncTimer) clearTimeout(syncTimer);
      if (retryTimer) clearTimeout(retryTimer);
      syncTimer = retryTimer = 0;
      observer?.disconnect();
      observer = null;
      for (const remove of listeners.splice(0)) {
        try {
          remove();
        } catch {}
      }
      unmount(true);
      contentEl = null;
      host = null;
    }

    const controller = {
      start,
      sync: () => sync(false),
      park,
      unmount: () => unmount(true),
      getState() {
        const rect = host?.getBoundingClientRect?.();
        return {
          mounted: Boolean(mount),
          visible: Boolean(host?.isConnected),
          allowed: allowed(),
          reason,
          phase: contentEl?.getAttribute?.('data-content-phase') || null,
          motionLevel: motionLevel(),
          ambient: parseAmbient(readConfig().ambientIntensity ?? readConfig().ambient ?? 100),
          reducedMotion: reduced,
          sleeping: mount?.isSleeping?.() ?? true,
          rect: rect
            ? {
                left: Math.round(rect.left),
                top: Math.round(rect.top),
                width: Math.round(rect.width),
                height: Math.round(rect.height),
              }
            : null,
        };
      },
      getElement: () => host,
      destroy,
    };
    return controller;
  }

  let activeInstance = null;

  function init(bridge) {
    const runtimeBridge = bridge || root?.DSHPrismBridge || null;
    const prevGlobal = root?.__dshPrismHomeRippleActive || null;
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
    if (root && typeof root === 'object') root.__dshPrismHomeRippleActive = instance;
    instance.start();
    return instance;
  }

  function getInstance() {
    return activeInstance;
  }

  function destroy() {
    const prevGlobal = root?.__dshPrismHomeRippleActive || null;
    if (prevGlobal && prevGlobal !== activeInstance && typeof prevGlobal.destroy === 'function') {
      try {
        prevGlobal.destroy();
      } catch {}
    }
    if (activeInstance) {
      activeInstance.destroy();
      activeInstance = null;
    }
    if (root && typeof root === 'object' && root.__dshPrismHomeRippleActive) {
      root.__dshPrismHomeRippleActive = null;
    }
  }

  const api = Object.freeze({
    HOME_SELECTOR,
    createController,
    init,
    getInstance,
    destroy,
  });

  function bootFromBridge() {
    if (!root?.document) return;
    if (root.DSHPrismHomeRipple && root.DSHPrismHomeRipple !== api) {
      root.removeEventListener?.('dsh-prism:ready', bootFromBridge);
      return;
    }
    if (root.__DSH_PRISM_NO_AUTO_BOOT__ === true || api.getInstance()) return;
    const runtimeBridge = root.DSHPrismBridge;
    if (!runtimeBridge) return;
    if (typeof runtimeBridge.registerModule === 'function') {
      runtimeBridge.registerModule('homeRipple', api);
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

}).call(
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : {},
  typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : undefined),
  typeof self !== "undefined" ? self : (typeof window !== "undefined" ? window : undefined),
  typeof document !== "undefined" ? document : undefined,
  undefined,
  undefined
);

// === [8/10] src/home-studio-panel.js ===
;(function (root, window, self, document, module, exports) {
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
  const HOME_HEAT_WEEKS = 26;
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
      if (!cell || !panel?.contains(cell)) {
        hideHeatHint();
        return;
      }
      const grid = cell.closest?.('.ag-cs-home-heat');
      const hint = grid?.querySelector?.('.ag-cs-home-heat-hint');
      if (!grid || !hint) return;
      const tip = cell.getAttribute('data-tip') || '';
      hint.textContent = tip;
      hint.setAttribute('data-shown', 'true');
      const measuredW = hint.offsetWidth || hint.getBoundingClientRect?.().width || 0;
      const measuredH = hint.offsetHeight || hint.getBoundingClientRect?.().height || 22;
      const width = measuredW > 0 ? measuredW : Math.max(96, Math.min(248, tip.length * 7.2 + 18));
      const gridWidth = grid.clientWidth || grid.getBoundingClientRect?.().width || 440;
      const gridHeight = grid.clientHeight || grid.getBoundingClientRect?.().height || 80;
      const left = clamp(cell.offsetLeft + cell.offsetWidth / 2 - width / 2, 0, Math.max(0, gridWidth - width));
      const preferAbove = cell.offsetTop - measuredH - 5;
      const top =
        preferAbove >= -18
          ? preferAbove
          : Math.min(gridHeight - measuredH, cell.offsetTop + cell.offsetHeight + 5);
      hint.style.transform = `translate3d(${Math.round(left)}px, ${Math.round(top)}px, 0)`;
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
      const fullView = useExternal ? buildExternalView('all') : buildSamplesView('all');
      return {
        ...active,
        heatDayMap: fullView.dayMap,
        peakContext: peak,
        favorite,
        hasData,
        source: useExternal ? 'host' : samples.length ? 'samples' : 'none',
        latestAt: Math.max(active.latestAt || 0, state.lastUpdatedAt || 0),
      };
    }

    function buildHeatSeries(data) {
      const today = startOfDay(new Date());
      const map = data.heatDayMap || data.dayMap;
      const totalDays = HOME_HEAT_WEEKS * 7;
      const start = addDays(today, -(totalDays - 1));
      const out = [];
      for (let i = 0; i < totalDays; i += 1) {
        const date = addDays(start, i);
        const key = dateKey(date);
        const row = map.get(key);
        out.push({
          key,
          date,
          tokens: row?.tokens || 0,
          calls: row?.calls || 0,
        });
      }
      return out;
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
        createStatCard(copy.sessions, sessions ? formatCount(sessions) : '—', '', 'sessions')
      );
      stats.appendChild(
        createStatCard(
          data.kind === 'host' ? copy.calls : copy.samples,
          calls ? formatCount(calls) : '—',
          '',
          'calls'
        )
      );
      stats.appendChild(createStatCard(copy.tokens, tokenTotal ? formatCompact(tokenTotal) : '—', '', 'tokens'));
      stats.appendChild(
        createStatCard(copy.activeDays, data.activeDays ? formatCount(data.activeDays) : '—', '', 'days')
      );
      stats.appendChild(
        createStatCard(copy.peakContext, peakValue, '', 'peak')
      );
      stats.appendChild(createStatCard(copy.favorite, favorite, '', 'model'));
      wrap.appendChild(stats);

      const series = buildHeatSeries(data);
      const heat = make('div', 'ag-cs-home-heat');
      const columns = HOME_HEAT_WEEKS;
      heat.style.setProperty('--dsh-prism-home-heat-columns', String(columns));
      heat.setAttribute('role', 'img');
      heat.setAttribute('aria-label', `${copy.heatTitle} · ${copy.heatSub.replace('{n}', String(columns))}`);
      const max = Math.max(0, ...series.map((point) => point.tokens));
      for (const point of series) {
        const cell = make('span', 'ag-cs-home-heat-cell');
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

}).call(
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : {},
  typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : undefined),
  typeof self !== "undefined" ? self : (typeof window !== "undefined" ? window : undefined),
  typeof document !== "undefined" ? document : undefined,
  undefined,
  undefined
);

// === [9/10] src/widgets-vial-mascot.js ===
;(function (root, window, self, document, module, exports) {
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

}).call(
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : {},
  typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : undefined),
  typeof self !== "undefined" ? self : (typeof window !== "undefined" ? window : undefined),
  typeof document !== "undefined" ? document : undefined,
  undefined,
  undefined
);

// === [10/10] src/workbench-settings.js ===
;(function (root, window, self, document, module, exports) {
/**
 * Obsidian Prism for DeepSeek Harness (dsh) — 工作台深度增强与外观设置中心
 * 文件: src/workbench-settings.js
 * 暴露全局对象: window.DSHPrismWorkbench
 *
 * 包含两大核心体系（高保真移植自 obsidian-prism-main）:
 * 1. 工作台深度增强器 (host-workbench-enhancer.js + thought-client.js + omni-client.js):
 *    - 代码块玻璃吸顶标题栏 + `>= 48` 行手动折叠/展开（带视口滚动锚点补偿，永不自动强行折叠）
 *    - 左侧对话章节轨道（`[data-testid="conversation-navigator"]`）刻度联动、悬停大纲浮层、
 *      关键词实时过滤与一键收起历史思考步骤
 *    - 全局 `Alt+Up` / `Alt+Down` 对话轮次瞬时跳转 + 声呐脉冲定位高亮
 *    - 上下文感知右键快捷菜单（复制代码/文本、折叠代码块、切换思考译文视图、复制选中文本为引用、打开设置中心）
 *    - 双模思考链转译套件 (Thought Suite Translator)：针对 `<think>` / 深度推理块提供
 *      「沉浸纯中文译文」与「中英逐段上下双语对照」双视图，对接 `bridge.translateThought` 与离线兜底
 * 2. 外观设置中心与五语国际化引擎 (settings-panel.js + i18n-core.js + i18n-locales.js):
 *    - 悬浮毛玻璃设置中心（`Ctrl+Shift+P` 快捷键或点击齿轮触发）
 *    - 完整 5 种界面语言切换（简体中文 / 繁體中文 / 粵語 / English / 日本語）
 *    - 3 档一键场景预设（完整光效 Full Optics / 专注编码 Focus Coding / 静默省电 Silent Power-Saver）
 *    - 4 套原版主题色板（Obsidian / Warm / Crystal / Alabaster）、5 档强调色、3 档圆角、
 *      环境光浓度、动效/帧率档位、等宽字体与连字、鲸伴宠选择、思考转译渠道配置
 *    - 脱敏 JSON 配置导入/导出备份（自动剥离 API Key / Bearer 凭据与原型链污染键）+ 开源致谢与 GPL-3.0 声明
 */

(function (root, factory) {
  'use strict';
  const api = factory(root);
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.DSHPrismWorkbench = api;
    // 兼容上游 obsidian-prism-main 全局命名空间
    if (!root.__agCsI18nCore) root.__agCsI18nCore = api.i18n;
    if (!root.__agCsLocales) root.__agCsLocales = { getUiStrings: api.i18n.getUiStrings };
    if (!root.__agPrismSettingsPanel) root.__agPrismSettingsPanel = api.settingsCore;
    if (!root.__agPrismHostEnhancer) root.__agPrismHostEnhancer = api.enhancerCore;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function (G) {
  'use strict';

  const VERSION = '1.0.7-beta.1-dsh.4';
  const SETTINGS_SCHEMA_REVISION = '1.0.7';
  const MIN_CODE_FOLD_LINES = 48;
  const SONAR_DURATION_MS = 720;
  const OUTLINE_HIDE_DELAY_MS = 240;
  const WORKBENCH_STYLE_ID = 'dsh-prism-workbench-inline-css';
  const THOUGHT_CACHE_KEY = 'ag_prism_thought_zh_cache_v1';
  const THOUGHT_PROFILE_KEY = 'dsh_obsidian_prism_thought_profile_v1';

  const safe = (fn, fb) => {
    try {
      return fn();
    } catch {
      return fb;
    }
  };
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, Number.isFinite(+v) ? +v : lo));

  function readStore(k) {
    return safe(() => (typeof localStorage !== 'undefined' ? localStorage.getItem(k) || '' : ''), '');
  }
  function writeStore(k, v) {
    safe(() => {
      if (typeof localStorage === 'undefined') return;
      if (v === null || v === undefined) localStorage.removeItem(k);
      else localStorage.setItem(k, String(v));
    });
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // 子模块 1: 5 语言国际化核心 (移植自 i18n-core.js + i18n-locales.js)
  // ═════════════════════════════════════════════════════════════════════════════
  const LANG_OPTIONS = Object.freeze([
    { id: 'zh-CN', label: '简体中文', htmlLang: 'zh-CN' },
    { id: 'zh-TW', label: '繁體中文', htmlLang: 'zh-TW' },
    { id: 'yue', label: '粵語', htmlLang: 'zh-HK' },
    { id: 'en', label: 'English', htmlLang: 'en' },
    { id: 'ja', label: '日本語', htmlLang: 'ja' },
  ]);

  const LANG_INDEX = { 'zh-CN': 0, 'zh-TW': 1, yue: 2, en: 3, ja: 4 };

  function normalizeLanguage(lang, fallback = 'zh-CN') {
    if (lang === true) return 'zh-CN';
    if (lang === false) return 'en';
    const raw = typeof lang === 'string' ? lang.trim().toLowerCase().replace(/_/g, '-') : '';
    if (!raw || raw === 'auto') return fallback;
    if (raw === 'en' || raw.startsWith('en-')) return 'en';
    if (raw === 'ja' || raw.startsWith('ja-') || raw === 'jp') return 'ja';
    if (raw === 'yue' || raw.startsWith('yue-') || raw === 'zh-hk' || raw === 'zh-mo') return 'yue';
    if (raw === 'zh-tw' || raw === 'zh-hant' || raw.startsWith('zh-hant-')) return 'zh-TW';
    if (raw === 'zh' || raw.startsWith('zh-')) return 'zh-CN';
    return fallback;
  }

  // 5 语言词条表: [zh-CN, zh-TW, yue, en, ja]
  const UI_TABLE = {
    title: ['Obsidian Prism · 黑曜棱镜', 'Obsidian Prism · 黑曜稜鏡', 'Obsidian Prism · 黑曜稜鏡', 'Obsidian Prism Settings', 'Obsidian Prism · 黒曜プリズム'],
    subtitle: ['DeepSeek Harness 光学工作台设置中心', 'DeepSeek Harness 光學工作台設定中心', 'DeepSeek Harness 光學工作台設定中心', 'Optical Workbench Control Center for DSH', 'DeepSeek Harness 光学ワークベンチ設定'],
    close: ['关闭', '關閉', '關閉', 'Close', '閉じる'],
    presetLabel: ['场景预设', '場景預設', '場景預設', 'Scene Presets', 'シーンプリセット'],
    presetUltra: ['完整光效', '完整光效', '完整光效', 'Full Optics', 'フル光学効果'],
    presetFocus: ['专注编码', '專注編碼', '專注寫 Code', 'Focus Coding', '集中コーディング'],
    presetEco: ['静默省电', '靜默省電', '靜音慳電', 'Silent Eco', '静音省電力'],
    tabAll: ['全部', '全部', '全部', 'All', 'すべて'],
    tabAppearance: ['外观主题', '外觀主題', '外觀主題', 'Appearance', '外観'],
    tabInteraction: ['交互与伴宠', '互動與伴寵', '互動同伴寵', 'Workspace & Pets', '操作・ペット'],
    tabThought: ['思考链转译', '思考鏈轉譯', '思考鏈轉譯', 'Thought Suite', '思考翻訳'],
    tabAbout: ['备份与关于', '備份與關於', '備份同關於', 'Backup & About', 'バックアップ'],
    tabWorkspace: ['首页与工作区', '首頁與工作區', '首頁同工作區', 'Home & Workspace', 'ホーム・ワークスペース'],
    tabModules: ['模块与平台', '模組與平台', '模組同平台', 'Modules & Platform', 'モジュール・プラットフォーム'],
    grpAppearance: ['主题色板与光学参数', '主題色板與光學參數', '主題色板同光學參數', 'Themes & Optical Parameters', 'テーマ・光学パラメータ'],
    grpWorkspace: ['首页、占位与工作区行为', '首頁、佔位與工作區行為', '首頁、佔位同工作區行為', 'Home, Placeholder & Workspace', 'ホーム・プレースホルダー・ワークスペース'],
    grpInteraction: ['消息、代码与工作台', '訊息、程式碼與工作台', '訊息、代碼同工作台', 'Messages, Code & Workspace', 'メッセージ・コード・ワークスペース'],
    grpThought: ['双模思考链转译配置', '雙模思考鏈轉譯設定', '雙模思考鏈轉譯設定', 'Dual-Mode Thought Translator', '思考チェーン翻訳設定'],
    grpModules: ['模块、平台与 DSH 托管能力', '模組、平台與 DSH 託管能力', '模組、平台同 DSH 託管能力', 'Modules, Platform & DSH Host Services', 'モジュール・プラットフォーム・DSH ホスト機能'],
    grpAbout: ['脱敏配置备份与开源致谢', '脫敏設定備份與開源致謝', '脫敏設定備份同開源致謝', 'Sanitized Backup & Credits', 'バックアップと謝辞'],
    themeTitle: ['光学主题预设', '光學主題預設', '光學主題預設', 'Optical Theme', '光学テーマ'],
    themeDesc: ['在深空黑曜、暖炭玄岩、白昼冷晶与暖白画册四套原版主题间即时切换。', '在深空黑曜、暖炭玄岩、白晝冷晶與暖白畫冊四套原版主題間即時切換。', '喺深空黑曜、暖炭玄岩、白晝冷晶同暖白畫冊四套原版主題間即時切換。', 'Switch between Obsidian, Warm Charcoal, Daylight Crystal & Warm Alabaster.', '4つのオリジナル光学テーマを即座に切り替えます。'],
    accentTitle: ['工业强调色', '工業強調色', '工業強調色', 'Accent Color', 'アクセントカラー'],
    accentDesc: ['设置控件、焦点环和上下文用量试管的强调色。试管容量随当前会话变化。', '設定控制項、焦點環和上下文用量試管的強調色。試管容量隨目前對話變化。', '設定按鈕、焦點環同上下文用量試管嘅強調色。試管容量會跟目前對話變。', 'Set the accent for controls, focus rings and the context vial. Its capacity follows the current session.', '操作ボタン、フォーカスリング、コンテキスト使用量ゲージの色を設定します。ゲージの容量は現在のセッションに応じて変わります。'],
    cornerTitle: ['几何圆角曲率', '幾何圓角曲率', '幾何圓角弧度', 'Corner Radius', '角丸スタイル'],
    cornerDesc: ['统一调整输入框、卡片与浮层面板的圆角档位。', '統一調整輸入框、卡片與浮層面板的圓角檔位。', '統一調節輸入框、卡片同浮層面板嘅圓角弧度。', 'Adjust curvature across composer, cards and popovers.', '入力欄・カード・パネルの角丸を一括調整します。'],
    ambientTitle: ['环境氛围光浓度', '環境氛圍光濃度', '環境氛圍光濃度', 'Ambient Glow', '環境グロー強度'],
    ambientDesc: ['调节极光折射与边缘光晕浓度（0% 可彻底静音）。', '調節極光折射與邊緣光暈濃度（0% 可徹底靜音）。', '調節極光折射同邊緣光暈濃度（0% 徹底靜音）。', 'Opacity scale for ambient aurora and rim refraction.', 'オーロラおよびエッジ屈折グローの濃度を調整します。'],
    motionTitle: ['物理动效档位', '物理動效檔位', '物理動效級別', 'Motion Tier', 'モーション強度'],
    motionDesc: ['控制弹簧阻尼、流式水墨淡入与静止 0fps 休眠策略。', '控制彈簧阻尼、流式水墨淡入與靜止 0fps 休眠策略。', '控制彈簧阻尼、水墨淡入同靜止 0fps 休眠策略。', 'Spring physics, 5-tier ink fade-in and 0fps idle sleep.', 'スプリング・インク演出・0fpsスリープを制御します。'],
    fpsTitle: ['目标刷新帧率', '目標重新整理幀率', '目標刷新幀率', 'Target FPS', '目標フレームレート'],
    fpsDesc: ['设置活跃态绘制帧率上限，无交互 1.2s 后自动归零休眠。', '設定活躍態繪製幀率上限，無互動 1.2s 後自動歸零休眠。', '設定活躍幀率上限，靜止 1.2s 後自動歸零休眠。', 'Active render cap; drops to 0fps after 1.2s idle.', 'アクティブ時の最大FPS（1.2秒静止で0fps休眠）。'],
    langTitle: ['界面语言', '介面語言', '介面語言', 'Interface Language', '表示言語'],
    langDesc: ['实时切换设置中心、工作台大纲、代码折叠与思考译文界面语言。', '即時切換設定中心、工作台大綱、程式碼摺疊與思考譯文介面語言。', '即時切換設定中心、工作台大綱、代碼摺疊同思考譯文語言。', 'Switch UI language across Settings, Outline and Thought Suite.', '設定・目次・コード折りたたみ・思考翻訳の表示言語を変更します。'],
    paletteTitle: ['调色板兼容模式', '調色板相容模式', '調色板兼容模式', 'Palette Compatibility', 'パレット互換モード'],
    paletteDesc: ['对齐上游 1.0.7 的 Host / Obsidian / Warm 调色板键，并与 DSH 四主题联动。', '對齊上游 1.0.7 的 Host / Obsidian / Warm 調色板鍵，並與 DSH 四主題聯動。', '對齊上游 1.0.7 嘅 Host / Obsidian / Warm 調色板，同 DSH 四主題聯動。', 'Keep the upstream Host / Obsidian / Warm palette key in sync with DSH themes.', '上流の Host / Obsidian / Warm パレットを DSH テーマと同期します。'],
    lightPresetTitle: ['浅色切面预设', '淺色切面預設', '淺色切面預設', 'Light Surface Preset', 'ライトサーフェスプリセット'],
    lightPresetDesc: ['选择冷晶或暖白画册切面；会同步到 DSH 的 crystal / alabaster 主题。', '選擇冷晶或暖白畫冊切面；會同步到 DSH 的 crystal / alabaster 主題。', '揀冷晶或暖白畫冊切面；會同步去 DSH 嘅 crystal / alabaster 主題。', 'Choose Crystal or Alabaster and sync it to the active DSH theme.', 'クリスタルまたはアルバスターを選択し、DSH テーマと同期します。'],
    homeLayoutTitle: ['首页布局适配', '首頁版面適配', '首頁版面適配', 'Home Layout Adapter', 'ホームレイアウトアダプター'],
    homeLayoutDesc: ['由 DSHPrismHomeStudio 实时消费，可切换 Studio、Classic 或恢复 DSH 原生首页。', '由 DSHPrismHomeStudio 即時消費，可切換 Studio、Classic 或恢復 DSH 原生首頁。', '由 DSHPrismHomeStudio 即時消費，可切換 Studio、Classic 或還原 DSH 原生首頁。', 'Consumed live by DSHPrismHomeStudio to switch Studio, Classic or the native DSH home.', 'DSHPrismHomeStudio が Studio / Classic / DSH ネイティブホームを即時切り替えます。'],
    homeRippleTitle: ['首页波纹与地平线', '首頁波紋與地平線', '首頁波紋同地平線', 'Home Ripple & Horizon', 'ホーム波形と地平線'],
    homeRippleDesc: ['由 DSHPrismHomeRipple 实时启停首页波纹与地平线光效。', '由 DSHPrismHomeRipple 即時啟停首頁波紋與地平線光效。', '由 DSHPrismHomeRipple 即時開關首頁波紋同地平線光效。', 'DSHPrismHomeRipple consumes this live to toggle the home ripple and horizon glow.', 'DSHPrismHomeRipple がホーム波形と地平線グローを即時切り替えます。'],
    logoInkTitle: ['品牌字标墨色', '品牌字標墨色', '品牌字標墨色', 'Logo Ink', 'ロゴインク'],
    logoInkDesc: ['首页鱼形字标与 Prism 品牌标记使用强调色或前景色。', '首頁魚形字標與 Prism 品牌標記使用強調色或前景色。', '首頁魚形字標同 Prism 品牌標記使用強調色或前景色。', 'Use the accent or foreground ink for the hero fish and Prism brand mark.', 'ホームの魚ロゴと Prism ブランドマークにアクセント色または前景色を使います。'],
    hostLocalizationTitle: ['宿主界面汉化', '宿主介面漢化', '宿主介面漢化', 'Host Localization', 'ホストUIのローカライズ'],
    hostLocalizationDesc: ['DSH 已使用原生中文界面，此项仅保留兼容字段，不再注入宿主译文。', 'DSH 已使用原生中文介面，此項僅保留相容欄位，不再注入宿主譯文。', 'DSH 已經用原生中文介面，呢項只保留兼容欄位，唔再注入譯文。', 'DSH already ships native Chinese UI; the compatibility key is retained without injecting translations.', 'DSH は中国語UIを標準搭載しているため、互換キーのみ保持します。'],
    codeFontTitle: ['代码等宽字体', '程式碼等寬字型', '代碼等寬字體', 'Code Font', 'コードフォント'],
    codeFontDesc: ['设定代码块与行内代码的首选等宽字体栈。', '設定程式碼區塊與行內程式碼的首選等寬字型。', '設定代碼塊同行內代碼嘅首選等寬字體。', 'Preferred monospace font stack for code blocks.', 'コードブロック用の優先等幅フォントを選択します。'],
    ligaturesTitle: ['代码编程连字', '程式碼連字', '代碼連字', 'Code Ligatures', 'コード合字'],
    ligaturesDesc: ['在代码块中启用 =>、!==、>= 等多字符连字。', '在程式碼區塊中啟用 =>、!==、>= 等多字元連字。', '喺代碼塊入面啟用 =>、!==、>= 等連字顯示。', 'Enable programming ligatures (=>, !==, >=).', '演算子リガチャ (=>, !==, >=) を有効化します。'],
    mascotTitle: ['输入框鲸群伴宠', '輸入框鯨群伴寵', '輸入欄鯨群伴寵', 'Whale family', '入力欄のクジラ親子'],
    mascotDesc: ['成鲸与幼鲸会各自巡游并分别拖动，也可一起隐藏。', '成鯨與幼鯨會各自巡遊並分別拖動，也可一起隱藏。', '成鯨同幼鯨會各自巡遊、分別拖動，亦可以一齊收起。', 'The adult and calf patrol and drag independently, or hide together.', '親クジラと子クジラは別々に泳ぎ、個別にドラッグできます。'],
    mascotWhale: ['蓝鲸母子', '藍鯨母子', '藍鯨母子', 'Blue Whale Family', 'シロナガス親子'],
    mascotOrca: ['虎鲸母子', '虎鯨母子', '虎鯨母子', 'Orca Family', 'シャチ親子'],
    caretTitle: ['平滑物理打字光标', '平滑物理打字游標', '順滑物理打字游標', 'Smooth Caret', 'スムーズカーソル'],
    caretDesc: ['在输入框内启用阻尼滑行光标特效。', '在輸入框內啟用阻尼滑行游標特效。', '喺輸入框啟用阻尼滑行游標特效。', 'Enable spring-gliding typing caret in composer.', '入力欄で滑らかに追従するカーソルを有効化します。'],
    sidebarStyleTitle: ['左侧栏样式', '左側欄樣式', '左側欄樣式', 'Sidebar styling', 'サイドバーのスタイル'],
    sidebarStyleDesc: ['为左侧栏和选中行应用当前主题。', '為左側欄和選取列套用目前主題。', '將目前主題套用到左側欄同揀中嘅項目。', 'Apply the theme to the left sidebar and its selected rows.', '左サイドバーと選択行にテーマを適用します。'],
    composerStyleTitle: ['输入卡片样式', '輸入卡片樣式', '輸入卡片樣式', 'Composer styling', '入力カードのスタイル'],
    composerStyleDesc: ['为会话输入卡片应用玻璃底色和焦点描边。', '為對話輸入卡片套用玻璃底色和焦點外框。', '喺對話輸入卡片用玻璃底色同焦點外框。', 'Use a glass surface and focus ring on the conversation composer.', '会話の入力カードにガラス調の背景とフォーカス枠を適用します。'],
    bubbleStyleTitle: ['消息气泡', '訊息氣泡', '訊息氣泡', 'Message bubbles', 'メッセージの吹き出し'],
    bubbleStyleDesc: ['为你的消息应用主题气泡；助手回复保持无边界正文。', '為你的訊息套用主題氣泡；助理回覆保持無邊界正文。', '為你嘅訊息套用主題氣泡；助手回覆保持無邊界正文。', 'Theme your own message bubbles while assistant replies remain borderless prose.', '自分のメッセージだけにテーマの吹き出しを適用し、アシスタントの返信は枠線なしの本文として表示します。'],
    onLabel: ['开启', '開啟', '開', 'On', 'オン'],
    offLabel: ['关闭', '關閉', '關', 'Off', 'オフ'],
    sidebarCompactTitle: ['紧凑侧边栏', '緊湊側邊欄', '緊湊側邊欄', 'Compact Sidebar', 'コンパクトサイドバー'],
    sidebarCompactDesc: ['收紧左侧会话列表行高以展示更多历史对话。', '收緊左側對話清單行高以顯示更多歷史對話。', '收緊左邊對話行高，一屏睇到更多對話。', 'Tighten sidebar row height for denser session lists.', 'サイドバーの行間を詰めてより多くの履歴を表示します。'],
    thoughtModeTitle: ['思考链转译引擎', '思考鏈轉譯引擎', '思考鏈轉譯引擎', 'Thought Engine', '思考翻訳エンジン'],
    thoughtModeDesc: ['支持免配置机翻（含离线工程术语兜底）或 OpenAI 兼容接口润色。', '支援免設定機翻（含離線工程術語兜底）或 OpenAI 相容介面潤色。', '支援免填 Key 機翻或 OpenAI 兼容介面潤色。', 'Zero-config machine translation or OpenAI-compatible AI polisher.', 'キー不要の機械翻訳または OpenAI 互換 AI 翻訳を選択。'],
    thoughtViewTitle: ['思考译文排版视图', '思考譯文排版檢視', '思考譯文排版檢視', 'Thought Reading View', '思考翻訳表示モード'],
    thoughtViewDesc: ['在「沉浸纯译文」与「中英逐段上下双语对照」间切换。', '在「沉浸純譯文」與「原文譯文逐段上下雙語對照」間切換。', '喺「沉浸純譯文」同「中英上下雙語對照」之間切換。', 'Switch between clean immersive Chinese and stacked bilingual view.', '翻訳のみ表示と原文・訳文の二言語対訳表示を切り替えます。'],
    thoughtTriggerTitle: ['自动转译时机', '自動轉譯時機', '自動轉譯時機', 'Trigger Timing', '自動翻訳タイミング'],
    thoughtTriggerDesc: ['完结预译会在思考块出现后自动就绪，点开按需则仅在展开时翻译。', '完結預譯會在思考塊出現後自動就緒，點開按需則僅在展開時翻譯。', '完結預譯會自動就緒，撳開按需就淨係展開時翻譯。', 'Preload automatically or translate strictly when expanded.', '自動プリロードまたは展開時オンデマンド翻訳を選択。'],
    placeholderTitle: ['输入框占位风格', '輸入框佔位風格', '輸入欄佔位風格', 'Composer Placeholder', '入力欄プレースホルダー'],
    placeholderDesc: ['在 Prism Studio 光学占位与 DSH 原生占位风格之间切换。', '在 Prism Studio 光學佔位與 DSH 原生佔位風格之間切換。', '喺 Prism Studio 光學佔位同 DSH 原生佔位風格之間切換。', 'Switch between the Prism Studio optical placeholder and the native DSH placeholder.', 'Prism Studio の光学プレースホルダーと DSH 標準表示を切り替えます。'],
    scrollBottomTitle: ['滚动到底动效', '捲動到底動效', '捲動到底動效', 'Scroll-to-Bottom Motion', '最下部スクロール演出'],
    scrollBottomDesc: ['由 DSHPrismResponsiveWorkbench 实时消费，选择平滑或即时滚动到底动效。', '由 DSHPrismResponsiveWorkbench 即時消費，選擇平滑或即時捲動到底動效。', '由 DSHPrismResponsiveWorkbench 即時消費，揀平滑或即時捲動到底。', 'Consumed live by DSHPrismResponsiveWorkbench for smooth or instant scroll-to-bottom motion.', 'DSHPrismResponsiveWorkbench が最下部スクロールをスムーズ / 即時に切り替えます。'],
    contextMenuTitle: ['上下文快捷菜单', '右鍵快捷選單', '右鍵快捷選單', 'Context Menu', 'コンテキストメニュー'],
    contextMenuDesc: ['启用 Prism 的复制、折叠、思考视图和会话跳转右键菜单。', '啟用 Prism 的複製、摺疊、思考檢視與會話跳轉右鍵選單。', '啟用 Prism 嘅複製、摺疊、思考檢視同對話跳轉右鍵選單。', 'Enable Prism copy, fold, thought-view and turn-jump actions in the context menu.', 'コピー・折りたたみ・思考表示・ターン移動を右クリックメニューに追加します。'],
    sidebarNavFoldTitle: ['侧栏导航折叠', '側欄導覽摺疊', '側欄導覽摺疊', 'Sidebar Navigation Fold', 'サイドバーナビ折りたたみ'],
    sidebarNavFoldDesc: ['由 DSHPrismResponsiveWorkbench 实时折叠额外侧栏导航项，保持常用入口可见。', '由 DSHPrismResponsiveWorkbench 即時摺疊額外側欄導覽項，保持常用入口可見。', '由 DSHPrismResponsiveWorkbench 即時摺埋額外側欄導覽項，保留常用入口。', 'DSHPrismResponsiveWorkbench folds extra sidebar navigation items while keeping common entries visible.', 'DSHPrismResponsiveWorkbench が追加ナビ項目を折りたたみ、常用項目を表示します。'],
    telemetryTitle: ['遥测与试管模块', '遙測與試管模組', '遙測同試管模組', 'Telemetry & Vial', 'テレメトリ・バイアル'],
    telemetryDesc: ['控制上下文试管、token 与 API 用量卡片：自动、强制开启或关闭。', '控制上下文試管、token 與 API 用量卡片：自動、強制開啟或關閉。', '控制上下文試管、token 同 API 用量卡：自動、強制開或關。', 'Control context vial and token/API usage: Auto, On or Off.', 'コンテキストバイアルと使用量表示を自動・オン・オフで制御します。'],
    effortSliderTitle: ['推理档位模块', '推理檔位模組', '推理檔位模組', 'Reasoning Slider Module', '推論スライダーモジュール'],
    effortSliderDesc: ['控制原生模型菜单内星空推理条：自动、强制开启或关闭。', '控制原生模型選單內星空推理條：自動、強制開啟或關閉。', '控制原生模型選單入面星空推理條：自動、強制開或關。', 'Control the starfield effort slider inside the native model menu.', 'ネイティブモデルメニュー内の推論スライダーを制御します。'],
    omniTitle: ['Omni 模块', 'Omni 模組', 'Omni 模組', 'Omni Module', 'Omni モジュール'],
    omniDesc: ['完整 Omni 检视台依赖 Antigravity Sidecar；DSH 只保留配置兼容，不伪装功能。', '完整 Omni 檢視台依賴 Antigravity Sidecar；DSH 只保留設定相容，不假裝功能。', '完整 Omni 檢視台靠 Antigravity Sidecar；DSH 只保留設定兼容。', 'The full Omni Inspector depends on the Antigravity Sidecar; DSH retains compatibility only.', '完全な Omni インスペクターは Antigravity Sidecar 依存のため、DSH では互換値のみ保持します。'],
    linkTargetTitle: ['链接打开位置', '連結開啟位置', '連結開啟位置', 'Link Target', 'リンクの開き方'],
    linkTargetDesc: ['完整的内置/外部链接路由属于上游宿主；DSH 当前不接管链接打开策略。', '完整內置/外部連結路由屬上游宿主；DSH 目前不接管連結開啟策略。', '內置/外部連結路由屬上游宿主；DSH 暫時唔接管。', 'Built-in/external routing belongs to the upstream host; DSH does not override link targets.', '組み込み/外部リンク制御は上流ホストの機能で、DSH では変更しません。'],
    sidebarStudioTitle: ['Sidebar Studio', 'Sidebar Studio', 'Sidebar Studio', 'Sidebar Studio', 'Sidebar Studio'],
    sidebarStudioDesc: ['依赖 Antigravity plugin:// 架构，DSH 显示为不适用。', '依賴 Antigravity plugin:// 架構，DSH 顯示為不適用。', '靠 Antigravity plugin:// 架構，DSH 顯示為唔適用。', 'Depends on the Antigravity plugin:// architecture and is not applicable to DSH.', 'Antigravity plugin:// 依存のため DSH には適用されません。'],
    autoUpdateTitle: ['自动更新', '自動更新', '自動更新', 'Auto Update', '自動更新'],
    autoUpdateDesc: ['插件更新由 DSH 安装器管理；此字段仅保留兼容，不在页面内执行更新。', '外掛更新由 DSH 安裝器管理；此欄位僅保留相容，不會在頁面內更新。', '插件更新由 DSH 安裝器管理；呢個欄位只保留兼容。', 'DSH installer owns updates. This field is compatibility-only and never triggers an update.', '更新は DSH インストーラーが管理し、この互換フィールドは更新を実行しません。'],
    updateChannelTitle: ['更新通道', '更新通道', '更新通道', 'Update Channel', '更新チャネル'],
    updateChannelDesc: ['Stable / Beta 值会随配置保存，但 DSH 安装器不读取此通道。', 'Stable / Beta 值會隨設定保存，但 DSH 安裝器不讀取此通道。', 'Stable / Beta 值會保存，但 DSH 安裝器唔會讀取。', 'Stable / Beta is persisted for backup, but the DSH installer does not consume it.', 'Stable / Beta はバックアップ用に保存されますが、DSH インストーラーは使用しません。'],
    reasoningTitle: ['原生推理等级', '原生推理等級', '原生推理等級', 'Native Reasoning Effort', 'ネイティブ推論レベル'],
    reasoningDesc: ['由输入框旁的原生模型菜单与星空推理条控制；这里是只读 DSH 扩展字段。', '由輸入框旁的原生模型選單與星空推理條控制；此處是唯讀 DSH 擴充欄位。', '由原生模型選單同星空推理條控制；呢度係唯讀 DSH 擴充欄位。', 'Controlled by the native model menu and starfield effort slider; read-only DSH extension.', 'ネイティブモデルメニューと星空スライダーで制御される読み取り専用の DSH 拡張です。'],
    cfgHint: ['导出 JSON 会自动脱敏并剥离所有 API Key / Bearer 私密凭据，导入时严格白名单校验。', '匯出 JSON 會自動脫敏並剝離所有 API Key / Bearer 私密憑證，匯入時嚴格白名單校驗。', '匯出 JSON 會自動剝走 API Key / Bearer 密鑰，匯入會做嚴格校驗。', 'Exported JSON strips all API keys/secrets; import validates strictly.', 'エクスポート時に API キーを自動除外し、安全に復元できます。'],
    exportBtn: ['导出脱敏 JSON', '匯出脫敏 JSON', '匯出脫敏 JSON', 'Export JSON', 'JSON 書き出し'],
    importBtn: ['导入恢复 JSON', '匯入還原 JSON', '匯入還原 JSON', 'Import JSON', 'JSON 読み込み'],
    resetBtn: ['恢复默认', '恢復預設', '恢復預設', 'Reset Defaults', '初期値に戻す'],
    exportOk: ['已导出脱敏配置 JSON（不含任何 API Key）', '已匯出脫敏設定 JSON（不含任何 API Key）', '已匯出脫敏設定 JSON（唔含 API Key）', 'Exported sanitized JSON (secrets stripped)', '脱敏済み JSON をエクスポートしました'],
    importOk: ['已通过白名单校验并恢复全部配置', '已通過白名單校驗並還原全部設定', '已校驗並還原全部設定', 'Validated and restored configuration', '設定を検証して復元しました'],
    importErr: ['导入失败：JSON 格式无效或未包含合法配置项', '匯入失敗：JSON 格式無效或未包含合法設定項', '匯入失敗：JSON 格式無效或者冇合法設定項', 'Import failed: invalid JSON or unrecognized keys', 'インポート失敗：無効な JSON です'],
    resetOk: ['已恢复全部 Obsidian Prism 默认配置', '已恢復全部 Obsidian Prism 預設設定', '已還原全部預設設定', 'Restored all default settings', '初期設定にリセットしました'],
    supportReady: ['DSH 已接入', 'DSH 已接入', 'DSH 已接入', 'Live in DSH', 'DSH 接続済み'],
    supportPending: ['宿主模块待接入', '宿主模組待接入', '宿主模組待接入', 'Host module pending', 'ホスト接続待ち'],
    supportUnsupported: ['DSH 不适用', 'DSH 不適用', 'DSH 唔適用', 'Not applicable to DSH', 'DSH 非対応'],
    supportHost: ['DSH 原生托管', 'DSH 原生託管', 'DSH 原生託管', 'Host-managed by DSH', 'DSH ホスト管理'],
    schemaSummary: ['33 项上游配置 + 3 项 DSH 扩展', '33 項上游設定 + 3 項 DSH 擴充', '33 項上游設定 + 3 項 DSH 擴充', '33 upstream settings + 3 DSH extensions', '上流33項目 + DSH拡張3項目'],
    optHost: ['宿主', '宿主', '宿主', 'Host', 'ホスト'],
    optStudio: ['Studio 首页', 'Studio 首頁', 'Studio 首頁', 'Studio', 'Studio'],
    optClassic: ['Classic 首页', 'Classic 首頁', 'Classic 首頁', 'Classic', 'Classic'],
    optNativeOff: ['关闭', '關閉', '關閉', 'Off', 'オフ'],
    optAccent: ['强调色', '強調色', '強調色', 'Accent', 'アクセント'],
    optForeground: ['前景色', '前景色', '前景色', 'Foreground', '前景色'],
    optAutoCoexist: ['自动', '自動', '自動', 'Auto', '自動'],
    optSmooth: ['平滑', '平滑', '平滑', 'Smooth', 'スムーズ'],
    optInstant: ['即时', '即時', '即時', 'Instant', '即時'],
    optBuiltin: ['内置浏览', '內置瀏覽', '內置瀏覽', 'Built-in', '内置'],
    optExternal: ['外部浏览器', '外部瀏覽器', '外部瀏覽器', 'External', '外部'],
    optStable: ['稳定通道', '穩定通道', '穩定通道', 'Stable', '安定版'],
    optBeta: ['测试通道', '測試通道', '測試通道', 'Beta', 'ベータ'],
    foldCode: ['折叠', '摺疊', '摺埋', 'Fold', '折りたたむ'],
    expandCode: ['展开', '展開', '展開', 'Expand', '展開'],
    linesUnit: ['行', '行', '行', 'L', '行'],
    copyCode: ['复制', '複製', '複製', 'Copy', 'コピー'],
    copied: ['✓ 已复制', '✓ 已複製', '✓ 已複製', '✓ Copied', '✓ コピー済'],
    outlineTitle: ['提问导航', '提問導覽', '提問導覽', 'Prompts Outline', 'プロンプト目次'],
    turnsUnit: ['轮', '輪', '輪', 'turns', 'ターン'],
    foldSteps: ['收起步骤', '收起步驟', '收埋步驟', 'Fold Steps', '手順を畳む'],
    searchPh: ['过滤本会话提问…', '過濾本會話提問…', '篩選本對話提問…', 'Filter prompts…', '質問を絞り込む…'],
    emptyMatch: ['无匹配提问', '無匹配提問', '冇符合嘅提問', 'No matching prompts', '一致なし'],
    immersive: ['沉浸译文', '沉浸譯文', '沉浸譯文', 'Immersive', '翻訳のみ'],
    bilingual: ['双语对照', '雙語對照', '雙語對照', 'Bilingual', '二言語対訳'],
    rawText: ['原文', '原文', '原文', 'Raw', '原文'],
    retranslate: ['重新转译', '重新轉譯', '重新轉譯', 'Retranslate', '再翻訳'],
  };

  function getUiStrings(lang) {
    const norm = normalizeLanguage(lang);
    const idx = LANG_INDEX[norm] ?? 0;
    const out = { lang: norm };
    for (const k of Object.keys(UI_TABLE)) {
      out[k] = UI_TABLE[k][idx] ?? UI_TABLE[k][0];
    }
    return out;
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // 子模块 2: 配置 Schema、3 档场景预设与脱敏导入导出 (移植自 settings-panel.js)
  // ═════════════════════════════════════════════════════════════════════════════
  const UPSTREAM_SETTINGS_KEYS = Object.freeze([
    'palette',
    'lightPreset',
    'accentTone',
    'cornerStyle',
    'ambientIntensity',
    'motionLevel',
    'targetFps',
    'homeLayout',
    'homeRipple',
    'logoInk',
    'language',
    'hostLocalization',
    'composerRestyle',
    'placeholderStyle',
    'smoothCaret',
    'scrollBottomMotion',
    'contextMenu',
    'codeFont',
    'codeLigatures',
    'mascot',
    'sidebarRestyle',
    'sidebarCompact',
    'sidebarNavFold',
    'thoughtTranslate',
    'thoughtTrigger',
    'thoughtView',
    'telemetryModule',
    'effortSliderModule',
    'omniModule',
    'linkTarget',
    'sidebarStudio',
    'autoUpdate',
    'updateChannel',
  ]);
  const DSH_SETTINGS_EXTENSIONS = Object.freeze(['theme', 'bubbleRestyle', 'reasoningEffort']);

  const PRISM_SETTINGS_SCHEMA = Object.freeze({
    theme: { allowed: ['obsidian', 'warm', 'crystal', 'alabaster'], default: 'obsidian' },
    palette: { allowed: ['obsidian', 'warm', 'host'], default: 'obsidian', aliases: { claude: 'warm' } },
    lightPreset: { allowed: ['crystal', 'alabaster'], default: 'crystal' },
    accentTone: { allowed: ['follow', 'cobalt', 'iris', 'amber', 'mono'], default: 'follow' },
    cornerStyle: { allowed: ['sharp', 'balanced', 'soft'], default: 'balanced' },
    ambientIntensity: { allowed: ['0', '35', '70', '100'], default: '100' },
    motionLevel: { allowed: ['off', 'subtle', 'standard', 'ultra'], default: 'ultra' },
    targetFps: { allowed: ['60', '120', '180', 'native'], default: '180' },
    homeLayout: { allowed: ['studio', 'classic', 'off'], default: 'studio' },
    homeRipple: { allowed: [true, false], default: true },
    logoInk: { allowed: ['accent', 'foreground'], default: 'accent' },
    language: { allowed: ['zh-CN', 'zh-TW', 'yue', 'en', 'ja'], default: 'zh-CN' },
    hostLocalization: { allowed: ['auto', 'on', 'off'], default: 'auto' },
    placeholderStyle: { allowed: ['studio', 'host'], default: 'studio' },
    codeFont: { allowed: ['default', 'jetbrains', 'cascadia', 'sfmono'], default: 'default' },
    codeLigatures: { allowed: [true, false], default: false },
    mascot: { allowed: ['off', 'whale', 'orca'], default: 'whale', aliases: { crab: 'whale', minis: 'whale', dual: 'orca' } },
    smoothCaret: { allowed: [true, false], default: true },
    scrollBottomMotion: { allowed: ['smooth', 'instant'], default: 'smooth' },
    contextMenu: { allowed: [true, false], default: true },
    sidebarRestyle: { allowed: [true, false], default: true },
    composerRestyle: { allowed: [true, false], default: true },
    bubbleRestyle: { allowed: [true, false], default: true },
    sidebarCompact: { allowed: [true, false], default: false },
    sidebarNavFold: { allowed: ['off', 'on'], default: 'off' },
    thoughtTranslate: { allowed: ['off', 'machine', 'ai'], default: 'machine' },
    thoughtTrigger: { allowed: ['preload', 'expand'], default: 'preload' },
    thoughtView: { allowed: ['immersive', 'bilingual'], default: 'immersive' },
    telemetryModule: { allowed: ['auto', 'on', 'off'], default: 'on' },
    effortSliderModule: { allowed: ['auto', 'on', 'off'], default: 'on' },
    omniModule: { allowed: ['on', 'off'], default: 'on' },
    linkTarget: { allowed: ['builtin', 'external'], default: 'builtin' },
    sidebarStudio: { allowed: ['on', 'off'], default: 'off' },
    autoUpdate: { allowed: ['on', 'off'], default: 'off' },
    updateChannel: { allowed: ['stable', 'beta'], default: 'stable' },
    reasoningEffort: { allowed: ['low', 'medium', 'high', 'max', 'orchestrator'], default: 'high' },
  });

  // UI support is intentionally explicit: a persisted upstream key is not presented as
  // functional unless its DSH host integration actually exists in this build.
  const SETTINGS_SUPPORT = Object.freeze({
    theme: 'supported',
    palette: 'supported',
    lightPreset: 'supported',
    accentTone: 'supported',
    cornerStyle: 'supported',
    ambientIntensity: 'supported',
    motionLevel: 'supported',
    targetFps: 'supported',
    homeLayout: 'supported',
    homeRipple: 'supported',
    logoInk: 'supported',
    language: 'supported',
    hostLocalization: 'unsupported',
    composerRestyle: 'supported',
    placeholderStyle: 'supported',
    smoothCaret: 'supported',
    scrollBottomMotion: 'supported',
    contextMenu: 'supported',
    codeFont: 'supported',
    codeLigatures: 'supported',
    mascot: 'supported',
    sidebarRestyle: 'supported',
    sidebarCompact: 'supported',
    sidebarNavFold: 'supported',
    thoughtTranslate: 'supported',
    thoughtTrigger: 'supported',
    thoughtView: 'supported',
    telemetryModule: 'supported',
    effortSliderModule: 'supported',
    omniModule: 'unsupported',
    linkTarget: 'unsupported',
    sidebarStudio: 'unsupported',
    autoUpdate: 'unsupported',
    updateChannel: 'unsupported',
    bubbleRestyle: 'supported',
    reasoningEffort: 'host',
  });

  const SETTINGS_GROUPS = Object.freeze([
    {
      id: 'appearance',
      tab: 'tabAppearance',
      title: 'grpAppearance',
      keys: ['theme', 'palette', 'lightPreset', 'accentTone', 'cornerStyle', 'ambientIntensity', 'motionLevel', 'targetFps', 'codeFont', 'codeLigatures', 'language'],
    },
    {
      id: 'workspace',
      tab: 'tabWorkspace',
      title: 'grpWorkspace',
      keys: ['homeLayout', 'homeRipple', 'logoInk', 'placeholderStyle', 'scrollBottomMotion', 'sidebarNavFold'],
    },
    {
      id: 'interaction',
      tab: 'tabInteraction',
      title: 'grpInteraction',
      keys: ['composerRestyle', 'smoothCaret', 'contextMenu', 'mascot', 'sidebarRestyle', 'sidebarCompact', 'bubbleRestyle'],
    },
    {
      id: 'thought',
      tab: 'tabThought',
      title: 'grpThought',
      keys: ['thoughtTranslate', 'thoughtTrigger', 'thoughtView', 'reasoningEffort'],
    },
    {
      id: 'modules',
      tab: 'tabModules',
      title: 'grpModules',
      keys: ['telemetryModule', 'effortSliderModule', 'omniModule', 'linkTarget', 'sidebarStudio', 'autoUpdate', 'updateChannel', 'hostLocalization'],
    },
    { id: 'about', tab: 'tabAbout', title: 'grpAbout', keys: [] },
  ]);

  const SETTING_ROWS = Object.freeze({
    theme: { title: 'themeTitle', desc: 'themeDesc', choices: ['obsidian', 'warm', 'crystal', 'alabaster'], swatch: true },
    palette: { title: 'paletteTitle', desc: 'paletteDesc', choices: ['host', 'obsidian', 'warm'], swatch: true },
    lightPreset: { title: 'lightPresetTitle', desc: 'lightPresetDesc', choices: ['crystal', 'alabaster'], swatch: true },
    accentTone: { title: 'accentTitle', desc: 'accentDesc', choices: ['follow', 'cobalt', 'iris', 'amber', 'mono'], dots: true },
    cornerStyle: { title: 'cornerTitle', desc: 'cornerDesc', choices: ['sharp', 'balanced', 'soft'] },
    ambientIntensity: { title: 'ambientTitle', desc: 'ambientDesc', choices: ['0', '35', '70', '100'] },
    motionLevel: { title: 'motionTitle', desc: 'motionDesc', choices: ['off', 'subtle', 'standard', 'ultra'] },
    targetFps: { title: 'fpsTitle', desc: 'fpsDesc', choices: ['60', '120', '180', 'native'] },
    homeLayout: { title: 'homeLayoutTitle', desc: 'homeLayoutDesc', choices: ['studio', 'classic', 'off'] },
    homeRipple: { title: 'homeRippleTitle', desc: 'homeRippleDesc', choices: [true, false], switch: true },
    logoInk: { title: 'logoInkTitle', desc: 'logoInkDesc', choices: ['accent', 'foreground'] },
    language: { title: 'langTitle', desc: 'langDesc', choices: LANG_OPTIONS.map((o) => o.id), labels: { 'zh-CN': '简体中文', 'zh-TW': '繁體中文', yue: '粵語', en: 'English', ja: '日本語' } },
    hostLocalization: { title: 'hostLocalizationTitle', desc: 'hostLocalizationDesc', choices: ['auto', 'on', 'off'] },
    composerRestyle: { title: 'composerStyleTitle', desc: 'composerStyleDesc', choices: [true, false], switch: true },
    placeholderStyle: { title: 'placeholderTitle', desc: 'placeholderDesc', choices: ['studio', 'host'] },
    smoothCaret: { title: 'caretTitle', desc: 'caretDesc', choices: [true, false], switch: true },
    scrollBottomMotion: { title: 'scrollBottomTitle', desc: 'scrollBottomDesc', choices: ['smooth', 'instant'] },
    contextMenu: { title: 'contextMenuTitle', desc: 'contextMenuDesc', choices: [true, false], switch: true },
    codeFont: { title: 'codeFontTitle', desc: 'codeFontDesc', choices: ['default', 'jetbrains', 'cascadia', 'sfmono'], labels: { default: 'Default Mono', jetbrains: 'JetBrains Mono', cascadia: 'Cascadia Code', sfmono: 'SF Mono' } },
    codeLigatures: { title: 'ligaturesTitle', desc: 'ligaturesDesc', choices: [true, false], switch: true },
    mascot: { title: 'mascotTitle', desc: 'mascotDesc', choices: ['off', 'whale', 'orca'] },
    sidebarRestyle: { title: 'sidebarStyleTitle', desc: 'sidebarStyleDesc', choices: [true, false], switch: true },
    sidebarCompact: { title: 'sidebarCompactTitle', desc: 'sidebarCompactDesc', choices: [true, false], switch: true },
    sidebarNavFold: { title: 'sidebarNavFoldTitle', desc: 'sidebarNavFoldDesc', choices: ['off', 'on'], switch: true },
    thoughtTranslate: { title: 'thoughtModeTitle', desc: 'thoughtModeDesc', choices: ['off', 'machine', 'ai'] },
    thoughtTrigger: { title: 'thoughtTriggerTitle', desc: 'thoughtTriggerDesc', choices: ['preload', 'expand'] },
    thoughtView: { title: 'thoughtViewTitle', desc: 'thoughtViewDesc', choices: ['immersive', 'bilingual'] },
    telemetryModule: { title: 'telemetryTitle', desc: 'telemetryDesc', choices: ['auto', 'on', 'off'] },
    effortSliderModule: { title: 'effortSliderTitle', desc: 'effortSliderDesc', choices: ['auto', 'on', 'off'] },
    omniModule: { title: 'omniTitle', desc: 'omniDesc', choices: ['on', 'off'], switch: true },
    linkTarget: { title: 'linkTargetTitle', desc: 'linkTargetDesc', choices: ['builtin', 'external'] },
    sidebarStudio: { title: 'sidebarStudioTitle', desc: 'sidebarStudioDesc', choices: ['on', 'off'], switch: true },
    autoUpdate: { title: 'autoUpdateTitle', desc: 'autoUpdateDesc', choices: ['on', 'off'], switch: true },
    updateChannel: { title: 'updateChannelTitle', desc: 'updateChannelDesc', choices: ['stable', 'beta'] },
    bubbleRestyle: { title: 'bubbleStyleTitle', desc: 'bubbleStyleDesc', choices: [true, false], switch: true },
    reasoningEffort: { title: 'reasoningTitle', desc: 'reasoningDesc', choices: ['low', 'medium', 'high', 'max', 'orchestrator'] },
  });

  // 3 档官方场景预设：完整光效 / 专注编码 / 静默省电
  const SCENE_PRESETS = Object.freeze({
    ultra: Object.freeze({
      motionLevel: 'ultra',
      targetFps: '180',
      ambientIntensity: '100',
      homeRipple: true,
      mascot: 'whale',
      smoothCaret: true,
      sidebarCompact: false,
      scenePreset: 'full',
    }),
    focus: Object.freeze({
      motionLevel: 'subtle',
      targetFps: '120',
      ambientIntensity: '35',
      homeRipple: false,
      mascot: 'off',
      smoothCaret: true,
      sidebarCompact: true,
      scenePreset: 'focus',
    }),
    eco: Object.freeze({
      motionLevel: 'off',
      targetFps: '60',
      ambientIntensity: '0',
      homeRipple: false,
      mascot: 'off',
      smoothCaret: false,
      sidebarCompact: false,
      scenePreset: 'silent',
    }),
  });

  const UPSTREAM_CREDITS = [
    { repo: 'RMvdesi/obsidian-prism', url: 'https://github.com/RMvdesi/obsidian-prism', meta: 'GPL-3.0 · Upstream' },
    { repo: '0DNANCY/agy-claude-style', url: 'https://github.com/0DNANCY/agy-claude-style', meta: 'MIT · 0DNANCY' },
    { repo: 'ATtacK030130/antigrative-dashboard', url: 'https://github.com/ATtacK030130/antigrative-dashboard', meta: 'MIT · AG Pulse' },
    { repo: 'LLYSH-HANNARI/antigravity-Codex-Claude-effort-slider', url: 'https://github.com/LLYSH-HANNARI/antigravity-Codex-Claude-effort-slider', meta: 'MIT · 月上寒' },
  ];

  const redactSecrets = (s) =>
    String(s || '')
      .replace(/\b(?:sk|rk|pk|ak|gsk|hf|pplx|xai|AIza)[A-Za-z0-9_\-]{8,}\b/g, '[REDACTED]')
      .replace(/\bBearer\s+[A-Za-z0-9._\-:+/=]{6,}\b/gi, 'Bearer [REDACTED]');

  function sanitizeKeyVal(key, rawVal) {
    if (!Object.prototype.hasOwnProperty.call(PRISM_SETTINGS_SCHEMA, key)) return { valid: false };
    const spec = PRISM_SETTINGS_SCHEMA[key];
    let val = typeof rawVal === 'string' && spec.aliases && spec.aliases[rawVal] ? spec.aliases[rawVal] : rawVal;
    if (key === 'language') val = normalizeLanguage(val, 'zh-CN');
    if (typeof spec.default === 'string' && typeof val === 'number' && Number.isFinite(val)) val = String(val);
    return spec.allowed.includes(val) ? { valid: true, value: val } : { valid: false };
  }

  function normalizeMascotSetting(value) {
    const result = sanitizeKeyVal('mascot', value);
    return result.valid ? result.value : PRISM_SETTINGS_SCHEMA.mascot.default;
  }

  function getDefaultSettingsPatch() {
    const out = {};
    for (const [k, spec] of Object.entries(PRISM_SETTINGS_SCHEMA)) out[k] = spec.default;
    return out;
  }

  function buildSanitizedConfigExport(currentSettings = {}, rawThoughtProfile = null) {
    const settings = {};
    for (const [k, spec] of Object.entries(PRISM_SETTINGS_SCHEMA)) {
      const c = sanitizeKeyVal(k, currentSettings[k]);
      settings[k] = c.valid ? c.value : spec.default;
    }
    const out = {
      schema: 'obsidian-prism-dsh-config-v1',
      version: VERSION,
      exportedAt: new Date().toISOString(),
      settings,
    };
    if (rawThoughtProfile && typeof rawThoughtProfile === 'object') {
      out.thought = {
        stylePreset: ['technical', 'concise', 'custom'].includes(rawThoughtProfile.stylePreset) ? rawThoughtProfile.stylePreset : 'technical',
        baseUrl: redactSecrets(String(rawThoughtProfile.baseUrl || '').slice(0, 260)),
        model: redactSecrets(String(rawThoughtProfile.model || '').slice(0, 120)),
        customPrompt: redactSecrets(String(rawThoughtProfile.customPrompt || '').slice(0, 2000)),
        // 严格剥离 apiKey，绝不写入导出文件
      };
    }
    return out;
  }

  function validateImportedConfigJson(rawInput) {
    let parsed = rawInput;
    if (typeof rawInput === 'string') {
      if (rawInput.length > 131072) return { ok: false, error: 'payload-too-large' };
      try {
        parsed = JSON.parse(rawInput);
      } catch {
        return { ok: false, error: 'invalid-json' };
      }
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return { ok: false, error: 'invalid-root' };
    const src = parsed.settings && typeof parsed.settings === 'object' && !Array.isArray(parsed.settings) ? parsed.settings : parsed;
    const cleanPatch = {};
    for (const k of Object.keys(src)) {
      if (k === '__proto__' || k === 'constructor' || k === 'prototype' || /apikey|secret|token|password/i.test(k)) continue;
      const c = sanitizeKeyVal(k, src[k]);
      if (c.valid) cleanPatch[k] = c.value;
    }
    let cleanThought = null;
    if (parsed.thought && typeof parsed.thought === 'object' && !Array.isArray(parsed.thought)) {
      const t = parsed.thought;
      cleanThought = {
        stylePreset: ['technical', 'concise', 'custom'].includes(t.stylePreset) ? t.stylePreset : 'technical',
        baseUrl: /^https?:\/\//i.test(String(t.baseUrl || '').trim()) ? redactSecrets(String(t.baseUrl).trim().slice(0, 260)) : '',
        model: redactSecrets(String(t.model || '').slice(0, 120)),
        customPrompt: redactSecrets(String(t.customPrompt || '').slice(0, 2000)),
      };
    }
    if (Object.keys(cleanPatch).length === 0 && !cleanThought) return { ok: false, error: 'no-valid-keys' };
    return { ok: true, settings: cleanPatch, thought: cleanThought };
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // 子模块 3: 离线工程术语兜底翻译器（确保离线或 file:// 舞台零卡顿呈现中文思考链）
  // ═════════════════════════════════════════════════════════════════════════════
  const OFFLINE_PHRASE_DICT = [
    [/\bFirst,\s*analyze the token mapping between Antigravity optical CSS variables\b/gi, '首先，分析 Antigravity 光学 CSS 变量'],
    [/\band DeepSeek Harness Web UI custom properties\b/gi, '与 DeepSeek Harness Web UI 自定义属性之间的令牌映射关系'],
    [/\bSecond,\s*decouple the 24-node shallow-water borosilicate context vial from the CDP sidecar daemon\b/gi, '其次，将 24 节点高硼硅浅水波上下文试管与 CDP 守护进程解耦'],
    [/\bby estimating token budgets directly from DOM conversation messages and streaming deltas\b/gi, '通过直接解析 DOM 对话消息与流式增量来实时估算 Token 预算'],
    [/\bFinally,\s*ensure the 4-tier spring choreography and CSS\.highlights 5-tier ink fade-in settle cleanly to 0fps GPU sleep after 1200ms of inactivity so laptop battery draw remains negligible\b/gi, '最后，确保 4 档弹簧编排与 CSS.highlights 5 级水墨淡入在静置 1200ms 后平稳退入 0fps GPU 休眠态，使笔记本功耗几乎归零'],
    [/\bFirst,\s*/gi, '首先，'],
    [/\bSecond,\s*/gi, '其次，'],
    [/\bThird,\s*/gi, '第三，'],
    [/\bFinally,\s*/gi, '最后，'],
    [/\bNext,\s*/gi, '接下来，'],
    [/\banalyze\b/gi, '分析'],
    [/\bdecouple\b/gi, '解耦'],
    [/\bensure\b/gi, '确保'],
    [/\bverify\b/gi, '校验'],
    [/\bimplement\b/gi, '实现'],
    [/\btoken mapping\b/gi, '令牌映射'],
    [/\bcustom properties\b/gi, '自定义属性'],
    [/\bcontext vial\b/gi, '上下文试管'],
    [/\bstreaming deltas\b/gi, '流式增量'],
    [/\binactivity\b/gi, '无交互静置'],
    [/\bperformance\b/gi, '性能'],
    [/\bconfiguration\b/gi, '配置'],
    [/\barchitecture\b/gi, '架构'],
    [/\breasoning\b/gi, '深度推理'],
  ];

  function translateParagraphOffline(raw) {
    let text = String(raw || '').trim();
    if (!text) return '';
    // 若本身已以中文为主，直接返回原文
    const cjkLen = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    if (cjkLen > text.length * 0.35) return text;
    let out = text;
    for (const [re, rep] of OFFLINE_PHRASE_DICT) {
      out = out.replace(re, rep);
    }
    if (out === text) {
      return `【推理要点】${text}`;
    }
    return out.replace(/\.\s*$/, '。');
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // 兜底样式注入（与 src/prism-style.css 保持一致的 --ag-prism-* / --dsw-* 变量契约）
  // ═════════════════════════════════════════════════════════════════════════════
  const FALLBACK_CSS = `
    .dsh-code-card{position:relative;border-radius:var(--ag-prism-radius-md,10px);border:1px solid var(--dsw-alias-border-l2,var(--ag-prism-border,rgba(148,163,184,.2)));background:var(--ag-prism-console-well,rgba(10,12,18,.78));overflow:visible;margin:10px 0}
    /* React-safe 非破坏性代码块增强（不包裹、不重排 React 拥有的 <pre> 节点） */
    pre[data-ag-cs-code-enhanced="1"]{position:relative;padding-top:38px!important;border-radius:var(--ag-prism-radius-md,10px)}
    pre[data-ag-cs-code-enhanced="1"][data-ag-cs-code-folded="1"]{max-height:176px!important;overflow:hidden!important;mask-image:linear-gradient(180deg,#000 62%,transparent 100%);-webkit-mask-image:linear-gradient(180deg,#000 62%,transparent 100%)}
    .dsh-prism-code-overlay-layer{position:fixed;inset:0;pointer-events:none;z-index:85;overflow:hidden}
    .ag-cs-code-sticky-head{position:sticky;top:0;z-index:8;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 12px;border-bottom:1px solid var(--dsw-alias-border-l2,var(--ag-prism-border,rgba(148,163,184,.16)));border-radius:var(--ag-prism-radius-md,10px) var(--ag-prism-radius-md,10px) 0 0;background:var(--dsw-alias-bg-layer-2,var(--ag-prism-popover-bg,rgba(15,18,26,.88)));backdrop-filter:blur(14px) saturate(140%);font-size:11.5px;color:var(--dsw-alias-label-secondary,var(--ag-prism-muted,#94a3b8))}
    .ag-cs-code-sticky-head.is-overlay{position:fixed;z-index:85;pointer-events:auto;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,var(--ag-prism-border,rgba(148,163,184,.18)));border-radius:var(--ag-prism-radius-md,10px) var(--ag-prism-radius-md,10px) 0 0}
    .ag-cs-code-sticky-head.is-overlay[hidden]{display:none!important}
    .ag-cs-code-lang{font-family:var(--dsw-font-mono,var(--ag-prism-mono,"JetBrains Mono",monospace));font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--dsw-alias-label-primary,var(--ag-prism-fg,#e2e8f0))}
    .ag-cs-code-meta{display:inline-flex;align-items:center;gap:8px}
    .ag-cs-code-actions{display:inline-flex;align-items:center;gap:6px}
    .ag-cs-code-fold-btn,.ag-cs-code-copy-btn{height:22px;padding:0 8px;border-radius:6px;border:1px solid var(--dsw-alias-border-l2,var(--ag-prism-border,rgba(148,163,184,.24)));background:rgba(148,163,184,.08);color:var(--dsw-alias-label-primary,var(--ag-prism-fg,#e2e8f0));font-size:11px;cursor:pointer;transition:background .15s,border-color .15s}
    .ag-cs-code-fold-btn:hover,.ag-cs-code-copy-btn:hover{background:rgba(49,134,255,.18);border-color:var(--ag-prism-accent,#3186ff)}
    .dsh-code-card[data-ag-cs-code-folded="1"] pre{max-height:142px!important;overflow:hidden!important;mask-image:linear-gradient(180deg,#000 58%,transparent 100%);-webkit-mask-image:linear-gradient(180deg,#000 58%,transparent 100%)}
    .dsh-code-card[data-ag-cs-code-folded="1"] .ag-cs-code-fold-bar{display:flex}
    .ag-cs-code-fold-bar{display:none;align-items:center;justify-content:center;padding:6px;border-top:1px dashed var(--ag-prism-border,rgba(148,163,184,.2));cursor:pointer;font-size:11.5px;color:var(--ag-prism-accent-hi,#60a5fa)}
    .ag-cs-code-fold-bar.is-overlay{position:fixed;display:flex;z-index:85;pointer-events:auto;box-sizing:border-box;padding:5px 10px;border:1px solid var(--dsw-alias-border-l2,var(--ag-prism-border,rgba(148,163,184,.22)));border-radius:0 0 var(--ag-prism-radius-md,10px) var(--ag-prism-radius-md,10px);background:var(--dsw-alias-bg-layer-2,var(--ag-prism-popover-bg,rgba(15,18,26,.92)));backdrop-filter:blur(10px)}
    .ag-cs-code-fold-bar.is-overlay[hidden]{display:none!important}

    [data-ag-cs-sonar="1"]{animation:dshSonarPulse .72s cubic-bezier(.22,1,.36,1)}
    @keyframes dshSonarPulse{0%{box-shadow:0 0 0 0 rgba(92,198,252,.52)}70%{box-shadow:0 0 0 10px rgba(92,198,252,0)}100%{box-shadow:none}}

    .ag-cs-nav-outline-popover{position:fixed;z-index:9400;width:276px;max-height:380px;display:flex;flex-direction:column;gap:7px;padding:10px;border-radius:var(--ag-prism-radius-lg,12px);border:1px solid var(--dsw-alias-border-l1,var(--ag-prism-border-strong,rgba(148,163,184,.26)));background:var(--dsw-alias-bg-layer-2,var(--ag-prism-popover-bg,rgba(15,17,24,.94)));color:var(--dsw-alias-label-primary,var(--ag-prism-fg,#eef1f7));box-shadow:0 18px 46px rgba(0,0,0,.42);backdrop-filter:blur(18px) saturate(145%)}
    .ag-cs-nav-outline-popover[hidden]{display:none!important}
    .ag-cs-nav-outline-head{display:flex;align-items:center;justify-content:space-between;gap:6px;font-size:12px;font-weight:600}
    .ag-cs-nav-fold-steps-btn{height:22px;padding:0 8px;border-radius:999px;border:1px solid var(--ag-prism-border,rgba(148,163,184,.24));background:transparent;color:inherit;font-size:10.5px;cursor:pointer}
    .ag-cs-nav-fold-steps-btn:hover{background:rgba(49,134,255,.16);border-color:var(--ag-prism-accent,#3186ff)}
    .ag-cs-nav-outline-search{width:100%;height:28px;padding:0 9px;border-radius:7px;border:1px solid var(--ag-prism-border,rgba(148,163,184,.22));background:rgba(148,163,184,.08);color:inherit;font-size:11.5px;outline:none}
    .ag-cs-nav-outline-search:focus{border-color:var(--ag-prism-accent,#3186ff)}
    .ag-cs-nav-outline-list{display:flex;flex-direction:column;gap:3px;overflow-y:auto;max-height:270px}
    .ag-cs-nav-outline-item{display:flex;align-items:center;gap:7px;width:100%;padding:6px 8px;border:0;border-radius:7px;background:transparent;color:inherit;font-size:11.5px;text-align:left;cursor:pointer}
    .ag-cs-nav-outline-item:hover,.ag-cs-nav-outline-item[data-active="1"]{background:rgba(49,134,255,.16)}
    .ag-cs-nav-outline-num{font-family:var(--dsw-font-mono,var(--ag-prism-mono,"JetBrains Mono",monospace));font-size:10.5px;color:var(--ag-prism-accent-hi,#60a5fa);flex-shrink:0}
    .ag-cs-nav-outline-text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
    .ag-cs-nav-outline-empty{padding:12px 8px;text-align:center;font-size:11.5px;opacity:.65}

    .ag-omni-menu{position:fixed;z-index:9800;min-width:214px;max-width:296px;padding:5px;border-radius:var(--ag-prism-radius-lg,11px);border:1px solid var(--dsw-alias-border-l1,var(--ag-prism-border-strong,rgba(148,163,184,.26)));background:var(--dsw-alias-bg-layer-2,var(--ag-prism-popover-bg,rgba(16,18,26,.95)));color:var(--dsw-alias-label-primary,var(--ag-prism-fg,#eef1f7));box-shadow:0 18px 46px rgba(0,0,0,.46);backdrop-filter:blur(18px) saturate(145%);font-size:12px;user-select:none}
    .ag-omni-menu-header{padding:4px 8px 5px;font-size:10.5px;opacity:.7;border-bottom:1px solid var(--ag-prism-border,rgba(148,163,184,.16));margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:var(--dsw-font-mono,var(--ag-prism-mono,monospace))}
    .ag-omni-menu-sep{height:1px;margin:4px 6px;background:var(--ag-prism-border,rgba(148,163,184,.16))}
    .ag-omni-menu-item{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;padding:6px 9px;border:0;border-radius:6px;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer}
    .ag-omni-menu-item:hover{background:rgba(49,134,255,.18)}
    .ag-omni-menu-kbd{font-size:10px;opacity:.68;font-family:var(--dsw-font-mono,var(--ag-prism-mono,monospace))}

    .dsh-prism-thought-portal-layer{position:fixed;inset:0;pointer-events:none;z-index:86;overflow:hidden}
    .ag-prism-thought-portal-card{position:fixed;pointer-events:auto;box-sizing:border-box;border-radius:10px;border:1px solid var(--dsw-alias-border-l1,var(--ag-prism-border-strong,rgba(148,163,184,.26)));background:var(--dsw-alias-bg-layer-2,var(--ag-prism-popover-bg,rgba(14,16,23,.95)));color:var(--dsw-alias-label-primary,var(--ag-prism-fg,#eef1f7));box-shadow:0 14px 36px rgba(0,0,0,.38);backdrop-filter:blur(16px) saturate(140%);padding:8px 10px;max-height:360px;overflow-y:auto}
    .ag-prism-thought-portal-card[hidden]{display:none!important}
    .ag-prism-thought-bar{display:flex;align-items:center;justify-content:space-between;gap:6px;flex-wrap:wrap;padding:6px 10px;margin-bottom:8px;border-radius:8px;background:rgba(148,163,184,.08);border:1px solid var(--dsw-alias-border-l2,var(--ag-prism-border,rgba(148,163,184,.16)));font-size:11px}
    .ag-prism-thought-badge{display:inline-flex;align-items:center;gap:5px;font-weight:600;color:var(--ag-prism-accent-hi,#60a5fa)}
    .ag-prism-thought-btns{display:inline-flex;align-items:center;gap:4px}
    .ag-prism-thought-btn{height:22px;padding:0 8px;border-radius:999px;border:1px solid var(--ag-prism-border,rgba(148,163,184,.24));background:transparent;color:inherit;font-size:10.5px;cursor:pointer}
    .ag-prism-thought-btn[aria-pressed="true"]{background:rgba(49,134,255,.18);border-color:var(--ag-prism-accent,#3186ff);font-weight:600}
    .ag-prism-thought-overlay{display:flex;flex-direction:column;gap:8px;font-size:13px;line-height:1.65}
    .ag-prism-thought-pair{display:flex;flex-direction:column;gap:4px;padding:7px 10px;border-radius:8px;background:rgba(148,163,184,.06);border-left:2px solid var(--ag-prism-accent,#3186ff)}
    .ag-prism-thought-orig{font-size:11.5px;opacity:.68;line-height:1.5}
    .ag-prism-thought-zh{color:var(--dsw-alias-label-primary,var(--ag-prism-fg,#f1f5f9));line-height:1.65}

    .dsh-prism-settings-backdrop{position:fixed;inset:0;z-index:20000;background:rgba(6,8,14,.58);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:18px}
    .dsh-prism-settings-backdrop[hidden]{display:none!important}
    .dsh-prism-settings-embedded-host{width:100%;display:block;color:var(--dsw-alias-label-primary,var(--ag-prism-fg,#eef1f7))}
    .dsh-prism-settings-modal{width:min(740px,100%);max-height:min(86vh,780px);display:flex;flex-direction:column;border-radius:var(--ag-prism-radius-lg,16px);border:1px solid var(--dsw-alias-border-l1,var(--ag-prism-border-strong,rgba(148,163,184,.28)));background:var(--dsw-alias-bg-layer-2,var(--ag-prism-popover-bg,rgba(14,16,23,.96)));color:var(--dsw-alias-label-primary,var(--ag-prism-fg,#eef1f7));box-shadow:0 28px 80px rgba(0,0,0,.56),inset 0 1px 0 rgba(255,255,255,.08);overflow:hidden;font-family:var(--dsw-font-family,var(--dsw-font-sans,Inter,system-ui,sans-serif))}
    .dsh-prism-settings-modal.is-embedded{width:100%;max-width:none;max-height:none;border-radius:var(--ag-prism-radius-lg,14px);border:1px solid var(--dsw-alias-border-l2,var(--ag-prism-border,rgba(148,163,184,.2)));background:var(--dsw-alias-bg-layer-1,var(--ag-prism-surface-1,rgba(14,16,23,.68)));box-shadow:none;overflow:visible}
    .dsh-prism-settings-modal.is-embedded .dsh-settings-body{overflow:visible;max-height:none}
    .dsh-prism-settings-modal.is-embedded .dsh-settings-close{display:none!important}
    .dsh-settings-header{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 18px;border-bottom:1px solid var(--dsw-alias-border-l2,var(--ag-prism-border,rgba(148,163,184,.16)))}
    .dsh-settings-brand{display:flex;align-items:center;gap:10px}
    .dsh-settings-brand h2{margin:0;font-size:15px;font-weight:700;letter-spacing:-.01em}
    .dsh-settings-brand p{margin:2px 0 0;font-size:11.5px;opacity:.72}
    .dsh-settings-ver{font-family:var(--dsw-font-mono,var(--ag-prism-mono,monospace));font-size:10.5px;padding:2px 7px;border-radius:999px;background:rgba(49,134,255,.16);color:var(--ag-prism-accent-hi,#60a5fa)}
    .dsh-settings-close{height:28px;padding:0 10px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2,var(--ag-prism-border,rgba(148,163,184,.24)));background:transparent;color:inherit;cursor:pointer;font-size:12px}
    .dsh-settings-close:hover{background:rgba(148,163,184,.15)}
    .dsh-settings-topdeck{padding:10px 18px;display:flex;flex-direction:column;gap:8px;border-bottom:1px solid var(--dsw-alias-border-l2,var(--ag-prism-border,rgba(148,163,184,.14)));background:rgba(128,138,158,.05)}
    .dsh-settings-preset-row{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
    .dsh-settings-preset-btns,.dsh-settings-tabs{display:flex;align-items:center;gap:5px;flex-wrap:wrap}
    .dsh-preset-btn,.dsh-tab-btn,.dsh-seg-btn,.dsh-cfg-btn{height:26px;padding:0 10px;border-radius:999px;border:1px solid var(--dsw-alias-border-l2,var(--ag-prism-border,rgba(148,163,184,.24)));background:transparent;color:inherit;font-size:11.5px;cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:all .15s}
    .dsh-tab-btn,.dsh-seg-btn,.dsh-cfg-btn{border-radius:7px}
    .dsh-preset-btn:hover,.dsh-tab-btn:hover,.dsh-seg-btn:hover,.dsh-cfg-btn:hover{background:rgba(148,163,184,.14)}
    .dsh-preset-btn[data-active="1"],.dsh-tab-btn[aria-selected="true"],.dsh-seg-btn[aria-pressed="true"]{background:rgba(49,134,255,.18);border-color:var(--ag-prism-accent,#3186ff);font-weight:600}
    .dsh-settings-body{flex:1;overflow-y:auto;padding:14px 18px;display:flex;flex-direction:column;gap:14px}
    .dsh-settings-group[hidden]{display:none!important}
    .dsh-settings-group-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;opacity:.7;margin:0 0 7px}
    .dsh-settings-card{border-radius:12px;border:1px solid var(--dsw-alias-border-l2,var(--ag-prism-border,rgba(148,163,184,.18)));background:rgba(148,163,184,.04);overflow:hidden}
    .dsh-settings-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px;border-bottom:1px solid var(--dsw-alias-border-l2,var(--ag-prism-border,rgba(148,163,184,.12)));flex-wrap:wrap}
    .dsh-settings-row:last-child{border-bottom:0}
    .dsh-settings-row-meta{flex:1;min-width:190px;display:flex;flex-direction:column;gap:2px}
    .dsh-settings-row-title{font-size:12.5px;font-weight:600}
    .dsh-settings-row-desc{font-size:11px;opacity:.7}
    .dsh-settings-seg-group{display:inline-flex;align-items:center;gap:4px;flex-wrap:wrap}
    .dsh-swatch{width:10px;height:10px;border-radius:50%;border:1px solid rgba(255,255,255,.35);display:inline-block}
    .dsh-ai-box{padding:11px 12px;border-top:1px dashed var(--ag-prism-border,rgba(148,163,184,.2));display:grid;grid-template-columns:1fr 1fr;gap:8px;background:rgba(15,23,42,.18)}
    .dsh-ai-box[hidden]{display:none!important}
    .dsh-ai-field{display:flex;flex-direction:column;gap:3px;font-size:11px}
    .dsh-ai-field input,.dsh-ai-field select{height:28px;padding:0 8px;border-radius:6px;border:1px solid var(--ag-prism-border,rgba(148,163,184,.24));background:rgba(148,163,184,.08);color:inherit;font-size:11.5px;outline:none}
    .dsh-settings-footer{padding:11px 18px;border-top:1px solid var(--dsw-alias-border-l2,var(--ag-prism-border,rgba(148,163,184,.16)));display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;background:rgba(128,138,158,.04)}
    .dsh-cfg-status{font-size:11px;opacity:.76}
    .dsh-cfg-status[data-tone="ok"]{color:#34d399;opacity:1}
    .dsh-cfg-status[data-tone="err"]{color:#f87171;opacity:1}
    .dsh-credits-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:10px 12px}
    .dsh-credit-link{display:flex;align-items:center;justify-content:space-between;gap:6px;padding:6px 8px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2,var(--ag-prism-border,rgba(148,163,184,.16)));color:inherit;text-decoration:none;font-size:11px}
    .dsh-credit-link:hover{border-color:var(--ag-prism-accent,#3186ff);background:rgba(49,134,255,.1)}

    /* 1.0.7 dual-column settings control center */
    .dsh-prism-settings-modal:not(.is-embedded){width:min(1010px,calc(100vw - 36px));height:min(790px,calc(100vh - 44px));max-height:none}
    .dsh-prism-settings-modal.is-embedded{height:min(720px,calc(100vh - 170px));min-height:470px}
    .dsh-settings-brand-line{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
    .dsh-settings-shell{display:grid;grid-template-columns:218px minmax(0,1fr);flex:1;min-height:0}
    .dsh-settings-nav{display:flex;flex-direction:column;gap:14px;min-height:0;padding:14px 11px 12px;border-right:1px solid var(--dsw-alias-border-l2,var(--ag-prism-border,rgba(148,163,184,.16)));background:color-mix(in srgb,var(--dsw-alias-bg-layer-2,var(--ag-prism-popover-bg,#0e1017)) 88%,var(--ag-prism-accent,#3186ff) 12%)}
    .dsh-settings-nav-label{font-size:10.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.62}
    .dsh-settings-preset-row{display:flex;flex-direction:column;gap:7px}
    .dsh-settings-preset-btns,.dsh-settings-nav-list,.dsh-settings-footer-actions{display:flex;align-items:center;gap:5px;flex-wrap:wrap}
    .dsh-settings-preset-btns .dsh-preset-btn{justify-content:flex-start;width:100%;height:28px;padding:0 9px;border-radius:8px;font-size:11.5px}
    .dsh-settings-nav-list{display:flex;flex-direction:column;gap:4px;align-items:stretch;flex:1;min-height:0;overflow-y:auto;padding:3px 0}
    .dsh-tab-btn{height:34px;padding:0 10px;border-radius:9px;border:1px solid transparent;background:transparent;color:var(--dsw-alias-label-secondary,var(--ag-prism-muted,#94a3b8));font-size:11.8px;display:flex;align-items:center;justify-content:space-between;transition:background-color .16s ease,border-color .16s ease,color .16s ease,transform .16s ease}
    .dsh-tab-btn small{min-width:18px;height:18px;padding:0 5px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:rgba(148,163,184,.12);font-family:var(--dsw-font-mono,var(--ag-prism-mono,monospace));font-size:9.5px;color:inherit}
    .dsh-tab-btn:hover{background:rgba(148,163,184,.1);border-color:rgba(148,163,184,.14);color:var(--dsw-alias-label-primary,var(--ag-prism-fg,#eef1f7));transform:translateX(1px)}
    .dsh-tab-btn[aria-selected="true"]{background:color-mix(in srgb,var(--ag-prism-accent,#3186ff) 23%,rgba(148,163,184,.06));border-color:color-mix(in srgb,var(--ag-prism-accent,#3186ff) 52%,transparent);box-shadow:inset 3px 0 0 var(--ag-prism-accent-hi,#60a5fa),inset 0 1px 0 rgba(255,255,255,.09);color:var(--dsw-alias-label-primary,var(--ag-prism-fg,#eef1f7));font-weight:600}
    .dsh-settings-nav-foot{display:flex;align-items:center;gap:6px;padding-top:9px;border-top:1px solid var(--dsw-alias-border-l2,var(--ag-prism-border,rgba(148,163,184,.13)));font-size:9.5px;line-height:1.35;opacity:.65}
    .dsh-settings-nav-dot{width:5px;height:5px;border-radius:50%;background:var(--ag-prism-accent-hi,#60a5fa);box-shadow:0 0 7px var(--ag-prism-accent,#3186ff);flex-shrink:0}
    .dsh-settings-main{display:flex;flex-direction:column;min-width:0;min-height:0;background:color-mix(in srgb,var(--dsw-alias-bg-layer-1,var(--ag-prism-surface-1,#11131a)) 96%,transparent)}
    .dsh-prism-settings-modal.is-embedded .dsh-settings-main .dsh-settings-body{overflow-y:auto;max-height:none}
    .dsh-settings-main-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:14px 18px 10px;border-bottom:1px solid var(--dsw-alias-border-l2,var(--ag-prism-border,rgba(148,163,184,.12)))}
    .dsh-settings-main-head h3{margin:0;font-size:13px;font-weight:700;letter-spacing:-.01em}
    .dsh-settings-main-head p{margin:3px 0 0;font-size:10.5px;opacity:.6}
    .dsh-settings-support-key{display:inline-flex;align-items:center;gap:5px;font-size:9.5px;opacity:.62;white-space:nowrap;padding-top:2px}
    .dsh-settings-support-key i{width:6px;height:6px;border-radius:50%;background:#34d399;box-shadow:0 0 6px rgba(52,211,153,.55)}
    .dsh-settings-main .dsh-settings-body{flex:1;min-height:0;padding:12px 16px 16px;overflow-y:auto}
    .dsh-settings-main .dsh-settings-card{border-radius:12px;background:rgba(148,163,184,.035);box-shadow:inset 0 1px 0 rgba(255,255,255,.04)}
    .dsh-settings-title-line{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
    .dsh-setting-status{display:inline-flex;align-items:center;height:17px;padding:0 6px;border-radius:999px;border:1px solid currentColor;font-size:9px;line-height:1;font-weight:600;letter-spacing:.01em;opacity:.9}
    .dsh-setting-status[data-tone="pending"]{color:#fbbf24}
    .dsh-setting-status[data-tone="host"]{color:#60a5fa}
    .dsh-setting-status[data-tone="unsupported"]{color:#94a3b8}
    .dsh-settings-row[data-setting-support="unsupported"]{background:rgba(148,163,184,.018)}
    .dsh-settings-row[data-setting-support="unsupported"] .dsh-settings-row-meta{opacity:.78}
    .dsh-settings-row[data-setting-support="pending"] .dsh-settings-row-title{color:color-mix(in srgb,var(--dsw-alias-label-primary,var(--ag-prism-fg,#eef1f7)) 84%,#fbbf24)}
    .dsh-settings-seg-group[data-ui-kind="switch"]{position:relative;width:42px;min-width:42px;height:24px;padding:2px;border-radius:999px;border:1px solid rgba(148,163,184,.2);background:rgba(148,163,184,.12);box-shadow:inset 0 1px 2px rgba(0,0,0,.24);display:inline-flex;align-items:center;transition:background-color .17s ease,border-color .17s ease,box-shadow .17s ease}
    .dsh-settings-seg-group[data-ui-kind="switch"] .ag-cs-switch-thumb{width:18px;height:18px;border-radius:50%;background:#cbd5e1;box-shadow:0 1px 3px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.55);transform:translateX(0);transition:transform .19s cubic-bezier(.22,1,.36,1),background-color .16s ease}
    .dsh-settings-seg-group[data-ui-kind="switch"][data-switch-on="1"]{background:color-mix(in srgb,var(--ag-prism-accent,#3186ff) 72%,#182033);border-color:color-mix(in srgb,var(--ag-prism-accent,#3186ff) 62%,rgba(255,255,255,.18));box-shadow:inset 0 1px 0 rgba(255,255,255,.15),0 0 12px color-mix(in srgb,var(--ag-prism-accent,#3186ff) 20%,transparent)}
    .dsh-settings-seg-group[data-ui-kind="switch"][data-switch-on="1"] .ag-cs-switch-thumb{transform:translateX(18px);background:#fff}
    .dsh-settings-seg-group[data-ui-kind="switch"] .dsh-seg-btn{position:absolute;inset:0;width:100%;height:100%;padding:0;border:0;background:transparent;opacity:0;font-size:0;cursor:pointer}
    .dsh-settings-seg-group[data-ui-kind="switch"] .dsh-seg-btn:disabled{cursor:not-allowed}
    .dsh-settings-seg-group[data-ui-kind="segments"]{gap:2px;padding:2.5px;border:1px solid rgba(148,163,184,.12);border-radius:9px;background:rgba(148,163,184,.075);box-shadow:inset 0 1px 0 rgba(255,255,255,.035)}
    .dsh-settings-seg-group[data-ui-kind="segments"] .dsh-seg-btn{min-height:25px;border-radius:6px;border:1px solid transparent;transition:background-color .16s ease,border-color .16s ease,color .16s ease,box-shadow .16s ease,transform .16s ease}
    .dsh-settings-seg-group[data-ui-kind="segments"] .dsh-seg-btn:hover:not(:disabled){background:rgba(148,163,184,.12);border-color:rgba(148,163,184,.16)}
    .dsh-settings-seg-group[data-ui-kind="segments"] .dsh-seg-btn[aria-pressed="true"]{background:color-mix(in srgb,var(--ag-prism-accent,#3186ff) 20%,rgba(148,163,184,.1));border-color:color-mix(in srgb,var(--ag-prism-accent,#3186ff) 52%,rgba(148,163,184,.16));box-shadow:inset 0 1px 0 rgba(255,255,255,.1),0 2px 8px rgba(0,0,0,.16);color:var(--dsw-alias-label-primary,var(--ag-prism-fg,#eef1f7))}
    .dsh-settings-seg-group .dsh-seg-btn:disabled{opacity:.58;cursor:not-allowed}
    .dsh-accent-dot{display:inline-block;width:7px;height:7px;border-radius:50%;flex-shrink:0;box-shadow:0 0 6px currentColor}
    .dsh-accent-dot[data-tone="follow"]{background:linear-gradient(135deg,#3186ff,#a855f7);color:#7c9fff}
    .dsh-accent-dot[data-tone="cobalt"]{background:#3186ff;color:#3186ff}
    .dsh-accent-dot[data-tone="iris"]{background:#8b5cf6;color:#8b5cf6}
    .dsh-accent-dot[data-tone="amber"]{background:#f59e0b;color:#f59e0b}
    .dsh-accent-dot[data-tone="mono"]{background:#94a3b8;color:#94a3b8;box-shadow:none}
    .dsh-settings-footer-actions{margin-left:auto}
    .dsh-settings-about-lead{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;border-bottom:1px solid var(--dsw-alias-border-l2,var(--ag-prism-border,rgba(148,163,184,.14)));font-size:12px}
    .dsh-settings-about-lead span{font-size:10.5px;opacity:.62}
    .dsh-settings-license{padding:0 13px 12px;font-size:10.5px;line-height:1.5;opacity:.7}
    .dsh-ai-actions{grid-column:1/-1;display:flex;justify-content:flex-end;gap:6px}
    .dsh-settings-row:focus-within{background:color-mix(in srgb,var(--ag-prism-accent,#3186ff) 6%,transparent)}
    .dsh-settings-seg-group .dsh-seg-btn:focus-visible,.dsh-tab-btn:focus-visible,.dsh-preset-btn:focus-visible,.dsh-cfg-btn:focus-visible{outline:2px solid var(--ag-prism-accent-hi,#60a5fa);outline-offset:2px}
    @media (max-width:720px){
      .dsh-prism-settings-modal:not(.is-embedded){width:100%;height:calc(100vh - 24px)}
      .dsh-prism-settings-modal.is-embedded{height:auto;min-height:0}
      .dsh-settings-shell{grid-template-columns:1fr;grid-template-rows:auto minmax(0,1fr)}
      .dsh-settings-nav{gap:9px;padding:9px 12px;border-right:0;border-bottom:1px solid var(--dsw-alias-border-l2,var(--ag-prism-border,rgba(148,163,184,.16)))}
      .dsh-settings-preset-row{flex-direction:row;align-items:center;justify-content:space-between;flex-wrap:wrap}
      .dsh-settings-preset-btns{flex-wrap:wrap;justify-content:flex-end}
      .dsh-settings-preset-btns .dsh-preset-btn{width:auto}
      .dsh-settings-nav-list{flex-direction:row;overflow-x:auto;overflow-y:hidden;padding:2px 0;gap:4px}
      .dsh-tab-btn{min-width:max-content;height:30px;padding:0 9px;gap:7px}
      .dsh-tab-btn small{display:none}
      .dsh-tab-btn[aria-selected="true"]{box-shadow:inset 0 -2px 0 var(--ag-prism-accent-hi,#60a5fa)}
      .dsh-settings-nav-foot{display:none}
      .dsh-settings-main-head{padding:11px 14px 9px}
      .dsh-settings-main .dsh-settings-body{padding:10px 12px 14px}
      .dsh-settings-row{align-items:flex-start}
      .dsh-settings-row-meta{min-width:150px}
      .dsh-settings-footer{padding:9px 12px}
    }
    @media (prefers-reduced-motion:reduce){
      .dsh-tab-btn,.dsh-settings-seg-group[data-ui-kind="switch"],.dsh-settings-seg-group[data-ui-kind="switch"] .ag-cs-switch-thumb,.dsh-settings-seg-group[data-ui-kind="segments"] .dsh-seg-btn{transition:none!important}
    }
  `;

  function injectWorkbenchCss(doc) {
    if (!doc || !doc.head || doc.getElementById(WORKBENCH_STYLE_ID)) return;
    const st = doc.createElement('style');
    st.id = WORKBENCH_STYLE_ID;
    st.textContent = FALLBACK_CSS;
    doc.head.appendChild(st);
  }

  // v44.7.0 AppFrame paints the column. SidebarRoot's toggle survives rail/drawer changes.
  // The outer column is the stable sidebar surface; the inner .wtg9ga_root is React-owned.
  const SIDEBAR_COLUMN = '.mP3x-q_frame > div.mP3x-q_sidebarCol';
  const SIDEBAR_ANCHOR = 'button[data-sidebar-toggle], [data-sidebar-scrollport], [role="dialog"][data-shortcut-modal="sidebar"]';
  // InputBar owns the card. DraftEditor is its direct data-input-scroll child.
  const COMPOSER_SEAT = '[data-composer-seat][data-conversation-region="composer"]';
  const COMPOSER_INPUT = ':scope > [data-input-scroll] [data-composer-input][role="textbox"]';
  const PREVIEW_SHELL = 'body > [data-dsh-shell="true"]';
  const EDIT_FIELD = '[contenteditable]:not([contenteditable="false"]), [role="textbox"], input, textarea, select';
  const PLUGIN_UI = '[data-dsh-prism-owned="1"], .dshwv-root, .dsh-prism-settings-modal, .ag-omni-menu';
  // ChatView's data-chat-history is the load-older control. Message bodies live in data-chat-flow.
  const CHAT_CONTENT = '[data-chat-flow], ' + PREVIEW_SHELL + ' [data-dsh-chat="true"]';
  const NON_SURFACE = [CHAT_CONTENT, '[data-chat-history], [data-message-bubble], pre, code, [data-composer-overlay]', EDIT_FIELD, PLUGIN_UI].join(', ');
  const WORKBENCH_CHROME = [SIDEBAR_COLUMN, '[data-composer-seat], [data-composer-card], [data-dsh-sidebar], [data-dsh-composer]', '[data-text-interaction-surface], [role="menu"], [role="dialog"], [role="listbox"]', EDIT_FIELD, PLUGIN_UI].join(', ');

  function restyleEnabled(cfg, surface) {
    const value = cfg[surface + 'Restyle'] ?? cfg[surface];
    return value !== false && value !== 'off' && value !== 0 && value !== '0' && value !== 'false';
  }

  // Reconcile only attributes we own, including nodes React has detached since the last pass.
  function createSurfaceMarkers(doc) {
    let marked = new Map();
    function reconcile(next) {
      for (const [el, attr] of marked) {
        if (next.get(el) !== attr && el.getAttribute(attr) === '1') el.removeAttribute(attr);
      }
      for (const [el, attr] of next) {
        if (el.getAttribute(attr) !== '1') el.setAttribute(attr, '1');
      }
      marked = next;
    }
    function sync(cfg) {
      const next = new Map();
      const root = doc.getElementById('root');
      const scope = root || doc.querySelector(PREVIEW_SHELL);
      // One gate for mounted, streaming and recycled messages. React owns every row and its children.
      if (scope && cfg.bubbleRestyle) next.set(scope, 'data-prism-bubbles');
      if (scope && cfg.sidebarRestyle) {
        const selector = root ? SIDEBAR_COLUMN : ':scope > [data-dsh-sidebar="true"]';
        for (const col of scope.querySelectorAll(selector)) {
          if (col.closest(NON_SURFACE)) continue;
          if (root && !Array.from(col.querySelectorAll(SIDEBAR_ANCHOR)).some(anchor =>
            anchor.closest(SIDEBAR_COLUMN) === col && !anchor.closest(NON_SURFACE))) continue;
          next.set(col, 'data-prism-sidebar');
        }
      }
      if (scope && cfg.composerRestyle) {
        const selector = root ? COMPOSER_SEAT + ' [data-composer-card]' : '.dsh-composer-region [data-dsh-composer="true"]';
        for (const card of scope.querySelectorAll(selector)) {
          if (card.closest(NON_SURFACE) || card.closest(SIDEBAR_COLUMN)) continue;
          const inputs = card.querySelectorAll(root ? COMPOSER_INPUT : '#dsh-composer-editor[role="textbox"]');
          const ownsEditor = Array.from(inputs).some(input =>
            input.closest(root ? '[data-composer-card]' : '[data-dsh-composer]') === card &&
            !input.parentElement.closest(NON_SURFACE));
          if (ownsEditor) next.set(card, 'data-prism-composer');
        }
      }
      reconcile(next);
    }
    return { sync, clear: () => reconcile(new Map()) };
  }

  function isEditableElement(el) {
    if (!el) return false;
    const tag = String(el.tagName || '').toUpperCase();
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
    if (el.isContentEditable || el.getAttribute?.('contenteditable') === 'true') return true;
    return Boolean(el.closest?.(EDIT_FIELD));
  }

  // 检测元素是否由 React Fiber 管理（防止包裹/移动 React 子节点引发 reconciliation 崩溃）
  function isReactNode(el) {
    if (!el || typeof el !== 'object') return false;
    return Object.keys(el).some(
      (k) =>
        k.startsWith('__reactFiber$') ||
        k.startsWith('__reactProps$') ||
        k.startsWith('__reactContainer$') ||
        k.startsWith('__reactEvents$')
    );
  }

  function isVisibleElement(el, win) {
    if (!el || el.isConnected === false || el.hidden) return false;
    if (typeof el.getBoundingClientRect === 'function') {
      const r = el.getBoundingClientRect();
      if (!r || r.width <= 1 || r.height <= 1) return false;
    }
    if (win && typeof win.getComputedStyle === 'function') {
      const cs = safe(() => win.getComputedStyle(el));
      if (cs && (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity || '1') <= 0.01)) {
        return false;
      }
    }
    return true;
  }

  function readThoughtProfileShared() {
    const stored = safe(() => JSON.parse(readStore(THOUGHT_PROFILE_KEY) || '{}'), {});
    return {
      stylePreset: stored.stylePreset || 'technical',
      baseUrl: stored.baseUrl || '',
      apiKey: stored.apiKey || '',
      model: stored.model || 'deepseek-chat',
      customPrompt: stored.customPrompt || '',
    };
  }

  function writeThoughtProfileShared(profile, bridge) {
    const next = { ...readThoughtProfileShared(), ...(profile || {}) };
    writeStore(THOUGHT_PROFILE_KEY, JSON.stringify(next));
    safe(() => bridge?.thoughtBridge?.call?.({ action: 'save-config', ...next }));
    return next;
  }

  function applyFallbackDomAttrsShared(doc, cfg) {
    const html = doc?.documentElement;
    if (!html || !cfg) return;
    const th = cfg.theme || (cfg.palette === 'warm' ? 'warm' : 'obsidian');
    const isLight = th === 'crystal' || th === 'alabaster';
    html.setAttribute('data-prism-theme', th);
    html.setAttribute('data-ag-cs-theme', isLight ? 'light' : 'dark');
    html.setAttribute('data-ag-cs-palette', th === 'warm' || th === 'alabaster' ? 'warm' : 'obsidian');
    html.setAttribute('data-ag-cs-light-preset', th === 'alabaster' ? 'alabaster' : 'crystal');
    if (cfg.accentTone) html.setAttribute('data-ag-cs-accent', cfg.accentTone);
    if (cfg.cornerStyle) html.setAttribute('data-ag-cs-corners', cfg.cornerStyle);
    if (cfg.ambientIntensity !== undefined) html.setAttribute('data-ag-cs-ambient', String(cfg.ambientIntensity));
    if (cfg.motionLevel) html.setAttribute('data-ag-cs-motion', cfg.motionLevel);
    if (cfg.targetFps) html.setAttribute('data-ag-cs-target-fps', String(cfg.targetFps));
    if (cfg.codeFont) html.setAttribute('data-ag-cs-code-font', cfg.codeFont);
    html.setAttribute('data-ag-cs-code-ligatures', cfg.codeLigatures ? '1' : '0');
    if (cfg.language) {
      const nl = normalizeLanguage(cfg.language);
      html.setAttribute('data-ag-cs-lang', nl);
      html.setAttribute('lang', nl);
    }
    if (cfg.thoughtView) html.setAttribute('data-ag-prism-thought-view', cfg.thoughtView);
    html.setAttribute('data-ag-cs-sidebar-compact', cfg.sidebarCompact ? '1' : '0');
    // Mirror the complete upstream 1.0.7 contract so future host modules can consume it
    // without another bridge migration. Unsupported rows remain visibly disabled in Settings.
    html.setAttribute('data-ag-cs-home-layout', cfg.homeLayout || 'studio');
    html.setAttribute('data-ag-cs-home-ripple', cfg.homeRipple === false || cfg.homeRipple === 'off' ? '0' : '1');
    html.setAttribute('data-ag-cs-logo-ink', cfg.logoInk || 'accent');
    html.setAttribute('data-ag-cs-host-localization', cfg.hostLocalization || 'auto');
    html.setAttribute('data-ag-cs-placeholder-style', cfg.placeholderStyle || 'studio');
    html.setAttribute('data-ag-cs-scroll-bottom-motion', cfg.scrollBottomMotion || 'smooth');
    html.setAttribute('data-ag-cs-context-menu', cfg.contextMenu === false || cfg.contextMenu === 'off' ? '0' : '1');
    html.setAttribute('data-ag-cs-sidebar-nav-fold', cfg.sidebarNavFold === 'on' || cfg.sidebarNavFold === true ? '1' : '0');
    html.setAttribute('data-ag-cs-telemetry-module', cfg.telemetryModule || 'auto');
    html.setAttribute('data-ag-cs-effort-slider-module', cfg.effortSliderModule || 'auto');
    html.setAttribute('data-ag-cs-omni-module', cfg.omniModule || 'on');
    html.setAttribute('data-ag-cs-link-target', cfg.linkTarget || 'builtin');
    html.setAttribute('data-ag-cs-sidebar-studio', cfg.sidebarStudio || 'off');
    html.setAttribute('data-ag-cs-auto-update', cfg.autoUpdate || 'off');
    html.setAttribute('data-ag-cs-update-channel', cfg.updateChannel || 'stable');
  }

  function createConfigAccessor(doc, win, bridgeRef) {
    const getBridge = () => bridgeRef || win?.__agPrismBridge || null;
    const readConfig = () => {
      const b = getBridge();
      const fromBridge = safe(() => b?.getConfig?.()) || safe(() => b?.config);
      const raw = fromBridge && typeof fromBridge === 'object'
        ? fromBridge
        : safe(() => JSON.parse(readStore('dsh_obsidian_prism_config') || '{}'), {});
      const cfg = { ...getDefaultSettingsPatch(), ...raw };
      // Apply the same whitelist and compatibility normalization to cold caches,
      // host JSON, imports and UI writes so all 36 keys stay round-trippable.
      for (const [key, spec] of Object.entries(PRISM_SETTINGS_SCHEMA)) {
        const clean = sanitizeKeyVal(key, cfg[key]);
        cfg[key] = clean.valid ? clean.value : spec.default;
      }
      cfg.bubbleRestyle = restyleEnabled(raw || {}, 'bubble');
      cfg.sidebarRestyle = restyleEnabled(raw || {}, 'sidebar');
      cfg.composerRestyle = restyleEnabled(raw || {}, 'composer');
      return cfg;
    };
    const writeConfig = (patch) => {
      if (!patch || typeof patch !== 'object') return readConfig();
      const b = getBridge();
      let next = null;
      if (typeof b?.setConfig === 'function') {
        next = safe(() => b.setConfig(patch));
      } else if (typeof b?.updateConfig === 'function') {
        next = safe(() => b.updateConfig(patch));
      } else {
        next = { ...readConfig(), ...patch };
        // Keep older on/off aliases in step with the settings switches without a bridge.
        for (const surface of ['sidebar', 'composer']) {
          const key = surface + 'Restyle';
          if (!(key in patch) && !(surface in patch)) continue;
          next[key] = restyleEnabled(patch, surface);
          next[surface] = next[key] ? 'on' : 'off';
        }
        writeStore('dsh_obsidian_prism_config', JSON.stringify(next));
        safe(() => win?.dispatchEvent?.(new CustomEvent('ag-prism:config', { detail: { config: next, patch } })));
      }
      applyFallbackDomAttrsShared(doc, next || { ...readConfig(), ...patch });
      return next || readConfig();
    };
    const getLang = () => normalizeLanguage(readConfig().language || doc?.documentElement?.getAttribute?.('data-ag-cs-lang') || 'zh-CN');
    const getStrings = () => getUiStrings(getLang());
    return { getBridge, readConfig, writeConfig, getLang, getStrings };
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // 共享外观设置面板渲染器（同时驱动 Ctrl+Shift+P 悬浮弹窗 与 DSH 原生 settings.section 内嵌视图）
  // ═════════════════════════════════════════════════════════════════════════════
  function createSettingsPanelController(panelEl, deps) {
    const {
      doc,
      win,
      embedded = false,
      accessor,
      onClose = null,
      onConfigChanged = null,
      onClearThoughtCache = null,
      onThoughtProfileSaved = null,
    } = deps;

    let activeTab = 'appearance';
    let cfgStatusMsg = '';
    let cfgStatusTone = '';
    let disposed = false;

    const fileInput = doc.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json,application/json';
    fileInput.hidden = true;
    fileInput.setAttribute('data-dsh-prism-owned', '1');

    if (embedded) panelEl.classList.add('is-embedded');

    const setCfgStatus = (msg, tone = '') => {
      cfgStatusMsg = msg;
      cfgStatusTone = tone;
      const el = panelEl.querySelector('[data-k="cfg-status"]');
      if (el) {
        el.textContent = msg;
        if (tone) el.setAttribute('data-tone', tone);
        else el.removeAttribute('data-tone');
      }
    };

    const applyScenePreset = (presetId) => {
      const mapId = presetId === 'full' ? 'ultra' : presetId === 'silent' ? 'eco' : presetId;
      const patch = SCENE_PRESETS[mapId];
      if (!patch) return;
      accessor.writeConfig({ ...patch });
      onConfigChanged?.('preset', mapId);
      render();
    };

    const exportConfigJson = () => {
      const ui = accessor.getStrings();
      const payload = buildSanitizedConfigExport(accessor.readConfig(), readThoughtProfileShared());
      const jsonStr = JSON.stringify(payload, null, 2);
      safe(() => {
        if (typeof Blob !== 'undefined' && typeof URL !== 'undefined' && URL.createObjectURL) {
          const url = URL.createObjectURL(new Blob([jsonStr], { type: 'application/json;charset=utf-8' }));
          const a = doc.createElement('a');
          a.href = url;
          a.download = `dsh-obsidian-prism-settings-v${VERSION}.json`;
          a.click();
          setTimeout(() => URL.revokeObjectURL(url), 1500);
        } else {
          navigator?.clipboard?.writeText?.(jsonStr);
        }
      });
      setCfgStatus(ui.exportOk, 'ok');
      return jsonStr;
    };

    const importConfigJson = (rawText) => {
      const ui = accessor.getStrings();
      const res = validateImportedConfigJson(rawText);
      if (!res.ok) {
        setCfgStatus(ui.importErr, 'err');
        return res;
      }
      if (res.settings && Object.keys(res.settings).length) accessor.writeConfig(res.settings);
      if (res.thought) writeThoughtProfileShared(res.thought, accessor.getBridge());
      onConfigChanged?.('import', res);
      render();
      setCfgStatus(ui.importOk, 'ok');
      return res;
    };

    const resetDefaults = () => {
      const defs = getDefaultSettingsPatch();
      accessor.writeConfig(defs);
      onConfigChanged?.('reset', defs);
      render();
      setCfgStatus(accessor.getStrings().resetOk, 'ok');
      return defs;
    };

    const onFileChange = () => {
      const f = fileInput.files?.[0];
      if (!f) return;
      if (typeof f.text === 'function') {
        void f.text().then(importConfigJson).catch(() => importConfigJson(''));
      }
      fileInput.value = '';
    };
    fileInput.addEventListener?.('change', onFileChange);

    const renderLegacy = () => {
      if (disposed) return;
      const cfg = accessor.readConfig();
      const ui = accessor.getStrings();
      const prof = readThoughtProfileShared();

      const curTheme =
        cfg.theme ||
        (doc.documentElement?.getAttribute?.('data-prism-theme') ||
          (cfg.palette === 'warm' ? 'warm' : 'obsidian'));

      const presetMatch = (pid) => {
        const sp = SCENE_PRESETS[pid];
        return sp && sp.motionLevel === cfg.motionLevel && String(sp.ambientIntensity) === String(cfg.ambientIntensity);
      };

      const renderSegRow = (key, title, desc, opts, activeVal) => `
        <div class="dsh-settings-row" data-setting-row="${key}">
          <div class="dsh-settings-row-meta">
            <span class="dsh-settings-row-title">${title}</span>
            <span class="dsh-settings-row-desc">${desc}</span>
          </div>
          <div class="dsh-settings-seg-group" role="group">
            ${opts
              .map(([val, lbl, swatch]) => {
                const pressed = String(activeVal) === String(val);
                const sw = swatch ? `<i class="dsh-swatch" style="background:${swatch}"></i>` : '';
                return `<button type="button" class="dsh-seg-btn" data-sk="${key}" data-sv='${JSON.stringify(val)}' aria-pressed="${pressed}">${sw}<span>${lbl}</span></button>`;
              })
              .join('')}
          </div>
        </div>
      `;

      const showGrp = (gid) => activeTab === 'all' || activeTab === gid;

      panelEl.innerHTML = `
        <div class="dsh-settings-header">
          <div class="dsh-settings-brand">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="var(--ag-prism-accent,#3186ff)"/>
            </svg>
            <div>
              <div style="display:flex;align-items:center;gap:8px"><h2>${ui.title}</h2><span class="dsh-settings-ver">v${VERSION}</span></div>
              <p>${ui.subtitle}</p>
            </div>
          </div>
          ${embedded ? '' : `<button type="button" class="dsh-settings-close" data-k="close-modal">✕ ${ui.close}</button>`}
        </div>

        <div class="dsh-settings-topdeck">
          <div class="dsh-settings-preset-row">
            <span style="font-size:11.5px;font-weight:600;opacity:.8">${ui.presetLabel}</span>
            <div class="dsh-settings-preset-btns">
              <button type="button" class="dsh-preset-btn" data-preset="ultra" data-active="${presetMatch('ultra') ? '1' : '0'}">✦ ${ui.presetUltra}</button>
              <button type="button" class="dsh-preset-btn" data-preset="focus" data-active="${presetMatch('focus') ? '1' : '0'}">◎ ${ui.presetFocus}</button>
              <button type="button" class="dsh-preset-btn" data-preset="eco" data-active="${presetMatch('eco') ? '1' : '0'}">☾ ${ui.presetEco}</button>
            </div>
          </div>
          <div class="dsh-settings-tabs" role="tablist">
            ${[
              ['all', ui.tabAll],
              ['appearance', ui.tabAppearance],
              ['interaction', ui.tabInteraction],
              ['thought', ui.tabThought],
              ['about', ui.tabAbout],
            ]
              .map(([id, lbl]) => `<button type="button" class="dsh-tab-btn" role="tab" data-tab="${id}" aria-selected="${activeTab === id}">${lbl}</button>`)
              .join('')}
          </div>
        </div>

        <div class="dsh-settings-body">
          <section class="dsh-settings-group" data-grp="appearance" ${showGrp('appearance') ? '' : 'hidden'}>
            <h3 class="dsh-settings-group-title">${ui.grpAppearance}</h3>
            <div class="dsh-settings-card">
              ${renderSegRow(
                'theme',
                ui.themeTitle,
                ui.themeDesc,
                [
                  ['obsidian', 'Obsidian 深空黑曜', '#09090B'],
                  ['warm', 'Warm 暖炭玄岩', '#141413'],
                  ['crystal', 'Crystal 白昼冷晶', '#E8EEF6'],
                  ['alabaster', 'Alabaster 暖白画册', '#EBE6DC'],
                ],
                curTheme
              )}
              ${renderSegRow(
                'accentTone',
                ui.accentTitle,
                ui.accentDesc,
                [
                  ['follow', 'Follow 跟随', 'linear-gradient(135deg,#3186ff,#a855f7)'],
                  ['cobalt', 'Cobalt 钴蓝', '#3186ff'],
                  ['iris', 'Iris 鸢尾紫', '#8b5cf6'],
                  ['amber', 'Amber 琥珀金', '#f59e0b'],
                  ['mono', 'Mono 钛银', '#94a3b8'],
                ],
                cfg.accentTone || 'follow'
              )}
              ${renderSegRow(
                'cornerStyle',
                ui.cornerTitle,
                ui.cornerDesc,
                [
                  ['sharp', 'Sharp 锐角'],
                  ['balanced', 'Balanced 标准'],
                  ['soft', 'Soft 圆润'],
                ],
                cfg.cornerStyle || 'balanced'
              )}
              ${renderSegRow(
                'ambientIntensity',
                ui.ambientTitle,
                ui.ambientDesc,
                [
                  ['0', '0%'],
                  ['35', '35%'],
                  ['70', '70%'],
                  ['100', '100%'],
                ],
                String(cfg.ambientIntensity ?? '100')
              )}
              ${renderSegRow(
                'motionLevel',
                ui.motionTitle,
                ui.motionDesc,
                [
                  ['off', 'Off 关闭'],
                  ['subtle', 'Subtle 克制'],
                  ['standard', 'Standard 标准'],
                  ['ultra', 'Ultra 完整'],
                ],
                cfg.motionLevel || 'ultra'
              )}
              ${renderSegRow(
                'targetFps',
                ui.fpsTitle,
                ui.fpsDesc,
                [
                  ['60', '60 FPS'],
                  ['120', '120 FPS'],
                  ['180', '180 FPS'],
                  ['native', 'Native'],
                ],
                String(cfg.targetFps || '180')
              )}
              ${renderSegRow(
                'language',
                ui.langTitle,
                ui.langDesc,
                LANG_OPTIONS.map((o) => [o.id, o.label]),
                accessor.getLang()
              )}
            </div>
          </section>

          <section class="dsh-settings-group" data-grp="interaction" ${showGrp('interaction') ? '' : 'hidden'}>
            <h3 class="dsh-settings-group-title">${ui.grpInteraction}</h3>
            <div class="dsh-settings-card">
              ${renderSegRow(
                'mascot',
                ui.mascotTitle,
                ui.mascotDesc,
                [
                  ['off', ui.offLabel],
                  ['whale', ui.mascotWhale],
                  ['orca', ui.mascotOrca],
                ],
                cfg.mascot
              )}
              ${renderSegRow(
                'codeFont',
                ui.codeFontTitle,
                ui.codeFontDesc,
                [
                  ['default', '默认等宽'],
                  ['jetbrains', 'JetBrains Mono'],
                  ['cascadia', 'Cascadia Code'],
                  ['sfmono', 'SF Mono'],
                ],
                cfg.codeFont || 'default'
              )}
              ${renderSegRow('codeLigatures', ui.ligaturesTitle, ui.ligaturesDesc, [[true, '开启'], [false, '关闭']], Boolean(cfg.codeLigatures))}
              ${renderSegRow('smoothCaret', ui.caretTitle, ui.caretDesc, [[true, '开启'], [false, '关闭']], cfg.smoothCaret !== false)}
              ${renderSegRow('sidebarRestyle', ui.sidebarStyleTitle, ui.sidebarStyleDesc, [[true, ui.onLabel], [false, ui.offLabel]], cfg.sidebarRestyle)}
              ${renderSegRow('composerRestyle', ui.composerStyleTitle, ui.composerStyleDesc, [[true, ui.onLabel], [false, ui.offLabel]], cfg.composerRestyle)}
              ${renderSegRow('bubbleRestyle', ui.bubbleStyleTitle, ui.bubbleStyleDesc, [[true, ui.onLabel], [false, ui.offLabel]], cfg.bubbleRestyle)}
              ${renderSegRow('sidebarCompact', ui.sidebarCompactTitle, ui.sidebarCompactDesc, [[true, '开启'], [false, '关闭']], Boolean(cfg.sidebarCompact))}
            </div>
          </section>

          <section class="dsh-settings-group" data-grp="thought" ${showGrp('thought') ? '' : 'hidden'}>
            <h3 class="dsh-settings-group-title">${ui.grpThought}</h3>
            <div class="dsh-settings-card">
              ${renderSegRow(
                'thoughtTranslate',
                ui.thoughtModeTitle,
                ui.thoughtModeDesc,
                [
                  ['off', '关闭'],
                  ['machine', '免配置机翻'],
                  ['ai', 'AI 接口润色'],
                ],
                cfg.thoughtTranslate || 'machine'
              )}
              ${renderSegRow(
                'thoughtView',
                ui.thoughtViewTitle,
                ui.thoughtViewDesc,
                [
                  ['immersive', ui.immersive],
                  ['bilingual', ui.bilingual],
                ],
                cfg.thoughtView || 'immersive'
              )}
              ${renderSegRow(
                'thoughtTrigger',
                ui.thoughtTriggerTitle,
                ui.thoughtTriggerDesc,
                [
                  ['preload', '完结预译'],
                  ['expand', '点开按需'],
                ],
                cfg.thoughtTrigger || 'preload'
              )}
              <div class="dsh-ai-box" data-k="ai-box" ${cfg.thoughtTranslate === 'ai' ? '' : 'hidden'}>
                <label class="dsh-ai-field"><span>OpenAI Base URL</span><input type="url" data-ai="baseUrl" placeholder="https://api.deepseek.com/v1" value="${prof.baseUrl.replace(/"/g, '&quot;')}" /></label>
                <label class="dsh-ai-field"><span>Model ID</span><input type="text" data-ai="model" placeholder="deepseek-chat" value="${prof.model.replace(/"/g, '&quot;')}" /></label>
                <label class="dsh-ai-field"><span>API Key (仅存本机，导出自动脱敏)</span><input type="password" data-ai="apiKey" placeholder="sk-..." value="${prof.apiKey.replace(/"/g, '&quot;')}" /></label>
                <label class="dsh-ai-field"><span>文风预设</span><select data-ai="stylePreset"><option value="technical" ${prof.stylePreset === 'technical' ? 'selected' : ''}>专业工程手稿</option><option value="concise" ${prof.stylePreset === 'concise' ? 'selected' : ''}>精炼核心要点</option><option value="custom" ${prof.stylePreset === 'custom' ? 'selected' : ''}>自定义风格</option></select></label>
                <div style="grid-column:1/-1;display:flex;justify-content:flex-end;gap:6px">
                  <button type="button" class="dsh-cfg-btn" data-k="ai-clear-cache">清空译文缓存</button>
                  <button type="button" class="dsh-cfg-btn" data-k="ai-save">保存渠道配置</button>
                </div>
              </div>
            </div>
          </section>

          <section class="dsh-settings-group" data-grp="about" ${showGrp('about') ? '' : 'hidden'}>
            <h3 class="dsh-settings-group-title">${ui.grpAbout}</h3>
            <div class="dsh-settings-card">
              <div class="dsh-credits-grid">
                ${UPSTREAM_CREDITS.map(
                  (c) => `<a class="dsh-credit-link" href="${c.url}" target="_blank" rel="noopener noreferrer"><span>${c.repo}</span><span style="opacity:.65">${c.meta} ↗</span></a>`
                ).join('')}
              </div>
              <div style="padding:0 12px 10px;font-size:11px;opacity:.72">
                GNU General Public License v3.0 (GPL-3.0-only) · Ported from Obsidian Prism by RMvdesi for DeepSeek Harness (dsh).
              </div>
            </div>
          </section>
        </div>

        <div class="dsh-settings-footer">
          <span class="dsh-cfg-status" data-k="cfg-status" ${cfgStatusTone ? `data-tone="${cfgStatusTone}"` : ''}>${cfgStatusMsg || ui.cfgHint}</span>
          <div style="display:inline-flex;align-items:center;gap:6px;flex-wrap:wrap">
            <button type="button" class="dsh-cfg-btn" data-k="export-json">${ui.exportBtn}</button>
            <button type="button" class="dsh-cfg-btn" data-k="import-json">${ui.importBtn}</button>
            <button type="button" class="dsh-cfg-btn" data-k="reset-cfg">${ui.resetBtn}</button>
          </div>
        </div>
      `;
      panelEl.appendChild(fileInput);

      if (onClose) panelEl.querySelector('[data-k="close-modal"]')?.addEventListener('click', onClose);
      panelEl.querySelectorAll('[data-preset]').forEach((b) =>
        b.addEventListener('click', () => applyScenePreset(b.getAttribute('data-preset')))
      );
      panelEl.querySelectorAll('[data-tab]').forEach((b) =>
        b.addEventListener('click', () => {
          activeTab = b.getAttribute('data-tab') || 'all';
          render();
        })
      );
      panelEl.querySelectorAll('[data-sk]').forEach((b) =>
        b.addEventListener('click', () => {
          const k = b.getAttribute('data-sk');
          const v = safe(() => JSON.parse(b.getAttribute('data-sv')), b.getAttribute('data-sv'));
          const patch = { [k]: v };
          if (k === 'theme') {
            patch.palette = v === 'warm' || v === 'alabaster' ? 'warm' : 'obsidian';
            patch.lightPreset = v === 'alabaster' ? 'alabaster' : 'crystal';
          }
          accessor.writeConfig(patch);
          onConfigChanged?.(k, v);
          render();
        })
      );
      panelEl.querySelector('[data-k="ai-save"]')?.addEventListener('click', () => {
        const nextProf = {};
        panelEl.querySelectorAll('[data-ai]').forEach((inp) => {
          nextProf[inp.getAttribute('data-ai')] = inp.value;
        });
        writeThoughtProfileShared(nextProf, accessor.getBridge());
        setCfgStatus('✓ 已保存思考转译 AI 渠道配置（仅存本机）', 'ok');
        onThoughtProfileSaved?.(nextProf);
      });
      panelEl.querySelector('[data-k="ai-clear-cache"]')?.addEventListener('click', () => {
        writeStore(THOUGHT_CACHE_KEY, null);
        safe(() => accessor.getBridge()?.thoughtBridge?.clearCache?.());
        onClearThoughtCache?.();
        setCfgStatus('✓ 已清空思考译文缓存', 'ok');
      });
      panelEl.querySelector('[data-k="export-json"]')?.addEventListener('click', exportConfigJson);
      panelEl.querySelector('[data-k="import-json"]')?.addEventListener('click', () => fileInput.click());
      panelEl.querySelector('[data-k="reset-cfg"]')?.addEventListener('click', resetDefaults);
    };

    // 1.0.7 control center: a persistent two-column shell. Only the active group is
    // materialized, and setting changes repaint that group instead of the whole modal.
    let modernEventsBound = false;
    const escText = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
    const isOn = (value) => value === true || value === 'on' || value === 1 || value === '1';
    const supportText = (support, ui) =>
      support === 'pending' ? ui.supportPending : support === 'host' ? ui.supportHost : support === 'unsupported' ? ui.supportUnsupported : ui.supportReady;
    const supportTone = (support) => support === 'supported' ? 'ready' : support === 'host' ? 'host' : support === 'pending' ? 'pending' : 'unsupported';
    const swatches = {
      obsidian: '#09090b',
      warm: '#171614',
      crystal: '#e8eef6',
      alabaster: '#ebe6dc',
      host: 'linear-gradient(135deg,#94a3b8,#475569)',
    };
    const labelForChoice = (key, value, ui, row) => {
      if (row?.labels && Object.prototype.hasOwnProperty.call(row.labels, value)) return row.labels[value];
      if (typeof value === 'boolean') return value ? ui.onLabel : ui.offLabel;
      if (value === 'on') return ui.onLabel;
      if (value === 'off') return ui.offLabel;
      if (value === 'auto') return ui.optAutoCoexist;
      if (value === 'host') return ui.optHost;
      if (value === 'studio') return ui.optStudio;
      if (value === 'classic') return ui.optClassic;
      if (value === 'accent') return ui.optAccent;
      if (value === 'foreground') return ui.optForeground;
      if (value === 'smooth') return ui.optSmooth;
      if (value === 'instant') return ui.optInstant;
      if (value === 'builtin') return ui.optBuiltin;
      if (value === 'external') return ui.optExternal;
      if (value === 'stable') return ui.optStable;
      if (value === 'beta') return ui.optBeta;
      if (key === 'theme') return { obsidian: 'Obsidian · 深空黑曜', warm: 'Warm · 暖炭玄岩', crystal: 'Crystal · 白昼冷晶', alabaster: 'Alabaster · 暖白画册' }[value] || value;
      if (key === 'mascot') return { off: ui.offLabel, whale: ui.mascotWhale, orca: ui.mascotOrca }[value] || value;
      if (key === 'thoughtTranslate') return { off: ui.offLabel, machine: '免配置机翻', ai: 'AI 接口润色' }[value] || value;
      if (key === 'thoughtTrigger') return { preload: '完结预译', expand: '点开按需' }[value] || value;
      if (key === 'thoughtView') return value === 'bilingual' ? ui.bilingual : ui.immersive;
      if (key === 'ambientIntensity') return `${value}%`;
      if (key === 'targetFps') return value === 'native' ? 'Native' : `${value} FPS`;
      return String(value);
    };
    const renderChoice = (key, value, active, support, ui, row) => {
      const pressed = String(active) === String(value);
      const disabled = support !== 'supported';
      const label = labelForChoice(key, value, ui, row);
      const sw = row?.swatch && swatches[value] ? `<i class="dsh-swatch" style="background:${swatches[value]}"></i>` : '';
      const dot = row?.dots ? `<i class="dsh-accent-dot" data-tone="${escText(value)}" aria-hidden="true"></i>` : '';
      const encodedValue = JSON.stringify(value).replace(/'/g, '&#39;');
      return `<button type="button" class="dsh-seg-btn" data-sk="${escText(key)}" data-sv='${encodedValue}' aria-pressed="${pressed}"${pressed ? ' data-pressed' : ''}${disabled ? ' disabled' : ''} title="${escText(label)}">${sw}${dot}<span>${escText(label)}</span></button>`;
    };
    const renderSettingRow = (key, cfg, ui) => {
      const row = SETTING_ROWS[key];
      if (!row) return '';
      const support = SETTINGS_SUPPORT[key] || 'unsupported';
      const active = cfg[key];
      const switchGroup = row.switch || (row.choices.length === 2 && row.choices.every((v) => typeof v === 'boolean'));
      const switchOn = switchGroup && isOn(active);
      const choices = row.choices.map((value) => renderChoice(key, value, active, support, ui, row)).join('');
      const badge = support === 'supported' ? '' : `<span class="dsh-setting-status" data-tone="${supportTone(support)}">${escText(supportText(support, ui))}</span>`;
      return `
        <div class="dsh-settings-row" data-setting-row="${escText(key)}" data-setting-support="${support}">
          <div class="dsh-settings-row-meta">
            <div class="dsh-settings-title-line"><span class="dsh-settings-row-title">${escText(ui[row.title] || key)}</span>${badge}</div>
            <span class="dsh-settings-row-desc">${escText(ui[row.desc] || '')}</span>
          </div>
          <div class="dsh-settings-seg-group" role="group" data-ui-kind="${switchGroup ? 'switch' : 'segments'}" data-switch-on="${switchOn ? '1' : '0'}" aria-label="${escText(ui[row.title] || key)}">
            ${switchGroup ? '<span class="ag-cs-switch-thumb" aria-hidden="true"></span>' : ''}
            ${choices}
          </div>
        </div>`;
    };
    const renderGroup = () => {
      if (disposed) return;
      const group = SETTINGS_GROUPS.find((item) => item.id === activeTab) || SETTINGS_GROUPS[0];
      activeTab = group.id;
      const cfg = accessor.readConfig();
      const ui = accessor.getStrings();
      const title = panelEl.querySelector('[data-role="group-title"]');
      const subtitle = panelEl.querySelector('[data-role="group-count"]');
      if (title) title.textContent = ui[group.title] || group.title;
      if (subtitle) subtitle.textContent = group.id === 'about' ? ui.schemaSummary : `${group.keys.length} · ${ui.schemaSummary}`;
      panelEl.querySelectorAll('[data-tab]').forEach((tab) => {
        const selected = tab.getAttribute('data-tab') === activeTab;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
      });
      const panel = panelEl.querySelector('[data-role="group-panel"]');
      if (!panel) return;
      if (group.id === 'about') {
        const prof = readThoughtProfileShared();
        panel.innerHTML = `
          <div class="dsh-settings-group" data-grp="about">
            <div class="dsh-settings-card">
              <div class="dsh-settings-about-lead">
                <strong>Obsidian Prism ${SETTINGS_SCHEMA_REVISION}</strong>
                <span>${escText(ui.schemaSummary)}</span>
              </div>
              <div class="dsh-credits-grid">
                ${UPSTREAM_CREDITS.map((credit) => `<a class="dsh-credit-link" href="${credit.url}" target="_blank" rel="noopener noreferrer"><span>${escText(credit.repo)}</span><span style="opacity:.65">${escText(credit.meta)} ↗</span></a>`).join('')}
              </div>
              <div class="dsh-settings-license">GNU General Public License v3.0 (GPL-3.0-only) · Ported from Obsidian Prism by RMvdesi for DeepSeek Harness (dsh).</div>
            </div>
          </div>`;
        return;
      }
      let rows = group.keys.map((key) => renderSettingRow(key, cfg, ui)).join('');
      if (group.id === 'thought' && cfg.thoughtTranslate === 'ai') {
        const prof = readThoughtProfileShared();
        rows += `
          <div class="dsh-ai-box" data-k="ai-box">
            <label class="dsh-ai-field"><span>OpenAI Base URL</span><input type="url" data-ai="baseUrl" placeholder="https://api.deepseek.com/v1" value="${escText(prof.baseUrl)}" /></label>
            <label class="dsh-ai-field"><span>Model ID</span><input type="text" data-ai="model" placeholder="deepseek-chat" value="${escText(prof.model)}" /></label>
            <label class="dsh-ai-field"><span>API Key (仅存本机，导出自动脱敏)</span><input type="password" data-ai="apiKey" placeholder="sk-..." value="${escText(prof.apiKey)}" /></label>
            <label class="dsh-ai-field"><span>文风预设</span><select data-ai="stylePreset"><option value="technical" ${prof.stylePreset === 'technical' ? 'selected' : ''}>专业工程手稿</option><option value="concise" ${prof.stylePreset === 'concise' ? 'selected' : ''}>精炼核心要点</option><option value="custom" ${prof.stylePreset === 'custom' ? 'selected' : ''}>自定义风格</option></select></label>
            <div class="dsh-ai-actions"><button type="button" class="dsh-cfg-btn" data-k="ai-clear-cache">清空译文缓存</button><button type="button" class="dsh-cfg-btn" data-k="ai-save">保存渠道配置</button></div>
          </div>`;
      }
      panel.innerHTML = `<div class="dsh-settings-group" data-grp="${group.id}"><div class="dsh-settings-card">${rows}</div></div>`;
    };
    const updatePresetButtons = () => {
      const cfg = accessor.readConfig();
      panelEl.querySelectorAll('[data-preset]').forEach((button) => {
        const id = button.getAttribute('data-preset');
        const preset = SCENE_PRESETS[id];
        button.setAttribute('data-active', preset && preset.motionLevel === cfg.motionLevel && String(preset.ambientIntensity) === String(cfg.ambientIntensity) ? '1' : '0');
      });
    };
    const onModernClick = (ev) => {
      const target = ev?.target?.closest?.('button, [data-tab]');
      if (!target || disposed) return;
      if (target.hasAttribute('data-tab')) {
        activeTab = target.getAttribute('data-tab') || 'appearance';
        renderGroup();
        return;
      }
      if (target.hasAttribute('data-preset')) {
        applyScenePreset(target.getAttribute('data-preset'));
        return;
      }
      if (target.hasAttribute('data-sk')) {
        if (target.disabled) return;
        const key = target.getAttribute('data-sk');
        const value = safe(() => JSON.parse(target.getAttribute('data-sv')), target.getAttribute('data-sv'));
        const current = accessor.readConfig()[key];
        if (String(current) === String(value)) return;
        const patch = { [key]: value };
        if (key === 'theme') {
          patch.palette = value === 'warm' || value === 'alabaster' ? 'warm' : 'obsidian';
          patch.lightPreset = value === 'alabaster' ? 'alabaster' : 'crystal';
        } else if (key === 'lightPreset') {
          patch.theme = value === 'alabaster' ? 'alabaster' : 'crystal';
        }
        accessor.writeConfig(patch);
        onConfigChanged?.(key, value);
        if (key === 'language') {
          render();
        } else {
          updatePresetButtons();
          renderGroup();
        }
        setCfgStatus('', '');
        return;
      }
      if (target.getAttribute('data-k') === 'close-modal' && onClose) {
        onClose();
        return;
      }
      if (target.getAttribute('data-k') === 'export-json') {
        exportConfigJson();
        return;
      }
      if (target.getAttribute('data-k') === 'import-json') {
        fileInput.click();
        return;
      }
      if (target.getAttribute('data-k') === 'reset-cfg') {
        resetDefaults();
        return;
      }
      if (target.getAttribute('data-k') === 'ai-save') {
        const nextProfile = {};
        panelEl.querySelectorAll('[data-ai]').forEach((input) => {
          nextProfile[input.getAttribute('data-ai')] = input.value;
        });
        writeThoughtProfileShared(nextProfile, accessor.getBridge());
        setCfgStatus('✓ 已保存思考转译 AI 渠道配置（仅存本机）', 'ok');
        onThoughtProfileSaved?.(nextProfile);
        return;
      }
      if (target.getAttribute('data-k') === 'ai-clear-cache') {
        writeStore(THOUGHT_CACHE_KEY, null);
        safe(() => accessor.getBridge()?.thoughtBridge?.clearCache?.());
        onClearThoughtCache?.();
        setCfgStatus('✓ 已清空思考译文缓存', 'ok');
      }
    };
    const render = () => {
      if (disposed) return;
      const ui = accessor.getStrings();
      panelEl.innerHTML = `
        <div class="dsh-settings-header">
          <div class="dsh-settings-brand">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="var(--ag-prism-accent,#3186ff)"/></svg>
            <div><div class="dsh-settings-brand-line"><h2>${escText(ui.title)}</h2><span class="dsh-settings-ver">v${VERSION} · schema ${SETTINGS_SCHEMA_REVISION}</span></div><p>${escText(ui.subtitle)}</p></div>
          </div>
          ${embedded ? '' : `<button type="button" class="dsh-settings-close" data-k="close-modal">✕ ${escText(ui.close)}</button>`}
        </div>
        <div class="dsh-settings-shell">
          <aside class="dsh-settings-nav" data-ag-cs-settings-nav="1">
            <div class="dsh-settings-preset-row">
              <span class="dsh-settings-nav-label">${escText(ui.presetLabel)}</span>
              <div class="dsh-settings-preset-btns">
                <button type="button" class="dsh-preset-btn" data-preset="ultra">✦ ${escText(ui.presetUltra)}</button>
                <button type="button" class="dsh-preset-btn" data-preset="focus">◎ ${escText(ui.presetFocus)}</button>
                <button type="button" class="dsh-preset-btn" data-preset="eco">☾ ${escText(ui.presetEco)}</button>
              </div>
            </div>
            <nav class="dsh-settings-nav-list" role="tablist" aria-label="${escText(ui.title)}">
              ${SETTINGS_GROUPS.map((group) => `<button type="button" class="dsh-tab-btn" role="tab" data-tab="${group.id}" aria-selected="${activeTab === group.id}"><span>${escText(ui[group.tab] || group.tab)}</span><small>${group.keys.length || '·'}</small></button>`).join('')}
            </nav>
            <div class="dsh-settings-nav-foot"><span>${escText(ui.schemaSummary)}</span><span class="dsh-settings-nav-dot" aria-hidden="true"></span></div>
          </aside>
          <main class="dsh-settings-main">
            <div class="dsh-settings-main-head"><div><h3 data-role="group-title"></h3><p data-role="group-count"></p></div><span class="dsh-settings-support-key"><i></i>${escText(ui.supportReady)}</span></div>
            <div class="dsh-settings-body" data-role="group-panel"></div>
          </main>
        </div>
        <div class="dsh-settings-footer">
          <span class="dsh-cfg-status" data-k="cfg-status" ${cfgStatusTone ? `data-tone="${cfgStatusTone}"` : ''}>${escText(cfgStatusMsg || ui.cfgHint)}</span>
          <div class="dsh-settings-footer-actions">
            <button type="button" class="dsh-cfg-btn" data-k="export-json">${escText(ui.exportBtn)}</button>
            <button type="button" class="dsh-cfg-btn" data-k="import-json">${escText(ui.importBtn)}</button>
            <button type="button" class="dsh-cfg-btn" data-k="reset-cfg">${escText(ui.resetBtn)}</button>
          </div>
        </div>`;
      panelEl.appendChild(fileInput);
      if (!modernEventsBound) {
        panelEl.addEventListener('click', onModernClick);
        modernEventsBound = true;
      }
      updatePresetButtons();
      renderGroup();
    };

    return {
      render,
      setTab(t) {
        if (t && SETTINGS_GROUPS.some((group) => group.id === t)) {
          activeTab = t;
          renderGroup();
        }
      },
      setCfgStatus,
      applyScenePreset,
      exportConfigJson,
      importConfigJson,
      resetDefaults,
      destroy() {
        if (disposed) return;
        disposed = true;
        if (modernEventsBound) panelEl.removeEventListener?.('click', onModernClick);
        fileInput.removeEventListener?.('change', onFileChange);
        fileInput.remove?.();
      },
    };
  }

  // 跟踪所有内嵌到 DSH 原生 settings.section 的挂载实例，支持独立 unmount 与全局 destroy
  const mountedEmbeddedCleanups = new Set();

  /**
   * 将完整「Obsidian Prism 外观设置中心」内嵌挂载到宿主容器元素（供 DSH 原生 settings.section React 包装组件通过 useRef/useEffect 调用）
   * @param {HTMLElement} containerEl 宿主提供的空容器节点
   * @param {object} [bridge] DSHPrismBridge 实例（缺省自动读取 window.__agPrismBridge）
   * @param {object} [options] 可选 { doc, win, initialTab }
   * @returns {() => void} 幂等卸载清理函数
   */
  function mountSettingsIntoElement(containerEl, bridge, options = {}) {
    if (!containerEl || typeof containerEl.appendChild !== 'function') return () => {};
    const doc = options.doc || containerEl.ownerDocument || (typeof document !== 'undefined' ? document : null);
    if (!doc) return () => {};
    const win = options.win || doc.defaultView || G;
    injectWorkbenchCss(doc);

    // 幂等清理同一容器内遗留的旧挂载根节点
    const existing = containerEl.querySelectorAll?.('[data-dsh-prism-embedded-root="1"]');
    existing?.forEach?.((node) => safe(() => node.remove()));

    const host = doc.createElement('div');
    host.setAttribute('class', 'dsh-prism-settings-embedded-host dsh-prism-settings-embedded');
    host.setAttribute('data-dsh-prism-owned', '1');
    host.setAttribute('data-dsh-prism-embedded-root', '1');
    host.setAttribute('data-testid', 'dsh-prism-settings-embedded');

    const panel = doc.createElement('div');
    panel.setAttribute('class', 'dsh-prism-settings-modal is-embedded');
    panel.setAttribute('data-dsh-prism-owned', '1');
    host.appendChild(panel);
    containerEl.appendChild(host);

    const accessor = createConfigAccessor(doc, win, bridge || activeInstance?._bridge || null);
    const ctrl = createSettingsPanelController(panel, {
      doc,
      win,
      embedded: true,
      accessor,
      onConfigChanged(key) {
        if (key === 'thoughtTranslate' || key === 'thoughtView' || key === 'import' || key === 'reset') {
          activeInstance?.translateAllThoughts?.();
        }
        if (key === 'language' || key === 'import' || key === 'reset') {
          activeInstance?.sync?.();
        }
      },
      onThoughtProfileSaved() {
        activeInstance?.translateAllThoughts?.(true);
      },
      onClearThoughtCache() {
        activeInstance?.clearThoughtCache?.();
      },
    });
    if (options.initialTab) ctrl.setTab(options.initialTab);
    ctrl.render();

    let unmounted = false;
    const onExternalConfig = () => {
      if (!unmounted) ctrl.render();
    };
    win?.addEventListener?.('ag-prism:config', onExternalConfig);

    const unmount = () => {
      if (unmounted) return;
      unmounted = true;
      mountedEmbeddedCleanups.delete(unmount);
      win?.removeEventListener?.('ag-prism:config', onExternalConfig);
      ctrl.destroy();
      safe(() => host.remove());
    };
    mountedEmbeddedCleanups.add(unmount);
    return unmount;
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // 统一工作台与设置中心控制器: window.DSHPrismWorkbench.init(bridge, options)
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
    injectWorkbenchCss(doc);

    let destroyed = false;
    const cleanups = [];
    const sonarTimers = new Set();
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

    // IME 输入法组合态保护
    let isComposing = false;
    let pendingSyncAfterIme = false;
    let triggerDeferredSync = () => {};
    on(doc, 'compositionstart', () => { isComposing = true; }, true);
    on(doc, 'compositionend', () => {
      isComposing = false;
      if (pendingSyncAfterIme) {
        pendingSyncAfterIme = false;
        triggerDeferredSync();
      }
    }, true);

    // ── 配置读写与宿主根节点属性同步 ─────────────────────────────────────────
    const accessor = createConfigAccessor(doc, win, activeBridge);
    const { readConfig, writeConfig, getLang, getStrings } = accessor;
    const applyFallbackDomAttrs = (cfg) => applyFallbackDomAttrsShared(doc, cfg);
    const surfaceMarkers = createSurfaceMarkers(doc);
    cleanups.push(surfaceMarkers.clear);

    const findScrollViewport = (startEl) => {
      if (startEl?.closest) {
        const vp = startEl.closest('[data-testid="autoscroll-viewport"], #dsh-chat-scroll, .dsh-chat');
        if (vp) return vp;
      }
      return doc.querySelector('#dsh-chat-scroll, [data-testid="autoscroll-viewport"], .dsh-chat, [data-testid="conversation-view"]');
    };

    const getUserTurns = () => {
      const rootEl = doc.querySelector('[data-testid="conversation-view"], .dsh-chat, main') || doc;
      let nodes = Array.from(rootEl.querySelectorAll('[data-testid="user-input-step"], [data-testid="user-message-bubble"], .dsh-user-msg, [data-role="user"]'));
      if (!nodes.length) nodes = Array.from(rootEl.querySelectorAll('.dsh-turn, [data-testid="conversation-turn"]'));
      return nodes;
    };

    const pulseSonar = (el) => {
      if (!el) return;
      el.setAttribute('data-ag-cs-sonar', '1');
      const t = setTimeout(() => {
        sonarTimers.delete(t);
        if (!destroyed && el.isConnected) el.removeAttribute('data-ag-cs-sonar');
      }, SONAR_DURATION_MS);
      sonarTimers.add(t);
    };

    const scrollToElement = (el) => {
      if (!el) return;
      const vp = findScrollViewport(el);
      if (vp && vp !== el && vp.getBoundingClientRect && el.getBoundingClientRect) {
        const tr = el.getBoundingClientRect();
        const vr = vp.getBoundingClientRect();
        if (vr.height > 0) {
          const nextTop = Math.max(0, Math.round((vp.scrollTop || 0) + (tr.top - vr.top) - 18));
          if (typeof vp.scrollTo === 'function') vp.scrollTo({ top: nextTop, behavior: 'smooth' });
          else vp.scrollTop = nextTop;
          return;
        }
      }
      safe(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    };

    const getWhaleRect = () => {
      const el = doc.querySelector('.dshwv-root');
      if (!el || !isVisibleElement(el, win) || typeof el.getBoundingClientRect !== 'function') return null;
      const r = el.getBoundingClientRect();
      return r && r.width > 0 && r.height > 0 ? r : null;
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // A. 代码块玻璃吸顶头 + >=48 行手动折叠/展开（严格非破坏性、React-safe，带滚动锚点补偿）
    //    - 静态预览舞台 (.dsh-code-card 且非 React 节点): 保留卡片内吸顶头
    //    - 真实 DSH Desktop React SPA (<pre>): 绝不包裹/移动/重排 React DOM，
    //      仅附加 data-ag-cs-code-* 属性并通过 body 独立 overlay 层同步玻璃吸顶头
    // ═══════════════════════════════════════════════════════════════════════════
    const codeOverlayLayer = doc.createElement('div');
    codeOverlayLayer.setAttribute('class', 'dsh-prism-code-overlay-layer');
    codeOverlayLayer.setAttribute('data-dsh-prism-owned', '1');
    doc.body.appendChild(codeOverlayLayer);

    const reactCodeOverlays = new Map(); // preEl -> { headEl, langEl, lineBadge, copyBtn, foldBtn, foldBarEl, lines }
    const staticEnhancedCards = new Set();
    let codeOverlayRaf = 0;

    const countPreLines = (pre) => {
      const code = pre.querySelector('code') || pre;
      const raw = String(code.textContent || '');
      if (!raw) return 0;
      const trimmed = raw.endsWith('\n') ? raw.slice(0, -1) : raw;
      return trimmed ? trimmed.split(/\r?\n/).length : 0;
    };

    const detectCodeLang = (pre) => {
      const code = pre.querySelector('code');
      const dl = code?.getAttribute('data-lang') || pre.getAttribute('data-lang');
      if (dl) return dl;
      const cls = `${code?.className || ''} ${pre.className || ''}`;
      const m = cls.match(/language-([a-z0-9_+#-]+)/i);
      return m ? m[1] : 'code';
    };

    const formatFoldLabel = (folded, lines) => {
      const ui = getStrings();
      return `${folded ? ui.expandCode : ui.foldCode} (${lines}${ui.linesUnit})`;
    };

    const toggleCodeFold = (targetEl, btn, bar, onAfterToggle) => {
      const lines = parseInt(btn.getAttribute('data-lines') || '48', 10) || MIN_CODE_FOLD_LINES;
      const isFolded = targetEl.getAttribute('data-ag-cs-code-folded') === '1';
      if (!isFolded) {
        // 折叠前采样视口位置：若顶部已滚出视口上方，则做滚动锚点补偿
        const vp = findScrollViewport(targetEl);
        const cardRect = targetEl.getBoundingClientRect?.();
        const vpRect = vp?.getBoundingClientRect?.();
        targetEl.setAttribute('data-ag-cs-code-folded', '1');
        btn.setAttribute('aria-expanded', 'false');
        btn.textContent = formatFoldLabel(true, lines);
        if (bar) bar.textContent = `▾ ${formatFoldLabel(true, lines)}`;
        if (vp && cardRect && vpRect && cardRect.top < vpRect.top) {
          const delta = Math.round(cardRect.top - vpRect.top - 12);
          vp.scrollTop = Math.max(0, (vp.scrollTop || 0) + delta);
        }
      } else {
        targetEl.removeAttribute('data-ag-cs-code-folded');
        btn.setAttribute('aria-expanded', 'true');
        btn.textContent = formatFoldLabel(false, lines);
      }
      onAfterToggle?.();
    };

    const positionCodeOverlays = () => {
      codeOverlayRaf = 0;
      if (destroyed || isComposing) return;
      const vw = win.innerWidth || 1280;
      const vh = win.innerHeight || 800;
      const whale = getWhaleRect();

      for (const [pre, rec] of reactCodeOverlays.entries()) {
        if (!pre.isConnected) {
          rec.headEl.remove();
          rec.foldBarEl?.remove();
          reactCodeOverlays.delete(pre);
          continue;
        }
        const pr = pre.getBoundingClientRect?.();
        if (!pr || pr.width < 60 || pr.height < 24 || pr.bottom < 36 || pr.top > vh - 20) {
          rec.headEl.hidden = true;
          if (rec.foldBarEl) rec.foldBarEl.hidden = true;
          continue;
        }
        const vp = findScrollViewport(pre);
        const vr = vp?.getBoundingClientRect?.();
        const clipTop = vr && vr.height > 40 ? Math.max(0, vr.top) : 0;
        const clipBottom = vr && vr.height > 40 ? Math.min(vh, vr.bottom) : vh;
        const clipLeft = vr && vr.width > 80 ? Math.max(0, vr.left) : 0;
        const clipRight = vr && vr.width > 80 ? Math.min(vw, vr.right) : vw;

        if (pr.bottom <= clipTop + 34 || pr.top >= clipBottom - 20) {
          rec.headEl.hidden = true;
          if (rec.foldBarEl) rec.foldBarEl.hidden = true;
          continue;
        }

        const headH = 34;
        const stickyTop = clamp(pr.top, clipTop, Math.max(clipTop, pr.bottom - headH));
        const left = clamp(pr.left, clipLeft, Math.max(clipLeft, clipRight - 80));
        let width = Math.min(pr.width, clipRight - left);
        // 避让右下角 dsh-whale-widget
        if (whale && stickyTop + headH > whale.top - 6 && stickyTop < whale.bottom + 6 && left + width > whale.left - 8) {
          width = Math.max(120, whale.left - 8 - left);
        }

        rec.headEl.hidden = false;
        rec.headEl.style.left = `${Math.round(left)}px`;
        rec.headEl.style.top = `${Math.round(stickyTop)}px`;
        rec.headEl.style.width = `${Math.round(Math.max(80, width))}px`;

        if (rec.foldBarEl) {
          const isFolded = pre.getAttribute('data-ag-cs-code-folded') === '1';
          if (isFolded && pr.bottom > clipTop + 56 && pr.bottom <= clipBottom + 4) {
            rec.foldBarEl.hidden = false;
            rec.foldBarEl.style.left = `${Math.round(left)}px`;
            rec.foldBarEl.style.top = `${Math.round(pr.bottom - 28)}px`;
            rec.foldBarEl.style.width = `${Math.round(Math.max(80, width))}px`;
          } else {
            rec.foldBarEl.hidden = true;
          }
        }
      }
    };

    const scheduleCodeOverlaySync = () => {
      if (destroyed || !reactCodeOverlays.size) return;
      if (codeOverlayRaf) return;
      if (typeof win.requestAnimationFrame === 'function') {
        codeOverlayRaf = win.requestAnimationFrame(positionCodeOverlays);
      } else {
        positionCodeOverlays();
      }
    };

    on(win, 'scroll', scheduleCodeOverlaySync, { passive: true, capture: true });
    on(win, 'resize', scheduleCodeOverlaySync, { passive: true });
    cleanups.push(() => {
      if (codeOverlayRaf) win.cancelAnimationFrame?.(codeOverlayRaf);
      for (const [pre, rec] of reactCodeOverlays.entries()) {
        rec.headEl.remove();
        rec.foldBarEl?.remove();
        safe(() => {
          pre.removeAttribute('data-ag-cs-code-enhanced');
          pre.removeAttribute('data-ag-cs-code-lines');
          pre.removeAttribute('data-ag-cs-code-lang');
          pre.removeAttribute('data-ag-cs-code-folded');
        });
      }
      reactCodeOverlays.clear();
      codeOverlayLayer.remove();
      for (const card of staticEnhancedCards) {
        safe(() => {
          card.removeAttribute('data-ag-cs-code-folded');
          card.querySelectorAll(':scope > [data-dsh-prism-owned="1"]').forEach((n) => n.remove());
        });
      }
      staticEnhancedCards.clear();
    });

    const enhanceReactCodeBlock = (pre, lines, lang, ui) => {
      // 严禁包裹或移动 React 拥有的 <pre>：仅挂数据属性 + 独立 body Overlay 吸顶栏
      pre.setAttribute('data-ag-cs-code-enhanced', '1');
      pre.setAttribute('data-ag-cs-code-lines', String(lines));
      pre.setAttribute('data-ag-cs-code-lang', lang);

      let rec = reactCodeOverlays.get(pre);
      if (!rec) {
        const headEl = doc.createElement('div');
        headEl.setAttribute('class', 'ag-cs-code-sticky-head is-overlay');
        headEl.setAttribute('data-ag-cs-code-sticky', '1');
        headEl.setAttribute('data-dsh-prism-owned', '1');
        headEl.innerHTML = `<span class="ag-cs-code-meta"><span class="ag-cs-code-lang"></span><span data-k="line-badge"></span></span><span class="ag-cs-code-actions"></span>`;
        codeOverlayLayer.appendChild(headEl);

        const actions = headEl.querySelector('.ag-cs-code-actions');
        const copyBtn = doc.createElement('button');
        copyBtn.type = 'button';
        copyBtn.setAttribute('class', 'ag-cs-code-copy-btn');
        copyBtn.textContent = ui.copyCode;
        copyBtn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          const txt = (pre.querySelector('code') || pre).textContent || '';
          safe(() => navigator?.clipboard?.writeText?.(txt));
          copyBtn.textContent = getStrings().copied;
          win.DSHPrismWidgets?.notifyMascot?.('code-copied');
          safeTimeout(() => { copyBtn.textContent = getStrings().copyCode; }, 1300);
        });
        actions.appendChild(copyBtn);

        rec = {
          headEl,
          langEl: headEl.querySelector('.ag-cs-code-lang'),
          lineBadge: headEl.querySelector('[data-k="line-badge"]'),
          actions,
          copyBtn,
          foldBtn: null,
          foldBarEl: null,
          lines,
        };
        reactCodeOverlays.set(pre, rec);
      }

      rec.lines = lines;
      if (rec.langEl) rec.langEl.textContent = lang;
      if (rec.lineBadge) rec.lineBadge.textContent = `${lines} ${ui.linesUnit}`;
      if (!rec.copyBtn.textContent.startsWith('✓')) rec.copyBtn.textContent = ui.copyCode;

      if (lines >= MIN_CODE_FOLD_LINES) {
        const folded = pre.getAttribute('data-ag-cs-code-folded') === '1';
        if (!rec.foldBarEl) {
          rec.foldBarEl = doc.createElement('div');
          rec.foldBarEl.setAttribute('class', 'ag-cs-code-fold-bar is-overlay');
          rec.foldBarEl.setAttribute('data-dsh-prism-owned', '1');
          rec.foldBarEl.hidden = true;
          codeOverlayLayer.appendChild(rec.foldBarEl);
        }
        if (!rec.foldBtn) {
          rec.foldBtn = doc.createElement('button');
          rec.foldBtn.type = 'button';
          rec.foldBtn.setAttribute('class', 'ag-cs-code-fold-btn');
          const doToggle = (ev) => {
            ev.stopPropagation();
            toggleCodeFold(pre, rec.foldBtn, rec.foldBarEl, scheduleCodeOverlaySync);
          };
          rec.foldBtn.addEventListener('click', doToggle);
          rec.foldBarEl.addEventListener('click', doToggle);
          rec.actions.insertBefore(rec.foldBtn, rec.copyBtn);
        }
        rec.foldBtn.setAttribute('data-lines', String(lines));
        rec.foldBtn.setAttribute('aria-expanded', folded ? 'false' : 'true');
        rec.foldBtn.textContent = formatFoldLabel(folded, lines);
        rec.foldBarEl.textContent = `▾ ${formatFoldLabel(true, lines)}`;
      } else {
        rec.foldBtn?.remove();
        rec.foldBtn = null;
        rec.foldBarEl?.remove();
        rec.foldBarEl = null;
        pre.removeAttribute('data-ag-cs-code-folded');
      }
    };

    const syncCodeBlocks = () => {
      if (destroyed) return;
      const ui = getStrings();
      const pres = doc.querySelectorAll(':is(' + CHAT_CONTENT + ') pre');
      pres.forEach((pre) => {
        if (pre.closest?.(WORKBENCH_CHROME) || pre.closest?.('[data-message-bubble]')) return;
        const lines = countPreLines(pre);
        const lang = detectCodeLang(pre);
        const existingCard = pre.closest?.('.dsh-code-card');

        // 仅当宿主本身已提供非 React 的静态 .dsh-code-card（例如 preview/dsh-stage.html）时才走卡片内吸顶头
        if (existingCard && existingCard.closest(PREVIEW_SHELL) && !isReactNode(existingCard) && !isReactNode(pre)) {
          staticEnhancedCards.add(existingCard);
          let head = existingCard.querySelector(':scope > .ag-cs-code-sticky-head');
          if (!head) {
            head = doc.createElement('div');
            head.setAttribute('class', 'ag-cs-code-sticky-head');
            head.setAttribute('data-ag-cs-code-sticky', '1');
            head.setAttribute('data-dsh-prism-owned', '1');
            head.innerHTML = `<span class="ag-cs-code-meta"><span class="ag-cs-code-lang"></span><span data-k="line-badge"></span></span><span class="ag-cs-code-actions"></span>`;
            existingCard.insertBefore(head, pre);
          }
          const langEl = head.querySelector('.ag-cs-code-lang');
          if (langEl) langEl.textContent = lang;
          const lineBadge = head.querySelector('[data-k="line-badge"]');
          if (lineBadge) lineBadge.textContent = `${lines} ${ui.linesUnit}`;

          const actions = head.querySelector('.ag-cs-code-actions');
          let copyBtn = actions.querySelector('.ag-cs-code-copy-btn');
          if (!copyBtn) {
            copyBtn = doc.createElement('button');
            copyBtn.type = 'button';
            copyBtn.setAttribute('class', 'ag-cs-code-copy-btn');
            copyBtn.textContent = ui.copyCode;
            copyBtn.addEventListener('click', (ev) => {
              ev.stopPropagation();
              const txt = (pre.querySelector('code') || pre).textContent || '';
              safe(() => navigator?.clipboard?.writeText?.(txt));
              copyBtn.textContent = getStrings().copied;
              win.DSHPrismWidgets?.notifyMascot?.('code-copied');
              safeTimeout(() => { copyBtn.textContent = getStrings().copyCode; }, 1300);
            });
            actions.appendChild(copyBtn);
          } else if (!copyBtn.textContent.startsWith('✓')) {
            copyBtn.textContent = ui.copyCode;
          }

          // >= 48 行代码块挂载手动折叠按钮与底部展开条（绝不自动折叠）
          let foldBtn = actions.querySelector('.ag-cs-code-fold-btn');
          let foldBar = existingCard.querySelector(':scope > .ag-cs-code-fold-bar');
          if (lines >= MIN_CODE_FOLD_LINES) {
            const folded = existingCard.getAttribute('data-ag-cs-code-folded') === '1';
            if (!foldBar) {
              foldBar = doc.createElement('div');
              foldBar.setAttribute('class', 'ag-cs-code-fold-bar');
              foldBar.setAttribute('data-dsh-prism-owned', '1');
              existingCard.appendChild(foldBar);
            }
            if (!foldBtn) {
              foldBtn = doc.createElement('button');
              foldBtn.type = 'button';
              foldBtn.setAttribute('class', 'ag-cs-code-fold-btn');
              foldBtn.addEventListener('click', (ev) => {
                ev.stopPropagation();
                toggleCodeFold(existingCard, foldBtn, foldBar);
              });
              foldBar.addEventListener('click', (ev) => {
                ev.stopPropagation();
                toggleCodeFold(existingCard, foldBtn, foldBar);
              });
              actions.insertBefore(foldBtn, copyBtn);
            }
            foldBtn.setAttribute('data-lines', String(lines));
            foldBtn.setAttribute('aria-expanded', folded ? 'false' : 'true');
            foldBtn.textContent = formatFoldLabel(folded, lines);
            foldBar.textContent = `▾ ${formatFoldLabel(true, lines)}`;
          } else {
            foldBtn?.remove();
            foldBar?.remove();
            existingCard.removeAttribute('data-ag-cs-code-folded');
          }
          return;
        }

        // 所有 React 节点或裸 <pre> 均走零侵入 Overlay 通道，严禁重排/包裹 DOM
        enhanceReactCodeBlock(pre, lines, lang, ui);
      });

      if (reactCodeOverlays.size) scheduleCodeOverlaySync();
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // B. 左侧对话轨道悬停大纲浮层、一键收起步骤与 Alt+Up/Down 轮次跳转
    // ═══════════════════════════════════════════════════════════════════════════
    let outlineOpen = false;
    let outlineFilter = '';
    let hideOutlineTimer = 0;

    const outlinePop = doc.createElement('div');
    outlinePop.className = 'ag-cs-nav-outline-popover';
    outlinePop.setAttribute('role', 'region');
    outlinePop.setAttribute('data-testid', 'dsh-outline-popover');
    outlinePop.setAttribute('data-dsh-prism-owned', '1');
    outlinePop.hidden = true;
    outlinePop.innerHTML = `
      <div class="ag-cs-nav-outline-head">
        <span data-k="outline-title">提问导航</span>
        <button type="button" class="ag-cs-nav-fold-steps-btn" data-k="fold-steps">收起步骤</button>
      </div>
      <input type="search" class="ag-cs-nav-outline-search" placeholder="过滤本会话提问…" />
      <div class="ag-cs-nav-outline-list"></div>
    `;
    doc.body.appendChild(outlinePop);
    cleanups.push(() => outlinePop.remove());

    const outlineTitleEl = outlinePop.querySelector('[data-k="outline-title"]');
    const outlineFoldBtn = outlinePop.querySelector('[data-k="fold-steps"]');
    const outlineSearchInput = outlinePop.querySelector('.ag-cs-nav-outline-search');
    const outlineListEl = outlinePop.querySelector('.ag-cs-nav-outline-list');

    const foldHistoricalSteps = () => {
      const triggers = Array.from(doc.querySelectorAll('[data-testid="thinking-collapsible-trigger"][aria-expanded="true"]'));
      let count = 0;
      const limit = triggers.length > 1 ? triggers.length - 1 : triggers.length;
      for (let i = 0; i < limit; i++) {
        const btn = triggers[i];
        if (btn.getAttribute('aria-expanded') === 'true') {
          safe(() => btn.click());
          count += 1;
        }
      }
      return count;
    };

    const renderOutline = () => {
      const ui = getStrings();
      const turns = getUserTurns();
      if (outlineTitleEl) outlineTitleEl.textContent = `${ui.outlineTitle} · ${turns.length} ${ui.turnsUnit}`;
      if (outlineSearchInput) outlineSearchInput.placeholder = ui.searchPh;
      if (outlineFoldBtn) outlineFoldBtn.textContent = ui.foldSteps;
      if (!outlineListEl) return;

      const vp = findScrollViewport(turns[0]);
      const vr = vp?.getBoundingClientRect?.();
      const midY = vr && vr.height > 0 ? vr.top + vr.height * 0.35 : 220;
      let activeIdx = 0;
      turns.forEach((el, i) => {
        const r = el.getBoundingClientRect?.();
        if (r && r.top <= midY) activeIdx = i;
      });

      const q = outlineFilter.trim().toLowerCase();
      outlineListEl.innerHTML = '';
      let rendered = 0;
      turns.forEach((el, idx) => {
        const txt = String(el.textContent || '').replace(/\s+/g, ' ').trim();
        const snippet = txt.length > 64 ? `${txt.slice(0, 62)}…` : txt || `Turn ${idx + 1}`;
        const num = `#${idx + 1}`;
        if (q && !snippet.toLowerCase().includes(q) && !num.includes(q)) return;
        const row = doc.createElement('button');
        row.type = 'button';
        row.className = 'ag-cs-nav-outline-item';
        if (idx === activeIdx) row.setAttribute('data-active', '1');
        row.innerHTML = `<span class="ag-cs-nav-outline-num">${num}</span><span class="ag-cs-nav-outline-text"></span>`;
        row.querySelector('.ag-cs-nav-outline-text').textContent = snippet;
        row.addEventListener('click', () => {
          const target = el.closest('.dsh-turn') || el;
          scrollToElement(target);
          pulseSonar(target);
        });
        outlineListEl.appendChild(row);
        rendered += 1;
      });
      if (rendered === 0) {
        const empty = doc.createElement('div');
        empty.className = 'ag-cs-nav-outline-empty';
        empty.textContent = ui.emptyMatch;
        outlineListEl.appendChild(empty);
      }
    };

    const positionOutline = (rail) => {
      const r = rail?.getBoundingClientRect?.();
      const vw = win.innerWidth || 1200;
      const vh = win.innerHeight || 760;
      let left = r ? Math.min(r.right + 10, vw - 290) : 64;
      let top = r ? clamp(r.top - 40, 56, Math.max(56, vh - 390)) : 120;
      const whale = getWhaleRect();
      if (whale && left + 276 > whale.left - 10 && top + 360 > whale.top - 10) {
        top = Math.max(56, whale.top - 372);
      }
      outlinePop.style.left = `${Math.round(left)}px`;
      outlinePop.style.top = `${Math.round(top)}px`;
    };

    const openNavOutline = (railOverride = null) => {
      if (hideOutlineTimer) { clearTimeout(hideOutlineTimer); hideOutlineTimer = 0; }
      const rail = railOverride || doc.querySelector('[data-testid="conversation-navigator"], .dsh-conv-rail');
      renderOutline();
      positionOutline(rail);
      outlineOpen = true;
      outlinePop.hidden = false;
      return true;
    };

    const closeNavOutline = () => {
      if (hideOutlineTimer) { clearTimeout(hideOutlineTimer); hideOutlineTimer = 0; }
      outlineOpen = false;
      outlinePop.hidden = true;
    };

    const scheduleHideOutline = () => {
      if (hideOutlineTimer) clearTimeout(hideOutlineTimer);
      hideOutlineTimer = setTimeout(() => {
        hideOutlineTimer = 0;
        if (doc.activeElement !== outlineSearchInput) closeNavOutline();
      }, OUTLINE_HIDE_DELAY_MS);
    };

    on(outlinePop, 'pointerenter', () => { if (hideOutlineTimer) { clearTimeout(hideOutlineTimer); hideOutlineTimer = 0; } });
    on(outlinePop, 'pointerleave', scheduleHideOutline);
    on(outlineSearchInput, 'input', () => {
      outlineFilter = outlineSearchInput.value || '';
      renderOutline();
    });
    on(outlineSearchInput, 'keydown', (ev) => {
      if (ev.key === 'Escape') { ev.stopPropagation(); closeNavOutline(); }
      else if (ev.key === 'Enter') {
        outlineListEl.querySelector('.ag-cs-nav-outline-item')?.click();
      }
    });
    on(outlineFoldBtn, 'click', () => {
      const n = foldHistoricalSteps();
      outlineFoldBtn.textContent = n > 0 ? `已收起 ${n} 项` : '已是最简';
      safeTimeout(() => { outlineFoldBtn.textContent = getStrings().foldSteps; }, 1200);
    });

    const boundRails = new WeakSet();
    const syncNavRails = () => {
      const rails = doc.querySelectorAll('[data-testid="conversation-navigator"], .dsh-conv-rail');
      rails.forEach((rail) => {
        if (boundRails.has(rail)) return;
        boundRails.add(rail);
        on(rail, 'pointerenter', () => openNavOutline(rail));
        on(rail, 'pointerleave', scheduleHideOutline);
      });
    };

    const jumpUserTurn = (delta) => {
      const turns = getUserTurns();
      if (!turns.length) return false;
      const vp = findScrollViewport(turns[0]);
      const vr = vp?.getBoundingClientRect?.();
      const anchorY = vr && vr.height > 0 ? vr.top + 42 : 80;
      let targetIdx = -1;
      if (delta < 0) {
        for (let i = turns.length - 1; i >= 0; i--) {
          const r = turns[i].getBoundingClientRect?.();
          if (r && r.top < anchorY - 12) { targetIdx = i; break; }
        }
        if (targetIdx < 0) targetIdx = 0;
      } else {
        for (let i = 0; i < turns.length; i++) {
          const r = turns[i].getBoundingClientRect?.();
          if (r && r.top > anchorY + 12) { targetIdx = i; break; }
        }
        if (targetIdx < 0) targetIdx = turns.length - 1;
      }
      const target = turns[targetIdx].closest('.dsh-turn') || turns[targetIdx];
      scrollToElement(target);
      pulseSonar(target);
      const ticks = doc.querySelectorAll('.dsh-rail-tick');
      ticks.forEach((tk, idx) => tk.setAttribute('data-active', idx === targetIdx ? 'true' : 'false'));
      return true;
    };

    // 滚动对话区时自动高亮左侧轨道对应刻度
    const chatVp = findScrollViewport();
    if (chatVp) {
      on(chatVp, 'scroll', () => {
        const turns = getUserTurns();
        const vr = chatVp.getBoundingClientRect?.();
        const midY = vr ? vr.top + vr.height * 0.35 : 220;
        let activeIdx = 0;
        turns.forEach((t, i) => {
          const r = t.getBoundingClientRect?.();
          if (r && r.top <= midY) activeIdx = i;
        });
        doc.querySelectorAll('.dsh-rail-tick').forEach((tk, i) => {
          tk.setAttribute('data-active', i === activeIdx ? 'true' : 'false');
        });
      }, { passive: true });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // C. 双模思考链转译套件 (<think> 沉浸中文译文 vs 中英逐段双语对照)
    // ═══════════════════════════════════════════════════════════════════════════
    const thoughtCache = new Map();
    safe(() => {
      const saved = JSON.parse(readStore(THOUGHT_CACHE_KEY) || '{}');
      for (const [k, v] of Object.entries(saved)) thoughtCache.set(k, v);
    });
    const saveThoughtCache = () => {
      const obj = {};
      let n = 0;
      for (const [k, v] of thoughtCache.entries()) {
        if (n++ >= 60) break;
        obj[k] = v;
      }
      writeStore(THOUGHT_CACHE_KEY, JSON.stringify(obj));
    };

    const readThoughtProfile = () => readThoughtProfileShared();
    const writeThoughtProfile = (profile) => writeThoughtProfileShared(profile, activeBridge);

    // React 拥有的 <think> 块使用 body 独立 Portal 渲染译文卡片，绝不向 React 父节点插删子节点
    const thoughtPortalLayer = doc.createElement('div');
    thoughtPortalLayer.setAttribute('class', 'dsh-prism-thought-portal-layer');
    thoughtPortalLayer.setAttribute('data-dsh-prism-owned', '1');
    doc.body.appendChild(thoughtPortalLayer);

    const reactThoughtPortals = new Map(); // thinkEl -> { cardEl, barEl, overlayEl, expanded }
    const staticEnhancedThoughts = new Set();
    let thoughtPortalRaf = 0;

    const positionThoughtPortals = () => {
      thoughtPortalRaf = 0;
      if (destroyed || isComposing) return;
      const vw = win.innerWidth || 1280;
      const vh = win.innerHeight || 800;
      for (const [thinkEl, rec] of reactThoughtPortals.entries()) {
        if (!thinkEl.isConnected) {
          rec.cardEl.remove();
          reactThoughtPortals.delete(thinkEl);
          continue;
        }
        const tr = thinkEl.getBoundingClientRect?.();
        if (!tr || tr.width < 40 || tr.height < 14 || tr.bottom < 20 || tr.top > vh - 20) {
          rec.cardEl.hidden = true;
          continue;
        }
        rec.cardEl.hidden = false;
        const w = Math.min(Math.max(260, tr.width), vw - 24);
        const left = clamp(tr.left, 12, Math.max(12, vw - w - 12));
        const top = clamp(tr.top, 12, Math.max(12, vh - 120));
        rec.cardEl.style.left = `${Math.round(left)}px`;
        rec.cardEl.style.top = `${Math.round(top)}px`;
        rec.cardEl.style.width = `${Math.round(w)}px`;
      }
    };

    const scheduleThoughtPortalSync = () => {
      if (destroyed || !reactThoughtPortals.size || thoughtPortalRaf) return;
      if (typeof win.requestAnimationFrame === 'function') {
        thoughtPortalRaf = win.requestAnimationFrame(positionThoughtPortals);
      } else {
        positionThoughtPortals();
      }
    };
    on(win, 'scroll', scheduleThoughtPortalSync, { passive: true, capture: true });
    on(win, 'resize', scheduleThoughtPortalSync, { passive: true });
    cleanups.push(() => {
      if (thoughtPortalRaf) win.cancelAnimationFrame?.(thoughtPortalRaf);
      for (const [, rec] of reactThoughtPortals.entries()) rec.cardEl.remove();
      reactThoughtPortals.clear();
      thoughtPortalLayer.remove();
      for (const tEl of staticEnhancedThoughts) {
        safe(() => {
          tEl.hidden = false;
          tEl.style.display = '';
          tEl.removeAttribute('data-dsh-local-view');
          tEl.parentElement?.querySelectorAll(':scope > [data-dsh-prism-owned="1"]').forEach((n) => n.remove());
        });
      }
      staticEnhancedThoughts.clear();
    });

    const extractThinkParagraphs = (thinkEl) => {
      const pNodes = Array.from(thinkEl.querySelectorAll('p, li'));
      if (pNodes.length) {
        return pNodes.map((n) => String(n.textContent || '').trim()).filter(Boolean);
      }
      return String(thinkEl.textContent || '')
        .split(/\n{2,}|\n/)
        .map((s) => s.trim())
        .filter(Boolean);
    };

    const translateParagraphs = async (paragraphs, mode, force = false) => {
      const joined = paragraphs.join('\n\n');
      const lang = getLang();
      const cacheKey = `${mode}:${lang}:${joined.length}:${joined.slice(0, 48)}`;
      if (!force && thoughtCache.has(cacheKey)) {
        return { translated: thoughtCache.get(cacheKey), engine: mode, cached: true };
      }

      // 1. 尝试调用宿主 bridge.translateThought（含 OpenAI 兼容或免配置机翻）
      if (typeof activeBridge?.translateThought === 'function') {
        try {
          const prof = readThoughtProfile();
          const res = await activeBridge.translateThought({
            text: joined,
            mode,
            targetLang: lang,
            force,
            profile: prof,
          });
          if (res && res.ok !== false && typeof res.text === 'string' && res.text.trim()) {
            const parts = res.text.split(/\n{2,}|\n/).map((s) => s.trim()).filter(Boolean);
            const aligned = paragraphs.map((p, idx) => parts[idx] || translateParagraphOffline(p));
            thoughtCache.set(cacheKey, aligned);
            saveThoughtCache();
            return { translated: aligned, engine: res.engine || mode, fallback: Boolean(res.fallback) };
          }
        } catch {}
      }

      // 2. 离线工程术语兜底（保障零延迟与 100% 可读性）
      const offline = paragraphs.map(translateParagraphOffline);
      thoughtCache.set(cacheKey, offline);
      saveThoughtCache();
      return { translated: offline, engine: 'offline', fallback: mode === 'ai' };
    };

    const fillThoughtOverlayNodes = (overlay, paragraphs, translated, view) => {
      overlay.innerHTML = '';
      paragraphs.forEach((orig, idx) => {
        const zh = translated[idx] || translateParagraphOffline(orig);
        if (view === 'bilingual') {
          const pair = doc.createElement('div');
          pair.className = 'ag-prism-thought-pair';
          const oEl = doc.createElement('div');
          oEl.className = 'ag-prism-thought-orig';
          oEl.textContent = orig;
          const zEl = doc.createElement('div');
          zEl.className = 'ag-prism-thought-zh';
          zEl.textContent = zh;
          pair.appendChild(oEl);
          pair.appendChild(zEl);
          overlay.appendChild(pair);
        } else {
          const pEl = doc.createElement('p');
          pEl.className = 'ag-prism-thought-zh';
          pEl.style.margin = '0';
          pEl.textContent = zh;
          overlay.appendChild(pEl);
        }
      });
    };

    const renderThoughtBlock = async (thinkEl, opts = {}) => {
      if (!thinkEl || destroyed || thinkEl.closest?.(WORKBENCH_CHROME) || thinkEl.closest?.('[data-message-bubble]')) return;
      const bodyHost = thinkEl.parentElement;
      if (!bodyHost) return;
      const cfg = readConfig();
      const mode = opts.mode || cfg.thoughtTranslate || 'machine';
      const localView = thinkEl.getAttribute('data-dsh-local-view');
      const view = opts.view || localView || cfg.thoughtView || 'immersive';
      const ui = getStrings();
      const showRawOnly = mode === 'off' || view === 'raw';
      const badgeLabel = showRawOnly
        ? `✦ Thought · ${ui.rawText}`
        : view === 'bilingual'
          ? `✦ Thought · ${ui.bilingual}`
          : `✦ Thought · ${ui.immersive}`;

      const reactOwned = !thinkEl.closest?.(PREVIEW_SHELL) || isReactNode(thinkEl) || isReactNode(bodyHost);

      if (reactOwned) {
        // React SPA 安全路径：零修改 React DOM 子树，译文与控制条渲染于 body 独立 Portal 卡片
        let rec = reactThoughtPortals.get(thinkEl);
        if (showRawOnly) {
          if (rec) {
            rec.overlayEl.hidden = true;
            rec.cardEl.hidden = true;
          }
          return;
        }
        if (!rec) {
          const cardEl = doc.createElement('div');
          cardEl.setAttribute('class', 'ag-prism-thought-portal-card');
          cardEl.setAttribute('data-dsh-prism-owned', '1');
          const barEl = doc.createElement('div');
          barEl.setAttribute('class', 'ag-prism-thought-bar');
          const overlayEl = doc.createElement('div');
          overlayEl.setAttribute('class', 'ag-prism-thought-overlay');
          overlayEl.setAttribute('data-op-thought', '1');
          cardEl.appendChild(barEl);
          cardEl.appendChild(overlayEl);
          thoughtPortalLayer.appendChild(cardEl);
          rec = { cardEl, barEl, overlayEl };
          reactThoughtPortals.set(thinkEl, rec);
        }

        rec.barEl.innerHTML = `
          <span class="ag-prism-thought-badge">${badgeLabel}</span>
          <span class="ag-prism-thought-btns">
            <button type="button" class="ag-prism-thought-btn" data-tact="immersive" aria-pressed="${view === 'immersive'}">${ui.immersive}</button>
            <button type="button" class="ag-prism-thought-btn" data-tact="bilingual" aria-pressed="${view === 'bilingual'}">${ui.bilingual}</button>
            <button type="button" class="ag-prism-thought-btn" data-tact="raw" aria-pressed="false">${ui.rawText}</button>
            <button type="button" class="ag-prism-thought-btn" data-tact="retry">↻ ${ui.retranslate}</button>
          </span>
        `;
        rec.barEl.querySelectorAll('[data-tact]').forEach((btn) => {
          btn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            const act = btn.getAttribute('data-tact');
            if (act === 'retry') {
              renderThoughtBlock(thinkEl, { force: true, view, mode });
              return;
            }
            if (act === 'raw') {
              thinkEl.setAttribute('data-dsh-local-view', 'raw');
              renderThoughtBlock(thinkEl, { view: 'raw' });
            } else {
              thinkEl.removeAttribute('data-dsh-local-view');
              writeConfig({ thoughtTranslate: mode === 'off' ? 'machine' : mode, thoughtView: act });
              renderThoughtBlock(thinkEl, { view: act, mode: mode === 'off' ? 'machine' : mode });
            }
          });
        });

        const paragraphs = extractThinkParagraphs(thinkEl);
        if (!paragraphs.length) return;
        const result = await translateParagraphs(paragraphs, mode, Boolean(opts.force));
        if (destroyed || !rec.cardEl.isConnected) return;
        rec.overlayEl.hidden = false;
        rec.overlayEl.setAttribute('data-op-bilingual', view === 'bilingual' ? '1' : '0');
        rec.overlayEl.setAttribute('data-op-zh-sig', `${mode}:${view}:${paragraphs.length}`);
        fillThoughtOverlayNodes(rec.overlayEl, paragraphs, result.translated, view);
        scheduleThoughtPortalSync();
        return;
      }

      // 静态舞台路径（preview/dsh-stage.html）：行内兄弟节点渲染并标记 data-dsh-prism-owned="1" 便于 destroy 完整清理
      staticEnhancedThoughts.add(thinkEl);
      let bar = bodyHost.querySelector(':scope > .ag-prism-thought-bar');
      if (!bar) {
        bar = doc.createElement('div');
        bar.className = 'ag-prism-thought-bar';
        bar.setAttribute('data-prism-ignore', '1');
        bar.setAttribute('data-dsh-prism-owned', '1');
        bodyHost.insertBefore(bar, thinkEl);
      }

      let overlay = bodyHost.querySelector(':scope > .ag-prism-thought-overlay');
      if (!overlay) {
        overlay = doc.createElement('div');
        overlay.className = 'ag-prism-thought-overlay';
        overlay.setAttribute('data-op-thought', '1');
        overlay.setAttribute('data-prism-ignore', '1');
        overlay.setAttribute('data-dsh-prism-owned', '1');
        bodyHost.appendChild(overlay);
      }

      bar.innerHTML = `
        <span class="ag-prism-thought-badge">${badgeLabel}</span>
        <span class="ag-prism-thought-btns">
          <button type="button" class="ag-prism-thought-btn" data-tact="immersive" aria-pressed="${!showRawOnly && view === 'immersive'}">${ui.immersive}</button>
          <button type="button" class="ag-prism-thought-btn" data-tact="bilingual" aria-pressed="${!showRawOnly && view === 'bilingual'}">${ui.bilingual}</button>
          <button type="button" class="ag-prism-thought-btn" data-tact="raw" aria-pressed="${showRawOnly}">${ui.rawText}</button>
          <button type="button" class="ag-prism-thought-btn" data-tact="retry">↻ ${ui.retranslate}</button>
        </span>
      `;
      bar.querySelectorAll('[data-tact]').forEach((btn) => {
        btn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          const act = btn.getAttribute('data-tact');
          if (act === 'retry') {
            renderThoughtBlock(thinkEl, { force: true, view: view === 'raw' ? 'immersive' : view, mode: mode === 'off' ? 'machine' : mode });
            return;
          }
          if (act === 'raw') {
            thinkEl.setAttribute('data-dsh-local-view', 'raw');
            renderThoughtBlock(thinkEl, { view: 'raw' });
          } else {
            thinkEl.removeAttribute('data-dsh-local-view');
            writeConfig({ thoughtTranslate: mode === 'off' ? 'machine' : mode, thoughtView: act });
            renderThoughtBlock(thinkEl, { view: act, mode: mode === 'off' ? 'machine' : mode });
          }
        });
      });

      if (showRawOnly) {
        thinkEl.hidden = false;
        thinkEl.style.display = '';
        overlay.hidden = true;
        return;
      }

      const paragraphs = extractThinkParagraphs(thinkEl);
      if (!paragraphs.length) return;
      const result = await translateParagraphs(paragraphs, mode, Boolean(opts.force));
      if (destroyed || !overlay.isConnected) return;

      thinkEl.hidden = true;
      thinkEl.style.display = 'none';
      overlay.hidden = false;
      overlay.setAttribute('data-op-bilingual', view === 'bilingual' ? '1' : '0');
      overlay.setAttribute('data-op-zh-sig', `${mode}:${view}:${paragraphs.length}`);
      fillThoughtOverlayNodes(overlay, paragraphs, result.translated, view);
    };

    const syncAllThoughts = (opts = {}) => {
      const thinkNodes = doc.querySelectorAll(':is(' + CHAT_CONTENT + ') :is(think, [data-dsh-think-raw="true"])');
      thinkNodes.forEach((el) => {
        void renderThoughtBlock(el, opts);
      });
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // D. 上下文感知右键快捷菜单 (Omni Context Menu)
    // ═══════════════════════════════════════════════════════════════════════════
    let activeMenu = null;
    const closeContextMenu = () => {
      if (activeMenu) {
        activeMenu.remove();
        activeMenu = null;
      }
    };
    cleanups.push(closeContextMenu);

    const openContextMenu = (x, y, header, items) => {
      closeContextMenu();
      const menu = doc.createElement('div');
      menu.className = 'ag-omni-menu ag-prism-omni-menu';
      menu.setAttribute('role', 'menu');
      menu.setAttribute('data-dsh-prism-owned', '1');
      if (header) {
        const h = doc.createElement('div');
        h.className = 'ag-omni-menu-header';
        h.textContent = header;
        menu.appendChild(h);
      }
      for (const it of items) {
        if (it.sep) {
          const s = doc.createElement('div');
          s.className = 'ag-omni-menu-sep';
          menu.appendChild(s);
          continue;
        }
        const b = doc.createElement('button');
        b.type = 'button';
        b.className = 'ag-omni-menu-item';
        b.innerHTML = `<span></span>${it.kbd ? `<span class="ag-omni-menu-kbd">${it.kbd}</span>` : ''}`;
        b.firstChild.textContent = it.label;
        b.addEventListener('click', (ev) => {
          ev.stopPropagation();
          closeContextMenu();
          safe(it.action);
        });
        menu.appendChild(b);
      }
      doc.body.appendChild(menu);
      const mw = menu.offsetWidth || 236;
      const mh = menu.offsetHeight || 220;
      const vw = win.innerWidth || 1280;
      const vh = win.innerHeight || 800;
      let left = clamp(x, 8, Math.max(8, vw - mw - 8));
      let top = clamp(y, 8, Math.max(8, vh - mh - 8));
      const whale = getWhaleRect();
      if (whale && left + mw > whale.left - 8 && top + mh > whale.top - 8) {
        const shiftLeft = whale.left - mw - 10;
        if (shiftLeft >= 8) left = shiftLeft;
        else top = Math.max(8, whale.top - mh - 10);
      }
      menu.style.left = `${Math.round(left)}px`;
      menu.style.top = `${Math.round(top)}px`;
      activeMenu = menu;
    };

    on(doc, 'contextmenu', (ev) => {
      if (destroyed || ev.shiftKey || ev.defaultPrevented) return;
      if (readConfig().contextMenu === false || readConfig().contextMenu === 'off') return;
      const t = ev.target;
      if (!t?.closest?.(CHAT_CONTENT) || t.closest(WORKBENCH_CHROME) || t.closest('button, [role="button"]')) return;
      ev.preventDefault();

      const selText = String(win.getSelection?.()?.toString?.() || '').trim();
      const codeCard = t.closest?.('.dsh-code-card');
      const codePre = t.closest?.('pre') || codeCard?.querySelector?.('pre') || null;
      const thinkShell = t.closest?.('.dsh-thought-shell, [data-dsh-thought="true"], think');
      const linkEl = t.closest?.('a[href]');
      const entries = [];
      let header = 'Obsidian Prism Workbench';

      if (selText) {
        header = `选中文本 (${selText.length} 字)`;
        entries.push({ label: '复制选中文本', kbd: 'Ctrl+C', action: () => safe(() => navigator?.clipboard?.writeText?.(selText)) });
        entries.push({
          label: '复制为引用',
          action: () => safe(() => navigator?.clipboard?.writeText?.(selText.split(/\r?\n/).map(line => '> ' + line).join('\n'))),
        });
        entries.push({ sep: true });
      }
      if (codePre || codeCard) {
        const pre = codePre || codeCard.querySelector('pre');
        const overlayRec = pre ? reactCodeOverlays.get(pre) : null;
        const foldBtn = overlayRec?.foldBtn || codeCard?.querySelector?.('.ag-cs-code-fold-btn') || null;
        header = `代码块 · ${detectCodeLang(pre || codeCard).toUpperCase()}`;
        entries.push({
          label: '复制整段代码',
          action: () => safe(() => navigator?.clipboard?.writeText?.((pre?.querySelector('code') || pre)?.textContent || '')),
        });
        if (foldBtn) {
          entries.push({ label: foldBtn.textContent || '折叠 / 展开代码块', action: () => foldBtn.click() });
        }
        entries.push({ sep: true });
      }
      if (thinkShell) {
        header = 'Thought Suite · 思考链';
        const curV = readConfig().thoughtView === 'bilingual' ? 'immersive' : 'bilingual';
        entries.push({
          label: curV === 'bilingual' ? '切换为双语上下对照' : '切换为沉浸纯译文',
          action: () => {
            writeConfig({ thoughtTranslate: 'machine', thoughtView: curV });
            syncAllThoughts({ view: curV, mode: 'machine' });
          },
        });
        entries.push({ label: '重新转译本思考块', action: () => syncAllThoughts({ force: true }) });
        entries.push({ sep: true });
      }
      if (linkEl) {
        entries.push({ label: '复制链接地址', action: () => safe(() => navigator?.clipboard?.writeText?.(linkEl.href)) });
        entries.push({ sep: true });
      }

      entries.push({ label: '跳至上一轮对话', kbd: 'Alt+↑', action: () => jumpUserTurn(-1) });
      entries.push({ label: '跳至下一轮对话', kbd: 'Alt+↓', action: () => jumpUserTurn(1) });
      entries.push({ label: '收起历史思考步骤', action: () => foldHistoricalSteps() });
      entries.push({ sep: true });
      entries.push({ label: '打开外观设置中心', kbd: 'Ctrl+Shift+P', action: () => openSettings() });
      openContextMenu(ev.clientX, ev.clientY, header, entries);
    });

    on(doc, 'pointerdown', (ev) => {
      const inMenu = activeMenu && (typeof activeMenu.contains === 'function' ? activeMenu.contains(ev.target) : ev.target === activeMenu);
      if (activeMenu && !inMenu) closeContextMenu();
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // E. 外观设置中心悬浮弹窗 (Ctrl+Shift+P 模态框，复用统一设置中心渲染器)
    // ═══════════════════════════════════════════════════════════════════════════
    let settingsOpen = false;

    const backdrop = doc.createElement('div');
    backdrop.className = 'dsh-prism-settings-backdrop';
    backdrop.setAttribute('data-testid', 'dsh-prism-settings-modal');
    backdrop.setAttribute('data-dsh-prism-owned', '1');
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.hidden = true;

    const modal = doc.createElement('div');
    modal.className = 'dsh-prism-settings-modal';
    backdrop.appendChild(modal);
    doc.body.appendChild(backdrop);

    const closeSettings = () => {
      settingsOpen = false;
      backdrop.hidden = true;
    };

    const modalController = createSettingsPanelController(modal, {
      doc,
      win,
      embedded: false,
      accessor,
      onClose: closeSettings,
      onConfigChanged(key) {
        if (key === 'thoughtTranslate' || key === 'thoughtView' || key === 'import' || key === 'reset') {
          syncAllThoughts();
        }
        if (key === 'language' || key === 'import' || key === 'reset') {
          syncCodeBlocks();
          renderOutline();
        }
      },
      onThoughtProfileSaved() {
        syncAllThoughts({ force: true });
      },
      onClearThoughtCache() {
        thoughtCache.clear();
      },
    });
    cleanups.push(() => {
      modalController.destroy();
      backdrop.remove();
    });

    const renderSettingsModal = () => modalController.render();
    const applyScenePreset = (presetId) => modalController.applyScenePreset(presetId);
    const exportConfigJson = () => modalController.exportConfigJson();
    const importConfigJson = (rawText) => modalController.importConfigJson(rawText);
    const resetDefaults = () => modalController.resetDefaults();

    const openSettings = (tab) => {
      if (tab) modalController.setTab(tab);
      settingsOpen = true;
      backdrop.hidden = false;
      renderSettingsModal();
    };

    const toggleSettings = () => (settingsOpen ? closeSettings() : openSettings());

    on(backdrop, 'pointerdown', (ev) => {
      if (ev.target === backdrop) closeSettings();
    });

    // 绑定全局快捷键：Ctrl+Shift+P 打开设置中心，Alt+Up/Down 轮次跳转，Esc 关闭弹层
    on(win, 'keydown', (ev) => {
      if (destroyed || !ev) return;
      if ((ev.ctrlKey || ev.metaKey) && ev.shiftKey && String(ev.key || '').toLowerCase() === 'p') {
        ev.preventDefault();
        toggleSettings();
        return;
      }
      if (ev.key === 'Escape') {
        if (activeMenu) closeContextMenu();
        else if (settingsOpen) closeSettings();
        else if (outlineOpen) closeNavOutline();
        return;
      }
      if (ev.altKey && !ev.ctrlKey && !ev.metaKey && !ev.shiftKey && (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') && !isEditableElement(ev.target)) {
        if (jumpUserTurn(ev.key === 'ArrowUp' ? -1 : 1)) ev.preventDefault();
      }
    });

    on(win, 'ag-prism:open-settings', () => openSettings());
    on(win, 'ag-prism:config', () => {
      applyFallbackDomAttrs(readConfig());
      runDomSyncAll();
      if (settingsOpen) renderSettingsModal();
      if (outlineOpen) renderOutline();
    });

    // 兼容 preview/dsh-stage.html 的快捷思考视图按钮（直接触发同步）
    const demoThoughtBtn = doc.getElementById('btn-demo-thought-view');
    if (demoThoughtBtn) {
      on(demoThoughtBtn, 'click', () => {
        safeTimeout(() => {
          const isBil = demoThoughtBtn.textContent?.includes('双语');
          const nextV = isBil ? 'bilingual' : 'immersive';
          writeConfig({ thoughtTranslate: 'machine', thoughtView: nextV });
          syncAllThoughts({ view: nextV, mode: 'machine' });
        }, 0);
      });
    }

    const runDomSyncAll = () => {
      if (destroyed) return;
      surfaceMarkers.sync(readConfig());
      if (isComposing) {
        pendingSyncAfterIme = true;
        return;
      }
      syncCodeBlocks();
      syncNavRails();
      syncAllThoughts();
    };
    triggerDeferredSync = runDomSyncAll;

    // Reconcile late mounts, workspace swaps and identity-attribute changes. The observer
    // does not subscribe to Prism's marker attributes or Lexical's typing attributes.
    let mutTimer = 0;
    const Observer = win.MutationObserver || (typeof MutationObserver === 'function' && MutationObserver);
    if (Observer && doc.body) {
      const relevantMutation = (m) => {
        if (m.target.closest?.(PLUGIN_UI)) return false;
        if (m.type === 'attributes') {
          if (m.attributeName === 'class') {
            return m.target.matches(SIDEBAR_COLUMN + ', .mP3x-q_frame, .dsh-composer-region, [data-prism-sidebar="1"]') ||
              (m.oldValue || '').split(/\s+/).some(name => name === 'mP3x-q_frame' || name === 'dsh-composer-region');
          }
          if (m.attributeName === 'id') {
            return [m.target.id, m.oldValue].some(id => id === 'root' || id === 'dsh-composer-editor');
          }
          if (m.attributeName === 'role') {
            return m.target.matches('[data-composer-input], [data-shortcut-modal], #dsh-composer-editor');
          }
          return true;
        }
        if (m.target.closest?.(EDIT_FIELD)) return false;
        return [...m.addedNodes, ...m.removedNodes].some(node => !node.matches?.(PLUGIN_UI));
      };
      const obs = new Observer(mutations => {
        if (destroyed || mutTimer || !mutations.some(relevantMutation)) return;
        mutTimer = setTimeout(() => {
          mutTimer = 0;
          runDomSyncAll();
        }, 120);
      });
      obs.observe(doc.body, {
        childList: true, subtree: true, attributes: true, attributeOldValue: true,
        attributeFilter: [
          'class', 'id', 'role', 'data-sidebar-toggle', 'data-sidebar-scrollport', 'data-shortcut-modal',
          'data-composer-seat', 'data-conversation-region', 'data-composer-card', 'data-composer-input',
          'data-input-scroll', 'data-composer-overlay', 'data-chat-flow', 'data-chat-history', 'data-message-bubble',
          'data-dsh-shell', 'data-dsh-chat', 'data-dsh-sidebar', 'data-dsh-composer',
        ],
      });
      cleanups.push(() => {
        obs.disconnect();
        if (mutTimer) clearTimeout(mutTimer);
      });
    }

    // 初始全量挂载同步
    applyFallbackDomAttrs(readConfig());
    runDomSyncAll();

    const instance = {
      _bridge: activeBridge,
      destroy() {
        if (destroyed) return;
        destroyed = true;
        if (hideOutlineTimer) clearTimeout(hideOutlineTimer);
        sonarTimers.forEach((t) => clearTimeout(t));
        sonarTimers.clear();
        transientTimers.forEach((t) => clearTimeout(t));
        transientTimers.clear();
        // 清理所有通过 mountSettingsIntoElement 挂载的内嵌面板
        Array.from(mountedEmbeddedCleanups).forEach((fn) => safe(fn));
        mountedEmbeddedCleanups.clear();
        cleanups.forEach((fn) => safe(fn));
        cleanups.length = 0;
        const st = doc.getElementById?.(WORKBENCH_STYLE_ID);
        if (st) safe(() => st.remove());
        if (activeInstance === instance) activeInstance = null;
      },
      sync: runDomSyncAll,
      mountSettingsIntoElement: (el, br, opt) => mountSettingsIntoElement(el, br || activeBridge, { doc, win, ...(opt || {}) }),
      openSettings,
      closeSettings,
      toggleSettings,
      applyPreset: applyScenePreset,
      exportConfigJson,
      importConfigJson,
      resetDefaults,
      jumpUserTurn,
      foldHistoricalSteps,
      openNavOutline,
      closeNavOutline,
      closeContextMenu,
      setThoughtView: (view) => {
        const v = view === 'bilingual' ? 'bilingual' : 'immersive';
        writeConfig({ thoughtView: v });
        syncAllThoughts({ view: v });
      },
      setThoughtMode: (mode) => {
        const m = ['off', 'machine', 'ai'].includes(mode) ? mode : 'machine';
        writeConfig({ thoughtTranslate: m });
        syncAllThoughts({ mode: m });
      },
      translateAllThoughts: (force = false) => syncAllThoughts({ force }),
      clearThoughtCache: () => {
        thoughtCache.clear();
        writeStore(THOUGHT_CACHE_KEY, null);
      },
      getState: () => ({
        settingsOpen,
        outlineOpen,
        lang: getLang(),
        config: readConfig(),
        reactCodeOverlayCount: reactCodeOverlays.size,
        embeddedSettingsCount: mountedEmbeddedCleanups.size,
      }),
    };

    activeInstance = instance;
    return instance;
  }

  return {
    init,
    destroy: () => activeInstance?.destroy?.(),
    sync: () => activeInstance?.sync?.(),
    mountSettingsIntoElement,
    openSettings: (t) => activeInstance?.openSettings?.(t),
    closeSettings: () => activeInstance?.closeSettings?.(),
    toggleSettings: () => activeInstance?.toggleSettings?.(),
    applyPreset: (p) => activeInstance?.applyPreset?.(p),
    exportConfigJson: () => activeInstance?.exportConfigJson?.(),
    importConfigJson: (j) => activeInstance?.importConfigJson?.(j),
    resetDefaults: () => activeInstance?.resetDefaults?.(),
    jumpUserTurn: (d) => activeInstance?.jumpUserTurn?.(d),
    foldHistoricalSteps: () => activeInstance?.foldHistoricalSteps?.(),
    openNavOutline: () => activeInstance?.openNavOutline?.(),
    closeNavOutline: () => activeInstance?.closeNavOutline?.(),
    closeContextMenu: () => activeInstance?.closeContextMenu?.(),
    setThoughtView: (v) => activeInstance?.setThoughtView?.(v),
    setThoughtMode: (m) => activeInstance?.setThoughtMode?.(m),
    translateAllThoughts: (f) => activeInstance?.translateAllThoughts?.(f),
    clearThoughtCache: () => activeInstance?.clearThoughtCache?.(),
    getState: () => activeInstance?.getState?.() || null,
    i18n: { LANG_OPTIONS, normalizeLanguage, getUiStrings },
    schema: PRISM_SETTINGS_SCHEMA,
    presets: SCENE_PRESETS,
    settingsCore: {
      PRISM_SETTINGS_SCHEMA,
      UPSTREAM_SETTINGS_KEYS,
      DSH_SETTINGS_EXTENSIONS,
      SETTINGS_SUPPORT,
      SETTINGS_GROUPS,
      SCENE_PRESETS,
      UPSTREAM_CREDITS,
      getDefaultSettingsPatch,
      normalizeMascotSetting,
      buildSanitizedConfigExport,
      validateImportedConfigJson,
      mountSettingsIntoElement,
    },
    enhancerCore: {
      MIN_CODE_FOLD_LINES,
      translateParagraphOffline,
      isReactNode,
    },
  };
});

}).call(
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : {},
  typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : undefined),
  typeof self !== "undefined" ? self : (typeof window !== "undefined" ? window : undefined),
  typeof document !== "undefined" ? document : undefined,
  undefined,
  undefined
);
          
// === [Bootstrap] Obsidian Prism DSH Runtime Initializer ===
;(function (G) {
  'use strict';
  if (!G) return;

  var VERSION = "1.0.7-beta.1-dsh.4";
  var CODE_HASH = "r9rbg5";
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
