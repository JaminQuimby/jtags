import { NgModule } from '@angular/core';

import { JTagModule } from './modules/j-tags';

export * from './modules/j-tags';
@NgModule({
  exports: [
    JTagModule
  ]
})
export class LibraryModule { }
