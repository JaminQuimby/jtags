import { Injectable } from '@angular/core';
var LibraryConfigService = (function () {
    function LibraryConfigService() {
        this.skyux = {
            app: {
                title: ''
            }
        };
        this.runtime = {
            routes: []
        };
    }
    return LibraryConfigService;
}());
export { LibraryConfigService };
LibraryConfigService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
LibraryConfigService.ctorParameters = function () { return []; };
//# sourceMappingURL=config.service.js.map