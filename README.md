# Obsidian Prism · 黑曜棱镜 (`dsh-obsidian-prism`)

**为 DeepSeek Harness Desktop & Web (`dsh`) 打造的原版光学界面、物理动效与思考转译原生插件**

> Built upon [Obsidian Prism](https://github.com/RMvdesi/obsidian-prism) (`v1.0.7-beta.1`, commit `5dac53b`) by [@RMvdesi](https://github.com/RMvdesi), licensed under [GPL-3.0-only](./LICENSE). Upstream component notices are preserved in full in [`NOTICE`](./NOTICE) and [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md).
>
> 本项目为面向 DeepSeek Harness (`dsh`) 的社区独立移植版，不隶属于 DeepSeek、Google LLC 或上游原作者 [@RMvdesi](https://github.com/RMvdesi)，亦未获得任何官方背书。

---

## 核心特性

1. **四套原版深浅配色 + 五档工业强调色（真实 `--dsw-alias-*` & `body` 变量同步）**
   - **深空黑曜 (`obsidian`)**：`#09090B` 侧栏 / `#0E0E11` 主画布，零色偏中性钛黑深色旗舰。
   - **暖炭玄岩 (`warm`)**：`#10100F` 侧栏 / `#141413` 主画布，低蓝光暖炭褐夜间配色。
   - **白昼冷晶 (`crystal`)**：`#E8EEF6` 侧栏 / `#F4F7FB` 主画布，双层冷石板微投影与矿物描边。
   - **暖白画册 (`alabaster`)**：`#EBE6DC` 侧栏 / `#F6F4EE` 主画布，艺术画册暖白纸感浅色。
   - **五档强调色**：跟随主题 (`follow`)、光学钴蓝 (`cobalt`)、鸢尾星紫 (`iris`)、琥珀流金 (`amber`)、纯银钛单色 (`mono`)，完整同步真实 DSH Desktop 的 `--dsw-alias-bg-base`、`--dsw-alias-bg-layer-1/2/3`、`--dsw-alias-border-l1/l2/l4`、`--dsw-alias-label-*`、`--dsw-alias-button-*`、`--dsw-alias-state-*`、`--dsw-font-*` 与 `--ag-prism-*` 令牌。

2. **Composer 内的真实会话上下文试管**
   - 试管紧随权限按钮；模型与上下文数据从 DSH 页面实时识别，未知值显示为 `—`，计费按 **API 用量**展示，不显示虚构的 5 小时 / 每周配额池。

3. **原生模型菜单与连续阻尼星空推理条**
   - 模型菜单与推理等级子页均带 **「← 返回」** 按钮（通过原生 `Escape` 逻辑返回首层），点按展开/收起，菜单保持打开不会因选择而闪烁关闭。
   - 星空推理条支持连续跟手拖动与 `rAF` 过渡动画，能量填充与滑块实时同步，4 个刻度精确对齐 `Off` / `Low` / `High` / `Max`（`Max` 完全充满），普通模型最高档延续星轨动效。

4. **输入框上沿的 DeepSeek 像素鲸母子伴宠**
   - 深潜蓝鲸与星海虎鲸均以「成鲸（`44×32`）+ 幼鲸（`28×22`）」像素家族形态出现，支持独立巡逻、独立拖拽、松手惯性落地与流式输出冒泡。
   - 碰撞体积按实际像素身体轮廓计算，采用质量加权物理碰撞、动量交换、回弹挤压反馈与逐帧渐进分离（不隔空弹开、不瞬移），并以输入框上沿为地面（不会把下方鲸鱼压进 Composer）。

5. **五级水墨流式淡入与三态 0fps 边缘语义余晖 (`optics-motion`)**
   - 基于浏览器原生 `CSS.highlights`（Custom Highlight API）实现**零 DOM 包裹、React SPA 安全**的五级水墨流式吐字淡入；支持平滑物理光标 (`smooth-caret`)、波纹场 (`ripple-core`)、空闲 `1.2s` 自动 `0fps` 休眠，以及「待用户决策 / 异常中止 / 后台长任务完成」三态无弹窗边缘余晖。

6. **DSH 原生设置页嵌入 (`settings.section` · 「黑曜棱镜」) 与工作台增强**
   - **1.0.7 双栏设置中心**：自动在 DeepSeek Harness 原生设置中心注册 **「黑曜棱镜」** 一级导航项，提供 **33 项上游配置 + 3 项 DSH 扩展**、滑块开关、5 色强调圆点、5 种语言、3 档场景预设与脱敏 JSON 配置备份导入导出。
   - **React 安全非破坏性增强**：严格不移动、不包裹 React 管理的子节点（仅追加插件自有节点或标记 `data-*` 属性）。支持**无边界 Markdown 助手回复 + 主题用户气泡**、代码块顶栏 Sticky 吸顶、`>= 48` 行长代码块折叠（带视口补偿）、左侧会话导轨刻度与悬停大纲、`Alt+↑` / `Alt+↓` 轮次跳转，以及 `<think>` 思考链中英双语/沉浸译文切换。

7. **Home Studio 与首页地平线波纹**
   - 空白首页呈现 Prism Studio 仪表盘：用量概览、7×N 活动热力图、趋势图与模型分布，严格基于宿主真实数据展示（无数据时明确空态），并配合 0fps 地平线波纹，进入真实会话后自动卸载。

8. **Smoked Obsidian 切面、21 套微动态原生图标与流体工作台**
   - Composer 图标（加号、发送、侧栏、复制、终端等）严格居中显示；加号支持第一次点击展开命令面板、第二次点击正常收起；输入框工具栏按 `720/640/560/480/400px` 五阶响应式收缩，侧栏导航支持折叠与平滑/即时滚底。

---

## 与上游版本的适配差异与范围边界

本仓库针对 DeepSeek Harness Desktop & Web (`dsh`) 的真实运行架构做了原生改造，以下 Antigravity 专属或未纳入范围的模块在本移植版中**未包含 / 已刻意排除**：

- **未包含的宿主功能**：Inline Diff、选区 `/btw`、Chat Beta、Sidebar Studio、Omni viewer / Antigravity Sidecar 守护进程、内置宿主界面汉化（DSH 已自带中文界面）以及 Antigravity 的 5 小时 / 每周配额池。
- **独立定制部分**：采用纯浏览器桥接 (`src/dsh-bridge.js`) 与非阻塞 Cordis 宿主插件 (`lib/index.js`)；像素蓝鲸 / 虎鲸母子为面向 DeepSeek Harness 的净室独立实现。

---

## 目录结构

```text
dsh-obsidian-prism/
├── package.json                  # DSH 插件包清单 (main: lib/index.js, dsh.bundle + dsh.client)
├── cordis.patch.yml              # DSH Profile 补丁声明 (id: obsidian-prism, name: dsh-obsidian-prism)
├── LICENSE                       # GNU General Public License v3.0 (GPL-3.0-only) 全文
├── NOTICE                        # 上游 RMvdesi 署名、GPL-3.0 第 7 条声明与 DSH 移植修改记录
├── THIRD_PARTY_NOTICES.md        # 第三方开源组件原始版权声明与完整 MIT 许可文本
├── README.md                     # 项目说明、安装指南与致谢文档
├── lib/
│   ├── index.js                  # DSH 宿主端插件入口 (非阻塞 root.inject(['webServer']) + /api/obsidian-prism/*)
│   └── client.js                 # DSH 浏览器端入口 (window.__ModuleLoader__.load + settings.section 槽位)
├── src/
│   ├── index.mjs                 # ESM CLI & Cordis 兼容入口（与 lib/index.js 导出一致）
│   ├── tokens-palettes.js        # 4 套主题 × 5 档强调色至真实 --dsw-alias-* 与 --ag-prism-* 映射引擎
│   ├── dsh-bridge.js             # 纯浏览器宿主桥接层 (/api/obsidian-prism/config 同源同步 + localStorage 降级)
│   ├── prism-style.css           # Obsidian Prism 光学表面与组件样式表
│   ├── optics-motion.js          # 4 档弹簧动画、3 态边缘余晖、CSS.highlights 水墨流与平滑光标
│   ├── deepseek-companions.js/.css # 像素蓝鲸/虎鲸母子、自主巡逻、质量碰撞与渐进分离物理引擎
│   ├── home-studio-panel.js / home-ripple-host.js / home-studio.css # 首页仪表盘与 0fps 波纹
│   ├── prism-native-icons.js/.css # 21 套微动态原生图标与模型品牌 Glyph
│   ├── responsive-workbench.js/.css # 五阶工具收缩、滚底与侧栏导航折叠
│   ├── widgets-vial-mascot.js    # 会话上下文试管、菜单星空推理条与输入框伴宠挂载
│   └── workbench-settings.js     # 代码吸顶/48行折叠、会话导轨、双模思考转译与外观设置中心
├── scripts/
│   └── build-bundle.mjs          # 零依赖打包编译器 -> lib/client.js & dist/*
├── dist/
│   ├── dsh-prism.css             # 编译后的完整光学样式表
│   ├── dsh-prism.bundle.js       # 浏览器一站式运行时 Bundle
│   └── dsh-prism.userscript.js   # 浏览器控制台 / Tampermonkey 一键注入脚本
├── preview/
│   └── dsh-stage.html            # DeepSeek Harness 离线交互预览舞台
└── test/
    └── verify.test.mjs           # Node:test 自动化完整性与语法回归测试套件 (49 tests)
```

---

## 安装与开发指南

### 1. 安装至 DeepSeek Harness Desktop (`desktop` profile)

```bash
# 1. 克隆本仓库到本地目录（Node.js >= 20）
git clone https://github.com/leonlowery507-png/dsh-obsidian-prism.git
cd dsh-obsidian-prism

# 2. （可选）重新编译生成 lib/client.js 与 dist/*（仓库已自带最新构建产物）
npm run build

# 3. 链接安装至本机 DSH desktop profile（请替换为你的实际本地绝对路径）
dsh plugin --profile desktop add link:/absolute/path/to/dsh-obsidian-prism
```

Windows 示例路径形式：`dsh plugin --profile desktop add link:D:/plugins/dsh-obsidian-prism`。

安装并重新加载 DeepSeek Harness Desktop 后，进入 **设置 → 黑曜棱镜**（或按 `Ctrl+Shift+P`）即可实时切换四套深浅光学主题、五档强调色、像素鲸伴宠与思考链转译。配置自动脱敏持久化至 `~/.dsh/obsidian-prism-config.json` 与浏览器 `localStorage`。

### 2. 浏览器端 Userscript 快速预览

若仅在浏览器中调试 `dsh web`，也可将 [`dist/dsh-prism.userscript.js`](./dist/dsh-prism.userscript.js) 导入 Tampermonkey / Violentmonkey，或在页面 DevTools 控制台执行对应脚本片段（默认匹配 `http://127.0.0.1:3080/*` 与 `http://localhost:3080/*`）。

### 3. 构建与自动化测试

```bash
# 编译生成 lib/client.js、dist/dsh-prism.css、dist/dsh-prism.bundle.js 与 dist/dsh-prism.userscript.js
npm run build

# 运行全套自动化验证测试（49/49）
npm test
```

---

## 致谢与开源项目声明 (Credits & Open-Source Acknowledgments)

本移植项目的完成离不开上游原作者以及众多开源项目作者的创造性工作与开放共享精神，在此向以下项目与开发者致以诚挚感谢：

### 1. 核心移植对象 (Primary Upstream)

- **[RMvdesi/obsidian-prism](https://github.com/RMvdesi/obsidian-prism)**（基线版本 `v1.0.7-beta.1`, commit `5dac53b` · 作者 [@RMvdesi](https://github.com/RMvdesi) · 许可：`GPL-3.0-only` + `NOTICE`）
  - 感谢提供整套 **Obsidian Prism（黑曜棱镜）** 光学视觉规范、四套深浅配色与五档工业强调色、会话上下文试管、星空推理等级滑块、五级 `CSS.highlights` 水墨流式淡入、三态 0fps 边缘余晖、Home Studio、21 套微动态原生图标、流体工作台与双栏设置中心设计。
  - 同时致敬上游社区贡献者对渲染性能、安全边界与交互细节的持续打磨：`@TheSixPasserby`、`@yzd05`、`@DDykarc`、`@SuzumiyaHaruhi719`、`@Gruu6y`、`@boy14204367`、`@Freezecatmeow`、`@Gyf0402`、`@FeonzmEko`。

### 2. 上游融合的 MIT 开源组件 (Absorbed MIT Upstream Projects)

以下项目的原始版权声明与 MIT 许可证全文已按 GPL-3.0 兼容条款完整保留于 [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md)：

- **[0DNANCY/agy-claude-style](https://github.com/0DNANCY/agy-claude-style)** — `MIT License` · `Copyright (c) 2026 0DNANCY`
  - 提供了光学 UI 主题体系、四档弹簧动效底座、WebGL2 地平线/字符波纹矩阵、像素伴宠底座以及零依赖打包器雏形。
- **[ATtacK030130/antigrative-dashboard](https://github.com/ATtacK030130/antigrative-dashboard)** (`v0.9.1`) — `MIT License` · `Copyright (c) 2026 AG Pulse contributors`
  - 提供了上下文遥测试管与仪表盘结构设计基础（本移植版已按 DSH 真实数据结构调整为基于宿主 API 用量的实时识别与展示）。
- **[LLYSH-HANNARI/antigravity-Codex-Claude-effort-slider](https://github.com/LLYSH-HANNARI/antigravity-Codex-Claude-effort-slider)** — `MIT License` · `Copyright (c) 2026 月上寒 (LLYSH-HANNARI)`
  - 提供了模型选择器内嵌推理等级滑块与智能让位思路。
- **[yiheng8023/antigravity-chinese](https://github.com/yiheng8023/antigravity-chinese)** (`v3.3.19`) — `MIT License` · `Copyright (c) 2026 Antigravity Chinese Localization Contributors`
  - 上游 `Obsidian Prism v1.0.7-beta.1` 宿主汉化通道词库与 DOM 匹配设计来源；鉴于 DeepSeek Harness 原生提供简体中文界面，本移植版未启用宿主汉化通道，完整版权与 MIT 许可声明依上游条款保留于 [`NOTICE`](./NOTICE) 与 [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md)。

### 3. 设计与 DSH 生态灵感来源 (Design & Ecosystem Inspiration)

- **[Nwflower/dsh-claude-style](https://github.com/Nwflower/dsh-claude-style)** — Studio 极简排版、输入框边框与暖白编辑表面美学参考。
- **[Microqian2th/dsh-codex-effort-slider](https://github.com/Microqian2th/dsh-codex-effort-slider)** — 星空能量轨、刻度吸附与连续阻尼曲线参考。
- **[mobius/dsh-performance-slider](https://github.com/mobius/dsh-performance-slider)** — 性能档位滑块交互与实时反馈设计参考。
- **[claudenoshujin/claude-web](https://github.com/claudenoshujin/claude-web)** (by `lulu`) — 桌面伴宠微生态与物理交互设计灵感参考（`src/deepseek-companions.js` 中的像素蓝鲸 / 虎鲸母子绘制与物理碰撞引擎为净室独立实现）。

### 4. 宿主平台、运行框架与开源工具链 (Host Platform, Runtime & Standards)

- **DeepSeek Harness (`dsh`)** & **[@deepseek-ai/cordis / shigma/cordis](https://github.com/shigma/cordis)** (`MIT License`) — 宿主运行时、`cordis.patch.yml` 补丁机制与 `settings.section` 设置扩展槽位。
- **[React](https://github.com/facebook/react)** (`MIT License`) — DeepSeek Harness 前端渲染框架（本插件严格遵守只追加自有节点与 `data-*` 属性，不移动或包裹 React 子节点）。
- **[Node.js](https://github.com/nodejs/node)** (`MIT License`) — 零外部依赖构建脚本 (`scripts/build-bundle.mjs`) 与原生 `node:test` 测试框架运行时。
- **浏览器开放 Web 标准** — `CSS.highlights` (CSS Custom Highlight API)、WebGL2、Canvas 2D 与 SVG。

---

## 开源协议 (`GPL-3.0-only` + `NOTICE`)

本项目整体基于 **[GNU General Public License v3.0 (`GPL-3.0-only`)](./LICENSE)** 开源，并延续上游 [`NOTICE`](./NOTICE) 第 7 条的附加署名要求：

1. 任何基于本项目的再分发或二次修改必须继续以 `GPL-3.0` 免费开放完整源代码。
2. 须完整保留 [`LICENSE`](./LICENSE)、[`NOTICE`](./NOTICE)、[`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md) 以及对上游作者 **RMvdesi** 与相关开源项目的署名。
3. 衍生修改须在文档或修改声明中注明变更与修改日期，不得以官方原版名义进行背书或发布。
