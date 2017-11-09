import { NgModule } from '@angular/core';

import { SkyAppConfig } from '@blackbaud/skyux-builder/runtime';

import { JTagDemoModule } from './public/src/modules';
import { JTagDemoService } from './public/src/modules';

// Specify entry components, module-level providers, etc. here.
@NgModule({
  imports: [
    JTagDemoModule
  ],
  exports: [
    JTagDemoModule
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
