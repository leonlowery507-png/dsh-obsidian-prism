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
