import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CalendarComponent } from '../calendar/calendar.component';
import { EventoService } from '../../services/evento.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CalendarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  totalEventos = 0;
  ingresosEstimados: number = 0; // 🔥 ahora es dinámico
  salonesDisponibles = 0;

  eventos: any[] = [];

  isSidebarOpen = true;
  activeRoute = 'dashboard';

  constructor(
    private router: Router,
    private eventoService: EventoService
  ) {}

  ngOnInit(): void {
    this.obtenerEventos();
    this.obtenerResumen();
  }

  // ================================
  // SIDEBAR
  // ================================
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  navigateTo(route: string): void {
    this.activeRoute = route;
    this.router.navigate([`/${route}`]);
  }

  // ================================
  // EVENTOS (CALENDARIO)
  // ================================
  obtenerEventos(): void {
    this.eventoService.obtenerEventos().subscribe({
      next: (data: any[]) => {
        this.eventos = data.map((e) => ({
          id: e.id_evento,
          title: `${e.nombre_contratante} - ${e.nombre_salon}`,
          start: e.fecha_evento?.split('T')[0],
          allDay: true,
          color: e.estado === 'ACTIVO' ? '#16a34a' : '#2563eb', // verde / azul 🔥
        }));

        this.totalEventos = this.eventos.length;

        console.log('Eventos enviados al calendario:', this.eventos);
      },
      error: (err) => {
        console.error('Error al cargar eventos', err);
      },
    });
  }

  // ================================
  // RESUMEN (🔥 INGRESOS DINÁMICOS)
  // ================================
  obtenerResumen(): void {
    this.eventoService.obtenerResumen().subscribe({
      next: (data: any) => {
        console.log('Resumen:', data);

        this.totalEventos = data.totalEventos || 0;
        this.salonesDisponibles = data.salonesTotales || 0;
        this.ingresosEstimados = data.ingresos || 0; // 🔥 clave
      },
      error: (err) => {
        console.error('Error al obtener resumen', err);
      }
    });
  }
}