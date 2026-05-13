import { projectStorage, todoStorage, fileStorage, initDB } from "./db"
import { localStorage as ls, STORAGE_KEYS } from "./local-storage"

let seeded = false

export async function seedDefaultData(): Promise<void> {
  if (seeded) return

  try {
    await initDB()
    const projects = await projectStorage.getAll()
    if (projects.length > 0) { seeded = true; return }

    // --- 默认项目 ---
    const projectId = await projectStorage.add({
      name: "MagicYStudio Website",
      description: "当前阶段：Frontend MVP。个人 AI 开发工作站前端，基于 Next.js + TailwindCSS + shadcn/ui，部署到 Vercel。",
      techStack: ["Next.js", "TypeScript", "TailwindCSS", "shadcn/ui"],
      status: "in-progress",
      milestones: [
        { id: "ms_seed_1", title: "后端 MVP 完成",  status: "completed" as const,  createdAt: Date.now() - 86400000 * 7 },
        { id: "ms_seed_2", title: "首页重构中",    status: "in-progress" as const, createdAt: Date.now() - 86400000 * 3 },
        { id: "ms_seed_3", title: "文件管理器优化", status: "not-started" as const,  createdAt: Date.now() - 86400000 },
      ],
      logs: [
        { id: "log_seed_1", content: "完成项目初始化，搭建 Next.js + TailwindCSS 基础框架", type: "feature" as const, createdAt: Date.now() - 86400000 * 7 },
        { id: "log_seed_2", content: "修复深色模式切换时 CSS 变量丢失的问题", type: "bugfix" as const, createdAt: Date.now() - 86400000 * 5 },
        { id: "log_seed_3", content: "重构 Dashboard 首页为卡片式布局", type: "update" as const, createdAt: Date.now() - 86400000 * 2 },
      ],
      associatedFiles: [],
    })

    // --- 默认待办 ---
    const todos = [
      "完成深色模式",
      "优化文件管理器",
      "接入编辑器保存逻辑",
      "准备 Vercel 部署",
    ]
    for (const content of todos) {
      await todoStorage.add({ content, completed: false, projectId })
    }

    // --- 默认文件 ---
    const files: Array<{ name: string; type: string; content: string }> = [
      { name: "package.json", type: "json", content: JSON.stringify({ name: "magicy-studio", version: "0.1.0", private: true, scripts: { dev: "next dev", build: "next build", start: "next start" }, dependencies: { next: "^15.1.6", react: "^19.0.0", "react-dom": "^19.0.0" } }, null, 2) },
      { name: "app/page.tsx", type: "typescript", content: `"use client"\n\nexport default function HomePage() {\n  return (\n    <div className="flex h-screen bg-background">\n      <main className="flex-1 p-8">\n        <h1 className="text-display">MagicYStudio</h1>\n      </main>\n    </div>\n  )\n}\n` },
      { name: "components/sidebar.tsx", type: "typescript", content: `"use client"\n\nimport { useRouter } from "next/navigation"\n\nexport function Sidebar() {\n  return (\n    <aside className="w-56 border-r h-full">\n      <nav className="p-4 space-y-2">\n        {/* navigation items */}\n      </nav>\n    </aside>\n  )\n}\n` },
      { name: "README.md", type: "markdown", content: `# MagicYStudio\n\n个人 AI 开发工作站\n\n## 技术栈\n\n- Next.js 15\n- TypeScript\n- TailwindCSS\n- shadcn/ui\n\n## 开始\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n` },
    ]
    const recentIds: string[] = []
    for (const f of files) {
      const id = await fileStorage.add({ name: f.name, type: f.type, content: f.content, size: new Blob([f.content]).size })
      recentIds.push(id)
    }

    // 记录最近文件
    ls.set(STORAGE_KEYS.RECENT_FILES, recentIds)

    seeded = true
    console.log("[MagicYStudio] 默认数据已填充")
  } catch (error) {
    console.error("[MagicYStudio] 种子数据填充失败:", error)
  }
}
