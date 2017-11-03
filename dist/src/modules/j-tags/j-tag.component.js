import { Component } from '@angular/core';
import { JTagService } from './j-tag.service';
var JTagComponent = (function () {
    function JTagComponent(service) {
        this.service = service;
    }
    return JTagComponent;
}());
export { JTagComponent };
JTagComponent.decorators = [
    { type: Component, args: [{
                selector: 'j-tag',
                template: "<div class=\"lib-sample\">\n  Hello, {{ service.skyux.appSettings.myLibrary.name }}!\n</div>\n\n\n",
                styles: [""]
            },] },
];
/** @nocollapse */
JTagComponent.ctorParameters = function () { return [
    { type: JTagService, },
]; };
//# sourceMappingURL=j-tag.component.js.map