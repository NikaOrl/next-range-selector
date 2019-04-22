## The range-selector with different directions

You can set any styles you want for the range-selector. There are following inputs:

`interface Styles { [key: string]: any; }`

- railStyle: Styles;
- processStyle: Styles;
- markStyle: Styles;
- markStepStyle: Styles;
- dotStyle: Styles;
- borderStyle: Styles;
- bordersColors: string[] (default ['#9d9d9d', '#c6c6c6'])

You can use transclusion for dots and marks by setting ng-templates in [dotTpl] and [markTpl]. The component returns pos, index, disabled it or not (boolean disabled) and on focus it or not (boolean focus) for every dot. The component returns value (number or string) and label(mark) (number or string, if [marks] is not an object then mark = value) for every mark. So you can add some styles for every state and show whatever and however you want it.

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
  .slider-dot-rocket {
    cursor: pointer;
  }
</style>
<form class="container">
  <next-range-selector
    [(ngModel)]="value"
    name="range-selector1"
    [dotTpl]="dotTpl"
    [markTpl]="markTpl"
    [railStyle]="railStyle"
    [processStyle]="processStyle"
    [markStepStyle]="markStepStyle"
    [marks]="true"
    [interval]="10"
    [dotStyle]="dotStyle"
    [markStyle]="markStyle"
  >
  </next-range-selector>
</form>
<ng-template #dotTpl let-focus="focus">
  <div class="slider-dot">
    <div class="slider-dot-rocket" [ngStyle]="focus ? {'outline': 'red auto 5px'}: {}">
      🚀
    </div>
  </div>
</ng-template>
<ng-template #markTpl let-mark="mark">{{ mark }}</ng-template>
```

### And the props looks like the code below

```
props: {
  value: 10,
  railStyle: {'background-color': 'pink'},
  processStyle: {'background-color': 'green'},
  markStepStyle: {'background-color': 'red'},
  dotStyle: {outline: 'none'},
  markStyle: {'font-family': 'Consolas', color: 'darkred'},
}
```
