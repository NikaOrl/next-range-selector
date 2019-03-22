import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NextRangeSelectorDotComponent} from './next-range-selector-dot.component';

describe('NextRangeSelectorDotComponent', () => {
  let component: NextRangeSelectorDotComponent;
  let fixture: ComponentFixture<NextRangeSelectorDotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NextRangeSelectorDotComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NextRangeSelectorDotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
