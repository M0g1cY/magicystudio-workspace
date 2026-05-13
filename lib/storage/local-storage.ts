// LocalStorage 工具函数
export const localStorage = {
  // 设置项
  set<T>(key: string, value: T): void {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('LocalStorage set error:', error);
    }
  },

  // 获取项
  get<T>(key: string): T | null {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('LocalStorage get error:', error);
      return null;
    }
  },

  // 删除项
  remove(key: string): void {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('LocalStorage remove error:', error);
    }
  },

  // 清空所有
  clear(): void {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('LocalStorage clear error:', error);
    }
  },
};

// 设置相关的 LocalStorage keys
export const STORAGE_KEYS = {
  THEME: 'magicy-studio-theme',
  RECENT_FILES: 'magicy-studio-recent-files',
  RECENT_TOOLS: 'magicy-studio-recent-tools',
  LAYOUT: 'magicy-studio-layout',
  EDITOR_SETTINGS: 'magicy-studio-editor-settings',
};
