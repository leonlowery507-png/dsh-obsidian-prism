/**
 * Obsidian Prism (黑曜棱镜) — DeepSeek Harness Desktop (`dsh`) / Cordis 宿主端入口 (`lib/index.js`)
 *
 * 设计规范（对齐真实 DSH Desktop 协议）：
 * 1. 本地 `link:` 安装时 Node 按真实路径解析，本文件仅 import `node:*` 内置模块与相对路径文件，零外部裸包依赖。
 * 2. 顶层绝不声明强阻塞的 `inject: ['webServer']`，导出 `{ name: 'obsidian-prism', apply(root, config) }`。
 * 3. 在 `apply(root, config)` 内使用 `root.inject(['webServer'], (ctx) => { ... })` 非阻塞注册同源 HTTP API：
 *    - `GET  /api/obsidian-prism/health`
 *    - `GET  /api/obsidian-prism/config`
 *    - `POST /api/obsidian-prism/config`
 *    持久化至 `path.join(process.env.DSH_HOME || path.join(os.homedir(), '.dsh'), 'obsidian-prism-config.json')`，
 *    自动剥离敏感凭据并兼容回环 Host (`127.0.0.1` / `localhost` / `::1`) 与 `dsh-app://app` 桌面端协议。
 *
 * License: GPL-3.0-only (保留原作者 RMvdesi 署名与 NOTICE 声明)
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

/**
 * 在启用 `"type": "module"` 的包内安全加载 UMD/CommonJS 形态的同包源码模块，
 * 避免 Node ESM 环境下 `require('./xxx.js')` 触发 ERR_REQUIRE_ESM。
 */
function loadCjsHelper(relPath) {
  const absPath = path.resolve(__dirname, relPath);
  const code = fs.readFileSync(absPath, 'utf8');
  const mod = { exports: {} };
  const sandbox = {
    module: mod,
    exports: mod.exports,
    require: () => ({}),
    console,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    URL,
    URLSearchParams,
  };
  vm.runInNewContext(code, sandbox, { filename: absPath });
  return mod.exports;
}

const tokensModule = loadCjsHelper('../src/tokens-palettes.js');
const bridgeModule = loadCjsHelper('../src/dsh-bridge.js');

export const name = 'obsidian-prism';
export const packageName = 'dsh-obsidian-prism';
export const version = '1.0.4';
export const API_PREFIX = '/api/obsidian-prism';

export const {
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
} = tokensModule;

const HTML_MARKER_START = '<!-- [dsh-obsidian-prism:start] -->';
const HTML_MARKER_END = '<!-- [dsh-obsidian-prism:end] -->';

const SECRET_REDACT_RE =
  /(sk-[A-Za-z0-9_\-]{6,}|gsk_[A-Za-z0-9_\-]{12,}|hf_[A-Za-z0-9_\-]{12,}|pplx-[A-Za-z0-9_\-]{12,}|AIza[A-Za-z0-9_\-]{12,}|xai-[A-Za-z0-9_\-]{8,}|ghp_[A-Za-z0-9]{12,}|Bearer\s+[A-Za-z0-9._\-:+/=]{6,})/gi;

/**
 * 解析 DSH 宿主持久化配置文件路径：
 * `path.join(process.env.DSH_HOME || path.join(os.homedir(), '.dsh'), 'obsidian-prism-config.json')`
 */
export function resolveHostConfigPath() {
  const dshHome = process.env.DSH_HOME || path.join(os.homedir(), '.dsh');
  return path.join(dshHome, 'obsidian-prism-config.json');
}

/**
 * 脱敏并清洗配置对象（剥离 apiKey / secret / token 与原型链污染键）
 */
