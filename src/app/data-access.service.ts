import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { finalize, take, tap, withLatestFrom } from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';

interface DogApiResponse {
  message: string[];
  status: string;
}

interface AppStore {
  items: string[];
  loading: boolean;
  limit: number;
}

@Injectable({
  providedIn: 'root',
})
export class DataAccessService extends ComponentStore<AppStore> {
  constructor() {
    super({
      items: [],
      loading: false,
      limit: 50,
    });
  }

  private http = inject(HttpClient);

  readonly items$ = this.select((state) => state.items);
  readonly loading$ = this.select((state) => state.loading);
  readonly limit$ = this.select((state) => state.limit);

  setLimit(limit: number) {
    this.patchState({
      limit,
    });
  }

  getImages = this.effect(($) =>
    $.pipe(
      withLatestFrom(this.limit$),
      tap(([$, limit]) => {
        this.patchState({ loading: true });
        this.http
          .get<DogApiResponse>(
            `https://dog.ceo/api/breeds/image/random/${limit}`
          )
          .pipe(
            take(1),
            tap((items) => {
              this.patchState({
                items: items.message,
              });
            }),
            finalize(() => this.patchState({ loading: false }))
          )
          .subscribe();
      })
    )
  );

  loadMore = this.effect(($) =>
    $.pipe(
      withLatestFrom(this.loading$, this.limit$),
      tap(([$, loading, limit]) => {
        if (loading) {
          return;
        } else {
          this.patchState({ loading: true });

          this.http
            .get<DogApiResponse>(
              `https://dog.ceo/api/breeds/image/random/${limit}`
            )
            .pipe(
              take(1),
              withLatestFrom(this.items$),
              tap(([newItems, existingItems]) => {
                this.patchState({
                  items: [...existingItems, ...newItems.message],
                });
              }),
              finalize(() => this.patchState({ loading: false }))
            )
            .subscribe();
        }
      })
    )
  );
}
