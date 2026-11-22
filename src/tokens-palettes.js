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
