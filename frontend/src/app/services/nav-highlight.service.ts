import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface NavHighlightCategory {
  id: number | null;
  name: string | null;
}

@Injectable({ providedIn: 'root' })
export class NavHighlightService {
  private categorySubject = new BehaviorSubject<NavHighlightCategory | null>(null);
  readonly category$ = this.categorySubject.asObservable();

  setCategory(category: NavHighlightCategory | null): void {
    this.categorySubject.next(category);
  }

  clear(): void {
    this.categorySubject.next(null);
  }
}

