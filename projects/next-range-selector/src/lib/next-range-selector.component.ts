import {Component, OnInit, Input, forwardRef} from '@angular/core';
import {getSize, getPos, getKeyboardHandleFunc} from './utils/1';
import State, {StateMap} from './utils/state';
import {Value, Styles, DotOption, Dot, Direction, MarksProp, ProcessProp} from './1';
import Decimal from './utils/decimal';
import Control, {ERROR_TYPE} from './utils/control';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

export const SliderState: StateMap = {
  None: 0,
  Drag: 1,
  Focus: 2,
};

@Component({
  selector: 'next-range-selector',
  templateUrl: './next-range-selector.component.html',
  styleUrls: ['./next-range-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NextRangeSelectorComponent),
      multi: true,
    },
  ],
})
export class NextRangeSelectorComponent implements OnInit, ControlValueAccessor {
  constructor() {}
  get isHorizontal(): boolean {
    return this.direction === 'ltr' || this.direction === 'rtl';
  }

  get isReverse(): boolean {
    return this.direction === 'rtl' || this.direction === 'btt';
  }
  value: Value | Value[];

  get dots(): Dot[] {
    return this.control.dotsPos.map((pos, index) => ({
      pos,
      index,
      value: this.control.dotsValue[index],
      focus: this.states.has(SliderState.Focus) && this.focusDotIndex === index,
      disabled: false,
      style: this.dotStyle,
      ...((Array.isArray(this.dotOptions) ? this.dotOptions[index] : this.dotOptions) || {}),
    }));
  }

  private get isNotSync() {
    const values = this.control.dotsValue;
    return Array.isArray(this.value)
      ? this.value.length !== values.length || this.value.some((val, index) => val !== values[index])
      : this.value !== values[0];
  }

  @Input() dotStyle: Styles;
  @Input() dotOptions: DotOption | DotOption[];
  @Input() included = true;
  @Input() min = 0;
  @Input() max = 100;
  @Input() useKeyboard = false;
  @Input() data?: Value[];
  @Input() enableCross = true;
  @Input() fixed = false;
  @Input() interval = 1;
  @Input() minRange?: number;
  @Input() maxRange?: number;
  @Input() order = true;
  @Input() marks?: MarksProp = false;
  @Input() process?: ProcessProp = true;

  states: State = new State(SliderState);
  displayValue = 10;
  direction: Direction = 'ltr';
  scale = 1;
  control!: Control;
  $el: HTMLElement = document.getElementById('range-selector');
  focusDotIndex = 0;
  public onChangeCallback = (val?: any) => null;
  public onTouchedCallback = (val?: any) => null;

  private emitError(type: ERROR_TYPE, message: string) {
    console.log('error');
  }

  initControl() {
    this.control = new Control({
      value: this.value,
      data: this.data,
      enableCross: this.enableCross,
      fixed: this.fixed,
      max: this.max,
      min: this.min,
      interval: this.interval,
      minRange: this.minRange,
      maxRange: this.maxRange,
      order: this.order,
      marks: this.marks,
      process: this.process,
      onError: this.emitError,
    });
    // [
    //   'data',
    //   'enableCross',
    //   'fixed',
    //   'max',
    //   'min',
    //   'interval',
    //   'minRange',
    //   'maxRange',
    //   'order',
    //   'marks',
    //   'process'
    // ].forEach(name => {
    //   this.control.valueChanges.subscribe(name, (val: any) => {
    //     if (
    //       name === 'data' &&
    //       Array.isArray(this.control.data) &&
    //       Array.isArray(val) &&
    //       this.control.data.length === val.length &&
    //       val.every(
    //         (item, index) => item === (this.control.data as Value[])[index]
    //       )
    //     ) {
    //       return false;
    //     }
    //     (this.control as any)[name] = val;
    //     if (['data', 'max', 'min', 'interval'].includes(name)) {
    //       this.control.syncDotsPos();
    //     }
    //   });
    // });
  }

  ngOnInit() {
    this.$el = document.getElementById('range-selector');
  }
  // From ControlValueAccessor interface
  public writeValue(value: any): void {
    this.value = value;
    this.initControl();
  }
  // From ControlValueAccessor interface
  public registerOnChange(fn: (val?: any) => void) {
    this.onChangeCallback = fn;
  }

  // From ControlValueAccessor interface
  public registerOnTouched(fn: (val?: any) => void) {
    this.onTouchedCallback = fn;
  }

  setScale() {
    console.log(this.$el);
    this.scale = new Decimal(Math.floor(this.isHorizontal ? this.$el.offsetWidth : this.$el.offsetHeight))
      .divide(100)
      .toNumber();
  }

  private getPosByEvent(e: MouseEvent | TouchEvent): number {
    return getPos(e, this.$el, this.isReverse)[this.isHorizontal ? 'x' : 'y'] / this.scale;
  }

  isDisabledByDotIndex(index: number): boolean {
    console.log(this.dots, index);
    return this.dots[index].disabled;
  }

  private isDiff(value1: Value[], value2: Value[]) {
    return value1.length !== value2.length || value1.some((val, index) => val !== value2[index]);
  }

  private syncValueByPos() {
    let values = this.control.dotsValue;
    // When included is true, the return value is the value of the nearest mark
    if (this.included && this.control.markList.length > 0) {
      const getRecentValue = (val: Value) => {
        let curValue = val;
        let dir = this.max - this.min;
        this.control.markList.forEach((mark) => {
          if (typeof mark.value === 'number' && typeof val === 'number') {
            const curDir = Math.abs(mark.value - val);
            if (curDir < dir) {
              dir = curDir;
              curValue = mark.value;
            }
          }
        });
        return curValue;
      };
      values = values.map((val) => getRecentValue(val));
    }
    // if (
    //   this.isDiff(values, Array.isArray(this.value) ? this.value : [this.value])
    // ) {
    //   this.$emit('change', values.length === 1 ? values[0] : [...values]);
    // }
  }

  setValueByPos(pos: number) {
    console.log(pos);
    console.log(this.control);
    const index = this.control.getRecentDot(pos);
    if (this.isDisabledByDotIndex(index)) {
      return false;
    }
    this.focusDotIndex = index;
    this.control.setDotPos(pos, index);
    this.syncValueByPos();

    if (this.useKeyboard) {
      this.states.add(SliderState.Focus);
    }

    setTimeout(() => {
      if (this.included && this.isNotSync) {
        this.control.setValue(this.value);
      } else {
        this.control.syncDotsPos();
      }
    });
  }

  clickHandle(e: MouseEvent | TouchEvent) {
    console.log(this);
    if (this.states.has(SliderState.Drag)) {
      return;
    }
    this.setScale();
    const pos = this.getPosByEvent(e);
    this.setValueByPos(pos);
  }
}
