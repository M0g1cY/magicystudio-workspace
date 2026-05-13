"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileCode,
  FileJson,
  FileText,
  Image as ImageIcon,
  Upload,
  Search,
  Trash2,
  Download,
  X,
  Eye
} from "lucide-react"
import { fileStorage } from "@/lib/storage/db"
import { formatDate, formatFileSize, getFileType } from "@/lib/utils"
import { localStorage as ls, STORAGE_KEYS } from "@/lib/storage/local-storage"
import type { FileItem } from "@/lib/types"

interface FileManagerProps {
  onFileSelect?: (file: FileItem) => void
}

function JsonPreview({ content }: { content: string }) {
  try {
    const parsed = JSON.parse(content)
    const formatted = JSON.stringify(parsed, null, 2)
    return (
      <pre className="text-xs font-mono whitespace-pre-wrap break-all overflow-auto max-h-[400px] p-4 bg-muted/30 rounded">
        {formatted}
      </pre>
    )
  } catch {
    return <p className="text-sm text-muted-foreground">无法解析 JSON</p>
  }
}

function CsvPreview({ content }: { content: string }) {
  const lines = content.trim().split("\n")
  const rows = lines.map(line => line.split(",").map(cell => cell.trim()))
  const headers = rows[0] || []
  const data = rows.slice(1)

  return (
    <div className="overflow-auto max-h-[400px] rounded border border-border/60">
      <table className="w-full text-xs">
        <thead className="bg-muted/50 sticky top-0">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-3 py-2 text-left font-medium border-b border-border/60">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 50).map((row, i) => (
            <tr key={i} className="border-b border-border/30 last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-1.5 text-muted-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > 50 && (
        <p className="text-caption text-muted-foreground p-2 text-center">
          显示前 50 行，共 {data.length} 行
        </p>
      )}
    </div>
  )
}

function MarkdownPreview({ content }: { content: string }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none overflow-auto max-h-[400px] p-4 bg-muted/30 rounded">
      <pre className="text-xs whitespace-pre-wrap">{content}</pre>
    </div>
  )
}

