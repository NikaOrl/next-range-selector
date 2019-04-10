import {Component, OnInit, Input, forwardRef, HostListener, ElementRef, Renderer2} from '@angular/core';
import {getSize, getPos, getKeyboardHandleFunc} from './utils/utils';
import {Value, Styles, DotOption, Dot, Direction, ProcessProp, Process} from './typings';
import Control, {ERROR_TYPE} from './utils/control';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

const DEFAULT_SLIDER_SIZE = 4;
let uniqueId = 0;

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
  @Input() public itemTpl;
  @Input() public id = `next-range-selector-${++uniqueId}`;
  @Input() public dotStyle: Styles;
  @Input() public min = 0;
  @Input() public max = 100;
  @Input() public useKeyboard = true;
  @Input() public interval = 1;
  @Input() public process?: ProcessProp = true;
  @Input() public duration: number = 0.5;
  @Input() public tabIndex: number = 1;
  @Input() public width: number | string;
  @Input() public height: number | string;
  @Input() public dotSize: [number, number] | number = 14;
  @Input() public direction: Direction = 'ltr';
  @Input() public dotBorders: any[];

  // disabled and others
  @Input() public dotOptions: DotOption | DotOption[];
  @Input() public included = true;
  @Input() public enableCross = true;
  @Input() public fixed = false;
  @Input() public minRange?: number;
  @Input() public maxRange?: number;
  @Input() public order = true;
  @Input() public lazy = false;

  get isHorizontal(): boolean {
    return this.direction === 'ltr' || this.direction === 'rtl';
  }

  get isReverse(): boolean {
    return this.direction === 'rtl' || this.direction === 'btt';
  }

  get animateTime(): number {
    return this.duration;
  }

  get dotBaseStyle() {
    const [dotWidth, dotHeight] = Array.isArray(this.dotSize) ? this.dotSize : [this.dotSize, this.dotSize];
    let dotPos: {[key: string]: string};
    if (this.isHorizontal) {
      dotPos = {
        transform: `translate(${this.isReverse ? '50%' : '-50%'}, -50%)`,
        WebkitTransform: `translate(${this.isReverse ? '50%' : '-50%'}, -50%)`,
        top: '50%',
        [this.direction === 'ltr' ? 'left' : 'right']: '0',
      };
    } else {
      dotPos = {
        transform: `translate(-50%, ${this.isReverse ? '50%' : '-50%'})`,
        WebkitTransform: `translate(-50%, ${this.isReverse ? '50%' : '-50%'})`,
        left: '50%',
        [this.direction === 'btt' ? 'bottom' : 'top']: '0',
      };
    }
    return {
      width: `${dotWidth}px`,
      height: `${dotHeight}px`,
      ...dotPos,
    };
  }

  get bordersArray() {
    if (this.borders) {
      const bordersArray = [];
      this.dotBorders.forEach((value, index) => {
        const sizeStyleKey = this.isHorizontal ? 'width' : 'height';
        const valueMin = value.min ? value.min : this.min;
        const valueMax = value.max ? value.max : this.max;
        bordersArray.push({
          min: valueMin,
          max: valueMax,
          style: {
            'background-color': index % 2 === 0 ? 'black' : 'white',
            [this.isHorizontal ? 'height' : 'width']: '100%',
            [this.isHorizontal ? 'top' : 'left']: 0,
            [this.mainDirection]: `${valueMin}%`,
            [sizeStyleKey]: `${+valueMax - +valueMin}%`,
          },
        });
      });
      return bordersArray;
    } else {
      return [];
    }
  }

  get dots(): Dot[] {
    if (this.control) {
      return this.control.dotsPos.map((pos, index) => ({
        pos,
        index,
        // remove all of it => styles
        value: this.control.dotsValue[index],
        focus: this.focusDotIndex === index,
        disabled: false,
        style: {
          ...this.dotBaseStyle,
          [this.mainDirection]: `${pos}%`,
          transition: `${this.mainDirection} ${this.animateTime}s`,
        },
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

  get canSort(): boolean {
    return this.order && !this.minRange && !this.maxRange && !this.fixed && this.enableCross;
  }

  get containerStyles() {
    const [dotWidth, dotHeight] = Array.isArray(this.dotSize) ? this.dotSize : [this.dotSize, this.dotSize];
    const containerWidth = this.width ? getSize(this.width) : this.isHorizontal ? '100%' : getSize(DEFAULT_SLIDER_SIZE);
    const containerHeight = this.height
      ? getSize(this.height)
      : this.isHorizontal
      ? getSize(DEFAULT_SLIDER_SIZE)
      : '100%';
    return {
      padding: this.isHorizontal ? `${dotHeight / 2}px 0` : `0 ${dotWidth / 2}px`,
      width: containerWidth,
      height: containerHeight,
    };
  }

  get processArray(): Process[] {
    if (this.control && this.process) {
      return this.control.processArray.map(([start, end, style]) => {
        if (start > end) {
          [start, end] = [end, start];
        }
        const sizeStyleKey = this.isHorizontal ? 'width' : 'height';
        return {
          start,
          end,
          style: {
            [this.isHorizontal ? 'height' : 'width']: '100%',
            [this.isHorizontal ? 'top' : 'left']: 0,
            [this.mainDirection]: `${start}%`,
            [sizeStyleKey]: `${end - start}%`,
            transitionProperty: `${sizeStyleKey},${this.mainDirection}`,
            transitionDuration: `${this.animateTime}s`,
            // ...this.processStyle,
            // ...style,
          },
        };
      });
    } else {
      return [];
    }
  }

  private get dragRange(): [number, number] {
    const prevDot = this.dots[this.focusDotIndex - 1];
    const nextDot = this.dots[this.focusDotIndex + 1];
    return [prevDot ? prevDot.pos : -Infinity, nextDot ? nextDot.pos : Infinity];
  }

  private get isNotSync() {
    const values = this.control.dotsValue;
    return Array.isArray(this.value)
      ? this.value.length !== values.length || this.value.some((val, index) => val !== values[index])
      : this.value !== values[0];
  }

  public value: Value | Value[];
  public displayValue = 10;
  public scale = 1;
  public control!: Control;
  public $refs!: {
    container: HTMLDivElement;
  };
  public $el: HTMLElement = document.getElementById(this.id);
  public focusDotIndex = 0;
  private borders: boolean = false;
  private dragging = false;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  public ngOnInit() {
    this.renderer.removeAttribute(this.elementRef.nativeElement, 'id');
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

  public onChangeCallback = (val?: any) => null;
  public onTouchedCallback = (val?: any) => null;

  public initControl() {
    this.control = new Control({
      value: this.value,
      enableCross: this.enableCross,
      fixed: this.fixed,
      max: this.max,
      min: this.min,
      interval: this.interval,
      minRange: this.minRange,
      maxRange: this.maxRange,
      order: this.order,
      process: this.process,
      onError: this.emitError,
    });
  }

  // From ControlValueAccessor interface
  public writeValue(value: any): void {
    if (value) {
      this.value = value;
      this.initControl();
      this.$el = document.getElementById(this.id);
      this.processOrBorders();
    }
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
    this.scale = Math.floor(this.isHorizontal ? this.$el.offsetWidth : this.$el.offsetHeight) / 100;
  }

  public isDisabledByDotIndex(index: number): boolean {
    return this.dots[index].disabled;
  }

  public setValueByPos(pos: number) {
    const index = this.control.getRecentDot(pos, this.dotBorders);
    if (this.isDisabledByDotIndex(index)) {
      return false;
    }
    if (this.borders && this.isPosNotInValueBorders(index, pos)) {
      return false;
    }

    this.focusDotIndex = index;
    this.control.setDotPos(pos, index);
    this.syncValueByPos();

    setTimeout(() => {
      if (this.included && this.isNotSync) {
        // not sure what this code for
        this.control.setValue(this.value);
      } else {
        this.control.syncDotsPos();
      }
    });
  }

  public tabHandle() {
    this.focusDotIndex++;
    if (this.focusDotIndex >= this.dots.length) {
      this.focusDotIndex = 0;
    }
  }

  public onPointerDown(dotIndex: number): void {
    this.dragging = true;
    this.dragStart(dotIndex);
  }

  public keydownHandle(e: KeyboardEvent) {
    if (!this.useKeyboard) {
      return false;
    }

    const handleFunc = getKeyboardHandleFunc(e, {
      direction: this.direction,
      max: this.control.total,
      min: 0,
    });
    const substr = document.activeElement.id.split('-').pop();
    this.focusDotIndex = Number(substr);

    if (handleFunc) {
      e.preventDefault();
      const index = this.control.getIndexByValue(this.control.dotsValue[this.focusDotIndex]);
      const newIndex = handleFunc(index);
      const pos = this.control.parseValue(this.control.getValueByIndex(newIndex));
      this.isCrossDot(pos);
      if (this.borders && this.isPosNotInValueBorders(this.focusDotIndex, pos)) {
        return false;
      }
      this.control.setDotPos(pos, this.focusDotIndex);
      this.syncValueByPos();
    }
  }

  public trackByFn(index: any, item: any) {
    return index;
  }

  public dragStart(index: number) {
    this.focusDotIndex = index;
    this.setScale();
  }

  public clickHandle(e: MouseEvent | TouchEvent) {
    this.setScale();

    const pos = this.getPosByEvent(e);

    this.setValueByPos(pos);
    document.getElementById(`${this.id}-${this.focusDotIndex}`).focus();
  }

  public getDotId(id, i) {
    return `${id}-${i}`;
  }

  private processOrBorders() {
    if (this.dotBorders) {
      this.borders = true;
      this.process = false;
    }
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
    const values = this.control.dotsValue;
    if (this.isDiff(values, Array.isArray(this.value) ? this.value : [this.value])) {
      this.onChangeCallback(values.length === 1 ? values[0] : [...values]);
      this.value = values.length === 1 ? values[0] : [...values];
    }
  }

  // If the component is sorted, then when the slider crosses, toggle the currently selected slider index
  private isCrossDot(pos: number) {
    if (this.borders && this.isPosNotInValueBorders(this.focusDotIndex, pos)) {
      return false;
    }
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
      document.getElementById(`${this.id}-${this.focusDotIndex}`).focus();
    }
  }

  private isPosNotInValueBorders(index, pos): boolean {
    return (
      (this.dotBorders[index].max && this.dotBorders[index].max < pos) ||
      (this.dotBorders[index].min && this.dotBorders[index].min > pos)
    );
  }

  private dragMove(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    const pos = this.getPosByEvent(e);
    this.isCrossDot(pos);
    if (this.borders && this.isPosNotInValueBorders(this.focusDotIndex, pos)) {
      return false;
    }
    this.control.setDotPos(pos, this.focusDotIndex);
    if (!this.lazy) {
      this.syncValueByPos();
    }
  }

  private dragEnd() {
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
    });
  }
}
