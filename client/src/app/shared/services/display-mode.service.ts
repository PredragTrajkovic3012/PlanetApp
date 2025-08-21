import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DisplayModeService {
  isTable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  router = inject(Router);

  redirect() {
    if (this.router.url.includes('table') || this.router.url.includes('grid')) return;
    this.router.navigate([this.router.url, this.isTable.getValue() ? 'table' : 'grid']);
  }

  setIsTable() {
    this.isTable.next(!this.isTable.getValue());
    localStorage.setItem('displayMode', this.isTable.getValue() ? 'table' : 'grid');
    this.changeView();
  }

  changeView() {
    let newUrl = this.router.url;
    newUrl = newUrl.replace(/\/(grid|table)$/, '');
    newUrl += this.isTable.getValue() ? '/table' : '/grid';
    this.router.navigate([newUrl]);
  }
}
