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
