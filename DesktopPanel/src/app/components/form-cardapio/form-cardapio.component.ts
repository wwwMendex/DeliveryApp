import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseProvider } from 'src/providers/firebase';


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
    private formBuilder: FormBuilder,
    private fb: FirebaseProvider,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
      this.initForm();
  }

  ngOnInit(): void {
  }
  initForm() {
    console.log(this.data);
    
    this.formulario = this.formBuilder.group({
      type: [this.data?.type ||'', Validators.required],
      sub_type: [this.data?.sub_type ||'', Validators.required],
      name: [this.data?.name ||'', Validators.required],
      description: [this.data?.description || '', Validators.required],
      price: [this.data?.price || '', Validators.required],
      id: this.data?.id || (Date.now() + Math.random()).toString().replace('.', ''),
      promo: false
    });
  }
  submitForm(){
    if(this.formulario.get('type').value =='bebida')
      this.formulario.get('sub_type').setValue('option');
    if(this.formulario.valid){
      const price = this.formulario.get('price').value.toString().match(/[\d\.\,]+/g).toString();
      this.formulario.get('price').setValue(parseFloat(price.replace(/,/g, '.')));
      this.fb.criarItem(this.formulario.value);
      this.closeDialog(true);
    }else{
      alert('Confira se o formulário está preenchido corretamente.');
    }
  }
  deleteItem(){
    if(confirm("Você deseja remover o item?")){
      this.fb.deleteItem(this.formulario.value);
      this.closeDialog(true);
    }
  }

  closeDialog(action=false) {
    this.dialogRef.close(action);
  }

}
