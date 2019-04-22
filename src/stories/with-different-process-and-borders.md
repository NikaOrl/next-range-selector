## The range-selector with process shown or not and different borders

You can set [process]:boolean to show it if true or hide away.
Also you can set [borders] - array of borders for dots by dot index. You can add bordersColors: string[] (default ['#9d9d9d', '#c6c6c6'])

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
  ...
  <next-range-selector
    [(ngModel)]="value1"
    name="range-selector1"
    [dotTpl]="dotTpl"
    [markTpl]="markTpl"
    [borders]="borders"
    [interval]="10"
    [marks]="true"
    style="display: inline-block; margin-top: 30px; width: 100%;"
  >
  </next-range-selector>
  <next-range-selector
    [(ngModel)]="value2"
    name="range-selector2"
    [dotTpl]="dotTpl"
    [markTpl]="markTpl"
    [borders]="borders"
    [interval]="10"
    [process]="true"
    [marks]="true"
    style="display: inline-block; margin-top: 30px; width: 100%;"
  >
  </next-range-selector>
  ...
  <next-range-selector
    [(ngModel)]="value5"
    name="range-selector5"
    [dotTpl]="dotTpl"
    [markTpl]="markTpl"
    [borders]="borders2"
    [interval]="10"
    [marks]="true"
    [bordersColors]="bordersColors"
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

### And the props looks like the code below

```
props: {
  value: [10, 40, 30],
  value1: [10, 40, 30],
  value2: [10, 40, 30],
  value3: [10, 40, 30],
  value4: [10, 40, 30],
  value5: [10, 40, 70],
  borders: [{max: 30, min: 5}, {max: 60, min: 30}],
  borders2: [{max: 30, min: 5}, {max: 60, min: 30}, {max: 80, min: 60}],
  bordersColors: ['red', 'green', 'blue'],
}
```
