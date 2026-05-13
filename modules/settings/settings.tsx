"use client"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/components/theme-provider"
import { Moon, Sun, Trash2, AlertTriangle } from "lucide-react"
import { initDB } from "@/lib/storage/db"

export function Settings() {
  const { theme, setTheme } = useTheme()

  const handleClearCache = () => {
    if (confirm("确定要清除所有缓存吗？此操作不可恢复。")) {
      localStorage.clear()
      alert("缓存已清除")
    }
  }

  const handleClearAllData = async () => {
    if (
      confirm(
        "警告：此操作将删除所有本地数据，包括文件、项目和待办事项。此操作不可恢复！\n\n确定要继续吗？"
      )
    ) {
      try {
        const db = await initDB()
        await db.clear("files")
        await db.clear("projects")
        await db.clear("todos")
        localStorage.clear()
        alert("所有数据已清除")
        window.location.reload()
      } catch (error) {
        console.error("Failed to clear data:", error)
        alert("清除数据失败")
      }
    }
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-heading">设置</h1>
        <p className="text-body text-muted-foreground mt-1">管理你的工作站配置</p>
      </div>

      <div className="space-y-6">
        <section className="rounded-md bg-card border border-border/60 p-5">
          <h2 className="text-sm font-medium mb-4">界面</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Sun className="w-4 h-4 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium">深色模式</p>
                <p className="text-caption text-muted-foreground">
                  切换深色/浅色主题
                </p>
              </div>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>
        </section>

        <section className="rounded-md bg-card border border-border/60 p-5 space-y-5">
          <h2 className="text-sm font-medium">数据管理</h2>
          <div>
            <p className="text-sm">缓存管理</p>
            <p className="text-caption text-muted-foreground mt-0.5 mb-3">
              清除浏览器缓存和本地存储设置
            </p>
            <Button variant="outline" size="sm" onClick={handleClearCache}>
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              清除缓存
            </Button>
          </div>

          <div className="pt-4 border-t border-border/60">
            <div className="flex items-start gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">危险区域</p>
                <p className="text-caption text-muted-foreground">
                  删除所有本地数据，包括文件、项目和待办事项
                </p>
              </div>
            </div>
            <Button variant="destructive" size="sm" onClick={handleClearAllData}>
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              删除所有数据
            </Button>
          </div>
        </section>

        <section className="rounded-md bg-card border border-border/60 p-5">
          <h2 className="text-sm font-medium mb-3">关于</h2>
          <div className="space-y-1">
            <p className="text-sm">MagicYStudio <span className="text-muted-foreground">v0.1.0</span></p>
            <p className="text-caption text-muted-foreground">
              本地优先 · 极简 · AI Native
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-4">
            {["Next.js", "TypeScript", "TailwindCSS", "shadcn/ui", "IndexedDB", "Monaco Editor"].map(
              (tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 bg-muted text-caption rounded"
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
