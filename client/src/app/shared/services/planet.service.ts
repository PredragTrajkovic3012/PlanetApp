import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlanetService {
  http = inject(HttpClient);

  getPlanets() {
    const url = `${environment.serverEndpoint}planets`;
    return this.http.get<any[]>(url).pipe(take(1));
  }
}
