import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { showAlertDialog } from '../alert-component/alert-component.component';

@Component({
  selector: 'app-form-entregadores',
  templateUrl: './form-entregadores.component.html',
  styleUrls: ['./form-entregadores.component.scss']
})
export class FormEntregadoresComponent implements OnInit {

  entregadoresForm = new FormGroup ({
    nome: new FormControl(),
  });
  entregadores:any = JSON.parse(localStorage.getItem('entregadores')) || [];

  constructor(
    public dialogRef: MatDialogRef<FormEntregadoresComponent>,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) { 
    this.entregadoresForm = this.formBuilder.group({
      nome: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  cadastrarEntregador(){
    if(this.entregadoresForm.valid){
      this.entregadores.push(this.entregadoresForm.value);
      localStorage.setItem('entregadores', JSON.stringify(this.entregadores));
      this.entregadoresForm.reset();
    }
  }
  
  async removerEntregador(index){
    if(await showAlertDialog({
      type: 'confirm',
      title: 'Confirme',
      text: `Realmente deseja remover o entregador ${this.entregadores[index].nome}?`,
      btnFalse: 'Voltar',
      btnTrue: 'Sim!',
      inputLabel: null
    }, this.dialog)){
      this.entregadores.splice(index, 1);
      localStorage.setItem('entregadores', JSON.stringify(this.entregadores));
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
