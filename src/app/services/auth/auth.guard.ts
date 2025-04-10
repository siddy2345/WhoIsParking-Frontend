import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { IdentityClient } from '../whoIsParking-api.service';
import { catchError, map, of } from 'rxjs';
import { USER_EMAIL } from '../../models/shared.models';
import { HttpErrorResponse } from '@angular/common/http';
/**
 * Function to check if the route can be activated
 * @param route
 * @param state
 * @returns boolean wether the route can be activated or not
 */
export const canActivate: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const identityService = inject(IdentityClient);

  return identityService.infoGet().pipe(
    map((userInfo) => {
      if (userInfo.email) {
        localStorage.setItem(USER_EMAIL, userInfo.email);
        return true;
      }
      return false;
    }),
    catchError((err: HttpErrorResponse) => {
      console.error(err.message);

      return of(router.createUrlTree(['login']));
    })
  );
};
