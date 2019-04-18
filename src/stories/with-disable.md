## The range-selector with different directions

You can make all range-selector disable - then all its dots will be disabled. Or you can set disable for some dots by using dotDisabled array ([false, true] for example).

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
  ...
  <next-range-selector
    [(ngModel)]="value2"
    name="range-selector2"
    [dotTpl]="dotTpl"
    [markTpl]="markTpl"
    [disabled]="true"
    style="display: inline-block; margin-top: 30px; width: 100%;"
  >
  </next-range-selector>
  <next-range-selector
    [(ngModel)]="value3"
    name="range-selector3"
    [dotTpl]="dotTpl"
    [markTpl]="markTpl"
    [dotDisabled]="dotDisabled"
    style="display: inline-block; margin-top: 30px; width: 100%;"
  >
  </next-range-selector>
</form>
<ng-template #dotTpl let-disabled="disabled">
  <div class="slider-dot">
    <div class="slider-dot-handle" [ngStyle]="disabled ? {'background-color': 'lightgrey'}: {}"></div>
  </div>
</ng-template>
<ng-template #markTpl let-mark="value">{{ mark }} </ng-template>
```

### And the props looks like the code below

```
props: {
  value1: [15, 30],
  value2: [15, 30],
  value3: [15, 30],
  dotDisabled: [false, true],
}
```
