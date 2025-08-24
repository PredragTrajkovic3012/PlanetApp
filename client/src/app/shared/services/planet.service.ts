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

  /** Get all planets */
  getPlanets(): Observable<Planet[]> {
    return this.http.get<Planet[]>(this.apiUrl + 'planets').pipe(take(1));
  }

  getPlanetById(id: number): Observable<Planet> {
    return this.http.get<Planet>(`${this.apiUrl}planets/${id}`).pipe(take(1));
  }
}
