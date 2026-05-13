"use client"

import { CodeEditor } from "@/modules/editor/code-editor"
import { useFileContext } from "@/lib/context/file-context"

export default function EditorPage() {
  const { selectedFile } = useFileContext()

  return (
    <CodeEditor
      fileId={selectedFile?.id}
      initialValue={selectedFile?.content}
      initialFileName={selectedFile?.name}
      initialLanguage={
        selectedFile?.type === "typescript" ? "typescript" :
        selectedFile?.type === "javascript" ? "javascript" :
        selectedFile?.type === "json" ? "json" :
        selectedFile?.type === "markdown" ? "markdown" :
        "typescript"
      }
    />
  )
}
