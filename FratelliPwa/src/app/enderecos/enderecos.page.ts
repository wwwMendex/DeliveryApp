import { Component, OnInit } from '@angular/core';
import { ModalController, ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Storage } from '@ionic/storage';
import { FirebaseProvider } from 'src/providers/firebase';


@Component({
  selector: 'app-enderecos',
  templateUrl: './enderecos.page.html',
  styleUrls: ['./enderecos.page.scss'],
})
export class EnderecosPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private storage: Storage,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private fb: FirebaseProvider
    ) { 

    }
  formEndereco: FormGroup;
  isSubmitted = false;
  enderecos:any = {
    nome : '',
    rua: '',
    numero: '',
    bairro: '',
    complemento: '',
    referencia: '',
    id: ''
  };
  editar = false;
  cadastrar = true;
  indexEdit:any;
  bairros:any = [];

  async ngOnInit() {
    this.formEndereco = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      rua: ['', [Validators.required, Validators.minLength(5)]],
      numero: ['', Validators.required],
      complemento: [],
      referencia: [],
      bairro: ['', Validators.required],
      id: null
    });
    this.enderecos = await this.getEnderecos();
    this.bairros = await this.fb.getBairros();
  }

  async getEnderecos(){
    let enderecoCadastrado = await this.storage.get('endereco');
    if(enderecoCadastrado && enderecoCadastrado.cadastrados.length > 0){
      let selecionado = enderecoCadastrado.cadastrados.findIndex((end:any) => {return end.id == enderecoCadastrado.selecionado});
      if(selecionado != 0){
        let temp = enderecoCadastrado.cadastrados[0];
        enderecoCadastrado.cadastrados[0] = enderecoCadastrado.cadastrados[selecionado];
        enderecoCadastrado.cadastrados[selecionado] = temp;
      }
    }
    return enderecoCadastrado ? enderecoCadastrado : [];
  }

  async cadastrarEndereco() {
    this.isSubmitted = true;
    if (!this.formEndereco.valid) {
      return false;
    } else if(this.cadastrar){
      let enderecosSalvos = await this.storage.get('endereco'); //resgata endereços já cadastrados
      let novoEndereco = enderecosSalvos ? enderecosSalvos : {cadastrados : [], selecionado: []}; //verifica se existe endereços cadastrados
      this.formEndereco.get('id').setValue((Date.now() + Math.random()).toString().replace('.', '')); // gerando id unico
      novoEndereco.cadastrados.push(this.formEndereco.value);
      novoEndereco.selecionado = this.formEndereco.get('id').value;
      await this.storage.set('endereco', novoEndereco); //armazena no storage novo endereço
      this.enderecos = await this.getEnderecos();
      const toast = await this.toastCtrl.create({
        message: "Endereço cadastrado com sucesso",
        duration: 1200,
        color: "secondary",
        position: 'top'
      });
      toast.present();
      setTimeout(() => this.closeModal(), 1000);
    }else{ // editar endereço
      this.enderecos.cadastrados[this.indexEdit] = this.formEndereco.value;
      this.storage.set('endereco', this.enderecos);
      this.cadastrar = true;
      this.editar = false;
      this.formEndereco.reset();
      this.isSubmitted = false;
      const toast = await this.toastCtrl.create({
        message: "Endereço editado com sucesso",
        duration: 1200,
        color: "secondary",
        position: 'bottom'
      });
      toast.present();
    }
  }

  async selecionarEndereco(idEnd: any){
    let enderecos = await this.storage.get('endereco');
    enderecos.selecionado = idEnd;
    await this.storage.set('endereco', enderecos);
    this.enderecos = await this.getEnderecos();
  }
 
  editarEndereco(index: any){
    this.cadastrar = false;
    this.editar = true;
    this.formEndereco.setValue(this.enderecos.cadastrados[index]);
    this.indexEdit = index;
  }

  async presentActionSheet(index: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Selecione uma ação',
      buttons: [{
        text: 'Editar',
        icon: 'create',
        handler: () => {
          this.editarEndereco(index);
        }
      }, {
        text: 'Excluir',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.confirmarRemover(index);
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

  async confirmarRemover(index:any){
    const alert = await this.alertCtrl.create({
      header: 'Deseja remover o endereço?',
      buttons: [
        {
          text: 'Não!',
          role: 'cancel',
        }, {
          text: 'Sim!',
          handler: async () => {
            //remover
            this.enderecos.cadastrados.splice(index, 1);
            if(index == 0){
              if(this.enderecos.cadastrados.length > 0){
              this.enderecos.selecionado = this.enderecos.cadastrados[0].id;
              } else {
                this.enderecos.cadastrados = [];
                this.enderecos.selecionado = "";
              }
            }
            this.storage.set('endereco', this.enderecos);
            const toast = await this.toastCtrl.create({
              message: "Endereço excluido com sucesso",
              duration: 1200,
              color: "secondary",
              position: 'bottom'
            });
            toast.present();
          }
        }
      ]
    });

    await alert.present();
  }
  
  

  get errorControl() {
    return this.formEndereco.controls;
  }


  async closeModal(){
    await this.modalCtrl.dismiss();
  }

}
