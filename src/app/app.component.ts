import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public title = 'next-range-selector-project';
  public value = {dotValue: 10};
  public value2 = [{dotValue: 10, max: 30, min: 5}, {dotValue: 40, max: 50, min: 40}];
}
