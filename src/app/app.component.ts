import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public title = 'next-range-selector-project';
  public value = 10;
  public value2 = [10, 40];
  public value3 = [10, 40];
  public value4 = [10, 40];
  public value5 = [10, 40];
  public borders = [{max: 30, min: 5}, {max: 50, min: 30}];
}
