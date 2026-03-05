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

  obtenerServicios() {
    return this.http.get('http://localhost:3000/api/servicios/estructura');
  }
}
