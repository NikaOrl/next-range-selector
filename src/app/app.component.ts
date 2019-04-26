import {Component} from '@angular/core';
import {RangeSelectorDirection} from 'projects/next-range-selector/src/public_api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public value = 'b';
  public value2 = [10, 40];
  public value3 = [10, 40];
  public value45 = [10, 40, 30];
  public borders = [{max: 30, min: 5}, {max: 60, min: 30}];
  public data = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  public marks = [0, 10, 40, 60, 80, 100];
  public value10 = -10;

  public get RangeSelectorDirection() {
    return RangeSelectorDirection;
  }
}
