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

  get dots(): Dot[] {
    console.log('dots');
    if (this.control) {
      return this.control.dotsPos.map((pos, index) => ({
        pos,
        index,
        value: this.control.dotsValue[index],
        focus: this.states.has(SliderState.Focus) && this.focusDotIndex === index,
        disabled: false,
        style: this.dotStyle,
        ...((Array.isArray(this.dotOptions) ? this.dotOptions[index] : this.dotOptions) || {}),
      }));
    } else {
      return [];
    }
  }

  get mainDirection(): string {
    switch (this.direction) {
      case 'ltr':
        return 'left';
      case 'rtl':
        return 'right';
      case 'btt':
        return 'bottom';
      case 'ttb':
        return 'top';
    }
  }

  private get isNotSync() {
    const values = this.control.dotsValue;
    return Array.isArray(this.value)
      ? this.value.length !== values.length || this.value.some((val, index) => val !== values[index])
      : this.value !== values[0];
  }
  value: Value | Value[];

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
  @Input() lazy = false;

  states: State = new State(SliderState);
  displayValue = 10;
  direction: Direction = 'ltr';
  scale = 1;
  control!: Control;
  $refs!: {
    container: HTMLDivElement;
  };
  $el: HTMLElement = document.getElementById('range-selector');
  focusDotIndex = 0;

  calculateStyles(dot) {
    //   'height': '100%',
    //   'width': tailSize,
    //   'left': marcPosPer(dot),
    // }
    return {left: `${dot.pos}%`};
  }
  public onChangeCallback = (val?: any) => null;
  public onTouchedCallback = (val?: any) => null;

  private emitError(type: ERROR_TYPE, message: string) {
    console.log('error');
  }

  initControl() {
    console.log('initControl');
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
    console.log('AAAAAAAAAAAAAAA', this.states);
    this.value = value;
    this.initControl();
    this.bindEvent();
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
    console.log('mewmew', this.control.dotsValue);
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
    console.log('mewmew2', this.control.dotsValue);
    if (this.isDiff(values, Array.isArray(this.value) ? this.value : [this.value])) {
      this.onChangeCallback(values.length === 1 ? values[0] : [...values]);
      // this.value = values.length === 1 ? values[0] : [...values];
    }
  }

  // @Watch('value')
  // onValueChanged() {
  //   if (!this.states.has(SliderState.Drag) && this.isNotSync) {
  //     this.control.setValue(this.value)
  //   }
  // }

  setValueByPos(pos: number) {
    console.log(pos);
    console.log(this.control);
    console.log('go', this.control.dotsValue);
    const index = this.control.getRecentDot(pos);
    if (this.isDisabledByDotIndex(index)) {
      return false;
    }
    this.focusDotIndex = index;
    this.control.setDotPos(pos, index);
    this.syncValueByPos();

    console.log('1mew', this.control.dotsValue);
    console.log('1mew', this.control);

    if (this.useKeyboard) {
      this.states.add(SliderState.Focus);
    }

    setTimeout(() => {
      if (this.included && this.isNotSync) {
        console.log('dkdsdslfeoodel');
        // debugger;
        this.control.setValue(this.control.dotsValue[0]);
      } else {
        this.control.syncDotsPos();
      }
    });
  }

  get canSort(): boolean {
    return this.order && !this.minRange && !this.maxRange && !this.fixed && this.enableCross;
  }

  private get dragRange(): [number, number] {
    const prevDot = this.dots[this.focusDotIndex - 1];
    const nextDot = this.dots[this.focusDotIndex + 1];
    return [prevDot ? prevDot.pos : -Infinity, nextDot ? nextDot.pos : Infinity];
  }

  // If the component is sorted, then when the slider crosses, toggle the currently selected slider index
  private isCrossDot(pos: number) {
    if (this.canSort) {
      const curIndex = this.focusDotIndex;
      let curPos = pos;
      if (curPos > this.dragRange[1]) {
        curPos = this.dragRange[1];
        this.focusDotIndex++;
      } else if (curPos < this.dragRange[0]) {
        curPos = this.dragRange[0];
        this.focusDotIndex--;
      }
      if (curIndex !== this.focusDotIndex) {
        this.control.setDotPos(curPos, curIndex);
      }
    }
  }

  private dragMove(e: MouseEvent | TouchEvent) {
    console.log('aaaaaaaaaaaaaaa2', this.states);
    if (!this.states.has(SliderState.Drag)) {
      return false;
    }
    e.preventDefault();
    const pos = this.getPosByEvent(e);
    this.isCrossDot(pos);
    this.control.setDotPos(pos, this.focusDotIndex);
    if (!this.lazy) {
      this.syncValueByPos();
    }
    const value = this.control.dotsValue;
    // this.$emit('dragging', value.length === 1 ? value[0] : [...value]);
  }

  private dragEnd() {
    if (!this.states.has(SliderState.Drag)) {
      return false;
    }
    if (this.lazy) {
      this.syncValueByPos();
    }

    setTimeout(() => {
      if (this.included && this.isNotSync) {
        this.control.setValue(this.value);
      } else {
        // Sync slider position
        this.control.syncDotsPos();
      }

      console.log(1, this.states);
      this.states.delete(SliderState.Drag);
      console.log(2, this.states);
      // If useKeyboard is true, keep focus status after dragging
      if (!this.useKeyboard) {
        this.states.delete(SliderState.Focus);
        console.log(3, this.states);
      }
      // this.$emit('drag-end');
    });
  }

  private blurHandle(e: MouseEvent) {
    if (
      !this.states.has(SliderState.Focus) ||
      !this.$refs.container ||
      this.$refs.container.contains(e.target as Node)
    ) {
      return false;
    }
    console.log(4, this.states);
    this.states.delete(SliderState.Focus);
    console.log(5, this.states);
  }

  keydownHandle(e: KeyboardEvent) {
    if (!this.useKeyboard || !this.states.has(SliderState.Focus)) {
      return false;
    }

    const handleFunc = getKeyboardHandleFunc(e, {
      direction: this.direction,
      max: this.control.total,
      min: 0,
    });

    if (handleFunc) {
      e.preventDefault();
      const index = this.control.getIndexByValue(this.control.dotsValue[this.focusDotIndex]);
      const newIndex = handleFunc(index);
      const pos = this.control.parseValue(this.control.getValueByIndex(newIndex));
      this.isCrossDot(pos);
      this.control.setDotPos(pos, this.focusDotIndex);
      this.syncValueByPos();
    }
  }

  bindEvent() {
    document.addEventListener('touchmove', this.dragMove, {passive: false});
    document.addEventListener('touchend', this.dragEnd, {passive: false});
    document.addEventListener('mousedown', this.blurHandle);
    document.addEventListener('mousemove', this.dragMove);
    document.addEventListener('mouseup', this.dragEnd);
    document.addEventListener('mouseleave', this.dragEnd);
    document.addEventListener('keydown', this.keydownHandle);
  }

  unbindEvent() {
    document.removeEventListener('touchmove', this.dragMove);
    document.removeEventListener('touchend', this.dragEnd);
    document.removeEventListener('mousemove', this.dragMove);
    document.removeEventListener('mouseup', this.dragEnd);
    document.removeEventListener('mouseleave', this.dragEnd);
    document.removeEventListener('keydown', this.keydownHandle);
  }

  private dragStart(index: number) {
    this.focusDotIndex = index;
    this.setScale();
    this.states.add(SliderState.Drag);
    this.states.add(SliderState.Focus);
  }

  clickHandle(e: MouseEvent | TouchEvent) {
    console.log(this);
    if (this.states.has(SliderState.Drag)) {
      return;
    }
    this.setScale();

    const pos = this.getPosByEvent(e);

    this.setValueByPos(pos);
    console.log('hi', this.control.dotsValue);
  }
}
