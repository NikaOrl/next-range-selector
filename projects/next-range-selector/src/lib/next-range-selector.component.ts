import {Component, OnInit, Input, forwardRef, HostListener, ElementRef, Renderer2, TemplateRef} from '@angular/core';
import {
  Value,
  Mark,
  MarksProp,
  MarkOption,
  Styles,
  DotOption,
  Dot,
  Direction,
  ProcessProp,
  Border,
  HandleFunction,
  IPosObject,
} from './typings';
import Control, {ERROR_TYPE} from './control';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

const DEFAULT_SLIDER_SIZE = 4;
let uniqueId = 0;
const enum KEY_CODE {
  PAGE_UP = 33,
  PAGE_DOWN,
  END,
  HOME,
  LEFT,
  UP,
  RIGHT,
  DOWN,
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
  @Input() public dotTpl: TemplateRef<any>;
  @Input() public markTpl: TemplateRef<any>;

  @Input() public id = `next-range-selector-${++uniqueId}`;
  @Input() public min = 0;
  @Input() public max = 100;
  @Input() public useKeyboard = true;
  @Input() public interval;
  @Input() public process?: ProcessProp;
  @Input() public duration: number = 0;
  @Input() public tabIndex: number = 1;
  @Input() public width: number | string;
  @Input() public height: number | string;
  @Input() public dotSize: [number, number] | number = 14;
  @Input() public direction: Direction = 'ltr';
  @Input() public borders: Border[];
  @Input() public showBorders: boolean = true;
  @Input() public disabled: boolean = false;
  @Input() public marks?: MarksProp;
  @Input() public data?: Value[];

  @Input() public railStyle?: Styles;
  @Input() public processStyle?: Styles;
  @Input() public markStyle?: Styles;
  @Input() public markStepStyle?: Styles;
  @Input() public dotStyle: Styles;
  @Input() public borderStyle?: Styles;
  @Input() public bordersColorsArray: string[] = ['#9d9d9d', '#c6c6c6'];

  @Input() public dotOptions: DotOption | DotOption[]; // disabled dots
  // only for multi-dots:
  @Input() public enableCross = true;
  @Input() public fixed = false;
  @Input() public minRange?: number;
  @Input() public maxRange?: number;
  @Input() public order = true; // false -> fixed and min/maxRange don't work
  @Input() public lazy = false; // true -> value will only be updated when the drag is over

  get dots(): Dot[] {
    if (this.control) {
      return this.control.dotsPos.map((pos, index) => ({
        pos,
        index,
        disabled: (this.dotOptions && this.dotOptions[index].disabled) || this.disabled,
        focus: this.focusDotIndex === index,
        style: {
          ...this.dotBaseStyle,
          'pointer-events': (this.dotOptions && this.dotOptions[index].disabled) || this.disabled ? 'none' : 'auto',
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
        if (start > end) {
          [start, end] = [end, start];
        }
        const sizeStyleKey = this.isHorizontal ? 'width' : 'height';
        return {
          style: {
            [this.isHorizontal ? 'height' : 'width']: '100%',
            [this.isHorizontal ? 'top' : 'left']: 0,
            [this.mainDirection]: `${start}%`,
            [sizeStyleKey]: `${end - start}%`,
            transitionProperty: `${sizeStyleKey},${this.mainDirection}`,
            transitionDuration: `${this.animateTime}s`,
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
            'background-color': this.bordersColorsArray[index % this.bordersColorsArray.length],
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

    const getMarkByValue = (value: Value, mark?: MarkOption): Mark => {
      const pos = this.control.parseValue(value);
      return {
        value,
        style: {
          [this.isHorizontal ? 'height' : 'width']: '100%',
          [this.isHorizontal ? 'width' : 'height']: '4px',
          [this.mainDirection]: `${pos}%`,
          ...this.markStyle,
        },
        ...mark,
      };
    };
    if (this.control) {
      if (this.marks === true) {
        return this.control.getValues().map((value) => getMarkByValue(value));
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

  private get isHorizontal(): boolean {
    return this.direction === 'ltr' || this.direction === 'rtl';
  }

  private get isReverse(): boolean {
    return this.direction === 'rtl' || this.direction === 'btt';
  }

  private get animateTime(): number {
    return this.duration;
  }

  private get mainDirection(): string {
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

  private get canSort(): boolean {
    return this.order && !this.minRange && !this.maxRange && !this.fixed && this.enableCross;
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
  private scale = 1;
  private control!: Control;
  private $el: HTMLElement = document.getElementById(this.id);
  private focusDotIndex = 0;
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
  }

  // From ControlValueAccessor interface
  public writeValue(value: any): void {
    if (value) {
      this.value = value;
      this.initControl();
      this.$el = document.getElementById(this.id);
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
      this.isCrossDot(pos);
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
    this.scale = Math.floor(this.isHorizontal ? this.$el.offsetWidth : this.$el.offsetHeight) / 100;
  }

  private isDisabledByDotIndex(index: number): boolean {
    return this.dotOptions && this.dotOptions[index].disabled;
  }

  private setValueByPos(pos: number) {
    const index = this.control.getRecentDot(pos, this.borders);
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
      if (this.isNotSync) {
        this.control.setValue(this.value);
      } else {
        this.control.syncDotsPos();
      }
    });
  }

  private dragStart(index: number) {
    this.focusDotIndex = index;
    this.setScale();
  }

  private getSize(value: number | string): string {
    return typeof value === 'number' ? `${value}px` : value;
  }

  private getPos(e: MouseEvent | TouchEvent, elem: HTMLElement, isReverse: boolean): IPosObject {
    const event = e instanceof MouseEvent ? e : e.targetTouches[0];
    const rect = elem.getBoundingClientRect();
    const posObj = {
      x: event.pageX - rect.left,
      y: event.pageY - rect.top,
    };
    return {
      x: isReverse ? elem.offsetWidth - posObj.x : posObj.x,
      y: isReverse ? elem.offsetHeight - posObj.y : posObj.y,
    };
  }

  private getKeyboardHandleFunc(
    e: KeyboardEvent,
    params: {
      direction: Direction;
      max: number;
      min: number;
    },
  ): HandleFunction | null {
    switch (e.keyCode) {
      case KEY_CODE.UP:
        return (i) => (params.direction === 'ttb' ? i - 1 : i + 1);
      case KEY_CODE.RIGHT:
        return (i) => (params.direction === 'rtl' ? i - 1 : i + 1);
      case KEY_CODE.DOWN:
        return (i) => (params.direction === 'ttb' ? i + 1 : i - 1);
      case KEY_CODE.LEFT:
        return (i) => (params.direction === 'rtl' ? i + 1 : i - 1);

      case KEY_CODE.END:
        return () => params.max;
      case KEY_CODE.HOME:
        return () => params.min;

      case KEY_CODE.PAGE_UP:
        return (i) => i + 10;
      case KEY_CODE.PAGE_DOWN:
        return (i) => i - 10;

      default:
        return null;
    }
  }

  private emitError(type: ERROR_TYPE, message: string) {
    console.log('error', type, message);
  }

  private getPosByEvent(e: MouseEvent | TouchEvent): number {
    return this.getPos(e, this.$el, this.isReverse)[this.isHorizontal ? 'x' : 'y'] / this.scale;
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
      (this.borders[index].max && this.borders[index].max < pos) ||
      (this.borders[index].min && this.borders[index].min > pos)
    );
    // return (
    //   (this.borders[index] && this.borders[index].max && this.borders[index].max < pos) ||
    //   (this.borders[index] && this.borders[index].min && this.borders[index].min > pos)
    // );
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
      if (this.isNotSync) {
        this.control.setValue(this.value);
      } else {
        // Sync slider position
        this.control.syncDotsPos();
      }
    });
  }
}