export function sanitizePrismConfig(rawObj = {}) {
  const baseDefaults = bridgeModule?.DEFAULT_CONFIG || {
    language: 'zh-CN',
    lang: 'zh-CN',
    theme: 'obsidian',
    palette: 'obsidian',
    lightPreset: 'crystal',
    motionLevel: 'ultra',
    targetFps: '180',
    accentTone: 'follow',
    cornerStyle: 'balanced',
    codeFont: 'default',
    codeLigatures: false,
    ambientIntensity: '100',
    thoughtTranslate: 'machine',
    thoughtView: 'bilingual',
    mascot: 'whale',
    reasoningEffort: 'high',
    scenePreset: 'full',
  };

  if (!rawObj || typeof rawObj !== 'object' || Array.isArray(rawObj)) {
    return { ...baseDefaults };
  }

  const clean = {};
  for (const [k, v] of Object.entries(rawObj)) {
    if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
    if (/^(?:api[_-]?key|secret|password|access[_-]?token|bearer)$/i.test(k)) continue;
    if (typeof v === 'string') {
      clean[k] = v.replace(SECRET_REDACT_RE, '***REDACTED***').slice(0, 512);
    } else if (typeof v === 'boolean' || typeof v === 'number') {
      clean[k] = v;
    }
  }

  // Single source of truth: the browser bridge owns aliases, enum validation and
  // all 36 upstream/DSH keys. Node only strips secrets before handing it over.
  const out =
    typeof bridgeModule?.normalizeConfig === 'function'
      ? { ...baseDefaults, ...bridgeModule.normalizeConfig(clean) }
      : { ...baseDefaults, ...clean };
  out.mascot = bridgeModule.normalizeMascotMode(out.mascot);

  // 保持 theme 与 palette/lightPreset 联动一致
  const resolvedTheme = resolveThemeId(out);
  out.theme = resolvedTheme;
  if (resolvedTheme === 'obsidian') {
    out.palette = 'obsidian';
    out.lightPreset = 'crystal';
  } else if (resolvedTheme === 'warm') {
    out.palette = 'warm';
    out.lightPreset = 'alabaster';
  } else if (resolvedTheme === 'crystal') {
    out.palette = 'obsidian';
    out.lightPreset = 'crystal';
  } else if (resolvedTheme === 'alabaster') {
    out.palette = 'warm';
    out.lightPreset = 'alabaster';
  }

  return out;
}

/**
 * 读取落盘配置（任何异常静默回退至默认配置）
 */
export function readHostPrismConfig() {
  try {
    const file = resolveHostConfigPath();
    if (!fs.existsSync(file)) {
      return sanitizePrismConfig({});
    }
    const raw = fs.readFileSync(file, 'utf8');
    const parsed = JSON.parse(raw);
    const cfgPayload = parsed && typeof parsed.config === 'object' && parsed.config ? parsed.config : parsed;
    return sanitizePrismConfig(cfgPayload);
  } catch {
    return sanitizePrismConfig({});
  }
}

/**
 * 原子写入脱敏配置至 `~/.dsh/obsidian-prism-config.json`
 */
export async function writeHostPrismConfig(patchOrConfig = {}) {
  const current = readHostPrismConfig();
  const next = sanitizePrismConfig({ ...current, ...(patchOrConfig || {}) });
  const file = resolveHostConfigPath();
  const tmpFile = `${file}.tmp-${process.pid}-${Date.now().toString(36)}`;
  try {
    await fs.promises.mkdir(path.dirname(file), { recursive: true });
    const serialized = JSON.stringify(next, null, 2) + '\n';
    await fs.promises.writeFile(tmpFile, serialized, { encoding: 'utf8', mode: 0o600 });
    await fs.promises.rename(tmpFile, file);
  } catch {
    try {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    } catch {}
  }
  return next;
}

/**
 * 校验请求来源：放行本机回环 Host (`localhost` / `127.0.0.0/8` / `::1`) 与 `dsh-app://app` 桌面端协议，拒绝跨站请求
 */
