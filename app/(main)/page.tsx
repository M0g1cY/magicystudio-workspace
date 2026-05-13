"use client"

import { useRouter } from "next/navigation"
import { Dashboard } from "@/modules/dashboard/dashboard"
import { useFileContext } from "@/lib/context/file-context"
import type { FileItem } from "@/lib/types"

export default function HomePage() {
  const router = useRouter()
  const { setSelectedFile } = useFileContext()

  const handleNavigate = (page: string) => {
    const routes: Record<string, string> = {
      dashboard: "/",
      editor: "/editor",
      files: "/files",
      projects: "/projects",
      settings: "/settings",
      terminal: "/",
      claude: "/",
    }
    router.push(routes[page] || "/")
  }

  const handleFileSelect = (file: FileItem) => {
    setSelectedFile({
      id: file.id,
      name: file.name,
      type: file.type,
      content: file.content,
    })
    router.push("/editor")
  }

  return <Dashboard onNavigate={handleNavigate} onFileSelect={handleFileSelect} />
}
