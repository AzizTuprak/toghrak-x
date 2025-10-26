export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  token: string;
  username: string;
  role: 'ADMIN' | 'EDITOR' | 'USER';
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}
export interface PostSummary {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl?: string;
  category: Category;
  authorUsername: string;
  createdAt: string;
}
export interface PostDetail extends PostSummary {
  content: string;
}
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}
