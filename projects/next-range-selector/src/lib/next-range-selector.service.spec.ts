import {TestBed} from '@angular/core/testing';

import {NextRangeSelectorService} from './next-range-selector.service';

describe('NextRangeSelectorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NextRangeSelectorService = TestBed.get(NextRangeSelectorService);
    expect(service).toBeTruthy();
  });
});
