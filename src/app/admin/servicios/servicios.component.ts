import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServicioService } from '../../services/servicio.service';
import { Servicio } from '../../models/servicio.model';

@Component({
  selector: 'app-servicios',
  imports: [FormsModule, CommonModule],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css',
})
export class ServiciosComponent implements OnInit {
  servicios: Servicio[] = [];

  servicioForm: Servicio = {
    nombre: '',
    descripcion: '',
    precio_unitario: 0,
    tipo: '',
    secciones: [],
  };

  editMode = false;

  constructor(private servicioService: ServicioService) {}

  ngOnInit(): void {
    this.loadServicios();
  }

  loadServicios() {
    this.servicioService.getServicios().subscribe((data) => {
      this.servicios = data;
    });
  }

guardar() {
  if (this.editMode && this.servicioForm.id_servicio) {

    this.servicioService
      .updateServicio(this.servicioForm.id_servicio, this.servicioForm)
      .subscribe(() => {
        this.resetForm();
        this.loadServicios();
      });

  } else {
    this.servicioService
      .createServicioCompleto(this.servicioForm)
      .subscribe(() => {
        this.resetForm();
        this.loadServicios();
      });

  }
}
  editar(servicio: Servicio) {
    this.servicioForm = { ...servicio };
    this.editMode = true;
  }

  eliminar(id: number) {
    this.servicioService
      .deleteServicio(id)
      .subscribe(() => this.loadServicios());
  }

  resetForm() {
    this.servicioForm = {
      nombre: '',
      descripcion: '',
      precio_unitario: 0,
      tipo: '',
    };
    this.editMode = false;
  }

  agregarSeccion() {
    this.servicioForm.secciones?.push({
      titulo: '',
      tipo_seccion: 'FIJA',
      minimo_opciones: null,
      maximo_opciones: null,
      items: [],
    });
  }

  eliminarSeccion(index: number) {
    this.servicioForm.secciones?.splice(index, 1);
  }

  agregarItem(seccionIndex: number) {
    this.servicioForm.secciones?.[seccionIndex].items.push({
      nombre: '',
    });
  }

  eliminarItem(seccionIndex: number, itemIndex: number) {
    this.servicioForm.secciones?.[seccionIndex].items.splice(itemIndex, 1);
  }
}
