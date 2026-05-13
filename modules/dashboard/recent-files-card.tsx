"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { fileStorage } from "@/lib/storage/db"
import { localStorage as ls, STORAGE_KEYS } from "@/lib/storage/local-storage"
import { formatDate, formatFileSize } from "@/lib/utils"
import { FileCode, FileJson, FileText, ChevronRight } from "lucide-react"
import type { FileItem } from "@/lib/types"

interface RecentFilesCardProps {
  onFileSelect?: (file: FileItem) => void
  onNavigate?: (page: string) => void
}

const fileIcon = (type: string) => {
  switch (type) {
    case "javascript":
    case "typescript": return <FileCode className="w-3.5 h-3.5" />
    case "json":       return <FileJson className="w-3.5 h-3.5" />
    default:           return <FileText className="w-3.5 h-3.5" />
  }
}

const fileTypeLabel = (name: string) => {
  const ext = name.split(".").pop()?.toLowerCase()
  const map: Record<string, { label: string; cls: string }> = {
    ts:   { label: "TS",  cls: "text-blue-400 bg-blue-400/10" },
    tsx:  { label: "TSX", cls: "text-cyan-400 bg-cyan-400/10" },
    js:   { label: "JS",  cls: "text-yellow-400 bg-yellow-400/10" },
    json: { label: "JSON", cls: "text-emerald-400 bg-emerald-400/10" },
    md:   { label: "MD",  cls: "text-violet-400 bg-violet-400/10" },
    csv:  { label: "CSV", cls: "text-green-400 bg-green-400/10" },
  }
  return map[ext || ""] || null
}

export function RecentFilesCard({ onFileSelect, onNavigate }: RecentFilesCardProps) {
  const [recentFiles, setRecentFiles] = useState<FileItem[]>([])

  useEffect(() => { loadRecentFiles() }, [])

  const loadRecentFiles = async () => {
    try {
      const recentIds: string[] = ls.get(STORAGE_KEYS.RECENT_FILES) || []
      const allFiles = await fileStorage.getAll()
      const matched = recentIds
        .map(id => allFiles.find(f => f.id === id))
        .filter(Boolean) as FileItem[]
      setRecentFiles(matched.slice(0, 6))
    } catch {}
  }

  const handleClick = (file: FileItem) => {
    onFileSelect?.(file)
  }

  if (recentFiles.length === 0) return null

  return (
    <section className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold tracking-tight">最近文件</h2>
        <Button
          size="sm" variant="ghost"
          className="text-[11px] text-muted-foreground hover:text-foreground -mr-2"
          onClick={() => onNavigate?.("files")}
        >
          全部文件
          <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
        {recentFiles.map((file) => {
          const typeTag = fileTypeLabel(file.name)
          return (
            <button
              key={file.id}
              onClick={() => handleClick(file)}
              className="group p-3 rounded-2xl border border-border/50 bg-card card-shadow hover:card-shadow-hover hover:-translate-y-0.5 transition-all duration-200 text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  {fileIcon(file.type)}
                </div>
                {typeTag && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${typeTag.cls}`}>
                    {typeTag.label}
                  </span>
                )}
              </div>
              <p className="text-xs font-medium truncate mb-0.5">{file.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {formatFileSize(file.size)} · {formatDate(file.updatedAt)}
              </p>
            </button>
          )
        })}
      </div>
    </section>
  )
}
