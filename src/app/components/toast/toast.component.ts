import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast/toast.service';
import { Toast } from '../../interfaces/Toast';
import { AsyncPipe, NgFor } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, AsyncPipe, NgFor],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {

  // Injection
  svc = inject(ToastService);

  // CSS en fonction du type d'alert
  alertClass(t: Toast) {
    switch (t.kind) {
      case 'success': return 'alert alert-success';
      case 'error':   return 'alert alert-error';
      case 'warning': return 'alert alert-warning';
      default:        return 'alert alert-info';
    }
  }
}
