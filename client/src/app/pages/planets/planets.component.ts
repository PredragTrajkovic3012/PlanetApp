import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlanetStore } from './planets.store';

@Component({
  selector: 'app-planets',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './planets.component.html',
  styleUrl: './planets.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanetsComponent implements OnInit {
  planetStore = inject(PlanetStore);

  ngOnInit(): void {
    this.planetStore.getPlanets({});
  }
}
