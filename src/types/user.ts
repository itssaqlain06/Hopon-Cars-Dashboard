// src/types/user.ts
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface NewUser {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive';
}
