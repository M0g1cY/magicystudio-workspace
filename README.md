# MagicYStudio Workspace

> 个人 AI 开发工作站 — 本地优先 · 极简科技风 · AI Native

MagicYStudio 是一个面向独立开发者的个人工作站，统一管理代码编辑器、文件、项目和 AI 工具入口，减少软件切换，提升开发效率。

---

## 技术栈

| 分类 | 技术 |
|---|---|
| 框架 | Next.js 15 (App Router) + React 19 |
| 语言 | TypeScript (strict mode, 零 `any`) |
| 样式 | TailwindCSS 3.4 + shadcn/ui |
| 存储 | IndexedDB (idb) + LocalStorage（本地优先，无需后端） |
| 编辑器 | Monaco Editor (`@monaco-editor/react`) |
| 图标 | Lucide React |
| 部署 | Vercel (零配置) |

---

## 页面路由

| URL | 页面 | 描述 |
|---|---|---|
| `/` | 首页 Dashboard | 今日工作区统计 + 快速访问 + 项目进度 + 待办 + 最近文件 |
| `/editor` | 代码编辑器 | Monaco Editor，TS/JS/JSON/Markdown，自动保存，导入/导出 |
| `/files` | 文件管理器 | 拖拽上传，按类型筛选，JSON 格式化预览，CSV 表格预览 |
| `/projects` | 项目管理 | 项目 CRUD，里程碑跟踪，迭代日志（更新/修复/新功能），文件关联 |
| `/settings` | 设置 | 深色/浅色切换，清除缓存，清除全部数据 |

---

## 本地运行

```bash
# 安装依赖
npm install

# 开发模式
npm run dev
# → http://localhost:3000

# 生产构建
npm run build
npm start
```

首次打开首页时，系统自动填充演示种子数据（项目、待办、文件），存储在浏览器 IndexedDB 中，刷新不丢失。

---

## Vercel 部署

项目零配置可直接部署到 Vercel：

1. 将项目推送到 GitHub 仓库
2. 在 [vercel.com](https://vercel.com) 导入该仓库
3. Vercel 自动识别 Next.js 项目，无需额外配置
4. 部署完成即可访问

```bash
# 或使用 Vercel CLI
npm i -g vercel
vercel
```

---

## MVP 功能清单

| # | 功能 | 状态 | 实现方式 |
|---|---|---|---|
| 1 | 首页 Dashboard | ✅ | 今日工作区 + 快速访问 + 项目卡片 + 待办 + 最近文件 |
| 2 | 代码编辑器 | ✅ | Monaco Editor，3s 防抖自动保存，Markdown 分屏预览 |
| 3 | 文件上传 | ✅ | 拖拽上传 + 点击上传，存入 IndexedDB |
| 4 | JSON 格式化预览 | ✅ | `JSON.stringify(obj, null, 2)` 格式化渲染 |
| 5 | CSV 表格预览 | ✅ | 解析为 `<table>`，表头固定，显示前 50 行 |
| 6 | 文件按类型筛选 | ✅ | 全部 / TS-JS / JSON / CSV / Markdown |
| 7 | 项目管理 | ✅ | 创建 / 里程碑 / 迭代日志 / 文件关联 |
| 8 | 待办事项 | ✅ | 内联添加 / 勾选完成 / 删除 |
| 9 | 深色/浅色切换 | ✅ | 默认深色，一键切换，偏好持久化 |
| 10 | 最近文件 | ✅ | LocalStorage 记录，Dashboard 卡片展示 + 类型标签 |
| 11 | 数据清除 | ✅ | 清除缓存 (LocalStorage) + 清除全部数据 (IndexedDB) |

---

## 项目结构

```
magicy-studio/
├── app/
│   ├── layout.tsx               # 根布局（html + ThemeProvider）
│   ├── globals.css              # Tailwind + CSS 变量（深/浅）
│   ├── error.tsx                # 路由级错误边界
│   ├── global-error.tsx         # 全局错误边界
│   └── (main)/                  # 路由组（共享侧边栏布局）
│       ├── layout.tsx           # Sidebar + Breadcrumb + FileProvider
│       ├── page.tsx             # /          首页 Dashboard
│       ├── editor/page.tsx      # /editor    代码编辑器
│       ├── files/page.tsx       # /files     文件管理器
│       ├── projects/page.tsx    # /projects  项目管理
│       └── settings/page.tsx    # /settings  设置
├── components/
│   ├── ui/                      # shadcn/ui (Button, Card, Input, Switch, Tabs)
│   └── theme-provider.tsx       # 深色/浅色主题 Provider
├── modules/
│   ├── dashboard/               # 7 个组件：Header, Stats, QuickAccess,
│   │                            #   ProjectCard, TodoCard, RecentFiles, Dashboard
│   ├── editor/code-editor.tsx   # Monaco 编辑器
│   ├── file-manager/file-manager.tsx  # 文件管理
│   ├── project/project-manager.tsx    # 项目管理
│   └── settings/settings.tsx    # 设置
├── lib/
│   ├── types.ts                 # 共享类型定义（FileItem, Project, Todo 等）
│   ├── utils.ts                 # cn(), formatDate(), formatFileSize(), getFileType()
│   ├── context/file-context.tsx # 跨页面文件状态共享
│   └── storage/
│       ├── db.ts                # IndexedDB CRUD（files, projects, todos）
│       ├── local-storage.ts     # LocalStorage 工具 + 键名常量
│       └── seed.ts              # 首次加载种子数据（幂等）
├── next.config.js               # Next.js 配置（standalone 输出）
├── tailwind.config.js           # Tailwind 配置（深色模式 + 自定义动画）
├── postcss.config.js            # PostCSS 配置
├── tsconfig.json                # TypeScript 配置
├── .env.example                 # 环境变量示例（MVP 无需）
└── package.json
```

---

## 设计规范

- **风格**: 极简科技风，参考 Linear / Raycast / Vercel
- **配色**: 暖橙 `#E67E22` 作为强调色，深灰/黑为主色调
- **圆角**: `rounded-2xl` (0.75rem + 4px)
- **阴影**: `card-shadow` + `hover:card-shadow-hover`（深浅模式各自适配）
- **动效**: `hover:-translate-y-0.5` 微上浮 + `animate-fade-in/slide-up`
- **布局**: `max-w-6xl` (1152px) 居中，大留白，卡片式

---

## 后续计划

| 优先级 | 功能 | 描述 |
|---|---|---|
| P0 | 终端模块 | `/terminal` 路由 + xterm.js 内嵌终端 |
| P0 | AI 聊天面板 | `/ai` 路由 + Claude API 对话 |
| P1 | 编辑器多 Tab | 同时编辑多个文件，Tab 切换 |
| P1 | 语言切换 | 编辑器支持切换 TS/JS/JSON/MD 模式 |
| P2 | 云备份 | IndexedDB → 阿里云 OSS / 腾讯云 COS |
| P2 | GitHub 集成 | 项目关联 GitHub 仓库，查看 commit 记录 |
| P3 | PWA | Service Worker 离线缓存，安装到桌面 |

---

## 截图

> 占位：运行 `npm run dev` 后截取 Dashboard 首页 + 编辑器页面截图

![Dashboard](./screenshots/dashboard.png)
![Editor](./screenshots/editor.png)

---

## License

MIT
