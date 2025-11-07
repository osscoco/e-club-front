import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import { SubChoice } from '../../interfaces/SubChoice';
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
  selector: 'app-register',
  standalone: true,
  imports: [NgIf, CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  // Injections
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private api = inject(ApiService);
  private loading = inject(LoadingService);
  private toast = inject(ToastService);

  // Boolean affichage des mots de passe
  showPwd = false;
  showPwdConfirm = false;

  // Erreurs Formulaire
  error: string | null = null;

  // Getters Formulaire
  get email() { return this.form.controls.email; }
  get pseudo() { return this.form.controls.pseudo; }
  get password() { return this.form.controls.password; }
  get confirmPassword() { return this.form.controls.confirmPassword; }
  get canSubmit() { return this.form.valid }

  //Formulaire Register
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    pseudo: ['', [Validators.required, Validators.maxLength(100)]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
    selectedChoices: this.fb.control<string[]>([], [Validators.required])
  }, { validators: [passwordsMatch()] });

  // Réponse de l'appel API Register
  registerSuccess: boolean = false;
  registerData: any = null;
  registerMessage: string = "";

  // Listes SubChoices
  subChoices: SubChoice[] = [];
  subChoicesArtiste: SubChoice[] = [];
  subChoicesProfessionnel: SubChoice[] = [];

  constructor() {}

  // Chargement de la liste SubChoices
  loadSubChoices(): void {
    const id = this.loading.begin('');
    this.api.getSubChoices(1, 20)
    .pipe(finalize(() => this.loading.end(id)))
    .subscribe({
      next: (res) => {
        this.subChoices = res.data.items; 
        this.subChoicesArtiste = this.subChoices.filter(u => u.name === "Chanteur" || u.name === "Rappeur");
        this.subChoicesProfessionnel = this.subChoices.filter(u => u.name !== "Chanteur" && u.name !== "Rappeur");
      },
      error: (err) => {
        this.toast.error('Serveur Injoignable ...', 'Serveur'); 
      }
    });
  }

  // Vérifications checkbox (1/2)
  isSelected(id: string): boolean {
    return this.form.controls.selectedChoices.value?.includes(id) ?? false;
  }

  // Vérifications checkbox (2/2)
  onToggleSelected(id: string, event: Event) {
    const input = event.target as HTMLInputElement;
    const checked = input.checked;

    const ctrl = this.form.controls.selectedChoices;
    const cur = ctrl.value ?? [];
    const next = checked ? [...cur, id] : cur.filter(v => v !== id);

    ctrl.setValue(next);
    ctrl.markAsDirty();
    ctrl.markAsTouched();
  }

  // Appels des chargements des listes
  ngOnInit(): void {
    this.loadSubChoices();
  }

  // Validation Formulaire
  async submit() {
    
    // Si Erreur Validation
    if (!this.canSubmit) return;
    if (this.form.invalid) return;

    this.error = null;

    try {
      // Appel API Inscription
      const id = this.loading.begin('');
      this.api.register({ mail: this.form.value.email, pseudo: this.form.value.pseudo, password: this.form.value.password, confirmPassword: this.form.value.confirmPassword, array: this.form.value.selectedChoices })
      .pipe(finalize(() => this.loading.end(id)))
      .subscribe({
        next: (res) => {
          // Stockage des réponses
          this.registerSuccess = res.success;
          this.registerData = res.data;
          this.registerMessage = res.message;
          // Si register validé
          if (res.success) {
            this.router.navigateByUrl('/login');
            this.toast.success(this.registerMessage, 'Inscription');    
          // Si register refusé 
          } else {
            this.toast.error(this.registerMessage, 'Inscription');    
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

  // Redirection Connexion
  login(): void {
    this.router.navigate(['/login']);
  }
}
