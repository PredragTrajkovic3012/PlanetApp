import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Planet } from '@shared/models/planet.model';

@Component({
  selector: 'app-planet-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './planet-card.component.html',
  styleUrl: './planet-card.component.scss',
})
export class PlanetCardComponent {
  @Input({ required: true }) planet: Planet | null = null;
}
