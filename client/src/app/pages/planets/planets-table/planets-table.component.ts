import { Component, inject } from '@angular/core';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { PlanetStore } from '../planets.store';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-planets-table',
  standalone: true,
  imports: [LoaderComponent, RouterLink],
  templateUrl: './planets-table.component.html',
  styleUrl: './planets-table.component.scss',
})
export class PlanetsTableComponent {
  planetStore = inject(PlanetStore);

  sortDirection: 'asc' | 'desc' = 'asc';

  toggleSort() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.planetStore.sortPlanets(this.sortDirection);
  }
}
