import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'lib-next-range-selector-dot',
  templateUrl: './next-range-selector-dot.component.html',
  styleUrls: ['./next-range-selector-dot.component.scss'],
})
export class NextRangeSelectorDotComponent {
  @Input() value: number;
  @Input() disabled: boolean;
}
