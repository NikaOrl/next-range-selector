import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {NextRangeSelectorModule} from '../../projects/next-range-selector/src/public_api';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, NextRangeSelectorModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
