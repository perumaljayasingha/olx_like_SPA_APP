export interface User {
  id: number;
  email: string;
  fullName: string;
  phone: string | null;
  createdAt: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}
