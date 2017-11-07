import { NgModule } from '@angular/core';

import { SkyAppConfig } from '@blackbaud/skyux-builder/runtime';

import { JTagModule } from './public/src/modules/j-tags';
import { JTagService } from './public/src/modules/j-tags';

// Specify entry components, module-level providers, etc. here.
@NgModule({
  imports: [
    JTagModule
  ],
  exports: [
    JTagModule
  ],
  providers: [
    // The config service acts as an adaptor for skyuxconfig.json:
    {
      provide: JTagService,
      useExisting: SkyAppConfig
    }
  ],
  entryComponents: []
})
export class AppExtrasModule { }
