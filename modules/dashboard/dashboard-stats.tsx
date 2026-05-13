"use client"

import { useState, useEffect } from "react"
import { projectStorage, todoStorage, fileStorage } from "@/lib/storage/db"
import { localStorage as ls, STORAGE_KEYS } from "@/lib/storage/local-storage"
import { FolderGit2, FileText, CheckSquare } from "lucide-react"

interface StatItem {
  label: string
  value: string
  sub: string
  icon: React.ReactNode
}

export function DashboardStats() {
  const [stats, setStats] = useState<StatItem[]>([
    { label: "当前项目", value: "—", sub: "加载中...", icon: <FolderGit2 className="w-4 h-4" /> },
    { label: "最近文件", value: "—", sub: "加载中...", icon: <FileText className="w-4 h-4" /> },
    { label: "今日待办", value: "—", sub: "加载中...", icon: <CheckSquare className="w-4 h-4" /> },
  ])

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [projects, todos, files] = await Promise.all([
        projectStorage.getAll(),
        todoStorage.getAll(),
        fileStorage.getAll(),
      ])

      const recentFileIds: string[] = ls.get(STORAGE_KEYS.RECENT_FILES) || []
      const recentFiles = recentFileIds
        .map(id => files.find(f => f.id === id))
        .filter(Boolean)

      const latestProject = projects.sort((a, b) => b.updatedAt - a.updatedAt)[0]
      const activeTodos = todos.filter(t => !t.completed)

      const statusText: Record<string, string> = {
        "in-progress": "进行中",
        "completed": "已完成",
        "not-started": "未开始",
      }

      setStats([
        {
          label: "当前项目",
          value: latestProject?.name || "暂无项目",
          sub: latestProject?.description?.includes("当前阶段")
            ? latestProject.description.split("。")[0]
            : latestProject
              ? statusText[latestProject.status] || latestProject.status
              : "创建第一个项目",
          icon: <FolderGit2 className="w-4 h-4" />,
        },
        {
          label: "最近文件",
          value: recentFiles.length > 0 ? `${recentFiles.length} 个文件` : "暂无",
          sub: recentFiles.length > 0
            ? recentFiles.slice(0, 2).map(f => (f as any).name).join("、")
            : "上传或创建新文件",
          icon: <FileText className="w-4 h-4" />,
        },
        {
          label: "今日待办",
          value: activeTodos.length > 0 ? `${activeTodos.length} 项待完成` : todos.length > 0 ? "全部完成" : "暂无",
          sub: todos.length > 0
            ? `共 ${todos.length} 项任务`
            : "添加今日任务",
          icon: <CheckSquare className="w-4 h-4" />,
        },
      ])
    } catch {
      // keep defaults
    }
  }

  return (
    <div className="grid grid-cols-3 gap-2 animate-slide-up" style={{ animationDelay: "0.02s" }}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 p-4 rounded-2xl border border-border/50 bg-card card-shadow"
        >
          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
            {stat.icon}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground">{stat.label}</p>
            <p className="text-sm font-semibold mt-0.5 truncate">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground truncate">{stat.sub}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
