import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Salon } from '../models/salon.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalonService {

  private apiUrl = 'http://localhost:3000/api/salones';

  constructor(private http: HttpClient) {}

  getSalones(): Observable<Salon[]> {
    return this.http.get<Salon[]>(this.apiUrl);
  }

  createSalon(data: Salon) {
    return this.http.post(this.apiUrl, data);
  }

  updateSalon(id: number, data: Salon) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteSalon(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
