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
  phone: string;
}

export interface OtpRequestPayload {
  phone: string;
}

export interface OtpVerifyPayload {
  phone: string;
  otp: string;
}

export interface OtpDispatchResponse {
  message: string;
  channel: string;
  phone: string;
}

export interface AuthSessionResponse {
  token: string;
  user: User;
}
