<div align="center">

<img src="https://raw.githubusercontent.com/M0g1cY/magicystudio-workspace/main/public/og.png" alt="MagicYStudio Workspace" width="100%" />

</div>

<p align="center">
  <strong>个人 AI 开发工作站</strong><br />
  <sub>本地优先 · 极简科技 · 零后端依赖</sub>
</p>

<p align="center">
  <a href="#-本地运行"><img src="https://img.shields.io/badge/next.js-15-black?style=flat&logo=next.js" /></a>
  <a href="#-技术栈"><img src="https://img.shields.io/badge/typescript-5.7-3178C6?style=flat&logo=typescript" /></a>
  <a href="#-技术栈"><img src="https://img.shields.io/badge/tailwind-3.4-06B6D4?style=flat&logo=tailwindcss" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-333.svg?style=flat" /></a>
  <a href="https://magicystudio.vercel.app"><img src="https://img.shields.io/badge/ deploy-vercel-000.svg?style=flat&logo=vercel" /></a>
</p>

<br />

<div align="center">
  <img src="https://raw.githubusercontent.com/M0g1cY/magicystudio-workspace/main/assets/demo.gif" alt="MagicYStudio Demo" width="100%" />
</div>

---

## 概述

MagicYStudio Workspace 是一个面向独立开发者的 **个人 AI 开发工作站**。它将代码编辑器、文件管理、项目跟踪和 AI 工具入口统一到一个极简界面中，消除软件切换，专注编码。

<br />

<p align="center">
  <table>
    <tr>
      <td width="25%" align="center"><strong>🎨</strong><br />极简科技风</td>
      <td width="25%" align="center"><strong>🌙</strong><br />深色优先</td>
      <td width="25%" align="center"><strong>💾</strong><br />本地存储</td>
      <td width="25%" align="center"><strong>⚡</strong><br />零后端</td>
    </tr>
  </table>
</p>

---

## 功能模块

<table>
  <tr>
    <td width="50%">
      <h3>⌘ &nbsp;Dashboard</h3>
      <p>今日工作区统计、快速访问入口、项目进度卡片、待办事项列表、最近文件网格。首次加载自动填充演示数据，存储在浏览器本地存储中。</p>
    </td>
    <td width="50%">
      <h3>⌘ &nbsp;代码编辑器</h3>
      <p>内嵌 Monaco Editor，支持 TypeScript / JavaScript / JSON / Markdown。3秒防抖自动保存、文件导入导出、Markdown 分屏实时预览。</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>⌘ &nbsp;文件管理器</h3>
      <p>拖拽上传，按类型筛选（TS/JS/JSON/CSV/MD）。JSON 格式化预览、CSV 表格渲染、Markdown 预览，点击文件直接跳转编辑器。</p>
    </td>
    <td width="50%">
      <h3>⌘ &nbsp;项目管理</h3>
      <p>创建项目、里程碑跟踪、迭代日志（更新/修复/新功能）、关联代码文件。纯本地，一个项目一条 IndexedDB 记录。</p>
    </td>
  </tr>
</table>

| 功能 | 描述 | 状态 |
|---|---|---|
| Dashboard 首页 | 工作区统计 + 快速访问 + 项目进度 + 待办 + 最近文件 | ✅ |
| Monaco 编辑器 | 语法高亮、自动保存、导入导出、Markdown 预览 | ✅ |
| 文件拖拽上传 | 拖拽或点击上传，存入 IndexedDB | ✅ |
| JSON / CSV 预览 | 格式化渲染 + 表格视图 | ✅ |
| 文件类型筛选 | 全部 / TS-JS / JSON / CSV / Markdown | ✅ |
| 项目里程碑 | 节点添加、状态切换、进度百分比 | ✅ |
| 迭代日志 | 更新 / 修复 / 新功能三种类型，时间线展示 | ✅ |
| 待办事项 | 内联添加、勾选完成、删除 | ✅ |
| 深色 / 浅色切换 | 默认深色，偏好持久化到 LocalStorage | ✅ |
| 数据清除 | 清除缓存 + 清除全部 IndexedDB 数据 | ✅ |

---

