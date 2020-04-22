import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate{

    constructor(private router: Router){

    }
    canActivate(route: ActivatedRouteSnapshot){
        return  this.router.parseUrl('auth');
    }
}