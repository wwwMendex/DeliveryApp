import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-enderecos',
  templateUrl: './enderecos.page.html',
  styleUrls: ['./enderecos.page.scss'],
})
export class EnderecosPage implements OnInit {

  constructor(private modalCtrl: ModalController, public formBuilder: FormBuilder) { }
  bairroSelect:any;
  formEndereco: FormGroup;
  isSubmitted = false;
  bairros = [
    {nome : "Santa Helena", valor : 5},
    {nome : "São Lourenço", valor : 3},
    {nome : "Centro", valor : 2},
    {nome : "Planejada I/II/III", valor : 5},
    {nome : "Lago do Taboão", valor : 2},
    
  ];
  ngOnInit() {
    this.formEndereco = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      rua: ['', [Validators.required, Validators.minLength(5)]],
      numero: ['', Validators.required],
      complemento: [],
      referencia: [],
      bairro: ['', Validators.required]

    });
  }

  cadastrarEndereco() {
    this.isSubmitted = true;
    if (!this.formEndereco.valid) {
      console.log('Informe todos os campos')
      return false;
    } else {
      console.log(this.formEndereco.value)
    }
  }
  get errorControl() {
    return this.formEndereco.controls;
  }


  async closeModal(){
    await this.modalCtrl.dismiss();
  }

}
