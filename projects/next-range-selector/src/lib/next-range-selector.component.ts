import {
  Component,
  OnInit,
  Input,
  forwardRef,
  HostListener,
  ElementRef,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {Value, Mark, MarksProp, Styles, Dot, Border, HandleFunction, IPosObject, ProcessOption} from './typings';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

const DEFAULT_SLIDER_SIZE = 4;
let uniqueId = 0;
const enum KEY {
  LEFT = 'ArrowLeft',
  UP = 'ArrowUp',
  RIGHT = 'ArrowRight',
  DOWN = 'ArrowDown',
}
export enum RangeSelectorDirection {
  ltr = 'ltr',
  rtl = 'rtl',
  ttb = 'ttb',
  btt = 'btt',
}

type DotsPosChangeArray = number[];

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
  @Input() public id: string = `next-range-selector-${++uniqueId}`;
  @Input() public min: number = 0;
  @Input() public max: number = 100;
  @Input() public useKeyboard: boolean = true;
  @Input() public interval: number;
  @Input() public process?: boolean;
  @Input() public duration: number = 0.5;
  @Input() public tabIndex: number = 1;
  @Input() public width: number | string;
  @Input() public height: number | string;
  @Input() public dotSize: [number, number] | number = 14;
  @Input() public direction: RangeSelectorDirection = RangeSelectorDirection.ltr;
  @Input() public borders: Border[];
  @Input() public showBorders: boolean = true;
  @Input() public disabled: boolean = false;
  @Input() public marks?: MarksProp;
  @Input() public data?: Value[];
  @Input() public lazy = false; // true -> value will only be updated when the drag is over
  @Input() public dotDisabled: boolean | boolean[];

  @Input() public dotTpl: TemplateRef<any>;
  @Input() public markTpl: TemplateRef<any>;

  @Input() public railStyle?: Styles;
  @Input() public processStyle?: Styles;
  @Input() public markStyle?: Styles;
  @Input() public markStepStyle?: Styles;
  @Input() public dotStyle: Styles;
  @Input() public borderStyle?: Styles;
  @Input() public bordersColors: string[] = ['#9d9d9d', '#c6c6c6'];

  get dots(): Dot[] {
    return this.dotsPos.map((pos, index) => ({
      pos,
      index,
      disabled: (this.dotDisabled && this.dotDisabled[index]) || this.disabled,
      focus: document.getElementById(`${this.id}-${index}`) === document.activeElement,
      style: {
        ...this.dotBaseStyle,
        'pointer-events': this.isDisabledByDotIndex(index) || this.disabled ? 'none' : 'auto',
        [this.mainDirection]: `${pos}%`,
        transition: this.dragging ? '0s' : `${this.mainDirection} ${this.animateTime}s`,
        ...this.dotStyle,
      },
    }));
  }

  get processArray(): Styles[] {
    if (this.process) {
      return this.processArrayDots.map(([start, end]) => {
        const sizeStyleKey = this.isHorizontal ? 'width' : 'height';
        return {
          style: {
            [this.isHorizontal ? 'height' : 'width']: '100%',
            [this.isHorizontal ? 'top' : 'left']: 0,
            [this.mainDirection]: `${start}%`,
            [sizeStyleKey]: `${end - start}%`,
            transitionProperty: `${sizeStyleKey},${this.mainDirection}`,
            transitionDuration: this.dragging ? '0s' : `${this.animateTime}s`,
            ...this.processStyle,
          },
        };
      });
    } else {
      return [];
    }
  }

  get bordersArray(): Styles[] {
    if (this.borders && this.showBorders) {
      const bordersArray = [];
      this.borders.forEach((value, index) => {
        const sizeStyleKey = this.isHorizontal ? 'width' : 'height';
        const valueMin = value.min ? value.min : this.min;
        const valueMax = value.max ? value.max : this.max;
        bordersArray.push({
          style: {
            'background-color': this.bordersColors[index % this.bordersColors.length],
            [this.isHorizontal ? 'height' : 'width']: '100%',
            [this.isHorizontal ? 'top' : 'left']: 0,
            [this.mainDirection]: `${valueMin}%`,
            [sizeStyleKey]: `${+valueMax - +valueMin}%`,
            ...this.borderStyle,
          },
        });
      });
      return bordersArray;
    } else {
      return [];
    }
  }

  get markList(): Mark[] {
    if (!this.marks) {
      return [];
    }

    const getMarkByValue = (value: Value, mark?: Value): Mark => {
      const pos = this.parseValue(value);
      return {
        value,
        style: {
          [this.isHorizontal ? 'height' : 'width']: '100%',
          [this.isHorizontal ? 'width' : 'height']: '4px',
          [this.mainDirection]: `${pos}%`,
          ...this.markStyle,
        },
        mark: mark ? mark : value,
      };
    };
    if (this.marks === true) {
      return this.getValues().map((value) => getMarkByValue(value));
    } else if (Object.prototype.toString.call(this.marks) === '[object Object]') {
      return Object.keys(this.marks)
        .sort((a, b) => +a - +b)
        .map((value) => {
          const item = this.marks[value];
          return getMarkByValue(value, item);
        });
    } else if (Array.isArray(this.marks)) {
      return this.marks.map((value) => getMarkByValue(value));
    } else {
      return [];
    }
  }

  get containerStyles(): Styles {
    const [dotWidth, dotHeight] = Array.isArray(this.dotSize) ? this.dotSize : [this.dotSize, this.dotSize];
    const containerWidth = this.width
      ? this.getSize(this.width)
      : this.isHorizontal
      ? '100%'
      : this.getSize(DEFAULT_SLIDER_SIZE);
    const containerHeight = this.height
      ? this.getSize(this.height)
      : this.isHorizontal
      ? this.getSize(DEFAULT_SLIDER_SIZE)
      : '100%';
    return {
      'pointer-events': this.disabled ? 'none' : 'auto',
      padding: this.isHorizontal ? `${dotHeight / 2}px 0` : `0 ${dotWidth / 2}px`,
      width: containerWidth,
      height: containerHeight,
    };
  }

  get railStyles(): Styles {
    if (this.railStyle) {
      return this.railStyle;
    } else {
      return {
        'background-color': '#e3e3e3',
      };
    }
  }

  get markStepStyles(): Styles {
    if (this.markStepStyle) {
      return this.markStepStyle;
    } else {
      return {
        'background-color': '#c6c6c6',
      };
    }
  }

  get containerClasses(): string[] {
    return ['slider', `slider-${this.direction}`];
  }

  get dotBaseStyle(): Styles {
    const [dotWidth, dotHeight] = Array.isArray(this.dotSize) ? this.dotSize : [this.dotSize, this.dotSize];
    let dotPos: {[key: string]: string};
    if (this.isHorizontal) {
      dotPos = {
        transform: `translate(${this.isReverse ? '50%' : '-50%'}, -50%)`,
        WebkitTransform: `translate(${this.isReverse ? '50%' : '-50%'}, -50%)`,
        top: '50%',
        [this.direction === RangeSelectorDirection.ltr ? 'left' : 'right']: '0',
      };
    } else {
      dotPos = {
        transform: `translate(-50%, ${this.isReverse ? '50%' : '-50%'})`,
        WebkitTransform: `translate(-50%, ${this.isReverse ? '50%' : '-50%'})`,
        left: '50%',
        [this.direction === RangeSelectorDirection.btt ? 'bottom' : 'top']: '0',
      };
    }
    return {
      width: `${dotWidth}px`,
      height: `${dotHeight}px`,
      ...dotPos,
    };
  }

  get processArrayDots(): ProcessOption {
    if (this.process) {
      if (this.dotsPos.length === 1) {
        return [[0, this.dotsPos[0]]];
      } else if (this.dotsPos.length > 1) {
        return [[Math.min(...this.dotsPos), Math.max(...this.dotsPos)]];
      }
    }

    return [];
  }

  get total(): number {
    let total = 0;
    total = (this.max - this.min) / this.interval;
    if (total - Math.floor(total) !== 0) {
      return 0;
    }
    return total;
  }

  private get isHorizontal(): boolean {
    return this.direction === RangeSelectorDirection.ltr || this.direction === RangeSelectorDirection.rtl;
  }

  private get isReverse(): boolean {
    return this.direction === RangeSelectorDirection.rtl || this.direction === RangeSelectorDirection.btt;
  }

  private get animateTime(): number {
    return this.duration;
  }

  private get mainDirection(): string {
    switch (this.direction) {
      case RangeSelectorDirection.ltr:
        return 'left';
      case RangeSelectorDirection.rtl:
        return 'right';
      case RangeSelectorDirection.btt:
        return 'bottom';
      case RangeSelectorDirection.ttb:
        return 'top';
    }
  }

  // Distance between each value
  private get gap(): number {
    return 100 / this.total;
  }

  public value: Value | Value[];
  public focusDotIndex = 0;
  @ViewChild('container')
  public container: ElementRef;
  public el: HTMLDivElement;

  public dotsPos: number[] = []; // The position of each slider
  public dotsValue: Value[] = []; // The value of each slider
  private scale = 1;
  private dragging = false;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  public ngOnInit() {
    this.renderer.removeAttribute(this.elementRef.nativeElement, 'id');
    if (!this.interval) {
      this.interval = this.data ? (this.max - this.min) / (this.data.length - 1) : 1;
    }
    if (this.process === undefined) {
      this.process = !(this.borders && this.showBorders);
    }
    this.el = this.container.nativeElement as HTMLDivElement;
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

  // From ControlValueAccessor interface
  public writeValue(value: any): void {
    if (value) {
      this.value = value;
      this.setValue(this.value);
    }
  }

  // From ControlValueAccessor interface
  public registerOnChange(fn: (val?: any) => void): void {
    this.onChangeCallback = fn;
  }

  // From ControlValueAccessor interface
  public registerOnTouched(fn: (val?: any) => void): void {
    this.onTouchedCallback = fn;
  }

  public tabHandle(): void {
    this.focusDotIndex++;
    if (this.focusDotIndex >= this.dots.length) {
      this.focusDotIndex = 0;
    }
  }

  public onPointerDown(dotIndex: number): void {
    this.dragging = true;
    this.dragStart(dotIndex);
  }

  public keydownHandle(e: KeyboardEvent): void {
    if (!this.useKeyboard || this.disabled || this.isDisabledByDotIndex(this.focusDotIndex)) {
      return;
    }

    const handleFunc = this.getKeyboardHandleFunc(e, {
      direction: this.direction,
      max: this.total,
      min: 0,
    });
    const substr = document.activeElement.id.split('-').pop();
    this.focusDotIndex = Number(substr);

    if (handleFunc) {
      e.preventDefault();
      const index = this.getIndexByValue(this.dotsValue[this.focusDotIndex]);
      const newIndex = handleFunc(index);
      const pos = this.parseValue(this.getValueByIndex(newIndex));
      if (this.borders && this.isPosNotInValueBorders(this.focusDotIndex, pos)) {
        return;
      }
      this.setDotPos(pos, this.focusDotIndex);
      this.syncValueByPos();
    }
  }

  public clickHandle(e: MouseEvent | TouchEvent): void {
    this.setScale();

    const pos = this.getPosByEvent(e);
    this.setValueByPos(pos);
    document.getElementById(`${this.id}-${this.focusDotIndex}`).focus();
  }

  public getDotId(id: string, i: number): string {
    return `${id}-${i}`;
  }

  public trackByFn(index: any, item: any): any {
    return index;
  }

  public setValue(value: Value | Value[]): void {
    this.dotsValue = Array.isArray(value) ? [...value] : [value];
    this.syncDotsPos();
  }

  // Sync slider position
  public syncDotsPos(): void {
    this.dotsPos = this.dotsValue.map((v) => this.parseValue(v));
  }

  public getRecentDot(pos: number): number {
    const arr = this.dotsPos.map((dotPos, bordersIndex) => {
      if (
        this.borders &&
        this.borders[bordersIndex] &&
        ((this.borders[bordersIndex].max && this.borders[bordersIndex].max <= pos) ||
          (this.borders[bordersIndex].min && this.borders[bordersIndex].min >= pos))
      ) {
        return this.max + 1;
      } else {
        return Math.abs(dotPos - pos);
      }
    });
    return arr.indexOf(Math.min(...arr));
  }

  public getIndexByValue(value: Value): number {
    if (this.data) {
      return this.data.indexOf(value);
    }
    return (+value - this.min) / this.interval;
  }

  public getValueByIndex(index: number): number | Value {
    if (index < 0) {
      index = 0;
    } else if (index > this.total) {
      index = this.total;
    }
    return this.data ? this.data[index] : index * this.interval + this.min;
  }

  public setDotPos(pos: number, index: number): void {
    const changePos = pos - this.dotsPos[index];

    if (!changePos) {
      return;
    }

    const changePosArr: DotsPosChangeArray = new Array(this.dotsPos.length);
    changePosArr[index] = changePos;

    this.setDotsPos(this.dotsPos.map((curPos, i) => curPos + (changePosArr[i] || 0)));
  }

  public parseValue(val: number | string): number {
    if (this.data) {
      val = this.data.indexOf(val);
    } else if (typeof val === 'number' || typeof val === 'string') {
      val = +val;
      if (val < this.min || val > this.max || typeof val !== 'number' || val !== val) {
        return 0;
      }
      val = (val - this.min) / this.interval;
    }

    const pos = val * this.gap;
    return pos < 0 ? 0 : pos > 100 ? 100 : pos;
  }

  public getValues(): Value[] {
    if (this.data) {
      return this.data;
    } else {
      return Array.from(new Array(this.total), (_, index) => {
        return index * this.interval + this.min;
      }).concat([this.max]);
    }
  }

  public parsePos(pos: number): number | string {
    const index = Math.round(pos / this.gap);
    return this.getValueByIndex(index);
  }

  private setScale(): void {
    this.scale = Math.floor(this.isHorizontal ? this.el.offsetWidth : this.el.offsetHeight) / 100;
  }

  private isDisabledByDotIndex(index: number): boolean {
    return Array.isArray(this.value) ? this.dotDisabled && this.dotDisabled[index] : this.dotDisabled;
  }

  private setValueByPos(pos: number): void {
    const index = this.getRecentDot(pos);
    if (this.isDisabledByDotIndex(index)) {
      return;
    }
    if (this.borders && this.isPosNotInValueBorders(index, pos)) {
      return;
    }

    this.focusDotIndex = index;
    this.setDotPos(pos, index);
    this.syncValueByPos();

    setTimeout(() => {
      this.syncDotsPos();
    });
  }

  private dragStart(index: number): void {
    this.focusDotIndex = index;
    this.setScale();
  }

  private getSize(value: number | string): string {
    return typeof value === 'number' ? `${value}px` : value;
  }

  private getPos(e: MouseEvent | TouchEvent): IPosObject {
    const event = e instanceof MouseEvent ? e : e.targetTouches[0];
    const rect = this.el.getBoundingClientRect();
    const posObj = {
      x: event.pageX - (rect.left + window.scrollX),
      y: event.pageY - (rect.top + window.scrollY),
    };
    return {
      x: this.isReverse ? this.el.offsetWidth - posObj.x : posObj.x,
      y: this.isReverse ? this.el.offsetHeight - posObj.y : posObj.y,
    };
  }

  private getKeyboardHandleFunc(
    e: KeyboardEvent,
    params: {
      direction: RangeSelectorDirection;
      max: number;
      min: number;
    },
  ): HandleFunction | null {
    switch (e.key) {
      case KEY.UP:
        return (i) => (params.direction === RangeSelectorDirection.ttb ? i - 1 : i + 1);
      case KEY.RIGHT:
        return (i) => (params.direction === RangeSelectorDirection.rtl ? i - 1 : i + 1);
      case KEY.DOWN:
        return (i) => (params.direction === RangeSelectorDirection.ttb ? i + 1 : i - 1);
      case KEY.LEFT:
        return (i) => (params.direction === RangeSelectorDirection.rtl ? i + 1 : i - 1);

      default:
        return null;
    }
  }

  private getPosByEvent(e: MouseEvent | TouchEvent): number {
    return this.getPos(e)[this.isHorizontal ? 'x' : 'y'] / this.scale;
  }

  private isDiff(value1: Value[], value2: Value[]): boolean {
    return value1.length !== value2.length || value1.some((val, index) => val !== value2[index]);
  }

  private syncValueByPos(): void {
    const values = this.dotsValue;
    if (this.isDiff(values, Array.isArray(this.value) ? this.value : [this.value])) {
      this.onChangeCallback(values.length === 1 ? values[0] : [...values]);
      this.value = values.length === 1 ? values[0] : [...values];
    }
  }

  private isPosNotInValueBorders(index: number, pos: number): boolean {
    return (
      (this.borders[index] && this.borders[index].max && this.borders[index].max < pos) ||
      (this.borders[index] && this.borders[index].min && this.borders[index].min > pos)
    );
  }

  private dragMove(e: MouseEvent | TouchEvent): void {
    e.preventDefault();
    let pos = this.getPosByEvent(e);
    if (
      this.isDisabledByDotIndex(this.focusDotIndex) ||
      (this.borders && this.isPosNotInValueBorders(this.focusDotIndex, pos))
    ) {
      return;
    }
    pos = pos > 0 ? (pos < 100 ? pos : 100) : 0;
    this.setDotPos(pos, this.focusDotIndex);
    if (!this.lazy) {
      this.syncValueByPos();
    }
  }

  // Set the slider position
  private setDotsPos(dotsPos: number[]): void {
    this.dotsPos = dotsPos;
    this.dotsValue = dotsPos.map((dotPos) => this.parsePos(dotPos));
  }

  private dragEnd(): void {
    if (this.lazy) {
      this.syncValueByPos();
    }

    setTimeout(() => {
      this.syncDotsPos();
    });
  }
}
