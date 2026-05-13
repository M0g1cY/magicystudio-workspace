"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { SelectedFile } from "@/lib/types"

interface FileContextValue {
  selectedFile: SelectedFile | null
  setSelectedFile: (file: SelectedFile | null) => void
}

const FileContext = createContext<FileContextValue>({
  selectedFile: null,
  setSelectedFile: () => {},
})

export function FileProvider({ children }: { children: ReactNode }) {
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null)
  return (
    <FileContext.Provider value={{ selectedFile, setSelectedFile }}>
      {children}
    </FileContext.Provider>
  )
}

export function useFileContext() {
  return useContext(FileContext)
}
