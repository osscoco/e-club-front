import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth-service.service';
import { ToastService } from '../../services/toast/toast.service';

const PUBLIC_PATHS = new Set<string>(['/', '/login', '/register']);

function normalizePath(url: string): string {
  const i = url.indexOf('?');
  const j = url.indexOf('#');
  const cut = [i < 0 ? url.length : i, j < 0 ? url.length : j].reduce((a, b) => Math.min(a, b), url.length);
  return url.substring(0, cut) || '/';
}

function isPublicPath(path: string) {
  return PUBLIC_PATHS.has(normalizePath(path));
}

function safeUrlTree(router: Router, target: string): UrlTree {
  const path = normalizePath(target);
  if (path === '/login' || path === '/register') {  
    return router.parseUrl('/');
  }
  return router.parseUrl(target || '/');
}

/**
 * Guard 1: guestOnlyGuard
 * - Autorise l’accès à /login & /register uniquement si NON connecté
 * - Si connecté, redirige vers returnUrl (si présent et sûr), sinon '/'
 */
export const guestOnlyGuard: CanActivateFn = (route, state) => {

  // Injections
  const toast = inject(ToastService);
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAuthenticated$.pipe(
    map(isAuth => {
      if (!isAuth) return true;
      const qpReturn = route.queryParamMap.get('returnUrl') ?? '';
      if (qpReturn && !PUBLIC_PATHS.has(normalizePath(qpReturn))) {
        return safeUrlTree(router, qpReturn);
      }
      const current = router.routerState.snapshot.url;
      if (current && !PUBLIC_PATHS.has(normalizePath(current))) {
        return safeUrlTree(router, current);
      }
      toast.error("Déconnectez-vous d'abord", 'Authentification');
      return router.parseUrl('/');
    })
  );
};

/**
 * Guard 2: authRequiredGuard
 * - Pour les routes PRIVÉES.
 * - Si connecté → OK.
 * - Si non connecté → si la route est publique ('/', '/login', '/register'), on laisse passer,
 *   sinon redirige vers /login?returnUrl=<route demandée>.
 */
export const authRequiredGuard: CanActivateFn = (route, state) => {

  // Injections
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAuthenticated$.pipe(
    map(isAuth => {
      const target = state.url || '/';
      const path = normalizePath(target);
      if (isAuth) {
        if (path === '/login' || path === '/register') {
          return router.parseUrl('/');
        }
        return true;
      }
      if (isPublicPath(path)) {
        return true;
      }
      return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: target }
      });
    })
  );
};