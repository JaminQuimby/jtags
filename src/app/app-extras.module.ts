import { NgModule } from '@angular/core';

import { SkyAppConfig } from '@blackbaud/skyux-builder/runtime';
import { JTagInputModule } from './public/src/modules/components/j-tag-input/j-tag-input.module';
import { JTagDemoModule } from './public/src/modules/components/j-tag-demo';
import { JTagDemoService } from './public/src/modules/components/j-tag-demo';

// Specify entry components, module-level providers, etc. here.
@NgModule({
  imports: [
    JTagDemoModule
  ],
  exports: [
    JTagInputModule
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
