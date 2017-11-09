import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JTagDemoComponent } from './j-tag-demo.component';
import { JTagDemoInputDirective } from './j-tag-demo.directive';
import { JTagInputModule } from '../j-tag-input/j-tag-input.module';

@NgModule({
  declarations: [
    JTagDemoComponent,
    JTagDemoInputDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    JTagInputModule
  ],
  exports: [
    JTagDemoComponent,
    JTagDemoInputDirective
  ]
})
export class JTagDemoModule { }
