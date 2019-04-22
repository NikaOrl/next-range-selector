export interface Styles {
  [key: string]: any;
}

export interface Mark {
  value: Value;
  mark?: Value;
  style?: Styles;
}
export type MarksProp = boolean | Value[];

export type Value = number | string;

export interface Dot {
  pos: number;
  index: number;
}

export interface Border {
  min: number;
  max: number;
}

export type ProcessOption = Array<[number, number, Styles?]>;

export type HandleFunction = (i: number) => number;

export interface IPosObject {
  x: number;
  y: number;
}
