## Project setup

```
npm i next-range-selector
```

## Basic usage example with NgModel

### Add module into your app

```
import { NextRangeSelectorModule } from 'next-range-selector';
import { FormsModule } from '@angular/forms';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [
    ..., NextRangeSelectorModule, FormsModule
  ],
  providers: []
})
export class AppModule {
}

```

### Add code to the component file

```
@Component({
  export class AppComponent {
    ...
    value = 10;
  }
  ...
```

### Add markup to the template file

```
<form>
  <next-range-selector
    [(ngModel)]="value"
    name="range-selector1"
    [dotTpl]="dotTpl"
    [markTpl]="markTpl"
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

## Basic usage example with Reactive Forms

### Add module into your app

```
import { NextRangeSelectorModule } from 'next-range-selector';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [...,
    NextRangeSelectorModule,
    ReactiveFormsModule
  ],
  providers: []
})
export class AppModule {
}

```

### Add code to the component file

```
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  export class AppComponent {
    ...
    public appFormGroup = new FormGroup({
      value: new FormControl(10),
    });
  }
  ...
```

### Add markup to the template file

```
<form [formGroup]="appFormGroup">
  <next-range-selector
    [(ngModel)]="value"
    name="range-selector1"
    [dotTpl]="dotTpl"
    [markTpl]="markTpl"
    formControlName="value"
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

## The RangeSelector has:

### RangeSelector inputs:

- id: string (In case of missing the id, it will be automatically generated);
- min: number (default 0) - minimum of the range;
- max: number (default 100) - maximum of the range;
- useKeyboard: boolean (default true);
- interval: number (default 1) - step between values;
- process: boolean (if [borders]=true, then default false, if [borders]=false, then default true) - show process (area between dots);
- duration: number (default 0.5) - css "transition-duration" - the animation duration of the dot and the process in seconds;
- tabIndex: number (default 1);
- width: number | string;
- height: number | string;
- dotSize: [number, number] | number (default 14);
- direction: RangeSelectorDirection (enum - string) (default 'ltr' - 'left to right');
- borders: Border[] - array of borders by dot index;
- showBorders: boolean (default true);
- disabled: boolean (default false) - disable for a whole selector;
- marks: boolean | Marks | Value[] - if boolean: show marks (all possible values), if Marks: marks object, if Value: array of strings|numbers;
- data: Value[] - array of strings|numbers - possible values;
- lazy (default false) - if true: value will only be updated when the drag is over;
- dotDisabled: boolean | boolean[];

Templates:

- dotTpl - template variable for the ng-template of the dot;
- markTpl - template variable for the ng-template of the mark;

Styles:

`interface Styles { [key: string]: any; }`

- railStyle: Styles;
- processStyle: Styles;
- markStyle: Styles;
- markStepStyle: Styles;
- dotStyle: Styles;
- borderStyle: Styles;
- bordersColors: string[] (default ['#9d9d9d', '#c6c6c6']);

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
  <b>Form title</b>
  <p>min: 0, max: 100, value: <input type="text" name="input" size="5" [(ngModel)]="value"/></p>
  <p>next-range-selector default look:</p>
  <next-range-selector
    [(ngModel)]="value"
    name="range-selector1"
    [dotTpl]="dotTpl"
    [markTpl]="markTpl"
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
