import {
  HttpHandlerFn,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { TokenService } from './token.service';
/**
 * Interceptor to add bearer token as auth header
 * @param req the http request to send to the api
 * @param next the next handler
 * @returns HttpEvent as observable
 */
export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const tokenService = inject(TokenService);
  const accessToken = tokenService.getAccessToken();
  let newReq = req;

  // add access token to request
  if (accessToken) {
    newReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
  }

  if (!req.url.includes('/refresh')) {
    // handle request and catch 401 errors unless its the refresh request
    return next(newReq).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 && tokenService.getRefreshToken()) {
          return tokenService.refreshToken().pipe(
            switchMap(() => {
              // retry the request with the new access token
              const newAccessToken = tokenService.getAccessToken();
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newAccessToken}` },
              });
              return next(retryReq);
            }),
            catchError((refreshErr) => {
              // if refresh fails, propagate the original 401 error
              return throwError(() => err);
            })
          );
        }
        // if not a 401 or no refresh token, propagate the error
        return throwError(() => err);
      })
    );
    // refresh handles itself (e.g. expired token)
  } else return next(newReq);
}
