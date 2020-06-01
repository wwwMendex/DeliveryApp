import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FirebaseProvider } from 'src/providers/firebase';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {storage} from 'firebase';

@Component({
  selector: 'app-form-slides',
  templateUrl: './form-slides.component.html',
  styleUrls: ['./form-slides.component.scss']
})
export class FormSlidesComponent implements OnInit {
  slides:any = [];
  selected = '0';
  edit = true;
  url: "";
  formulario = new FormGroup ({
    info: new FormControl(),
    slide_url: new FormControl(),
    id: new FormControl(),
  });

  constructor(
    public dialogRef: MatDialogRef<FormSlidesComponent>,
    private formBuilder: FormBuilder,
    private fb: FirebaseProvider,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
      
  }

  async ngOnInit() {
    this.slides = await this.fb.getSlides();
    this.initForm();
    console.log(this.slides);
    
  }
  initForm() {
    this.formulario = this.formBuilder.group({
      info: [this.slides[this.selected].info || '', Validators.required],
      slide_url: [this.slides[this.selected].slide_url || '', Validators.required],
      id: [this.slides[this.selected].id || '', Validators.required],
    });
  }
  criar(){
    this.edit = false;
    this.formulario = this.formBuilder.group({
      info: ['', Validators.required],
      slide_url: ['', Validators.required],
      id: ['', Validators.required],
    });
  }
  editar(){
    this.edit = true;
    this.initForm();
  }
  editSlide(){
    let slide = this.slides[this.selected];
    this.formulario.get('id').setValue(slide.id);
    this.formulario.get('slide_url').setValue(slide.slide_url);
    this.fb.criarSlide(this.formulario.value);
    this.slides[this.selected] = this.formulario.value;
  }
  uploadSlide(event){
    let file = event.target.files.item(0);
    let metadata = {'contentType': file.type};
    const reference = storage().ref(`/Slides/${file.name}`);
    reference.put(file, metadata).then( () => 
      reference.getDownloadURL().then(url => this.url = url)
    );
    
  }
  createSlide(){
    this.formulario.get('slide_url').setValue(this.url);
    this.formulario.get('id').setValue((Date.now() + Math.random()).toString().replace('.', ''));
    if(this.formulario.valid){
      this.fb.criarSlide(this.formulario.value);
      this.slides.push(this.formulario.value);
      this.editar();
    }
  }
  deleteSlide(id){
    if(confirm("Você deseja apagar o slide?")){
      this.fb.deleteSlide(id);
      this.slides.splice(this.selected, 1);
      this.selected = '0';
    }
  }
  closeDialog(action=false) {
    this.dialogRef.close(action);
  }

}
