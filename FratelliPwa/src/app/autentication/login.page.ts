import { Component, OnInit,} from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations'
import { AuthProvider } from '../../providers/auth';
import { FirebaseProvider } from '../../providers/firebase';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateX(100%)', opacity: 0.85}),
        animate('300ms ease-in', style({transform: 'translateX(0%)', opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translateX(0%)', opacity: 0.85}),
        animate('300ms ease-out', style({transform: 'translateX(100%)', opacity: 1}))
      ])
      
    ])
  ]
})
export class LoginPage implements OnInit {
  login = true;
  register = false;
  loginForm = {
    email: '',
    password: ''
  }

  registerForm = {
    name: '',
    email: '',
    tel: '',
    password: ''
  }
  constructor(
      private authProvider: AuthProvider, 
      private firebaseProvider: FirebaseProvider, 
      private loadingController: LoadingController,
      private router: Router,
      private storage: Storage,
      private toastCtrl: ToastController
    ){ 
      // this.keyboard.onKeyboardDidShow()
      // .subscribe(() => {
      //   if(this.register){
      //     document.getElementById("bg-register").style.height = "165%";
      //   }else{
      //     document.getElementById("bg-login").style.height = "165%";
      //   }
      // });
      // this.keyboard.onKeyboardDidHide()
      // .subscribe(() => {
      //   if(this.register){
      //     document.getElementById("bg-register").style.height = "100%";
      //   }else{
      //     document.getElementById("bg-login").style.height = "100%";
      //   }
      // });
  }

  async fazerLogin(){
    const load = await this.loadingController.create({message: 'Checando dados...'});
    load.present();
    this.authProvider.login(this.loginForm)
      .then((res) => {
        let uid = res.user.uid;
        this.firebaseProvider.getUser(uid)
        .then((res) =>{
          let data = res.data();
          this.storage.set('user', data)
          .then(() => {
            load.dismiss();
            this.router.navigateByUrl('home');
          });
        });
        
      })
      .catch((err) => {
        load.dismiss();
        this.toastError('Usuário ou senha incorretos.');
      });
  }
  async fazerCadastro(){
    const load = await this.loadingController.create({message: 'Validando registro...'});
    load.present();
    this.authProvider.register(this.registerForm)
      .then((res) => {
        let uid = res.user.uid;
        // Organizando dados
        let data = {
          name: this.registerForm.name,
          email: this.registerForm.email,
          tel: this.registerForm.tel,
          uid: uid,
          pontos_fidelidade: 0
        };
        // Salvando usuario no firestore
        this.firebaseProvider.postUser(data)
          .then(() => { 
            this.storage.set('user', data)
            .then(() => {
              load.dismiss();
              this.router.navigateByUrl('home');
            });
          });
      })
      .catch((err) => {
        load.dismiss();
        this.toastError(err);
      });
  }

  ngOnInit(){
    this.storage.get('user')
    .then((user) => {
      if(user){
        this.router.navigateByUrl('home');
      }
    });
    
  }
  
  goToLogin(){
    this.login = true;
    this.register = false;
  }

  goToRegister(){
    this.login = false;
    this.register = true;
    
  }

  async toastError(text) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 3000,
      color: "danger"
    });
    toast.present();
  }

  

}

