import { Component, OnInit } from '@angular/core';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private nativePageTransitions: NativePageTransitions, private router: Router) { }

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

}
