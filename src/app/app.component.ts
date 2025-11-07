import { Component, inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from "./components/footer/footer.component";
import { ToastComponent } from './components/toast/toast.component';
import { LoadingComponent } from "./components/loading/loading.component";
import { RouteLoadingService } from './services/route-loading/route-loading.service';
import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/internal/operators/filter';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastComponent, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Rap Connect';

  // Injections
  private _routeLoading = inject(RouteLoadingService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    this.scrollToTopOnNavigation();
  }

  private scrollToTopOnNavigation() {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }
}