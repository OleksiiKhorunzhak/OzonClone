import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserService } from '../user.service';
import { Observable } from 'rxjs';
import { UserRole } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private userService: UserService,
    private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const ui = this.userService.getUserInfo();
    const roles = next.data['roles'] as Array<UserRole>;

    if (!ui) {
      return false;
    }

    if (roles.find(x => x == ui.role)) {
      return true;
    }

    return false;
  }

}