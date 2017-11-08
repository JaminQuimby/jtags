import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JTagComponent } from './j-tag.component';
import { JTagInputDirective } from './j-tag.directive';
import { JTagInputModule } from '../tag-input.module';
@NgModule({
  declarations: [
    JTagComponent,
    JTagInputDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    JTagInputModule
  ],
  exports: [
    JTagComponent,
    JTagInputDirective
  ]
})
export class JTagModule { }
