import { Injectable, OnDestroy, inject } from '@angular/core';
import { Router, Event,
  NavigationStart, NavigationEnd, NavigationCancel, NavigationError,
  GuardsCheckStart, GuardsCheckEnd, ResolveStart, ResolveEnd,
  RouteConfigLoadStart, RouteConfigLoadEnd
} from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { LoadingService } from '../loading/loading.service';

@Injectable({ providedIn: 'root' })
export class RouteLoadingService implements OnDestroy {
  private router = inject(Router);
  private loading = inject(LoadingService);
  private sub: Subscription;

  private navCount = 0;           // nombre d'étapes en cours (start/guards/resolve/lazy)
  private loadingId?: number;     // id du loading courant
  private startedAt = 0;
  private readonly minShownMs = 180; // anti-flicker

  constructor() {
    this.sub = this.router.events.subscribe((event: Event) => {
      // ===== Débuts potentiels =====
      if (
        event instanceof NavigationStart ||
        event instanceof GuardsCheckStart ||
        event instanceof ResolveStart ||
        event instanceof RouteConfigLoadStart
      ) {
        this.beginIfNeeded();
      }

      // ===== Fins potentielles =====
      if (
        event instanceof GuardsCheckEnd ||
        event instanceof ResolveEnd ||
        event instanceof RouteConfigLoadEnd
      ) {
        this.stepDone();
      }

      // ===== Terminaison navigation =====
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.stepDone(true); // force la fermeture
      }
    });
  }

  private beginIfNeeded() {
    this.navCount++;
    if (!this.loadingId) {
      this.loadingId = this.loading.begin('');
      this.startedAt = Date.now();
    }
  }

  private stepDone(forceClose = false) {
    if (this.navCount > 0) this.navCount--;

    if (forceClose || this.navCount === 0) {
      const elapsed = Date.now() - this.startedAt;
      const delay = Math.max(0, this.minShownMs - elapsed);
      const toClose = this.loadingId;
      this.loadingId = undefined;
      this.navCount = 0; // reset sécurité
      timer(delay).subscribe(() => { if (toClose) this.loading.end(toClose); });
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}