import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FormGroup, FormControl, ReactiveFormsModule, FormsModule} from '@angular/forms';
import {DebugElement, Component} from '@angular/core';

import {NextRangeSelectorComponent, RangeSelectorDirection} from './next-range-selector.component';
import {MarksProp} from './typings';

@Component({
  template: `
    <form>
      <div class="container">
        <next-range-selector
          [(ngModel)]="value0"
          name="'next-range-selector-0'"
          [id]="'next-range-selector-00'"
        ></next-range-selector>
        <next-range-selector
          [(ngModel)]="value1"
          name="'next-range-selector-1'"
          [id]="'next-range-selector-0'"
          [interval]="10"
        ></next-range-selector>
        <next-range-selector
          [(ngModel)]="value2"
          name="'next-range-selector-2'"
          [id]="'next-range-selector-1'"
          [direction]="RangeSelectorDirection.btt"
          [interval]="10"
        ></next-range-selector>
      </div>
    </form>
  `,
})
class RangeSelectorWithFormsModuleComponent {
  public value0 = 10;
  public value1 = [10, 50];
  public value2 = [10, 50];
  public get RangeSelectorDirection() {
    return RangeSelectorDirection;
  }
}

// tslint:disable-next-line:max-classes-per-file
@Component({
  template: `
    <form [formGroup]="appFormGroup" class="reactive-form">
      <div class="container">
        <next-range-selector
          formControlName="rangeSelectorFormControl0"
          [id]="'next-range-selector-00'"
        ></next-range-selector>
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
    rangeSelectorFormControl0: new FormControl(10),
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

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should be null by default with methods onChangeCallback and onTouchedCallback', () => {
    expect(component.onChangeCallback()).toBeNull();
    expect(component.onTouchedCallback()).toBeNull();
  });
});

describe('NextRangeSelectorComponent with FormsModule', () => {
  let component: RangeSelectorWithFormsModuleComponent;
  let fixture: ComponentFixture<RangeSelectorWithFormsModuleComponent>;
  let rangeSelectorInstance0: NextRangeSelectorComponent;
  let rangeSelectorInstance: NextRangeSelectorComponent;
  let rangeSelectorInstance2: NextRangeSelectorComponent;
  let componentDebug: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [RangeSelectorWithFormsModuleComponent, NextRangeSelectorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeSelectorWithFormsModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    componentDebug = fixture.debugElement.query(By.css('#next-range-selector-0'));
    rangeSelectorInstance = componentDebug.componentInstance;
    rangeSelectorInstance2 = fixture.debugElement.query(By.css('#next-range-selector-1')).componentInstance;
    rangeSelectorInstance0 = fixture.debugElement.query(By.css('#next-range-selector-00')).componentInstance;
  });

  it('should create host', () => {
    expect(component).toBeTruthy();
  });

  it('should create an instance', () => {
    expect(rangeSelectorInstance).toBeTruthy();
  });

  it('should change dots position with method setDotPos', () => {
    fixture.whenStable().then(() => {
      rangeSelectorInstance.setDotPos(50, 0);

      expect(rangeSelectorInstance.dotsValue[0]).toBe(50);

      rangeSelectorInstance2.setDotPos(110, 0);
      expect(rangeSelectorInstance2.dotsValue[0]).toBe(100);

      rangeSelectorInstance2.setDotPos(undefined, 0);
      expect(rangeSelectorInstance2.dotsValue[0]).toBe(100);
    });
  });

  it('should change value with method parseValue', () => {
    let value = rangeSelectorInstance.parseValue(50);
    expect(value).toBe(50);

    value = rangeSelectorInstance.parseValue(110);
    expect(value).toBe(0);

    value = rangeSelectorInstance.parseValue(-10);
    expect(value).toBe(0);

    value = rangeSelectorInstance.parseValue('a');
    expect(value).toBe(0);

    rangeSelectorInstance0.data = [10, 20, 30, 40, 50];
    value = rangeSelectorInstance0.parseValue(40);
    expect(value).toBe(3);
  });

  it('should set value with methods setValue and syncDotsPos', () => {
    rangeSelectorInstance.setValue(50);
    expect(rangeSelectorInstance.dotsPos).toEqual([50]);
    rangeSelectorInstance.setValue([0, 50]);
    expect(rangeSelectorInstance.dotsPos).toEqual([0, 50]);
  });

  it('should return the recent dot with method getRecentDot', () => {
    rangeSelectorInstance.setValue([0, 100]);
    expect(rangeSelectorInstance.getRecentDot(20)).toBe(0);
    expect(rangeSelectorInstance.getRecentDot(90)).toBe(1);
    expect(rangeSelectorInstance.getRecentDot(20, [{min: 0, max: 10}])).toBe(1);
  });

  it('should return index of the dot by its value with method getIndexByValue', () => {
    rangeSelectorInstance.interval = 10;
    expect(rangeSelectorInstance.getIndexByValue(20)).toBe(2);
    expect(rangeSelectorInstance.getIndexByValue(100)).toBe(10);
    expect(rangeSelectorInstance.getIndexByValue(20)).toBe(2);
    rangeSelectorInstance.data = [10, 20, 30, 40, 50];
    expect(rangeSelectorInstance.getIndexByValue(20)).toBe(1);
  });

  it('should return values with method getValues', () => {
    rangeSelectorInstance.interval = 10;
    expect(rangeSelectorInstance.getValues()).toEqual([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
    rangeSelectorInstance.data = [10, 20, 30, 40, 50];
    expect(rangeSelectorInstance.getValues()).toEqual([10, 20, 30, 40, 50]);
  });

  it('should return value of the dot by its index with method getIndexByValue', () => {
    rangeSelectorInstance.interval = 10;
    expect(rangeSelectorInstance.getValueByIndex(2)).toBe(20);
    expect(rangeSelectorInstance.getValueByIndex(11)).toBe(100);
    expect(rangeSelectorInstance.getValueByIndex(-1)).toBe(0);
  });

  it('should return array of processes dots with getter processArrayDots', () => {
    fixture.whenStable().then(() => {
      expect(rangeSelectorInstance.processArrayDots[0]).toEqual([10, 50]);
      expect(rangeSelectorInstance0.processArrayDots[0]).toEqual([0, 10]);
      rangeSelectorInstance0.process = false;
      expect(rangeSelectorInstance0.processArrayDots).toEqual([]);
    });
  });

  it('should return total with getter total', () => {
    expect(rangeSelectorInstance.total).toEqual(10);
    rangeSelectorInstance.interval = 3;
    expect(rangeSelectorInstance.total).toEqual(0);
  });

  it('should call tabHandle and keydownHandle by tab and arrows clicking', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
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
  });

  it('should allow to use the keyboard', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
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
  });

  it('should change value with clickHandle', () => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      rangeSelectorInstance.value = [20, 50];
      rangeSelectorInstance.dotsValue = [30, 50];
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
  });

  it('should return borders array with getter bordersArray', () => {
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

  it('should return process array with getter processArray', () => {
    fixture.whenStable().then(() => {
      expect(rangeSelectorInstance.processArray).toEqual([
        {
          style: {
            height: '100%',
            top: 0,
            left: '10%',
            width: '40%',
            transitionProperty: 'width,left',
            transitionDuration: '0.5s',
          },
        },
      ]);
      rangeSelectorInstance.process = false;
      expect(rangeSelectorInstance.processArray).toEqual([]);
    });
  });

  it('should return mark step styles with getter markStepStyles', () => {
    expect(rangeSelectorInstance2.markStepStyles).toEqual({'background-color': '#c6c6c6'});

    rangeSelectorInstance2.markStepStyle = {'background-color': 'red'};
    expect(rangeSelectorInstance2.markStepStyles).toEqual({'background-color': 'red'});
  });

  it('should return rail styles with getter railStyles', () => {
    expect(rangeSelectorInstance2.railStyles).toEqual({'background-color': '#e3e3e3'});

    rangeSelectorInstance2.railStyle = {'background-color': 'red'};
    expect(rangeSelectorInstance2.railStyles).toEqual({'background-color': 'red'});
  });

  it('should return list of marks with getter markList', () => {
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
  });

  it('should change value with pointer events', () => {
    fixture.whenStable().then(() => {
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
});

describe('NextRangeSelectorComponent with ReactiveForm', () => {
  let component: RangeSelectorWithReactiveFormsComponent;
  let fixture: ComponentFixture<RangeSelectorWithReactiveFormsComponent>;
  let rangeSelectorInstance0: NextRangeSelectorComponent;
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
    rangeSelectorInstance0 = fixture.debugElement.query(By.css('#next-range-selector-00')).componentInstance;
  });

  it('should create host', () => {
    expect(component).toBeTruthy();
  });

  it('should create an instance', () => {
    expect(rangeSelectorInstance).toBeTruthy();
  });

  it('should change dots position with method setDotPos', () => {
    rangeSelectorInstance.setDotPos(50, 0);
    expect(rangeSelectorInstance.dotsValue[0]).toBe(50);

    rangeSelectorInstance2.setDotPos(110, 0);
    expect(rangeSelectorInstance2.dotsValue[0]).toBe(100);

    rangeSelectorInstance2.setDotPos(undefined, 0);
    expect(rangeSelectorInstance2.dotsValue[0]).toBe(100);
  });

  it('should change value with method parseValue', () => {
    let value = rangeSelectorInstance.parseValue(50);
    expect(value).toBe(50);

    value = rangeSelectorInstance.parseValue(110);
    expect(value).toBe(0);

    value = rangeSelectorInstance.parseValue(-10);
    expect(value).toBe(0);

    value = rangeSelectorInstance.parseValue('a');
    expect(value).toBe(0);

    rangeSelectorInstance0.data = [10, 20, 30, 40, 50];
    value = rangeSelectorInstance0.parseValue(40);
    expect(value).toBe(3);
  });

  it('should set value with methods setValue and syncDotsPos', () => {
    rangeSelectorInstance.setValue(50);
    expect(rangeSelectorInstance.dotsPos).toEqual([50]);
    rangeSelectorInstance.setValue([0, 50]);
    expect(rangeSelectorInstance.dotsPos).toEqual([0, 50]);
  });

  it('should return the recent dot with method getRecentDot', () => {
    rangeSelectorInstance.setValue([0, 100]);
    expect(rangeSelectorInstance.getRecentDot(20)).toBe(0);
    expect(rangeSelectorInstance.getRecentDot(90)).toBe(1);
    expect(rangeSelectorInstance.getRecentDot(20, [{min: 0, max: 10}])).toBe(1);
  });

  it('should return index of the dot by its value with method getIndexByValue', () => {
    rangeSelectorInstance.interval = 10;
    expect(rangeSelectorInstance.getIndexByValue(20)).toBe(2);
    expect(rangeSelectorInstance.getIndexByValue(100)).toBe(10);
    expect(rangeSelectorInstance.getIndexByValue(20)).toBe(2);
    rangeSelectorInstance.data = [10, 20, 30, 40, 50];
    expect(rangeSelectorInstance.getIndexByValue(20)).toBe(1);
  });

  it('should return values with method getValues', () => {
    rangeSelectorInstance.interval = 10;
    expect(rangeSelectorInstance.getValues()).toEqual([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
    rangeSelectorInstance.data = [10, 20, 30, 40, 50];
    expect(rangeSelectorInstance.getValues()).toEqual([10, 20, 30, 40, 50]);
  });

  it('should return value of the dot by its index with method getIndexByValue', () => {
    rangeSelectorInstance.interval = 10;
    expect(rangeSelectorInstance.getValueByIndex(2)).toBe(20);
    expect(rangeSelectorInstance.getValueByIndex(11)).toBe(100);
    expect(rangeSelectorInstance.getValueByIndex(-1)).toBe(0);
  });

  it('should return array of processes dots with getter processArrayDots', () => {
    expect(rangeSelectorInstance.processArrayDots[0]).toEqual([10, 50]);
    expect(rangeSelectorInstance0.processArrayDots[0]).toEqual([0, 10]);
    rangeSelectorInstance0.process = false;
    expect(rangeSelectorInstance0.processArrayDots).toEqual([]);
  });

  it('should return total with getter total', () => {
    expect(rangeSelectorInstance.total).toEqual(10);
    rangeSelectorInstance.interval = 3;
    expect(rangeSelectorInstance.total).toEqual(0);
  });

  it('should call tabHandle and keydownHandle by tab and arrows clicking', () => {
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

  it('should allow to use the keyboard', () => {
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

  it('should change value with clickHandle', () => {
    rangeSelectorInstance.value = [20, 50];
    rangeSelectorInstance.dotsValue = [30, 50];
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

  it('should return borders array with getter bordersArray', () => {
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

  it('should return process array with getter processArray', () => {
    expect(rangeSelectorInstance.processArray).toEqual([
      {
        style: {
          height: '100%',
          top: 0,
          left: '10%',
          width: '40%',
          transitionProperty: 'width,left',
          transitionDuration: '0.5s',
        },
      },
    ]);
    rangeSelectorInstance.process = false;
    expect(rangeSelectorInstance.processArray).toEqual([]);
  });

  it('should return mark step styles with getter markStepStyles', () => {
    expect(rangeSelectorInstance2.markStepStyles).toEqual({'background-color': '#c6c6c6'});

    rangeSelectorInstance2.markStepStyle = {'background-color': 'red'};
    expect(rangeSelectorInstance2.markStepStyles).toEqual({'background-color': 'red'});
  });

  it('should return rail styles with getter railStyles', () => {
    expect(rangeSelectorInstance2.railStyles).toEqual({'background-color': '#e3e3e3'});

    rangeSelectorInstance2.railStyle = {'background-color': 'red'};
    expect(rangeSelectorInstance2.railStyles).toEqual({'background-color': 'red'});
  });

  it('should return list of marks with getter markList', () => {
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
  });

  it('should change value with pointer events', () => {
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
