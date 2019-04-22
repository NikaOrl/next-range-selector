import {storiesOf, moduleMetadata} from '@storybook/angular';
import {NextRangeSelectorComponent, RangeSelectorDirection} from '../../projects/next-range-selector/src/public_api';
import defaultText from './default.md';
import withDifferentDirections from './with-different-directions.md';
import withDifferentMarksAndData from './with-different-marks-and-data.md';
import withDifferentProcessAndBorders from './with-different-process-and-borders.md';
import withMultiDots from './with-multi-dots.md';
import withDisable from './with-disable.md';
import withDifferentDurationAndTabIndexes from './with-different-duration-and-tabIndexes.md';
import withDifferentStyles from './with-different-styles.md';

const styles = `
  <style>
    .slider-dot \{
      height: 14px;
      left: 58%;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
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
    .container \{
      font-size: 20px;
      font-family: sans-serif;
      margin: 50px;
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
      <ng-template #markTpl let-mark="value">{{ mark }}</ng-template>
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
      <form class="container">
        <b>Direction</b>
        <p>min: 0, max: 100, value: <input type="text" name="input" size="5" [(ngModel)]="value"/></p>
        <p>RangeSelectorDirection.ltr - left to right:</p>
        <next-range-selector
          [(ngModel)]="value"
          name="range-selector1"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          [direction]="RangeSelectorDirection.ltr"
        >
        </next-range-selector>
        <p>RangeSelectorDirection.rtl - right to left:</p>
        <next-range-selector
          [(ngModel)]="value"
          name="range-selector2"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          [direction]="RangeSelectorDirection.rtl"
        >
        </next-range-selector>
        <div style="display: flex; margin-top: 30px;">
          <div>
            <p>RangeSelectorDirection.ttb - top to bottom:</p>
            <next-range-selector
              [(ngModel)]="value"
              name="range-selector3"
              [dotTpl]="dotTpl"
              [markTpl]="markTpl"
              [direction]="RangeSelectorDirection.ttb"
              style="display: block; margin: 30px; height: 300px;"
            >
            </next-range-selector>
          </div>
          <div style="margin-left: 200px;">
            <p>RangeSelectorDirection.btt - bottom to top:</p>
            <next-range-selector
              [(ngModel)]="value"
              name="range-selector4"
              [dotTpl]="dotTpl"
              [markTpl]="markTpl"
              [direction]="RangeSelectorDirection.btt"
              style="display: block; margin: 30px; height: 300px;"
            >
            </next-range-selector>
          </div>
        </div>
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
        RangeSelectorDirection,
      },
    }),
    {notes: withDifferentDirections},
  )
  .add(
    'Diff marks and data',
    () => ({
      template: `
      ${styles}
      <form class="container">
        <b>Marks and data</b>
        <p>marks = true, interval = 10, value = 10:</p>
        <next-range-selector
          [(ngModel)]="value"
          name="range-selector1"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          [interval]="10"
          [marks]="true"
          style="display: inline-block; margin-bottom: 30px; width: 100%;"
        >
        </next-range-selector>
        <p>marks = true, data = ['a', 'b', 'c', 'd', 'e', 'f', 'g'], value = 'b':</p>
        <next-range-selector
          [(ngModel)]="value2"
          [data]="data"
          [marks]="true"
          name="range-selector2"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          style="display: inline-block; margin-bottom: 30px; width: 100%;"
        >
        </next-range-selector>
        <p>marks = [0, 10, 40, 50, 100], value = 10:</p>
        <next-range-selector
          [(ngModel)]="value5"
          name="range-selector5"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          style="display: inline-block; margin-bottom: 30px; width: 100%;"
          [marks]="marks"
          [interval]="10"
        >
        </next-range-selector>
        <div style="display: flex; margin-top: 30px;">
          <div>
            <p>marks = true, interval=20, value = 40, direction='btt':</p>
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
          </div>
          <div style="margin-left: 200px;">
            <p>marks = true, data = ['a', 'b', 'c', 'd', 'e', 'f', 'g'], value = 'c', direction='ttb':</p>
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
          </div>
        </div>
      </form>
      <ng-template #dotTpl>
        <div class="slider-dot">
          <div class="slider-dot-handle"></div>
        </div>
      </ng-template>
      <ng-template #markTpl let-mark="value">{{ mark }}</ng-template>
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
    {notes: withDifferentMarksAndData},
  )
  .add(
    'Diff process and borders',
    () => ({
      template: `
      ${styles}
      <form class="container">
        <b>Process and borders</b>
        <p>default view:</p>
        <next-range-selector
          [(ngModel)]="value"
          name="range-selector0"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
        >
        </next-range-selector>
        <p>borders = [{{ '{' }}max: 30, min: 5{{ '}' }}, {{ '{' }}max: 60, min: 30{{ '}' }}]:</p>
        <next-range-selector
          [(ngModel)]="value1"
          name="range-selector1"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          [borders]="borders"
          [interval]="10"
          [marks]="true"
          style="display: inline-block; margin-bottom: 30px; width: 100%;"
        >
        </next-range-selector>
        <p>borders = [{{ '{' }}max: 30, min: 5{{ '}' }}, {{ '{' }}max: 60, min: 30{{ '}' }}], process = true:</p>
        <next-range-selector
          [(ngModel)]="value2"
          name="range-selector2"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          [borders]="borders"
          [interval]="10"
          [process]="true"
          [marks]="true"
          style="display: inline-block; margin-bottom: 30px; width: 100%;"
        >
        </next-range-selector>
        <p>
          borders = [{{ '{' }}max: 30, min: 5{{ '}' }}, {{ '{' }}max: 60, min: 30{{ '}' }}], process = true,
          showBorders = false:
        </p>
        <next-range-selector
          [(ngModel)]="value3"
          name="range-selector3"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          [borders]="borders"
          [interval]="10"
          [showBorders]="false"
          [marks]="true"
          style="display: inline-block; margin-bottom: 30px; width: 100%;"
        >
        </next-range-selector>
        <p>
          borders = [{{ '{' }}max: 30, min: 5{{ '}' }}, {{ '{' }}max: 60, min: 30{{ '}' }}], process = false,
          showBorders = false:
        </p>
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
          style="display: inline-block; margin-bottom: 30px; width: 100%;"
        >
        </next-range-selector>
        <p>
          borders = [{{ '{' }}max: 30, min: 5{{ '}' }},
          {{ '{' }}max: 60, min: 30{{ '}' }},
          {{ '{' }}max: 80, min: 60{{ '}' }}], process = false,
          bordersColors = ['red', 'green', 'blue']:
        </p>
        <next-range-selector
          [(ngModel)]="value5"
          name="range-selector5"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          [borders]="borders2"
          [interval]="10"
          [marks]="true"
          [bordersColors]="bordersColors"
          style="display: inline-block; margin-bottom: 30px; width: 100%;"
        >
        </next-range-selector>
      </form>
      <ng-template #dotTpl>
        <div class="slider-dot">
          <div class="slider-dot-handle"></div>
        </div>
      </ng-template>
      <ng-template #markTpl let-mark="value">{{ mark }}</ng-template>
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
    {notes: withDifferentProcessAndBorders},
  )
  .add(
    'Multi-dots',
    () => ({
      template: `
      ${styles}
      <form class="container">
        <b>Multi-dots props</b>
        <p>default view:</p>
        <next-range-selector
          [(ngModel)]="value1"
          name="range-selector1"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          style="display: inline-block; margin-bottom: 30px; width: 100%;"
        >
        </next-range-selector>
        <p>enableCross = false:</p>
        <next-range-selector
          [(ngModel)]="value2"
          name="range-selector2"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          [enableCross]="false"
          style="display: inline-block; margin-bottom: 30px; width: 100%;"
        >
        </next-range-selector>
        <p>minRange = 10, maxRange = 50:</p>
        <next-range-selector
          [(ngModel)]="value3"
          name="range-selector3"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          [minRange]="10"
          [maxRange]="50"
          style="display: inline-block; margin-bottom: 30px; width: 100%;"
        >
        </next-range-selector>
        <p>fixed = true:</p>
        <next-range-selector
          [(ngModel)]="value4"
          name="range-selector4"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          [fixed]="true"
          style="display: inline-block; margin-bottom: 30px; width: 100%;"
        >
        </next-range-selector>
      </form>
      <ng-template #dotTpl>
        <div class="slider-dot">
          <div class="slider-dot-handle"></div>
        </div>
      </ng-template>
      <ng-template #markTpl let-mark="value">{{ mark }}</ng-template>
    `,
      props: {
        value1: [10, 40, 30],
        value2: [10, 30, 40],
        value3: [15, 30],
        value4: [15, 30],
      },
    }),
    {notes: withMultiDots},
  )
  .add(
    'Disable',
    () => ({
      template: `
      ${styles}
      <form class="container">
        <b>Disable</b>
        <p>default view:</p>
        <next-range-selector
          [(ngModel)]="value1"
          name="range-selector1"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          style="display: inline-block; margin-bottom: 30px; width: 100%;"
        >
        </next-range-selector>
        <p>disabled = true:</p>
        <next-range-selector
          [(ngModel)]="value2"
          name="range-selector2"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          [disabled]="true"
          style="display: inline-block; margin-bottom: 30px; width: 100%;"
        >
        </next-range-selector>
        <p>dotDisabled = [false, true]:</p>
        <next-range-selector
          [(ngModel)]="value3"
          name="range-selector3"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          [dotDisabled]="dotDisabled"
          style="display: inline-block; margin-bottom: 30px; width: 100%;"
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
        dotDisabled: [false, true],
      },
    }),
    {notes: withDisable},
  )
  .add(
    'Duration and tabIndex',
    () => ({
      template: `
      ${styles}
      <form class="container">
        <b>Disable</b>
        <p>duration = 0.5 (default), tabIndex = 1 (default):</p>
        <next-range-selector
          [(ngModel)]="value1"
          name="range-selector1"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          [interval]="10"
          [marks]="true"
          style="display: inline-block; margin-bottom: 30px; width: 100%;"
        >
        </next-range-selector>
        <p>duration = 0, tabIndex = 3:</p>
        <next-range-selector
          [(ngModel)]="value2"
          name="range-selector2"
          [dotTpl]="dotTpl"
          [tabIndex]="3"
          [markTpl]="markTpl"
          [duration]="0"
          [interval]="10"
          [marks]="true"
          style="display: inline-block; margin-bottom: 30px; width: 100%;"
        >
        </next-range-selector>
        <p>duration = 1, tabIndex = 4:</p>
        <next-range-selector
          [(ngModel)]="value3"
          name="range-selector3"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          [tabIndex]="4"
          [duration]="1"
          [interval]="10"
          [marks]="true"
          style="display: inline-block; margin-bottom: 30px; width: 100%;"
        >
        </next-range-selector>
        <p>duration = 2, tabIndex = 2:</p>
        <next-range-selector
          [(ngModel)]="value4"
          name="range-selector4"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          [tabIndex]="2"
          [duration]="2"
          [interval]="10"
          [marks]="true"
          style="display: inline-block; margin-bottom: 30px; width: 100%;"
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
    {notes: withDifferentDurationAndTabIndexes},
  )
  .add(
    'Diff styles',
    () => ({
      template: `
      <style>
        .slider-dot-rocket \{
          cursor: pointer;
          font-size: 16px;
        \}
        .slider-mark \{
          font-size: 16px;
        \}
      </style>
      ${styles}
      <form class="container">
        <b>Custom styles</b>
        <p>To see which styles were used for this example please read Notes</p>
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
      <ng-template #markTpl let-mark="value">
        <div class="slider-mark">{{ mark }}</div>
      </ng-template>
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
    {notes: withDifferentStyles},
  );
