import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImpressaoService {

  constructor(private http: HttpClient) { 

  }

  imprimir(pedido: object, url: string){
    return this.http.post<any>(url, pedido);
  }
}
