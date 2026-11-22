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
