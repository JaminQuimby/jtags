import { NgModule } from '@angular/core';

import { JTagInputModule } from './public/src/modules/components/j-tag-input/j-tag-input.module';

// Specify entry components, module-level providers, etc. here.
@NgModule({
  imports: [  JTagInputModule],
  exports: [
    JTagInputModule
  ],
  providers: [
  ],
  entryComponents: []
})
export class AppExtrasModule { }
