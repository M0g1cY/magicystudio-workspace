"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  FileCode,
  X
} from "lucide-react"
import { projectStorage, fileStorage } from "@/lib/storage/db"
import { formatDate } from "@/lib/utils"
import type { Project, Milestone, LogEntry } from "@/lib/types"

export function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newLogType, setNewLogType] = useState<"update" | "bugfix" | "feature">("update")
  const [newProject, setNewProject] = useState({ name: "", description: "", techStack: "" })
  const [availableFiles, setAvailableFiles] = useState<Array<{ id: string; name: string }>>([])
  const [showFilePicker, setShowFilePicker] = useState(false)

  useEffect(() => { loadProjects(); loadAvailableFiles() }, [])

  const loadProjects = async () => {
    try {
      const allProjects = await projectStorage.getAll()
      setProjects(allProjects)
    } catch (error) {
      console.error("Failed to load projects:", error)
    }
  }

  const loadAvailableFiles = async () => {
    try {
      const files = await fileStorage.getAll()
      setAvailableFiles(files.map(f => ({ id: f.id, name: f.name })))
    } catch {}
  }

  const refreshSelectedProject = async (id: string) => {
    const updated = await projectStorage.get(id)
    if (updated) setSelectedProject(updated as Project)
    loadProjects()
  }

  const handleCreateProject = async () => {
    if (!newProject.name) return
    try {
      const id = await projectStorage.add({
        name: newProject.name,
        description: newProject.description,
        techStack: newProject.techStack.split(",").map(s => s.trim()).filter(Boolean),
        status: "not-started",
        milestones: [],
        logs: [],
        associatedFiles: [],
      })
      setNewProject({ name: "", description: "", techStack: "" })
      setIsCreating(false)
      await loadProjects()
      const created = await projectStorage.get(id)
      if (created) setSelectedProject(created as Project)
    } catch (error) {
      console.error("Failed to create project:", error)
    }
  }

  const handleUpdateProjectStatus = async (projectId: string, status: Project["status"]) => {
    await projectStorage.update(projectId, { status } as any)
    refreshSelectedProject(projectId)
  }

  const handleAddMilestone = async (projectId: string, title: string) => {
    if (!title) return
    const project = await projectStorage.get(projectId)
    if (!project) return
    await projectStorage.update(projectId, {
      milestones: [...project.milestones, {
        id: `ms_${Date.now()}`,
        title,
        status: "not-started" as const,
        createdAt: Date.now(),
      }],
    } as any)
    refreshSelectedProject(projectId)
  }

  const handleUpdateMilestoneStatus = async (
    projectId: string, milestoneId: string, status: Milestone["status"]
  ) => {
    const project = await projectStorage.get(projectId)
    if (!project) return
    await projectStorage.update(projectId, {
      milestones: project.milestones.map(m => m.id === milestoneId ? { ...m, status } : m),
    } as any)
    refreshSelectedProject(projectId)
  }

  const handleDeleteMilestone = async (projectId: string, milestoneId: string) => {
    const project = await projectStorage.get(projectId)
    if (!project) return
    await projectStorage.update(projectId, {
      milestones: project.milestones.filter(m => m.id !== milestoneId),
    } as any)
    refreshSelectedProject(projectId)
  }

  const handleAddLog = async (projectId: string, content: string, type: LogEntry["type"]) => {
    if (!content) return
    const project = await projectStorage.get(projectId)
    if (!project) return
    await projectStorage.update(projectId, {
      logs: [...project.logs, {
        id: `log_${Date.now()}`,
        content,
        type,
        createdAt: Date.now(),
      }],
    } as any)
    refreshSelectedProject(projectId)
  }

  const handleDeleteLog = async (projectId: string, logId: string) => {
    const project = await projectStorage.get(projectId)
    if (!project) return
    await projectStorage.update(projectId, {
      logs: project.logs.filter(l => l.id !== logId),
    } as any)
    refreshSelectedProject(projectId)
  }

  const handleAssociateFile = async (projectId: string, fileId: string, fileName: string) => {
    const project = await projectStorage.get(projectId)
    if (!project) return
    const already = project.associatedFiles?.find(f => f.fileId === fileId)
    if (already) return
    await projectStorage.update(projectId, {
      associatedFiles: [...(project.associatedFiles || []), { fileId, fileName }],
    } as any)
    refreshSelectedProject(projectId)
    setShowFilePicker(false)
  }

  const handleRemoveAssociation = async (projectId: string, fileId: string) => {
    const project = await projectStorage.get(projectId)
    if (!project) return
    await projectStorage.update(projectId, {
      associatedFiles: (project.associatedFiles || []).filter(f => f.fileId !== fileId),
    } as any)
    refreshSelectedProject(projectId)
  }

  const handleDeleteProject = async (id: string) => {
    await projectStorage.delete(id)
    if (selectedProject?.id === id) setSelectedProject(null)
    loadProjects()
  }

  const statusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case "in-progress": return <Clock className="w-4 h-4 text-primary" />
      default: return <Circle className="w-4 h-4 text-muted-foreground" />
    }
  }

  const statusText = (status: string) => {
    switch (status) {
      case "completed": return "已完成"
      case "in-progress": return "进行中"
      default: return "未开始"
    }
  }

  const logTypeBadge = (type: string) => {
    switch (type) {
      case "bugfix": return "修复"
      case "feature": return "新功能"
      default: return "更新"
    }
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-heading">项目管理</h1>
        <Button size="sm" onClick={() => setIsCreating(true)}>
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          新建项目
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-1 rounded-md border border-border/60 bg-card overflow-auto">
          {isCreating && (
            <div className="p-4 border-b border-border/60 space-y-3">
              <Input
                placeholder="项目名称"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="h-9"
              />
              <Input
                placeholder="项目描述"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="h-9"
              />
              <Input
                placeholder="技术栈（逗号分隔）"
                value={newProject.techStack}
                onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                className="h-9"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleCreateProject}>创建</Button>
                <Button size="sm" variant="outline" onClick={() => setIsCreating(false)}>取消</Button>
              </div>
            </div>
          )}

          {projects.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">暂无项目，点击上方按钮创建</p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={`px-4 py-3 cursor-pointer transition-colors ${
                    selectedProject?.id === project.id
                      ? "bg-primary/5 border-l-2 border-l-primary"
                      : "hover:bg-muted/30 border-l-2 border-l-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{project.name}</p>
                      <p className="text-caption text-muted-foreground mt-0.5">
                        {formatDate(project.updatedAt)}
                      </p>
                    </div>
                    {statusIcon(project.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 rounded-md border border-border/60 bg-card overflow-auto">
          {selectedProject ? (
            <Tabs defaultValue="overview">
              <div className="px-5 pt-5 pb-0">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold">{selectedProject.name}</h2>
                  <select
                    value={selectedProject.status}
                    onChange={(e) => handleUpdateProjectStatus(selectedProject.id, e.target.value as Project["status"])}
                    className="px-2 py-1 text-xs rounded border border-border/60 bg-background"
                  >
                    <option value="not-started">未开始</option>
                    <option value="in-progress">进行中</option>
                    <option value="completed">已完成</option>
                  </select>
                </div>
                <TabsList className="bg-muted/50">
                  <TabsTrigger value="overview">概览</TabsTrigger>
                  <TabsTrigger value="milestones">进度节点</TabsTrigger>
                  <TabsTrigger value="logs">迭代日志</TabsTrigger>
                  <TabsTrigger value="files">关联文件</TabsTrigger>
                </TabsList>
              </div>

              <div className="p-5">
                <TabsContent value="overview" className="mt-0 space-y-4">
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">项目描述</h3>
                    <p className="text-sm">{selectedProject.description || "暂无描述"}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">技术栈</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.techStack.length > 0 ? selectedProject.techStack.map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 bg-muted text-caption rounded">{tech}</span>
                      )) : <span className="text-sm text-muted-foreground">未设置</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div>
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">里程碑</h3>
                      <p className="text-sm">{selectedProject.milestones.length} 个节点</p>
                    </div>
                    <div>
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">日志</h3>
                      <p className="text-sm">{selectedProject.logs.length} 条记录</p>
                    </div>
                    <div>
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">关联文件</h3>
                      <p className="text-sm">{selectedProject.associatedFiles?.length || 0} 个</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border/60">
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteProject(selectedProject.id)}>
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      删除项目
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="milestones" className="mt-0 space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="添加新的进度节点..."
                      className="h-9"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value.trim()) {
                          handleAddMilestone(selectedProject.id, e.currentTarget.value.trim())
                          e.currentTarget.value = ""
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    {selectedProject.milestones.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-6">暂无节点</p>
                    ) : (
                      selectedProject.milestones.map((m) => (
                        <div key={m.id} className="flex items-center justify-between py-2.5 px-3 rounded hover:bg-muted/30 transition-colors group">
                          <div className="flex items-center gap-2.5">
                            {statusIcon(m.status)}
                            <span className="text-sm">{m.title}</span>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <select
                              value={m.status}
                              onChange={(e) => handleUpdateMilestoneStatus(selectedProject.id, m.id, e.target.value as Milestone["status"])}
                              className="px-2 py-0.5 text-xs rounded border border-border/60 bg-background"
                            >
                              <option value="not-started">未开始</option>
                              <option value="in-progress">进行中</option>
                              <option value="completed">已完成</option>
                            </select>
                            <Button
                              size="icon" variant="ghost" className="w-7 h-7"
                              onClick={() => handleDeleteMilestone(selectedProject.id, m.id)}
                            >
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="logs" className="mt-0 space-y-4">
                  <div className="flex gap-2">
                    <select
                      value={newLogType}
                      onChange={(e) => setNewLogType(e.target.value as LogEntry["type"])}
                      className="px-2 py-1 text-xs rounded border border-border/60 bg-background h-9"
                    >
                      <option value="update">更新</option>
                      <option value="bugfix">修复</option>
                      <option value="feature">新功能</option>
                    </select>
                    <Input
                      placeholder="输入迭代日志内容..."
                      className="h-9 flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value.trim()) {
                          handleAddLog(selectedProject.id, e.currentTarget.value.trim(), newLogType)
                          e.currentTarget.value = ""
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-1 max-h-80 overflow-y-auto">
                    {selectedProject.logs.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-6">暂无日志</p>
                    ) : (
                      [...selectedProject.logs].reverse().map((log) => (
                        <div key={log.id} className="py-2.5 px-3 rounded hover:bg-muted/30 transition-colors group">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              log.type === "bugfix" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                              log.type === "feature" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                              "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            }`}>
                              {logTypeBadge(log.type)}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-caption text-muted-foreground">
                                {formatDate(log.createdAt)}
                              </span>
                              <Button
                                size="icon" variant="ghost" className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDeleteLog(selectedProject.id, log.id)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm">{log.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="files" className="mt-0 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">关联代码文件和配置文件</p>
                    <Button size="sm" variant="outline" onClick={() => { loadAvailableFiles(); setShowFilePicker(!showFilePicker) }}>
                      <Plus className="w-3.5 h-3.5 mr-1.5" />
                      关联文件
                    </Button>
                  </div>

                  {showFilePicker && (
                    <div className="border border-border/60 rounded-md p-3 max-h-40 overflow-y-auto space-y-1">
                      {availableFiles.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-3">暂无可用文件，请先在文件管理器中上传文件</p>
                      ) : (
                        availableFiles.map(f => (
                          <div
                            key={f.id}
                            onClick={() => handleAssociateFile(selectedProject.id, f.id, f.name)}
                            className="flex items-center gap-2 py-1.5 px-2 rounded text-sm cursor-pointer hover:bg-muted/30"
                          >
                            <FileCode className="w-3.5 h-3.5 text-muted-foreground" />
                            {f.name}
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  <div className="space-y-1">
                    {(selectedProject.associatedFiles || []).length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-6">未关联任何文件</p>
                    ) : (
                      (selectedProject.associatedFiles || []).map(f => (
                        <div key={f.fileId} className="flex items-center justify-between py-2 px-3 rounded hover:bg-muted/30 group">
                          <div className="flex items-center gap-2">
                            <FileCode className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-sm">{f.fileName}</span>
                          </div>
                          <Button
                            size="icon" variant="ghost" className="w-7 h-7 opacity-0 group-hover:opacity-100"
                            onClick={() => handleRemoveAssociation(selectedProject.id, f.fileId)}
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          ) : (
            <div className="flex items-center justify-center h-full text-center text-muted-foreground">
              <div>
                <Clock className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">从左侧选择一个项目查看详情</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
