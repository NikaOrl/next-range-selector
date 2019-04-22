## The range-selector with different directions

You can set [duration] of the dot and process change animation to the range-selector - it's a number in seconds (default 0.5)
Also you can set different tabIndexes to the checkboxes

#### _Try to push Tab for the range-selectors_

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
  duration 0.5(default), tabIndex 1:
  <next-range-selector
    [(ngModel)]="value1"
    name="range-selector1"
    [dotTpl]="dotTpl"
    [markTpl]="markTpl"

    [interval]="10"
    [marks]="true"
    style="display: inline-block; margin: 30px 0; width: 100%;"
  >
  </next-range-selector>
  duration 0, tabIndex 3 (default):
  <next-range-selector
    [(ngModel)]="value2"
    name="range-selector2"
    [dotTpl]="dotTpl"
    [tabIndex]="3"
    [markTpl]="markTpl"
    [duration]="0"
    [interval]="10"
    [marks]="true"
    style="display: inline-block; margin: 30px 0; width: 100%;"
  >
  </next-range-selector>
  ...
</form>
<ng-template #dotTpl>
  <div class="slider-dot">
    <div class="slider-dot-handle"></div>
  </div>
</ng-template>
<ng-template #markTpl let-mark="value">{{ mark }} </ng-template>
```
