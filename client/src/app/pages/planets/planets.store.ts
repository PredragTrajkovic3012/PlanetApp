import { effect, inject } from '@angular/core';

import { getState, patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';

import { Planet } from '@shared/models/planet.model';
import { environment } from '../../../environments/environment';
import { PlanetService } from '@shared/services/planet.service';
import { pipe, switchMap, tap } from 'rxjs';

import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';

type PlanetsState = {
  planets: Planet[];
  filteredPlanets: Planet[];
  overviewedPlanet: Planet | null;
  isLoading?: boolean;
};

const initialState: PlanetsState = {
  planets: [],
  filteredPlanets: [],
  overviewedPlanet: null,
  isLoading: false,
};

export const PlanetStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, planetService = inject(PlanetService)) => ({
    getPlanets: rxMethod(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => {
          return planetService.getPlanets().pipe(
            tapResponse({
              next: (planets: Planet[]) => patchState(store, { planets }),
              error: console.error,
              finalize: () => patchState(store, { isLoading: false }),
            }),
          );
        }),
      ),
    ),
    getPlanetById: rxMethod(
      pipe(
        switchMap((planetId: number) => {
          return planetService.getPlanetById(planetId).pipe(
            tapResponse({
              next: planet => {
                patchState(store, { overviewedPlanet: planet });
              },
              error: console.error,
            }),
          );
        }),
      ),
    ),
    setSearchTerm(search: string): void {
      const filteredPlanets =
        store.planets()?.filter(planet => planet.planetName.toLowerCase().includes(search.toLowerCase())) ?? [];
      patchState(store, { filteredPlanets });
    },
    sortPlanets(sortDirection: 'asc' | 'desc' = 'asc'): void {
      let filteredPlanets: Planet[] = [];
      if (sortDirection === 'asc') {
        filteredPlanets = [...store.planets()].sort((a, b) => a.planetRadiusKM - b.planetRadiusKM);
      } else if (sortDirection === 'desc') {
        filteredPlanets = [...store.planets()].sort((a, b) => b.planetRadiusKM - a.planetRadiusKM);
      }
      patchState(store, { filteredPlanets });
    },
    resetState(): void {
      patchState(store, initialState);
    },
    clearOverviewPlanet(): void {
      patchState(store, { overviewedPlanet: null });
    },
  })),
  withHooks({
    onInit(store) {
      effect(() => {
        if (!environment.production) {
          const state = getState(store);
          console.log(' PlanetsStore state:', state);
        }
      });
    },
  }),
);
