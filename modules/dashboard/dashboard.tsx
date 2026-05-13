"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "./dashboard-header"
import { DashboardStats } from "./dashboard-stats"
import { QuickAccessGrid } from "./quick-access-grid"
import { ProjectProgressCard } from "./project-progress-card"
import { TodoCard } from "./todo-card"
import { RecentFilesCard } from "./recent-files-card"
import { seedDefaultData } from "@/lib/storage/seed"
import type { FileItem } from "@/lib/types"

interface DashboardProps {
  onNavigate?: (page: string) => void
  onFileSelect?: (file: FileItem) => void
}

export function Dashboard({ onNavigate, onFileSelect }: DashboardProps) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    seedDefaultData().then(() => setReady(true))
  }, [])

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3 animate-fade-in">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <span className="text-primary-foreground text-sm font-bold">M</span>
          </div>
          <p className="text-sm text-muted-foreground">正在初始化工作区...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-6 animate-fade-in">
      <DashboardHeader />
      <DashboardStats />
      <QuickAccessGrid onNavigate={onNavigate} />

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3 space-y-8">
          <ProjectProgressCard onNavigate={onNavigate} />
          <RecentFilesCard onFileSelect={onFileSelect} onNavigate={onNavigate} />
        </div>
        <div className="xl:col-span-2">
          <TodoCard />
        </div>
      </div>
    </div>
  )
}
