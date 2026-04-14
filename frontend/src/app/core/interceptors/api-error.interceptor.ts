import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ApiErrorResponse } from '../models/api-error.model';
import { ErrorStateService } from '../services/error-state.service';

const FRIENDLY_ERROR_MESSAGES: Record<string, string> = {
  PHONE_NOT_REGISTERED: 'Your number is not registered. Please register first.',
  EMAIL_IN_USE: 'This email is already registered. Please login instead.',
  PHONE_IN_USE: 'This mobile number is already registered. Please login.',
  INVALID_OTP: 'Invalid OTP or OTP expired. Please request a new OTP.',
  TOKEN_MISSING: 'Please login first. Session token is missing.',
  TOKEN_INVALID: 'Your session has expired. Please login again.',
  AUTH_REQUIRED: 'Please login to continue.',
  FORBIDDEN: 'You do not have permission for this action.',
  NOT_FOUND: 'Requested data was not found.',
};

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errors = inject(ErrorStateService);
  errors.clear();

  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        const body = err.error as ApiErrorResponse | string | null;
        let msg = err.message;
        if (body && typeof body === 'object' && 'message' in body) {
          msg = FRIENDLY_ERROR_MESSAGES[body.code] ?? body.message;
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
