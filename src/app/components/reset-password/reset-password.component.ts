import { CommonModule, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import { ToastService } from '../../services/toast/toast.service';
import { LoadingService } from '../../services/loading/loading.service';
import { finalize } from 'rxjs/internal/operators/finalize';

// Fonction de vérification Password == ConfirmPassword
function passwordsMatch(): ValidatorFn {
  return (group): ValidationErrors | null => {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass && confirm && pass === confirm ? null : { passwordMismatch: true };
  };
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [NgIf, CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  
  // Injections
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private api = inject(ApiService);
  private loading = inject(LoadingService);
  private toast = inject(ToastService);

  // Erreurs Formulaire
  error: string | null = null;

  // --- Formulaire GetOneUserByMail ---

  // Getters Formulaire GetOneUserByMail
  get email() { return this.formGetOneUserByMail.controls.email; }

  // Formulaire GetOneUserByMail
  formGetOneUserByMail = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]]
  });

  // Réponse de l'appel API GetOneUserByMail
  getOneUserByMailSuccess: boolean = false;
  getOneUserByMailData: any = null;
  getOneUserByMailMessage: string = "";

  // Réponse de l'appel API sendMailResetPassword
  sendMailResetPasswordSuccess: boolean = false;
  sendMailResetPasswordData: any = null;
  sendMailResetPasswordMessage: string = "";

  // Récupération Utilisateur Affiché par défaut
  userEmail: string = "";

  // --- Formulaire GetTemporaryCode ---

  // Boolean isFormGetOneUserByMailSent
  isFormGetOneUserByMailSent: boolean = false;

  // Getters Formulaire GetOneUserByMail
  get temporaryCode() { return this.formGetTemporaryCode.controls.temporaryCode; }

  // Formulaire GetTemporaryCode
  formGetTemporaryCode = this.fb.group({
    temporaryCode: ['', [Validators.required]]
  });

  // Réponse de l'appel API GetTemporaryCode
  getTemporaryCodeSuccess: boolean = false;
  getTemporaryCodeData: any = null;
  getTemporaryCodeMessage: string = "";

  // --- Formulaire SetNewPassword ---

  // Boolean isFormGetTemporaryCodeSent
  isFormGetTemporaryCodeSent: boolean = false;
  isFormSetNewPasswordSent: boolean = false;

  // Boolean affichage des mots de passe
  showPwd = false;
  showPwdConfirm = false;

  // Getters Formulaire SetNewPassword
  get password() { return this.formSetNewPassword.controls.password; }
  get confirmPassword() { return this.formSetNewPassword.controls.confirmPassword; }

  // Formulaire GetTemporaryCode
  formSetNewPassword = this.fb.group({
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
  }, { validators: [passwordsMatch()] });

  // Réponse de l'appel API SetNewPassword
  setNewPasswordSuccess: boolean = false;
  setNewPasswordData: any = null;
  setNewPasswordMessage: string = "";

  constructor() {}

  // Validation Formulaire GetOneUserByMail
  async submitFormGetOneUserByMail() {

    // Si Erreur Validation
    if (this.formGetOneUserByMail.invalid) return;

    this.error = null;

    try {
      // Appel API GetOneUserByEmail
      const id = this.loading.begin('');
      this.api.getOneUserByEmail(this.formGetOneUserByMail.value.email)
      .pipe(finalize(() => this.loading.end(id)))
      .subscribe({
        next: (res) => {
          // Stockage des réponses
          this.getOneUserByMailSuccess = res.success;
          this.getOneUserByMailMessage = res.message;
          this.getOneUserByMailData = res.data;
          // Si appel api validée
          if (this.getOneUserByMailSuccess) {
            const id2 = this.loading.begin('');
            this.api.generateTemporaryCodeResetPassword({ mail: this.getOneUserByMailData.mail})
            .pipe(finalize(() => this.loading.end(id2)))
            .subscribe({
              next: (res) => {
                const id3 = this.loading.begin('');
                this.api.sendMailResetPassword({ mail: this.getOneUserByMailData.mail})
                .pipe(finalize(() => this.loading.end(id3)))
                .subscribe({
                  next: (res) => {
                    // Stockage des réponses
                    this.sendMailResetPasswordSuccess = res.success;
                    this.sendMailResetPasswordMessage = res.message;
                    this.sendMailResetPasswordData = res.data;
                    this.toast.success(this.sendMailResetPasswordMessage, 'Mot de passe oublié');
                    if (this.sendMailResetPasswordSuccess) {
                      this.isFormGetOneUserByMailSent = true;
                    }
                  },
                  error: (err) => {
                    this.toast.error('Serveur Injoignable ...', 'Serveur'); 
                  }
                })
              },
              error: (err) => {
                this.toast.error('Serveur Injoignable ...', 'Serveur'); 
              }
            });
          // Si appel api refusée        
          } else {
            this.toast.error(this.getOneUserByMailMessage, 'Mot de passe oublié'); 
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

  // Validation Formulaire GetTemporaryCode
  async submitFormGetTemporaryCode() {

    // Si Erreur Validation
    if (this.formGetTemporaryCode.invalid) return;

    this.error = null;

    try {
      // Appel API GetTemporaryCode
      const id = this.loading.begin('');
      this.api.verifyTemporaryCodeResetPasswordByMail(this.getOneUserByMailData.mail, this.formGetTemporaryCode.value.temporaryCode)
      .pipe(finalize(() => this.loading.end(id)))
      .subscribe({
        next: (res) => {
          // Stockage des réponses
          this.getTemporaryCodeSuccess = res.success;
          this.getTemporaryCodeMessage = res.message;
          this.getTemporaryCodeData = res.data;
          // Si appel api validée
          if (this.getTemporaryCodeSuccess) {
            this.toast.success(this.getTemporaryCodeMessage, 'Mot de passe oublié'); 
            this.isFormGetTemporaryCodeSent = true;
          // Si appel api refusée        
          } else {
            this.toast.error(this.getTemporaryCodeMessage, 'Mot de passe oublié'); 
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

  // Validation Formulaire SetNewPassword
  async submitFormSetNewPassword() {

    // Si Erreur Validation
    if (this.formSetNewPassword.invalid) return;

    this.error = null;

    try {
      // Appel API SetNewPassword
      const id = this.loading.begin('');
      this.api.setNewPassword({ mail: this.getOneUserByMailData.mail, password: this.formSetNewPassword.value.password, confirmPassword: this.formSetNewPassword.value.confirmPassword })
      .pipe(finalize(() => this.loading.end(id)))
      .subscribe({
        next: (res) => {
          // Stockage des réponses
          this.setNewPasswordSuccess = res.success;
          this.setNewPasswordMessage = res.message;
          this.setNewPasswordData = res.data;
          // Si appel api validée
          if (this.setNewPasswordSuccess) {
            this.toast.success(this.setNewPasswordMessage, 'Mot de passe oublié'); 
            this.isFormSetNewPasswordSent = true;
            this.router.navigateByUrl('/login');
          // Si appel api refusée        
          } else {
            this.toast.error(this.setNewPasswordMessage, 'Mot de passe oublié'); 
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

  // Redirection Connexion
  login(): void {
    this.router.navigate(['/login']);
  }
}
