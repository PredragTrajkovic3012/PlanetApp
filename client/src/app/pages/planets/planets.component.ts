import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { DisplayModeService } from '@shared/services/display-mode.service';
import { PlanetService } from '@shared/services/planet.service';

@Component({
  selector: 'app-planets',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './planets.component.html',
  styleUrl: './planets.component.scss',
})
export class PlanetsComponent implements OnInit {
  displayModeService = inject(DisplayModeService);
  planetService = inject(PlanetService);

  ngOnInit(): void {
    this.displayModeService.redirect();
    this.planetService.getPlanets().subscribe({
      next: (planets) => {
        console.log('Planets loaded:', planets);
      },
      error: (error) => {
        console.error('Error loading planets:', error);
      },
    });
  }
}
