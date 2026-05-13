"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { projectStorage } from "@/lib/storage/db"
import { formatDate } from "@/lib/utils"
import { Layers, ChevronRight } from "lucide-react"

interface Project {
  id: string
  name: string
  description: string
  status: "not-started" | "in-progress" | "completed"
  updatedAt: number
  milestones: Array<{ id: string; title: string; status: string }>
}

interface ProjectProgressCardProps {
  onNavigate?: (page: string) => void
}

const statusConfig = {
  "in-progress": { label: "进行中", className: "bg-primary/10 text-primary" },
  "completed": { label: "已完成", className: "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" },
  "not-started": { label: "未开始", className: "bg-muted text-muted-foreground" },
}

export function ProjectProgressCard({ onNavigate }: ProjectProgressCardProps) {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => { loadProjects() }, [])

  const loadProjects = async () => {
    try {
      const all = await projectStorage.getAll()
      setProjects(all.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 4))
    } catch {}
  }

  return (
    <section className="animate-slide-up" style={{ animationDelay: "0.08s" }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold tracking-tight">项目进度</h2>
        <Button
          size="sm" variant="ghost"
          className="text-[11px] text-muted-foreground hover:text-foreground -mr-2"
          onClick={() => onNavigate?.("projects")}
        >
          全部项目
          <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card card-shadow p-8 text-center">
          <Layers className="w-8 h-8 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground mb-3">暂无项目</p>
          <Button size="sm" variant="outline" onClick={() => onNavigate?.("projects")}>
            创建第一个项目
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {projects.map((project, i) => {
            const completedMs = project.milestones.filter(m => m.status === "completed").length
            const totalMs = project.milestones.length
            const progress = totalMs > 0 ? Math.round((completedMs / totalMs) * 100) : 0
            const config = statusConfig[project.status]

            return (
              <div
                key={project.id}
                onClick={() => onNavigate?.("projects")}
                className="group p-5 rounded-2xl border border-border/60 bg-card card-shadow hover:card-shadow-hover hover:border-primary/30 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{project.name}</p>
                    <p className="text-caption text-muted-foreground mt-0.5">
                      {formatDate(project.updatedAt)}
                    </p>
                  </div>
                  <span className={`shrink-0 text-[11px] px-2 py-0.5 rounded-full font-medium ${config.className}`}>
                    {config.label}
                  </span>
                </div>

                {totalMs > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-caption">
                      <span className="text-muted-foreground">进度</span>
                      <span className="font-medium tabular-nums">{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {project.description && (
                  <p className="text-[11px] text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
                    {project.description.startsWith("当前阶段")
                      ? project.description.split("。")[0]
                      : project.description}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
