import {storiesOf, moduleMetadata} from '@storybook/angular';
import {NextRangeSelectorComponent} from '../../projects/next-range-selector/src/public_api';
import defaultText from './default.md';

const styles = `
  <style>
    .slider-dot \{
      height: 14px;
      left: 58%;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      transition: all 0s;
      transition: left 0.5s ease 0s;
      width: 14px;
      will-change: transform;
      z-index: 5;
    \}
    .slider-dot-handle \{
      -webkit-box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.32);
      -webkit-box-sizing: border-box;
      background-color: #fff;
      border-radius: 50%;
      box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.32);
      box-sizing: border-box;
      cursor: pointer;
      height: 100%;
      width: 100%;
    \}
  </style>
`;

storiesOf('next-range-selector', module)
  .addDecorator(
    moduleMetadata({
      declarations: [NextRangeSelectorComponent],
    }),
  )
  .add(
    'Install',
    () => ({
      template: `
      ${styles}
      <form class="range-selector-form">
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
    `,
      props: {
        value: 10,
      },
    }),
    {notes: defaultText},
  )
  .add(
    'Diff directions',
    () => ({
      template: `
      ${styles}
      <form class="range-selector-form">
        <next-range-selector
          [(ngModel)]="value"
          name="range-selector1"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          [direction]="'ltr'"
        >
        </next-range-selector>
        <next-range-selector
          [(ngModel)]="value"
          name="range-selector2"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          [direction]="'rtl'"
        >
        </next-range-selector>
        <next-range-selector
          [(ngModel)]="value"
          name="range-selector3"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          [direction]="'ttb'"
          style="display: inline-block; margin: 30px; height: 300px;"
        >
        </next-range-selector>
        <next-range-selector
          [(ngModel)]="value"
          name="range-selector4"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          [direction]="'btt'"
          style="display: inline-block; margin: 30px; height: 300px;"
        >
        </next-range-selector>
      </form>
      <ng-template #dotTpl>
        <div class="slider-dot">
          <div class="slider-dot-handle"></div>
        </div>
      </ng-template>
      <ng-template #markTpl let-mark="value">{{ mark }} </ng-template>
    `,
      props: {
        value: 10,
      },
    }),
    {notes: defaultText},
  )
  .add(
    'Diff marks and data',
    () => ({
      template: `
      ${styles}
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
        <next-range-selector
          [(ngModel)]="value3"
          name="range-selector3"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          [direction]="'btt'"
          [interval]="20"
          [marks]="true"
          style="display: inline-block; margin: 30px; height: 300px;"
        >
        </next-range-selector>
        <next-range-selector
          [(ngModel)]="value4"
          name="range-selector4"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          [direction]="'ttb'"
          [data]="data"
          [marks]="true"
          style="display: inline-block; margin: 30px; height: 300px;"
        >
        </next-range-selector>
      </form>
      <ng-template #dotTpl>
        <div class="slider-dot">
          <div class="slider-dot-handle"></div>
        </div>
      </ng-template>
      <ng-template #markTpl let-mark="value">{{ mark }} </ng-template>
    `,
      props: {
        value: 10,
        data: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
        value2: 'b',
        value3: 40,
        value4: 'c',
        marks: [0, 10, 40, 50, 100],
        value5: 10,
      },
    }),
    {notes: defaultText},
  )
  .add(
    'Diff process and borders',
    () => ({
      template: `
      ${styles}
      <form class="range-selector-form">
        <next-range-selector
          [(ngModel)]="value"
          name="range-selector0"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
        >
        </next-range-selector>
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
        <next-range-selector
          [(ngModel)]="value3"
          name="range-selector3"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          [borders]="borders"
          [interval]="10"
          [showBorders]="false"
          [marks]="true"
          style="display: inline-block; margin-top: 30px; width: 100%;"
        >
        </next-range-selector>
        <next-range-selector
          [(ngModel)]="value4"
          name="range-selector4"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          [borders]="borders"
          [showBorders]="false"
          [process]="false"
          [interval]="10"
          [marks]="true"
          style="display: inline-block; margin-top: 30px; width: 100%;"
        >
        </next-range-selector>
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
      <ng-template #markTpl let-mark="value">{{ mark }} </ng-template>
    `,
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
      },
    }),
    {notes: defaultText},
  )
  .add(
    'Multi-dots',
    () => ({
      template: `
      ${styles}
      <form class="range-selector-form">
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
      <ng-template #markTpl let-mark="value">{{ mark }} </ng-template>
    `,
      props: {
        value1: [10, 40, 30],
        value2: [10, 30, 40],
        value3: [15, 30],
        value4: [15, 30],
      },
    }),
    {notes: defaultText},
  )
  .add(
    'Disabled',
    () => ({
      template: `
      ${styles}
      <form class="range-selector-form">
        <next-range-selector
          [(ngModel)]="value1"
          name="range-selector1"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
        >
        </next-range-selector>
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
          [dotOptions]="dotOptions"
          style="display: inline-block; margin-top: 30px; width: 100%;"
        >
        </next-range-selector>
      </form>
      <ng-template #dotTpl let-disabled="disabled">
        <div class="slider-dot">
          <div class="slider-dot-handle"  [ngStyle]="disabled ? {'background-color': 'lightgrey'}: {}"></div>
        </div>
      </ng-template>
      <ng-template #markTpl let-mark="value">{{ mark }} </ng-template>
    `,
      props: {
        value1: [15, 30],
        value2: [15, 30],
        value3: [15, 30],
        dotOptions: [{disabled: false}, {disabled: true}],
      },
    }),
    {notes: defaultText},
  )
  .add(
    'Duration and tabIndex',
    () => ({
      template: `
      ${styles}
      <form class="range-selector-form">
      0.5 duration (default), tabIndex 1:
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
        0 duration, tabIndex 3 (default):
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
        1 duration, tabIndex 4:
        <next-range-selector
          [(ngModel)]="value3"
          name="range-selector3"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          [tabIndex]="4"
          [duration]="1"
          [interval]="10"
          [marks]="true"
          style="display: inline-block; margin: 30px 0; width: 100%;"
        >
        </next-range-selector>
        2 duration, tabIndex 2:
        <next-range-selector
          [(ngModel)]="value4"
          name="range-selector4"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          [tabIndex]="2"
          [duration]="2"
          [interval]="10"
          [marks]="true"
          style="display: inline-block; margin: 30px 0; width: 100%;"
        >
        </next-range-selector>
      </form>
      <ng-template #dotTpl>
        <div class="slider-dot">
          <div class="slider-dot-handle"></div>
        </div>
      </ng-template>
      <ng-template #markTpl let-mark="value">{{ mark }} </ng-template>
    `,
      props: {
        value1: [10, 50],
        value2: [10, 50],
        value3: [10, 50],
        value4: [10, 50],
      },
    }),
    {notes: defaultText},
  )
  .add(
    'Diff styles',
    () => ({
      template: `
      <style>
        .slider-dot-rocket \{
          cursor: pointer;
        \}
      </style>
      ${styles}
      <form class="range-selector-form">
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
          <div class="slider-dot-rocket"
          [ngStyle]="focus ? {'outline': 'red auto 5px'}: {}">🚀</div>
        </div>
      </ng-template>
      <ng-template #markTpl let-mark="value">{{ mark }} </ng-template>
    `,
      props: {
        value: 10,
        railStyle: {'background-color': 'pink'},
        processStyle: {'background-color': 'green'},
        markStepStyle: {'background-color': 'red'},
        dotStyle: {outline: 'none'},
        markStyle: {'font-family': 'Consolas', color: 'darkred'},
      },
    }),
    {notes: defaultText},
  );
