import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Injectable()
export class AuthProvider{

    constructor(private afAuth: AngularFireAuth){

    }

    // Create user
    register = (data: {email: string, password: string}) => this.afAuth.createUserWithEmailAndPassword(data.email, data.password);

    // Login user
    login = async (data: {email: string, password: string}) => {
        await this.afAuth.setPersistence(auth.Auth.Persistence.LOCAL);
        return this.afAuth.signInWithEmailAndPassword(data.email, data.password);
    }
}