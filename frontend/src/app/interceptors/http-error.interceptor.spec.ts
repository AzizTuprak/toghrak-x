import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { UiMessageService } from '../services/ui-message.service';

describe('HttpErrorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let ui: UiMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UiMessageService,
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    ui = TestBed.inject(UiMessageService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('shows a network error message when status is 0', () => {
    spyOn(ui, 'show').and.callThrough();

    http.get('/api/ping').subscribe({ next: () => {}, error: () => {} });
    const req = httpMock.expectOne('/api/ping');
    req.error(new ProgressEvent('error'));

    expect(ui.show).toHaveBeenCalledWith({
      kind: 'error',
      text: 'Cannot reach the server. Check your connection and that the backend is running.',
    });
  });

  it('shows a server error message when status is 500+', () => {
    spyOn(ui, 'show').and.callThrough();

    http.get('/api/ping').subscribe({ next: () => {}, error: () => {} });
    const req = httpMock.expectOne('/api/ping');
    req.flush({ message: 'boom' }, { status: 500, statusText: 'Server error' });

    expect(ui.show).toHaveBeenCalledWith({
      kind: 'error',
      text: 'Server error. Please try again.',
    });
  });

  it('does not show a message for 4xx errors', () => {
    spyOn(ui, 'show').and.callThrough();

    http.get('/api/ping').subscribe({ next: () => {}, error: () => {} });
    const req = httpMock.expectOne('/api/ping');
    req.flush({ message: 'bad request' }, { status: 400, statusText: 'Bad request' });

    expect(ui.show).not.toHaveBeenCalled();
  });
});

