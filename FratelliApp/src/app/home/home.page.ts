import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private nativePageTransitions: NativePageTransitions, private router: Router, private storage: Storage) { }

  ngOnInit() {
  }

  goToMenu(){
    let options: NativeTransitionOptions = {
      direction: 'left',
      duration: 500,
      iosdelay: 100,
      androiddelay: 100,
      slowdownfactor: -1,
     }
     this.nativePageTransitions.slide(options);
     this.router.navigateByUrl('menu');
  }

  logout(){
    this.storage.remove('user');
    this.router.navigateByUrl('auth');
  }
}
