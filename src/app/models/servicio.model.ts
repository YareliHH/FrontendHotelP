export interface Servicio {
  id_servicio?: number;
  nombre: string;
  descripcion: string;
  precio_unitario: number;
  tipo: string;
  activo?: boolean;

  secciones?: Seccion[];
}

export interface Seccion {
  titulo: string;
  tipo_seccion: 'FIJA' | 'SELECCION';
  minimo_opciones?: number | null;
  maximo_opciones?: number | null;
  items: Item[];
}

export interface Item {
  nombre: string;
}