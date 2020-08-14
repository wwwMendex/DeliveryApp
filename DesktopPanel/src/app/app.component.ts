import { Component } from '@angular/core';
import { ImpressaoService } from '../services/impressao.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private serviceImpress: ImpressaoService){

  }
  
}


