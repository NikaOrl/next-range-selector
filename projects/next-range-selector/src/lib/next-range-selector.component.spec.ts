import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';
import {DebugElement, Component} from '@angular/core';

import {NextRangeSelectorComponent, RangeSelectorDirection} from './next-range-selector.component';
import {MarksProp} from './typings';

@Component({
  template: `
    <form [formGroup]="appFormGroup" class="reactive-form">
      <div class="container">
        <next-range-selector
          formControlName="rangeSelectorFormControl"
          [id]="'next-range-selector-0'"
          [interval]="10"
        ></next-range-selector>
        <next-range-selector
          formControlName="rangeSelectorFormControl2"
          [id]="'next-range-selector-1'"
          [direction]="RangeSelectorDirection.btt"
          [interval]="10"
        ></next-range-selector>
      </div>
    </form>
  `,
})
class RangeSelectorWithReactiveFormsComponent {
  public appFormGroup = new FormGroup({
    rangeSelectorFormControl: new FormControl([10, 50]),
    rangeSelectorFormControl2: new FormControl([10, 50]),
  });

  public get RangeSelectorDirection() {
    return RangeSelectorDirection;
  }
}

describe('NextRangeSelectorComponent', () => {
  let component: NextRangeSelectorComponent;
  let fixture: ComponentFixture<NextRangeSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NextRangeSelectorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NextRangeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Methods onChangeCallback and onTouchedCallback default null', () => {
    expect(component.onChangeCallback()).toBeNull();
    expect(component.onTouchedCallback()).toBeNull();
  });
});

