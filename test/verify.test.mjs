/**
 * Obsidian Prism for DeepSeek Harness (dsh-obsidian-prism) — 完整构建、原生桌面协议与行为验证测试
 * 运行方式：node --test test/verify.test.mjs
 */

import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const require = createRequire(import.meta.url);

// Install the isolated home before importing either Cordis entry, even in a plain node --test run.
const originalDshHome = process.env.DSH_HOME;
const testDshHome = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-prism-verify-'));
const testConfigPath = path.join(testDshHome, 'obsidian-prism-config.json');
process.env.DSH_HOME = testDshHome;
after(() => {
  try {
    fs.rmSync(testConfigPath, { force: true });
    fs.rmdirSync(testDshHome);
  } finally {
    if (originalDshHome === undefined) delete process.env.DSH_HOME;
    else process.env.DSH_HOME = originalDshHome;
  }
});

function loadCjsFromSrc(relPath) {
  const absPath = path.join(ROOT_DIR, relPath);
  const code = fs.readFileSync(absPath, 'utf8');
  const mod = { exports: {} };
  const sandbox = {
    module: mod,
    exports: mod.exports,
    require,
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

function readText(relPath) {
  return fs.readFileSync(path.join(ROOT_DIR, relPath), 'utf8');
}

function assertExistsNonEmpty(relPath) {
  const full = path.join(ROOT_DIR, relPath);
  assert.ok(fs.existsSync(full), `缺少必需文件: ${relPath}`);
  const stat = fs.statSync(full);
  assert.ok(stat.size > 0, `文件内容为空: ${relPath}`);
  return full;
}

function runNodeSyntaxCheck(relPath) {
  const full = path.join(ROOT_DIR, relPath);
  execFileSync(process.execPath, ['--check', full], { stdio: 'pipe' });
}

function assertBalancedCss(relPath) {
  const source = readText(relPath).replace(/\/\*[\s\S]*?\*\//g, '');
  let depth = 0;
  let quote = '';
  let escaped = false;
  for (const ch of source) {
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === quote) {
        quote = '';
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === '{') {
      depth += 1;
    } else if (ch === '}') {
      depth -= 1;
      assert.ok(depth >= 0, `CSS 提前闭合: ${relPath}`);
    }
  }
  assert.equal(quote, '', `CSS 字符串未闭合: ${relPath}`);
  assert.equal(depth, 0, `CSS 花括号不平衡: ${relPath}`);
}

/**
 * 构建供隔离 VM 沙盒共用的轻量浏览器 DOM 与 Web API 仿真环境
 */
function createMockBrowserEnv() {
  const store = new Map();
  const dispatchedEvents = [];
  const registeredHighlights = new Map();

  // Only the selector grammar used by these fixtures and the application is needed.
  // Split combinators outside attributes/pseudos (host slots and labels contain dots/spaces).
  const selectorCache = new Map();
  function parseSelector(selector) {
    if (selectorCache.has(selector)) return selectorCache.get(selector);
    const groups = [];
    let chain = [], token = '', relation = ' ', depth = 0, quote = '';
    function finish() {
      if (token) chain.push({ simple: token, relation });
      token = '';
      relation = ' ';
    }
    for (const ch of String(selector).trim()) {
      if (quote) {
        if (ch === quote) quote = '';
      } else if (ch === '"' || ch === "'") quote = ch;
      else if (ch === '[' || ch === '(') depth++;
      else if (ch === ']' || ch === ')') depth--;
      else if (!depth && /[\s,>]/.test(ch)) {
        if (token) finish();
        if (ch === '>') relation = '>';
        if (ch === ',') { groups.push(chain); chain = []; relation = ' '; }
        continue;
      }
      token += ch;
    }
    finish();
    groups.push(chain);
    selectorCache.set(selector, groups);
    return groups;
  }

  function matchesSimple(el, simple, scope) {
    if (el?.nodeType !== 1) return false;
    let rest = simple;
    while (rest) {
      let m;
      if ((m = /^(\*|[\w-]+)/.exec(rest))) {
        if (m[1] !== '*' && m[1].toUpperCase() !== el.tagName) return false;
      } else if ((m = /^([.#])([\w-]+)/.exec(rest))) {
        if (m[1] === '.' ? !el.classList.contains(m[2]) : el.id !== m[2]) return false;
      } else if ((m = /^\[([\w:-]+)(?:\s*([*^$~|]?=)\s*(?:"([^"]*)"|'([^']*)'|([^\s\]]+))(?:\s+(i))?)?\]/.exec(rest))) {
        let value = el.getAttribute(m[1]), wanted = m[3] ?? m[4] ?? m[5];
        if (value === null) return false;
        if (m[6]) { value = value.toLowerCase(); wanted = wanted.toLowerCase(); }
        if (m[2] && !({ '=': () => value === wanted, '*=': () => value.includes(wanted),
          '^=': () => value.startsWith(wanted), '$=': () => value.endsWith(wanted),
          '~=': () => value.split(/\s+/).includes(wanted), '|=': () => value === wanted || value.startsWith(wanted + '-') })[m[2]]()) return false;
      } else if ((m = /^:(not|is|where|has)\(([^()]*)\)/.exec(rest))) {
        const found = m[1] === 'has' ? Boolean(el.querySelector(m[2])) : matchesChain(el, m[2], scope);
        if (m[1] === 'not' ? found : !found) return false;
      } else if ((m = /^:(scope|disabled|enabled|first-child|last-child|checked|empty)\b/.exec(rest))) {
        const yes = { scope: el === scope, disabled: el.disabled, enabled: !el.disabled,
          checked: el.checked, empty: el.childNodes.length === 0,
          'first-child': el.parentElement?.firstElementChild === el,
          'last-child': el.parentElement?.lastElementChild === el };
        if (!yes[m[1]]) return false;
      } else return false;
      rest = rest.slice(m[0].length);
    }
    return true;
  }
  function matchesChain(el, selector, scope) {
    return parseSelector(selector).some((chain) => {
      function matchAt(node, i) {
        if (!chain[i] || !matchesSimple(node, chain[i].simple, scope)) return false;
        if (i === 0) return true;
        if (chain[i].relation === '>') return matchAt(node.parentElement, i - 1);
        for (let p = node.parentElement; p; p = p.parentElement) if (matchAt(p, i - 1)) return true;
        return false;
      }
      return matchAt(el, chain.length - 1);
    });
  }

  let now = 0, sequence = 0;
  const timers = new Map(), observers = new Set();
  function schedule(fn, delay, repeat = false) {
    const id = ++sequence;
    timers.set(id, { fn, at: now + delay, delay, repeat });
    return id;
  }
  function mutation(target, type, extra) {
    for (const observer of observers) {
      const matched = [...observer.targets].some(([root, options]) => options[type]
        && (target === root || (options.subtree && root.contains(target)))
        && (!extra.attributeName || !options.attributeFilter || options.attributeFilter.includes(extra.attributeName)));
      if (matched) observer.records.push({ target, type, addedNodes: [], removedNodes: [], ...extra });
    }
  }
  class MockMutationObserver {
    constructor(fn) { this.fn = fn; this.targets = new Map(); this.records = []; }
    observe(target, options) { this.targets.set(target, options); observers.add(this); }
    disconnect() { observers.delete(this); this.targets.clear(); this.records = []; }
    takeRecords() { return this.records.splice(0); }
  }
  function tick(ms = 40) {
    const until = now + ms;
    for (let n = 0; n < 5000; n++) {
      for (const obs of observers) if (obs.records.length) obs.fn(obs.takeRecords(), obs);
      const next = [...timers].filter(([, t]) => t.at <= until).sort((a, b) => a[1].at - b[1].at)[0];
      if (!next) { now = until; return; }
      const [id, timer] = next;
      now = timer.at;
      if (timer.repeat) timer.at += timer.delay;
      else timers.delete(id);
      timer.fn();
    }
    assert.fail('VM browser did not settle within the timer budget');
  }

  const listeners = new WeakMap();
  function eventTarget(target, parent) {
    const events = new Map();
    listeners.set(target, { events, parent });
    target.addEventListener = (type, fn, opts) => {
      if (!events.has(type)) events.set(type, []);
      const capture = opts === true || Boolean(opts?.capture), list = events.get(type);
      if (!list.some(x => x.fn === fn && x.capture === capture)) list.push({ fn, capture, once: opts?.once });
    };
    target.removeEventListener = (type, fn, opts) => {
      const capture = opts === true || Boolean(opts?.capture);
      events.set(type, (events.get(type) || []).filter(x => x.fn !== fn || x.capture !== capture));
    };
    target.dispatchEvent = ev => {
      ev.target = target;
      const path = [];
      for (let n = target; n; n = listeners.get(n)?.parent()) path.push(n);
      ev.composedPath = () => [...path];
      function fire(node, capture) {
        ev.currentTarget = node;
        for (const sub of [...(listeners.get(node)?.events.get(ev.type) || [])]) {
          if (capture !== sub.capture) continue;
          if (sub.once) node.removeEventListener(ev.type, sub.fn, capture);
          sub.fn.call(node, ev);
          if (ev.immediateStopped) break;
        }
      }
      dispatchedEvents.push(ev.type);
      for (const node of path.slice(1).reverse()) { fire(node, true); if (ev.cancelBubble) return !ev.defaultPrevented; }
      fire(target, true);
      if (!ev.immediateStopped) fire(target, false);
      if (ev.bubbles) for (const node of path.slice(1)) { if (ev.cancelBubble) break; fire(node, false); }
      return !ev.defaultPrevented;
    };
    return target;
  }

  function parseHtmlInto(parent, htmlStr, docRef) {
    parent.replaceChildren();
    const tokenRe = /<(\/?)([a-zA-Z0-9-]+)([^>]*)>|([^<]+)/g;
    const stack = [parent];
    const voidTags = new Set(['BR', 'HR', 'IMG', 'INPUT', 'META', 'LINK', 'CIRCLE', 'PATH', 'RECT', 'LINE']);
    let m;
    while ((m = tokenRe.exec(String(htmlStr || ''))) !== null) {
      const cur = stack[stack.length - 1];
      if (m[4]) {
        cur.appendChild(docRef.createTextNode(m[4]));
        continue;
      }
      const closing = m[1] === '/';
      const tag = m[2].toUpperCase();
      const attrStr = m[3] || '';
      if (closing) {
        if (stack.length > 1 && stack.at(-1).tagName === tag) stack.pop();
        continue;
      }
      const child = docRef.createElement(tag);
      for (const am of attrStr.matchAll(/([a-zA-Z0-9_:-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
        const k = am[1];
        if (!k || k === '/') continue;
        const v = am[2] ?? am[3] ?? am[4] ?? '';
        child.setAttribute(k, v);
      }
      cur.appendChild(child);
      const selfClose = /\/\s*$/.test(attrStr) || voidTags.has(tag);
      if (!selfClose) stack.push(child);
    }
  }

  const gradient = () => ({ addColorStop() {} });
  class Element {}
  function makeEl(tag, docRef) {
    const attrs = new Map(), captured = new Set();
    let markup = '', context2d;
    const el = {
      nodeType: 1, tagName: String(tag).toUpperCase(), ownerDocument: docRef,
      style: { setProperty(k, v) { this[k] = String(v); }, getPropertyValue(k) { return this[k] || ''; },
        removeProperty(k) { delete this[k]; } },
      childNodes: [], parentElement: null, parentNode: null,
      offsetWidth: 320, offsetHeight: 80, clientWidth: 320, clientHeight: 80, scrollHeight: 80, scrollTop: 0, scrollLeft: 0,
      get children() { return el.childNodes.filter(c => c.nodeType === 1); },
      get attributes() { return [...attrs].map(([name, value]) => ({ name, value })); },
      get isConnected() { return el === docRef.documentElement || Boolean(el.parentElement?.isConnected); },
      get firstChild() { return el.childNodes[0] || null; },
      get firstElementChild() { return el.children[0] || null; },
      get lastElementChild() { return el.children.at(-1) || null; },
      get nextElementSibling() { const list = el.parentElement?.children || []; return list[list.indexOf(el) + 1] || null; },
      get previousElementSibling() { const list = el.parentElement?.children || []; return list[list.indexOf(el) - 1] || null; },
      get textContent() { return el.childNodes.map(c => c.nodeType === 3 ? c.data : c.textContent).join(''); },
      set textContent(v) { el.replaceChildren(); if (v != null && v !== '') el.appendChild(docRef.createTextNode(v)); },
      get innerText() { return el.textContent; }, set innerText(v) { el.textContent = v; },
      get innerHTML() { return markup; }, set innerHTML(v) { markup = String(v ?? ''); parseHtmlInto(el, markup, docRef); },
      getAttribute(k) { return attrs.get(k) ?? null; },
      hasAttribute(k) { return attrs.has(k); },
      getAttributeNames() { return [...attrs.keys()]; },
      setAttribute(k, v) {
        const value = String(v);
        if (attrs.get(k) === value) return;
        attrs.set(k, value);
        mutation(el, 'attributes', { attributeName: k });
      },
      removeAttribute(k) { if (attrs.delete(k)) mutation(el, 'attributes', { attributeName: k }); },
      toggleAttribute(k, force = !el.hasAttribute(k)) { if (force) el.setAttribute(k, ''); else el.removeAttribute(k); return force; },
      insertBefore(c, ref) {
        if (ref && ref.parentNode !== el) throw new Error('insertBefore: reference is not a child');
        if (c === ref) return c;
        if (c === el || c.contains?.(el)) throw new Error('insertBefore: cycle');
        if (c.parentNode) c.parentNode.removeChild(c);
        el.childNodes.splice(ref ? el.childNodes.indexOf(ref) : el.childNodes.length, 0, c);
        c.parentNode = c.parentElement = el;
        mutation(el, 'childList', { addedNodes: [c] });
        return c;
      },
      appendChild(c) { return el.insertBefore(c, null); },
      removeChild(c) {
        const i = el.childNodes.indexOf(c);
        if (i < 0) throw new Error('removeChild: not a child');
        el.childNodes.splice(i, 1);
        c.parentNode = c.parentElement = null;
        mutation(el, 'childList', { removedNodes: [c] });
        return c;
      },
      remove() { el.parentNode?.removeChild(el); },
      replaceChildren(...nodes) { for (const c of [...el.childNodes]) el.removeChild(c); for (const c of nodes) el.appendChild(c); },
      contains(node) { for (let n = node; n; n = n.parentNode) if (n === el) return true; return false; },
      querySelector(sel) { return el.querySelectorAll(sel)[0] || null; },
      querySelectorAll(sel) {
        const out = [];
        function walk(n) {
          for (const child of n.children) { if (matchesChain(child, sel, el)) out.push(child); walk(child); }
        }
        walk(el);
        return out;
      },
      closest(sel) { for (let n = el; n; n = n.parentElement) if (matchesChain(n, sel, el)) return n; return null; },
      matches(sel) { return matchesChain(el, sel, el); },
      getBoundingClientRect() { const left = 10, top = 10, width = el.offsetWidth, height = el.offsetHeight;
        return el.rect || { left, top, width, height, right: left + width, bottom: top + height, x: left, y: top }; },
      getClientRects() { return el.isConnected && !el.hidden ? [el.getBoundingClientRect()] : []; },
      getContext(kind) {
        if (el.tagName !== 'CANVAS' || kind !== '2d') return null;
        if (!context2d) {
          // Let animation timers run normally. These tests assert events and DOM, not pixels.
          context2d = { canvas: el, createLinearGradient: gradient, createRadialGradient: gradient };
          for (const command of ['arc', 'arcTo', 'beginPath', 'clearRect', 'clip', 'closePath', 'drawImage',
            'ellipse', 'fill', 'fillRect', 'fillText', 'lineTo', 'moveTo', 'rect', 'restore', 'rotate',
            'roundRect', 'save', 'scale', 'setTransform', 'stroke', 'strokeRect', 'translate']) context2d[command] = () => {};
        }
        return context2d;
      },
      focus() { docRef.activeElement = el; },
      scrollIntoView() {},
      click() { if (!el.disabled) el.dispatchEvent(new MockCustomEvent('click', { bubbles: true, cancelable: true, button: 0 })); },
      setPointerCapture(id) { captured.add(id); }, hasPointerCapture(id) { return captured.has(id); },
      releasePointerCapture(id) { captured.delete(id); },
    };
    Object.setPrototypeOf(el, Element.prototype);
    for (const [prop, attr] of Object.entries({ className: 'class', id: 'id', title: 'title', role: 'role', type: 'type' })) {
      Object.defineProperty(el, prop, { get: () => attrs.get(attr) || '', set: v => el.setAttribute(attr, v) });
    }
    for (const prop of ['disabled', 'hidden', 'checked']) Object.defineProperty(el, prop, {
      get: () => el.hasAttribute(prop), set: v => el.toggleAttribute(prop, Boolean(v)),
    });
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) el.value = '';
    const dataKey = key => 'data-' + String(key).replace(/[A-Z]/g, ch => '-' + ch.toLowerCase());
    el.dataset = new Proxy({}, { get: (_, k) => attrs.get(dataKey(k)), set: (_, k, v) => (el.setAttribute(dataKey(k), v), true),
      deleteProperty: (_, k) => (el.removeAttribute(dataKey(k)), true) });
    const classes = () => el.className.split(/\s+/).filter(Boolean);
    el.classList = {
      contains: c => classes().includes(c),
      add(...cs) { el.className = [...new Set([...classes(), ...cs])].join(' '); },
      remove(...cs) { el.className = classes().filter(c => !cs.includes(c)).join(' '); },
      toggle(c, force = !this.contains(c)) { if (force) this.add(c); else this.remove(c); return force; },
    };
    return eventTarget(el, () => el.parentElement || (el === docRef.documentElement ? docRef : null));
  }

  function createDoc(readyState = 'complete') {
    const doc = {
      nodeType: 9, readyState, hidden: false,
      createElement: t => makeEl(t, doc),
      createTextNode: value => ({ nodeType: 3, data: String(value), nodeValue: String(value), ownerDocument: doc,
        get isConnected() { return Boolean(this.parentNode?.isConnected); } }),
      createRange: () => ({ setStart() {}, setEnd() {} }),
      getElementById: id => doc.querySelectorAll('[id]').find(n => n.id === id) || null,
      querySelectorAll(sel) { const root = doc.documentElement; return [...(root.matches(sel) ? [root] : []), ...root.querySelectorAll(sel)]; },
      querySelector(sel) { return doc.querySelectorAll(sel)[0] || null; },
      contains: n => doc.documentElement.contains(n),
    };
    doc.documentElement = makeEl('html', doc);
    doc.head = makeEl('head', doc);
    doc.body = makeEl('body', doc);
    doc.documentElement.appendChild(doc.head);
    doc.documentElement.appendChild(doc.body);
    return eventTarget(doc, () => doc.defaultView);
  }

  const doc = createDoc();

  class MockHighlight {
    constructor() {
      this._set = new Set();
    }
    add(r) {
      this._set.add(r);
    }
    delete(r) {
      this._set.delete(r);
    }
    get size() {
      return this._set.size;
    }
  }

  class MockCustomEvent {
    constructor(type, init = {}) {
      this.type = type;
      Object.assign(this, init);
    }
    preventDefault() { if (this.cancelable) this.defaultPrevented = true; }
    stopPropagation() { this.cancelBubble = true; }
    stopImmediatePropagation() { this.cancelBubble = this.immediateStopped = true; }
  }

  const epoch = Date.now();
  class ClockDate extends Date { static now() { return epoch + now; } }
  const sandbox = {
    console,
    setTimeout: (fn, ms) => schedule(fn, Math.max(1, Number(ms) || 1)), clearTimeout: id => timers.delete(id),
    setInterval: (fn, ms) => schedule(fn, Math.max(1, Number(ms) || 1), true), clearInterval: id => timers.delete(id),
    requestAnimationFrame: fn => schedule(() => fn(now), 16), cancelAnimationFrame: id => timers.delete(id),
    MutationObserver: MockMutationObserver, Element, HTMLElement: Element,
    innerWidth: 1440, innerHeight: 980, devicePixelRatio: 1,
    getComputedStyle: el => ({ display: el.hidden ? 'none' : 'block', visibility: 'visible', opacity: '1', ...el.style }),
    performance: { now: () => now },
    Date: ClockDate,
    Intl,
    navigator: { language: 'zh-CN', languages: ['zh-CN'] },
    Math,
    JSON,
    Map,
    Set,
    WeakMap,
    WeakSet,
    Float32Array,
    Promise,
    Error,
    RegExp,
    Object,
    Array,
    Number,
    String,
    Boolean,
    CustomEvent: MockCustomEvent,
    Event: MockCustomEvent,
    Highlight: MockHighlight,
    CSS: {
      supports: () => true,
      highlights: {
        set: (k, v) => registeredHighlights.set(k, v),
        get: (k) => registeredHighlights.get(k),
      },
    },
    localStorage: {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
    },
    matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
    document: doc,
  };
  eventTarget(sandbox, () => null);
  doc.defaultView = sandbox;
  sandbox.globalThis = sandbox;
  sandbox.window = sandbox;
  sandbox.self = sandbox;

  return { sandbox, doc, store, dispatchedEvents, registeredHighlights, tick };
}

function add(parent, tag, attributes = {}, text) {
  const el = parent.ownerDocument.createElement(tag);
  for (const [name, value] of Object.entries(attributes)) el.setAttribute(name, value);
  if (text !== undefined) el.textContent = text;
  return parent.appendChild(el);
}

function activeCompanions(root) {
  return Array.from(root.querySelectorAll('[data-prism-companion]'), el => el.getAttribute('data-prism-companion'));
}

function bootBundle(t, env) {
  vm.runInNewContext(readText('dist/dsh-prism.bundle.js'), env.sandbox, { filename: 'dsh-prism.bundle.js' });
  assert.equal(env.sandbox.__dshObsidianPrism?.booted, true);
  t.after(() => env.sandbox.__dshObsidianPrism?.destroy());
  return env.sandbox.__agPrismBridge;
}

// v44.7.0 AppFrame, SidebarRoot, InputBar and DraftEditor. No preview classes/ids.
function createHostShell(doc) {
  const root = add(doc.body, 'div', { id: 'root' });
  const frame = add(root, 'div', { class: 'mP3x-q_frame' });
  const sideCol = add(frame, 'div', { class: 'mP3x-q_sidebarCol' });
  const sideSlot = add(sideCol, 'div', { 'data-slot': 'sidebar', 'data-slot-kind': 'single' });
  const sidebar = add(sideSlot, 'div');
  const drag = add(sidebar, 'div', { 'data-window-drag': '' });
  const toggle = add(drag, 'button', { 'data-sidebar-toggle': '', type: 'button' });
  const scrollport = add(add(sidebar, 'div'), 'div', { 'data-sidebar-scrollport': '' });
  const nav = add(scrollport, 'nav', { 'aria-label': 'Panels' });
  const listArea = add(scrollport, 'div', { 'data-sidebar-list-area': '', role: 'tree' });
  const row = add(listArea, 'div', { role: 'treeitem', 'data-row-key': 'session:one', 'aria-selected': 'true' }, 'Host conversation');
  const center = add(frame, 'div');
  const main = add(center, 'div', { 'data-slot': 'main.conversation', 'data-slot-kind': 'single' });
  add(frame, 'div', { 'data-shell-bottom': '' });
  add(frame, 'div', { 'data-shell-overlay': '' });
  const makeComposer = (parent = main) => {
    const seat = add(parent, 'div', { 'data-composer-seat': '', 'data-conversation-region': 'composer' });
    const bar = add(seat, 'div');
    const card = add(bar, 'div', { 'data-composer-card': '' });
    const overlay = add(card, 'div', { 'data-composer-overlay': '' });
    const scroll = add(card, 'div', { 'data-input-scroll': '' });
    const grow = add(scroll, 'div');
    const editor = add(grow, 'div', { contenteditable: 'true', role: 'textbox', 'data-composer-input': '', 'data-lexical-editor': 'true', 'aria-multiline': 'true' });
    add(grow, 'div', { 'data-composer-placeholder': '', 'aria-hidden': 'true' });
    // InputBar.tsx and scoped-slots.tsx: the permission/plan outlets share the leading
    // modes group, while the native model trigger belongs to a separate trailing group.
    const row = add(card, 'div', { class: 'GRgSLq_row' });
    const tools = add(row, 'div', { class: 'GRgSLq_tools' });
    add(tools, 'button', { type: 'button', 'aria-haspopup': 'listbox', 'aria-label': 'Commands' });
    add(tools, 'input', { type: 'file', hidden: '' });
    const modes = add(tools, 'div', { class: 'GRgSLq_modes' });
    function slot(parent, name) {
      const outlet = add(parent, 'div', { 'data-slot': 'conversation.input.' + name });
      outlet.style.display = 'contents';
      return outlet;
    }
    const permission = slot(modes, 'permission');
    const permissionButton = add(permission, 'button', { type: 'button', 'aria-haspopup': 'menu', 'aria-expanded': 'false' }, '默认权限');
    const plan = slot(modes, 'plan');
    add(plan, 'button', { type: 'button' }, 'Plan');
    slot(tools, 'left');
    const trailing = add(row, 'div', { class: 'GRgSLq_trailing' });
    const controls = add(trailing, 'div', { class: 'GRgSLq_standardControls' });
    slot(controls, 'right');
    const modelSlot = slot(controls, 'model');
    add(bar, 'div', { 'data-composer-dock': '' }); // Sibling of the card in v44.7 InputBar.
    return { seat, card, overlay, scroll, editor, modelSlot, modes, permission, permissionButton, plan };
  };
  const parts = makeComposer();
  for (const el of [root, ...root.querySelectorAll('*')]) el.__reactFiber$fixture = { stateNode: el };
  root.__reactContainer$fixture = {};
  return { root, frame, sideCol, sideSlot, sidebar, toggle, scrollport, listArea, nav, row, main, makeComposer, ...parts };
}

function addModelTrigger(parent, label = 'Atlas Custom', id = 'atlas-private', effort = 'High') {
  const trigger = add(add(parent, 'div'), 'button', { type: 'button', 'aria-haspopup': 'menu', 'aria-expanded': 'false',
    'aria-busy': 'false', title: `${label} · ${effort}`, 'aria-label': `${label}, ${effort}` });
  trigger.style.setProperty('--dsh-model-anchor', '--dsh-model-_r_42_');
  const model = add(add(trigger, 'span'), 'span', { 'data-provider-id': 'private-provider', 'data-model-id': id }, label);
  add(trigger, 'span', {}, effort);
  return { trigger, model };
}

// v44.7 ModelSelect.tsx keeps its body portal across drills. Only native radio clicks commit.
function nativeModelSelect(host, options = {}) {
  let currentLabel = options.currentEffort ?? 'High';
  const { trigger, model } = addModelTrigger(host.modelSlot, 'Atlas Custom', 'atlas-private', currentLabel);
  const doc = trigger.ownerDocument, id = '_r_42_-menu';
  const clicks = [], trace = [];
  let menu, rows = [], nativeChildren = [], unmountOptions, currentPane = 'root';
  function clearPane() {
    unmountOptions?.(); unmountOptions = undefined;
    for (const child of nativeChildren) child.remove();
    nativeChildren = []; rows = [];
  }
  function close() {
    clearPane(); menu?.remove(); menu = null;
    trigger.setAttribute('aria-expanded', 'false'); trigger.removeAttribute('aria-controls');
  }
  function render(pane, labels = [], checked = 0, disabled = []) {
    clearPane();
    currentPane = pane;
    menu.setAttribute('role', pane === 'model' ? 'group' : 'menu');
    if (pane === 'root') {
      const rootRows = [['model', options.modelTitle ?? 'Model'], ['effort', options.effortTitle ?? 'Reasoning effort']];
      for (const [key, title] of rootRows) {
        const button = add(menu, 'button', { type: 'button', role: 'menuitem' });
        nativeChildren.push(button);
        add(button, 'span', {}, title);
        const value = add(button, 'span');
        if (key === 'model') add(value, 'span', { 'data-provider-id': model.dataset.providerId, 'data-model-id': model.dataset.modelId }, model.textContent);
        else value.textContent = currentLabel;
        add(button, 'svg', { 'aria-hidden': 'true' });
        button.addEventListener('click', () => {
          trace.push(`drill:${key}`);
          const drill = () => {
            if (!button.isConnected) return;
            if (key === 'model') render('model', ['Low', 'High']);
            else {
              const target = options.effortPane?.() ?? { labels: ['Off', 'Low', 'High'], checked: 2 };
              render('effort', target.labels, target.checked, target.disabled);
            }
          };
          if (options.queueDrill) options.queueDrill(drill); else drill();
        });
      }
      // scoped-slots.tsx wraps every SlotOutlet in a stable data-slot anchor (even when empty).
      const outlet = add(menu, 'div', { 'data-slot': 'conversation.input.model.options' });
      outlet.style.display = 'contents';
      nativeChildren.push(outlet);
      unmountOptions = options.mountOptions?.(outlet);
    } else {
      const list = add(menu, 'div', pane === 'model' ? { class: 'scrollable', role: 'menu', id: '_r_42_-models' } : { class: 'scrollable' });
      nativeChildren.push(list);
      rows = labels.map((label, i) => {
        const button = add(list, 'button', { type: 'button', role: 'menuitemradio', 'aria-checked': String(i === checked) });
        button.disabled = disabled.includes(i);
        const name = add(add(button, 'span'), 'span');
        if (pane === 'model') add(name, 'span', { 'data-model-id': `id-${label}`, 'data-provider-id': 'p' }, label);
        else name.textContent = label;
        add(button, 'span');
        button.addEventListener('click', () => {
          trace.push(`radio:${pane}:${label}`); clicks.push({ pane, label }); close();
          if (pane === 'effort') {
            currentLabel = label;
            model.parentElement.nextElementSibling.textContent = label;
            trigger.title = `${model.textContent} · ${label}`;
            options.onEffortClick?.(label);
          }
        });
        return button;
      });
    }
  }
  function open(pane, labels, checked, disabled) {
    close();
    trigger.setAttribute('aria-expanded', 'true'); trigger.setAttribute('aria-controls', id);
    menu = add(doc.body, 'div', { id, 'aria-label': 'Model and reasoning effort', 'aria-busy': 'false' });
    menu.addEventListener('keydown', event => {
      if (event.key === 'Escape' && currentPane !== 'root') {
        event.preventDefault();
        render('root');
      }
    });
    menu.style.setProperty('--dsh-model-anchor', trigger.style.getPropertyValue('--dsh-model-anchor'));
    menu.__reactFiber$fixture = {};
    render(pane, labels, checked, disabled);
    return menu;
  }
  trigger.addEventListener('click', () => menu ? close() : open('root'));
  return { trigger, trace, clicks, open, close, get menu() { return menu; }, get rows() { return rows; } };
}

function sendEvent(env, target, type, init = {}) {
  target.dispatchEvent(new env.sandbox.Event(type, { bubbles: true, cancelable: true, ...init }));
}

function loadBrowserModule(env, relPath) {
  vm.runInNewContext(readText(relPath), env.sandbox, { filename: relPath });
}

function createModuleBridge(initial = {}) {
  let config = { ...initial };
  const listeners = new Set();
  const emit = () => {
    for (const listener of [...listeners]) {
      try {
        listener({ detail: { config: { ...config } }, config: { ...config } });
      } catch {}
    }
  };
  return {
    get config() {
      return { ...config };
    },
    getConfig() {
      return { ...config };
    },
    setConfig(patch = {}) {
      config = { ...config, ...patch };
      emit();
      return { ...config };
    },
    onConfigChange(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

test('1. 构建产物、DSH 原生入口与许可署名文件均存在且非空', () => {
  const required = [
    'package.json',
    'cordis.patch.yml',
    'LICENSE',
    'NOTICE',
    'README.md',
    'scripts/build-bundle.mjs',
    'lib/index.js',
    'lib/client.js',
    'src/index.mjs',
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
    'src/prism-style.css',
    'src/deepseek-companions.css',
    'src/home-studio.css',
    'src/prism-native-icons.css',
    'src/responsive-workbench.css',
    'dist/dsh-prism.bundle.js',
    'dist/dsh-prism.css',
    'dist/dsh-prism.userscript.js',
    'preview/dsh-stage.html',
  ];

  for (const rel of required) {
    assertExistsNonEmpty(rel);
  }

  const notice = readText('NOTICE');
  assert.ok(notice.includes('RMvdesi'), 'NOTICE 必须保留上游作者 RMvdesi 署名');
  assert.ok(notice.includes('Obsidian Prism'), 'NOTICE 必须保留 Obsidian Prism 项目署名');

  const bundle = readText('dist/dsh-prism.bundle.js');
  const css = readText('dist/dsh-prism.css');
  const userscript = readText('dist/dsh-prism.userscript.js');
  const clientJs = readText('lib/client.js');

  for (const [name, txt] of [
    ['dist/dsh-prism.bundle.js', bundle],
    ['dist/dsh-prism.css', css],
    ['dist/dsh-prism.userscript.js', userscript],
    ['lib/client.js', clientJs],
  ]) {
    assert.ok(txt.includes('GPL-3.0'), `${name} 应保留 GPL-3.0 许可声明`);
    assert.ok(txt.includes('RMvdesi'), `${name} 应保留 RMvdesi 上游署名`);
  }

  assert.ok(userscript.includes('==UserScript=='), 'dist/dsh-prism.userscript.js 必须包含 UserScript 元数据头');
  assert.ok(userscript.includes('http://127.0.0.1:3080/*'), 'Userscript 应匹配 dsh web 默认地址 127.0.0.1:3080');
});

test('从空目录只用发布源重建，独立包、样式、userscript 和桌面入口逐字节匹配', async t => {
  const { buildBundle, MODULE_ORDER, STYLE_SOURCE_REL, STYLE_SOURCE_ORDER } = await import('../scripts/build-bundle.mjs');
  assert.equal(STYLE_SOURCE_REL, 'src/prism-style.css');
  assert.deepEqual(STYLE_SOURCE_ORDER, [
    STYLE_SOURCE_REL,
    'src/deepseek-companions.css',
    'src/home-studio.css',
    'src/prism-native-icons.css',
    'src/responsive-workbench.css',
  ]);
  assert.ok(MODULE_ORDER.includes('src/deepseek-companions.js'));
  for (const rel of [
    'src/home-studio-panel.js',
    'src/home-ripple-host.js',
    'src/prism-native-icons.js',
    'src/responsive-workbench.js',
  ]) {
    assert.ok(MODULE_ORDER.includes(rel), rel);
  }
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-prism-rebuild-'));
  t.after(() => fs.rmSync(scratch, { recursive: true, force: true }));
  for (const rel of ['package.json', ...MODULE_ORDER, ...STYLE_SOURCE_ORDER]) {
    const dest = path.join(scratch, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(path.join(ROOT_DIR, rel), dest);
  }
  const outputs = ['dist/dsh-prism.bundle.js', 'dist/dsh-prism.css', 'dist/dsh-prism.userscript.js', 'lib/client.js'];
  const rebuilt = buildBundle({ rootDir: scratch, quiet: true });
  assert.deepEqual(rebuilt.files.map(f => f.name).sort(), [...outputs].sort());
  for (const rel of outputs) {
    const actual = fs.readFileSync(path.join(ROOT_DIR, rel));
    const fresh = fs.readFileSync(path.join(scratch, rel));
    assert.ok(fresh.equals(actual), `${rel} differs from a clean rebuild`);
  }
  assert.match(readText('dist/dsh-prism.css'), /\[data-prism-companion/);
});

test('2. 所有 JS/MJS 源码、CSS 结构与客户端入口均通过语法校验', () => {
  const jsFiles = [
    'scripts/build-bundle.mjs',
    'lib/index.js',
    'lib/client.js',
    'src/index.mjs',
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
    'dist/dsh-prism.bundle.js',
    'dist/dsh-prism.userscript.js',
    'test/verify.test.mjs',
  ];

  for (const rel of jsFiles) {
    assert.doesNotThrow(() => runNodeSyntaxCheck(rel), `语法检查失败: ${rel}`);
  }
  for (const rel of [
    'src/prism-style.css',
    'src/deepseek-companions.css',
    'src/home-studio.css',
    'src/prism-native-icons.css',
    'src/responsive-workbench.css',
    'dist/dsh-prism.css',
  ]) {
    assert.doesNotThrow(() => assertBalancedCss(rel), `CSS 结构检查失败: ${rel}`);
  }
});

test('3. DSH 插件清单、cordis.patch.yml 裸包名格式与 lib/index.js 零外部依赖隔离核验', async () => {
  const pkg = JSON.parse(readText('package.json'));
  assert.equal(pkg.main, 'lib/index.js', 'package.json main 必须指向 lib/index.js');
  assert.ok(pkg.exports && pkg.exports['.'] && pkg.exports['./client'], 'package.json exports 必须包含 . 与 ./client');
  assert.ok(pkg.exports['./cordis.patch.yml'] && pkg.exports['./package.json'], 'package.json exports 必须暴露 cordis.patch.yml 与 package.json');
  assert.equal(pkg.dsh?.bundle?.patch, './cordis.patch.yml', 'dsh.bundle.patch 必须指向 ./cordis.patch.yml');
  assert.equal(pkg.dsh?.client?.platform, 'web', 'dsh.client.platform 必须为 web');

  const patchYml = readText('cordis.patch.yml');
  assert.ok(/-\s*insert:\s*/.test(patchYml), 'cordis.patch.yml 必须包含 - insert:');
  assert.ok(/id:\s*obsidian-prism\b/.test(patchYml), 'cordis.patch.yml 必须声明 id: obsidian-prism');
  assert.ok(/name:\s*dsh-obsidian-prism\s*$/m.test(patchYml), 'cordis.patch.yml name 必须为裸包名 dsh-obsidian-prism（不可含子路径）');

  const libIndexSrc = readText('lib/index.js');
  const importSpecifiers = [
    ...libIndexSrc.matchAll(/\bimport\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g),
    ...libIndexSrc.matchAll(/\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)/g),
  ].map((m) => m[1]);
  for (const spec of importSpecifiers) {
    assert.ok(
      spec.startsWith('node:') || spec.startsWith('./') || spec.startsWith('../'),
      `lib/index.js 禁止引入外部裸包名 (${spec})，仅允许 node:* 内置模块与相对路径`
    );
  }

  const libMod = await import('../lib/index.js');
  const plugin = libMod.default && libMod.default.apply ? libMod.default : libMod;
  assert.equal(plugin.name, 'obsidian-prism', 'lib/index.js 导出插件 name 必须为 obsidian-prism');
  assert.equal(typeof plugin.apply, 'function', 'lib/index.js 必须导出 apply(root, config)');
  assert.ok(!Array.isArray(plugin.inject) || plugin.inject.length === 0, 'lib/index.js 顶层严禁声明阻塞式 inject');
});

test('4. 四大光学主题与五档工业强调色真实映射至 --dsw-alias-*、--dsw-font-* 与 --ag-prism-* 令牌', () => {
  const tokensMod = loadCjsFromSrc('src/tokens-palettes.js');
  assert.ok(tokensMod && tokensMod.PRISM_THEMES, 'src/tokens-palettes.js 必须导出 PRISM_THEMES');
  assert.ok(tokensMod.PRISM_ACCENTS, 'src/tokens-palettes.js 必须导出 PRISM_ACCENTS');

  for (const id of ['obsidian', 'warm', 'crystal', 'alabaster']) {
    assert.ok(tokensMod.PRISM_THEMES[id], `缺少主题预设: ${id}`);
  }
  for (const acc of ['follow', 'cobalt', 'iris', 'amber', 'mono']) {
    assert.ok(tokensMod.PRISM_ACCENTS[acc], `缺少强调色预设: ${acc}`);
  }

  const obsVars = tokensMod.buildCssVariables({ theme: 'obsidian', accentTone: 'follow' });
  const warmVars = tokensMod.buildCssVariables({ theme: 'warm', accentTone: 'follow' });
  const cryVars = tokensMod.buildCssVariables({ theme: 'crystal', accentTone: 'follow' });
  const alaVars = tokensMod.buildCssVariables({ theme: 'alabaster', accentTone: 'follow' });

  const requiredAliasTokens = [
    '--dsw-alias-bg-base',
    '--dsw-alias-bg-layer-1',
    '--dsw-alias-bg-layer-2',
    '--dsw-alias-bg-layer-3',
    '--dsw-alias-bg-mask-1',
    '--dsw-alias-border-l1',
    '--dsw-alias-border-l2',
    '--dsw-alias-border-l4',
    '--dsw-alias-border-l2-darkmode-thin',
    '--dsw-alias-brand-primary',
    '--dsw-alias-accent',
    '--dsw-alias-accent-ink',
    '--dsw-alias-accent-soft',
    '--dsw-alias-button-primary-fill',
    '--dsw-alias-button-ghost-active-fill',
    '--dsw-alias-interactive-bg-hover',
    '--dsw-alias-label-primary',
    '--dsw-alias-label-secondary',
    '--dsw-alias-label-tertiary',
    '--dsw-alias-label-dimmed',
    '--dsw-alias-hairline',
    '--dsw-alias-scrollbar-bg-l2',
    '--dsw-alias-scrollbar-hover-l2',
    '--dsw-alias-state-error-primary',
    '--dsw-alias-state-success-primary',
    '--dsw-alias-state-warn-primary',
    '--dsw-font-family',
    '--dsw-font-mono',
    '--dsw-font-family-mono',
  ];

  for (const [name, vars] of [
    ['obsidian', obsVars],
    ['warm', warmVars],
    ['crystal', cryVars],
    ['alabaster', alaVars],
  ]) {
    for (const tok of requiredAliasTokens) {
      assert.ok(vars[tok], `${name} 主题必须映射真实 DSH 令牌 ${tok}`);
    }
    assert.ok(vars['--ag-prism-cobalt'], `${name} 主题必须包含 --ag-prism-* 变量`);
  }

  const obsStr = JSON.stringify(tokensMod.PRISM_THEMES.obsidian).toUpperCase();
  const warmStr = JSON.stringify(tokensMod.PRISM_THEMES.warm).toUpperCase();
  const cryStr = JSON.stringify(tokensMod.PRISM_THEMES.crystal).toUpperCase();
  const alaStr = JSON.stringify(tokensMod.PRISM_THEMES.alabaster).toUpperCase();

  assert.ok(obsStr.includes('#09090B') && obsStr.includes('#0E0E11'), 'obsidian 主题应还原 #09090B / #0E0E11');
  assert.ok(warmStr.includes('#10100F') && warmStr.includes('#141413'), 'warm 主题应还原 #10100F / #141413');
  assert.ok(cryStr.includes('#E8EEF6') && cryStr.includes('#F4F7FB'), 'crystal 主题应还原 #E8EEF6 / #F4F7FB');
  assert.ok(alaStr.includes('#EBE6DC') && alaStr.includes('#F6F4EE'), 'alabaster 主题应还原 #EBE6DC / #F6F4EE');

  const css = readText('dist/dsh-prism.css');
  for (const theme of ['obsidian', 'warm', 'crystal', 'alabaster']) {
    assert.ok(css.includes(theme), `dist/dsh-prism.css 缺少主题规则: ${theme}`);
  }
  assert.ok(css.includes('--dsw-alias-bg-base') && css.includes('--dsw-alias-label-primary'), 'dist/dsh-prism.css 必须覆写 --dsw-alias-* 令牌');
  assert.ok(css.includes('ag-stream-f0') && css.includes('ag-stream-f4'), 'dist/dsh-prism.css 必须包含 ::highlight(ag-stream-f0..f4) 样式');
  assert.ok(css.includes('console-well'), 'dist/dsh-prism.css 必须包含 console-well 样式');
});

test('5. Cordis 插件入口 (src/index.mjs) 与纯浏览器桥接器 (src/dsh-bridge.js) 行为验证', async () => {
  const pluginMod = await import('../src/index.mjs');
  const plugin = pluginMod.default && pluginMod.default.apply ? pluginMod.default : pluginMod;
  assert.ok(plugin.name === 'dsh-obsidian-prism' || plugin.name === 'obsidian-prism', 'Cordis 插件 name 应匹配 dsh-obsidian-prism / obsidian-prism');
  assert.equal(typeof plugin.apply, 'function', 'Cordis 插件必须导出 apply(ctx, config)');

  const registeredThemes = [];
  const addedStyles = [];
  const addedScripts = [];
  const mockCtx = {
    theme: {
      register(def) {
        registeredThemes.push(def);
      },
    },
    web: {
      addStyle(p) {
        addedStyles.push(p);
      },
      addScript(p) {
        addedScripts.push(p);
      },
    },
    on() {},
    logger: { info() {}, warn() {}, error() {} },
  };
  await plugin.apply(mockCtx, {});
  assert.equal(registeredThemes.length, 4, 'Cordis 插件应注册 4 套 Prism 主题');
  assert.equal(addedStyles.length, 1, 'Cordis 插件应注入 Prism CSS');
  assert.equal(addedScripts.length, 1, 'Cordis 插件应注入 Prism JS Bundle');

  const injectedOnce = pluginMod.injectIntoHtmlString('<html><head></head><body></body></html>');
  const injectedTwice = pluginMod.injectIntoHtmlString(injectedOnce);
  assert.equal(injectedOnce, injectedTwice, 'HTML 注入器必须保持幂等性');

  const bridgeMod = loadCjsFromSrc('src/dsh-bridge.js');
  assert.equal(bridgeMod.STORAGE_KEY, 'dsh_obsidian_prism_config');
  assert.equal(bridgeMod.CONFIG_EVENT_NAME, 'ag-prism:config');
  const exported = bridgeMod.exportConfigJson();
  assert.ok(exported.includes('obsidian'), 'exportConfigJson 应包含当前主题配置');
  const tel = bridgeMod.estimateTelemetry();
  assert.equal(tel.maxTokens, null, '无宿主报告时容量未知');
  assert.equal(tel.model, null, '无模型选择器时型号未知');
  assert.equal(tel.usedTokens, 0);
  assert.equal(tel.quotas, null);
});

test('6. 光学、灵魂微件与工作台核心引擎行为验证 (0fps 休眠、24 节点浅水波、48 行折叠、嵌入式设置与脱敏)', () => {
  const opticsMod = loadCjsFromSrc('src/optics-motion.js');
  assert.equal(opticsMod.CONV_AURA_IDLE_SLEEP_MS, 1200, '空闲归零休眠阈值应为 1200ms');
  assert.deepEqual(Array.from(opticsMod.HIGHLIGHT_NAMES), [
    'ag-stream-f0',
    'ag-stream-f1',
    'ag-stream-f2',
    'ag-stream-f3',
    'ag-stream-f4',
  ]);
  const springRes = opticsMod.motion.springLinear('snappy');
  assert.ok(springRes.easing.startsWith('linear('), 'springLinear 应生成 linear() 弹簧曲线');
  const decisionOptics = opticsMod.computeConvAuraOptics('awaiting-decision', 0, 200, true, false);
  const errorOptics = opticsMod.computeConvAuraOptics('error-halted', 0, 200, true, false);
  const completeOptics = opticsMod.computeConvAuraOptics('long-task-complete', 0, 200, true, false);
  assert.equal(decisionOptics.semantic, 'awaiting-decision');
  assert.equal(errorOptics.semantic, 'error-halted');
  assert.equal(completeOptics.semantic, 'long-task-complete');
  assert.equal(opticsMod.crystal.evaluateDeterministicGlints(1.25, false).length, 4, '切割水晶应评估 4 路异步星芒');

  const widgetsMod = loadCjsFromSrc('src/widgets-vial-mascot.js');
  assert.equal(widgetsMod.vialCore.WAVE_NODES, 24, '上下文试管必须包含 24 节点浅水波模拟');
  const sim = widgetsMod.vialCore.createWaterVialPhysics({ fill: 0.46, streaming: false });
  sim.injectSlosh(2.0);
  for (let i = 0; i < 6; i++) sim.step(0.016);
  const peak = sim.getSnapshot();
  assert.ok(peak.waveEnergy > 1, '晃动试管应激发浅水波能量');
  for (let i = 0; i < 180; i++) sim.step(0.025);
  assert.ok(sim.getSnapshot().waveEnergy < peak.waveEnergy * 0.25, '阻尼物理应平稳收敛');

  const widgetGlints = widgetsMod.crystalCore.evalCrystalGlints(1.25, false);
  assert.equal(widgetGlints.length, 4, '微件切割水晶星芒数应为 4');
  // Legacy sprite data may remain exported. The active rig and its settings are exercised in the companion tests.

  const wbMod = loadCjsFromSrc('src/workbench-settings.js');
  assert.equal(wbMod.enhancerCore.MIN_CODE_FOLD_LINES, 48, '代码块手动折叠阈值必须为 48 行');
  assert.equal(wbMod.i18n.LANG_OPTIONS.length, 5, '设置中心必须支持 5 种语言');
  assert.ok(wbMod.presets.ultra && wbMod.presets.focus && wbMod.presets.eco, '必须包含 3 档场景预设');
  assert.equal(typeof wbMod.mountSettingsIntoElement, 'function', 'DSHPrismWorkbench 必须导出 mountSettingsIntoElement(el, bridge)');

  const safeExport = wbMod.settingsCore.buildSanitizedConfigExport(
    { theme: 'warm', accentTone: 'amber' },
    { stylePreset: 'technical', baseUrl: 'https://api.deepseek.com/v1', apiKey: 'sk-secret1234567890' }
  );
  assert.equal(safeExport.thought.apiKey, undefined, '导出配置必须剥离 apiKey');
  const validated = wbMod.settingsCore.validateImportedConfigJson(
    JSON.stringify({ settings: { theme: 'crystal', __proto__: { polluted: true } } })
  );
  assert.equal(validated.ok, true);
  assert.equal(validated.settings.theme, 'crystal');
  assert.equal(({}).polluted, undefined, '导入解析不可触发原型链污染');
});

test('7. 在隔离 VM 沙盒中实测执行 dist/dsh-prism.bundle.js 与 dist/dsh-prism.userscript.js', () => {
  const bundleCode = readText('dist/dsh-prism.bundle.js');
  const env = createMockBrowserEnv();
  const { sandbox, doc, store, dispatchedEvents } = env;
  createHostShell(doc);

  vm.runInNewContext(bundleCode, sandbox, { filename: 'dsh-prism.bundle.js' });

  assert.ok(sandbox.__dshObsidianPrism, 'bundle 必须挂载 __dshObsidianPrism');
  assert.equal(sandbox.__dshObsidianPrism.booted, true, 'bundle 应在浏览器环境下自动完成 bootstrap');
  const status = sandbox.__dshObsidianPrism.getStatus();
  assert.equal(status.hasBridge, true);
  assert.equal(status.hasOptics, true);
  assert.equal(status.hasWidgets, true);
  assert.equal(status.hasWorkbench, true);
  assert.ok(dispatchedEvents.includes('dsh-prism:ready'), 'bootstrap 后应触发 dsh-prism:ready 事件');

  assert.ok(doc.querySelector('[data-testid="dsh-vial-trigger"]'), '上下文试管触发器应自动挂载');
  assert.equal(doc.querySelector('[data-testid="dsh-effort-slider"]'), null, '未打开原生推理选项时不应挂载滑块');
  assert.deepEqual(activeCompanions(doc), ['whale'], '新安装应显示一只蓝鲸');

  sandbox.__agPrismBridge.setConfig({ theme: 'alabaster', accentTone: 'amber' });
  assert.equal(doc.documentElement.getAttribute('data-prism-theme'), 'alabaster');
  assert.equal(doc.documentElement.getAttribute('data-ag-cs-theme'), 'light');
  assert.ok(store.get('dsh_obsidian_prism_config')?.includes('alabaster'), '配置应持久化写入 dsh_obsidian_prism_config');

  sandbox.DSHPrismWidgets.openVialPopover();
  assert.equal(sandbox.DSHPrismWidgets.getState().vialOpen, true, '点击水试管应能打开遥测浮层');
  sandbox.DSHPrismWorkbench.openSettings();
  assert.equal(sandbox.DSHPrismWorkbench.getState().settingsOpen, true, '设置中心应能正常开启');

  assert.doesNotThrow(() => sandbox.__dshObsidianPrism.destroy());
  assert.deepEqual(activeCompanions(doc), []);

  const userscriptCode = readText('dist/dsh-prism.userscript.js');
  const { doc: uDoc, sandbox: uSandbox } = createMockBrowserEnv();
  createHostShell(uDoc);
  vm.runInNewContext(userscriptCode, uSandbox, { filename: 'dsh-prism.userscript.js' });
  const injectedStyle = uDoc.getElementById('dsh-obsidian-prism-style');
  assert.ok(injectedStyle && injectedStyle.textContent.includes('--ag-prism-'), 'Userscript 应向 head 注入完整 Prism CSS');
  assert.match(injectedStyle.textContent, /\[data-prism-companion/);
  assert.equal(uSandbox.__dshObsidianPrism?.booted, true, 'Userscript 应成功启动 __dshObsidianPrism');
  assert.deepEqual(activeCompanions(uDoc), ['whale'], '独立 userscript 也必须包含并启用鲸模块');
  uSandbox.__dshObsidianPrism.destroy();
  assert.deepEqual(activeCompanions(uDoc), []);
});

// Host ModuleSystem calls factory(require). Slot functions receive React props.children,
// refs are attached at commit, then effects run. No React/DOM packages are needed in CI.
function createClientHost(env) {
  let frame;
  const React = {
    Component: class { constructor(props) { this.props = props; this.state = {}; } },
    createElement(type, props, ...children) {
      return { type, props: { ...props, ...(children.length ? { children: children.length === 1 ? children[0] : children } : {}) } };
    },
    useRef: current => ({ current }),
    useEffect: setup => frame.effects.push(setup),
    useSyncExternalStore(subscribe, getSnapshot) {
      const snapshot = getSnapshot(), { render, effects } = frame;
      effects.push(() => subscribe(() => { if (!Object.is(snapshot, getSnapshot())) render(); }));
      return snapshot;
    },
  };
  function mount(component, props, parent) {
    const refs = [];
    function commit(node, container) {
      if (node == null || typeof node === 'boolean') return;
      if (Array.isArray(node)) { node.forEach(n => commit(n, container)); return; }
      if (typeof node !== 'object') { container.appendChild(env.doc.createTextNode(node)); return; }
      if (typeof node.type === 'function') {
        if (node.type.prototype?.render) {
          const boundary = new node.type(node.props);
          try { commit(boundary.render(), container); } catch (error) {
            if (!node.type.getDerivedStateFromError) throw error;
            boundary.state = node.type.getDerivedStateFromError(error);
            commit(boundary.render(), container);
          }
        } else commit(node.type(node.props), container);
        return;
      }
      const el = add(container, node.type);
      for (const [key, value] of Object.entries(node.props)) {
        if (key === 'ref') { value.current = el; refs.push(value); }
        else if (key === 'style') Object.assign(el.style, value);
        else if (!['key', 'children'].includes(key) && value != null && value !== false) el.setAttribute(key === 'className' ? 'class' : key, value);
      }
      commit(node.props.children, el);
    }
    let mounted = [], cleanups = [], disposed = false;
    function cleanup() {
      cleanups.splice(0).reverse().forEach(fn => fn());
      refs.splice(0).forEach(ref => { ref.current = null; });
      mounted.splice(0).forEach(el => el.remove());
    }
    function render() {
      if (disposed) return;
      cleanup();
      const existing = new Set(parent.childNodes), outerFrame = frame;
      frame = { effects: [], render };
      try {
        commit(React.createElement(component, props), parent);
        mounted = parent.childNodes.filter(el => !existing.has(el));
        cleanups = frame.effects.map(setup => setup()).filter(fn => typeof fn === 'function');
      } finally { frame = outerFrame; }
    }
    render();
    return () => { disposed = true; cleanup(); };
  }
  const modules = [], entries = [], effects = [], declared = new Set(), subscriptions = new Set();
  const registry = {
    register(meta, component) {
      assert.ok(declared.has(meta.name), `slot ${meta.name} has not been declared`);
      assert.equal(typeof component, 'function');
      assert.ok(!entries.some(e => e.meta.name === meta.name && e.meta.id === meta.id), `duplicate slot ${meta.name}/${meta.id}`);
      const entry = { meta, component };
      entries.push(entry);
      return () => { const i = entries.indexOf(entry); if (i !== -1) entries.splice(i, 1); };
    },
    inject(name, setup) {
      const sub = { name, setup, release: declared.has(name) ? setup() : null };
      subscriptions.add(sub);
      return () => { if (subscriptions.delete(sub)) sub.release?.(); };
    },
  };
  env.sandbox.__ModuleLoader__ = { load: m => modules.push(m) };
  vm.runInNewContext(readText('lib/client.js'), env.sandbox, { filename: 'lib/client.js' });
  assert.equal(modules.length, 1);
  assert.equal(modules[0].id, 'dsh-obsidian-prism');
  const plugin = modules[0].factory(id => { assert.equal(id, 'react', 'host module dependency'); return React; });
  assert.equal(plugin.name, 'obsidian-prism');
  assert.ok(Array.from(plugin.inject || []).includes('slots'), 'the v44.7 host grants the slots seat via plugin.inject');
  assert.ok(!Array.from(plugin.inject || []).includes('modelDirectories'), 'optional model directories cannot block settings or telemetry');
  const services = new Map([['slots', registry]]), bindings = new Set();
  const release = stack => stack.splice(0).reverse().forEach(fn => fn());
  function reconcile(binding) {
    const available = binding.deps.every(name => services.has(name));
    if (available && !binding.scope) {
      binding.scope = [];
      const dispose = binding.setup(context(binding.scope));
      if (typeof dispose === 'function') binding.scope.push(dispose);
    } else if (!available && binding.scope) {
      const old = binding.scope; binding.scope = null; release(old);
    }
  }
  function context(stack) {
    return {
      get slots() { return services.get('slots'); },
      get modelDirectories() { return services.get('modelDirectories'); },
      effect(setup) { const dispose = setup(); if (typeof dispose === 'function') stack.push(dispose); },
      inject(deps, setup) {
        assert.ok(deps.every(n => n === 'slots' || n === 'modelDirectories'), String(deps));
        const binding = { deps: Array.from(deps), setup, scope: null };
        bindings.add(binding);
        const dispose = () => { bindings.delete(binding); if (binding.scope) release(binding.scope); binding.scope = null; };
        stack.push(dispose);
        reconcile(binding);
        return dispose;
      },
    };
  }
  function service(name, value) {
    if (value === null) services.delete(name);
    else services.set(name, value);
    for (const binding of [...bindings]) if (bindings.has(binding)) reconcile(binding);
  }
  function declare(name) {
    if (declared.has(name)) return;
    declared.add(name);
    for (const sub of subscriptions) if (sub.name === name) sub.release = sub.setup();
  }
  function withdraw(name) {
    declared.delete(name);
    for (const sub of subscriptions) if (sub.name === name) { sub.release?.(); sub.release = null; }
  }
  return { entries, mount, declare, withdraw, service, provideSlots: () => service('slots', registry),
    apply({ allowInject = true } = {}) {
      const ctx = context(effects);
      if (!allowInject) delete ctx.inject;
      return plugin.apply(ctx);
    },
    dispose: () => effects.splice(0).reverse().forEach(fn => fn()),
    entry(name) { const matches = entries.filter(e => e.meta.name === name); assert.equal(matches.length, 1, name); return matches[0]; } };
}

const SETTINGS = 'settings.section', OVERLAY = 'conversation.input.overlay', MODEL_OPTIONS = 'conversation.input.model.options';

test('8. 宿主分别声明和释放两个槽位，按设置 id 渲染面板，切换主题，卸载后可再挂载', t => {
  const env = createMockBrowserEnv(), { doc, sandbox } = env;
  const host = createClientHost(env);
  t.after(() => host.dispose());
  const panel = add(doc.body, 'div', { role: 'dialog' });
  const fallback = add(panel, 'div', {}, 'Host settings navigation');
  host.apply();
  assert.equal(sandbox.__dshObsidianPrism?.booted, true);
  assert.ok(doc.getElementById('dsh-obsidian-prism-styles')?.textContent.includes('--dsw-alias-bg-base'));
  assert.deepEqual(host.entries, [], 'declarations arrive after apply');
  host.declare(OVERLAY);
  const overlay = host.entry(OVERLAY);
  host.declare(SETTINGS);
  const settings = host.entry(SETTINGS);
  // SettingsRoot enumerates e.options.id/order/label, then renderSlot(..., {close}, {only: active}).
  assert.equal(settings.meta.id, 'obsidian-prism');
  assert.ok(Number.isFinite(settings.meta.order));
  assert.equal(typeof settings.meta.label === 'function' ? settings.meta.label() : settings.meta.label, '黑曜棱镜');
  const select = active => {
    const entry = host.entries.find(e => e.meta.name === SETTINGS && e.meta.id === active);
    return entry && host.mount(entry.component, { close() {} }, panel);
  };
  assert.equal(select('general'), undefined);
  const section = '[data-dsh-prism-embedded-root="1"]';
  for (const theme of ['crystal', 'warm']) {
    const unmount = select('obsidian-prism');
    assert.equal(panel.querySelectorAll(section).length, 1);
    panel.querySelector('[role="tab"][data-tab="appearance"]').click();
    assert.equal(panel.querySelector('[data-tab="appearance"]').getAttribute('aria-selected'), 'true');
    const button = panel.querySelectorAll('button[data-sk="theme"]').find(b => JSON.parse(b.getAttribute('data-sv')) === theme);
    assert.ok(button, `embedded setting for ${theme}`);
    button.click();
    assert.equal(sandbox.__agPrismBridge.getConfig().theme, theme);
    assert.equal(doc.documentElement.getAttribute('data-prism-theme'), theme);
    const wrapper = panel.querySelector('[data-testid="dsh-prism-settings-section"]');
    assert.ok(wrapper?.contains(panel.querySelector(section)));
    unmount();
    assert.equal(wrapper.querySelector(section), null, 'effect cleanup removes its embedded instance even from its detached host');
    assert.deepEqual(panel.children, [fallback]);
  }
  host.withdraw(SETTINGS);
  assert.deepEqual(host.entries, [overlay]);
  host.declare(SETTINGS);
  const nextSettings = host.entry(SETTINGS);
  host.withdraw(OVERLAY);
  assert.deepEqual(host.entries, [nextSettings]);
  host.declare(OVERLAY);
  host.dispose();
  assert.deepEqual(host.entries, []);
  assert.equal(sandbox.__dshObsidianPrism.booted, false);
  assert.equal(doc.getElementById('dsh-obsidian-prism-styles'), null);
  for (const name of [OVERLAY, SETTINGS]) { host.withdraw(name); host.declare(name); }
  assert.deepEqual(host.entries, [], 'disposed deferred registrations stay detached');
  host.service('slots', null);
  host.apply();
  assert.deepEqual(host.entries, []);
  host.provideSlots();
  for (const name of [SETTINGS, OVERLAY]) host.entry(name);
  assert.equal(doc.querySelectorAll('#dsh-obsidian-prism-styles').length, 1);
  const unmount = select('obsidian-prism');
  assert.equal(panel.querySelectorAll(section).length, 1);
  unmount(); host.dispose();
  assert.deepEqual(host.entries, []);
});

test('9. 交互预览舞台保留宿主场景与长代码块，实际点击鲸选择与关闭按钮', t => {
  const html = readText('preview/dsh-stage.html');

  assert.ok(html.includes('../dist/dsh-prism.css'), 'stage 必须引入 ../dist/dsh-prism.css');
  assert.ok(html.includes('../dist/dsh-prism.bundle.js'), 'stage 必须引入 ../dist/dsh-prism.bundle.js');

  assert.ok(html.includes('dsh-sidebar'), 'stage 必须包含 DSH 侧边栏');
  assert.ok(html.includes('conversation-navigator'), 'stage 必须包含对话章节导航轨道');
  assert.ok(html.includes('<think') && html.includes('thinking-collapsible-trigger'), 'stage 必须包含 <think> 推理块演示');
  assert.ok(html.includes('btn-demo-stream'), 'stage 必须包含实时流式水墨吐字演示按钮');
  assert.ok(html.includes('ag-pulse-status-bar'), 'stage 必须包含 512K 呼吸水试管挂载点');
  assert.ok(html.includes('dsh-effort-slider-mount'), 'stage 必须包含星空/切工水晶滑块挂载点');
  const env = createMockBrowserEnv();
  const stage = add(env.doc.body, 'div');
  // The actual preview supplies the mount, the controls and their event handlers.
  const dock = html.match(/<div\b[^>]*data-dsh-mascot-dock[^>]*>[\s\S]*?data-preview-companion="off"[\s\S]*?<\/button>\s*<\/div>\s*<\/div>/i);
  assert.ok(dock, 'preview whale toolbar');
  stage.innerHTML = dock[0];
  const bridge = bootBundle(t, env);
  const stageScripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  const bundleIndex = stageScripts.findIndex(([, attrs]) => attrs.includes('../dist/dsh-prism.bundle.js'));
  assert.ok(bundleIndex >= 0);
  for (const [, attrs, source] of stageScripts.slice(bundleIndex + 1)) {
    if (!/\bsrc\s*=/.test(attrs)) vm.runInNewContext(source, env.sandbox, { filename: 'preview/dsh-stage.html' });
  }
  const controls = stage.querySelectorAll('button[data-preview-companion]');
  assert.deepEqual(controls.map(b => b.dataset.previewCompanion).sort(), ['off', 'orca', 'whale']);
  for (const mode of ['orca', 'off', 'whale']) {
    controls.find(b => b.dataset.previewCompanion === mode).click();
    env.tick(180);
    assert.equal(bridge.getConfig().mascot, mode);
    assert.deepEqual(activeCompanions(stage), mode === 'off' ? [] : [mode]);
    assert.deepEqual(activeCompanions(env.doc), activeCompanions(stage));
  }
  assert.ok(
    html.includes('data-aura-trigger="decision"') &&
      html.includes('data-aura-trigger="error"') &&
      html.includes('data-aura-trigger="complete"'),
    'stage 必须包含 3 态边缘光晕触发按钮'
  );
  assert.ok(html.includes('btn-open-prism-settings'), 'stage 必须包含外观设置中心触发器');

  const codeMatch = html.match(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/);
  assert.ok(codeMatch, 'stage 必须包含 <pre><code> 代码块');
  const codeLines = codeMatch[1].split(/\r?\n/).length;
  assert.ok(codeLines >= 60, `stage 演示代码块需达到 60 行以上以验证 >=48 行折叠，当前仅 ${codeLines} 行`);
});

// Exercise each public compatibility path independently: a throw in one must not mask the other.
for (const endpoint of ['agPulseHost', '__agPrismMetricsBridge']) {
  test(`10. ${endpoint}.getMetrics() 可读取空用量和后续采样，API 用量没有配额窗口`, async t => {
    const env = createMockBrowserEnv(), bridge = bootBundle(t, env);
    const getMetrics = () => env.sandbox[endpoint].getMetrics();
    const empty = await getMetrics();
    assert.equal(empty.ok, true);
    assert.equal(empty.model, null);
    assert.equal(empty.speed.context.maxTokens, null);
    assert.equal(empty.speed.context.usedTokens, 0);
    assert.equal(empty.speed.tps, null);
    assert.equal(empty.speed.ttftSeconds, null);
    assert.equal(empty.speed.taskUsage.total.totalTokens, 0);
    for (const n of ['own', 'delegated']) assert.equal(empty.speed.taskUsage[n].totalTokens, 0);
    assert.equal(empty.billingMode, 'api');
    assert.deepEqual(Array.from(empty.groups), []);
    bridge.updateTelemetry({ model: 'Live route', usedTokens: 8192, maxTokens: 32768, tps: 12.25 });
    const live = await getMetrics();
    assert.equal(live.model, 'Live route');
    assert.equal(live.speed.tps, 12.25);
    assert.equal(live.speed.context.usedTokens, 8192);
    assert.equal(live.speed.context.maxTokens, 32768);
    assert.equal(live.speed.context.usedFraction, 0.25);
    assert.deepEqual(Array.from(live.groups), []);
    assert.equal(bridge.getTelemetry().quotas, null);
  });
}

test('11. 输入卡片的模型身份与实时窗口同步，切换/撤回原生报告后清除旧值', t => {
  const env = createMockBrowserEnv(), { doc } = env;
  add(doc.body, 'button', { title: 'DeepSeek-V4-Pro' }, 'DeepSeek-V4-Pro High');
  const aside = add(doc.body, 'aside');
  addModelTrigger(aside, 'Gemini Decoy', 'decoy');
  add(aside, 'span', { 'data-prism-context-source': '1', 'data-context-window': '1000000' });
  const host = createHostShell(doc), bridge = bootBundle(t, env);
  const sample = () => { bridge.estimateTelemetry(doc); return bridge.getTelemetry(); };
  assert.equal(sample().model, null);
  assert.equal(sample().maxTokens, null);
  const { trigger, model } = addModelTrigger(host.modelSlot, 'DeepSeek-V4.1-Flash', 'v4.1-flash');
  model.textContent = 'NEW DeepSeek-V4.1-Flash'; // native trigger may include a badge
  assert.equal(sample().model, 'DeepSeek-V4.1-Flash');
  assert.equal(sample().maxTokens, null, 'a familiar model name is not a capacity report');
  const meter = add(host.overlay, 'span', { hidden: '', 'data-prism-context-source': '1', 'data-context-used': 8192,
    'data-context-system': 1024, 'data-context-messages': 6144, 'data-context-tools': 1024 });
  for (const capacity of [32768, 131072, 32768]) {
    meter.setAttribute('data-context-window', capacity);
    const tel = sample();
    assert.equal(tel.maxTokens, capacity);
    assert.equal(tel.usedTokens, 8192);
    assert.equal(tel.remainingTokens, capacity - 8192);
    assert.ok(Math.abs(tel.usedFraction - 8192 / capacity) < 0.0001);
    assert.deepEqual([tel.systemTokens, tel.conversationTokens, tel.codeToolTokens], [1024, 6144, 1024]);
  }
  trigger.title = 'Custom Provider Route · Low';
  model.setAttribute('data-model-id', 'custom-route');
  assert.equal(sample().model, 'Custom Provider Route');
  meter.remove(); trigger.remove();
  const empty = sample();
  assert.equal(empty.model, null); assert.equal(empty.maxTokens, null);
  assert.equal(empty.usedTokens, 0); assert.equal(empty.remainingTokens, null); assert.equal(empty.usedPercent, null);
  assert.equal(empty.quotas, null);
});

test('12. session overlay 使用两条宿主 projection，实际渲染隐藏 source 并送达桥接', t => {
  const env = createMockBrowserEnv();
  const shell = createHostShell(env.doc), host = createClientHost(env);
  host.apply(); t.after(() => host.dispose());
  host.declare(OVERLAY);
  const bridge = env.sandbox.__agPrismBridge;
  const { component } = host.entry(OVERLAY);
  const props = { sessionId: 'session-a', useProjection(...args) {
    assert.equal(args.length, 1); reads.push(args[0]); return projections[args[0]];
  } };
  const reads = [], projections = {};
  const render = () => {
    reads.length = 0;
    const unmount = host.mount(component, props, shell.overlay);
    assert.deepEqual([...reads].sort(), ['contextBreakdown', 'contextPressure']);
    bridge.estimateTelemetry(env.doc);
    return unmount;
  };
  const emptyUnmount = render();
  assert.equal(bridge.getTelemetry().maxTokens, null);
  emptyUnmount();
  for (const [contextWindow, projectedTokens, used] of [[48000, 8000, 8000], [120000, undefined, 6400], [48000, 0, 0]]) {
    projections.contextPressure = { contextWindow, pressureTokens: 6400, projectedTokens };
    projections.contextBreakdown = { systemTokens: 1100, messageTokens: 4200, toolsTokens: 700 };
    const unmount = render();
    const span = shell.card.querySelector('span[data-prism-context-source="1"]');
    assert.ok(span?.hidden, 'noninteractive projection source is a hidden span in this card');
    for (const [key, value] of Object.entries({ window: contextWindow, used, system: 1100, messages: 4200, tools: 700 })) {
      assert.equal(span.getAttribute(`data-context-${key}`), String(value), key);
    }
    assert.deepEqual([bridge.getTelemetry().maxTokens, bridge.getTelemetry().usedTokens], [contextWindow, used]);
    unmount();
    assert.equal(shell.card.querySelector('[data-prism-context-source="1"]'), null);
  }
});

function visibleText(node) {
  if (node.nodeType === 3) return node.data;
  if (node.hidden || node.style.display === 'none' || node.getAttribute('aria-hidden') === 'true') return '';
  return node.childNodes.map(visibleText).join(' ');
}

test('13. 试管首屏占位、采样值与清空后的视图都使用 API 按量计费', t => {
  const env = createMockBrowserEnv();
  createHostShell(env.doc);
  const bridge = bootBundle(t, env);
  const trigger = env.doc.querySelector('[data-testid="dsh-vial-trigger"]');
  assert.ok(trigger); trigger.click();
  assert.equal(env.sandbox.DSHPrismWidgets.getState().vialOpen, true);
  const pop = env.doc.querySelector('[data-testid="dsh-vial-popover"]');
  assert.ok(pop);
  const field = k => { const el = pop.querySelector(`[data-k="${k}"]`); assert.ok(el, k); return el.textContent.trim(); };
  const placeholder = /[—–-]|未(?:知|提供|报告|上报)|暂无|待上报|unknown|unavailable|not reported|n\/a/i;
  function billing() {
    const text = visibleText(pop);
    assert.match(text, /API/i); assert.match(text, /按量|用量计费|pay.as.you.go|usage.based/i);
    assert.doesNotMatch(text, /配额池|配额充裕|额度充裕|线性预计结余|\d+\s*(?:小时|分钟).*后重置|renews in|resets in|quota pool/i);
    assert.equal(pop.querySelectorAll('.dsh-vial-quota-row, [data-quota-window]').filter(el => visibleText(el).trim()).length, 0);
  }
  function empty() {
    assert.match(field('model'), placeholder); assert.match(field('pct'), placeholder); assert.match(field('tps'), placeholder);
    assert.match(field('ctx-cap'), placeholder);
    for (const text of [visibleText(trigger), visibleText(pop)]) {
      assert.doesNotMatch(text, /512\s*k|256\s*k|1\s*m\b|68\.4|DeepSeek[- ]?(?:R1|V4)|\b(?:null|undefined|NaN)\b/i);
    }
    billing();
  }
  empty();
  bridge.updateTelemetry({ model: 'Atlas sample', maxTokens: 64000, usedTokens: 32000, tps: 21.5,
    systemTokens: 2000, conversationTokens: 29000, codeToolTokens: 1000 });
  env.tick(50);
  assert.match(field('model'), /Atlas sample/); assert.match(field('pct'), /50(?:\.0)?\s*%/); assert.match(field('tps'), /21\.5/);
  assert.match(field('ctx-cap'), /64(?:\.0)?\s*[kK]|64[ ,]?000/);
  billing();
  bridge.updateTelemetry({ model: null, maxTokens: null, usedTokens: 0, tps: null, latestTps: null,
    systemTokens: 0, conversationTokens: 0, codeToolTokens: 0, thinkingTokens: 0 });
  env.tick(50);
  empty();
  assert.doesNotMatch(visibleText(pop), /Atlas sample|21\.5|64(?:\.0)?\s*[kK]|64[ ,]?000/);
});

test('14. 四主题实际同步到文档，原生侧栏与输入卡片的开关互相独立', t => {
  const env = createMockBrowserEnv(), { doc } = env, host = createHostShell(doc);
  const right = add(host.frame, 'div', { class: 'mP3x-q_rightbarCol' });
  const search = add(right, 'div', { role: 'option', 'aria-selected': 'true' }, 'A search result');
  const unrelated = add(right, 'textarea'); unrelated.value = 'untouched external draft';
  const menu = add(doc.body, 'div', { role: 'menu' });
  const nativeAction = add(menu, 'button', { role: 'menuitem' }, 'Edit');
  const fakeCard = add(right, 'div', { 'data-composer-card': '' });
  add(fakeCard, 'div', { 'data-composer-input': '', role: 'textbox' });
  const draft = add(host.editor, 'p', { 'data-lexical-text': 'true' }, '正在输入的草稿');
  const nativeChildren = [host.card, host.editor, host.sidebar, host.row, right, menu].map(node => [node, [...node.childNodes]]);
  const original = draft.firstChild;
  const bridge = bootBundle(t, env);
  function verify(sidebar, composer) {
    env.tick(180);
    for (const [surface, target, enabled] of [['sidebar', host.sideCol, sidebar], ['composer', host.card, composer]]) {
      const attr = `data-prism-${surface}`;
      assert.equal(target.getAttribute(attr), enabled ? '1' : null, surface);
      assert.equal(doc.querySelectorAll(`[${attr}]`).length, Number(enabled), `only the owning ${surface} is marked`);
    }
    for (const [node, children] of nativeChildren) {
      const current = [...node.childNodes];
      assert.ok(current.length >= children.length, 'plugin UI may only append, never remove native children');
      assert.deepEqual(current.slice(0, children.length), children, 'React child identity/order');
      for (const extra of current.slice(children.length)) {
        assert.ok(extra.nodeType === 1 && (
          extra.matches('[data-dsh-prism-owned="1"]') ||
          extra.matches('[data-prism-companion-stage]')
        ), 'extra composer children must be plugin-owned');
      }
    }
    assert.equal(draft.firstChild, original); assert.equal(draft.textContent, '正在输入的草稿');
    assert.equal(unrelated.value, 'untouched external draft');
    assert.equal(search.getAttribute('aria-selected'), 'true'); assert.equal(nativeAction.parentNode, menu);
  }
  verify(true, true);
  for (const [theme, mode, base, sidebar] of [
    ['obsidian', 'dark', '#0E0E11', '#09090B'], ['warm', 'dark', '#141413', '#10100F'],
    ['crystal', 'light', '#F4F7FB', '#E8EEF6'], ['alabaster', 'light', '#F6F4EE', '#EBE6DC'],
  ]) {
    bridge.setConfig({ theme });
    assert.equal(doc.documentElement.getAttribute('data-prism-theme'), theme);
    assert.equal(doc.documentElement.getAttribute('data-ag-cs-theme'), mode);
    for (const node of [doc.documentElement, doc.body]) {
      assert.equal(node.style.getPropertyValue('--dsw-alias-bg-base').toUpperCase(), base);
      assert.equal(node.style.getPropertyValue('--dsw-alias-bg-layer-1').toUpperCase(), sidebar);
    }
    verify(true, true);
  }
  bridge.setConfig({ sidebarRestyle: false }); verify(false, true);
  bridge.setConfig({ composer: 'off' }); verify(false, false);
  bridge.setConfig({ sidebar: 'on' }); verify(true, false);
  bridge.setConfig({ composerRestyle: true }); verify(true, true);
});

test('15. 侧栏折叠、只读 textbox、React 替换及 destroy 后正确重标与撤标', t => {
  const env = createMockBrowserEnv(), { doc } = env;
  const host = createHostShell(doc);
  host.editor.setAttribute('contenteditable', 'false');
  bootBundle(t, env); env.tick(180);
  assert.equal(host.card.getAttribute('data-prism-composer'), '1');
  host.scrollport.remove(); env.tick(180);
  assert.equal(host.sideCol.getAttribute('data-prism-sidebar'), '1', 'collapsed rail still has the native toggle');
  host.sideCol.remove(); host.seat.remove();
  const replacement = host.makeComposer();
  const newSide = add(host.frame, 'div', { class: 'mP3x-q_sidebarCol' });
  add(newSide, 'button', { 'data-sidebar-toggle': '' });
  for (const el of [replacement.card, replacement.editor, newSide]) el.__reactFiber$fixture = {};
  env.tick(220);
  const check = (marked) => {
    for (const [name, old, fresh] of [['sidebar', host.sideCol, newSide], ['composer', host.card, replacement.card]]) {
      const attr = `data-prism-${name}`;
      assert.equal(old.hasAttribute(attr), false, 'release detached React node');
      assert.equal(fresh.getAttribute(attr), marked ? '1' : null);
      assert.equal(doc.querySelectorAll(`[${attr}]`).length, Number(marked));
    }
  };
  check(true);
  env.sandbox.__dshObsidianPrism.destroy(); env.tick(220); check(false);
  env.sandbox.__dshObsidianPrismBootstrap(); env.tick(220); check(true);
  env.sandbox.__dshObsidianPrism.destroy(); env.tick(220); check(false);
});

test('胶囊和设置紧随真实权限槽且先于 Plan；无权限、换卡和卸载时没有悬浮副本', t => {
  const env = createMockBrowserEnv(), { doc } = env;
  const vial = '[data-testid="dsh-vial-trigger"]', gear = '[data-testid="dsh-settings-trigger"]';
  const visible = node => {
    for (let p = node; p; p = p.parentElement) {
      if (p.hidden || p.dataset.hidden === '1' || p.getAttribute('aria-hidden') === 'true' ||
          p.style.display === 'none' || p.style.visibility === 'hidden') return false;
    }
    return node.isConnected;
  };
  function absent() {
    env.tick(350);
    for (const selector of [vial, gear]) assert.equal(doc.querySelectorAll(selector).filter(visible).length, 0, `${selector}: no viewport fallback`);
  }
  function inline(shell) {
    env.tick(350);
    const dock = shell.permission.nextElementSibling;
    assert.ok(dock && dock !== shell.plan, 'inline controls immediately after the permission SlotOutlet');
    assert.equal(dock.getAttribute('data-prism-composer-tools'), '');
    assert.ok(shell.card.contains(dock) && shell.modes.contains(dock), 'the dock is embedded in the composer toolbar');
    const trigger = doc.querySelector(vial), settings = doc.querySelector(gear);
    for (const [selector, button] of [[vial, trigger], [gear, settings]]) {
      assert.equal(doc.querySelectorAll(selector).length, 1, selector);
      assert.ok(button && dock.contains(button) && visible(button), selector);
      assert.equal(button.closest('[data-dsh-prism-portal="dock"]'), null);
      for (let el = button; el !== shell.modes; el = el.parentElement) assert.notEqual(el.style.position, 'fixed');
    }
    assert.equal(dock.nextElementSibling, shell.plan, 'the trailing model slot is not the insertion point');
    assert.ok(shell.permission.contains(shell.permissionButton));
    assert.equal(dock.parentElement, shell.modes, 'the dock belongs to the composer modes row');
    assert.equal(dock.closest('[data-composer-card]'), shell.card, 'never mount a viewport portal');
    return trigger;
  }
  // Same slot name in a dialog is neither the active composer nor a fallback anchor.
  const other = add(add(doc.body, 'div', { role: 'dialog' }), 'div', { 'data-slot': 'conversation.input.permission' });
  add(other, 'button', { type: 'button' }, 'Permissions');
  bootBundle(t, env); absent();
  const shell = createHostShell(doc);
  let trigger = inline(shell); trigger.click();
  assert.equal(trigger.getAttribute('aria-expanded'), 'true'); trigger.click();
  assert.equal(trigger.getAttribute('aria-expanded'), 'false');
  shell.permissionButton.remove(); absent();
  shell.permission.appendChild(shell.permissionButton); inline(shell);
  shell.seat.remove(); absent();
  const replacement = shell.makeComposer(); trigger = inline(replacement);
  assert.equal(shell.card.querySelector(vial), null, 'release the detached card');
  env.sandbox.__dshObsidianPrism.destroy(); absent();
  assert.equal(trigger.isConnected, false);
});

const SLIDER = '[data-testid="dsh-effort-slider"]';
function liveSlider(env) {
  return env.doc.querySelectorAll(`${SLIDER} [role="slider"]`).find(track =>
    !track.closest('[hidden], [aria-hidden="true"], [data-hidden="1"]') && track.isConnected);
}
function pointer(env, track, type, value) {
  const r = track.getBoundingClientRect();
  sendEvent(env, track, type, { pointerId: 7, pointerType: 'mouse', button: 0,
    buttons: type === 'pointerup' || type === 'pointercancel' ? 0 : 1, isPrimary: true,
    clientX: r.left + r.width * value, clientY: r.top + r.height / 2 });
}
function settleMenu(env) {
  env.sandbox.DSHPrismWidgets.syncLayout();
  env.tick(180);
}

test('16. 缺少可选根页数据时仅在关联的推理二级页挂载，排除模型和同名干扰菜单', t => {
  const env = createMockBrowserEnv(), shell = createHostShell(env.doc);
  const select = nativeModelSelect(shell);
  const outside = add(env.doc.body, 'div', { id: 'other-menu', role: 'menu', 'aria-label': 'Model and reasoning effort' });
  const wrongClicks = [];
  for (const label of ['Off', 'Low', 'High']) {
    const button = add(outside, 'button', { type: 'button', role: 'menuitemradio', 'aria-checked': String(label === 'Low') }, label);
    button.addEventListener('click', () => wrongClicks.push(label));
  }
  bootBundle(t, env);
  function noEffortSlider() {
    settleMenu(env);
    assert.equal(Boolean(liveSlider(env)), false, 'the open surface does not represent the composer effort pane');
  }
  noEffortSlider();
  select.trigger.click(); noEffortSlider();
  select.menu.querySelectorAll('button[role="menuitem"]')[0].click(); noEffortSlider();
  // These two real *models* are named Low and High. Native model selection must still work.
  select.rows[1].click();
  assert.deepEqual(select.clicks, [{ pane: 'model', label: 'High' }]);
  select.trigger.click();
  select.menu.querySelectorAll('button[role="menuitem"]')[1].click(); settleMenu(env);
  const track = liveSlider(env); assert.ok(track, 'effort menu receives an interactive slider');
  assert.match(track.getAttribute('aria-valuetext') || '', /high|高/i, 'reflect the native aria-checked radio');
  sendEvent(env, track, 'keydown', { key: 'ArrowLeft' });
  assert.deepEqual(select.clicks, [{ pane: 'model', label: 'High' }, { pane: 'effort', label: 'Low' }]);
  assert.deepEqual(wrongClicks, []);
  noEffortSlider();
});

test('17. 拖动只在释放时提交一次真实可用选项，取消、菜单替换与陈旧手势安全', t => {
  const env = createMockBrowserEnv(), shell = createHostShell(env.doc), native = nativeModelSelect(shell);
  bootBundle(t, env);
  function open(labels, checked = 0, disabled = []) {
    native.open('effort', labels, checked, disabled); settleMenu(env);
    const track = liveSlider(env); assert.ok(track, 'effort pane with real options'); return track;
  }
  const choices = ['Off', 'Low', 'Medium', 'High'];
  let track = open(choices, 1);
  assert.match(track.getAttribute('aria-valuetext') || '', /low|低/i);
  pointer(env, track, 'pointerdown', 0.01);
  pointer(env, track, 'pointermove', 0.45);
  pointer(env, track, 'pointermove', 0.99);
  assert.deepEqual(native.clicks, [], 'previewing several steps must leave the native menu open');
  pointer(env, track, 'pointerup', 0.99);
  pointer(env, track, 'pointerup', 0.99);
  assert.deepEqual(native.clicks, [{ pane: 'effort', label: 'High' }]);
  track = open(choices, 3);
  pointer(env, track, 'pointerdown', 0.99); pointer(env, track, 'pointermove', 0.01);
  pointer(env, track, 'pointercancel', 0.01); pointer(env, track, 'pointerup', 0.01);
  assert.equal(native.clicks.length, 1);
  pointer(env, track, 'pointerdown', 0.99); pointer(env, track, 'pointermove', 0.01);
  native.open('effort', ['Off', 'Medium'], 1); // React replaced the portal before pointerup/observer delivery.
  pointer(env, track, 'pointerup', 0.01);
  assert.equal(native.clicks.length, 1, 'an old pointer may not commit into its replacement');
  track = open(['Off', 'Low', 'High'], 2);
  pointer(env, track, 'pointerdown', 0.8); pointer(env, track, 'pointermove', 0.01); pointer(env, track, 'pointerup', 0.01);
  assert.deepEqual(native.clicks.at(-1), { pane: 'effort', label: 'Off' }, 'Off and Low are different native rows');
  assert.equal(native.clicks.length, 2);
  track = open(['Low', 'High', 'Orchestrator'], 2);
  assert.equal(track.closest(SLIDER).getAttribute('data-track-style'), 'crystal',
    'only the explicit Orchestrator tier keeps the upstream cut-crystal bar');
});

test('18. 稀疏和禁用推理选项不会被替代，卸载、重新挂载后仍只提交一次', t => {
  const env = createMockBrowserEnv(), shell = createHostShell(env.doc), native = nativeModelSelect(shell);
  bootBundle(t, env);
  native.open('effort', ['Low', 'High'], 0); settleMenu(env);
  let track = liveSlider(env); assert.ok(track);
  const wrap = track.closest(SLIDER);
  for (const button of wrap.querySelectorAll('button')) {
    if (/orchestrator|max|medium|off/i.test(button.textContent)) {
      assert.ok(button.disabled || button.getAttribute('aria-disabled') === 'true' || button.hidden,
        `unsupported option ${button.textContent} must be unavailable`);
      button.click();
    }
  }
  assert.deepEqual(native.clicks, []);
  native.open('effort', ['Low', 'High'], 0, [0, 1]); settleMenu(env);
  track = liveSlider(env);
  if (track) {
    sendEvent(env, track, 'keydown', { key: 'ArrowRight' });
    pointer(env, track, 'pointerdown', 0.98); pointer(env, track, 'pointerup', 0.98);
    for (const button of track.closest(SLIDER).querySelectorAll('button')) button.click();
  }
  assert.deepEqual(native.clicks, []);
  native.open('effort', ['Low', 'High'], 0); settleMenu(env);
  const stale = liveSlider(env); assert.ok(stale);
  env.sandbox.__dshObsidianPrism.destroy(); env.tick(220);
  assert.equal(stale.isConnected, false);
  sendEvent(env, stale, 'keydown', { key: 'ArrowRight' });
  assert.deepEqual(native.clicks, []);
  env.sandbox.__dshObsidianPrismBootstrap(); settleMenu(env);
  assert.equal(env.doc.querySelectorAll(`${SLIDER} [role="slider"]`).length, 1);
  const fresh = liveSlider(env); assert.ok(fresh);
  sendEvent(env, fresh, 'keydown', { key: 'ArrowRight' });
  assert.deepEqual(native.clicks, [{ pane: 'effort', label: 'High' }]);
});

// The companion module is independently usable; a compat export alone does not make a pet active.
test('像素鲸模块按模式挂载单个不同的 canvas 精灵，关闭后通知和旧句柄均不会复活鲸', () => {
  const env = createMockBrowserEnv(), stage = add(env.doc.body, 'div');
  vm.runInNewContext(readText('src/deepseek-companions.js'), env.sandbox, { filename: 'deepseek-companions.js' });
  const api = env.sandbox.DSHPrismCompanions;
  for (const [raw, expected] of [[undefined, 'whale'], ['crab', 'whale'], ['minis', 'whale'], ['dual', 'orca'],
    ['whale', 'whale'], ['orca', 'orca'], ['off', 'off']]) assert.equal(api.normalizeMode(raw), expected, String(raw));
  const rig = api.mount(stage, { mode: 'off', reducedMotion: false, streaming: false });
  for (const method of ['setState', 'notify', 'getLayoutSnapshot', 'dispose']) assert.equal(typeof rig[method], 'function', method);
  const state = (mode, reducedMotion, streaming) => {
    const snap = rig.getLayoutSnapshot();
    assert.deepEqual([snap.mode, snap.reducedMotion, snap.streaming, snap.visible], [mode, reducedMotion, streaming, mode !== 'off']);
    assert.deepEqual(activeCompanions(stage), mode === 'off' ? [] : [mode]);
  };
  const shape = () => stage.querySelector('[data-prism-companion] canvas')?.dataset.sprite;
  const calfShape = () => stage.querySelector('[data-prism-companion-calf] canvas')?.dataset.sprite;
  state('off', false, false);
  rig.setState({ mode: 'crab' }); state('whale', false, false);
  const whale = shape(); assert.equal(whale, 'whale', 'actual whale canvas sprite');
  assert.equal(calfShape(), 'whale-calf', 'a distinct smaller calf follows the adult');
  const adultCanvas = stage.querySelector('canvas.prism-pixel-sprite--adult');
  const calfCanvas = stage.querySelector('[data-prism-companion-calf] canvas');
  assert.ok(calfCanvas.width < adultCanvas.width && calfCanvas.height < adultCanvas.height,
    'the calf must remain visibly smaller than the adult');
  assert.equal(stage.querySelector('[data-prism-companion]').dataset.pixelated, '1');
  rig.notify('vial-opened');
  rig.setState({ mode: 'dual', streaming: true, reducedMotion: true }); state('orca', true, true);
  assert.ok(shape()); assert.notEqual(shape(), whale, 'orca and blue whale cannot share one unchanged silhouette');
  assert.equal(calfShape(), 'orca-calf');
  rig.notify('complete'); state('orca', true, true);
  rig.setState({ mode: 'off' }); rig.notify('vial-opened'); state('off', true, true);
  rig.setState({ mode: 'minis' }); state('whale', true, true);
  rig.dispose(); rig.setState({ mode: 'orca' }); rig.notify('complete');
  assert.deepEqual(activeCompanions(env.doc), []);
});

test('像素伴宠可拖动、松手落地，并在非降级动效下自主移动', () => {
  const env = createMockBrowserEnv(), stage = add(env.doc.body, 'div');
  stage.clientWidth = 320;
  stage.offsetWidth = 320;
  vm.runInNewContext(readText('src/deepseek-companions.js'), env.sandbox, { filename: 'deepseek-companions.js' });
  const rig = env.sandbox.DSHPrismCompanions.mount(stage, { mode: 'whale', reducedMotion: false });
  const owner = stage.querySelector('[data-prism-companion]');
  const calfOwner = stage.querySelector('[data-prism-companion-calf]');
  assert.equal(owner.querySelector('canvas').dataset.sprite, 'whale');
  assert.equal(calfOwner.querySelector('canvas').dataset.sprite, 'whale-calf');
  const initial = rig.getLayoutSnapshot();
  assert.equal(initial.walking, true);
  env.tick(140);
  const patrolled = rig.getLayoutSnapshot();
  assert.notEqual(patrolled.x, initial.x, 'adult companion patrols on its own');
  assert.notEqual(patrolled.calf.x, initial.calf.x, 'calf patrols on its own timeline');
  const calfAtAdultDrag = patrolled.calf.x;
  sendEvent(env, owner, 'pointerdown', { pointerId: 9, button: 0, isPrimary: true, clientX: 180, clientY: 90 });
  sendEvent(env, owner, 'pointermove', { pointerId: 9, button: 0, isPrimary: true, clientX: 90, clientY: 70 });
  assert.equal(rig.getLayoutSnapshot().dragging, true);
  assert.equal(owner.dataset.dragging, '1');
  assert.equal(rig.getLayoutSnapshot().calf.x, calfAtAdultDrag, 'dragging the adult does not warp the calf');
  sendEvent(env, owner, 'pointerup', { pointerId: 9, button: 0, isPrimary: true, clientX: 90, clientY: 70 });
  assert.equal(rig.getLayoutSnapshot().dragging, false);
  assert.equal(owner.hasAttribute('data-dragging'), false);
  const adultAfterDrag = rig.getLayoutSnapshot().x;
  const calfBeforeDrag = rig.getLayoutSnapshot().calf.x;
  sendEvent(env, calfOwner, 'pointerdown', { pointerId: 10, button: 0, isPrimary: true, clientX: 70, clientY: 90 });
  sendEvent(env, calfOwner, 'pointermove', { pointerId: 10, button: 0, isPrimary: true, clientX: 20, clientY: 85 });
  assert.equal(rig.getLayoutSnapshot().calf.dragging, true);
  sendEvent(env, calfOwner, 'pointerup', { pointerId: 10, button: 0, isPrimary: true, clientX: 20, clientY: 85 });
  assert.notEqual(rig.getLayoutSnapshot().calf.x, calfBeforeDrag, 'the calf has its own drag position');
  assert.equal(rig.getLayoutSnapshot().x, adultAfterDrag, 'dragging the calf does not move the adult');
  sendEvent(env, owner, 'pointerdown', { pointerId: 11, button: 0, isPrimary: true, clientX: 90, clientY: 80 });
  sendEvent(env, owner, 'pointermove', { pointerId: 11, button: 0, isPrimary: true, clientX: 90, clientY: 220 });
  assert.equal(rig.getLayoutSnapshot().y, 0, 'downward drags are clamped at the composer ground line');
  sendEvent(env, owner, 'pointerup', { pointerId: 11, button: 0, isPrimary: true, clientX: 90, clientY: 220 });
  rig.setState({ reducedMotion: true });
  const still = rig.getLayoutSnapshot().x;
  env.tick(120);
  assert.equal(rig.getLayoutSnapshot().x, still, 'reduced motion stops autonomous travel');
  rig.dispose();
  assert.equal(stage.querySelector('[data-prism-companion]'), null);
  assert.equal(stage.querySelector('[data-prism-companion-calf]'), null);
});

test('像素鲸母子物理碰撞按质量分离、产生推力并保持有限数值', () => {
  const env = createMockBrowserEnv();
  vm.runInNewContext(readText('src/deepseek-companions.js'), env.sandbox, { filename: 'deepseek-companions.js' });
  const core = env.sandbox.DSHPrismCompanions.collisionCore;
  assert.equal(typeof core?.measure, 'function');
  assert.equal(typeof core?.resolvePair, 'function');
  const bounds = {
    adult: { minX: 0, maxX: 268, minY: -72, maxY: 8 },
    calf: { minX: 0, maxX: 284, minY: -72, maxY: 8 },
  };
  const adult = { x: 100, y: 0, width: 44, height: 32, vx: 120, vy: 0 };
  const calf = { x: 130, y: 0, width: 28, height: 22, vx: -20, vy: 0 };
  assert.equal(core.measure(adult, calf).colliding, true);
  const pushed = core.resolvePair(adult, calf, {
    bounds, fixedAdult: true, motionAdult: { vx: 120, vy: 0 }, motionCalf: { vx: -20, vy: 0 },
  });
  assert.equal(pushed.resolved, true);
  assert.equal(core.measure(adult, calf).colliding, false);
  assert.equal(adult.x, 100, 'the dragged whale remains pointer-locked');
  assert.ok(calf.x > 130, 'the struck calf receives separation and momentum');
  assert.ok(pushed.impulseCalf > 0, 'the lighter calf receives a positive impulse');
  for (const value of [adult.x, adult.y, adult.vx, adult.vy, calf.x, calf.y, calf.vx, calf.vy]) {
    assert.equal(Number.isFinite(value), true);
  }

  const stillAdult = { x: 90, y: 0, width: 44, height: 32, vx: 0, vy: 0 };
  const stillCalf = { x: 118, y: 0, width: 28, height: 22, vx: 0, vy: 0 };
  const reduced = core.resolvePair(stillAdult, stillCalf, { bounds, reducedMotion: true });
  assert.equal(reduced.resolved, true);
  assert.equal(core.measure(stillAdult, stillCalf).colliding, false);
  assert.deepEqual([stillAdult.vx, stillAdult.vy, stillCalf.vx, stillCalf.vy], [0, 0, 0, 0],
    'reduced motion separates geometry without adding bounce energy');

  const edgeAdult = { x: 100, y: 0, width: 44, height: 32 };
  const edgeCalf = { x: 142, y: 0, width: 28, height: 22 };
  assert.equal(core.measure(edgeAdult, edgeCalf).colliding, true,
    'full canvas boxes overlap before the painted whale pixels touch');
  edgeAdult.hitbox = () => ({ x: 102, y: 4, width: 40, height: 22 });
  edgeCalf.hitbox = () => ({ x: 142, y: 4, width: 28, height: 16 });
  assert.equal(core.measure(edgeAdult, edgeCalf).colliding, false,
    'tight sprite hitboxes contact at the visible painted edge, not the transparent canvas margin');

  const easedAdult = { x: 100, y: 0, width: 44, height: 32, vx: 0, vy: 0 };
  const easedCalf = { x: 130, y: 0, width: 28, height: 22, vx: 0, vy: 0 };
  const easedOptions = {
    bounds, applyImpulse: false, maxCorrection: 3, allowDiscreteFallback: false,
  };
  const firstStep = core.resolvePair(easedAdult, easedCalf, easedOptions);
  const firstDisplacement = Math.abs(easedAdult.x - 100) + Math.abs(easedCalf.x - 130);
  assert.equal(firstStep.resolved, false, 'a deep collision must not resolve by teleporting in one frame');
  assert.ok(firstDisplacement <= 3.05, `per-frame separation budget exceeded: ${firstDisplacement}`);
  let frames = 1;
  while (core.measure(easedAdult, easedCalf).colliding && frames < 20) {
    core.resolvePair(easedAdult, easedCalf, easedOptions);
    frames += 1;
  }
  assert.equal(core.measure(easedAdult, easedCalf).colliding, false);
  assert.ok(frames > 2, `smooth collision should need multiple frames, got ${frames}`);

  const upper = { x: 100, y: -24, width: 44, height: 32, vx: 0, vy: 180 };
  const grounded = { x: 108, y: 0, width: 28, height: 22, vx: 0, vy: 0 };
  const vertical = core.resolvePair(upper, grounded, {
    bounds: {
      adult: { minX: 0, maxX: 268, minY: -72, maxY: 0 },
      calf: { minX: 0, maxX: 284, minY: -72, maxY: 0 },
    },
    motionAdult: { vx: 0, vy: 180 },
    motionCalf: { vx: 0, vy: 0 },
    maxCorrection: Infinity,
  });
  assert.equal(vertical.resolved, true);
  assert.equal(grounded.y, 0, 'vertical collision must never push the lower whale below ground into the composer');
  assert.ok(upper.y <= 0, 'the upper whale must stay above the composer ground line');
  assert.equal(core.measure(upper, grounded).colliding, false);
});

test('桌面嵌入设置实际选中蓝鲸、虎鲸和关闭；重新打开时仍反映持久选择', t => {
  const env = createMockBrowserEnv(), shell = createHostShell(env.doc), host = createClientHost(env);
  host.apply(); host.declare(SETTINGS);
  t.after(() => host.dispose());
  assert.match(env.doc.getElementById('dsh-obsidian-prism-styles').textContent, /\[data-prism-companion/);
  const dialog = add(env.doc.body, 'div', { role: 'dialog' });
  const render = () => {
    const unmount = host.mount(host.entry(SETTINGS).component, { close() {} }, dialog);
    const tab = dialog.querySelector('[role="tab"][data-tab="interaction"]');
    assert.ok(tab); tab.click();
    return unmount;
  };
  const controls = () => dialog.querySelectorAll('button[data-sk="mascot"]');
  const value = b => JSON.parse(b.getAttribute('data-sv'));
  function verify(mode, persisted = true) {
    env.tick(160);
    const buttons = controls();
    assert.deepEqual(buttons.map(value).sort(), ['off', 'orca', 'whale']);
    assert.deepEqual(buttons.filter(b => b.getAttribute('aria-pressed') === 'true').map(value), [mode]);
    const expected = mode === 'off' ? [] : [mode];
    assert.deepEqual(activeCompanions(env.doc), expected);
    assert.equal(env.sandbox.__agPrismBridge.getConfig().mascot, mode);
    if (persisted) assert.equal(JSON.parse(env.store.get(STORAGE_KEY)).mascot, mode);
    assert.equal(shell.editor.isConnected, true);
  }
  let unmount = render(); verify('whale', false);
  for (const mode of ['orca', 'off', 'whale', 'off']) {
    controls().find(b => value(b) === mode).click(); verify(mode);
  }
  unmount(); unmount = render(); verify('off'); unmount();
});

test('桌面冷启动读取每一种旧缓存，不会批量覆盖显式 off 或其他设置', async t => {
  for (const [legacy, expected] of [['crab', 'whale'], ['minis', 'whale'], ['dual', 'orca'], ['off', 'off']]) {
    const env = createMockBrowserEnv(); createHostShell(env.doc);
    const transport = configTransport(env);
    env.store.set(STORAGE_KEY, JSON.stringify({ mascot: legacy, theme: 'warm' }));
    const host = createClientHost(env); t.after(() => host.dispose()); host.apply();
    env.tick(300);
    const cfg = env.sandbox.__agPrismBridge.getConfig();
    assert.deepEqual([cfg.mascot, cfg.theme], [expected, 'warm'], `cache: ${legacy}`);
    assert.deepEqual(activeCompanions(env.doc), expected === 'off' ? [] : [expected]);
    assert.deepEqual(transport.calls.map(c => c.method), ['GET']);
    transport.reply({ mascot: legacy, theme: 'warm' }); await flushBrowserJobs(); env.tick(300);
    assert.equal(JSON.parse(env.store.get(STORAGE_KEY)).mascot, expected);
    assert.deepEqual(transport.calls.map(c => c.method), ['GET'], 'reading an old host configuration must not write it back');
  }
});

// The browser gets an in-memory fetch implementation, never Node's network fetch.
// Hold GET open so the tests can advance past the write debounce before and after hydration.
function configTransport(env) {
  const calls = [];
  let reply;
  const getResponse = new Promise(resolve => { reply = resolve; });
  env.sandbox.location = new URL('dsh-app://app/');
  env.sandbox.fetch = async (url, init = {}) => {
    calls.push({ url, method: init.method || 'GET', body: init.body });
    const json = (init.method || 'GET') === 'GET' ? await getResponse : { ok: true };
    return { ok: true, json: async () => json };
  };
  return { calls, reply: config => reply({ ok: true, config }) };
}

const flushBrowserJobs = () => new Promise(resolve => setImmediate(resolve));
const CONFIG_URL = '/api/obsidian-prism/config';
const STORAGE_KEY = 'dsh_obsidian_prism_config';

test('19. 客户端启动读取宿主设置覆盖旧缓存，GET 响应前后均无反向 POST', async t => {
  const env = createMockBrowserEnv();
  const { calls, reply } = configTransport(env);
  env.store.set(STORAGE_KEY, JSON.stringify({ theme: 'crystal', mascot: 'crab', accentTone: 'follow' }));
  const host = createClientHost(env);
  t.after(() => host.dispose());
  host.apply();
  assert.equal(env.sandbox.__dshObsidianPrism?.booted, true);
  env.tick(300);
  const methods = () => calls.map(call => [call.method, call.url]);
  assert.deepEqual(methods(), [['GET', CONFIG_URL]], 'the stale cached value must never be scheduled for writeback');
  reply({ theme: 'obsidian', mascot: 'off', accentTone: 'amber' });
  await flushBrowserJobs();
  env.tick(300);
  await flushBrowserJobs();
  const bridge = env.sandbox.__agPrismBridge;
  for (const cfg of [bridge.getConfig(), JSON.parse(env.store.get(STORAGE_KEY))]) {
    assert.deepEqual([cfg.theme, cfg.mascot, cfg.accentTone], ['obsidian', 'off', 'amber']);
  }
  assert.equal(env.doc.documentElement.getAttribute('data-prism-theme'), 'obsidian');
  assert.deepEqual(methods(), [['GET', CONFIG_URL]], 'applying host JSON is read-only');

  // Positive control: this transport and clock can observe a delayed write on a user edit.
  bridge.setConfig({ theme: 'warm' });
  env.tick(300);
  await flushBrowserJobs();
  assert.deepEqual(methods(), [['GET', CONFIG_URL], ['POST', CONFIG_URL]]);
  assert.equal(JSON.parse(calls[1].body).config.theme, 'warm');
});

test('20. 显式引导设置优先，客户端启动不会把设置 POST 回宿主', async t => {
  const env = createMockBrowserEnv();
  const { calls, reply } = configTransport(env);
  env.store.set(STORAGE_KEY, JSON.stringify({ theme: 'crystal', mascot: 'crab' }));
  env.sandbox.__DSH_PRISM_BOOT_CONFIG__ = { theme: 'warm', mascot: 'off' };
  const host = createClientHost(env);
  t.after(() => host.dispose());
  host.apply();
  reply({ theme: 'alabaster', mascot: 'crab' });
  await flushBrowserJobs();
  env.tick(300);
  assert.equal(env.sandbox.__dshObsidianPrism?.booted, true);
  const cfg = env.sandbox.__agPrismBridge.getConfig();
  assert.deepEqual([cfg.theme, cfg.mascot], ['warm', 'off']);
  assert.equal(env.doc.documentElement.getAttribute('data-prism-theme'), 'warm');
  assert.deepEqual(calls.filter(call => call.method !== 'GET'), []);
});

test('21. 临时 DSH_HOME 的新配置默认为 obsidian/whale，显式关闭可保存，历史设置按模式读取', async () => {
  const { resolveHostConfigPath, handlePrismApiRequest } = await import('../lib/index.js');
  assert.equal(process.env.DSH_HOME, testDshHome);
  assert.equal(resolveHostConfigPath(), testConfigPath, 'abort before invoking a writable route unless the path is isolated');
  assert.equal(fs.existsSync(testConfigPath), false);
  async function configRequest(method, config) {
    const req = { url: CONFIG_URL, method, headers: { host: 'localhost', origin: 'dsh-app://app' }, body: { config } };
    let status, payload;
    await handlePrismApiRequest(req, {
      writeHead(code) { status = code; },
      end(bytes) { payload = JSON.parse(String(bytes)); },
    });
    assert.equal(status, 200);
    assert.equal(payload.ok, true);
    assert.equal(payload.configPath, testConfigPath);
    return payload.config;
  }
  const defaults = await configRequest('GET');
  assert.deepEqual([defaults.theme, defaults.mascot], ['obsidian', 'whale']);
  assert.equal(fs.existsSync(testConfigPath), false, 'reading defaults must not create a settings file');
  await configRequest('POST', { theme: 'warm', mascot: 'off' });
  const saved = JSON.parse(fs.readFileSync(testConfigPath, 'utf8'));
  assert.deepEqual([saved.theme, saved.mascot], ['warm', 'off']);
  assert.deepEqual(await configRequest('GET'), saved);
  // Start at the on-disk boundary: sending a legacy value to POST alone would only test the writer.
  for (const [legacy, expected] of [['crab', 'whale'], ['minis', 'whale'], ['dual', 'orca'], ['off', 'off']]) {
    fs.writeFileSync(testConfigPath, JSON.stringify({ theme: 'alabaster', mascot: legacy }));
    const loaded = await configRequest('GET');
    assert.deepEqual([loaded.theme, loaded.mascot], ['alabaster', expected], `host file: ${legacy}`);
    await configRequest('POST', { accentTone: 'amber' });
    const persisted = JSON.parse(fs.readFileSync(testConfigPath, 'utf8'));
    assert.deepEqual([persisted.theme, persisted.mascot, persisted.accentTone], ['alabaster', expected, 'amber']);
  }
});

// ModelDirectoryState and the provider-authored names below are inputs, independent of the plugin.
const ROUTE = { provider: 'private-provider', model: 'atlas-private' };
const DEFAULT_NAME = 'Par défaut'; // v44.7 French model locale: effort.providerDefault.
const EFFORT_NAMES = [DEFAULT_NAME, 'Lecture rapide', 'Analyse approfondie'];
const CATALOG = [
  { id: 'other-provider', name: 'Other', models: [{ id: ROUTE.model, name: 'Another Atlas',
    reasoning: { defaultEffort: 'verbose', efforts: [{ id: 'verbose', name: 'Other provider only' }] } }] },
  { id: ROUTE.provider, name: 'Private', models: [
    { id: 'without-reasoning', name: 'Plain' },
    { id: ROUTE.model, name: 'Atlas Custom', reasoning: { efforts: [
      { id: 'quick-v2', name: EFFORT_NAMES[1] }, { id: 'deep-v2', name: EFFORT_NAMES[2] },
    ] } },
  ] },
];
function directorySnapshot(current = ROUTE) {
  return { current, groups: CATALOG, routable: true, failures: [], status: 'ready', pending: null, error: null };
}
function directoryFixture(snapshot = { current: null, routable: null, groups: [], failures: [], status: 'idle', pending: null, error: null }) {
  const listeners = new Set();
  const store = {
    getSnapshot: () => snapshot,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
  };
  return { store, get subscribers() { return listeners.size; }, publish(next) {
    snapshot = next;
    for (const notify of [...listeners]) notify();
  } };
}
function mountEffortSource(host, parent, sessionId, t) {
  const { component, meta } = host.entry(MODEL_OPTIONS);
  return host.mount(component, { sessionId, ...meta.inject(sessionId), t, locked: false, dismiss() {} }, parent);
}
function modelTranslation(key) {
  assert.equal(key, 'effort.providerDefault');
  return DEFAULT_NAME;
}

test('22. 可选模型服务与槽均就绪才注册，撤回、重复提供及卸载不影响另外两个槽', t => {
  const host = createClientHost(createMockBrowserEnv());
  t.after(() => host.dispose());
  const modelDirectories = { directoryFor: () => directoryFixture() };
  for (const slot of [SETTINGS, OVERLAY, MODEL_OPTIONS]) host.declare(slot);
  host.apply();
  const settings = host.entry(SETTINGS), overlay = host.entry(OVERLAY);
  const assertBaseOnly = () => {
    assert.equal(host.entries.length, 2);
    assert.equal(host.entry(SETTINGS), settings);
    assert.equal(host.entry(OVERLAY), overlay);
  };
  assertBaseOnly();
  host.service('modelDirectories', modelDirectories);
  const first = host.entry(MODEL_OPTIONS);
  assert.equal(first.meta.locale, 'model');
  host.declare(MODEL_OPTIONS);
  assert.equal(host.entry(MODEL_OPTIONS), first);
  host.service('modelDirectories', null);
  assertBaseOnly();
  host.withdraw(MODEL_OPTIONS);
  host.service('modelDirectories', modelDirectories);
  assertBaseOnly();
  host.declare(MODEL_OPTIONS);
  const second = host.entry(MODEL_OPTIONS);
  host.withdraw(SETTINGS); host.withdraw(OVERLAY);
  assert.deepEqual(host.entries, [second]);
  host.declare(SETTINGS); host.declare(OVERLAY);
  host.withdraw(MODEL_OPTIONS);
  assert.equal(host.entries.length, 2);
  host.declare(MODEL_OPTIONS);
  host.dispose();
  for (const slot of [MODEL_OPTIONS, SETTINGS, OVERLAY]) { host.withdraw(slot); host.declare(slot); }
  host.service('modelDirectories', null); host.service('modelDirectories', modelDirectories);
  assert.deepEqual(host.entries, [], 'disposed declarations do not come back with the model service');
  host.apply({ allowInject: false });
  assert.deepEqual(host.entries.map(e => e.meta.name).sort(), [SETTINGS, OVERLAY].sort());
  host.dispose(); host.apply();
  for (const slot of [SETTINGS, OVERLAY, MODEL_OPTIONS]) host.entry(slot);
  assert.equal(host.entries.length, 3);
});

test('23. 模型槽渲染会话订阅的 provider、model、当前 effort 与翻译名，换路由和卸载后无旧值', t => {
  const env = createMockBrowserEnv(), host = createClientHost(env);
  const a = directoryFixture(), b = directoryFixture(directorySnapshot({ provider: 'other-provider', model: ROUTE.model }));
  const sessions = new Map([['s-A', a], ['s-B', b]]), requested = [];
  host.service('modelDirectories', { directoryFor(sessionId) {
    requested.push(sessionId);
    assert.ok(sessions.has(sessionId), 'directoryFor must receive the rendered session');
    return sessions.get(sessionId);
  } });
  host.apply(); host.declare(MODEL_OPTIONS);
  t.after(() => host.dispose());
  const { meta } = host.entry(MODEL_OPTIONS);
  assert.equal(meta.locale, 'model');
  assert.equal(meta.inject('s-A').prismModelStore, a.store);
  assert.equal(meta.inject('s-B').prismModelStore, b.store);
  const paneA = add(env.doc.body, 'div'), paneB = add(env.doc.body, 'div');
  const unmountA = mountEffortSource(host, paneA, 's-A', modelTranslation);
  const unmountB = mountEffortSource(host, paneB, 's-B', modelTranslation);
  const marker = 'span[data-prism-native-efforts]';
  function source(pane) {
    const nodes = pane.querySelectorAll(marker);
    assert.equal(nodes.length, 1);
    const node = nodes[0];
    assert.equal(node.hidden, true);
    return [node.dataset.prismNativeProvider, node.dataset.prismNativeModel, node.dataset.prismNativeCurrent,
      JSON.parse(node.dataset.prismNativeEfforts)];
  }
  const expected = [{ id: null, label: DEFAULT_NAME }, { id: 'quick-v2', label: EFFORT_NAMES[1] }, { id: 'deep-v2', label: EFFORT_NAMES[2] }];
  const other = ['other-provider', ROUTE.model, 'verbose', [{ id: 'verbose', label: 'Other provider only' }]];
  assert.deepEqual(requested, ['s-A', 's-B', 's-A', 's-B']);
  assert.deepEqual([a.subscribers, b.subscribers], [1, 1]);
  assert.equal(paneA.querySelector(marker), null);
  assert.deepEqual(source(paneB), other);
  a.publish(directorySnapshot());
  assert.deepEqual(source(paneA), [ROUTE.provider, ROUTE.model, '', expected]);
  a.publish(directorySnapshot({ ...ROUTE, reasoningEffort: 'deep-v2' }));
  assert.deepEqual(source(paneA), [ROUTE.provider, ROUTE.model, 'deep-v2', expected]);
  a.publish(b.store.getSnapshot()); // Same model ID, different provider with an explicit default.
  assert.deepEqual(source(paneA), other);
  for (const model of ['without-reasoning', 'absent-model']) {
    a.publish(directorySnapshot({ ...ROUTE, model }));
    assert.equal(paneA.querySelector(marker), null);
    assert.deepEqual(source(paneB), other);
  }
  unmountA(); a.publish(directorySnapshot());
  assert.deepEqual([a.subscribers, b.subscribers], [0, 1]);
  assert.equal(paneA.querySelector(marker), null);
  assert.deepEqual(source(paneB), other);
  unmountB();
  assert.deepEqual([a.subscribers, b.subscribers], [0, 0]);
  assert.equal(paneB.querySelector(marker), null);
});

// Flush the host's batched pane render, MutationObserver and promise callbacks without calling widget internals.
async function flushMenuChanges(env) {
  for (let frame = 0; frame < 6; frame++) {
    env.tick(32);
    await flushBrowserJobs();
  }
}
function rootMenuFixture(t, afterNativeDrill) {
  const env = createMockBrowserEnv(), shell = createHostShell(env.doc), host = createClientHost(env);
  const directory = directoryFixture(directorySnapshot({ ...ROUTE, reasoningEffort: 'quick-v2' }));
  host.service('modelDirectories', { directoryFor(id) { assert.equal(id, 's-menu'); return directory; } });
  host.declare(MODEL_OPTIONS);
  const pane = { labels: [...EFFORT_NAMES], checked: 1, disabled: [] };
  const outsideClicks = [];
  const outside = add(env.doc.body, 'div', { id: 'unrelated-menu', role: 'menu' });
  const decoyList = add(outside, 'div', { class: 'scrollable' });
  for (const label of EFFORT_NAMES) {
    const decoy = add(decoyList, 'button', { type: 'button', role: 'menuitemradio', 'aria-checked': 'false' });
    add(add(decoy, 'span'), 'span', {}, label);
    decoy.addEventListener('click', () => outsideClicks.push(label));
  }
  const native = nativeModelSelect(shell, {
    modelTitle: 'Modèle', effortTitle: 'Effort', currentEffort: EFFORT_NAMES[1],
    mountOptions: outlet => mountEffortSource(host, outlet, 's-menu', modelTranslation),
    effortPane: () => pane,
    queueDrill: drill => env.sandbox.setTimeout(() => {
      drill();
      afterNativeDrill?.(native);
    }, 16),
    onEffortClick(label) {
      const id = CATALOG[1].models[1].reasoning.efforts.find(level => level.name === label)?.id;
      directory.publish(directorySnapshot({ ...ROUTE, reasoningEffort: id }));
      pane.checked = pane.labels.indexOf(label);
    },
  });
  host.apply();
  t.after(() => { native.close(); host.dispose(); });
  async function openRoot() {
    native.trigger.click();
    await flushMenuChanges(env);
    assert.equal(native.trigger.getAttribute('aria-expanded'), 'true');
    assert.ok(native.menu.querySelector(`[data-slot="${MODEL_OPTIONS}"] span[data-prism-native-efforts]`)?.hidden);
    assert.equal(native.menu.querySelector('button[role="menuitemradio"]'), null, 'the native effort radios only exist after drilling');
    const track = liveSlider(env);
    assert.ok(track && native.menu.contains(track), 'opening the associated native model menu must put the slider on its root pane');
    return track;
  }
  return { env, host, directory, native, pane, outsideClicks, openRoot };
}

test('24. 原生模型根菜单立即显示宿主真实档名，拖动松手才经原生推理项点击匹配 radio 一次', async t => {
  const { env, directory, native, pane, outsideClicks, openRoot } = rootMenuFixture(t);
  // The radio list arrives later and in a different order. Its labels, rather than its indexes, identify choices.
  pane.labels = [EFFORT_NAMES[2], DEFAULT_NAME, EFFORT_NAMES[1]];
  pane.checked = 2;
  const track = await openRoot();
  assert.equal(
    native.menu.querySelector('span[data-prism-native-efforts]')?.prismSelectEffort,
    undefined,
    'without a directory.select service the historical DOM fallback remains active'
  );
  assert.equal(directory.subscribers, 1);
  const buttons = slider => slider.closest(SLIDER).querySelectorAll('button').filter(b => !b.hidden && !b.disabled);
  assert.deepEqual(buttons(track).map(b => b.textContent), EFFORT_NAMES);
  assert.equal(track.getAttribute('aria-valuetext'), EFFORT_NAMES[1]);
  const knob = track.closest(SLIDER).querySelector('.dsh-effort-knob');
  knob.offsetWidth = 24;
  track.clientWidth = 320;
  pointer(env, track, 'pointerdown', 0.5);
  pointer(env, track, 'pointermove', 0.16);
  const draggedLeft = Number.parseFloat(knob.style.left);
  assert.ok(draggedLeft > 1 && draggedLeft < 90,
    `knob must follow the pointer continuously instead of snapping to a tier: ${knob.style.left}`);
  env.tick(16);
  const fill16 = Number.parseFloat(track.closest(SLIDER).getAttribute('data-fill-ratio'));
  pointer(env, track, 'pointermove', 0.32);
  env.tick(16);
  const fill32 = Number.parseFloat(track.closest(SLIDER).getAttribute('data-fill-ratio'));
  assert.ok(fill32 > fill16,
    `the painted energy fill must follow the moving knob: ${fill16} -> ${fill32}`);
  const widget = track.closest(SLIDER);
  const tickRatios = widget.getAttribute('data-tick-ratios').split(',').map(Number);
  assert.equal(tickRatios.length, EFFORT_NAMES.length, 'one tick per real reasoning tier');
  assert.ok(tickRatios[0] < 0.1 && tickRatios.at(-1) > 0.95,
    `tier ticks must span the movable knob range: ${tickRatios.join(',')}`);
  const shownAt32 = Number(widget.getAttribute('data-knob-position'));
  const expectedFill32 = (12 + (320 - 24) * shownAt32 + 12 * shownAt32 ** 8) / 320;
  assert.ok(Math.abs(fill32 - expectedFill32) < 0.002,
    `energy edge must stay aligned to the knob center: ${fill32} vs ${expectedFill32}`);
  pointer(env, track, 'pointermove', 0);
  assert.equal(track.getAttribute('aria-valuetext'), DEFAULT_NAME);
  pointer(env, track, 'pointermove', 1);
  await flushMenuChanges(env);
  assert.equal(track.getAttribute('aria-valuetext'), EFFORT_NAMES[2]);
  assert.deepEqual(native.trace, [], 'pointer preview must leave the native root pane and selection untouched');
  assert.equal(directory.store.getSnapshot().current.reasoningEffort, 'quick-v2');
  pointer(env, track, 'pointerup', 1);
  await flushMenuChanges(env);
  pointer(env, track, 'pointerup', 1);
  await flushMenuChanges(env);
  assert.deepEqual(native.trace, ['drill:effort', `radio:effort:${EFFORT_NAMES[2]}`]);
  assert.deepEqual(native.clicks, [{ pane: 'effort', label: EFFORT_NAMES[2] }]);
  assert.equal(directory.store.getSnapshot().current.reasoningEffort, 'deep-v2');
  assert.equal(directory.subscribers, 0);
  assert.equal(native.trigger.getAttribute('aria-expanded'), 'false');
  const fresh = await openRoot();
  assert.equal(fresh.getAttribute('aria-valuetext'), EFFORT_NAMES[2]);
  buttons(fresh).find(b => b.textContent === DEFAULT_NAME).click();
  await flushMenuChanges(env);
  assert.deepEqual(native.trace, ['drill:effort', `radio:effort:${EFFORT_NAMES[2]}`, 'drill:effort', `radio:effort:${DEFAULT_NAME}`]);
  assert.equal(directory.store.getSnapshot().current.reasoningEffort, undefined);
  assert.deepEqual(outsideClicks, []);
});

test('24b. 模型页与推理页均显示可点击返回键，并通过原生 Escape 退回首层', async t => {
  const { env, native, openRoot } = rootMenuFixture(t);
  await openRoot();
  const findRootRow = label => Array.from(native.menu.querySelectorAll('button[role="menuitem"]'))
    .find(button => button.textContent.includes(label));
  const assertRoot = () => {
    assert.equal(native.menu.getAttribute('role'), 'menu');
    assert.ok(findRootRow('Modèle'));
    assert.ok(findRootRow('Effort'));
    assert.equal(native.menu.querySelector('[data-prism-menu-back]'), null);
  };

  const modelRow = findRootRow('Modèle');
  assert.ok(modelRow);
  modelRow.click();
  await flushMenuChanges(env);
  assert.equal(native.menu.getAttribute('role'), 'group');
  const modelBack = native.menu.querySelector('[data-prism-menu-back]');
  assert.ok(modelBack, 'model page needs a visible back control');
  assert.equal(modelBack.getAttribute('data-pane'), 'model');
  modelBack.click();
  await flushMenuChanges(env);
  assertRoot();

  const effortRow = findRootRow('Effort');
  assert.ok(effortRow);
  effortRow.click();
  await flushMenuChanges(env);
  assert.equal(native.menu.querySelectorAll('button[role="menuitemradio"]').length, EFFORT_NAMES.length);
  const effortBack = native.menu.querySelector('[data-prism-menu-back]');
  assert.ok(effortBack, 'effort page needs a visible back control');
  assert.equal(effortBack.getAttribute('data-pane'), 'effort');
  effortBack.click();
  await flushMenuChanges(env);
  assertRoot();
});

test('25. 根页公开的目标若在原生推理页消失或禁用，不改选同序选项、模型或其他菜单', async t => {
  const { env, directory, native, pane, outsideClicks, openRoot } = rootMenuFixture(t);
  for (const disabled of [false, true]) {
    pane.labels = [DEFAULT_NAME, EFFORT_NAMES[1], disabled ? EFFORT_NAMES[2] : 'Remplacement'];
    pane.disabled = disabled ? [2] : [];
    const track = await openRoot();
    const start = native.trace.length;
    pointer(env, track, 'pointerdown', 0.5); pointer(env, track, 'pointermove', 1); pointer(env, track, 'pointerup', 1);
    await flushMenuChanges(env);
    assert.deepEqual(native.trace.slice(start), ['drill:effort']);
    assert.ok(native.rows.length, 'the host actually rendered its new choices');
    assert.deepEqual(native.clicks, []);
    assert.equal(directory.store.getSnapshot().current.reasoningEffort, 'quick-v2');
    native.close();
    await flushMenuChanges(env);
  }
  await openRoot();
  native.menu.querySelectorAll('button[role="menuitem"]')[0].click();
  await flushMenuChanges(env);
  assert.equal(native.menu.getAttribute('role'), 'group');
  assert.deepEqual(native.rows.map(b => b.textContent), ['Low', 'High']);
  assert.equal(liveSlider(env), undefined, 'model names that look like efforts are ordinary native model options');
  assert.deepEqual(outsideClicks, []);
});

test('26. 仅标记拥有 DraftEditor 的卡片，未绑定 Lexical 的只读输入可用，排除覆盖层、textarea 和聊天消息仿件', t => {
  const env = createMockBrowserEnv(), { doc } = env, host = createHostShell(doc);
  const marker = 'data-prism-composer';
  host.editor.setAttribute('contenteditable', 'false');
  host.editor.setAttribute('aria-disabled', 'true');
  host.editor.removeAttribute('data-lexical-editor');
  const textareaCard = host.makeComposer();
  textareaCard.editor.remove();
  const textarea = add(textareaCard.scroll, 'textarea');
  textarea.value = '保持原草稿';
  const overlayCard = host.makeComposer();
  overlayCard.overlay.appendChild(overlayCard.scroll);
  const flow = add(host.main, 'div', { 'data-chat-flow': '' });
  const history = add(flow, 'div', { 'data-chat-history': 'more' });
  const loadMore = add(history, 'button', { type: 'button' }, 'Load earlier');
  const message = add(flow, 'div', { 'data-chat-flow-kind': 'user' });
  const mimic = host.makeComposer(message);
  const mimicFrame = add(message, 'div', { class: 'mP3x-q_frame' });
  const mimicSide = add(mimicFrame, 'div', { class: 'mP3x-q_sidebarCol' });
  add(mimicSide, 'button', { 'data-sidebar-toggle': '' });
  const wrappedSide = add(add(host.frame, 'div'), 'div', { class: 'mP3x-q_sidebarCol' });
  const wrongTag = add(host.frame, 'aside', { class: 'mP3x-q_sidebarCol' });
  for (const decoy of [wrappedSide, wrongTag]) add(decoy, 'button', { 'data-sidebar-toggle': '' });
  bootBundle(t, env);
  function marks(owned) {
    env.tick(200);
    assert.equal(host.card.getAttribute(marker), owned ? '1' : null, 'a resident read-only textbox identifies its own card');
    assert.equal(doc.querySelectorAll(`[${marker}]`).length, Number(owned));
    for (const decoy of [textareaCard.card, overlayCard.card, mimic.card, textarea, host.editor]) {
      assert.equal(decoy.hasAttribute(marker), false);
    }
    assert.equal(host.sideCol.getAttribute('data-prism-sidebar'), '1');
    assert.equal(doc.querySelectorAll('[data-prism-sidebar]').length, 1);
    for (const side of [mimicSide, wrappedSide, wrongTag]) assert.equal(side.hasAttribute('data-prism-sidebar'), false);
    assert.deepEqual([host.editor.getAttribute('contenteditable'), host.editor.getAttribute('aria-disabled')], ['false', 'true']);
    assert.equal(host.editor.hasAttribute('data-lexical-editor'), false);
    assert.equal(textarea.value, '保持原草稿');
    assert.equal(loadMore.parentElement, history);
  }
  marks(true);
  host.overlay.appendChild(host.scroll); // The same subtree now belongs to an overlay control.
  marks(false);
  host.card.appendChild(host.scroll);
  marks(true);
});

test('27. 四主题注入的实际样式按 DOM 标记为输入卡片提供玻璃背景，为原生侧栏提供半像素分割线', t => {
  const env = createMockBrowserEnv(), { doc } = env;
  const shell = createHostShell(doc), client = createClientHost(env);
  t.after(() => client.dispose());
  client.apply();
  const style = doc.getElementById('dsh-obsidian-prism-styles');
  assert.ok(style?.isConnected);
  // Match the shipped style against the live fixture for the few surface declarations at issue.
  const css = style.textContent.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
  function important(element, property) {
    const declaration = new RegExp(`(?:^|;)\\s*${property}\\s*:\\s*([^;{}]+?)\\s*!important\\s*(?:;|$)`, 'i');
    const matches = [];
    for (const [, selector, block] of rules) {
      const match = declaration.exec(block);
      if (match && element.matches(selector)) matches.push(match[1].trim());
    }
    return matches.at(-1);
  }
  const bridge = env.sandbox.__agPrismBridge;
  const alias = '--dsw-alias-bg-composer', surface = '--dsw-specific-input-major';
  for (const [theme, rgba] of [
    ['obsidian', [20, 21, 26, 0.94]], ['warm', [28, 27, 25, 0.95]],
    ['crystal', [255, 255, 255, 0.94]], ['alabaster', [255, 255, 255, 0.94]],
  ]) {
    bridge.setConfig({ theme });
    env.tick(200);
    assert.equal(doc.documentElement.getAttribute('data-prism-theme'), theme);
    for (const el of [doc.documentElement, doc.body]) {
      const fill = /^rgba\(([^()]*)\)$/.exec(important(el, alias));
      assert.deepEqual(fill?.[1].split(',').map(Number), rgba, `${theme} on ${el.tagName}`);
    }
    assert.equal(important(shell.root, alias), 'inherit');
    assert.equal(important(shell.card, surface), `var(${alias})`);
    const composerBackground = important(shell.card, 'background');
    assert.doesNotMatch(composerBackground, /linear-gradient\(90deg, var\(--ag-prism-cobalt/,
      'composer should not paint a permanent rainbow neon strip when the pointer is away');
    assert.match(composerBackground, /var\(--ag-cs-sheen\)/);
    assert.match(composerBackground, /var\(--dsw-specific-input-major\)/);
    assert.equal(important(shell.sideCol, 'border-right'), '0.5px solid var(--dsw-alias-border-l2)');
  }
  bridge.setConfig({ composerRestyle: false, sidebarRestyle: false });
  env.tick(200);
  assert.equal(important(shell.card, surface), undefined);
  assert.notEqual(important(shell.sideCol, 'border-right'), '0.5px solid var(--dsw-alias-border-l2)');
});

test('28. 原生推理 radio 分批出现时只提交一次，等待期间切换模型会撤销原选择', async t => {
  let delayedLabel = EFFORT_NAMES[2], publishRow;
  const { env, native, directory, outsideClicks, openRoot } = rootMenuFixture(t, select => {
    const row = select.rows.find(button => button.textContent === delayedLabel);
    assert.ok(row, 'the deferred row has the native click handler');
    const list = row.parentElement;
    row.remove();
    publishRow = () => list.appendChild(row);
  });
  async function chooseDeep() {
    const track = await openRoot();
    track.closest(SLIDER).querySelectorAll('button').find(b => b.textContent === EFFORT_NAMES[2]).click();
    await flushMenuChanges(env);
    assert.equal(native.menu.querySelectorAll('button[role="menuitemradio"]').length, 2);
    assert.deepEqual(native.clicks, [], 'wait for both the selected radio and the target radio');
  }
  await chooseDeep();
  const badge = native.trigger.querySelector('[data-provider-id][data-model-id]');
  const originalModel = badge.dataset.modelId;
  badge.setAttribute('data-model-id', 'other-route');
  publishRow();
  await flushMenuChanges(env);
  assert.deepEqual(native.trace, ['drill:effort']);
  assert.equal(directory.store.getSnapshot().current.reasoningEffort, 'quick-v2');
  native.close();
  badge.setAttribute('data-model-id', originalModel);
  await flushMenuChanges(env);

  delayedLabel = EFFORT_NAMES[1]; // This time the target is present before the checked option.
  await chooseDeep();
  publishRow();
  await flushMenuChanges(env);
  env.tick(1500);
  assert.deepEqual(native.trace, ['drill:effort', 'drill:effort', `radio:effort:${EFFORT_NAMES[2]}`]);
  assert.deepEqual(native.clicks, [{ pane: 'effort', label: EFFORT_NAMES[2] }]);
  assert.equal(directory.store.getSnapshot().current.reasoningEffort, 'deep-v2');
  assert.deepEqual(outsideClicks, []);
});

test('29. 根菜单 marker 经原生 directory.select 提交一次，菜单保持且最高档仍为活动星空轨道', async t => {
  const { env, directory, native, outsideClicks, openRoot } = rootMenuFixture(t);
  const requests = [];
  directory.select = async selection => {
    requests.push({ ...selection });
    directory.publish(directorySnapshot({ ...ROUTE, reasoningEffort: selection.reasoningEffort }));
    return { ok: true };
  };
  const track = await openRoot();
  const menu = native.menu;
  const marker = menu.querySelector('span[data-prism-native-efforts]');
  assert.equal(typeof marker?.prismSelectEffort, 'function', 'the real slot exposes the captured native service');
  const wrap = track.closest(SLIDER);
  const knob = wrap.querySelector('.dsh-effort-knob');
  knob.offsetWidth = 24;
  track.clientWidth = 320;
  const choose = label => {
    const button = wrap.querySelectorAll('button[data-effort-idx]').find(item => item.textContent === label);
    assert.ok(button, `missing native tier ${label}`);
    button.click();
  };

  choose(DEFAULT_NAME);
  const motionFrames = [];
  for (let frame = 0; frame < 12; frame++) {
    motionFrames.push(Number.parseFloat(knob.style.left));
    env.tick(16);
  }
  assert.ok(new Set(motionFrames.map(value => Math.round(value * 10) / 10)).size >= 5,
    'label/keyboard/programmatic tier changes must move through visible intermediate frames');
  assert.ok(Math.max(...motionFrames) > 1 && Math.abs(motionFrames.at(-1)) < 5,
    'the animated knob should approach the provider-default tier through non-zero intermediate positions');
  await flushMenuChanges(env);
  assert.deepEqual(requests, [{ provider: ROUTE.provider, model: ROUTE.model }],
    'provider-default selection uses the same directory action without a synthetic tier');
  assert.equal(native.menu, menu, 'the root portal must not be dismissed or replaced');
  assert.equal(native.trigger.getAttribute('aria-expanded'), 'true');
  assert.ok(menu.contains(track), 'the slider stays attached to the open root menu');
  assert.deepEqual(native.trace, [], 'the plugin must not drill into the native effort pane');
  assert.deepEqual(native.clicks, [], 'the plugin must not click a native radio/radio replacement');
  assert.equal(directory.store.getSnapshot().current.reasoningEffort, undefined);

  choose(DEFAULT_NAME);
  await flushMenuChanges(env);
  assert.equal(requests.length, 1, 'selecting the already-active tier is a no-op');

  choose(EFFORT_NAMES[2]);
  await flushMenuChanges(env);
  assert.deepEqual(requests.at(-1), {
    provider: ROUTE.provider, model: ROUTE.model, reasoningEffort: 'deep-v2',
  });
  assert.equal(requests.length, 2, 'consecutive Low-to-Max-style choices each commit exactly once');
  assert.equal(native.menu, menu);
  assert.equal(native.trigger.getAttribute('aria-expanded'), 'true');
  assert.ok(menu.contains(track));
  assert.deepEqual(native.trace, []);
  assert.deepEqual(native.clicks, []);
  assert.equal(wrap.getAttribute('data-track-style'), 'starry', 'the highest ordinary tier is not a fixed crystal rock');
  assert.equal(wrap.getAttribute('data-orchestrator'), '0');
  assert.equal(track.getAttribute('aria-valuetext'), EFFORT_NAMES[2]);
  assert.deepEqual(outsideClicks, []);
});

test('30. directory.select 返回 false 或抛错时拒绝选择且绝不退化为会关闭面板的 DOM click', async t => {
  const { env, directory, native, outsideClicks, openRoot } = rootMenuFixture(t);
  const requests = [];
  let behavior = 'false';
  directory.select = selection => {
    requests.push({ ...selection });
    if (behavior === 'throw') throw new Error('native writer unavailable');
    return false;
  };
  const track = await openRoot();
  const menu = native.menu;
  const chooseLast = () => {
    const button = track.closest(SLIDER).querySelectorAll('button[data-effort-idx]')
      .find(item => item.textContent === EFFORT_NAMES[2]);
    assert.ok(button);
    button.click();
  };
  function assertRejected() {
    assert.equal(native.menu, menu);
    assert.equal(native.trigger.getAttribute('aria-expanded'), 'true');
    assert.ok(menu.contains(track));
    assert.deepEqual(native.trace, [], 'no drill');
    assert.deepEqual(native.clicks, [], 'no native radio click');
    assert.equal(directory.store.getSnapshot().current.reasoningEffort, 'quick-v2');
    assert.deepEqual(outsideClicks, []);
  }

  chooseLast();
  await flushMenuChanges(env);
  assert.equal(requests.length, 1);
  assertRejected();

  behavior = 'throw';
  chooseLast();
  await flushMenuChanges(env);
  assert.equal(requests.length, 2);
  assertRejected();
});

test('31. bubbleRestyle 只美化用户气泡，助手正文保持 p2 式无边界且不进入 reasoning', t => {
  const env = createMockBrowserEnv(), shell = createHostShell(env.doc), client = createClientHost(env);
  t.after(() => client.dispose());
  const flow = add(shell.main, 'div', { 'data-chat-flow': '' });
  const userRow = add(flow, 'div', { 'data-chat-flow-kind': 'user' });
  const userBubble = add(userRow, 'div', {
    'data-message-bubble': '', 'data-text-interaction-source': 'text',
  }, '用户消息');
  const assistant = add(flow, 'div', { 'data-chat-flow-kind': 'assistant-step' });
  const assistantBody = add(assistant, 'div', { class: 'xMeOpW_body' });
  const assistantMarkdown = add(assistantBody, 'div', { class: '_markdown_13jw0_5' }, '助手正文');
  const reasoning = add(flow, 'div', {
    'data-chat-flow-kind': 'assistant-step', 'data-chat-group-part': 'reasoning',
  });
  const reasoningBody = add(reasoning, 'div', { class: 'xMeOpW_body' });
  const reasoningMarkdown = add(reasoningBody, 'div', { class: '_markdown_13jw0_5' }, '推理正文');

  client.apply();
  env.tick(200);
  const root = env.doc.getElementById('root');
  const style = env.doc.getElementById('dsh-obsidian-prism-styles');
  assert.ok(style?.isConnected);
  const css = style.textContent.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
  function ruleValue(element, property) {
    const declaration = new RegExp(`(?:^|;)\\s*${property}\\s*:\\s*([^;{}]+?)\\s*(?:!important)?\\s*(?:;|$)`, 'i');
    const matches = [];
    for (const [, selector, block] of rules) {
      const match = declaration.exec(block);
      if (match && element.matches(selector)) matches.push(match[1].trim());
    }
    return matches.at(-1);
  }
  function styled() {
    assert.equal(root.getAttribute('data-prism-bubbles'), '1');
    assert.match(
      ruleValue(userBubble, 'background-color') || '',
      /--dsw-specific-bubble[\s\S]*--ag-cs-smoke-user-fill/
    );
    assert.match(ruleValue(userBubble, 'border'), /--ag-cs-smoke-edge/);
    assert.equal(ruleValue(assistantMarkdown, 'background'), 'transparent');
    assert.equal(ruleValue(assistantMarkdown, 'border'), '0');
    assert.equal(ruleValue(assistantMarkdown, 'border-radius'), '0');
    assert.equal(ruleValue(assistantMarkdown, 'box-shadow'), 'none');
    assert.equal(ruleValue(assistantMarkdown, 'padding'), '0');
    assert.equal(ruleValue(reasoningMarkdown, 'background-color'), undefined,
      'reasoning text must retain the native DSH presentation');
  }

  styled();
  for (const bubbleRestyle of [false, 'off']) {
    env.sandbox.__agPrismBridge.setConfig({ bubbleRestyle });
    env.tick(200);
    assert.equal(root.hasAttribute('data-prism-bubbles'), false, String(bubbleRestyle));
    assert.equal(ruleValue(userBubble, 'background-color'), undefined);
    assert.equal(ruleValue(assistantMarkdown, 'background'), undefined);
  }
  env.sandbox.__agPrismBridge.setConfig({ bubbleRestyle: true });
  env.tick(200);
  styled();
});

test('32. 原生目录异步提交期间推理条保持目标档位，不闪回旧档位', async t => {
  const { env, directory, native, openRoot } = rootMenuFixture(t);
  let settle;
  const requests = [];
  directory.select = selection => {
    requests.push({ ...selection });
    return new Promise(resolve => {
      settle = () => {
        directory.publish(directorySnapshot({ ...ROUTE, reasoningEffort: selection.reasoningEffort }));
        resolve({ ok: true });
      };
    });
  };
  const track = await openRoot();
  const menu = native.menu;
  track.rect = { left: 10, top: 10, width: 200, height: 28, right: 210, bottom: 38, x: 10, y: 10 };
  const wrap = track.closest(SLIDER);
  pointer(env, track, 'pointerdown', 0.99);
  pointer(env, track, 'pointerup', 0.99);
  await flushBrowserJobs();
  assert.equal(requests.length, 1);
  assert.equal(track.getAttribute('aria-valuetext'), EFFORT_NAMES[2], 'released position remains at the target tier');
  assert.equal(wrap.getAttribute('data-effort'), 'deep-v2');
  assert.equal(wrap.getAttribute('data-preview-effort'), 'deep-v2');
  assert.equal(native.menu, menu, 'native menu survives the pending directory action');
  assert.equal(native.trigger.getAttribute('aria-expanded'), 'true');
  settle();
  await flushMenuChanges(env);
  assert.equal(track.getAttribute('aria-valuetext'), EFFORT_NAMES[2]);
  assert.equal(wrap.getAttribute('data-effort'), 'deep-v2');
  assert.equal(wrap.getAttribute('data-preview-effort'), null);
  assert.equal(requests.length, 1);
});

test('33. Home Studio 在 blank/hero 挂载、active 隐藏，配置与无数据空态安全', t => {
  const env = createMockBrowserEnv(), { doc } = env;
  loadBrowserModule(env, 'src/home-studio-panel.js');
  const api = env.sandbox.DSHPrismHomeStudio;
  assert.ok(api);
  const bridge = createModuleBridge({ homeLayout: 'studio', language: 'zh-CN' });
  const root = add(doc.body, 'div', { id: 'root' });
  const content = add(root, 'div', {
    'data-conversation-content': '',
    'data-content-phase': 'blank',
    'data-conversation-session': 'home-session',
  });
  const scroll = add(content, 'div', { 'data-conversation-scroll': '' });
  const composer = add(scroll, 'div', {
    'data-composer-seat': '',
    'data-conversation-region': 'composer',
  });
  const studio = api.init(bridge);
  t.after(() => api.destroy());
  env.tick(180);

  let panel = studio.getElement();
  assert.ok(panel?.isConnected, 'blank/hero 首页必须挂载 Studio');
  assert.ok(scroll.contains(panel), 'Studio 必须在首页滚动区域');
  assert.equal(studio.getState().visible, true);
  assert.equal(studio.getState().hasData, false);
  assert.equal(studio.getState().phase, 'blank');
  assert.equal(panel.getAttribute('data-empty'), 'true');
  assert.equal(panel.getAttribute('data-source'), 'none');
  assert.match(panel.textContent, /还没有可展示的用量数据/);

  content.setAttribute('data-content-phase', 'hero');
  env.tick(180);
  assert.equal(studio.getState().phase, 'hero');
  assert.equal(studio.getState().visible, true);

  content.setAttribute('data-content-phase', 'active');
  env.tick(180);
  assert.equal(studio.getState().visible, false);
  assert.equal(content.querySelector('[data-prism-home-studio]'), null);

  content.setAttribute('data-content-phase', 'blank');
  env.tick(180);
  assert.equal(studio.getState().visible, true);

  bridge.setConfig({ homeLayout: 'classic' });
  studio.sync();
  env.tick(180);
  assert.equal(studio.getState().visible, false, 'classic 只关闭 Studio，不应保留仪表盘');
  bridge.setConfig({ homeLayout: 'off' });
  studio.sync();
  env.tick(180);
  assert.equal(studio.getState().visible, false, 'off 必须关闭 Studio');
  bridge.setConfig({ homeLayout: 'studio' });
  studio.sync();
  env.tick(180);
  assert.equal(studio.getState().visible, true);

  assert.equal(composer.parentElement, scroll, '挂载 Studio 不能移动或包裹 Composer');
  studio.destroy();
  api.destroy();
  assert.equal(doc.querySelector('[data-prism-home-studio]'), null);
});

test('34. HomeRipple 调 optics.mountRipple/dispose，支持安全 fallback 与关闭门控', t => {
  const env = createMockBrowserEnv(), { doc } = env;
  const content = add(doc.body, 'div', {
    'data-conversation-content': '',
    'data-content-phase': 'blank',
  });
  loadBrowserModule(env, 'src/home-ripple-host.js');
  const api = env.sandbox.DSHPrismHomeRipple;
  assert.ok(api);
  const mounts = [];
  let disposed = 0;
  env.sandbox.DSHPrismOptics = {
    mountRipple(anchor, options) {
      let disturbed = 0;
      const mount = {
        dispose() {
          disposed += 1;
        },
        disturbNormalized() {
          disturbed += 1;
        },
        isSleeping() {
          return true;
        },
      };
      mounts.push({ anchor, options, mount, get disturbed() { return disturbed; } });
      return mount;
    },
  };
  const bridge = createModuleBridge({
    homeLayout: 'studio',
    homeRipple: true,
    motionLevel: 'ultra',
    ambientIntensity: '100',
  });
  const ripple = api.init(bridge);
  t.after(() => api.destroy());
  env.tick(140);
  assert.equal(mounts.length, 1);
  let host = doc.querySelector('[data-prism-home-ripple-anchor]');
  assert.ok(host && content.contains(host));
  assert.equal(host.getAttribute('data-prism-home-ripple-state'), 'active');
  assert.equal(ripple.getState().allowed, true);

  bridge.setConfig({ homeRipple: false });
  ripple.sync();
  env.tick(140);
  assert.equal(doc.querySelector('[data-prism-home-ripple-anchor]'), null);
  assert.equal(disposed, 1);

  bridge.setConfig({ homeLayout: 'classic', homeRipple: true });
  ripple.sync();
  env.tick(140);
  assert.equal(mounts.length, 2, 'classic 首页仍允许波纹');
  host = doc.querySelector('[data-prism-home-ripple-anchor]');
  assert.ok(host && content.contains(host));

  bridge.setConfig({ homeLayout: 'off' });
  ripple.sync();
  env.tick(140);
  assert.equal(doc.querySelector('[data-prism-home-ripple-anchor]'), null);
  assert.equal(disposed, 2, 'off 必须释放光学 mount');

  bridge.setConfig({ homeLayout: 'studio', homeRipple: true });
  ripple.sync();
  env.tick(140);
  assert.equal(mounts.length, 3);
  ripple.destroy();
  assert.equal(doc.querySelector('[data-prism-home-ripple-anchor]'), null);
  assert.equal(disposed, 3);
  api.destroy();

  // Older hosts expose only the nested interactive-ripple API.
  const fallbackEnv = createMockBrowserEnv();
  const fallbackContent = add(fallbackEnv.doc.body, 'div', {
    'data-conversation-content': '',
    'data-content-phase': 'hero',
  });
  loadBrowserModule(fallbackEnv, 'src/home-ripple-host.js');
  let fallbackCalls = 0, fallbackDisposed = 0;
  fallbackEnv.sandbox.DSHPrismOptics = {
    ripple: {
      mountInteractiveRipple(anchor) {
        fallbackCalls += 1;
        assert.equal(anchor.getAttribute('data-prism-home-ripple-anchor'), '1');
        return { dispose() { fallbackDisposed += 1; } };
      },
    },
  };
  const fallbackApi = fallbackEnv.sandbox.DSHPrismHomeRipple;
  const fallbackBridge = createModuleBridge({ homeLayout: 'studio', homeRipple: true });
  const fallback = fallbackApi.init(fallbackBridge);
  fallbackEnv.tick(140);
  assert.equal(fallbackCalls, 1);
  assert.ok(fallbackContent.querySelector('[data-prism-home-ripple-anchor]'));
  fallback.destroy();
  fallbackEnv.tick(20);
  assert.equal(fallbackDisposed, 1);
  assert.equal(fallbackContent.querySelector('[data-prism-home-ripple-anchor]'), null);
  fallbackApi.destroy();
});

test('35. Responsive Workbench 五阶工具栏、滚底模式、侧栏 More 与 destroy 清理', t => {
  const env = createMockBrowserEnv(), { doc } = env;
  const shell = createHostShell(doc);
  const originalNav = [];
  for (let i = 0; i < 5; i += 1) {
    originalNav.push(add(shell.nav, 'button', { type: 'button', 'data-test-nav': String(i) }, `Nav ${i}`));
  }
  loadBrowserModule(env, 'src/responsive-workbench.js');
  const api = env.sandbox.DSHPrismResponsiveWorkbench;
  assert.ok(api);
  const bridge = createModuleBridge({
    motionLevel: 'ultra',
    scrollBottomMotion: 'smooth',
    sidebarRestyle: true,
    sidebarNavFold: 'on',
  });
  const workbench = api.init(bridge);
  t.after(() => api.destroy());
  shell.card.clientWidth = 720;
  shell.card.offsetWidth = 720;
  env.tick(100);

  assert.equal(doc.documentElement.getAttribute('data-prism-scroll-bottom-motion'), 'smooth');
  assert.equal(doc.documentElement.getAttribute('data-prism-sidebar-nav-fold'), 'on');
  for (const [width, tier] of [[720, '0'], [640, '1'], [560, '2'], [480, '3'], [400, '4'], [392, '5']]) {
    shell.card.clientWidth = width;
    shell.card.offsetWidth = width;
    workbench.refresh();
    env.tick(48);
    assert.equal(shell.card.getAttribute('data-prism-toolbar-tier'), tier, `width ${width}`);
  }

  const more = shell.nav.querySelector('[data-prism-nav-more]');
  assert.ok(more, 'sidebarNavFold=on 必须显示 More');
  assert.equal(shell.nav.querySelectorAll('[data-prism-nav-hidden]').length, 2);
  assert.deepEqual(
    originalNav.map((node, index) => shell.nav.children[index] === node),
    [true, true, true, true, true],
    'React 侧栏 children 的节点身份与顺序不能改变'
  );
  more.click();
  env.tick(48);
  assert.equal(more.getAttribute('aria-expanded'), 'true');
  assert.equal(shell.nav.querySelectorAll('[data-prism-nav-hidden]').length, 0);

  bridge.setConfig({ scrollBottomMotion: 'instant', sidebarNavFold: 'off' });
  env.tick(120);
  assert.equal(doc.documentElement.getAttribute('data-prism-scroll-bottom-motion'), 'instant');
  assert.equal(shell.nav.querySelector('[data-prism-nav-more]'), null);
  assert.equal(shell.nav.querySelectorAll('[data-prism-nav-hidden]').length, 0);

  workbench.destroy();
  assert.equal(shell.card.hasAttribute('data-prism-toolbar-tier'), false);
  assert.equal(shell.nav.querySelector('[data-prism-nav-more]'), null);
  assert.equal(doc.documentElement.hasAttribute('data-prism-responsive-workbench'), false);
  assert.deepEqual(
    originalNav.map((node, index) => shell.nav.children[index] === node),
    [true, true, true, true, true],
    'destroy 不能删除或重排 React children'
  );
});

test('36. NativeIcons 21 模板、模型品牌切换、copy-check 与 destroy 清理', t => {
  const env = createMockBrowserEnv(), { doc } = env;
  const cases = [
    ['deepseek', 'DeepSeek-V4.1-Flash'],
    ['claude', 'Claude Sonnet'],
    ['openai', 'GPT-5'],
    ['gemini', 'Gemini 2.5 Pro'],
  ];
  const models = cases.map(([provider, label]) => {
    const { trigger, model } = addModelTrigger(doc.body, label, label.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    model.setAttribute('data-provider-id', provider);
    return { provider, label, trigger, model };
  });
  const copy = add(doc.body, 'button', { type: 'button', 'aria-label': '复制', title: '复制' }, '复制');
  const send = add(doc.body, 'button', { type: 'button', 'aria-label': '发送消息' });
  const plus = add(doc.body, 'button', { type: 'button', 'aria-label': '添加文件', 'aria-expanded': 'false' });
  let commandPanel = null;
  plus.addEventListener('click', () => {
    if (commandPanel) return; // Native host opens the panel but does not toggle it closed.
    commandPanel = add(doc.body, 'div', { role: 'listbox' },
      'file goal plan feedback compact permission model export');
    plus.setAttribute('aria-expanded', 'true');
  });
  doc.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !commandPanel) return;
    commandPanel.remove();
    commandPanel = null;
    plus.setAttribute('aria-expanded', 'false');
  });
  loadBrowserModule(env, 'src/prism-native-icons.js');
  const api = env.sandbox.DSHPrismNativeIcons;
  assert.ok(api);
  assert.equal(api.ICON_NAMES.length, 21);
  assert.equal(api.ALL_ICON_NAMES.length, 23);
  const nativeIconCss = readText('src/prism-native-icons.css');
  assert.match(nativeIconCss,
    />\s*:is\(\[data-icon\], \[class\*="icon"\]\):not\(\.dsh-prism-native-icon\)/,
    'host icon hiding must explicitly exclude the plugin-owned Prism wrapper');
  for (const name of api.ICON_NAMES) {
    const svg = api.renderIcon(name);
    assert.match(svg, new RegExp(`data-anim-icon="${name}"`));
    assert.match(svg, /^<svg[\s\S]*<\/svg>$/);
  }
  const bridge = createModuleBridge({ motionLevel: 'ultra' });
  const icons = api.init(bridge);
  t.after(() => api.destroy());
  env.tick(80);

  for (const item of models) {
    const glyph = item.trigger.querySelector('[data-prism-model-glyph]');
    assert.ok(glyph, `${item.label} 应注入模型 Glyph`);
    assert.equal(glyph.getAttribute('data-prism-brand'), item.provider);
    assert.ok(glyph.querySelector('svg'));
  }
  for (const provider of ['deepseek', 'claude', 'openai', 'gemini']) {
    models[0].model.setAttribute('data-provider-id', provider);
    icons.refresh();
    env.tick(48);
    assert.equal(models[0].trigger.querySelector('[data-prism-model-glyph]').getAttribute('data-prism-brand'), provider);
  }

  assert.equal(copy.getAttribute('data-prism-native-icon-injected'), '1');
  assert.equal(send.getAttribute('data-prism-native-icon-layout'), 'overlay',
    'aria-labelled icon-only buttons must use centered overlay geometry');
  plus.click();
  env.tick(8);
  assert.ok(commandPanel?.isConnected, 'the first plus click opens the native command panel');
  plus.click();
  env.tick(8);
  assert.equal(commandPanel, null, 'clicking the plus button again must collapse the command panel');
  assert.equal(plus.getAttribute('aria-expanded'), 'false');
  const copyGlyph = copy.querySelector('[data-prism-native-icon]');
  assert.ok(copyGlyph);
  copy.click();
  assert.equal(copy.getAttribute('data-prism-copy-state'), 'check');
  env.tick(48);
  assert.equal(copyGlyph.getAttribute('data-prism-icon-state'), 'check');
  env.tick(1300);
  assert.equal(copy.hasAttribute('data-prism-copy-state'), false);
  assert.equal(copyGlyph.getAttribute('data-prism-icon-state'), 'idle');

  icons.destroy();
  assert.equal(doc.querySelectorAll('[data-prism-model-glyph]').length, 0);
  assert.equal(doc.querySelectorAll('[data-prism-native-icon]').length, 0);
  assert.equal(models[0].trigger.hasAttribute('data-prism-model-glyph-host'), false);
  assert.equal(copy.hasAttribute('data-prism-native-icon-injected'), false);
  assert.equal(send.hasAttribute('data-prism-native-icon-injected'), false);
});

test('37. 1.0.7 设置中心保留 33 项上游 schema、3 项 DSH 扩展并渲染双栏', t => {
  const env = createMockBrowserEnv(), { doc } = env;
  loadBrowserModule(env, 'src/workbench-settings.js');
  const api = env.sandbox.DSHPrismWorkbench;
  const core = api.settingsCore;
  assert.equal(core.UPSTREAM_SETTINGS_KEYS.length, 33);
  assert.equal(Object.keys(core.PRISM_SETTINGS_SCHEMA).length, 36);
  assert.equal(core.DSH_SETTINGS_EXTENSIONS.length, 3);
  for (const key of ['homeLayout', 'homeRipple', 'scrollBottomMotion', 'sidebarNavFold']) {
    assert.equal(core.SETTINGS_SUPPORT[key], 'supported', key);
  }

  const bridge = createModuleBridge({
    theme: 'obsidian',
    language: 'zh-CN',
    homeLayout: 'studio',
    homeRipple: true,
    scrollBottomMotion: 'smooth',
    sidebarNavFold: 'off',
  });
  const container = add(doc.body, 'div');
  const unmount = core.mountSettingsIntoElement(container, bridge, { doc, win: env.sandbox });
  t.after(() => unmount());
  assert.ok(container.querySelector('[data-dsh-prism-embedded-root="1"]'));
  const shell = container.querySelector('.dsh-settings-shell');
  const nav = container.querySelector('[data-ag-cs-settings-nav="1"]');
  const main = container.querySelector('.dsh-settings-main');
  assert.ok(shell && nav && main, '双栏设置 DOM 必须存在');
  assert.equal(nav.parentElement, shell);
  assert.equal(main.parentElement, shell);
  assert.equal(nav.querySelectorAll('[role="tab"]').length, 6);

  const tabs = [...nav.querySelectorAll('[role="tab"]')];
  let rows = 0;
  for (const tab of tabs) {
    tab.click();
    rows += container.querySelectorAll('[data-setting-row]').length;
  }
  assert.equal(rows, 36, '六组设置应渲染全部 36 项');
  nav.querySelector('[data-tab="workspace"]').click();
  for (const key of ['homeLayout', 'homeRipple', 'scrollBottomMotion', 'sidebarNavFold']) {
    const row = container.querySelector(`[data-setting-row="${key}"]`);
    assert.ok(row, key);
    assert.equal(row.getAttribute('data-setting-support'), 'supported', key);
    for (const button of row.querySelectorAll('button')) assert.equal(button.disabled, false, key);
  }
  unmount();
  assert.equal(container.querySelector('[data-dsh-prism-embedded-root="1"]'), null);
});
