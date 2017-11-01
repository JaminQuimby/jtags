import { NgModule } from '@angular/core';
import { LibrarySampleModule } from './modules/sample';
import { LibrarySharedModule } from './modules/shared';
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
                    LibrarySharedModule
                ]
            },] },
];
/** @nocollapse */
LibraryModule.ctorParameters = function () { return []; };
//# sourceMappingURL=library.module.js.map