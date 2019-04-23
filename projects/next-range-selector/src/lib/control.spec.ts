import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NextRangeSelectorComponent} from '../public_api';
import {Component} from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';

@Component({
  template: `
    <form [formGroup]="appFormGroup" class="reactive-form">
      <div class="container">
        <next-range-selector formControlName="rangeSelectorFormControl"></next-range-selector>
        <label for="checkbox-1">Some text</label>
      </div>
    </form>
  `,
})
class RangeSelectorWithReactiveFormsComponent {
  public appFormGroup = new FormGroup({
    rangeSelectorFormControl: new FormControl([10, 50]),
  });
}

describe('Control', () => {
  let component: RangeSelectorWithReactiveFormsComponent;
  let fixture: ComponentFixture<RangeSelectorWithReactiveFormsComponent>;
  let rangeSelectorInstance: NextRangeSelectorComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [RangeSelectorWithReactiveFormsComponent, NextRangeSelectorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeSelectorWithReactiveFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    rangeSelectorInstance = fixture.debugElement.query(By.directive(NextRangeSelectorComponent)).componentInstance;
  });

  it('Event: initControl', () => {
    expect(rangeSelectorInstance.control).toBeTruthy();
  });

  it('Method: setDotPos', async(() => {
    rangeSelectorInstance.control.setDotPos(50, 0);
    fixture.detectChanges();
    expect(rangeSelectorInstance.control.dotsValue[0]).toBe(50);
  }));

  it('Method: parseValue', () => {
    const value = rangeSelectorInstance.control.parseValue(50);
    expect(value).toBe(50);
  });

  it('Method: parsePos', () => {
    const value = rangeSelectorInstance.control.parsePos(50);
    expect(value).toBe(50);
  });

  it('Method: setValue & syncDotsPos', () => {
    rangeSelectorInstance.control.setValue(50);
    expect(rangeSelectorInstance.control.dotsPos).toEqual([50]);
    rangeSelectorInstance.control.setValue([0, 50]);
    expect(rangeSelectorInstance.control.dotsPos).toEqual([0, 50]);
  });

  it('Method: getRecentDot', () => {
    rangeSelectorInstance.control.setValue([0, 100]);
    expect(rangeSelectorInstance.control.getRecentDot(20)).toBe(0);
    expect(rangeSelectorInstance.control.getRecentDot(90)).toBe(1);
  });

  it('Method: getIndexByValue', () => {
    rangeSelectorInstance.control.interval = 10;
    expect(rangeSelectorInstance.control.getIndexByValue(20)).toBe(2);
    expect(rangeSelectorInstance.control.getIndexByValue(100)).toBe(10);
  }); // done

  it('Method: getIndexByValue & getValueByIndex', () => {
    rangeSelectorInstance.control.interval = 10;
    expect(rangeSelectorInstance.control.getIndexByValue(20)).toBe(2);
    expect(rangeSelectorInstance.control.getValueByIndex(2)).toBe(20);
  });

  it('Param: minRange', () => {
    rangeSelectorInstance.control.setValue([0, 100]);
    rangeSelectorInstance.control.minRange = 80;
    rangeSelectorInstance.control.setDotPos(70, 1);
    expect(rangeSelectorInstance.control.dotsValue[1]).toBe(80);
  });

  it('Param: maxRange', () => {
    rangeSelectorInstance.control.setValue([0, 20]);
    rangeSelectorInstance.control.maxRange = 50;
    rangeSelectorInstance.control.setDotPos(100, 1);
    expect(rangeSelectorInstance.control.dotsValue[0]).toBe(80);
  });

  it('Param: fixed', () => {
    rangeSelectorInstance.control.setValue([0, 40]);
    rangeSelectorInstance.control.fixed = true;
    rangeSelectorInstance.control.setDotPos(30, 0);
    expect(rangeSelectorInstance.control.dotsValue[1]).toBe(70);
  });

  it('Param: order', () => {
    rangeSelectorInstance.control.setValue([40, 0]);
    rangeSelectorInstance.control.order = false;
    rangeSelectorInstance.control.setDotPos(80, 0);
    expect(rangeSelectorInstance.control.dotsValue).toEqual([80, 0]);
  });
});
