import { NgModule } from '@angular/core';

import { LibrarySampleModule } from './modules/sample';
import { LibrarySharedModule } from './modules/shared';
import { JTagModule } from './modules/j-tags';
export * from './modules/shared';

@NgModule({
  exports: [
    LibrarySampleModule,
    LibrarySharedModule,
    JTagModule
  ]
})
export class LibraryModule { }
