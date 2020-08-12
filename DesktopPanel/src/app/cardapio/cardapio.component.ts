import { Component, OnInit } from '@angular/core';
import { FirebaseProvider } from 'src/providers/firebase';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormCardapioComponent } from '../components/form-cardapio/form-cardapio.component';
import { FormSlidesComponent } from '../components/form-slides/form-slides.component';

@Component({
  selector: 'app-cardapio',
  templateUrl: './cardapio.component.html',
  styleUrls: ['./cardapio.component.scss']
})
export class CardapioComponent implements OnInit {
  cardapio:any = [];
  edit=false;
  constructor(
    private fb: FirebaseProvider,
    private dialog: MatDialog
  ) { }

  async ngOnInit() {
    this.cardapio = await this.fb.getCardapio();
  }
  abrirForm(item){
    let dialogRef = this.dialog.open(FormCardapioComponent, {
      height: '80vh',
      width: '40vw',
      data: item
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) this.cardapio = await this.fb.getCardapio();
      this.edit = false;
    });
  }
  abrirSlides(){
    this.dialog.open(FormSlidesComponent, {
      height: '80vh',
      width: '40vw',
    });
  }


}
