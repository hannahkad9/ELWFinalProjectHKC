// src/app/app-routing.module.ts or wherever your routes are defined
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GameComponent } from './game/game.component';
import { AuthGuard } from './auth.guard';
import { RegisterComponent } from './register/register.component';
import { HeaderComponent } from './header/header.component';

export const routes: Routes = [
  {
path: 'header',
component: HeaderComponent,
title: 'Header',
  },
    {
      path: 'game',
      component: GameComponent,
      title: 'Game',
      canActivate: [AuthGuard],  // Protect game route
    },
    {
      path: 'login',
      component: LoginComponent,
      title: 'Login',
    },
    {
      path: '',
      redirectTo: '/login',
      pathMatch: 'full',
    },
    {
      path: 'register',
      component: RegisterComponent,
      title: 'Register',
    },
  ];
  
