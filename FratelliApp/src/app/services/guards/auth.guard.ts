import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate{

    constructor(private router: Router, private storage: Storage){

    }
    canActivate(route: ActivatedRouteSnapshot){
    return this.storage.get('user')
    .then((user) => {
        return user ? true: this.router.parseUrl('auth');
      });
    }
}