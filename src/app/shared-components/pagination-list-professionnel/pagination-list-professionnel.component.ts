import { NgFor, NgIf } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FilterService } from '../../services/filter/filter.service';
import { LoadingService } from '../../services/loading/loading.service';
import { ApiService } from '../../services/api/api.service';
import { ToastService } from '../../services/toast/toast.service';
import { finalize } from 'rxjs/internal/operators/finalize';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pagination-list-professionnel',
  standalone: true,
  imports: [NgFor,NgIf],
  templateUrl: './pagination-list-professionnel.component.html',
  styleUrl: './pagination-list-professionnel.component.css'
})
export class PaginationListProfessionnelComponent implements OnInit {

  // Injections
  private api = inject(ApiService);
  private loadingService = inject(LoadingService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  trackByCat = (_: number, cat: string) => cat;

  @Input() items: any[] = [];

  player = 'assets/images/user-type/player.png';
  coach = 'assets/images/user-type/coach.png';
  admin = 'assets/images/user-type/admin.png';
  undefined = 'assets/images/user-type/undefined.png';

  categories: string[] = [
    "player", "coach", "admin", "undefined"
  ];
  @Input() defaultCategories: string[] = [];

  selectedCategories: string[] = [];
  searchText: string = '';

  currentPage = 1;
  itemsPerPage = 6;
  subscriptions: Set<number> = new Set();
  loading = false;

  constructor(private filterService: FilterService) {}

  ngOnInit(): void {
    
    const filters = this.filterService.getFilters();
    if (filters.categories?.length) {
      this.selectedCategories = filters.categories;
    }

    this.route.queryParamMap.subscribe(qp => {
      const fromUrl = qp.getAll('categories'); // ex: ?categories=Coach&categories=Beatmaker
      const normalized = this.normalizeCategories(fromUrl);

      if (normalized.length) {
        this.selectedCategories = normalized;
      } else if (this.defaultCategories?.length) {
        // Si l’URL est vide, on applique le défaut fourni par le parent…
        this.selectedCategories = this.normalizeCategories(this.defaultCategories);
        // …et on l’écrit dans l’URL (sans empiler l’historique)
        this.writeCategoriesToUrl(this.selectedCategories, /*replaceUrl*/ true);
      } else {
        this.selectedCategories = [];
      }

      this.currentPage = 1;
    });
  }

  private normalizeCategories(values: string[] | null): string[] {
    if (!values?.length) return [];
    const seen = new Set<string>();
    const out: string[] = [];
    for (const v of values) {
      const trimmed = (v ?? '').trim();
      const key = trimmed.toLowerCase();
      if (trimmed && !seen.has(key)) {
        seen.add(key);
        out.push(trimmed); // conserve la casse d’origine
      }
    }
    return out;
  }

  private writeCategoriesToUrl(selected: string[], replaceUrl = false): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: selected.length ? { categories: selected } : { categories: null }, // null => suppression du param
      queryParamsHandling: 'merge',
      replaceUrl, // true = pas une nouvelle entrée d'historique
    });
  }

  getFilteredItems(): any[] {
    let filtered = [...this.items];

    if (this.searchText) {
      filtered = filtered.filter(item =>
        item.pseudo.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    if (this.selectedCategories.length) {
      const wanted = new Set(
        this.selectedCategories.map(s => s.trim().toLowerCase())
      );

      filtered = filtered.filter(user =>
        (user.choices ?? []).some((ch: any) =>
          wanted.has((ch?.subChoice?.name ?? '').trim().toLowerCase())
        )
      );
    }

    return filtered;
  }

  get filteredItems(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.getFilteredItems().slice(start, start + this.itemsPerPage);
  }

  onSearchTextChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchText = input.value;
  }

  onCategoryCheckboxChange(category: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories = this.selectedCategories.filter(cat => cat !== category);
    }
    this.currentPage = 1;
    this.writeCategoriesToUrl(this.selectedCategories, /*replaceUrl*/ true);
  }

  onItemsPerPageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.itemsPerPage = +select.value;
    this.currentPage = 1;
  }

  get totalPages(): number {
    return Math.ceil(this.getFilteredItems().length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  previousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  toggleSubscription(id: number): void {
    if (this.subscriptions.has(id)) {
      this.subscriptions.delete(id);
    } else {
      this.subscriptions.add(id);
    }
  }

  isSubscribed(id: number): boolean {
    return this.subscriptions.has(id);
  }

  toggleSelectAllCategories(): void {
    if (this.selectedCategories.length === this.categories.length) {
      this.selectedCategories = [];
    } else {
      this.selectedCategories = [...this.categories];
    }
    this.currentPage = 1;
    this.writeCategoriesToUrl(this.selectedCategories, /*replaceUrl*/ true);
  }
}