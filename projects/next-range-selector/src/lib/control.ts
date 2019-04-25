import {Value, MarksProp, ProcessOption} from './typings';

// The distance each slider changes
type DotsPosChangeArray = number[];

export const enum ERROR_TYPE {
  VALUE = 1,
  INTERVAL,
  MIN,
  MAX,
}

type ERROR_MESSAGE = {[key in ERROR_TYPE]: string};
export const ERROR_MSG: ERROR_MESSAGE = {
  [ERROR_TYPE.VALUE]: 'The type of the "value" is illegal',
  [ERROR_TYPE.INTERVAL]: 'The prop "interval" is invalid, "(max - min)" cannot be divisible by "interval"',
  [ERROR_TYPE.MIN]: 'The "value" cannot be less than the minimum.',
  [ERROR_TYPE.MAX]: 'The "value" cannot be greater than the maximum.',
};

export default class Control {
  get processArray(): ProcessOption {
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
      this.emitError(ERROR_TYPE.INTERVAL);
      return 0;
    }
    return total;
  }

  // Distance between each value
  private get gap(): number {
    return 100 / this.total;
  }

  public dotsPos: number[] = []; // The position of each slider
  public dotsValue: Value[] = []; // The value of each slider

  public data?: Value[];
  public max: number;
  public min: number;
  public interval: number;
  public marks?: MarksProp;
  public process?: boolean;
  public onError?: (type: ERROR_TYPE, message: string) => void;

  constructor(options: {
    data?: Value[];
    value: Value | Value[];
    max: number;
    min: number;
    interval: number;
    marks?: MarksProp;
    process?: boolean;
    onError?: (type: ERROR_TYPE, message: string) => void;
  }) {
    this.data = options.data;
    this.max = options.max;
    this.min = options.min;
    this.interval = options.interval;
    this.process = options.process;
    this.onError = options.onError;
    this.setValue(options.value);
  }

  public setValue(value: Value | Value[]) {
    this.dotsValue = Array.isArray(value) ? [...value] : [value];
    this.syncDotsPos();
  }

  // Sync slider position
  public syncDotsPos() {
    this.dotsPos = this.dotsValue.map((v) => this.parseValue(v));
  }

  public getRecentDot(pos: number, borders?: any[], dotDisabled?: boolean | boolean[]): number {
    const arr = this.dotsPos.map((dotPos, bordersIndex) => {
      if (
        (borders &&
          borders[bordersIndex] &&
          ((borders[bordersIndex].max && borders[bordersIndex].max <= pos) ||
            (borders[bordersIndex].min && borders[bordersIndex].min >= pos))) ||
        (dotDisabled && dotDisabled[bordersIndex])
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

  public setDotPos(pos: number, index: number) {
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
      if (val < this.min) {
        this.emitError(ERROR_TYPE.MIN);
        return 0;
      }
      if (val > this.max) {
        this.emitError(ERROR_TYPE.MAX);
        return 0;
      }
      if (typeof val !== 'number' || val !== val) {
        this.emitError(ERROR_TYPE.VALUE);
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

  private emitError(type: ERROR_TYPE) {
    if (this.onError) {
      this.onError(type, ERROR_MSG[type]);
    }
  }

  // Set the slider position
  private setDotsPos(dotsPos: number[]) {
    this.dotsPos = dotsPos;
    this.dotsValue = dotsPos.map((dotPos) => this.parsePos(dotPos));
  }
}
