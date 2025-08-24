import { Component, inject } from '@angular/core';
import { PlanetStore } from '../planets.store';
import { PlanetCardComponent } from './planet-card/planet-card.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';

@Component({
  selector: 'app-planets-grid',
  standalone: true,
  imports: [PlanetCardComponent, LoaderComponent],
  templateUrl: './planets-grid.component.html',
  styleUrl: './planets-grid.component.scss',
})
export class PlanetsGridComponent {
  planetStore = inject(PlanetStore);
}
