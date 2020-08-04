import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from 'rxjs/operators';
import { adminCredentials } from '../environments/environment';
import { auth } from 'firebase/app';

 
@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate{

    constructor(private router: Router, private afs: AngularFireAuth){

    }

    async canActivate(route: ActivatedRouteSnapshot){
      return new Promise<boolean>((res) => { 
        this.afs.authState.pipe(first()).toPromise()
        .then(async authentication => {
          if(authentication){
            res(true);
          }else{
            await this.afs.setPersistence(auth.Auth.Persistence.LOCAL);
            this.afs.signInWithEmailAndPassword(adminCredentials.email, adminCredentials.password).then(login => {
              if(login){
                res(true);
              }
              res(false);
            });
          }
        });
      });
    }
}