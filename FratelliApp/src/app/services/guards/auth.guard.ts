import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate{

    constructor(private router: Router, private storage: Storage){

    }
    async canActivate(route: ActivatedRouteSnapshot){
        const user = await this.storage.get('user');
        return user ? true : this.router.parseUrl('auth');
    }
}