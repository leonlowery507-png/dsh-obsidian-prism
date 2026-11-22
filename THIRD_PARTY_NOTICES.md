# Third-Party Open Source Notices & Upstream Credits

> **Non-Affiliation & Trademark Disclaimer**
>
> **Obsidian Prism is an independent open-source project and is not affiliated with or endorsed by Google LLC.**
> "Antigravity" and "Google" are trademarks or product names of Google LLC, referenced solely for descriptive compatibility purposes ("Optical UI & Motion Suite for Antigravity").

---

## 0. Project License & Downstream Attribution Summary

**Obsidian Prism** (`https://github.com/RMvdesi/obsidian-prism`, Copyright (C) 2026 RMvdesi) as a combined work and all original modules authored for this repository are licensed under the **GNU General Public License v3.0 (`GPL-3.0-only`)**, subject to the attribution preservation and non-endorsement conditions in [`LICENSE`](./LICENSE) and [`NOTICE`](./NOTICE).

Any derivative work or modified redistribution MUST remain open-source under **GPL-3.0** and preserve full attribution to **RMvdesi / Obsidian Prism** as well as the upstream notices below.

---

## 1. Absorbed & Unified Core Upstream Projects (MIT License — GPL-3.0 Compatible)

**Obsidian Prism** unifies, refactors, and builds upon components from the following MIT-licensed open-source repositories. Under the terms of the MIT License (which is upward-compatible with GPL-3.0), their original copyright notices and permission statements are preserved in full below:

### 1.1 `0DNANCY/agy-claude-style`
- **Repository**: <https://github.com/0DNANCY/agy-claude-style>
- **Copyright**: `Copyright (c) 2026 0DNANCY`
- **Original License**: MIT License
- **Scope in Obsidian Prism**: Optical UI theme foundation, 4-tier spring choreography base, WebGL2 horizon glow & character matrix ripple field, pixel mascot rig foundation, and zero-dependency bundle compiler.

### 1.2 `ATtacK030130/antigrative-dashboard` (`v0.9.1`)
- **Repository**: <https://github.com/ATtacK030130/antigrative-dashboard>
- **Upstream Baseline**: `v0.9.1`
- **Copyright**: `Copyright (c) 2026 AG Pulse contributors`
- **Original License**: MIT License (compatible with `GPL-3.0-only`)
- **Scope in Obsidian Prism**: Absorbed and adapted in `vendor/pulse-dashboard/` (`compat/` and `sidecars/panel/`) for live token throughput (TPS / TTFT), cache hit rate telemetry, context window estimation, dual-window (`5h` / weekly) model quota collection & linear depletion forecasting, main session vs. Swarm/subagent token attribution, CDP process-lineage multi-instance discovery, isolated sidecar telemetry storage, and smart coexistence yielding.

### 1.3 `LLYSH-HANNARI/antigravity-Codex-Claude-effort-slider`
- **Repository**: <https://github.com/LLYSH-HANNARI/antigravity-Codex-Claude-effort-slider>
- **Copyright**: `Copyright (c) 2026 月上寒 (LLYSH-HANNARI)`
- **Original License**: MIT License (compatible with `GPL-3.0-only`)
- **Scope in Obsidian Prism**: Absorbed in `vendor/effort-slider/` for interactive reasoning effort slider inside the model selector menu, enhanced with smart coexistence yielding and 120ms MutationObserver throttling.

### 1.4 `yiheng8023/antigravity-chinese` (`v3.3.19`)
- **Repository**: <https://github.com/yiheng8023/antigravity-chinese>
- **Upstream Baseline**: `v3.3.19` (Author: `yiheng8023`)
- **Copyright**: `Copyright (c) 2026 Antigravity Chinese Localization Contributors`
- **Original License**: MIT License (compatible with `GPL-3.0-only`)
- **Scope in Obsidian Prism**: Upstream `zh-CN` dictionary source (`vendor/host-i18n/zh-CN.json`) and DOM translation matching pattern reference; re-architected cleanly in `vendor/host-i18n/host-i18n-runtime.js` as a Zero-ASAR pure CDP Channel 4 on-demand localization channel featuring universal 4-layer auto-yield, ping-pong conflict circuit breaker, and `WeakMap`-backed lossless `destroy()`.

