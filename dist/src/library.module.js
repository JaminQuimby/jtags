import { NgModule } from '@angular/core';
import { LibrarySampleModule } from './modules/sample';
import { LibrarySharedModule } from './modules/shared';
import { JTagModule } from './modules/j-tags';
export * from './modules/shared';
var LibraryModule = (function () {
    function LibraryModule() {
    }
    return LibraryModule;
}());
export { LibraryModule };
LibraryModule.decorators = [
    { type: NgModule, args: [{
                exports: [
                    LibrarySampleModule,
                    LibrarySharedModule,
                    JTagModule
                ]
            },] },
];
/** @nocollapse */
LibraryModule.ctorParameters = function () { return []; };
//# sourceMappingURL=library.module.js.map