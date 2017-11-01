import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibrarySampleComponent } from './sample.component';
var LibrarySampleModule = (function () {
    function LibrarySampleModule() {
    }
    return LibrarySampleModule;
}());
export { LibrarySampleModule };
LibrarySampleModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    LibrarySampleComponent
                ],
                imports: [
                    CommonModule
                ],
                exports: [
                    LibrarySampleComponent
                ]
            },] },
];
/** @nocollapse */
LibrarySampleModule.ctorParameters = function () { return []; };
//# sourceMappingURL=sample.module.js.map