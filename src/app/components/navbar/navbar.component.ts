import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service.service';
import { filter, finalize, Observable } from 'rxjs';
import { ApiService } from '../../services/api/api.service';
import { ToastService } from '../../services/toast/toast.service';
import { LoadingService } from '../../services/loading/loading.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  // Views
  @ViewChild('ddLeft') ddLeft?: ElementRef<HTMLDetailsElement>;
  @ViewChild('ddRight') ddRight?: ElementRef<HTMLDetailsElement>;

  //Injections
  private authService = inject(AuthService);
  private api = inject(ApiService);
  private loading = inject(LoadingService);
  private toast = inject(ToastService);

  // Images Stockées dans src/assets
  logo = 'assets/images/logo.png';

  // Observable vérifiant si l'utilisateur est connecté
  isAuthenticated$!: Observable<boolean>;

  // Réponse de l'appel API Logout
  logoutSuccess: boolean = false;
  logoutMessage: string = "";

  constructor(private router: Router) {
    router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.ddLeft?.nativeElement.removeAttribute('open'));

    router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.ddRight?.nativeElement.removeAttribute('open'));
  }

  // Appels du chargement de l'observable
  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  // Redirection Login
  login() {
    this.router.navigateByUrl('/login');
  }

  // Redirection profil
  profil() {
    this.router.navigateByUrl('/profil');
  }

  // Déconnexion et Redirection Logout
  logout() {
    const id = this.loading.begin('');
    this.api.logout()
    .pipe(finalize(() => this.loading.end(id)))
    .subscribe({
      next: (res) => {
        this.logoutSuccess = res.success;
        this.logoutMessage = res.message;
        if (res.success) {
          this.authService.logout();
          this.router.navigateByUrl('/');
          this.toast.success(this.logoutMessage, 'Déconnexion'); 
        } else {
          this.toast.error(this.logoutMessage, 'Déconnexion'); 
        }          
      },
      error: (err) => {
        this.toast.error('Serveur Injoignable ...', 'Serveur'); 
      }
    });
  }  
}