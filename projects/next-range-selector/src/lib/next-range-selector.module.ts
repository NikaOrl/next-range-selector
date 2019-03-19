import { NgModule } from '@angular/core';
import { NextRangeSelectorComponent } from './next-range-selector.component';
import { CommonModule } from '@angular/common';
import { NextRangeSelectorDotModule } from '../../../next-range-selector-dot/src/public_api';

@NgModule({
  declarations: [NextRangeSelectorComponent],
  imports: [NextRangeSelectorDotModule, CommonModule],
  exports: [NextRangeSelectorComponent]
})
export class NextRangeSelectorModule {}
