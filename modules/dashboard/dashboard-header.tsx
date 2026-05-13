"use client"

export function DashboardHeader() {
  return (
    <div className="mb-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
          <span className="text-primary-foreground text-xs font-bold">M</span>
        </div>
        <span className="text-[11px] text-muted-foreground uppercase tracking-widest font-medium">
          MagicYStudio
        </span>
      </div>
      <h1 className="text-2xl font-bold tracking-tight">
        个人 AI 开发工作站
      </h1>
      <p className="text-sm text-muted-foreground mt-1.5 max-w-lg leading-relaxed">
        统一管理编辑器、文件、项目和 AI 工具，减少软件切换，提升开发效率。
      </p>
    </div>
  )
}
