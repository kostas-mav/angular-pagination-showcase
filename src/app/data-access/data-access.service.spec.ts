import { TestBed, waitForAsync } from '@angular/core/testing';
import { DataAccessService, DogApiResponse } from './data-access.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { take } from 'rxjs';

describe('Data Access Service', () => {
  let dataAccessService: DataAccessService;
  let httpTestingController: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataAccessService],
    })
      .compileComponents()
      .then(() => {
        dataAccessService = TestBed.inject(DataAccessService);
        httpTestingController = TestBed.inject(HttpTestingController);
      });
  }));

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(dataAccessService).toBeTruthy();
  });

  it('should make an HTTP GET request to retrieve dog images', () => {
    const limit = 5;
    const expectedResponse: DogApiResponse = {
      message: ['image1', 'image2', 'image3', 'image4', 'image5'],
      status: 'success',
    };

    dataAccessService
      .getImages(limit)
      .pipe(take(1))
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    const req = httpTestingController.expectOne(
      `https://dog.ceo/api/breeds/image/random/${limit}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponse);
  });
});
