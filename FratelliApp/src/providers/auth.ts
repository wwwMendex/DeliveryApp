import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class AuthProvider{

    constructor(private afAuth: AngularFireAuth){

    }

    // Create user
    register = (data) => this.afAuth.createUserWithEmailAndPassword(data.email, data.password);

    // Login user
    login = (data) => this.afAuth.signInWithEmailAndPassword(data.email, data.password);
}