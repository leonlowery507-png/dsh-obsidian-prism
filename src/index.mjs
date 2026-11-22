#!/usr/bin/env node
/**
 * Obsidian Prism (黑曜棱镜) — DeepSeek Harness (dsh) / Cordis 插件入口与 CLI 工具 (`src/index.mjs`)
 * 与 `lib/index.js` 保持 100% 导出对齐，仅依赖 `node:*` 与相对路径模块。
 *
 * License: GPL-3.0-only (保留原作者 RMvdesi 署名与 NOTICE 声明)
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pluginDefault, {
  name,
  packageName,
  version,
  API_PREFIX,
  apply,
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
} from '../lib/index.js';

const __filename = fileURLToPath(import.meta.url);
const isDirectRun =
  typeof process !== 'undefined' &&
  Array.isArray(process.argv) &&
  process.argv[1] &&
  path.resolve(process.argv[1]) === __filename;

if (isDirectRun) {
  runCli();
}

export {
  name,
  packageName,
  version,
  API_PREFIX,
  apply,
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

export default pluginDefault;
