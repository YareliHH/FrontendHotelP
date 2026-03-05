import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CalendarComponent } from '../calendar/calendar.component';
import { EventoService } from '../../services/evento.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CalendarComponent], // 👈 AQUÍ ESTÁ LA SOLUCIÓN
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  totalEventos = 0;
  ingresosEstimados = '$125,000';
  salonesDisponibles = 8;

  eventos: any[] = [];

  isSidebarOpen = true;
  activeRoute = 'dashboard';

  constructor(
    private router: Router,
    private eventoService: EventoService,
  ) {}

  ngOnInit(): void {
    this.obtenerEventos();
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  navigateTo(route: string): void {
    this.activeRoute = route;
    this.router.navigate([`/${route}`]);
  }

  obtenerEventos(): void {
    this.eventoService.obtenerEventos().subscribe({
      next: (data: any[]) => {
        // 🔥 Transformamos los datos del backend al formato FullCalendar
        this.eventos = data.map((e) => ({
          id: e.id_evento,
          title: `${e.nombre_contratante} - ${e.nombre_salon}`,
          start: e.fecha_evento?.split('T')[0], // evita error si viene null
          allDay: true,
          color: e.estado === 'ACTIVO' ? '#16a34a' : '#dc2626',
        }));

        this.totalEventos = this.eventos.length;

        console.log('Eventos enviados al calendario:', this.eventos);
      },
      error: (err) => {
        console.error('Error al cargar eventos', err);
      },
    });
  }
}