## 架构

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (Client)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Dashboard │ │  Editor  │ │  Files   │ │ Projects │  │
│  │    /      │ │ /editor  │ │  /files  │ │/projects │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │
│       │             │            │            │         │
│  ┌────┴─────────────┴────────────┴────────────┴─────┐  │
│  │              Shared Layout Shell                  │  │
│  │    Sidebar · Breadcrumb · FileContext Provider    │  │
│  └──────────────────────┬───────────────────────────┘  │
│                         │                               │
│  ┌──────────────────────┴───────────────────────────┐  │
│  │                  Data Layer                       │  │
│  │  ┌──────────┐  ┌──────────┐  ┌───────────────┐   │  │
│  │  │ IndexedDB │  │LocalStor.│  │ FileContext    │   │  │
│  │  │(files,    │  │(theme,   │  │(cross-page    │   │  │
│  │  │ projects, │  │ recent,  │  │ file sharing) │   │  │
│  │  │ todos)    │  │ layout)  │  │               │   │  │
│  │  └──────────┘  └──────────┘  └───────────────┘   │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**数据流向**

```
User Action → React State → IndexedDB CRUD → UI Re-render
                                    ↕
                              LocalStorage
                           (preferences only)
```

- **IndexedDB** 存储业务数据：文件、项目、待办事项
- **LocalStorage** 存储偏好设置：主题、最近文件列表、布局配置
- **FileContext** 跨页面状态：文件管理器选中文件 → 编辑器打开
- **Seed Module** 首次加载时幂等填充演示数据

---

## 项目结构

```
magicy-studio/
├── app/                             # Next.js App Router
│   ├── layout.tsx                   # 根布局（html + ThemeProvider）
│   ├── globals.css                  # Tailwind 指令 + CSS 变量
│   ├── error.tsx                    # 路由级错误边界
│   ├── global-error.tsx            # 全局错误边界
│   └── (main)/                      # 路由组（共享 Sidebar 壳）
│       ├── layout.tsx               # 侧边栏 + 面包屑 + FileProvider
│       ├── page.tsx                 # → /
│       ├── editor/page.tsx          # → /editor
│       ├── files/page.tsx           # → /files
│       ├── projects/page.tsx        # → /projects
│       └── settings/page.tsx        # → /settings
│
├── components/
│   ├── ui/                          # shadcn/ui 基组件
│   │   ├── button.tsx               #   Button（Slot 模式）
│   │   ├── card.tsx                 #   Card
│   │   ├── input.tsx                #   Input
│   │   ├── switch.tsx               #   Switch（主题切换）
│   │   └── tabs.tsx                 #   Tabs
│   └── theme-provider.tsx           # Theme Context Provider
│
├── modules/                         # 功能模块（每个含全部业务逻辑）
│   ├── dashboard/                   # 7 个子组件
│   │   ├── dashboard.tsx            #   容器 + 种子初始化
│   │   ├── dashboard-header.tsx     #   Hero 区
│   │   ├── dashboard-stats.tsx      #   今日工作区统计
│   │   ├── quick-access-grid.tsx    #   4 工具快速入口
│   │   ├── project-progress-card.tsx #  项目进度卡片
│   │   ├── todo-card.tsx            #   待办事项
│   │   └── recent-files-card.tsx    #   最近文件（含类型标签）
│   ├── editor/
│   │   └── code-editor.tsx          # Monaco + 保存 + Markdown 预览
│   ├── file-manager/
│   │   └── file-manager.tsx         # 拖拽上传 + 筛选 + JSON/CSV 预览
│   ├── project/
│   │   └── project-manager.tsx      # CRUD + 里程碑 + 日志 + 文件关联
│   └── settings/
│       └── settings.tsx             # 主题切换 + 数据管理
│
├── lib/
│   ├── types.ts                     # 共享类型（FileItem, Project, Todo...）
│   ├── utils.ts                     # cn() / formatDate / formatFileSize
│   ├── context/
│   │   └── file-context.tsx         # React Context 跨页文件共享
│   └── storage/
│       ├── db.ts                    # IndexedDB (idb) — 3 张表
│       ├── local-storage.ts         # LocalStorage 工具
│       └── seed.ts                  # 首次加载演示数据
│
├── public/                          # 静态资源
├── next.config.js                   # output: standalone
├── tailwind.config.js               # darkMode: class + 自定义动画
├── postcss.config.js
├── tsconfig.json                    # strict + path aliases
├── .env.example                     # 环境变量（MVP 无需）
└── package.json
```

