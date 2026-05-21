import { TestBed } from '@angular/core/testing';

import { ServEventsJsonService } from './serv-events-json.service';

describe('ServEventsJsonService', () => {
  let service: ServEventsJsonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServEventsJsonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
