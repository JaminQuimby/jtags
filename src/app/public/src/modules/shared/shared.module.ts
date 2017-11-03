import { NgModule } from '@angular/core';

import { LibraryConfigService } from './config.service';
import { JTagService } from '../j-tags/j-tag.service';

@NgModule({
  providers: [
    LibraryConfigService,
    JTagService
  ]
})

export class LibrarySharedModule { }
