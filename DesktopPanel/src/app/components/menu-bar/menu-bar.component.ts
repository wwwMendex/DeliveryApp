import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent implements OnInit {

  active = "painel";
  constructor(
    private router: Router
    ) { 

  }

  ngOnInit(): void {
  }
  goToPage(index:string){
    this.active = index;
    this.router.navigateByUrl(index);
  }

}
