import {Component, OnInit, Input, forwardRef, HostListener} from '@angular/core';
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
  get isHorizontal(): boolean {
    return this.direction === 'ltr' || this.direction === 'rtl';
  }

  get isReverse(): boolean {
    return this.direction === 'rtl' || this.direction === 'btt';
  }

  get dots(): Dot[] {
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

  get canSort(): boolean {
    return this.order && !this.minRange && !this.maxRange && !this.fixed && this.enableCross;
  }

  private get dragRange(): [number, number] {
    const prevDot = this.dots[this.focusDotIndex - 1];
    const nextDot = this.dots[this.focusDotIndex + 1];
    return [prevDot ? prevDot.pos : -Infinity, nextDot ? nextDot.pos : Infinity];
  }

  // public dragStart = new EventEmitter<PointerEvent>();

  // public dragMove = new EventEmitter<PointerEvent>();
  // public dragEnd = new EventEmitter<PointerEvent>();

  @Input() public itemTpl;

  @Input() public dotStyle: Styles;
  @Input() public dotOptions: DotOption | DotOption[];
  @Input() public included = true;
  @Input() public min = 0;
  @Input() public max = 100;
  @Input() public useKeyboard = true;
  @Input() public data?: Value[];
  @Input() public enableCross = true;
  @Input() public fixed = false;
  @Input() public interval = 1;
  @Input() public minRange?: number;
  @Input() public maxRange?: number;
  @Input() public order = true;
  @Input() public marks?: MarksProp = false;
  @Input() public process?: ProcessProp = true;
  @Input() public lazy = false;
  public value: Value | Value[];

  public states: State = new State(SliderState);
  public displayValue = 10;
  public direction: Direction = 'ltr';
  public scale = 1;
  public control!: Control;
  public $refs!: {
    container: HTMLDivElement;
  };
  public $el: HTMLElement = document.getElementById('range-selector');
  public focusDotIndex = 0;

  private dragging = false;

  public onPointerDown(dotIndex: number): void {
    this.dragging = true;
    this.dragStart(dotIndex);
  }

  @HostListener('document:pointermove', ['$event'])
  public onPointerMove(event: PointerEvent): void {
    if (!this.dragging) {
      return;
    }

    this.dragMove(event);
  }

  @HostListener('document:pointerup', ['$event'])
  public onPointerUp(event: PointerEvent): void {
    if (!this.dragging) {
      return;
    }

    this.dragging = false;
    this.dragEnd();
  }

  public calculateStyles(dot) {
    //   'height': '100%',
    //   'width': tailSize,
    //   'left': marcPosPer(dot),
    // }
    return {left: `${dot.pos}%`};
  }
  public onChangeCallback = (val?: any) => null;
  public onTouchedCallback = (val?: any) => null;

  public initControl() {
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

  public ngOnInit() {
    this.$el = document.getElementById('range-selector');
  }
  // From ControlValueAccessor interface
  public writeValue(value: any): void {
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

  public setScale() {
    this.scale = new Decimal(Math.floor(this.isHorizontal ? this.$el.offsetWidth : this.$el.offsetHeight))
      .divide(100)
      .toNumber();
  }

  public isDisabledByDotIndex(index: number): boolean {
    return this.dots[index].disabled;
  }

  // @Watch('value')
  // onValueChanged() {
  //   if (!this.states.has(SliderState.Drag) && this.isNotSync) {
  //     this.control.setValue(this.value)
  //   }
  // }

  public setValueByPos(pos: number) {
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
        // not sure what this code for
        this.control.setValue(this.value);
      } else {
        this.control.syncDotsPos();
      }
    });
  }

  public keydownHandle(e: KeyboardEvent) {
    if (!this.useKeyboard || !this.states.has(SliderState.Focus)) {
      // the problem in the SliderState.Focus
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

  public bindEvent() {
    // document.addEventListener('touchmove', this.dragMove.bind(this), {
    //   passive: false,
    // });
    // document.addEventListener('touchend', this.dragEnd.bind(this), {
    //   passive: false,
    // });
    // // document.addEventListener('mousedown', this.blurHandle.bind(this));
    // document.addEventListener('mousemove', this.dragMove.bind(this));
    // // document.addEventListener('mouseup', this.dragEnd.bind(this));
    // document.addEventListener('mouseleave', this.dragEnd.bind(this));
    document.addEventListener('keydown', this.keydownHandle.bind(this));
  }

  public unbindEvent() {
    // document.removeEventListener('touchmove', this.dragMove.bind(this));
    // document.removeEventListener('touchend', this.dragEnd.bind(this));
    // document.removeEventListener('mousemove', this.dragMove.bind(this));
    // document.removeEventListener('mouseup', this.dragEnd.bind(this));
    // document.removeEventListener('mouseleave', this.dragEnd.bind(this));
    document.removeEventListener('keydown', this.keydownHandle.bind(this));
  }

  public dragStart(index: number) {
    this.focusDotIndex = index;
    this.setScale();
    this.states.add(SliderState.Drag);
    this.states.add(SliderState.Focus);
  }

  public clickHandle(e: MouseEvent | TouchEvent) {
    // if (this.states.has(SliderState.Drag)) {
    //   return;
    // }
    this.setScale();

    const pos = this.getPosByEvent(e);

    this.setValueByPos(pos);
  }

  private emitError(type: ERROR_TYPE, message: string) {
    console.log('error');
  }

  private getPosByEvent(e: MouseEvent | TouchEvent): number {
    return getPos(e, this.$el, this.isReverse)[this.isHorizontal ? 'x' : 'y'] / this.scale;
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
    if (this.isDiff(values, Array.isArray(this.value) ? this.value : [this.value])) {
      this.onChangeCallback(values.length === 1 ? values[0] : [...values]);
      this.value = values.length === 1 ? values[0] : [...values];
    }
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
      // if (this.included && this.isNotSync) {
      //   this.control.setValue(this.value);
      // } else {
      // Sync slider position
      this.control.syncDotsPos();
      // }

      this.states.delete(SliderState.Drag);
      // If useKeyboard is true, keep focus status after dragging
      if (!this.useKeyboard) {
        this.states.delete(SliderState.Focus);
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
    this.states.delete(SliderState.Focus);
  }
}
