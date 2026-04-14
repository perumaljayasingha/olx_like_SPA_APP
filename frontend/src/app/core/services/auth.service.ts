import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthSessionResponse,
  OtpDispatchResponse,
  OtpRequestPayload,
  OtpVerifyPayload,
  RegisterPayload,
  User,
} from '../models/user.model';

const STORAGE_KEY = 'olxspa_current_user';
const TOKEN_KEY = 'olxspa_auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/api/v1/auth`;

  readonly currentUser = signal<User | null>(this.readStored());
  readonly authToken = signal<string | null>(this.readToken());

  requestRegisterOtp(payload: RegisterPayload): Observable<OtpDispatchResponse> {
    return this.http.post<OtpDispatchResponse>(`${this.base}/register/request-otp`, payload);
  }

  verifyRegisterOtp(payload: OtpVerifyPayload): Observable<AuthSessionResponse> {
    return this.http.post<AuthSessionResponse>(`${this.base}/register/verify-otp`, payload).pipe(
      tap((session) => {
        const user = session.user;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        localStorage.setItem(TOKEN_KEY, session.token);
        this.currentUser.set(user);
        this.authToken.set(session.token);
      }),
    );
  }

  requestLoginOtp(payload: OtpRequestPayload): Observable<OtpDispatchResponse> {
    return this.http.post<OtpDispatchResponse>(`${this.base}/login/request-otp`, payload);
  }

  verifyLoginOtp(payload: OtpVerifyPayload): Observable<AuthSessionResponse> {
    return this.http.post<AuthSessionResponse>(`${this.base}/login/verify-otp`, payload).pipe(
      tap((session) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session.user));
        localStorage.setItem(TOKEN_KEY, session.token);
        this.currentUser.set(session.user);
        this.authToken.set(session.token);
      }),
    );
  }

  logout(): void {
    const token = this.authToken();
    if (token) {
      this.http.post<void>(`${this.base}/logout`, { token }).subscribe({ error: () => void 0 });
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STORAGE_KEY);
    this.authToken.set(null);
    this.currentUser.set(null);
  }

  sellerIdOrDefault(): number {
    return this.currentUser()?.id ?? 1;
  }

  private readStored(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }

  private readToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
}
