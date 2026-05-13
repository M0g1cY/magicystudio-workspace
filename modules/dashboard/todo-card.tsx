"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { todoStorage } from "@/lib/storage/db"
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react"

interface Todo {
  id: string
  content: string
  completed: boolean
}

export function TodoCard() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")

  useEffect(() => { loadTodos() }, [])

  const loadTodos = async () => {
    try {
      const all = await todoStorage.getAll()
      setTodos(all.sort((a, b) => b.createdAt - a.createdAt))
    } catch {}
  }

  const handleAdd = async () => {
    if (!newTodo.trim()) return
    await todoStorage.add({ content: newTodo.trim(), completed: false })
    setNewTodo("")
    loadTodos()
  }

  const handleToggle = async (id: string, completed: boolean) => {
    await todoStorage.update(id, { completed })
    loadTodos()
  }

  const handleDelete = async (id: string) => {
    await todoStorage.delete(id)
    loadTodos()
  }

  const completedCount = todos.filter(t => t.completed).length

  return (
    <section className="animate-slide-up" style={{ animationDelay: "0.12s" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold tracking-tight">待办事项</h2>
          {todos.length > 0 && (
            <span className="text-[11px] text-muted-foreground tabular-nums">
              {completedCount}/{todos.length}
            </span>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card card-shadow overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-border/40">
          <Plus className="w-4 h-4 text-muted-foreground shrink-0" />
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd() }}
            placeholder="添加新任务..."
            className="border-0 bg-transparent h-8 px-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
          />
          {newTodo && (
            <Button size="sm" onClick={handleAdd} className="h-7 text-xs shrink-0">
              添加
            </Button>
          )}
        </div>

        <div className="max-h-[320px] overflow-y-auto">
          {todos.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-muted-foreground">暂无待办事项</p>
              <p className="text-caption text-muted-foreground/60 mt-1">用上方输入框添加新任务</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="group flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors"
              >
                <button
                  onClick={() => handleToggle(todo.id, !todo.completed)}
                  className="shrink-0 mt-px"
                >
                  {todo.completed ? (
                    <CheckCircle2 className="w-[18px] h-[18px] text-primary" />
                  ) : (
                    <Circle className="w-[18px] h-[18px] text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
                  )}
                </button>
                <span className={`flex-1 text-sm select-none ${
                  todo.completed
                    ? "text-muted-foreground/50 line-through decoration-muted-foreground/30"
                    : ""
                }`}>
                  {todo.content}
                </span>
                <Button
                  size="icon" variant="ghost"
                  className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  onClick={() => handleDelete(todo.id)}
                >
                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
