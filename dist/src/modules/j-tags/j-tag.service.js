import { Injectable } from '@angular/core';
var JTagService = (function () {
    function JTagService() {
        this.skyux = {
            app: {
                title: ''
            }
        };
        this.runtime = {
            routes: []
        };
    }
    return JTagService;
}());
export { JTagService };
JTagService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
JTagService.ctorParameters = function () { return []; };
//# sourceMappingURL=j-tag.service.js.map