"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Home,
  FileCode,
  FolderOpen,
  Layers,
  Settings,
  PanelLeftClose,
  PanelLeft,
  ChevronRight,
} from "lucide-react"
import { FileProvider } from "@/lib/context/file-context"

const navigation = [
  { href: "/",           label: "首页",       icon: Home },
  { href: "/editor",     label: "编辑器",     icon: FileCode },
  { href: "/files",      label: "文件管理器", icon: FolderOpen },
  { href: "/projects",   label: "项目管理",   icon: Layers },
  { href: "/settings",   label: "设置",       icon: Settings },
] as const

const pageTitle: Record<string, string> = {
  "/": "首页",
  "/editor": "编辑器",
  "/files": "文件管理器",
  "/projects": "项目管理",
  "/settings": "设置",
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()

  return (
    <FileProvider>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "w-56" : "w-0"
          } transition-all duration-200 border-r border-border/50 flex flex-col overflow-hidden shrink-0`}
        >
          <Link href="/" className="flex items-center gap-2.5 px-5 h-14 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">M</span>
            </div>
            <h1 className="text-sm font-semibold tracking-tight">MagicY</h1>
          </Link>

          <nav className="flex-1 px-3 py-3 space-y-0.5">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="px-5 py-3 border-t border-border/40">
            <p className="text-[11px] text-muted-foreground/60">MagicYStudio v0.1.0</p>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Breadcrumb Header */}
          <header className="h-14 border-b border-border/50 flex items-center px-6 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 mr-3"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <PanelLeftClose className="w-4 h-4 text-muted-foreground" />
              ) : (
                <PanelLeft className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-muted-foreground/60">MagicYStudio</span>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
              <span className="text-foreground/80 font-medium">
                {pageTitle[pathname] || "页面"}
              </span>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-6xl mx-auto px-6 lg:px-8 xl:px-10 py-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </FileProvider>
  )
}
