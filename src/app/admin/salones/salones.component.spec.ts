import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalonesComponent } from './salones.component';
import { SalonService } from '../../services/salon.service';
import { of } from 'rxjs';

describe('SalonesComponent', () => {
  let component: SalonesComponent;
  let fixture: ComponentFixture<SalonesComponent>;
  let salonServiceSpy: jasmine.SpyObj<SalonService>;

  const mockSalones = [
    { id_salon: 1, nombre: 'Salón Oro', capacidad: 100, descripcion: 'Grande' },
    {
      id_salon: 2,
      nombre: 'Salón Plata',
      capacidad: 50,
      descripcion: 'Mediano',
    },
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('SalonService', [
      'getSalones',
      'createSalon',
      'updateSalon',
      'deleteSalon',
    ]);

    await TestBed.configureTestingModule({
      imports: [SalonesComponent],
      providers: [{ provide: SalonService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(SalonesComponent);
    component = fixture.componentInstance;
    salonServiceSpy = TestBed.inject(
      SalonService,
    ) as jasmine.SpyObj<SalonService>;
  });

  it('debe crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar los salones al iniciar', () => {
    salonServiceSpy.getSalones.and.returnValue(of(mockSalones));

    component.ngOnInit();

    expect(salonServiceSpy.getSalones).toHaveBeenCalled();
    expect(component.salones.length).toBe(2);
  });

  it('debe crear un salón cuando no está en modo edición', () => {
    salonServiceSpy.createSalon.and.returnValue(of({}));
    salonServiceSpy.getSalones.and.returnValue(of(mockSalones));

    component.editMode = false;
    component.salonForm = {
      nombre: 'Nuevo',
      capacidad: 200,
      descripcion: 'Test',
    };

    component.guardar();

    expect(salonServiceSpy.createSalon).toHaveBeenCalled();
  });

  it('debe actualizar un salón cuando está en modo edición', () => {
    salonServiceSpy.updateSalon.and.returnValue(of({}));
    salonServiceSpy.getSalones.and.returnValue(of(mockSalones));

    const salonEditado = {
      id_salon: 1,
      nombre: 'Editado',
      capacidad: 300,
      descripcion: 'Edit',
    };

    component.editMode = true;
    component.salonForm = { ...salonEditado };

    component.guardar();

    expect(salonServiceSpy.updateSalon).toHaveBeenCalledWith(1, salonEditado);
  });

  it('debe eliminar un salón', () => {
    salonServiceSpy.deleteSalon.and.returnValue(of({}));
    salonServiceSpy.getSalones.and.returnValue(of(mockSalones));

    component.eliminar(1);

    expect(salonServiceSpy.deleteSalon).toHaveBeenCalledWith(1);
  });

  it('debe activar modo edición al editar', () => {
    const salon = mockSalones[0];

    component.editar(salon);

    expect(component.editMode).toBeTrue();
    expect(component.salonForm.nombre).toBe('Salón Oro');
  });

  it('debe limpiar el formulario con resetForm', () => {
    component.editMode = true;
    component.salonForm = {
      id_salon: 1,
      nombre: 'Algo',
      capacidad: 100,
      descripcion: 'Desc',
    };

    component.resetForm();

    expect(component.editMode).toBeFalse();
    expect(component.salonForm.nombre).toBe('');
    expect(component.salonForm.capacidad).toBe(0);
  });
});