export function FileManager({ onFileSelect }: FileManagerProps) {
  const [files, setFiles] = useState<FileItem[]>([])
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isDragging, setIsDragging] = useState(false)
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null)
  const [recentFileIds, setRecentFileIds] = useState<string[]>([])

  useEffect(() => {
    loadFiles()
    const saved = ls.get<string[]>(STORAGE_KEYS.RECENT_FILES)
    if (saved) setRecentFileIds(saved)
  }, [])

  useEffect(() => {
    filterFiles()
  }, [files, searchQuery, activeTab])

  const loadFiles = async () => {
    try {
      const allFiles = await fileStorage.getAll()
      setFiles(allFiles)
    } catch (error) {
      console.error("Failed to load files:", error)
    }
  }

  const filterFiles = () => {
    let filtered = files

    if (activeTab !== "all") {
      if (activeTab === "typescript") {
        filtered = filtered.filter(f => f.type === "typescript" || f.type === "javascript")
      } else {
        filtered = filtered.filter(file => file.type === activeTab)
      }
    }

    if (searchQuery) {
      filtered = filtered.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    filtered.sort((a, b) => b.updatedAt - a.updatedAt)
    setFilteredFiles(filtered)
  }

  const trackRecentFile = (fileId: string) => {
    const updated = [fileId, ...recentFileIds.filter(id => id !== fileId)].slice(0, 10)
    setRecentFileIds(updated)
    ls.set(STORAGE_KEYS.RECENT_FILES, updated)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files
    if (!uploadedFiles) return

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i]
      const content = await file.text()
      await fileStorage.add({
        name: file.name,
        type: getFileType(file.name),
        content,
        size: file.size,
      })
    }
    loadFiles()
    // reset input
    event.target.value = ""
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = e.dataTransfer.files
    for (let i = 0; i < droppedFiles.length; i++) {
      const file = droppedFiles[i]
      const content = await file.text()
      await fileStorage.add({
        name: file.name,
        type: getFileType(file.name),
        content,
        size: file.size,
      })
    }
    loadFiles()
  }, [])

  const handleDelete = async (id: string) => {
    await fileStorage.delete(id)
    if (previewFile?.id === id) setPreviewFile(null)
    loadFiles()
  }

  const handleDownload = (file: FileItem) => {
    const blob = new Blob([file.content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = file.name
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleOpenFile = (file: FileItem) => {
    trackRecentFile(file.id)
    onFileSelect?.(file)
  }

  const handlePreview = (file: FileItem) => {
    trackRecentFile(file.id)
    setPreviewFile(file)
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "typescript":
      case "javascript":
        return <FileCode className="w-4 h-4" />
      case "json":
        return <FileJson className="w-4 h-4" />
      case "markdown":
      case "text":
      case "csv":
        return <FileText className="w-4 h-4" />
      case "image":
        return <ImageIcon className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const canPreview = (type: string) => ["json", "csv", "markdown"].includes(type)

  const recentFiles = files.filter(f => recentFileIds.includes(f.id))
    .sort((a, b) => recentFileIds.indexOf(a.id) - recentFileIds.indexOf(b.id))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-heading">文件管理器</h1>
        <label htmlFor="file-upload">
          <Button size="sm" asChild>
            <span className="cursor-pointer">
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              上传文件
            </span>
          </Button>
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>

      {recentFiles.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-2">最近文件</h2>
          <div className="flex gap-2 flex-wrap">
            {recentFiles.map(file => (
              <button
                key={file.id}
                onClick={() => handleOpenFile(file)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-card border border-border/60 text-xs hover:border-primary/40 transition-colors"
              >
                <span className="text-muted-foreground">{getFileIcon(file.type)}</span>
                <span className="truncate max-w-[120px]">{file.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="搜索文件..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-card"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={previewFile ? "lg:col-span-2" : "lg:col-span-3"}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-card border border-border/60">
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="typescript">TS/JS</TabsTrigger>
              <TabsTrigger value="json">JSON</TabsTrigger>
              <TabsTrigger value="csv">CSV</TabsTrigger>
              <TabsTrigger value="markdown">Markdown</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <div
                className={`border border-dashed rounded-md p-4 transition-colors ${
                  isDragging ? "border-primary bg-primary/5" : "border-border/60"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {filteredFiles.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Upload className="w-8 h-8 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">拖拽文件到这里或点击上传按钮</p>
                  </div>
                ) : (
                  <div className="space-y-1 max-h-[500px] overflow-y-auto">
                    {filteredFiles.map((file) => (
                      <div
                        key={file.id}
                        className={`flex items-center justify-between py-2.5 px-3 rounded cursor-pointer transition-colors group ${
                          previewFile?.id === file.id ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/40"
                        }`}
                        onClick={() => handleOpenFile(file)}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-muted-foreground">{getFileIcon(file.type)}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-caption text-muted-foreground">
                              {formatFileSize(file.size)} · {formatDate(file.updatedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {canPreview(file.type) && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="w-7 h-7"
                              onClick={(e) => {
                                e.stopPropagation()
                                handlePreview(file)
                              }}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-7 h-7"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownload(file)
                            }}
                          >
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-7 h-7"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(file.id)
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {previewFile && (
          <div className="lg:col-span-1">
            <div className="rounded-md border border-border/60 bg-card">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
                <p className="text-sm font-medium truncate">{previewFile.name}</p>
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-7 h-7"
                  onClick={() => setPreviewFile(null)}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="p-4">
                {previewFile.type === "json" && <JsonPreview content={previewFile.content} />}
                {previewFile.type === "csv" && <CsvPreview content={previewFile.content} />}
                {previewFile.type === "markdown" && <MarkdownPreview content={previewFile.content} />}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
