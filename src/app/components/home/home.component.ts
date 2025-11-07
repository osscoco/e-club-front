import { CommonModule, NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Promo } from '../../interfaces/Promo';
import { SubChoice } from '../../interfaces/SubChoice';
import { ApiService } from '../../services/api/api.service';
import { YtEmbedUrlPipe } from '../../Pipes/YoutubeEmbedUrl/yt-embed-url.pipe';
import { AuthService } from '../../services/auth/auth-service.service';
import { Observable } from 'rxjs/internal/Observable';
import { LoadingService } from '../../services/loading/loading.service';
import { finalize } from 'rxjs/internal/operators/finalize';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NgFor, YtEmbedUrlPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  // Injections
  private router = inject(Router);
  private api = inject(ApiService);
  private authService = inject(AuthService);
  private loading = inject(LoadingService);
  private toast = inject(ToastService);
  
  // Observable vérifiant si l'utilisateur est connecté
  isAuthenticated$!: Observable<boolean>;

  // Liste Section 1
  subChoices: SubChoice[] = [];
  // Liste Section 2
  clips: Promo[] = [];
  // Liste Section 3
  prods: Promo[] = [];
  
  constructor() {}
  
  // Chargement de la liste Section 1
  loadSubChoices(): void {
    const id = this.loading.begin('');
    this.api.getSubChoices(1, 25)
    .pipe(finalize(() => this.loading.end(id)))
    .subscribe({
      next: (res) => {
        this.subChoices = res.data.items;
      },
      error: (err) => {
        this.toast.error('Serveur Injoignable ...', 'Serveur'); 
      }
    });
  }

  // Chargement de la liste Section 2
  loadClips(): void {
    const id = this.loading.begin('');
    this.api.getPromosClip(1, 6)
    .pipe(finalize(() => this.loading.end(id)))
    .subscribe({
      next: (res) => {
        this.clips = res.data.items; 
      },
      error: (err) => {
        this.toast.error('Serveur Injoignable ...', 'Serveur'); 
      }
    });
  }

  // Chargement de la liste Section 3
  loadProds(): void {
    const id = this.loading.begin('');
    this.api.getPromosProd(1, 6)
    .pipe(finalize(() => this.loading.end(id)))
    .subscribe({
      next: (res) => {
        this.prods = res.data.items; 
      },
      error: (err) => {
        this.toast.error('Serveur Injoignable ...', 'Serveur'); 
      }
    });
  }

  // Appels des chargements des listes
  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.loadSubChoices();
    this.loadClips();
    this.loadProds();
  }

  // SECTION 1
  onCheckboxChange(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.subChoices[index].checked = input.checked;
  }

  // SECTION 1
  async search(): Promise<void> {
    const selected = this.subChoices.filter(c => c.checked).map(c => c.name);

    await this.router.navigate(
      ['/search'],
      {
        queryParams: selected.length ? { categories: selected } : { categories: null },
        queryParamsHandling: 'merge',
      }
    );
  }

  // SECTION 1
  login(): void {
    this.router.navigate(['/login']);
  }

  // SECTION 1
  profil(): void {
    this.router.navigate(['/profil']);
  }
}
