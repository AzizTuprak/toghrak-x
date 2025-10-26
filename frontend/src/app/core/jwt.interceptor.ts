import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

const BYPASS = [/\/auth\//, /\/v3\/api-docs/, /\/swagger-ui/];

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  if (BYPASS.some((r) => r.test(req.url))) return next(req);
  const auth = inject(AuthService);
  const token = auth.token;
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};
