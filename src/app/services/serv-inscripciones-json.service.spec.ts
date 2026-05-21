import { TestBed } from '@angular/core/testing';

import { ServInscripcionesJsonService } from './serv-inscripciones-json.service';

describe('ServInscripcionesJsonService', () => {
  let service: ServInscripcionesJsonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServInscripcionesJsonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
