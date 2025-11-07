import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast, ToastKind } from '../../interfaces/Toast';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();
  private idSeq = 1;

  private push(kind: ToastKind, message: string, title?: string, duration = 3500) {
    const id = this.idSeq++;
    const toast: Toast = { id, kind, message, title, duration };
    const list = this.toastsSubject.value;
    this.toastsSubject.next([...list, toast]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
    return id;
  }

  show(message: string, opts?: { kind?: ToastKind; title?: string; duration?: number }) {
    const { kind = 'info', title, duration = 3500 } = opts || {};
    return this.push(kind, message, title, duration);
  }

  success(msg: string, title?: string, duration?: number) { return this.push('success', msg, title, duration); }
  error(msg: string, title?: string, duration?: number)   { return this.push('error', msg, title, duration); }
  warning(msg: string, title?: string, duration?: number) { return this.push('warning', msg, title, duration); }
  info(msg: string, title?: string, duration?: number)    { return this.push('info', msg, title, duration); }

  toastPlay(msg: string, kind: ToastKind = 'info', duration?: number) { return this.push(kind, msg, undefined, duration); }
  toastStop(id?: number) { id ? this.dismiss(id) : this.clear(); }

  dismiss(id: number) {
    this.toastsSubject.next(this.toastsSubject.value.filter(t => t.id !== id));
  }
  clear() {
    this.toastsSubject.next([]);
  }
}