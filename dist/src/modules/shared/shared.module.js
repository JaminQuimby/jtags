import { NgModule } from '@angular/core';
import { LibraryConfigService } from './config.service';
var LibrarySharedModule = (function () {
    function LibrarySharedModule() {
    }
    return LibrarySharedModule;
}());
export { LibrarySharedModule };
LibrarySharedModule.decorators = [
    { type: NgModule, args: [{
                providers: [
                    LibraryConfigService
                ]
            },] },
];
/** @nocollapse */
LibrarySharedModule.ctorParameters = function () { return []; };
//# sourceMappingURL=shared.module.js.map