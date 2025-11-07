import { CommonModule, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service.service';
import { ApiService } from '../../services/api/api.service';
import { ToastService } from '../../services/toast/toast.service';
import { LoadingService } from '../../services/loading/loading.service';
import { finalize } from 'rxjs/internal/operators/finalize';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  // Injections
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);
  private api = inject(ApiService);
  private loading = inject(LoadingService);
  private toast = inject(ToastService);

  // Boolean affichage du mot de passe
  showPwd = false;

  // Erreurs Formulaire
  error: string | null = null;

  // Getters Formulaire
  get email()    { return this.form.controls.email; }
  get password() { return this.form.controls.password; }

  // Formulaire Login
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    password: ['', [Validators.required]]
  });

  // Réponse de l'appel API Login
  loginSuccess: boolean = false;
  loginToken: string = "";
  loginMessage: string = "";

  constructor() {}

  // Validation Formulaire
  async submit() {
    
    // Si Erreur Validation
    if (this.form.invalid) return;
 
    this.error = null;

    try {
      // Appel API Connexion
      const id = this.loading.begin('');
      this.api.login({ mail: this.form.value.email, password: this.form.value.password })
      .pipe(finalize(() => this.loading.end(id)))
      .subscribe({
        next: (res) => {
          // Stockage des réponses
          this.loginSuccess = res.success;
          this.loginToken = res.data;
          this.loginMessage = res.message;
          // Si connexion validée
          if (res.success) {
            localStorage.setItem('token', this.loginToken);
            this.auth.login();
            this.router.navigateByUrl('/');
            this.toast.success(this.loginMessage, 'Connexion');  
          // Si connexion refusée        
          } else {
            this.toast.error(this.loginMessage, 'Connexion'); 
          }
        },
        error: (err) => {
          this.toast.error('Serveur Injoignable ...', 'Serveur'); 
        }
      });
    } catch (e: any) {
      this.toast.error('Serveur Injoignable ...', 'Serveur'); 
    }
  }

  // Redirection Inscription
  register(): void {
    this.router.navigate(['/register']);
  }

  // Redirection Reset Password Set Mail
  resetPasswordSetMail(): void {
    this.router.navigate(['/reset-password'])
  }
}
