import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JTagComponent } from './j-tag.component';
import { JTagInputDirective } from './j-tag.directive';
@NgModule({
  declarations: [
    JTagComponent,
    JTagInputDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    JTagComponent,
    JTagInputDirective
  ]
})
export class JTagModule { }
