import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public title = 'next-range-selector-project';
  public value = 'b';
  public value2 = [10, 40];
  public value3 = [10, 40];
  public value4 = [10, 40, 30];
  public value5 = [10, 40];
  public borders = [{max: 30, min: 5}, {max: 50, min: 30}, {max: 100, min: 0}];
  public dotOptions = [{disabled: false}, {disabled: true}];
  public data = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  public marks = [0, 10, 40, 60, 80, 100];
}
