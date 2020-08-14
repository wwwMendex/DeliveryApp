import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate{

    constructor(private router: Router, private storage: Storage, private afs: AngularFireAuth){

    }
    async canActivate(route: ActivatedRouteSnapshot){
        const user = await this.storage.get('user');
        const auth = await this.afs.authState.pipe(first()).toPromise();
        return user && auth ? true : this.router.parseUrl('auth');
    }
}