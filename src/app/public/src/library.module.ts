import { NgModule } from '@angular/core';

import { JTagModule } from './modules/j-tags';
import { JTagService } from './modules/j-tags';
import { JTagComponent } from './modules/j-tags';
import { JTagInputDirective } from './modules/j-tags';
export * from './modules/j-tags';

@NgModule({
  exports: [
    JTagModule,
    JTagService,
    JTagComponent,
    JTagInputDirective
  ]
})
export class LibraryModule { }