---

## 技术栈

| 层 | 技术 | 说明 |
|---|---|---|
| **框架** | Next.js 15 + React 19 | App Router · Route Groups · Server Components |
| **语言** | TypeScript 5.7 | Strict mode · 零 `any` · 共享类型定义 |
| **样式** | TailwindCSS 3.4 + shadcn/ui | CSS 变量 · `darkMode: class` · 自定义动画 |
| **编辑器** | Monaco Editor | `@monaco-editor/react` · OnMount 类型安全 |
| **存储** | IndexedDB (idb 8.x) + LocalStorage | 3 张 object store · 幂等种子数据 |
| **图标** | Lucide React | Tree-shaking · SVG 图标 |
| **部署** | Vercel | 零配置 · `output: standalone` |
| **工具** | clsx + tailwind-merge + cva | `cn()` · 类名合并 · Button variants |

---

## 本地运行

```bash
# 1. 克隆仓库
git clone https://github.com/M0g1cY/magicystudio-workspace.git
cd magicystudio-workspace

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
# → 浏览器打开 http://localhost:3000

# 4. 生产构建
npm run build
npm start
```

首次打开时自动填充演示数据（1 个项目 + 4 条待办 + 4 个文件），存储在浏览器 IndexedDB 中，刷新不丢失。**无需注册、无需登录、无需后端**。

---

## 截图

<table>
  <tr>
    <td><strong>Dashboard</strong><br/><sub>首页 · 深色模式 · 种子数据填充</sub></td>
    <td><strong>Editor</strong><br/><sub>Monaco Editor · Markdown 分屏预览</sub></td>
  </tr>
  <tr>
    <td><img src="./screenshots/dashboard.png" alt="Dashboard" /></td>
    <td><img src="./screenshots/editor.png" alt="Editor" /></td>
  </tr>
  <tr>
    <td><strong>File Manager</strong><br/><sub>JSON 格式化预览 · 拖拽上传</sub></td>
    <td><strong>Project Manager</strong><br/><sub>里程碑跟踪 · 迭代日志</sub></td>
  </tr>
  <tr>
    <td><img src="./screenshots/files.png" alt="File Manager" /></td>
    <td><img src="./screenshots/projects.png" alt="Project Manager" /></td>
  </tr>
</table>

---

## 设计规范

```
配色        #E67E22 (orange accent)  +  #1A1A1A (dark bg)  +  #FAF8F5 (light bg)
圆角        rounded-2xl  (0.75rem + 4px)
阴影        card-shadow → card-shadow-hover  (深浅双模式)
动效        hover:-translate-y-0.5  +  animate-fade-in  +  animate-slide-up
布局        max-w-6xl (1152px) · large whitespace · card grid
字体        Inter (next/font/google) · antialiased
```

参考：**Linear** · **Raycast** · **Vercel Design**

---

## Roadmap

```
v0.1.0 (current)          v0.2.0                     v0.3.0                  v1.0.0
    │                         │                          │                       │
    ├─ Dashboard MVP          ├─ /terminal (xterm)       ├─ 云备份 (OSS/COS)     ├─ PWA
    ├─ Editor (Monaco)        ├─ /ai 面板 (Claude API)   ├─ GitHub 集成          ├─ 桌面应用
    ├─ File Manager           ├─ 编辑器多 Tab            ├─ 文件拖出导出         ├─ 插件系统
    ├─ Project Manager        ├─ 全文搜索                └─ 代码片段库           └─ 主题市场
    └─ Settings               └─ 键盘快捷键
```

---

## License

[MIT](LICENSE) © 2025 MagicYStudio

<br />
<p align="center">
  <sub>Built with Next.js · TypeScript · TailwindCSS · Monaco · shadcn/ui</sub>
</p>
