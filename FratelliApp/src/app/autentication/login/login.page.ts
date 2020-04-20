import { Component, OnInit,} from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations'
import { AuthProvider } from '../../../providers/auth';
import { FirebaseProvider } from '../../../providers/firebase';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateX(100%)', opacity: 0.85}),
        animate('150ms ease-in', style({transform: 'translateX(0%)', opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translateX(0%)', opacity: 0.85}),
        animate('250ms ease-out', style({transform: 'translateX(100%)', opacity: 1}))
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
  constructor(private authProvider: AuthProvider, private firebaseProvider: FirebaseProvider, private loadingController: LoadingController) { }

  async fazerLogin(){
    const load = await this.loadingController.create({message: 'Checando dados...'});
    load.present();
    this.authProvider.login(this.loginForm)
      .then((res) => {
        console.log(res);
        load.dismiss();
      })
      .catch((err) => {
        console.log(err);
        load.dismiss();
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
          uid: uid
        };
        // Salvando usuario no firestore
        this.firebaseProvider.postUser(data)
          .then(() => {
            console.log("sucesso");
          });
        load.dismiss();

      })
      .catch((err) => {
        load.dismiss();
      });
  }

  ngOnInit() {
  }
  
  goToLogin(){
    this.login = true;
    this.register = false;
  }

  goToRegister(){
    this.login = false;
    this.register = true;
  }

  

}

