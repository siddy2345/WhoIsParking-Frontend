import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, share, finalize } from 'rxjs/operators';
import {
  IdentityClient,
  AccessTokenResponse,
  RefreshRequest,
} from '../whoIsParking-api.service';
import {
  AUTH_TOKEN_LOCAL_STORAGE,
  REFRESH_TOKEN_LOCAL_STORAGE,
} from '../../models/shared.models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private refreshObservable: Observable<AccessTokenResponse> | null = null;

  constructor(
    private identityService: IdentityClient,
    private router: Router
  ) {}

  /** Get current access token from local storage */
  public getAccessToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_LOCAL_STORAGE);
  }

  /** Get current refresh token from local storage */
  public getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_LOCAL_STORAGE);
  }

  /** Refresh access token using the refresh token */
  public refreshToken(): Observable<AccessTokenResponse> {
    if (!this.refreshObservable) {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        return throwError(() => new Error('No refresh token available'));
      }

      this.refreshObservable = this.identityService
        .refresh(new RefreshRequest({ refreshToken }))
        .pipe(
          tap((tokenResponse) => {
            this.handleTokenResponse(tokenResponse);
          }),
          catchError((err) => {
            this.clearTokens(); // clear expired tokens
            this.router.navigate(['login']); // redirect to login
            return throwError(() => err);
          }),
          finalize(() => {
            this.refreshObservable = null; // reset observable after success/failure
          }),
          share() // share the observable among multiple subscribers
        );
    }
    return this.refreshObservable;
  }

  /** Store new tokens in local storage */
  private handleTokenResponse(tokenResponse: AccessTokenResponse): void {
    if (!tokenResponse.accessToken || !tokenResponse.refreshToken) {
      throw new Error('Response tokens not valid to store.');
    }
    localStorage.setItem(AUTH_TOKEN_LOCAL_STORAGE, tokenResponse.accessToken);
    localStorage.setItem(
      REFRESH_TOKEN_LOCAL_STORAGE,
      tokenResponse.refreshToken
    );
  }

  /** Clear tokens from local storage */
  private clearTokens(): void {
    localStorage.removeItem(AUTH_TOKEN_LOCAL_STORAGE);
    localStorage.removeItem(REFRESH_TOKEN_LOCAL_STORAGE);
  }
}
