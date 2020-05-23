import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent implements OnInit {

  active: string;
  constructor(
    private router: Router,
    ) { 
      this.active = sessionStorage.getItem('path') ? sessionStorage.getItem('path') : 'painel';
  }

  ngOnInit(): void {


  }
  goToPage(index:string){
    this.active = index;
    sessionStorage.setItem('path', index);
    this.router.navigateByUrl(index);
  }

}
