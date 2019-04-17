export interface Styles {
  [key: string]: any;
}

export interface MarkOption {
  label: Value;
  style?: Styles;
}
export interface Mark extends MarkOption {
  value: Value;
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
