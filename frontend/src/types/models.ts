// User types
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: string;
  updatedAt: string;
}

// Project types
export interface Project {
  id: number;
  name: string;
  description: string;
  owner: User;
  members: User[];
  createdAt: string;
  updatedAt: string;
}

// Task types
export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high';
  project: Project;
  assignee?: User;
  dueDate?: string;
  createdBy: User;
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

// Comment types
export interface Comment {
  id: number;
  content: string;
  task: Task;
  author: User;
  createdAt: string;
  updatedAt: string;
}

// Notification types
export interface Notification {
  id: number;
  message: string;
  type: 'task_assigned' | 'comment' | 'project_added' | 'info';
  isRead: boolean;
  recipient: User;
  createdAt: string;
}

// Plan types
export interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

// Subscription types
export interface Subscription {
  id: number;
  user: User;
  plan: Plan;
  paymentId?: string;
  orderId?: string;
  status: 'active' | 'inactive' | 'cancelled';
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
