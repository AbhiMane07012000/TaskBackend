export type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN';
export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface User { id: string; name: string; email: string; role: Role; }
export interface Project { id: string; name: string; description?: string; members?: User[]; }
export interface Task { id: string; title: string; description?: string; status: Status; assignees?: User[]; projectId: string; dueDate?: string; }
export interface Notification { id: string; message: string; isRead: boolean; createdAt: string; }
export interface Plan { id: string; name: string; price: number; interval: string; }
