import {Component} from '@angular/core';
import {RangeSelectorDirection} from 'projects/next-range-selector/src/public_api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public value = 10;

  public get RangeSelectorDirection() {
    return RangeSelectorDirection;
  }
}
