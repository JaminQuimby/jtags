import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JTagComponent } from './j-tag.component';
import { JTagInputDirective } from './j-tag.directive';
var JTagModule = (function () {
    function JTagModule() {
    }
    return JTagModule;
}());
export { JTagModule };
JTagModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    JTagComponent,
                    JTagInputDirective
                ],
                imports: [
                    CommonModule
                ],
                exports: [
                    JTagComponent,
                    JTagInputDirective
                ]
            },] },
];
/** @nocollapse */
JTagModule.ctorParameters = function () { return []; };
//# sourceMappingURL=j-tag.module.js.map