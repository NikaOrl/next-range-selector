import {storiesOf} from '@storybook/angular';
import {NextRangeSelectorComponent, NextRangeSelectorModule} from '../../projects/next-range-selector/src/public_api';
import {withNotes} from '@storybook/addon-notes';
import {withKnobs} from '@storybook/addon-knobs';
import * as marked from 'marked';
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

storiesOf('next-datepicker', module)
  .addDecorator(withKnobs)
  .add(
    'Install',
    withNotes({text: marked(defaultText)})(() => ({
      moduleMetadata: {
        declarations: [NextRangeSelectorComponent],
      },
      template: `
      ${styles}
      <form class="datepicker-form">
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
    })),
  )
  .add(
    'Diff directions',
    withNotes({text: marked(defaultText)})(() => ({
      moduleMetadata: {
        declarations: [NextRangeSelectorComponent],
      },
      template: `
      ${styles}
      <form class="datepicker-form">
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
    })),
  )
  .add(
    'Diff marks and data',
    withNotes({text: marked(defaultText)})(() => ({
      moduleMetadata: {
        declarations: [NextRangeSelectorComponent],
      },
      template: `
      ${styles}
      <form class="datepicker-form">
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
    })),
  )
  .add(
    'Diff process and borders',
    withNotes({text: marked(defaultText)})(() => ({
      moduleMetadata: {
        declarations: [NextRangeSelectorComponent],
      },
      template: `
      ${styles}
      <form class="datepicker-form">
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
        Добавить про цвета бордеров
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
        borders: [{max: 30, min: 5}, {max: 60, min: 30}],
      },
    })),
  )
  .add(
    'Multi-dots',
    withNotes({text: marked(defaultText)})(() => ({
      moduleMetadata: {
        declarations: [NextRangeSelectorComponent],
      },
      template: `
      ${styles}
      <form class="datepicker-form">
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
    })),
  )
  .add(
    'Disabled',
    withNotes({text: marked(defaultText)})(() => ({
      moduleMetadata: {
        declarations: [NextRangeSelectorComponent],
      },
      template: `
      ${styles}
      <form class="datepicker-form">
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
        Показать как прокинуть стили для dot-disabled
      </form>
      <ng-template #dotTpl>
        <div class="slider-dot">
          <div class="slider-dot-handle"></div>
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
    })),
  )
  .add(
    'Duration and tabIndex',
    withNotes({text: marked(defaultText)})(() => ({
      moduleMetadata: {
        declarations: [NextRangeSelectorComponent],
      },
      template: `
      ${styles}
      <form class="datepicker-form">
      0.5 duration (default), tabIndex 2:
        <next-range-selector
          [(ngModel)]="value1"
          name="range-selector1"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          [tabIndex]="2"
          [interval]="10"
          [marks]="true"
          style="display: inline-block; margin: 30px 0; width: 100%;"
        >
        </next-range-selector>
        0 duration, tabIndex 1 (default):
        <next-range-selector
          [(ngModel)]="value2"
          name="range-selector2"
          [dotTpl]="dotTpl"
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
        2 duration, tabIndex 3:
        <next-range-selector
          [(ngModel)]="value4"
          name="range-selector4"
          [dotTpl]="dotTpl"
          [markTpl]="markTpl"
          [tabIndex]="3"
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
    })),
  )
  .add(
    'Diff styles',
    withNotes({text: marked(defaultText)})(() => ({
      moduleMetadata: {
        declarations: [NextRangeSelectorComponent],
      },
      template: `
      <style>
        .slider-dot-rocket \{
          cursor: pointer;
        \}
      </style>
      ${styles}
      <form class="datepicker-form">
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
        >
        </next-range-selector>
      </form>
      {{focus}}
      <ng-template #dotTpl let-focus="focus">
        <div class="slider-dot">
          <div class="slider-dot-rocket" [attr.focus]="focus"
          [ngStyle]="focus ? {'outline': 'red auto 5px'}: {}">🚀{{focus}}</div>
        </div>
      </ng-template>
      <ng-template #markTpl let-mark="value">{{ mark }} </ng-template>
    `,
      props: {
        focus: false,
        value: 10,
        railStyle: {'background-color': 'pink'},
        processStyle: {'background-color': 'green'},
        markStepStyle: {'background-color': 'red'},
      },
    })),
  );
