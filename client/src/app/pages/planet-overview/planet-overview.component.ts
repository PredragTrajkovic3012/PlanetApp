import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlanetStore } from '@pages/planets/planets.store';

@Component({
  selector: 'app-planet-overview',
  standalone: true,
  templateUrl: './planet-overview.component.html',
  styleUrl: './planet-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanetOverviewComponent implements OnInit, OnDestroy {
  activatedRoute = inject(ActivatedRoute);
  planetStore = inject(PlanetStore);
  selectedImage: string | null = null;

  ngOnInit(): void {
    this.planetStore.getPlanetById(+this.activatedRoute.snapshot.params['id']);
  }

  openLightbox(src: string) {
    this.selectedImage = src;
  }

  closeLightbox() {
    this.selectedImage = null;
  }

  ngOnDestroy(): void {
    this.planetStore.clearOverviewPlanet();
  }
}
