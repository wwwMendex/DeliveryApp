import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private storage: Storage,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async closeModal(){
    await this.modalCtrl.dismiss();
  }
  logout(){
    this.storage.remove('user');
    this.router.navigateByUrl('auth');
  }

}
