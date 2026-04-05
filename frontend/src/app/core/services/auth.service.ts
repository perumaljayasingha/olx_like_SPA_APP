import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RegisterPayload, User } from '../models/user.model';

const STORAGE_KEY = 'olxspa_current_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/api/v1/auth`;

  readonly currentUser = signal<User | null>(this.readStored());

  register(payload: RegisterPayload): Observable<User> {
    return this.http.post<User>(`${this.base}/register`, payload).pipe(
      tap((user) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        this.currentUser.set(user);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
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
}
