import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {

  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {

    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent], // ✅ standalone
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('formulario debe ser inválido cuando está vacío', () => {
    expect(component.loginForm.valid).toBeFalse();
  });

  it('formulario debe ser válido cuando tiene datos correctos', () => {
    component.loginForm.setValue({
      email: 'test@test.com',
      password: '123456'
    });

    expect(component.loginForm.valid).toBeTrue();
  });

  it('debe mostrar error si se envía formulario inválido', () => {

    component.onSubmit();

    expect(component.errorMessage)
      .toBe('Debes llenar todos los campos correctamente.');
  });

  it('debe llamar authService.login y redirigir si login es exitoso', () => {

    const mockResponse = { token: 'fake-token' };

    authServiceSpy.login.and.returnValue(of(mockResponse));

    spyOn(localStorage, 'setItem');

    component.loginForm.setValue({
      email: 'test@test.com',
      password: '123456'
    });

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      correo: 'test@test.com',
      password: '123456'
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fake-token');

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/dashboard']);

    expect(component.loading).toBeFalse();
  });

  it('debe manejar error cuando login falla', () => {

    authServiceSpy.login.and.returnValue(
      throwError(() => ({
        error: { error: 'Credenciales inválidas' }
      }))
    );

    component.loginForm.setValue({
      email: 'test@test.com',
      password: 'wrong'
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Credenciales inválidas');
    expect(component.loading).toBeFalse();
  });

  it('debe alternar showPassword', () => {
    component.showPassword = false;

    component.showPassword = !component.showPassword;

    expect(component.showPassword).toBeTrue();
  });

});