import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SubChoice } from '../../interfaces/SubChoice';
import { ApiService } from '../../services/api/api.service';
import { LoadingService } from '../../services/loading/loading.service';
import { finalize } from 'rxjs';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  // Injections
  private router = inject(Router);
  private api = inject(ApiService);
  private loading = inject(LoadingService);
  private toast = inject(ToastService);

  subChoices: SubChoice[] = [];

  constructor() {}

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

  async searchArtiste(): Promise<void> {
    const selected = ['Chanteur', 'Rappeur'];
    await this.navigateTo(selected);
  }

  async searchRappeur(): Promise<void> {
    const selected = ['Rappeur'];
    await this.navigateTo(selected);
  }

  async searchChanteur(): Promise<void> {
    const selected = ['Chanteur'];
    await this.navigateTo(selected);
  }

  async searchMusic(): Promise<void> {
    const selected = ['Beatmaker', 'Ingé. Son'];
    await this.navigateTo(selected);
  }

  async searchProd(): Promise<void> {
    const selected = ['Beatmaker'];
    await this.navigateTo(selected);
  }

  async searchRecordMixMaster(): Promise<void> {
    const selected = ['Ingé. Son'];
    await this.navigateTo(selected);
  }

  async searchVideo(): Promise<void> {
    const selected = ['Cadreur', 'Clippeur', 'Réalisateur', 'Styliste', 'Monteur', 'Expert FX'];
    await this.navigateTo(selected);
  }

  async searchRealisation(): Promise<void> {
    const selected = ['Cadreur', 'Clippeur', 'Réalisateur', 'Styliste'];
    await this.navigateTo(selected);
  }

  async searchMontage(): Promise<void> {
    const selected = ['Monteur', 'Expert FX'];
    await this.navigateTo(selected);
  }

  async searchVisuel(): Promise<void> {
    const selected = ['Photographe', 'Graphiste'];
    await this.navigateTo(selected);
  }

  async searchCover(): Promise<void> {
    const selected = ['Graphiste'];
    await this.navigateTo(selected);
  }

  async searchPhotoShoot(): Promise<void> {
    const selected = ['Photographe'];
    await this.navigateTo(selected);
  }

  async searchBusiness(): Promise<void> {
    const selected = ['Influenceur', 'Journaliste', 'Manager', 'Expert DA', 'Media'];
    await this.navigateTo(selected);
  }

  async searchReseauxSociaux(): Promise<void> {
    const selected = ['Influenceur', 'Journaliste', 'Media'];
    await this.navigateTo(selected);
  }

  async searchManagement(): Promise<void> {
    const selected = ['Manager', 'Expert DA'];
    await this.navigateTo(selected);
  }

  async navigateTo(selected: any): Promise<void> {
    await this.router.navigate(
      ['/search'],
      {
        queryParams: selected.length ? { categories: selected } : { categories: null },
        queryParamsHandling: 'merge',
      }
    );
  }
}
