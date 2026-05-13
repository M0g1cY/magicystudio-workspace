"use client"

import { FileCode, Terminal, Bot, FolderOpen } from "lucide-react"

interface Tool {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  shortcut: string
}

interface QuickAccessGridProps {
  onNavigate?: (page: string) => void
}

const tools: Tool[] = [
  {
    id: "editor",
    name: "代码编辑器",
    description: "TS / JS / JSON / Markdown",
    icon: <FileCode className="w-4 h-4" />,
    shortcut: "⌘1",
  },
  {
    id: "files",
    name: "文件管理器",
    description: "拖拽上传、分类筛选、格式化预览",
    icon: <FolderOpen className="w-4 h-4" />,
    shortcut: "⌘2",
  },
  {
    id: "terminal",
    name: "终端",
    description: "命令行与脚本执行",
    icon: <Terminal className="w-4 h-4" />,
    shortcut: "⌘3",
  },
  {
    id: "claude",
    name: "Claude AI",
    description: "AI 辅助开发与代码审查",
    icon: <Bot className="w-4 h-4" />,
    shortcut: "⌘4",
  },
]

export function QuickAccessGrid({ onNavigate }: QuickAccessGridProps) {
  return (
    <section className="animate-slide-up" style={{ animationDelay: "0.05s" }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold tracking-tight">快速访问</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onNavigate?.(tool.id)}
            className="group relative flex items-start gap-3 p-4 rounded-2xl border border-border/50 bg-card card-shadow hover:card-shadow-hover hover:-translate-y-0.5 hover:border-border/80 transition-all duration-200 text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-200">
              {tool.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{tool.name}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed line-clamp-1">
                {tool.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
