import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Evento } from '../models/evento.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventoService {
  private apiUrl = 'http://localhost:3000/api/eventos';

  constructor(private http: HttpClient) {}

  crearEvento(data: Evento) {
    return this.http.post(this.apiUrl, data);
  }

  obtenerSalones() {
    return this.http.get('http://localhost:3000/api/salones');
  }

  obtenerEventos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  // 👇 ESTA ES LA CLAVE
  obtenerResumen(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/resumen`);
  }
  finalizarEvento(id: number) {
  return this.http.put(`${this.apiUrl}/${id}/finalizar`, {}); // 👇 ESTA ES NUEVA
  }
  actualizarEvento(id: number, data: any) {
  return this.http.put(`${this.apiUrl}/${id}`, data);
  }
  eliminarEvento(id: number) {
  return this.http.delete(`${this.apiUrl}/${id}`);
  }
  obtenerServicios() {
    return this.http.get('http://localhost:3000/api/servicios/estructura');
  }
}
