import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, take } from 'rxjs';
import { Planet } from '@shared/models/planet.model';

@Injectable({
  providedIn: 'root',
})
export class PlanetService {
  http = inject(HttpClient);

  private readonly apiUrl = `${environment.serverEndpoint}`;

  getPlanets(): Observable<Planet[]> {
    return this.http.get<Planet[]>(`${this.apiUrl}planets`).pipe(take(1));
  }

  getPlanetById(id: number): Observable<Planet> {
    return this.http.get<Planet>(`${this.apiUrl}planets/${id}`).pipe(take(1));
  }

  createPlanet(formData: FormData): Observable<Planet> {
    return this.http.post<Planet>(`${this.apiUrl}planets`, formData).pipe(take(1));
  }

  updatePlanet(id: number, formData: FormData): Observable<Planet> {
    return this.http.put<Planet>(`${this.apiUrl}planets/${id}`, formData).pipe(take(1));
  }
  deletePlanet(planetId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}planets/${planetId}`).pipe(take(1));
  }
}
