import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

export interface AlertInterface {
  type: 'prompt' | 'alert' | 'confirm';
  title: string;
  text: string | null;
  inputLabel: string | null;
  btnFalse: string | null;
  btnTrue: string | null;
}

export const showAlertDialog = (dialogData: AlertInterface, dialog) => {
  return new Promise((res)=>{
    const dialogRef = dialog.open(AlertComponentComponent, {
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      res(result);
    });
  });
  
};

@Component({
  selector: 'app-alert-component',
  templateUrl: './alert-component.component.html',
  styleUrls: ['./alert-component.component.scss']
})

export class AlertComponentComponent implements OnInit {

  inputValue: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: AlertInterface) {}

  ngOnInit(): void {
  }

}
