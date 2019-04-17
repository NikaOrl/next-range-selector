## The range-selector with different directions

You can set different directions to the range-selector.
There are four options in the special enum RangeSelectorDirection:

- 'ltr' (by default) - 'left to right';
- 'rtl' - 'right to left';
- 'ttb' - 'top to bottom';
- 'btt' - 'bottom to top'.

## To use this enum import it into the component:

```
import {RangeSelectorDirection} from 'next-range-selector';

export class AppComponent {
...
  public get RangeSelectorDirection() {
    return RangeSelectorDirection;
  }
}
```

### The template for this example looks like the code below

```
<style>
  .slider-dot {
    height: 14px;
    left: 58%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 14px;
    will-change: transform;
    z-index: 5;
  }
  .slider-dot-handle {
    -webkit-box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.32);
    -webkit-box-sizing: border-box;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.32);
    box-sizing: border-box;
    cursor: pointer;
    height: 100%;
    width: 100%;
  }
</style>
<form class="range-selector-form">
  <next-range-selector
    [(ngModel)]="value"
    name="range-selector1"
    [dotTpl]="dotTpl"
    [markTpl]="markTpl"
    [direction]="RangeSelectorDirection.ltr"
  >
  </next-range-selector>
  <next-range-selector
    [(ngModel)]="value"
    name="range-selector2"
    [dotTpl]="dotTpl"
    [markTpl]="markTpl"
    [direction]="RangeSelectorDirection.rtl"
  >
  </next-range-selector>
  ...
  </next-range-selector>
</form>
<ng-template #dotTpl>
  <div class="slider-dot">
    <div class="slider-dot-handle"></div>
  </div>
</ng-template>
<ng-template #markTpl let-mark="value">{{ mark }} </ng-template>
```
