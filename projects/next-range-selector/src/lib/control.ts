import {Value, MarksProp, ProcessOption} from './typings';

// The distance each slider changes
type DotsPosChangeArray = number[];

export const enum ERROR_TYPE {
  VALUE = 1,
  INTERVAL,
  MIN,
  MAX,
  ORDER,
}

type ERROR_MESSAGE = {[key in ERROR_TYPE]: string};
export const ERROR_MSG: ERROR_MESSAGE = {
  [ERROR_TYPE.VALUE]: 'The type of the "value" is illegal',
  [ERROR_TYPE.INTERVAL]: 'The prop "interval" is invalid, "(max - min)" cannot be divisible by "interval"',
  [ERROR_TYPE.MIN]: 'The "value" cannot be less than the minimum.',
  [ERROR_TYPE.MAX]: 'The "value" cannot be greater than the maximum.',
  [ERROR_TYPE.ORDER]: 'When "order" is false, the parameters "minRange", "maxRange", "fixed", "enabled" are invalid.',
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

  // The minimum distance between the two sliders
  private get minRangeDir(): number {
    return this.minRange ? this.minRange * this.gap : 0;
  }

  // Maximum distance between the two sliders
  private get maxRangeDir(): number {
    return this.maxRange ? this.maxRange * this.gap : 100;
  }

  private get valuePosRange(): Array<[number, number]> {
    const dotsPos = this.dotsPos;
    const valuePosRange: Array<[number, number]> = [];

    dotsPos.forEach((pos, i) => {
      valuePosRange.push([
        Math.max(this.minRange ? this.minRangeDir * i : 0, !this.enableCross ? dotsPos[i - 1] || 0 : 0),
        Math.min(
          this.minRange ? 100 - this.minRangeDir * (dotsPos.length - 1 - i) : 100,
          !this.enableCross ? dotsPos[i + 1] || 100 : 100,
        ),
      ]);
    });

    return valuePosRange;
  }

  public dotsPos: number[] = []; // The position of each slider
  public dotsValue: Value[] = []; // The value of each slider

  public data?: Value[];
  public enableCross: boolean;
  public fixed: boolean;
  public max: number;
  public min: number;
  public interval: number;
  public minRange: number;
  public maxRange: number;
  public order: boolean;
  public marks?: MarksProp;
  public process?: boolean;
  public onError?: (type: ERROR_TYPE, message: string) => void;

  constructor(options: {
    data?: Value[];
    value: Value | Value[];
    enableCross: boolean;
    fixed: boolean;
    max: number;
    min: number;
    interval: number;
    order: boolean;
    minRange?: number;
    maxRange?: number;
    marks?: MarksProp;
    process?: boolean;
    onError?: (type: ERROR_TYPE, message: string) => void;
  }) {
    this.data = options.data;
    this.max = options.max;
    this.min = options.min;
    this.interval = options.interval;
    this.order = options.order;
    this.process = options.process;
    this.onError = options.onError;
    if (this.order) {
      this.minRange = options.minRange || 0;
      this.maxRange = options.maxRange || 0;
      this.enableCross = options.enableCross;
      this.fixed = options.fixed;
    } else {
      if (options.minRange || options.maxRange || !options.enableCross || options.fixed) {
        this.emitError(ERROR_TYPE.ORDER);
      }
      this.minRange = 0;
      this.maxRange = 0;
      this.enableCross = true;
      this.fixed = false;
    }
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
    pos = this.getValidPos(pos, index).pos;
    const changePos = pos - this.dotsPos[index];

    if (!changePos) {
      return;
    }

    let changePosArr: DotsPosChangeArray = new Array(this.dotsPos.length);
    if (this.fixed) {
      changePosArr = this.getFixedChangePosArr(changePos, index);
    } else if (this.minRange || this.maxRange) {
      changePosArr = this.getLimitRangeChangePosArr(pos, changePos, index);
    } else {
      changePosArr[index] = changePos;
    }

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

  private getFixedChangePosArr(changePos: number, index: number): DotsPosChangeArray {
    this.dotsPos.forEach((originPos, i) => {
      if (i !== index) {
        const {pos: lastPos, inRange} = this.getValidPos(originPos + changePos, i);
        if (!inRange) {
          changePos = Math.min(Math.abs(lastPos - originPos), Math.abs(changePos)) * (changePos < 0 ? -1 : 1);
        }
      }
    });
    return this.dotsPos.map((_) => changePos);
  }

  private getLimitRangeChangePosArr(pos: number, changePos: number, index: number): DotsPosChangeArray {
    const changeDots = [{index, changePos}];
    const newChangePos = changePos;
    [this.minRange, this.maxRange].forEach((isLimitRange?: number, rangeIndex?: number) => {
      if (!isLimitRange) {
        return false;
      }
      const isMinRange = rangeIndex === 0;
      const isForward = changePos > 0;
      let next = 0;
      if (isMinRange) {
        next = isForward ? 1 : -1;
      } else {
        next = isForward ? -1 : 1;
      }

      // Determine if the two positions are within the legal interval
      const inLimitRange = (pos2: number, pos1: number): boolean => {
        const diff = Math.abs(pos2 - pos1);
        return isMinRange ? diff < this.minRangeDir : diff > this.maxRangeDir;
      };

      let i = index + next;
      let nextPos = this.dotsPos[i];
      let curPos = pos;
      while (this.isPos(nextPos) && inLimitRange(nextPos, curPos)) {
        const {pos: lastPos} = this.getValidPos(nextPos + newChangePos, i);
        changeDots.push({
          index: i,
          changePos: lastPos - nextPos,
        });
        i = i + next;
        curPos = lastPos;
        nextPos = this.dotsPos[i];
      }
    });

    return this.dotsPos.map((_, i) => {
      const changeDot = changeDots.filter((dot) => dot.index === i);
      return changeDot.length ? changeDot[0].changePos : 0;
    });
  }

  private isPos(pos: any): boolean {
    return typeof pos === 'number';
  }

  private emitError(type: ERROR_TYPE) {
    if (this.onError) {
      this.onError(type, ERROR_MSG[type]);
    }
  }

  private getValidPos(pos: number, index: number): {pos: number; inRange: boolean} {
    const range = this.valuePosRange[index];
    let inRange = true;
    if (pos < range[0]) {
      pos = range[0];
      inRange = false;
    } else if (pos > range[1]) {
      pos = range[1];
      inRange = false;
    }
    return {
      pos,
      inRange,
    };
  }

  // Set the slider position
  private setDotsPos(dotsPos: number[]) {
    const list = dotsPos;
    this.dotsPos = list;
    this.dotsValue = list.map((dotPos) => this.parsePos(dotPos));
  }
}
