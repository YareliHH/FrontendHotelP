import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventoService } from '../../services/evento.service';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.css',
})
export class EventosComponent implements OnInit {
  salones: any[] = [];
  serviciosDisponibles: any[] = [];
  eventos: any[] = [];

  mostrarFormulario = false;

  evento: any = {};

  constructor(private eventoService: EventoService) {}

  ngOnInit(): void {
    this.loadEventos();
    this.loadSalones();
    this.loadServicios();
    this.resetFormulario();
  }

  // ================================
  // CARGAS INICIALES
  // ================================

  loadEventos() {
    this.eventoService.obtenerEventos().subscribe((data: any) => {
      this.eventos = data;
    });
  }

  loadSalones() {
    this.eventoService.obtenerSalones().subscribe((data: any) => {
      this.salones = data;
    });
  }

  loadServicios() {
    this.eventoService.obtenerServicios().subscribe((data: any) => {
      if (!data || !Array.isArray(data)) {
        console.error('La estructura de servicios no es válida:', data);
        this.serviciosDisponibles = [];
        return;
      }

      this.serviciosDisponibles = data.map((s: any) => ({
        ...s,
        seleccionado: false,
        cantidad_personas: 0,
        secciones: (s.secciones || []).map((sec: any) => ({
          ...sec,
          items: (sec.items || []).map((item: any) => ({
            ...item,
            seleccionado: false,
          })),
        })),
      }));
    });
  }

  // ================================
  // RESET FORMULARIO
  // ================================

  resetFormulario() {
    this.evento = {
      nombre_contratante: '',
      telefono1: '',
      telefono2: '',
      email: '',
      empresa: '',
      direccion_fiscal: '',
      rfc: '',
      metodo_pago: '',
      fecha_evento: '',
      nombre_evento: '',
      id_salon: null,
      hora_inicio: '',
      hora_fin: '',
      duracion_horas: 0,
      numero_personas: 0,
      precio_persona_adicional: 0,
      porcentaje_anticipo: 0,
      fecha_pago_anticipo: '',
      especificaciones_montaje: '',
      equipo_audiovisual: 'N/A',
      decoracion: 'N/A',
      guardarropa: 'N/A',
      uso_salon: 'A',
      uso_mobiliario: 'A',
      servicio_meseros: 'A',
      uso_estacionamiento: 'A',
      otros_servicios: '',
      observaciones: '',
      id_usuario: 1,
      servicios: [],
    };

    // 🔥 Limpia también selección de servicios
    this.serviciosDisponibles.forEach((s) => {
      s.seleccionado = false;
      s.cantidad_personas = 0;

      s.secciones?.forEach((sec: any) => {
        sec.items?.forEach((item: any) => {
          item.seleccionado = false;
        });
      });
    });
  }

  // ================================
  // GUARDAR EVENTO
  // ================================

  guardar() {
    const serviciosSeleccionados = this.serviciosDisponibles
      .filter((s) => s.seleccionado)
      .map((s) => ({
        id_servicio: s.id_servicio,
        cantidad_personas: s.cantidad_personas,
        itemsSeleccionados:
          s.secciones?.flatMap((sec: any) =>
            sec.items
              ?.filter((item: any) => item.seleccionado)
              .map((item: any) => item.id_item),
          ) || [],
      }));

    // 🔴 Validaciones frontend
    if (serviciosSeleccionados.length === 0) {
      alert('Debe seleccionar al menos un servicio');
      return;
    }

    if (
      serviciosSeleccionados.some(
        (s) => !s.cantidad_personas || s.cantidad_personas <= 0,
      )
    ) {
      alert('Ingrese una cantidad válida para los servicios seleccionados');
      return;
    }

    this.evento.servicios = serviciosSeleccionados;

    this.eventoService.crearEvento(this.evento).subscribe({
      next: () => {
        alert('Evento creado correctamente');
        this.loadEventos();
        this.resetFormulario();
        this.mostrarFormulario = false;
      },
      error: (err) => {
        alert(err.error?.detalle || 'Error al crear evento');
      },
    });
  }

  // ================================
  // GENERAR PDF
  // ================================

  generarContrato(id: number) {
    window.open(`http://localhost:3000/api/eventos/contrato/${id}`, '_blank');
  }
}