---

## 2. Upstream Design Inspiration & Component Credits

Obsidian Prism acknowledges the UI/UX concepts and interaction patterns established by the following upstream open-source projects:

### 2.1 `Nwflower/dsh-claude-style`
- **Repository**: <https://github.com/Nwflower/dsh-claude-style>
- **Contribution**: Studio-style minimalist typography, clean composer framing, and warm editorial surface aesthetics.

### 2.2 `Microqian2th/dsh-codex-effort-slider`
- **Repository**: <https://github.com/Microqian2th/dsh-codex-effort-slider>
- **Contribution**: Starfield energy track, hysteresis detent snapping, and continuous damped motion curves for reasoning effort controls.

### 2.3 `mobius/dsh-performance-slider`
- **Repository**: <https://github.com/mobius/dsh-performance-slider>
- **Contribution**: Interactive performance tier slider concepts and responsive visual feedback patterns.

### 2.4 `claudenoshujin/claude-web` (by `lulu`)
- **Repository**: <https://github.com/claudenoshujin/claude-web>
- **Contribution**: *Mascot Pile & Micro-Ecology Interaction Inspiration* (clean-room independent implementation in Obsidian Prism; zero source code copied).

---

## 3. Preserved Upstream MIT License Text

```text
MIT License

Copyright (c) 2026 0DNANCY (agy-claude-style)
Copyright (c) 2026 AG Pulse contributors (antigrative-dashboard)
Copyright (c) 2026 月上寒 / LLYSH-HANNARI (antigravity-Codex-Claude-effort-slider)
Copyright (c) 2026 Antigravity Chinese Localization Contributors (yiheng8023/antigravity-chinese)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 4. Downstream DeepSeek Harness (dsh) Port Ecosystem & Non-Affiliation

**Downstream Port Repository**: <https://github.com/leonlowery507-png/dsh-obsidian-prism>  
**Target Host & License**: Adapted for **DeepSeek Harness (`dsh`)** Desktop & Web UI under **GNU General Public License v3.0 (`GPL-3.0-only`)**.

### 4.1 Host Platform, Runtime Frameworks & Open Web Standards
- **DeepSeek Harness (`dsh`)** & **`@deepseek-ai/cordis` / [`shigma/cordis`](https://github.com/shigma/cordis)** (MIT License): Host runtime environment, plugin lifecycle (`apply(root, config)`), `cordis.patch.yml` profile integration, and `settings.section` extension slot.
- **[React](https://github.com/facebook/react)** (MIT License): Host frontend rendering framework. All UI enhancements in `dsh-obsidian-prism` follow a non-destructive mounting pattern (external portals, `data-*` attributes, and sibling injection) without reparenting or overwriting React-managed children.
- **[Node.js](https://github.com/nodejs/node)** (MIT License): Runtime for the zero-dependency bundle compiler (`scripts/build-bundle.mjs`) and the `node:test` verification suite (`test/verify.test.mjs`).
- **Browser Web Standards**: `CSS.highlights` (CSS Custom Highlight API), WebGL2, Canvas 2D, and inline SVG choreography.

### 4.2 Scope Differences vs. Upstream `v1.0.7-beta.1`
- Upstream `yiheng8023/antigravity-chinese` (Antigravity host localization Channel 4) and `ATtacK030130/antigrative-dashboard` dual-window (`5h` / weekly) Antigravity quota pools are **not active** in `dsh-obsidian-prism`, because DeepSeek Harness natively provides Chinese UI and exposes API usage/billing rather than 5h/weekly quota pools. All upstream copyright notices and MIT license texts are nonetheless preserved in full above pursuant to GPL-3.0 Section 7(b) and upstream `NOTICE` requirements.
- The pixel blue-whale / orca parent-child companions (`src/deepseek-companions.js`) are a clean-room independent implementation for DeepSeek Harness.

### 4.3 Independent Port & Non-Affiliation Disclaimer
`dsh-obsidian-prism` is an independent community port and is **not** affiliated with, sponsored by, or endorsed by **DeepSeek**, **Google LLC**, or upstream author **RMvdesi**. All product names and trademarks remain the property of their respective owners and are cited strictly to identify compatibility and upstream attribution.
