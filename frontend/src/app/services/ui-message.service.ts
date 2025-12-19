import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type UiMessageKind = 'info' | 'success' | 'error';

export interface UiMessage {
  kind: UiMessageKind;
  text: string;
}

@Injectable({ providedIn: 'root' })
export class UiMessageService {
  private messageSubject = new BehaviorSubject<UiMessage | null>(null);
  readonly message$ = this.messageSubject.asObservable();

  private lastKey: string | null = null;
  private lastAt = 0;

  show(message: UiMessage, ttlMs = 6000): void {
    const key = `${message.kind}:${message.text}`;
    const now = Date.now();
    if (this.lastKey === key && now - this.lastAt < 1500) return;
    this.lastKey = key;
    this.lastAt = now;

    this.messageSubject.next(message);
    if (ttlMs > 0) {
      setTimeout(() => {
        if (this.messageSubject.value?.text === message.text) {
          this.clear();
        }
      }, ttlMs);
    }
  }

  clear(): void {
    this.messageSubject.next(null);
  }
}

