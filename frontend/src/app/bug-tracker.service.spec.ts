import { TestBed } from '@angular/core/testing';

import { BugTrackerService } from './bug-tracker.service';

describe('BugTrackerService', () => {
  let service: BugTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BugTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
