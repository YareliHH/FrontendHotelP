import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Servicio } from '../models/servicio.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServicioService {
  private apiUrl = 'http://localhost:3000/api/servicios';

  constructor(private http: HttpClient) {}

  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.apiUrl);
  }

  createServicio(data: Servicio) {
    return this.http.post(this.apiUrl, data);
  }

  updateServicio(id: number, data: Servicio) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteServicio(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  createServicioCompleto(data: Servicio) {
    return this.http.post(`${this.apiUrl}/completo`, data);
  }
}
