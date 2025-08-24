import { inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DisplayModeService {
  private router = inject(Router);
  isTable$ = new BehaviorSubject<boolean>(true); // default table

  constructor() {
    // Syncuj stanje sa URL-om
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      const url = this.router.url;
      if (url.includes('/grid')) {
        this.isTable$.next(false);
      } else if (url.includes('/table')) {
        this.isTable$.next(true);
      }
    });

    // Inicijalni state iz localStorage
    const saved = localStorage.getItem('displayMode');
    if (saved) {
      this.isTable$.next(saved === 'table');
    }
  }

  toggleView() {
    const current = this.isTable$.getValue();
    const newMode = !current;

    // update lokalno
    this.isTable$.next(newMode);
    localStorage.setItem('displayMode', newMode ? 'table' : 'grid');

    // update URL
    const baseUrl = this.router.url.replace(/\/(grid|table)$/, '');
    this.router.navigate([`${baseUrl}/${newMode ? 'table' : 'grid'}`]);
  }
  // isTable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // router = inject(Router);

  // redirect() {
  //   if (this.router.url.includes('table') || this.router.url.includes('grid')) return;
  //   this.router.navigate([this.router.url, this.isTable.getValue() ? 'table' : 'grid']);
  // }

  // setIsTable() {
  //   this.isTable.next(!this.isTable.getValue());
  //   localStorage.setItem('displayMode', this.isTable.getValue() ? 'table' : 'grid');
  //   this.changeView();
  // }

  // changeView() {
  //   let newUrl = this.router.url;
  //   newUrl = newUrl.replace(/\/(grid|table)$/, '');
  //   newUrl += this.isTable.getValue() ? '/table' : '/grid';
  //   this.router.navigate([newUrl]);
  // }
}
