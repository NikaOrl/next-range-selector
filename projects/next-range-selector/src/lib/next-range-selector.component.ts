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
import {Value, Mark, MarksProp, Styles, Dot, Border, HandleFunction, IPosObject} from './typings';
import Control from './control';
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
  @Input() public direction: string = RangeSelectorDirection.ltr;
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
    if (this.control) {
      return this.control.dotsPos.map((pos, index) => ({
        pos,
        index,
        disabled: (this.dotDisabled && this.dotDisabled[index]) || this.disabled,
        focus: document.getElementById(`${this.id}-${index}`) === document.activeElement,
        style: {
          ...this.dotBaseStyle,
          'pointer-events': (this.dotDisabled && this.dotDisabled[index].disabled) || this.disabled ? 'none' : 'auto',
          [this.mainDirection]: `${pos}%`,
          transition: this.dragging ? '0s' : `${this.mainDirection} ${this.animateTime}s`,
          ...this.dotStyle,
        },
      }));
    } else {
      return [];
    }
  }

  get processArray(): Styles[] {
    if (this.control && this.process) {
      return this.control.processArray.map(([start, end, style]) => {
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
      const pos = this.control.parseValue(value);
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
    if (this.control) {
      if (this.marks === true) {
        return this.control.getValues().map((value) => getMarkByValue(value));
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
    } else {
      return [];
    }
  }

  get containerStyles() {
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

  get railStyles() {
    if (this.railStyle) {
      return this.railStyle;
    } else {
      return {
        'background-color': '#e3e3e3',
      };
    }
  }

  get markStepStyles() {
    if (this.markStepStyle) {
      return this.markStepStyle;
    } else {
      return {
        'background-color': '#c6c6c6',
      };
    }
  }

  get containerClasses() {
    return ['slider', `slider-${this.direction}`];
  }

  get dotBaseStyle() {
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

  public value: Value | Value[];
  public control: Control;
  public focusDotIndex = 0;
  @ViewChild('container')
  public container: ElementRef;
  public el: HTMLDivElement;
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

  public initControl() {
    this.control = new Control({
      value: this.value,
      data: this.data,
      max: this.max,
      min: this.min,
      interval: this.interval,
      marks: this.marks,
      process: this.process,
    });
  }

  // From ControlValueAccessor interface
  public writeValue(value: any): void {
    if (value) {
      this.value = value;
      this.initControl();
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
    if (!this.useKeyboard || this.disabled) {
      return false;
    }

    const handleFunc = this.getKeyboardHandleFunc(e, {
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
      if (this.borders && this.isPosNotInValueBorders(this.focusDotIndex, pos)) {
        return false;
      }
      this.control.setDotPos(pos, this.focusDotIndex);
      this.syncValueByPos();
    }
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

  public trackByFn(index: any, item: any) {
    return index;
  }

  private setScale() {
    this.scale = Math.floor(this.isHorizontal ? this.el.offsetWidth : this.el.offsetHeight) / 100;
  }

  private isDisabledByDotIndex(index: number): boolean {
    return this.dotDisabled && this.dotDisabled[index];
  }

  private setValueByPos(pos: number) {
    const index = this.control.getRecentDot(pos, this.borders, this.dotDisabled);
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
      this.control.syncDotsPos();
    });
  }

  private dragStart(index: number) {
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
      direction: string;
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

  private isPosNotInValueBorders(index, pos): boolean {
    return (
      (this.borders[index] && this.borders[index].max && this.borders[index].max < pos) ||
      (this.borders[index] && this.borders[index].min && this.borders[index].min > pos)
    );
  }

  private dragMove(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    let pos = this.getPosByEvent(e);
    if (this.borders && this.isPosNotInValueBorders(this.focusDotIndex, pos)) {
      return false;
    }
    pos = pos > 0 ? (pos < 100 ? pos : 100) : 0;
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
      this.control.syncDotsPos();
    });
  }
}
