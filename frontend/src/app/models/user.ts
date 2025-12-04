export interface User {
  id: number;
  username: string;
  email: string;
  roleName?: string; // present for admin views
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  roleName: string; // ADMIN or EDITOR
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
  roleName?: string;
}
