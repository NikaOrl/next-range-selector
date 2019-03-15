import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'next-range-selector',
  templateUrl: './next-range-selector.component.html',
  styleUrls: ['./next-range-selector.component.scss']
})
export class NextRangeSelectorComponent implements OnInit {
  value = 10;
  constructor() {}
  displayValue = 10;
  ngOnInit() {}

  clickHandle(e: MouseEvent | TouchEvent) {
    console.log(e);
  }
}
