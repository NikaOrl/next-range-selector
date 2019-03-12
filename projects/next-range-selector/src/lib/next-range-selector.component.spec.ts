import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NextRangeSelectorComponent } from './next-range-selector.component';

describe('NextRangeSelectorComponent', () => {
  let component: NextRangeSelectorComponent;
  let fixture: ComponentFixture<NextRangeSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NextRangeSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NextRangeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
