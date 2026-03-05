import { Component, OnInit } from '@angular/core';
import {MobiliarioService, Mobiliario,} from '../../services/mobiliario.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-mobiliario',
  imports: [FormsModule, CommonModule],
  templateUrl: './mobiliario.component.html',
  styleUrl: './mobiliario.component.css',
})
export class MobiliarioComponent implements OnInit {

  mobiliario: Mobiliario[] = [];
  editandoId: number | null = null;
  nuevaCantidad: number = 0;

  constructor(private mobiliarioService: MobiliarioService) {}

  ngOnInit(): void {
    this.cargarMobiliario();
  }

  cargarMobiliario() {
    this.mobiliarioService.getAll().subscribe((data) => {
      this.mobiliario = data;
    });
  }

  editar(item: Mobiliario) {
    this.editandoId = item.id;
    this.nuevaCantidad = item.cantidad;
  }

  guardar(id: number) {
    this.mobiliarioService
      .update(id, { cantidad: this.nuevaCantidad })
      .subscribe(() => {
        this.editandoId = null;
        this.cargarMobiliario();
      });
  }

  cancelar() {
    this.editandoId = null;
  }
}
