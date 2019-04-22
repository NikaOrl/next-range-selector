## The range-selector with different marks and data

If [marks] are "true", all possible values (digits or letters) will be shown as captions. But they might overlap each other, so you can set [marks] as object or as array of Value: strings|numbers;
Also you can set data by Value[], array of strings or numbers.

### The template for this example looks like the code below

```
<form class="range-selector-form">
  <next-range-selector
    [(ngModel)]="value"
    name="range-selector1"
    [dotTpl]="dotTpl"
    [markTpl]="markTpl"
    [interval]="10"
    [marks]="true"
  >
  </next-range-selector>
  <next-range-selector
    [(ngModel)]="value2"
    [data]="data"
    [marks]="true"
    name="range-selector2"
    [dotTpl]="dotTpl"
    [markTpl]="markTpl"
    style="display: inline-block; margin-top: 30px; width: 100%;"
  >
  </next-range-selector>
  <next-range-selector
    [(ngModel)]="value5"
    name="range-selector5"
    [dotTpl]="dotTpl"
    [markTpl]="markTpl"
    style="display: inline-block; margin-top: 30px; width: 100%;"
    [marks]="marks"
    [interval]="10"
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

### And the props looks like the code below

```
props: {
  value: 10,
  data: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  value2: 'b',
  value3: 40,
  value4: 'c',
  marks: [0, 10, 40, 50, 100],
  value5: 10,
}
```
