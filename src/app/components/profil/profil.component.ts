import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import { SubChoice } from '../../interfaces/SubChoice';
import { ToastService } from '../../services/toast/toast.service';
import { AuthService } from '../../services/auth/auth-service.service';
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
  selector: 'app-profil',
  standalone: true,
  imports: [NgIf, CommonModule, ReactiveFormsModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements OnInit {

  // Injections
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private api = inject(ApiService);
  private loading = inject(LoadingService);
  private toast = inject(ToastService);
  private authService = inject(AuthService);

  // Boolean affichage des mots de passe UPDATE
  showPwdUpdate = false;
  showPwdConfirmUpdate = false;

  // Boolean affichage des mots de passe DELETE
  showPwdDelete = false;
  showPwdConfirmDelete = false;

  // Erreurs Formulaire
  error: string | null = null;

  // --- Formulaire Update ---

  // Getters Formulaire Update
  get emailUpdate() { return this.formUpdate.controls.email; }
  get pseudoUpdate() { return this.formUpdate.controls.pseudo; }
  get passwordUpdate() { return this.formUpdate.controls.password; }
  get confirmPasswordUpdate() { return this.formUpdate.controls.confirmPassword; }
  get canSubmitUpdate() { return this.formUpdate.valid }

  //Formulaire Update
  formUpdate = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    pseudo: ['', [Validators.required, Validators.maxLength(100)]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
    selectedChoices: this.fb.control<string[]>([], [Validators.required])
  }, { validators: [passwordsMatch()] });

  // Réponse de l'appel API Update
  updateSuccess: boolean = false;
  updateData: any = null;
  updateMessage: string = "";

  // --- Formulaire Delete ---

  // Getters Formulaire Delete
  get passwordDelete() { return this.formDelete.controls.password; }
  get confirmPasswordDelete() { return this.formDelete.controls.confirmPassword; }
  get canSubmitDelete() { return this.formDelete.valid }

  //Formulaire Delete
  formDelete = this.fb.group({
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: [passwordsMatch()] });

  // Réponse de l'appel API Delete
  deleteSuccess: boolean = false;
  deleteMessage: string = "";

  // Listes SubChoices
  subChoices: SubChoice[] = [];
  subChoicesArtiste: SubChoice[] = [];
  subChoicesProfessionnel: SubChoice[] = [];

  // Récupération Utilisateur Affiché par défaut
  userId: string = "";
  userEmail: string = "";
  userPseudo: string = "";

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

  // Chargement des informations de l'utilisateur affiché par défaut
  loadProfil(): void {
    const id = this.loading.begin('');
    this.api.authMe()
    .pipe(finalize(() => this.loading.end(id)))
    .subscribe({
      next: (res) => {
        this.userEmail = res.data.data.mail;
        this.userPseudo = res.data.data.pseudo;
        this.userId = res.data.data.userId;
        this.api.getSubChoicesFromUserByEmail(this.userEmail).subscribe({
          next: (res) => {
            this.subChoices = res.data;
            this.fillFormFromUser(this.userEmail, this.userPseudo, this.subChoices);
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
  }

  // Attribution des données de l'utilisateur dans le formulaire
  fillFormFromUser(mail: string | undefined, pseudo: string | undefined, subChoices: SubChoice[]): void {
    if (!subChoices) {
      this.formUpdate.reset({
        email: '',
        pseudo: '',
        password: '',
        confirmPassword: '',
        selectedChoices: []
      }, { emitEvent: false });
      return;
    }

    const selectedIds: string[] = Array.isArray(subChoices)
      ? subChoices.map(o => o.subChoiceId)
      : [];

    this.formUpdate.reset({
      email: mail ?? '',
      pseudo: pseudo ?? '',
      password: '',            
      confirmPassword: '',    
      selectedChoices: selectedIds
    }, { emitEvent: false });

    this.formUpdate.markAsPristine();
    this.formUpdate.markAsUntouched();
  }

  // Vérifications checkbox (1/2)
  isSelected(id: string): boolean {
    return this.formUpdate.controls.selectedChoices.value?.includes(id) ?? false;
  }

  // Vérifications checkbox (2/2)
  onToggleSelected(id: string, event: Event) {
    const input = event.target as HTMLInputElement;
    const checked = input.checked;

    const ctrl = this.formUpdate.controls.selectedChoices;
    const cur = ctrl.value ?? [];
    const next = checked ? [...cur, id] : cur.filter(v => v !== id);

    ctrl.setValue(next);
    ctrl.markAsDirty();
    ctrl.markAsTouched();
  }

  // Appels des chargements des listes et informations
  ngOnInit(): void {
    this.loadSubChoices();
    this.loadProfil();
  }

  // Validation Formulaire Update
  async submitUpdate() {
    
    // Si Erreur Validation
    if (!this.canSubmitUpdate) return;
    if (this.formUpdate.invalid) return;

    this.error = null;

    try {
      // Appel API Update
      const id = this.loading.begin('');
      this.api.updateProfil(this.userId, { mail: this.formUpdate.value.email, pseudo: this.formUpdate.value.pseudo, password: this.formUpdate.value.password, confirmPassword: this.formUpdate.value.confirmPassword, array: this.formUpdate.value.selectedChoices })
      .pipe(finalize(() => this.loading.end(id)))
      .subscribe({
        next: (res) => {
          // Stockage des réponses
          this.updateSuccess = res.success;
          this.updateData = res.data;
          this.updateMessage = res.message;
          // Si update validé
          if (res.success) {
            this.router.navigateByUrl('/profil');
            this.toast.success(this.updateMessage, 'Profil'); 
          // Si update refusé   
          } else {
            this.toast.error(this.updateMessage, 'Profil');    
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

  // Validation Formulaire Delete
  async submitDelete() {
    
    // Si Erreur Validation
    if (!this.canSubmitDelete) return;
    if (this.formDelete.invalid) return;

    this.error = null;

    try {
      // Appel API Delete
      const id = this.loading.begin('');
      this.api.deleteProfil(this.userId, { password: this.formDelete.value.password, confirmPassword: this.formDelete.value.confirmPassword })
      .pipe(finalize(() => this.loading.end(id)))
      .subscribe({
        next: (res) => {
          // Stockage des réponses
          this.deleteSuccess = res.success;
          this.deleteMessage = res.message;
          // Si delete validé
          if (res.success) {
            this.authService.logout();
            this.router.navigateByUrl('/');
            this.toast.success(this.deleteMessage, 'Profil'); 
          // Si delete refusé   
          } else {
            this.toast.error(this.deleteMessage, 'Profil');    
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
}