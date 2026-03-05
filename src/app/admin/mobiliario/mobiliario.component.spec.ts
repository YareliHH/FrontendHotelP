import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobiliarioComponent } from './mobiliario.component';
import { MobiliarioService, Mobiliario } from '../../services/mobiliario.service';
import { of } from 'rxjs';

describe('MobiliarioComponent', () => {

  let component: MobiliarioComponent;
  let fixture: ComponentFixture<MobiliarioComponent>;
  let mobiliarioServiceSpy: jasmine.SpyObj<MobiliarioService>;

  const mockMobiliario: Mobiliario[] = [
    { id: 1, tipo: 'Mesa', cantidad: 20 },
    { id: 2, tipo: 'Silla', cantidad: 100 }
  ];

  beforeEach(async () => {

    const spy = jasmine.createSpyObj('MobiliarioService', [
      'getAll',
      'update'
    ]);

    await TestBed.configureTestingModule({
      imports: [MobiliarioComponent],
      providers: [
        { provide: MobiliarioService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MobiliarioComponent);
    component = fixture.componentInstance;
    mobiliarioServiceSpy = TestBed.inject(MobiliarioService) as jasmine.SpyObj<MobiliarioService>;
  });

  it('debe crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar mobiliario en ngOnInit', () => {

    mobiliarioServiceSpy.getAll.and.returnValue(of(mockMobiliario));

    component.ngOnInit();

    expect(mobiliarioServiceSpy.getAll).toHaveBeenCalled();
    expect(component.mobiliario.length).toBe(2);
  });

  it('debe activar modo edición al editar', () => {

    const item = mockMobiliario[0];

    component.editar(item);

    expect(component.editandoId).toBe(1);
    expect(component.nuevaCantidad).toBe(20);
  });

  it('debe guardar cambios y recargar mobiliario', () => {

    mobiliarioServiceSpy.update.and.returnValue(of({}));
    mobiliarioServiceSpy.getAll.and.returnValue(of(mockMobiliario));

    component.editandoId = 1;
    component.nuevaCantidad = 50;

    component.guardar(1);

    expect(mobiliarioServiceSpy.update)
      .toHaveBeenCalledWith(1, { cantidad: 50 });

    expect(component.editandoId).toBeNull();
    expect(mobiliarioServiceSpy.getAll).toHaveBeenCalled();
  });

  it('debe cancelar edición', () => {

    component.editandoId = 1;

    component.cancelar();

    expect(component.editandoId).toBeNull();
  });

});