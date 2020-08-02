import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseProvider } from 'src/providers/firebase';
import { showAlertDialog } from '../alert-component/alert-component.component'


@Component({
  selector: 'app-form-cardapio',
  templateUrl: './form-cardapio.component.html',
  styleUrls: ['./form-cardapio.component.scss'],
})
export class FormCardapioComponent implements OnInit {

  formulario = new FormGroup ({
    type: new FormControl(),
    sub_type: new FormControl(),
    name: new FormControl(),
    description: new FormControl(),
    price: new FormControl(),
    id: new FormControl(),
    promo: new FormControl(),
  });

  constructor(
    public dialogRef: MatDialogRef<FormCardapioComponent>,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private fb: FirebaseProvider,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
      this.initForm();
  }

  ngOnInit(): void {
  }
  initForm() {
    
    this.formulario = this.formBuilder.group({
      type: [this.data?.type ||'', Validators.required],
      sub_type: [this.data?.sub_type ||'', Validators.required],
      name: [this.data?.name ||'', Validators.required],
      description: [this.data?.description || '', Validators.required],
      price: [this.data?.price || '', Validators.required],
      id: this.data?.id || (Date.now() + Math.random()).toString().replace('.', ''),
      promo: this.data?.promo
    });
  }
  async submitForm(){
    if(this.formulario.get('type').value =='bebida')
      this.formulario.get('sub_type').setValue('option');
    if(this.formulario.valid){
      const price = this.formulario.get('price').value.toString().match(/[\d\.\,]+/g).toString();
      this.formulario.get('price').setValue(parseFloat(price.replace(/,/g, '.')));
      this.fb.criarItem(this.formulario.value);
      this.closeDialog(true);
    }else{
      showAlertDialog({
        type: 'alert',
        title: 'Confira',
        text: 'Parece que os dados do formulário não estão preenchidos corretamente!',
        btnFalse: null,
        btnTrue: null,
        inputLabel: null
      }, this.dialog);
    }
  }
  async deleteItem(){
    if(await showAlertDialog({
      type: 'confirm',
      title: 'Confirme',
      text: 'Realmente deseja remover o item?',
      btnFalse: 'Voltar',
      btnTrue: 'Sim!',
      inputLabel: null
    }, this.dialog)){
      this.fb.deleteItem(this.formulario.value);
      this.closeDialog(true);      
    }
  }

  closeDialog(action=false) {
    this.dialogRef.close(action);
  }

}
