import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataAccessStore } from './data-access-store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { map, of, skip, take, tap, throwError } from 'rxjs';
import { DataAccessService } from './data-access.service';
import { HttpErrorResponse } from '@angular/common/http';

const mockDataAccessService = {
  getImages: (limit: number) =>
    of({ message: [`image1`, `image2`], status: 'success' }),
};

fdescribe('DataAccessStore', () => {
  let store: DataAccessStore;
  let service: DataAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DataAccessStore,
        provideMockStore({
          initialState: { items: [], loading: false, limit: 50 },
        }),
        {
          provide: DataAccessService,
          useValue: mockDataAccessService,
        },
      ],
    });

    service = TestBed.inject(DataAccessService);
    store = TestBed.inject(DataAccessStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should set the limit', () => {
    const newLimit = 10;

    store.setLimit(newLimit);

    store.limit$.subscribe((limit) => {
      expect(limit).toBe(newLimit);
    });
  });

  it('should return items from state', (done: DoneFn) => {
    service.getImages(2).subscribe(({ message }) => {
      store.patchState({ items: message });

      store.items$.pipe(take(1)).subscribe({
        next: (m: string[]) => {
          expect(m.length).toBe(message.length);
          done();
        },
      });
    });
  });

  it('should update the state with the returned images', (done: DoneFn) => {
    service.getImages(2).subscribe(({ message }) => {
      store.patchState({ items: message });

      store.state$.pipe(take(1)).subscribe({
        next: (state) => {
          expect(state.items).toEqual(message);
          done();
        },
      });
    });
  });
});