export function isTrustedSameOriginRequest(req) {
  try {
    const headers = (req && req.headers) || {};
    const secFetchSite = String(headers['sec-fetch-site'] || '').toLowerCase();
    if (secFetchSite === 'cross-site') return false;

    const rawHost = String(headers.host || '127.0.0.1').trim();
    let hostname = '127.0.0.1';
    try {
      const u = new URL(`http://${rawHost}`);
      hostname = u.hostname.toLowerCase().replace(/^\[|\]$/g, '');
    } catch {
      return false;
    }

    const isLoopback =
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname === '::1' ||
      /^127(?:\.\d{1,3}){3}$/.test(hostname);

    if (!isLoopback) return false;

    const origin = String(headers.origin || '').trim();
    if (origin && origin !== 'null') {
      if (origin.toLowerCase().startsWith('dsh-app://')) return true;
      try {
        const ou = new URL(origin);
        const oh = ou.hostname.toLowerCase().replace(/^\[|\]$/g, '');
        if (
          oh !== 'localhost' &&
          !oh.endsWith('.localhost') &&
          oh !== '::1' &&
          !/^127(?:\.\d{1,3}){3}$/.test(oh)
        ) {
          return false;
        }
      } catch {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

function sendJson(res, statusCode, payload) {
  try {
    const text = JSON.stringify(payload);
    const bytes = Buffer.from(text, 'utf8');
    if (typeof res.writeHead === 'function') {
      res.writeHead(statusCode, {
        'content-type': 'application/json; charset=utf-8',
        'content-length': String(bytes.length),
        'cache-control': 'no-store',
      });
      res.end(bytes);
    } else {
      res.statusCode = statusCode;
      res.setHeader?.('content-type', 'application/json; charset=utf-8');
      res.setHeader?.('cache-control', 'no-store');
      res.end?.(text);
    }
  } catch {}
}

function readJsonBody(req, maxBytes = 128 * 1024) {
  return new Promise((resolve, reject) => {
    try {
      if (req && req.body && typeof req.body === 'object') {
        resolve(req.body);
        return;
      }
      if (!req || typeof req.on !== 'function') {
        resolve({});
        return;
      }
      const chunks = [];
      let size = 0;
      req.on('data', (chunk) => {
        const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk));
        size += buf.length;
        if (size > maxBytes) {
          try {
            req.destroy?.();
          } catch {}
          reject(Object.assign(new Error('Request body too large'), { status: 413 }));
          return;
        }
        chunks.push(buf);
      });
      req.on('end', () => {
        try {
          const text = Buffer.concat(chunks).toString('utf8').trim();
          resolve(text ? JSON.parse(text) : {});
        } catch (err) {
          reject(Object.assign(new Error('Invalid JSON body'), { status: 400 }));
        }
      });
      req.on('error', reject);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * 获取编译产物与源码回退路径
 */
export function getAssetPaths() {
  const distDir = path.join(ROOT_DIR, 'dist');
  const srcDir = path.join(ROOT_DIR, 'src');
  const libDir = path.join(ROOT_DIR, 'lib');
  const distCss = path.join(distDir, 'dsh-prism.css');
  const srcCss = path.join(srcDir, 'prism-style.css');
  const distBundle = path.join(distDir, 'dsh-prism.bundle.js');
  const distUserscript = path.join(distDir, 'dsh-prism.userscript.js');
  const clientEntry = path.join(libDir, 'client.js');
  const previewStage = path.join(ROOT_DIR, 'preview', 'dsh-stage.html');

  return {
    rootDir: ROOT_DIR,
    distDir,
    srcDir,
    libDir,
    cssPath: fs.existsSync(distCss) ? distCss : srcCss,
    distCssPath: distCss,
    srcCssPath: srcCss,
    bundlePath: distBundle,
    userscriptPath: distUserscript,
    clientEntryPath: clientEntry,
    previewStagePath: previewStage,
  };
}

/**
 * 读取已编译的 CSS 与 JS Bundle 内容
 */
export function readBundleAssets() {
  const paths = getAssetPaths();
  const css = fs.existsSync(paths.cssPath) ? fs.readFileSync(paths.cssPath, 'utf8') : '';
  const bundleJs = fs.existsSync(paths.bundlePath) ? fs.readFileSync(paths.bundlePath, 'utf8') : '';
  const userscriptJs = fs.existsSync(paths.userscriptPath) ? fs.readFileSync(paths.userscriptPath, 'utf8') : '';
  return {
    css,
    bundleJs,
    userscriptJs,
    paths,
  };
}

/**
 * 构建注入 HTML Shell 的标签片段
 */
export function buildHtmlInjectionSnippet(customConfig = {}, options = {}) {
  const inline = Boolean(options.inline);
  const basePath = String(options.publicPath || '/__obsidian-prism').replace(/\/+$/, '');
  const bootConfigJson = JSON.stringify(customConfig || {}).replace(/</g, '\\u003c');

  if (inline) {
    const { css, bundleJs } = readBundleAssets();
    return [
      HTML_MARKER_START,
      `<script id="dsh-prism-boot-config">window.__DSH_PRISM_BOOT_CONFIG__ = ${bootConfigJson};</script>`,
      `<style id="ag-prism-css" data-dsh-prism="${version}">\n${css}\n</style>`,
      `<script id="dsh-prism-bundle" data-dsh-prism="${version}">\n${bundleJs}\n</script>`,
      HTML_MARKER_END,
    ].join('\n');
  }

  return [
    HTML_MARKER_START,
    `<script id="dsh-prism-boot-config">window.__DSH_PRISM_BOOT_CONFIG__ = ${bootConfigJson};</script>`,
    `<link id="ag-prism-css" rel="stylesheet" href="${basePath}/dsh-prism.css?v=${version}" />`,
    `<script id="dsh-prism-bundle" defer src="${basePath}/dsh-prism.bundle.js?v=${version}"></script>`,
    HTML_MARKER_END,
  ].join('\n');
}

export function injectIntoHtmlString(htmlString, customConfig = {}, options = {}) {
  const raw = String(htmlString || '');
  const snippet = buildHtmlInjectionSnippet(customConfig, options);
  const blockRe = new RegExp(
    `${HTML_MARKER_START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${HTML_MARKER_END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
    'g'
  );

  if (blockRe.test(raw)) {
    return raw.replace(blockRe, () => snippet);
  }
  if (/<\/head>/i.test(raw)) {
    return raw.replace(/<\/head>/i, () => `${snippet}\n</head>`);
  }
  if (/<\/body>/i.test(raw)) {
    return raw.replace(/<\/body>/i, () => `${snippet}\n</body>`);
  }
  return `${raw}\n${snippet}\n`;
}

export function injectIntoHtmlFile(htmlFilePath, customConfig = {}, options = {}) {
  const abs = path.resolve(htmlFilePath);
  if (!fs.existsSync(abs)) {
    throw new Error(`未找到目标 HTML 文件: ${abs}`);
  }
  const orig = fs.readFileSync(abs, 'utf8');
  const next = injectIntoHtmlString(orig, customConfig, options);
  fs.writeFileSync(abs, next, 'utf8');
  return { ok: true, filePath: abs, changed: orig !== next };
}

export function removeFromHtmlFile(htmlFilePath) {
  const abs = path.resolve(htmlFilePath);
  if (!fs.existsSync(abs)) {
    throw new Error(`未找到目标 HTML 文件: ${abs}`);
  }
  const orig = fs.readFileSync(abs, 'utf8');
  const blockRe = new RegExp(
    `\\n?${HTML_MARKER_START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${HTML_MARKER_END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n?`,
    'g'
  );
  const next = orig.replace(blockRe, '\n');
  fs.writeFileSync(abs, next, 'utf8');
  return { ok: true, filePath: abs, removed: orig !== next };
}

/**
 * 处理 `/api/obsidian-prism/*` 同源 HTTP 请求
 */
export async function handlePrismApiRequest(req, res) {
  try {
    if (!isTrustedSameOriginRequest(req)) {
      sendJson(res, 403, { ok: false, error: 'Forbidden: loopback or dsh-app same-origin required' });
      return;
    }

    const rawUrl = String(req?.url || '/').split('?')[0];
    const subRoute = rawUrl.startsWith(API_PREFIX) ? rawUrl.slice(API_PREFIX.length) || '/' : rawUrl;
    const method = String(req?.method || 'GET').toUpperCase();

    if ((subRoute === '/health' || subRoute === '/') && method === 'GET') {
      sendJson(res, 200, {
        ok: true,
        name,
        packageName,
        version,
        configPath: resolveHostConfigPath(),
        themes: Object.keys(PRISM_THEMES),
        accents: Object.keys(PRISM_ACCENTS),
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (subRoute === '/config' && method === 'GET') {
      const cfg = readHostPrismConfig();
      sendJson(res, 200, {
        ok: true,
        config: cfg,
        configPath: resolveHostConfigPath(),
      });
      return;
    }

    if (subRoute === '/config' && (method === 'POST' || method === 'PUT')) {
      const body = await readJsonBody(req);
      const patch = body && typeof body.config === 'object' && body.config ? body.config : body;
      const saved = await writeHostPrismConfig(patch);
      sendJson(res, 200, {
        ok: true,
        saved: true,
        config: saved,
        configPath: resolveHostConfigPath(),
      });
      return;
    }

    sendJson(res, 404, { ok: false, error: `Unknown obsidian-prism endpoint: ${method} ${subRoute}` });
  } catch (err) {
    const code = typeof err?.status === 'number' ? err.status : 500;
    sendJson(res, code, { ok: false, error: String(err?.message || err || 'Internal error') });
  }
}

/**
 * DeepSeek Harness / Cordis 标准插件生命周期入口 `apply(root, config)`
 * 绝不在顶层声明阻塞 `inject`，所有服务注册均通过 `root.inject(['webServer'], ...)` 及 `try/catch` 安全执行。
 */
export function apply(root, config = {}) {
  const disposers = [];
  const accentTone = config?.accentTone || 'follow';
  const themeDefs = toCordisThemeDefinitions(accentTone);
  const paths = getAssetPaths();
  const publicPath = String(config?.publicPath || '/__obsidian-prism').replace(/\/+$/, '');

  const registerOnWebServer = (webServer) => {
    try {
      if (!webServer || typeof webServer.register !== 'function') return;
      const disp = webServer.register({
        kind: 'prefix',
        path: API_PREFIX,
        handler: handlePrismApiRequest,
      });
      if (typeof disp === 'function') disposers.push(disp);
    } catch {}
  };

  try {
    // 1. 使用 root.inject(['webServer'], ...) 非阻塞挂载同源 HTTP API
    if (root && typeof root.inject === 'function') {
      try {
        const d = root.inject(['webServer'], (ctx) => {
          try {
            registerOnWebServer(ctx?.webServer || root?.webServer);
          } catch {}
        });
        if (typeof d === 'function') disposers.push(d);
      } catch {}
    } else if (root?.webServer) {
      registerOnWebServer(root.webServer);
    }

    // 2. 兼容 ctx.theme 主题注册（若宿主提供）
    const themeSvc = root?.theme;
    if (themeSvc) {
      for (const def of themeDefs) {
        try {
          if (typeof themeSvc.register === 'function') {
            const dispose = themeSvc.register(def);
            if (typeof dispose === 'function') disposers.push(dispose);
          } else if (typeof themeSvc.addTheme === 'function') {
            const dispose = themeSvc.addTheme(def.name, def);
            if (typeof dispose === 'function') disposers.push(dispose);
          } else if (themeSvc.themes && typeof themeSvc.themes.set === 'function') {
            themeSvc.themes.set(def.name, def);
            disposers.push(() => themeSvc.themes.delete(def.name));
          }
        } catch {}
      }
    }

    // 3. 兼容 ctx.web / ctx.webui 静态资源钩子（若宿主提供）
    const webSvc = root?.web || root?.webui;
    if (webSvc) {
      try {
        if (typeof webSvc.addStyle === 'function') {
          const d = webSvc.addStyle(paths.cssPath, { id: 'ag-prism-css', publicPath: `${publicPath}/dsh-prism.css` });
          if (typeof d === 'function') disposers.push(d);
        }
        if (typeof webSvc.addScript === 'function') {
          const d = webSvc.addScript(paths.bundlePath, { id: 'dsh-prism-bundle', publicPath: `${publicPath}/dsh-prism.bundle.js` });
          if (typeof d === 'function') disposers.push(d);
        }
        if (typeof webSvc.addEntry === 'function') {
          const d = webSvc.addEntry({
            name,
            version,
            css: paths.cssPath,
            js: paths.bundlePath,
            config,
          });
          if (typeof d === 'function') disposers.push(d);
        }
        if (typeof webSvc.transformHtml === 'function') {
          const d = webSvc.transformHtml((html) => injectIntoHtmlString(html, config, { publicPath }));
          if (typeof d === 'function') disposers.push(d);
        }
      } catch {}
    }

    // 4. 兼容 ctx.server / ctx.http 中间件
    const srv = root?.server || root?.http;
    const routeHandler = (req, res, next) => {
      try {
        const reqUrl = String(req?.url || req?.path || '').split('?')[0];
        if (reqUrl.startsWith(API_PREFIX)) {
          void handlePrismApiRequest(req, res);
          return;
        }
        if (reqUrl === `${publicPath}/dsh-prism.css`) {
          const { css } = readBundleAssets();
          res.setHeader?.('Content-Type', 'text/css; charset=utf-8');
          res.setHeader?.('Cache-Control', 'no-cache');
          res.end?.(css);
          return;
        }
        if (reqUrl === `${publicPath}/dsh-prism.bundle.js`) {
          const { bundleJs } = readBundleAssets();
          res.setHeader?.('Content-Type', 'application/javascript; charset=utf-8');
          res.setHeader?.('Cache-Control', 'no-cache');
          res.end?.(bundleJs);
          return;
        }
        if (reqUrl === `${publicPath}/dsh-prism.userscript.js`) {
          const { userscriptJs } = readBundleAssets();
          res.setHeader?.('Content-Type', 'application/javascript; charset=utf-8');
          res.end?.(userscriptJs);
          return;
        }
      } catch {}
      if (typeof next === 'function') next();
    };

    if (srv) {
      try {
        if (typeof srv.use === 'function') {
          srv.use(routeHandler);
        } else if (typeof srv.get === 'function') {
          srv.get(`${publicPath}/dsh-prism.css`, (req, res) => routeHandler(req, res));
          srv.get(`${publicPath}/dsh-prism.bundle.js`, (req, res) => routeHandler(req, res));
          srv.get(`${publicPath}/dsh-prism.userscript.js`, (req, res) => routeHandler(req, res));
        }
      } catch {}
    }

    // 5. 绑定卸载清理钩子
    const cleanupAll = () => {
      while (disposers.length > 0) {
        const fn = disposers.pop();
        try {
          if (typeof fn === 'function') fn();
        } catch {}
      }
    };

    if (typeof root?.effect === 'function') {
      try {
        root.effect(() => cleanupAll);
      } catch {}
    } else if (typeof root?.on === 'function') {
      try {
        root.on('dispose', cleanupAll);
      } catch {}
    }

    return {
      name,
      packageName,
      version,
      themes: themeDefs,
      publicPath,
      paths,
      configPath: resolveHostConfigPath(),
      handlePrismApiRequest,
      injectHtml: (html, opts) => injectIntoHtmlString(html, config, { publicPath, ...opts }),
      dispose: cleanupAll,
    };
  } catch {
    return {
      name,
      packageName,
      version,
      themes: themeDefs,
      publicPath,
      paths,
      dispose() {},
    };
  }
}

/**
 * 命令行辅助入口 (node src/index.mjs --themes | --print-snippet | --inject-html <file>)
 */
export function runCli(argv = process.argv.slice(2)) {
  if (argv.includes('--help') || argv.includes('-h')) {
    console.log(
      [
        `Obsidian Prism for DeepSeek Harness (${packageName} v${version})`,
        '',
        '用法:',
        '  node src/index.mjs --themes                   打印 4 套原版光学主题与 5 档工业强调色清单',
        '  node src/index.mjs --print-snippet            输出可嵌入 DSH Web UI 的 HTML 注入片段',
        '  node src/index.mjs --inject-html <htmlPath>   向指定 HTML 文件幂等注入 Obsidian Prism',
        '  node src/index.mjs --remove-html <htmlPath>   从指定 HTML 文件移除 Obsidian Prism',
      ].join('\n')
    );
    return 0;
  }

  if (argv.includes('--themes')) {
    const defs = toCordisThemeDefinitions();
    console.log(
      JSON.stringify(
        {
          version,
          themes: defs.map((d) => ({ id: d.name, label: d.label, mode: d.type, colors: d.colors })),
        },
        null,
        2
      )
    );
    return 0;
  }

  if (argv.includes('--print-snippet')) {
    const inline = argv.includes('--inline');
    console.log(buildHtmlInjectionSnippet({}, { inline }));
    return 0;
  }

  const injIdx = argv.indexOf('--inject-html');
  if (injIdx >= 0 && argv[injIdx + 1]) {
    const res = injectIntoHtmlFile(argv[injIdx + 1], {}, { inline: argv.includes('--inline') });
    console.log(`[✓] 已注入 Obsidian Prism 至: ${res.filePath}`);
    return 0;
  }

  const remIdx = argv.indexOf('--remove-html');
  if (remIdx >= 0 && argv[remIdx + 1]) {
    const res = removeFromHtmlFile(argv[remIdx + 1]);
    console.log(`[✓] 已从目标文件移除 Obsidian Prism: ${res.filePath}`);
    return 0;
  }

  const paths = getAssetPaths();
  console.log(`[${packageName} v${version}] 就绪。样式表: ${paths.cssPath} | 运行时包: ${paths.bundlePath}`);
  return 0;
}

const isDirectRun =
  typeof process !== 'undefined' &&
  Array.isArray(process.argv) &&
  process.argv[1] &&
  path.resolve(process.argv[1]) === __filename;

if (isDirectRun) {
  runCli();
}

export default {
  name,
  packageName,
  version,
  API_PREFIX,
  apply,
  PRISM_THEMES,
  PRISM_ACCENTS,
  CORNER_PRESETS,
  CODE_FONTS,
  SCENE_PRESETS,
  resolveThemeId,
  buildCssVariables,
  applyTokensToDocument,
  toCordisThemeDefinitions,
  resolveHostConfigPath,
  sanitizePrismConfig,
  readHostPrismConfig,
  writeHostPrismConfig,
  isTrustedSameOriginRequest,
  handlePrismApiRequest,
  getAssetPaths,
  readBundleAssets,
  buildHtmlInjectionSnippet,
  injectIntoHtmlString,
  injectIntoHtmlFile,
  removeFromHtmlFile,
  runCli,
};
