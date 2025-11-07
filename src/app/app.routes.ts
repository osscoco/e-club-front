import { Routes } from '@angular/router';
import { guestOnlyGuard, authRequiredGuard } from './guards/auth/auth.guard';


export const routes: Routes = [
    // Route Accueil
    {
        path: '',
        loadComponent: () => import('../app/components/home/home.component').then(m => m.HomeComponent)
    },
    // Routes Auth (Anonymous)
    { 
        path: 'login',
        canActivate: [guestOnlyGuard],
        loadComponent: () => import('../app/components/login/login.component').then(m => m.LoginComponent)
    },
    { 
        path: 'register',
        canActivate: [guestOnlyGuard],
        loadComponent: () => import('../app/components/register/register.component').then(m => m.RegisterComponent)
    },
    // {
    //     path: 'reset-password',
    //     canActivate: [guestOnlyGuard],
    //     loadComponent: () => import('./components/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
    // },
    // Routes Auth (Connected)
    { 
        path: 'profil',
        canActivate: [authRequiredGuard],
        loadComponent: () => import('../app/components/profil/profil.component').then(m => m.ProfilComponent)
    },
    {
        path: 'search',
        canActivate: [authRequiredGuard],
        loadComponent: () => import('../app/components/search-professionnel/search-professionnel.component').then(m => m.SearchProfessionnelComponent)
    },
    {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];