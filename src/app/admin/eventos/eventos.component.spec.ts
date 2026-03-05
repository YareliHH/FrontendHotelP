import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventosComponent } from './eventos.component';
import { EventoService } from '../../services/evento.service';
import { of, throwError } from 'rxjs';

describe('EventosComponent', () => {
  let component: EventosComponent;
  let fixture: ComponentFixture<EventosComponent>;
  let eventoServiceSpy: jasmine.SpyObj<EventoService>;

  const mockEventos = [
    { id_evento: 1, nombre_contratante: 'Juan', numero_contrato: 'C-001' },
  ];

  const mockSalones = [{ id_salon: 1, nombre: 'Salón Oro' }];

  const mockServicios = [
    {
      id_servicio: 10,
      nombre: 'Desayuno',
      precio_unitario: 150,
      secciones: [
        {
          titulo: 'Bebidas',
          tipo_seccion: 'SELECCION',
          items: [
            { id_item: 1, nombre: 'Café' },
            { id_item: 2, nombre: 'Jugo' },
          ],
        },
      ],
    },
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('EventoService', [
      'obtenerEventos',
      'obtenerSalones',
      'obtenerServicios',
      'crearEvento',
    ]);

    await TestBed.configureTestingModule({
      imports: [EventosComponent],
      providers: [{ provide: EventoService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(EventosComponent);
    component = fixture.componentInstance;
    eventoServiceSpy = TestBed.inject(
      EventoService,
    ) as jasmine.SpyObj<EventoService>;
  });

  it('debe crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar eventos registrados', () => {
    eventoServiceSpy.obtenerEventos.and.returnValue(of(mockEventos));
    eventoServiceSpy.obtenerSalones.and.returnValue(of(mockSalones));
    eventoServiceSpy.obtenerServicios.and.returnValue(of(mockServicios));

    component.ngOnInit();

    expect(component.eventos.length).toBe(1);
    expect(component.salones.length).toBe(1);
    expect(component.serviciosDisponibles.length).toBe(1);
  });

  it('debe transformar servicios correctamente', () => {
    eventoServiceSpy.obtenerServicios.and.returnValue(of(mockServicios));

    component.loadServicios();

    const servicio = component.serviciosDisponibles[0];

    expect(servicio.seleccionado).toBeFalse();
    expect(servicio.secciones[0].items[0].seleccionado).toBeFalse();
  });

  it('no debe guardar si no hay servicios seleccionados', () => {
    spyOn(window, 'alert');

    component.serviciosDisponibles = [];

    component.guardar();

    expect(window.alert).toHaveBeenCalledWith(
      'Debe seleccionar al menos un servicio',
    );
  });

  it('debe validar cantidad_personas > 0', () => {
    spyOn(window, 'alert');

    component.serviciosDisponibles = [
      {
        id_servicio: 10,
        seleccionado: true,
        cantidad_personas: 0,
        secciones: [],
      },
    ];

    component.guardar();

    expect(window.alert).toHaveBeenCalledWith(
      'Ingrese una cantidad válida para los servicios seleccionados',
    );
  });

  it('debe construir correctamente servicios seleccionados y llamar crearEvento', () => {
    spyOn(window, 'alert');

    eventoServiceSpy.crearEvento.and.returnValue(of({}));

    eventoServiceSpy.obtenerEventos.and.returnValue(of([]));

    component.serviciosDisponibles = [
      {
        id_servicio: 10,
        seleccionado: true,
        cantidad_personas: 50,
        secciones: [
          {
            items: [
              { id_item: 1, seleccionado: true },
              { id_item: 2, seleccionado: false },
            ],
          },
        ],
      },
    ];

    component.guardar();

    expect(eventoServiceSpy.crearEvento).toHaveBeenCalled();

    const eventoEnviado =
      eventoServiceSpy.crearEvento.calls.mostRecent().args[0];

    expect(eventoEnviado.servicios.length).toBe(1);
    expect(eventoEnviado.servicios[0]).toEqual(
      jasmine.objectContaining({
        id_servicio: 10,
        cantidad_personas: 50,
        itemsSeleccionados: [1],
      }),
    );
  });

  it('debe resetear formulario correctamente', () => {
    component.serviciosDisponibles = [
      {
        seleccionado: true,
        cantidad_personas: 20,
        secciones: [
          {
            items: [{ seleccionado: true }],
          },
        ],
      },
    ];

    component.resetFormulario();

    expect(component.evento.nombre_contratante).toBe('');
    expect(component.serviciosDisponibles[0].seleccionado).toBeFalse();
  });

  it('debe abrir ventana al generar contrato', () => {
    spyOn(window, 'open');

    component.generarContrato(5);

    expect(window.open).toHaveBeenCalledWith(
      'http://localhost:3000/api/eventos/contrato/5',
      '_blank',
    );
  });
});
