import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface LoadingView {
  /** true si au moins une action est en cours */
  active: boolean;
  /** message facultatif affiché sous le spinner */
  message?: string;
}

/**
 * Service de loading bloquant (overlay plein écran).
 * - begin(message?) -> id : active et retourne un id
 * - end(id?) : met fin à l’action associée à l’id (ou décrémente)
 * - endAll() : force l’arrêt de tout loading
 *
 * Gère un compteur interne pour supporter le parallélisme (plusieurs begin).
 */
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private idSeq = 1;
  private stack = new Map<number, string | undefined>(); // id -> message
  private readonly state$ = new BehaviorSubject<LoadingView>({ active: false });

  /** Observable à binder dans le composant */
  readonly view$ = this.state$.asObservable();

  /** Démarre un loading et retourne un id (à passer à end) */
  begin(message?: string): number {
    const id = this.idSeq++;
    this.stack.set(id, message);
    this.publish();
    // lock scroll
    document.documentElement.style.overflow = 'hidden';
    return id;
  }

  /** Termine un loading (si id fourni) ou décrémente une unité */
  end(id?: number): void {
    if (id && this.stack.has(id)) {
      this.stack.delete(id);
    } else if (!id && this.stack.size > 0) {
      // fallback : retire arbitrairement le dernier
      const last = Array.from(this.stack.keys()).at(-1)!;
      this.stack.delete(last);
    }
    this.publish();
    if (this.stack.size === 0) {
      document.documentElement.style.overflow = '';
    }
  }

  /** Force l’arrêt total */
  endAll(): void {
    this.stack.clear();
    this.publish();
    document.documentElement.style.overflow = '';
  }

  /** Helpers optionnels si tu préfères show/hide “simples” */
  show(message?: string) { return this.begin(message); }
  hide(id?: number) { this.end(id); }

  /** Etat courant = actif si stack non vide, message = dernier message non vide */
  private publish(): void {
    let message: string | undefined;
    for (const m of Array.from(this.stack.values()).reverse()) {
      if (m) { message = m; break; }
    }
    this.state$.next({ active: this.stack.size > 0, message });
  }
}
