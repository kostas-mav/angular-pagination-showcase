import { Injectable, inject } from '@angular/core';
import { finalize, take, tap, withLatestFrom } from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';
import { DataAccessService } from './data-access.service';

interface AppStore {
  items: string[];
  loading: boolean;
  limit: number;
}

@Injectable({
  providedIn: 'root',
})
export class DataAccessStore extends ComponentStore<AppStore> {
  constructor() {
    super({
      items: [],
      loading: false,
      limit: 50,
    });
  }

  private dataAccessService: DataAccessService = inject(DataAccessService);

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
        this.dataAccessService
          .getImages(limit)
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

          this.dataAccessService
            .getImages(limit)
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
