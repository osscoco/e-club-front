import { Component, inject, OnInit } from '@angular/core';
import { PaginationListProfessionnelComponent } from '../../shared-components/pagination-list-professionnel/pagination-list-professionnel.component';
import { LoadingService } from '../../services/loading/loading.service';
import { ApiService } from '../../services/api/api.service';
import { ToastService } from '../../services/toast/toast.service';
import { finalize } from 'rxjs/internal/operators/finalize';

@Component({
  selector: 'app-search-professionnel',
  standalone: true,
  imports: [PaginationListProfessionnelComponent],
  templateUrl: './search-professionnel.component.html',
  styleUrl: './search-professionnel.component.css'
})
export class SearchProfessionnelComponent implements OnInit {

  // Injections
  private api = inject(ApiService);
  private loading = inject(LoadingService);
  private toast = inject(ToastService);

  // Liste Utilisateurs
  cardList: any[] = [];

  constructor() {}

  // Chargement de la liste des utilisateurs
  loadUsers(): void {
    const id = this.loading.begin('');
    this.api.getUsers(1, 25)
    .pipe(finalize(() => this.loading.end(id)))
    .subscribe({
      next: (res) => {
        this.cardList = res.data.items;
        this.cardList.forEach(user => {
          if (!user.choices) return;

          const priorityNames = ['Chanteur', 'Rappeur'];

          user.choices.sort((a: any, b: any) => {
            const aPriority = priorityNames.includes(a.subChoice?.name ?? '') ? 0 : 1;
            const bPriority = priorityNames.includes(b.subChoice?.name ?? '') ? 0 : 1;
            return aPriority - bPriority;
          });
        });
      },
      error: (err) => {
        this.toast.error('Serveur Injoignable ...', 'Serveur'); 
      }
    });
  }

  // Appels des chargements des listes
  ngOnInit(): void {
    this.loadUsers();
  }
}