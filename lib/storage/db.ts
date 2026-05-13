import { openDB, DBSchema, IDBPDatabase } from 'idb';

// 数据库结构定义
interface MagicYStudioDB extends DBSchema {
  files: {
    key: string;
    value: {
      id: string;
      name: string;
      type: string;
      content: string;
      size: number;
      createdAt: number;
      updatedAt: number;
    };
    indexes: { 'by-type': string; 'by-date': number };
  };
  projects: {
    key: string;
    value: {
      id: string;
      name: string;
      description: string;
      techStack: string[];
      status: 'not-started' | 'in-progress' | 'completed';
      createdAt: number;
      updatedAt: number;
      milestones: Array<{
        id: string;
        title: string;
        status: 'not-started' | 'in-progress' | 'completed';
        createdAt: number;
      }>;
      logs: Array<{
        id: string;
        content: string;
        type: 'update' | 'bugfix' | 'feature';
        createdAt: number;
      }>;
      associatedFiles: Array<{
        fileId: string;
        fileName: string;
      }>;
    };
  };
  todos: {
    key: string;
    value: {
      id: string;
      content: string;
      completed: boolean;
      projectId?: string;
      createdAt: number;
      updatedAt: number;
    };
  };
}

const DB_NAME = 'magicy-studio-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<MagicYStudioDB> | null = null;

// 初始化数据库
export async function initDB(): Promise<IDBPDatabase<MagicYStudioDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<MagicYStudioDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // 文件存储
      if (!db.objectStoreNames.contains('files')) {
        const fileStore = db.createObjectStore('files', { keyPath: 'id' });
        fileStore.createIndex('by-type', 'type');
        fileStore.createIndex('by-date', 'updatedAt');
      }

      // 项目存储
      if (!db.objectStoreNames.contains('projects')) {
        db.createObjectStore('projects', { keyPath: 'id' });
      }

      // 待办事项存储
      if (!db.objectStoreNames.contains('todos')) {
        db.createObjectStore('todos', { keyPath: 'id' });
      }
    },
  });

  return dbInstance;
}

// 文件操作
export const fileStorage = {
  async add(file: Omit<MagicYStudioDB['files']['value'], 'id' | 'createdAt' | 'updatedAt'>) {
    const db = await initDB();
    const id = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    await db.add('files', {
      ...file,
      id,
      createdAt: now,
      updatedAt: now,
    });
    return id;
  },

  async get(id: string) {
    const db = await initDB();
    return db.get('files', id);
  },

  async getAll() {
    const db = await initDB();
    return db.getAll('files');
  },

  async getByType(type: string) {
    const db = await initDB();
    return db.getAllFromIndex('files', 'by-type', type);
  },

  async update(id: string, updates: Partial<MagicYStudioDB['files']['value']>) {
    const db = await initDB();
    const file = await db.get('files', id);
    if (!file) throw new Error('File not found');
    await db.put('files', {
      ...file,
      ...updates,
      updatedAt: Date.now(),
    });
  },

  async delete(id: string) {
    const db = await initDB();
    await db.delete('files', id);
  },
};

// 项目操作
export const projectStorage = {
  async add(project: Omit<MagicYStudioDB['projects']['value'], 'id' | 'createdAt' | 'updatedAt'>) {
    const db = await initDB();
    const id = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    await db.add('projects', {
      ...project,
      id,
      createdAt: now,
      updatedAt: now,
    });
    return id;
  },

  async get(id: string) {
    const db = await initDB();
    return db.get('projects', id);
  },

  async getAll() {
    const db = await initDB();
    return db.getAll('projects');
  },

  async update(id: string, updates: Partial<MagicYStudioDB['projects']['value']>) {
    const db = await initDB();
    const project = await db.get('projects', id);
    if (!project) throw new Error('Project not found');
    await db.put('projects', {
      ...project,
      ...updates,
      updatedAt: Date.now(),
    });
  },

  async delete(id: string) {
    const db = await initDB();
    await db.delete('projects', id);
  },
};

// 待办事项操作
export const todoStorage = {
  async add(todo: Omit<MagicYStudioDB['todos']['value'], 'id' | 'createdAt' | 'updatedAt'>) {
    const db = await initDB();
    const id = `todo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    await db.add('todos', {
      ...todo,
      id,
      createdAt: now,
      updatedAt: now,
    });
    return id;
  },

  async get(id: string) {
    const db = await initDB();
    return db.get('todos', id);
  },

  async getAll() {
    const db = await initDB();
    return db.getAll('todos');
  },

  async update(id: string, updates: Partial<MagicYStudioDB['todos']['value']>) {
    const db = await initDB();
    const todo = await db.get('todos', id);
    if (!todo) throw new Error('Todo not found');
    await db.put('todos', {
      ...todo,
      ...updates,
      updatedAt: Date.now(),
    });
  },

  async delete(id: string) {
    const db = await initDB();
    await db.delete('todos', id);
  },
};

