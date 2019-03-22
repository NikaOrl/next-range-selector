import { TestBed } from '@angular/core/testing';

import { NextRangeSelectorDotService } from './next-range-selector-dot.service';

describe('NextRangeSelectorDotService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NextRangeSelectorDotService = TestBed.get(NextRangeSelectorDotService);
    expect(service).toBeTruthy();
  });
});
