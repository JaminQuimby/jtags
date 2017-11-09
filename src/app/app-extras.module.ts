import { NgModule } from '@angular/core';

import { SkyAppConfig } from '@blackbaud/skyux-builder/runtime';

import { JTagModule } from './public/src/modules/j-tag-demo';
import { JTagDemoService } from './public/src/modules/j-tag-demo';

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
      provide: JTagDemoService,
      useExisting: SkyAppConfig
    }
  ],
  entryComponents: []
})
export class AppExtrasModule { }
