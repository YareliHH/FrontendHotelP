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

  modoEdicion: boolean = false;
  eventoIdEditando: number | null = null;

  constructor(private eventoService: EventoService) {}

  ngOnInit(): void {
    this.loadEventos();
    this.loadSalones();
    this.loadServicios();
    this.resetFormulario();
  }

  // ================================
  // CALCULAR DURACIÓN
  // ================================
  calcularDuracion(): void {
    if (this.evento.hora_inicio && this.evento.hora_fin) {
      const inicio = new Date(`1970-01-01T${this.evento.hora_inicio}`);
      const fin = new Date(`1970-01-01T${this.evento.hora_fin}`);

      if (fin <= inicio) {
        this.evento.duracion_horas = 0;
        return;
      }

      const diferencia =
        (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60);

      this.evento.duracion_horas = Math.round(diferencia * 10) / 10;
    }
  }

  // ================================
  // CARGAS
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
      this.serviciosDisponibles = (data || []).map((s: any) => ({
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

      equipo_audiovisual: false,
      decoracion: false,
      guardarropa: false,
      uso_salon: false,
      uso_mobiliario: false,
      servicio_meseros: false,
      uso_estacionamiento: false,

      otros_servicios: '',
      observaciones: '',
      id_usuario: 1,
      servicios: [],
    };

    this.serviciosDisponibles.forEach((s) => {
      s.seleccionado = false;
      s.cantidad_personas = 0;

      s.secciones?.forEach((sec: any) => {
        sec.items?.forEach((item: any) => {
          item.seleccionado = false;
        });
      });
    });

    this.modoEdicion = false;
    this.eventoIdEditando = null;
  }

  // ================================
  // EDITAR
  // ================================
  editarEvento(e: any) {
    this.evento = { ...e };
    this.modoEdicion = true;
    this.eventoIdEditando = e.id_evento;
    this.mostrarFormulario = true;
  }

  // ================================
  // GUARDAR / ACTUALIZAR
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
              .map((item: any) => item.id_item)
          ) || [],
      }));

    if (serviciosSeleccionados.length === 0) {
      alert('Debe seleccionar al menos un servicio');
      return;
    }

    if (
      serviciosSeleccionados.some(
        (s) => !s.cantidad_personas || s.cantidad_personas <= 0
      )
    ) {
      alert('Ingrese una cantidad válida');
      return;
    }

    this.evento.servicios = serviciosSeleccionados;

    // 🔥 CONVERSIÓN
    this.evento.equipo_audiovisual = this.evento.equipo_audiovisual ? 'A' : 'N/A';
    this.evento.decoracion = this.evento.decoracion ? 'A' : 'N/A';
    this.evento.guardarropa = this.evento.guardarropa ? 'A' : 'N/A';
    this.evento.uso_salon = this.evento.uso_salon ? 'A' : 'N/A';
    this.evento.uso_mobiliario = this.evento.uso_mobiliario ? 'A' : 'N/A';
    this.evento.servicio_meseros = this.evento.servicio_meseros ? 'A' : 'N/A';
    this.evento.uso_estacionamiento = this.evento.uso_estacionamiento ? 'A' : 'N/A';

    // ====================
    // EDITAR (CORREGIDO)
    // ====================
    if (this.modoEdicion) {
      const data = {
        nombre_contratante: this.evento.nombre_contratante,
        telefono1: this.evento.telefono1,
        telefono2: this.evento.telefono2,
        email: this.evento.email,
        empresa: this.evento.empresa,
        direccion_fiscal: this.evento.direccion_fiscal,
        rfc: this.evento.rfc,
        metodo_pago: this.evento.metodo_pago,
        fecha_evento: this.evento.fecha_evento,
        nombre_evento: this.evento.nombre_evento,
        id_salon: this.evento.id_salon,
        hora_inicio: this.evento.hora_inicio,
        hora_fin: this.evento.hora_fin,
        duracion_horas: this.evento.duracion_horas,
        numero_personas: this.evento.numero_personas,
        precio_persona_adicional: this.evento.precio_persona_adicional,
        porcentaje_anticipo: this.evento.porcentaje_anticipo,
        fecha_pago_anticipo: this.evento.fecha_pago_anticipo,
        especificaciones_montaje: this.evento.especificaciones_montaje,
        observaciones: this.evento.observaciones,
        equipo_audiovisual: this.evento.equipo_audiovisual,
        decoracion: this.evento.decoracion,
        guardarropa: this.evento.guardarropa,
        uso_salon: this.evento.uso_salon,
        uso_mobiliario: this.evento.uso_mobiliario,
        servicio_meseros: this.evento.servicio_meseros,
        uso_estacionamiento: this.evento.uso_estacionamiento,
        otros_servicios: this.evento.otros_servicios
      };

      this.eventoService
        .actualizarEvento(this.eventoIdEditando!, data)
        .subscribe({
          next: () => {
            alert("Evento actualizado correctamente");
            this.loadEventos();
            this.resetFormulario();
            this.mostrarFormulario = false;
          },
          error: (err) => {
            console.error("ERROR:", err);
            alert("Error al actualizar evento");
          },
        });

      return;
    }

    // ====================
    // CREAR
    // ====================
    this.eventoService.crearEvento(this.evento).subscribe({
      next: () => {
        alert('Evento creado correctamente');
        this.loadEventos();
        this.resetFormulario();
        this.mostrarFormulario = false;
      },
      error: (err) => {
        console.error(err);
        alert('Error al crear evento');
      },
    });
  }

  // ================================
  // PDF
  // ================================
  generarContrato(id: number) {
    window.open(`http://localhost:3000/api/eventos/contrato/${id}`, '_blank');
  }

  // ================================
  // FINALIZAR
  // ================================
  finalizarEvento(id: number) {
    if (!confirm("¿Finalizar evento?")) return;

    this.eventoService.finalizarEvento(id).subscribe(() => {
      alert("Finalizado");
      this.loadEventos();
    });
  }

  // ================================
  // ELIMINAR
  // ================================
  eliminarEvento(id: number) {
    if (!confirm("¿Eliminar evento?")) return;

    this.eventoService.eliminarEvento(id).subscribe(() => {
      alert("Eliminado");
      this.loadEventos();
    });
  }
}