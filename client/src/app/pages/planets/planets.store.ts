import { effect, inject } from '@angular/core';

import { getState, patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';

import { Planet } from '@shared/models/planet.model';
import { environment } from '../../../environments/environment';
import { PlanetService } from '@shared/services/planet.service';
import { pipe, switchMap, tap } from 'rxjs';

import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { MessageService } from '@shared/services/message.service';
import { Router } from '@angular/router';

type PlanetsState = {
  planets: Planet[];
  filteredPlanets: Planet[];
  overviewedPlanet: Planet;
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
  withMethods(
    (
      store,
      planetService = inject(PlanetService),
      messageService = inject(MessageService),
      router = inject(Router),
    ) => ({
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

      deletePlanet: rxMethod(
        pipe(
          switchMap((planetId: number) => {
            return planetService.deletePlanet(planetId).pipe(
              tapResponse({
                next: () => {
                  const updatedPlanets = store.planets()?.filter(p => p.id !== planetId) ?? [];
                  const updatedFilteredPlanets = store.filteredPlanets()?.filter(p => p.id !== planetId) ?? [];
                  patchState(store, {
                    planets: updatedPlanets,
                    filteredPlanets: updatedFilteredPlanets,
                    overviewedPlanet: null,
                  });
                  messageService.success('Boom! You just destroyed a planet in the galaxy!');
                  router.navigate(['/planets']);
                },
                error: () => {
                  messageService.error('Galactic error: Planet destruction attempt unsuccessful.');
                },
              }),
            );
          }),
        ),
      ),
      addPlanet: rxMethod(
        pipe(
          switchMap((formData: FormData) => {
            return planetService.createPlanet(formData).pipe(
              tapResponse({
                next: (newPlanet: Planet) => {
                  const updatedPlanets = [...(store.planets() ?? []), newPlanet];
                  patchState(store, {
                    planets: updatedPlanets,
                    filteredPlanets: updatedPlanets,
                  });
                  messageService.success(`Planet "${newPlanet.planetName}" successfully added to the galaxy!`);
                },
                error: () => {
                  messageService.error('Failed to add new planet. Galactic error!');
                },
              }),
            );
          }),
        ),
      ),
      updatePlanet: rxMethod(
        pipe(
          switchMap(({ id, formData }: { id: number; formData: FormData }) => {
            return planetService.updatePlanet(id, formData).pipe(
              tapResponse({
                next: (updatedPlanet: Planet) => {
                  const updatedPlanets =
                    store.planets()?.map(p => (p.id === updatedPlanet.id ? updatedPlanet : p)) ?? [];
                  const updatedFilteredPlanets =
                    store.filteredPlanets()?.map(p => (p.id === updatedPlanet.id ? updatedPlanet : p)) ?? [];

                  patchState(store, {
                    planets: updatedPlanets,
                    filteredPlanets: updatedFilteredPlanets,
                    overviewedPlanet:
                      store.overviewedPlanet()?.id === updatedPlanet.id ? updatedPlanet : store.overviewedPlanet(),
                  });

                  messageService.success(`Planet "${updatedPlanet.planetName}" successfully updated!`);
                },
                error: () => {
                  messageService.error('Failed to update planet. Galactic error!');
                },
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
      patchPlanet(planet: Planet): void {
        const updatedPlanets = [...(store.planets() ?? []), planet];
        messageService.success('New planet successfully added to the galaxy!');
        patchState(store, {
          planets: updatedPlanets,
          filteredPlanets: updatedPlanets,
        });
      },
    }),
  ),
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
