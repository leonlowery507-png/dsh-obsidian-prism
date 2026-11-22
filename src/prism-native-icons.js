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
