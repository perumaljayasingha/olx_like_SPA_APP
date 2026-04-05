import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ApiErrorResponse } from '../models/api-error.model';
import { ErrorStateService } from '../services/error-state.service';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errors = inject(ErrorStateService);
  errors.clear();

  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        const body = err.error as ApiErrorResponse | string | null;
        let msg = err.message;
        if (body && typeof body === 'object' && 'message' in body) {
          msg = body.message;
          if (body.fieldErrors) {
            const lines = Object.entries(body.fieldErrors).map(
              ([k, v]) => `${k}: ${v.join(', ')}`,
            );
            msg = `${msg} — ${lines.join('; ')}`;
          }
        }
        errors.setError(msg);
      } else {
        errors.setError('Unexpected error');
      }
      return throwError(() => err);
    }),
  );
};
