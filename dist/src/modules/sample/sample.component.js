import { Component } from '@angular/core';
import { LibraryConfigService } from '../shared';
var LibrarySampleComponent = (function () {
    function LibrarySampleComponent(configService) {
        this.configService = configService;
    }
    return LibrarySampleComponent;
}());
export { LibrarySampleComponent };
LibrarySampleComponent.decorators = [
    { type: Component, args: [{
                selector: 'lib-sample',
                template: "<div class=\"lib-sample\">\n  Hello, {{ configService.skyux.appSettings.myLibrary.name }}!\n</div>\n",
                styles: [".lib-sample{color:red}\n"]
            },] },
];
/** @nocollapse */
LibrarySampleComponent.ctorParameters = function () { return [
    { type: LibraryConfigService, },
]; };
//# sourceMappingURL=sample.component.js.map