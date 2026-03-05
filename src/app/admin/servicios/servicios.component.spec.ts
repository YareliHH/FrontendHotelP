import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiciosComponent } from './servicios.component';
import { ServicioService } from '../../services/servicio.service';
import { of } from 'rxjs';

describe('ServiciosComponent', () => {
  let component: ServiciosComponent;
  let fixture: ComponentFixture<ServiciosComponent>;
  let servicioServiceSpy: jasmine.SpyObj<ServicioService>;

  const mockServicios = [
    {
      id_servicio: 1,
      nombre: 'Desayuno',
      descripcion: 'Buffet',
      precio_unitario: 150,
      tipo: 'Comida',
      secciones: []
    }
  ];

  beforeEach(async () => {

    const spy = jasmine.createSpyObj('ServicioService', [
      'getServicios',
      'createServicioCompleto',
      'updateServicio',
      'deleteServicio'
    ]);

    await TestBed.configureTestingModule({
      imports: [ServiciosComponent],
      providers: [
        { provide: ServicioService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiciosComponent);
    component = fixture.componentInstance;
    servicioServiceSpy = TestBed.inject(ServicioService) as jasmine.SpyObj<ServicioService>;
  });

  it('debe crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar servicios al iniciar', () => {
    servicioServiceSpy.getServicios.and.returnValue(of(mockServicios));

    component.ngOnInit();

    expect(servicioServiceSpy.getServicios).toHaveBeenCalled();
    expect(component.servicios.length).toBe(1);
  });

  it('debe crear servicio cuando no está en modo edición', () => {
    servicioServiceSpy.createServicioCompleto.and.returnValue(of({}));
    servicioServiceSpy.getServicios.and.returnValue(of(mockServicios));

    const nuevoServicio = {
      nombre: 'Nuevo',
      descripcion: 'Test',
      precio_unitario: 200,
      tipo: 'Coffee',
      secciones: []
    };

    component.editMode = false;
    component.servicioForm = { ...nuevoServicio };

    component.guardar();

    expect(servicioServiceSpy.createServicioCompleto)
      .toHaveBeenCalledWith(nuevoServicio);
  });

  it('debe actualizar servicio cuando está en modo edición', () => {
    servicioServiceSpy.updateServicio.and.returnValue(of({}));
    servicioServiceSpy.getServicios.and.returnValue(of(mockServicios));

    const servicioEditado = {
      id_servicio: 1,
      nombre: 'Editado',
      descripcion: 'Desc',
      precio_unitario: 300,
      tipo: 'Comida',
      secciones: []
    };

    component.editMode = true;
    component.servicioForm = { ...servicioEditado };

    component.guardar();

    expect(servicioServiceSpy.updateServicio)
      .toHaveBeenCalledWith(1, servicioEditado);
  });

  it('debe eliminar un servicio', () => {
    servicioServiceSpy.deleteServicio.and.returnValue(of({}));
    servicioServiceSpy.getServicios.and.returnValue(of(mockServicios));

    component.eliminar(1);

    expect(servicioServiceSpy.deleteServicio).toHaveBeenCalledWith(1);
  });

  it('debe agregar una sección', () => {
    component.servicioForm.secciones = [];

    component.agregarSeccion();

    expect(component.servicioForm.secciones?.length).toBe(1);
    expect(component.servicioForm.secciones?.[0].titulo).toBe('');
  });

  it('debe eliminar una sección', () => {
    component.servicioForm.secciones = [
      { titulo: 'Sección 1', tipo_seccion: 'FIJA', items: [] }
    ];

    component.eliminarSeccion(0);

    expect(component.servicioForm.secciones.length).toBe(0);
  });

  it('debe agregar un item a una sección', () => {
    component.servicioForm.secciones = [
      { titulo: 'Sección 1', tipo_seccion: 'FIJA', items: [] }
    ];

    component.agregarItem(0);

    expect(component.servicioForm.secciones[0].items.length).toBe(1);
  });

  it('debe eliminar un item', () => {
    component.servicioForm.secciones = [
      { 
        titulo: 'Sección 1',
        tipo_seccion: 'FIJA',
        items: [{ nombre: 'Item 1' }]
      }
    ];

    component.eliminarItem(0, 0);

    expect(component.servicioForm.secciones[0].items.length).toBe(0);
  });

  it('debe resetear el formulario', () => {
    component.editMode = true;
    component.servicioForm = {
      id_servicio: 1,
      nombre: 'Algo',
      descripcion: 'Desc',
      precio_unitario: 100,
      tipo: 'Tipo',
      secciones: []
    };

    component.resetForm();

    expect(component.editMode).toBeFalse();
    expect(component.servicioForm.nombre).toBe('');
    expect(component.servicioForm.precio_unitario).toBe(0);
  });

});