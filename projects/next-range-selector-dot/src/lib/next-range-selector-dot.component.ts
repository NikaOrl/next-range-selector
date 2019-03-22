import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'next-range-selector-dot',
  templateUrl: './next-range-selector-dot.component.html',
  styleUrls: ['./next-range-selector-dot.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NextRangeSelectorDotComponent {
  @Input() value: number;
  @Input() disabled: boolean;
}
