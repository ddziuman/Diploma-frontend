import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserService } from '../entity-services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | UrlTree {
    const allowedRoles = route.data['roles'] as Array<number>;

    const user = this.userService.user$.value;

    if (user && allowedRoles.includes(user.role)) {
      return of(true);
    } else {
      this.router.navigate(['/login']);
      return of(false);
    }
  }
}
