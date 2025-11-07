import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FilterService {
  private filters: { categories: string[] } = { categories: [] };

  setFilters(filters: { categories: string[] }) {
    this.filters = filters;
  }

  getFilters(): { categories: string[] } {
    return this.filters;
  }

  clearFilters() {
    this.filters = { categories: [] };
  }
}