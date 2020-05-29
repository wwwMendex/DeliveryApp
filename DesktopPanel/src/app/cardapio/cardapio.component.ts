import { Component, OnInit } from '@angular/core';
import { FirebaseProvider } from 'src/providers/firebase';

@Component({
  selector: 'app-cardapio',
  templateUrl: './cardapio.component.html',
  styleUrls: ['./cardapio.component.scss']
})
export class CardapioComponent implements OnInit {
  cardapio:any = [];
  constructor(
    private fb: FirebaseProvider
  ) { }

  async ngOnInit() {
    this.cardapio = await this.fb.getCardapio();
  }

}
