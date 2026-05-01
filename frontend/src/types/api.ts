// Auth request/response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

// Project request/response types
export interface CreateProjectRequest {
  name: string;
  description: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

export interface AddProjectMemberRequest {
  userId: number;
}

// Task request/response types
export interface CreateTaskRequest {
  title: string;
  description?: string;
  projectId: number;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  assigneeId?: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'completed' | 'archived';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  assigneeId?: number;
}

// Comment request types
export interface CreateCommentRequest {
  content: string;
  taskId: number;
}

export interface UpdateCommentRequest {
  content: string;
}

// User request types
export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Subscription request types
export interface CreateSubscriptionRequest {
  planId: number;
  paymentId?: string;
  orderId?: string;
}

// API Error Response
export interface ApiError {
  message: string;
  errors?: {
    [key: string]: string[];
  };
  statusCode?: number;
}
