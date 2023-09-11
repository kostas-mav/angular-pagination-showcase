import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

export interface DBItem {
  id: string;
  url: string;
  width: number;
  height: number;
  breeds: string[];
  favourite: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class DataAccessService {
  private readonly API_KEY =
    'live_6rXieVd5Rc36FJwCaIxrJ4NeoY88SJzmMv28nwQBlISpei46tpLwvd6GKMXya8UT';

  http = inject(HttpClient);

  items$ = new BehaviorSubject<DBItem[]>([]);

  getImages() {
    return this.http
      .get<DBItem[]>('https://api.thecatapi.com/v1/images/search', {
        params: {
          limit: '50',
        },
        headers: {
          'x-api-key': this.API_KEY,
        },
      })
      .pipe(
        tap((items) => {
          console.log(items);
          this.items$.next(items);
        })
      );
  }
}
