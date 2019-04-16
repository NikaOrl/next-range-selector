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
<ng-template #markTpl let-mark="value">{{ mark }} </ng-template>
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
<ng-template #markTpl let-mark="value">{{ mark }} </ng-template>
```

## The RangeSelector has:

### RangeSelector inputs:

- dotTpl - template variable for the ng-template of the dot
- markTpl- template variable for the ng-template of the mark

- id: string (In case of missing the id, it will be automatically generated);
- min (default 0) - minimum of the range
- max (default 100) - maximum of the range
- useKeyboard (default true)
- interval - interval between values
- process: ProcessProp;
- duration: number (default 0.5)
- tabIndex: number (default 1)
- width: number | string;
- height: number | string;
- dotSize: [number, number] | number (default 14)
- direction: Direction (default 'ltr')
- borders: Border[];
- showBorders: boolean (default true)
- disabled: boolean (default false)
- marks?: MarksProp;
- data?: Value[];
- lazy (default false) // true -> value will only be updated when the drag is over

- railStyle?: Styles;
- processStyle?: Styles;
- markStyle?: Styles;
- markStepStyle?: Styles;
- dotStyle: Styles;
- borderStyle?: Styles;
- bordersColors: string[] (default ['#9d9d9d', '#c6c6c6'])

- dotOptions: DotOption | DotOption[]; // disabled dots

Only for multi-dots:

- enableCross (default true)
- fixed (default false)
- minRange?: number;
- maxRange?: number;
- order (default true)

### The template for this example looks like the code below

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
<ng-template #markTpl let-mark="value">{{ mark }} </ng-template>
```
