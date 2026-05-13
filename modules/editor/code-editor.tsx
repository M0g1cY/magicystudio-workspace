"use client"

import { useEffect, useRef, useState } from "react"
import Editor, { type OnMount } from "@monaco-editor/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save, Download, Upload, FileCode, Eye } from "lucide-react"
import { fileStorage } from "@/lib/storage/db"
import { getFileType } from "@/lib/utils"
import type { editor } from "monaco-editor"

interface CodeEditorProps {
  fileId?: string
  initialValue?: string
  initialLanguage?: string
  initialFileName?: string
  onSave?: (content: string) => void
}

export function CodeEditor({
  fileId,
  initialValue = "",
  initialLanguage = "typescript",
  initialFileName = "untitled.ts",
  onSave,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialValue)
  const [fileName, setFileName] = useState(initialFileName)
  const [language, setLanguage] = useState(initialLanguage)
  const [isSaving, setIsSaving] = useState(false)
  const [savedFileId, setSavedFileId] = useState<string | undefined>(fileId)
  const [showPreview, setShowPreview] = useState(false)
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setCode(initialValue)
    setFileName(initialFileName)
    setLanguage(initialLanguage)
    setSavedFileId(fileId)
  }, [fileId, initialValue, initialFileName, initialLanguage])

  useEffect(() => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current)

    autoSaveTimerRef.current = setTimeout(() => {
      if (code && code !== initialValue) {
        handleSaveToStorage()
      }
    }, 3000)

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current)
    }
  }, [code, fileName])

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor
  }

  const handleSaveToStorage = async () => {
    if (!code) return

    try {
      setIsSaving(true)
      if (savedFileId) {
        await fileStorage.update(savedFileId, {
          name: fileName,
          type: getFileType(fileName),
          content: code,
          size: new Blob([code]).size,
        })
      } else {
        const id = await fileStorage.add({
          name: fileName,
          type: getFileType(fileName),
          content: code,
          size: new Blob([code]).size,
        })
        setSavedFileId(id)
      }
      onSave?.(code)
    } catch (error) {
      console.error("Save failed:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSave = async () => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current)
    await handleSaveToStorage()
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".ts,.tsx,.js,.jsx,.json,.md,.csv,.txt"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const content = await file.text()
      setFileName(file.name)
      setCode(content)
      const ext = file.name.split(".").pop()?.toLowerCase() || ""
      const langMap: Record<string, string> = {
        ts: "typescript", tsx: "typescript",
        js: "javascript", jsx: "javascript",
        json: "json", md: "markdown", csv: "plaintext", txt: "plaintext",
      }
      setLanguage(langMap[ext] || "plaintext")
      setSavedFileId(undefined)
    }
    input.click()
  }

  const isMarkdown = language === "markdown"

  return (
    <div className="h-full flex flex-col rounded-md border border-border/60 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-card">
        <div className="flex items-center gap-2 flex-1">
          <FileCode className="w-4 h-4 text-muted-foreground" />
          <Input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="max-w-xs h-8 text-sm bg-background"
          />
          {savedFileId && (
            <span className="text-caption text-muted-foreground">已保存</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isSaving && (
            <span className="text-caption text-primary">保存中...</span>
          )}
          {isMarkdown && (
            <Button
              onClick={() => setShowPreview(!showPreview)}
              size="sm"
              variant={showPreview ? "default" : "outline"}
              className="h-8 text-xs"
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              预览
            </Button>
          )}
          <Button onClick={handleImport} size="sm" variant="outline" className="h-8 text-xs">
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            导入
          </Button>
          <Button onClick={handleSave} size="sm" variant="outline" className="h-8 text-xs">
            <Save className="w-3.5 h-3.5 mr-1.5" />
            保存
          </Button>
          <Button onClick={handleDownload} size="sm" variant="outline" className="h-8 text-xs">
            <Download className="w-3.5 h-3.5 mr-1.5" />
            导出
          </Button>
        </div>
      </div>
      <div className="flex-1 flex">
        <div className={`${isMarkdown && showPreview ? "w-1/2" : "w-full"} h-full`}>
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value || "")}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: "on",
              automaticLayout: true,
              tabSize: 2,
              padding: { top: 12 },
              wordWrap: isMarkdown ? "on" : "off",
            }}
          />
        </div>
        {isMarkdown && showPreview && (
          <div className="w-1/2 h-full border-l border-border/60 overflow-auto p-6 bg-background">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <MarkdownRenderer content={code} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n")
  const elements: React.ReactNode[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="text-base font-semibold mt-4 mb-2">{line.slice(4)}</h3>)
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={i} className="text-lg font-semibold mt-5 mb-2">{line.slice(3)}</h2>)
    } else if (line.startsWith("# ")) {
      elements.push(<h1 key={i} className="text-xl font-bold mt-6 mb-3">{line.slice(2)}</h1>)
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <li key={i} className="text-sm text-foreground ml-4 list-disc">{line.slice(2)}</li>
      )
    } else if (line.startsWith("```")) {
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i])
        i++
      }
      elements.push(
        <pre key={i} className="bg-muted/50 rounded p-3 text-xs font-mono overflow-x-auto my-2">
          {codeLines.join("\n")}
        </pre>
      )
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />)
    } else {
      elements.push(<p key={i} className="text-sm text-foreground leading-relaxed">{line}</p>)
    }
  }

  return <>{elements}</>
}
