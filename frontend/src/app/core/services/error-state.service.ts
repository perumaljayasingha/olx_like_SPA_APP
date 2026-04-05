import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorStateService {
  readonly message = signal<string | null>(null);

  setError(msg: string | null): void {
    this.message.set(msg);
  }

  clear(): void {
    this.message.set(null);
  }
}
