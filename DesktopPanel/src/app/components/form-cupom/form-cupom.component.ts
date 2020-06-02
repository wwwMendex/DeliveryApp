import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirebaseProvider } from 'src/providers/firebase';

@Component({
  selector: 'app-form-cupom',
  templateUrl: './form-cupom.component.html',
  styleUrls: ['./form-cupom.component.scss']
})
export class FormCupomComponent implements OnInit {
  formulario = new FormGroup ({
    type: new FormControl(),
    cupom: new FormControl(),
    value: new FormControl(),
    id: new FormControl(),
  });

  constructor(
    public dialogRef: MatDialogRef<FormCupomComponent>,
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
      type: ['', Validators.required],
      cupom: ['', Validators.required],
      value: ['', Validators.required],
      id: [(Date.now() + Math.random()).toString().replace('.', ''), Validators.required]
    });
  }
  submitForm(){
    if(this.formulario.valid){
      this.formulario.get('value').setValue(parseFloat(this.formulario.get('value').value.toString().replace(/,/g, '.')));
      this.fb.criarCupom(this.formulario.value);
      this.data.push(this.formulario.value);
    }
  }
  deleteCupom(index){
    if(confirm("Você deseja remover o cupom?")){
      this.fb.deleteCupom(this.data[index].id).then(r=>console.log(r));
      
      this.data.splice(index, 1);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
