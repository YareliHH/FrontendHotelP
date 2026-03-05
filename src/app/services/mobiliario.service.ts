import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Mobiliario {
  id: number;
  tipo: string;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class MobiliarioService {

  private apiUrl = 'http://localhost:3000/api/mobiliario';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Mobiliario[]> {
    return this.http.get<Mobiliario[]>(this.apiUrl);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

}