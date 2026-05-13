"use client"

import { useRouter } from "next/navigation"
import { FileManager } from "@/modules/file-manager/file-manager"
import { useFileContext } from "@/lib/context/file-context"
import type { FileItem } from "@/lib/types"

export default function FilesPage() {
  const router = useRouter()
  const { setSelectedFile } = useFileContext()

  const handleFileSelect = (file: FileItem) => {
    setSelectedFile({
      id: file.id,
      name: file.name,
      type: file.type,
      content: file.content,
    })
    router.push("/editor")
  }

  return <FileManager onFileSelect={handleFileSelect} />
}
