import { NgModule } from '@angular/core';
import { LibraryConfigService } from './config.service';
import { JTagService } from '../j-tags/j-tag.service';
var LibrarySharedModule = (function () {
    function LibrarySharedModule() {
    }
    return LibrarySharedModule;
}());
export { LibrarySharedModule };
LibrarySharedModule.decorators = [
    { type: NgModule, args: [{
                providers: [
                    LibraryConfigService,
                    JTagService
                ]
            },] },
];
/** @nocollapse */
LibrarySharedModule.ctorParameters = function () { return []; };
//# sourceMappingURL=shared.module.js.map