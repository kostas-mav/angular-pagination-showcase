import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

export interface DogApiResponse {
  message: string[];
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataAccessService {
  private http = inject(HttpClient);

  getImages(limit: number) {
    return this.http.get<DogApiResponse>(
      `https://dog.ceo/api/breeds/image/random/${limit}`
    );
  }
}
