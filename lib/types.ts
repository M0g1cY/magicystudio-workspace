/** 文件实体 */
export interface FileItem {
  id: string
  name: string
  type: string
  content: string
  size: number
  createdAt: number
  updatedAt: number
}

/** 编辑器选中文件（可能来自文件管理器或最近文件） */
export interface SelectedFile {
  id?: string
  name?: string
  type?: string
  content?: string
}

/** 项目实体 */
export interface Project {
  id: string
  name: string
  description: string
  techStack: string[]
  status: "not-started" | "in-progress" | "completed"
  createdAt: number
  updatedAt: number
  milestones: Milestone[]
  logs: LogEntry[]
  associatedFiles: AssociatedFile[]
}

export interface Milestone {
  id: string
  title: string
  status: "not-started" | "in-progress" | "completed"
  createdAt: number
}

export interface LogEntry {
  id: string
  content: string
  type: "update" | "bugfix" | "feature"
  createdAt: number
}

export interface AssociatedFile {
  fileId: string
  fileName: string
}

/** 待办事项 */
export interface Todo {
  id: string
  content: string
  completed: boolean
  projectId?: string
  createdAt: number
  updatedAt: number
}
