import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImpressaoService {

  constructor(private http: HttpClient) { 

  }

  imprimir(pedido: object){
    this.http.post<any>('http://127.0.0.1:8111/imprimir', pedido).subscribe((res) => {});
  }
}
