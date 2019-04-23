import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NextRangeSelectorComponent} from '../public_api';
import {Component, DebugElement} from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';

@Component({
  template: `
    <form [formGroup]="appFormGroup" class="reactive-form">
      <div class="container">
        <next-range-selector
          formControlName="rangeSelectorFormControl"
          [id]="'next-range-selector-0'"
          [minRange]="20"
        ></next-range-selector>
        <next-range-selector
          formControlName="rangeSelectorFormControl2"
          [minRange]="20"
          [order]="false"
          [id]="'next-range-selector-1'"
          [direction]="'btt'"
        ></next-range-selector>
        <label for="checkbox-1">Some text</label>
      </div>
    </form>
  `,
})
class RangeSelectorWithReactiveFormsComponent {
  public appFormGroup = new FormGroup({
    rangeSelectorFormControl: new FormControl([10, 50]),
    rangeSelectorFormControl2: new FormControl(10),
  });
}

describe('Control', () => {
  let component: RangeSelectorWithReactiveFormsComponent;
  let fixture: ComponentFixture<RangeSelectorWithReactiveFormsComponent>;
  let rangeSelectorInstance: NextRangeSelectorComponent;
  let rangeSelectorInstance2: NextRangeSelectorComponent;
  let componentDebug: DebugElement;

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
    componentDebug = fixture.debugElement.query(By.css('#next-range-selector-0'));
    rangeSelectorInstance = componentDebug.componentInstance;
    rangeSelectorInstance2 = fixture.debugElement.query(By.css('#next-range-selector-1')).componentInstance;
  });

  it('Event: initControl', () => {
    expect(rangeSelectorInstance.control).toBeTruthy();
  });

  it('Method: setDotPos', () => {
    rangeSelectorInstance.control.setDotPos(50, 0);
    expect(rangeSelectorInstance.control.dotsValue[0]).toBe(50);

    rangeSelectorInstance2.control.setDotPos(110, 0);
    expect(rangeSelectorInstance2.control.dotsValue[0]).toBe(100);

    rangeSelectorInstance2.control.setDotPos(undefined, 0);
    expect(rangeSelectorInstance2.control.dotsValue[0]).toBe(100);

    rangeSelectorInstance.control.fixed = true;
    rangeSelectorInstance.control.minRange = 0;
    rangeSelectorInstance.control.setDotPos(110, 0);
    expect(rangeSelectorInstance.control.dotsValue[0]).toBe(60);
  });

  it('Method: parseValue', () => {
    let value = rangeSelectorInstance.control.parseValue(50);
    expect(value).toBe(50);

    value = rangeSelectorInstance.control.parseValue(110);
    expect(value).toBe(0);

    value = rangeSelectorInstance.control.parseValue(-10);
    expect(value).toBe(0);

    value = rangeSelectorInstance.control.parseValue('a');
    expect(value).toBe(0);

    rangeSelectorInstance.control.data = [10, 20, 30, 40, 50];
    value = rangeSelectorInstance.control.parseValue(40);
    expect(value).toBe(3);
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
    expect(rangeSelectorInstance.control.getRecentDot(20, [{min: 0, max: 10}])).toBe(1);
  });

  it('Method: getIndexByValue', () => {
    rangeSelectorInstance.control.interval = 10;
    expect(rangeSelectorInstance.control.getIndexByValue(20)).toBe(2);
    expect(rangeSelectorInstance.control.getIndexByValue(100)).toBe(10);
  });

  it('Method: getValues', () => {
    rangeSelectorInstance.control.interval = 10;
    expect(rangeSelectorInstance.control.getValues()).toEqual([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
    rangeSelectorInstance.control.data = [10, 20, 30, 40, 50];
    expect(rangeSelectorInstance.control.getValues()).toEqual([10, 20, 30, 40, 50]);
  });

  it('Method: getIndexByValue & getValueByIndex', () => {
    rangeSelectorInstance.control.interval = 10;

    expect(rangeSelectorInstance.control.getValueByIndex(2)).toBe(20);
    expect(rangeSelectorInstance.control.getValueByIndex(11)).toBe(100);
    expect(rangeSelectorInstance.control.getValueByIndex(-1)).toBe(0);

    expect(rangeSelectorInstance.control.getIndexByValue(20)).toBe(2);
    rangeSelectorInstance.control.data = [10, 20, 30, 40, 50];
    expect(rangeSelectorInstance.control.getIndexByValue(20)).toBe(1);
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
    rangeSelectorInstance2.control.setValue([40, 0]);
    rangeSelectorInstance2.control.setDotPos(80, 0);
    expect(rangeSelectorInstance2.control.dotsValue).toEqual([80, 0]);
    expect(rangeSelectorInstance2.control.minRange).toEqual(0);

    rangeSelectorInstance.control.setValue([40, 0]);
    rangeSelectorInstance.control.setDotPos(80, 0);
    expect(rangeSelectorInstance.control.dotsValue).toEqual([0, 80]);
    expect(rangeSelectorInstance.control.minRange).toEqual(20);
  });

  it('Getter: processArray', () => {
    expect(rangeSelectorInstance.control.processArray[0]).toEqual([10, 50]);
    expect(rangeSelectorInstance2.control.processArray[0]).toEqual([0, 10]);
    rangeSelectorInstance.control.process = false;
    expect(rangeSelectorInstance.control.processArray).toEqual([]);
  });

  it('Getter: total', () => {
    expect(rangeSelectorInstance.control.total).toEqual(100);
    rangeSelectorInstance.control.interval = 3;
    expect(rangeSelectorInstance.control.total).toEqual(0);
  });

  it('keydown', () => {
    const onPointerMoveSpy = spyOn(rangeSelectorInstance, 'onPointerMove');
    // const closeSpy = spyOn(component.d, 'close');
    const event = {};

    componentDebug.triggerEventHandler('', event);
    expect(onPointerMoveSpy).toHaveBeenCalled();
    // expect(closeSpy).toHaveBeenCalled();
  });
});
