import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FirebaseProvider } from 'src/providers/firebase';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-form-taxa',
  templateUrl: './form-taxa.component.html',
  styleUrls: ['./form-taxa.component.scss']
})
export class FormTaxaComponent implements OnInit {
  formulario = new FormGroup ({
    valor: new FormControl(),
    bairro: new FormControl(),
    id: new FormControl(),
  });
  bairros: any = [];
  edit = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private fb: FirebaseProvider,
    private dialogRef: MatDialogRef<FormTaxaComponent>,
  ) { 
    this.formulario = this.formBuilder.group({
      bairro: ['', Validators.required],
      valor: ['', Validators.required],
      id: [(Date.now() + Math.random()).toString().replace('.', ''), Validators.required]
    });
  }

  async ngOnInit(){
    this.bairros = await this.fb.getTarifas();
  }

  resetForm(){
    this.formulario.reset(
      {
        bairro: '',
        valor: '',
        id: (Date.now() + Math.random()).toString().replace('.', '')
      }
    );
  }
  async submitForm(){
    if(this.formulario.valid){
      this.formulario.get('valor').setValue(parseFloat(this.formulario.get('valor').value.match(/[\d\.\,]+/g).toString().replace(/,/g, '.')));
      await this.fb.setTarifa(this.formulario.value);
      this.bairros = await this.fb.getTarifas();
      this.resetForm();
      this.edit = false;
    }
  }
  editBairro(bairro){
    this.edit = true;
    this.formulario.reset({
      bairro: bairro.bairro,
      valor: bairro.valor,
      id: bairro.id
    });
  }
  async removerBairro(){
    if (this.formulario.get('id').valid){
      this.fb.deleteTarifa(this.formulario.get('id').value);
      this.resetForm();
      this.bairros = await this.fb.getTarifas();
      this.edit = false;
    }
  }

  closeDialog(){
    this.dialogRef.close();
  }

}
