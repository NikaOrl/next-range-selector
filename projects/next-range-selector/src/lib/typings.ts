export interface Styles {
  [key: string]: any;
}

export type Direction = 'ltr' | 'rtl' | 'ttb' | 'btt';
export type Position = 'top' | 'right' | 'bottom' | 'left';

// Value

export interface Value {
  dotValue: number | string;
  min?: number | string;
  max?: number | string;
}

// Tooltip
export interface TooltipStyle {
  tooltipStyle?: Styles;
  tooltipFocusStyle?: Styles;
  tooltipDisabledStyle?: Styles;
}
export type TooltipProp = 'none' | 'always' | 'focus';
export type TooltipFormatterFunc = (val: Value) => string;
export type TooltipFormatter = string | TooltipFormatterFunc;

// Dot
export interface DotStyle {
  style?: Styles;
  focusStyle?: Styles;
  disabledStyle?: Styles;
}
export interface DotOption extends DotStyle, TooltipStyle {
  disabled: boolean;
  tooltip?: TooltipProp;
}
export interface Dot extends DotOption {
  pos: number;
  index: number;
  value: Value;
  focus: boolean;
}

// Process
export type ProcessOption = Array<[number, number, Styles?]>;
export type ProcessFunc = (dotsPos: number[]) => ProcessOption;
export type ProcessProp = boolean | ProcessFunc;

export interface Process {
  start: number;
  end: number;
  style?: Styles;
}
