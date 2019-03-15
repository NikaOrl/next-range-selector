import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NextRangeSelectorModule } from 'next-range-selector';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, NextRangeSelectorModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
