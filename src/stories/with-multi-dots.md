## The range-selector with different directions

You can set different settins for multi-dots renge-selector:

- enableCross (default true);
- fixed (default false) - the dots process will be fixed length;
- minRange: number - minimum length of the dots process;
- maxRange: number - maximum length of the dots process;
- order (default true) - shows if the dots are ordered ascending.

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
  .container {
    font-size: 16px;
    font-family: sans-serif;
    margin: 50px;
  }
</style>
<form class="container">
  Base:
  <next-range-selector
    [(ngModel)]="value1"
    name="range-selector1"
    [dotTpl]="dotTpl"
    [markTpl]="markTpl"
  >
  </next-range-selector>
  enableCross = false:
  <next-range-selector
    [(ngModel)]="value2"
    name="range-selector2"
    [dotTpl]="dotTpl"
    [markTpl]="markTpl"
    [enableCross]="false"
    style="display: inline-block; margin-top: 30px; width: 100%;"
  >
  </next-range-selector>
  minRange, maxRange:
  <next-range-selector
    [(ngModel)]="value3"
    name="range-selector3"
    [dotTpl]="dotTpl"
    [markTpl]="markTpl"
    [minRange]="10"
    [maxRange]="50"
    style="display: inline-block; margin-top: 30px; width: 100%;"
  >
  </next-range-selector>
  fixed:
  <next-range-selector
    [(ngModel)]="value4"
    name="range-selector4"
    [dotTpl]="dotTpl"
    [markTpl]="markTpl"
    [fixed]="true"
    style="display: inline-block; margin-top: 30px; width: 100%;"
  >
  </next-range-selector>
</form>
<ng-template #dotTpl>
  <div class="slider-dot">
    <div class="slider-dot-handle"></div>
  </div>
</ng-template>
<ng-template #markTpl let-mark="mark">{{ mark }}</ng-template>
```
