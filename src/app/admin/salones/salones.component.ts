import { Component, OnInit } from '@angular/core';
import { SalonService } from '../../services/salon.service';
import { Salon } from '../../models/salon.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-salones',
  imports: [FormsModule, CommonModule],
  templateUrl: './salones.component.html',
  styleUrl: './salones.component.css'
})
export class SalonesComponent implements OnInit {

  salones: Salon[] = [];

  salonForm: Salon = {
    nombre: '',
    capacidad: 0,
    descripcion: ''
  };

  editMode = false;

  constructor(private salonService: SalonService) {}

  ngOnInit(): void {
    this.loadSalones();
  }

  loadSalones() {
    this.salonService.getSalones().subscribe(data => {
      this.salones = data;
    });
  }

  guardar() {
    if (this.editMode && this.salonForm.id_salon) {
      this.salonService.updateSalon(this.salonForm.id_salon, this.salonForm)
        .subscribe(() => {
          this.resetForm();
          this.loadSalones();
        });
    } else {
      this.salonService.createSalon(this.salonForm)
        .subscribe(() => {
          this.resetForm();
          this.loadSalones();
        });
    }
  }

  editar(salon: Salon) {
    this.salonForm = { ...salon };
    this.editMode = true;
  }

  eliminar(id: number) {
    this.salonService.deleteSalon(id)
      .subscribe(() => this.loadSalones());
  }

  resetForm() {
    this.salonForm = {
      nombre: '',
      capacidad: 0,
      descripcion: ''
    };
    this.editMode = false;
  }
}