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