describe('NextRangeSelectorComponentWithReactiveForm', () => {
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keyboard', () => {
    const tabHandleSpy = spyOn(rangeSelectorInstance, 'tabHandle');
    fixture.debugElement
      .query(By.css('#next-range-selector-0-0'))
      .nativeElement.dispatchEvent(new KeyboardEvent('keydown', {key: 'Tab'}));
    expect(tabHandleSpy).toHaveBeenCalled();

    const keydownHandleSpy = spyOn(rangeSelectorInstance, 'keydownHandle');
    fixture.debugElement
      .query(By.css('#next-range-selector-0-0'))
      .nativeElement.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowDown'}));
    expect(keydownHandleSpy).toHaveBeenCalled();
  });

  it('keyboard', () => {
    rangeSelectorInstance.tabHandle();
    rangeSelectorInstance.tabHandle();
    rangeSelectorInstance.tabHandle();
    expect(rangeSelectorInstance.focusDotIndex).toBe(1);
    document.getElementById('next-range-selector-0-1').focus();
    rangeSelectorInstance.keydownHandle(new KeyboardEvent('keydown', {key: 'ArrowDown'}));
    expect(rangeSelectorInstance.value).toEqual([10, 40]);
    rangeSelectorInstance.keydownHandle(new KeyboardEvent('keydown', {key: 'ArrowLeft'}));
    expect(rangeSelectorInstance.value).toEqual([10, 30]);
    rangeSelectorInstance.keydownHandle(new KeyboardEvent('keydown', {key: 'ArrowRight'}));
    expect(rangeSelectorInstance.value).toEqual([10, 40]);
    rangeSelectorInstance.keydownHandle(new KeyboardEvent('keydown', {key: 'ArrowUp'}));
    expect(rangeSelectorInstance.value).toEqual([10, 50]);
    rangeSelectorInstance.keydownHandle(new KeyboardEvent('keydown', {key: 'Tab'}));
    expect(rangeSelectorInstance.value).toEqual([10, 50]);

    rangeSelectorInstance.borders = [{min: 0, max: 100}, {min: 10, max: 50}];
    expect(rangeSelectorInstance.keydownHandle(new KeyboardEvent('keydown', {key: 'ArrowUp'}))).toBe(false);
    expect(rangeSelectorInstance.value).toEqual([10, 50]);

    rangeSelectorInstance.disabled = true;
    expect(rangeSelectorInstance.keydownHandle(new KeyboardEvent('keydown', {key: 'Tab'}))).toBe(false);
  });

  it('Method: clickHandle', () => {
    rangeSelectorInstance.value = [20, 50];
    rangeSelectorInstance.control.dotsValue = [30, 50];
    expect(rangeSelectorInstance.value).toEqual([20, 50]);
    const x = rangeSelectorInstance.el.clientWidth / 10;
    rangeSelectorInstance.clickHandle(
      new MouseEvent('click', {
        clientX: x,
      }),
    );
    expect(rangeSelectorInstance.value).toEqual([10, 50]);

    rangeSelectorInstance.borders = [{min: 10, max: 100}, {min: 10, max: 50}];
    rangeSelectorInstance.clickHandle(
      new MouseEvent('click', {
        clientX: 0,
      }),
    );

    rangeSelectorInstance.borders = [{min: 0, max: 100}, {min: 0, max: 50}];
    rangeSelectorInstance.dotDisabled = [true, true];
    rangeSelectorInstance.clickHandle(
      new MouseEvent('click', {
        clientX: 0,
      }),
    );
    expect(rangeSelectorInstance.value).toEqual([10, 50]);
  });

  it('Getter: bordersArray ', () => {
    rangeSelectorInstance2.borders = [{min: 0, max: 50}, {min: 40, max: 70}];
    expect(rangeSelectorInstance2.bordersArray).toEqual([
      {style: {'background-color': '#9d9d9d', width: '100%', left: 0, bottom: '0%', height: '50%'}},
      {style: {'background-color': '#c6c6c6', width: '100%', left: 0, bottom: '40%', height: '30%'}},
    ]);

    rangeSelectorInstance.borders = [{min: 0, max: 50}, {min: 40, max: 70}];
    expect(rangeSelectorInstance.bordersArray).toEqual([
      {style: {'background-color': '#9d9d9d', width: '50%', left: '0%', top: 0, height: '100%'}},
      {style: {'background-color': '#c6c6c6', width: '30%', left: '40%', top: 0, height: '100%'}},
    ]);

    rangeSelectorInstance.direction = 'rtl';
    expect(rangeSelectorInstance.bordersArray).toEqual([
      {style: {'background-color': '#9d9d9d', width: '50%', right: '0%', top: 0, height: '100%'}},
      {style: {'background-color': '#c6c6c6', width: '30%', right: '40%', top: 0, height: '100%'}},
    ]);

    rangeSelectorInstance.direction = RangeSelectorDirection.ttb;
    rangeSelectorInstance.borders = [{min: 0, max: 50}, {min: 40, max: 70}];
    expect(rangeSelectorInstance.bordersArray).toEqual([
      {style: {'background-color': '#9d9d9d', height: '50%', left: 0, top: '0%', width: '100%'}},
      {style: {'background-color': '#c6c6c6', height: '30%', left: 0, top: '40%', width: '100%'}},
    ]);
  });

  it('Getter: processArray', () => {
    rangeSelectorInstance.borders = [{min: 0, max: 50}, {min: 40, max: 70}];
    expect(rangeSelectorInstance.bordersArray).toEqual([
      {style: {'background-color': '#9d9d9d', width: '50%', left: '0%', top: 0, height: '100%'}},
      {style: {'background-color': '#c6c6c6', width: '30%', left: '40%', top: 0, height: '100%'}},
    ]);
  });

  it('Getter: markStepStyles', () => {
    expect(rangeSelectorInstance2.markStepStyles).toEqual({'background-color': '#c6c6c6'});

    rangeSelectorInstance2.markStepStyle = {'background-color': 'red'};
    expect(rangeSelectorInstance2.markStepStyles).toEqual({'background-color': 'red'});
  });

  it('Getter: railStyles', () => {
    expect(rangeSelectorInstance2.railStyles).toEqual({'background-color': '#e3e3e3'});

    rangeSelectorInstance2.railStyle = {'background-color': 'red'};
    expect(rangeSelectorInstance2.railStyles).toEqual({'background-color': 'red'});
  });

  it('Getter: markList', () => {
    rangeSelectorInstance2.marks = true;
    expect(rangeSelectorInstance2.markList).toEqual([
      {value: 0, style: {width: '100%', height: '4px', bottom: '0%'}, mark: 0},
      {value: 10, style: {width: '100%', height: '4px', bottom: '10%'}, mark: 10},
      {value: 20, style: {width: '100%', height: '4px', bottom: '20%'}, mark: 20},
      {value: 30, style: {width: '100%', height: '4px', bottom: '30%'}, mark: 30},
      {value: 40, style: {width: '100%', height: '4px', bottom: '40%'}, mark: 40},
      {value: 50, style: {width: '100%', height: '4px', bottom: '50%'}, mark: 50},
      {value: 60, style: {width: '100%', height: '4px', bottom: '60%'}, mark: 60},
      {value: 70, style: {width: '100%', height: '4px', bottom: '70%'}, mark: 70},
      {value: 80, style: {width: '100%', height: '4px', bottom: '80%'}, mark: 80},
      {value: 90, style: {width: '100%', height: '4px', bottom: '90%'}, mark: 90},
      {value: 100, style: {width: '100%', height: '4px', bottom: '100%'}, mark: 100},
    ]);

    rangeSelectorInstance2.marks = [20, 50];
    expect(rangeSelectorInstance2.markList).toEqual([
      {value: 20, style: {width: '100%', height: '4px', bottom: '20%'}, mark: 20},
      {value: 50, style: {width: '100%', height: '4px', bottom: '50%'}, mark: 50},
    ]);

    rangeSelectorInstance.marks = {
      20: '😀',
      50: '😎',
    };
    expect(rangeSelectorInstance.markList).toEqual([
      {value: '20', style: {height: '100%', width: '4px', left: '20%'}, mark: '😀'},
      {value: '50', style: {height: '100%', width: '4px', left: '50%'}, mark: '😎'},
    ]);

    rangeSelectorInstance.marks = ('some_error_mark_type' as unknown) as MarksProp;
    expect(rangeSelectorInstance.markList).toEqual([]);

    rangeSelectorInstance.control = null;
    expect(rangeSelectorInstance.markList).toEqual([]);
  });

  it('pointer', () => {
    rangeSelectorInstance.borders = [{min: 0, max: 50}, {min: 0, max: 70}];
    rangeSelectorInstance.onPointerDown(1);
    expect(rangeSelectorInstance.focusDotIndex).toBe(1);

    rangeSelectorInstance.value = [10, 50];
    expect(rangeSelectorInstance.value).toEqual([10, 50]);

    const x = rangeSelectorInstance.el.clientWidth / 10;
    rangeSelectorInstance.onPointerMove(
      new PointerEvent('pointermove', {
        clientX: x,
      }),
    );
    expect(rangeSelectorInstance.value).toEqual([10, 10]);

    rangeSelectorInstance.onPointerMove(
      new PointerEvent('pointerup', {
        clientX: 2 * x,
      }),
    );
    expect(rangeSelectorInstance.value).toEqual([10, 20]);

    rangeSelectorInstance.borders = [{min: 10, max: 100}, {min: 10, max: 50}];
    rangeSelectorInstance.onPointerMove(
      new PointerEvent('pointerup', {
        clientX: 0,
      }),
    );
    expect(rangeSelectorInstance.value).toEqual([10, 20]);

    rangeSelectorInstance.lazy = true;
    rangeSelectorInstance.onPointerUp(
      new PointerEvent('pointerup', {
        clientX: 2 * x,
      }),
    );
    expect(rangeSelectorInstance.value).toEqual([10, 20]);

    rangeSelectorInstance.onPointerUp(
      new PointerEvent('pointerup', {
        clientX: 3 * x,
      }),
    );
    expect(rangeSelectorInstance.value).toEqual([10, 20]);

    rangeSelectorInstance.onPointerMove(
      new PointerEvent('pointerup', {
        clientX: 3 * x,
      }),
    );
    expect(rangeSelectorInstance.value).toEqual([10, 20]);
  });
});
