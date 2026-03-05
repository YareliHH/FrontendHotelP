import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard.js';

import { LoginComponent } from './auth/login/login.component';
import { AdminComponent } from './layout/admin/admin.component';

import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { EventosComponent } from './admin/eventos/eventos.component';
import { SalonesComponent } from './admin/salones/salones.component';
import { ServiciosComponent } from './admin/servicios/servicios.component';
import { MobiliarioComponent } from './admin/mobiliario/mobiliario.component';
import { ConfiguracionComponent } from './admin/configuracion/configuracion.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'eventos', component: EventosComponent },
      { path: 'salones', component: SalonesComponent },
      { path: 'servicios', component: ServiciosComponent },
      { path: 'mobiliario', component: MobiliarioComponent },
      { path: 'configuracion', component: ConfiguracionComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
