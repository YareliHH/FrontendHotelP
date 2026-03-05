import { ServicioSeleccionado } from './servicio-seleccionado.model';


export interface Evento {
  numero_contrato?: string;
  fecha_contrato?: string;

  nombre_contratante: string;
  telefono1: string;
  telefono2?: string;
  email?: string;

  empresa?: string;
  direccion_fiscal?: string;
  rfc?: string;
  metodo_pago?: string;

  fecha_evento: string;
  nombre_evento: string;
  id_salon: number;

  hora_inicio?: string;
  hora_fin?: string;
  duracion_horas?: number;

  numero_personas: number;
  precio_persona_adicional: number;

  porcentaje_anticipo: number;
  fecha_pago_anticipo?: string;

  especificaciones_montaje?: string;
  observaciones?: string;

  // 🔥 Servicios complementarios
  equipo_audiovisual: 'A' | 'N/A';
  decoracion: 'A' | 'N/A';
  guardarropa: 'A' | 'N/A';
  uso_salon: 'A' | 'N/A';
  uso_mobiliario: 'A' | 'N/A';
  servicio_meseros: 'A' | 'N/A';
  uso_estacionamiento: 'A' | 'N/A';
  otros_servicios?: string;

  servicios: ServicioSeleccionado[];
}
