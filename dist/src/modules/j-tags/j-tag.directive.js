import { Directive, Input, forwardRef, HostListener, Renderer, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
// tslint:disable
var SKY_JTAG_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return JTagInputDirective; }),
    multi: true
};
var SKY_JTAG_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(function () { return JTagInputDirective; }),
    multi: true
};
// tslint:enable
var JTagInputDirective = (function () {
    function JTagInputDirective(renderer, elRef) {
        this.renderer = renderer;
        this.elRef = elRef;
        /*istanbul ignore next */
        this._onChange = function (_) { };
        /*istanbul ignore next */
        this._onTouched = function () { };
        this._validatorChange = function () { };
    }
    JTagInputDirective.prototype.ngOnInit = function () {
        this.renderer.setElementClass(this.elRef.nativeElement, 'sky-form-control', true);
    };
    JTagInputDirective.prototype.ngOnDestroy = function () {
        this.pickerChangedSubscription.unsubscribe();
    };
    JTagInputDirective.prototype.ngOnChanges = function (changes) {
    };
    JTagInputDirective.prototype.onChange = function (event) {
        var newValue = event.target.value;
        this.modelValue = newValue;
        this._validatorChange();
        this._onChange(this.modelValue);
        this.writeModelValue(this.modelValue);
    };
    JTagInputDirective.prototype.onBlur /* istanbul ignore next */ = function () {
        this._onTouched();
    };
    JTagInputDirective.prototype.registerOnChange = function (fn) { this._onChange = fn; };
    JTagInputDirective.prototype.registerOnTouched = function (fn) { this._onTouched = fn; };
    JTagInputDirective.prototype.registerOnValidatorChange = function (fn) { this._validatorChange = fn; };
    JTagInputDirective.prototype.writeValue = function (value) {
        this.modelValue = value;
        this.writeModelValue(this.modelValue);
    };
    JTagInputDirective.prototype.validate = function (control) {
        var value = control.value;
        if (!value) {
            return undefined;
        }
        /* istanbul ignore next */
        if (value.local === 'error') {
            return {
                'jTags': {
                    invalid: control.value
                }
            };
        }
        return undefined;
    };
    JTagInputDirective.prototype.writeModelValue = function (model) {
        var setElementValue;
        if (model) {
            /* istanbul ignore next */
            this.renderer.setElementProperty(this.elRef.nativeElement, 'value', setElementValue);
        }
        this.jTagInput.selectedTags = model;
    };
    return JTagInputDirective;
}());
export { JTagInputDirective };
JTagInputDirective.decorators = [
    { type: Directive, args: [{
                selector: '[jtagInput]',
                providers: [
                    SKY_JTAG_VALUE_ACCESSOR,
                    SKY_JTAG_VALIDATOR
                ]
            },] },
];
/** @nocollapse */
JTagInputDirective.ctorParameters = function () { return [
    { type: Renderer, },
    { type: ElementRef, },
]; };
JTagInputDirective.propDecorators = {
    'jTagInput': [{ type: Input },],
    'returnFormat': [{ type: Input },],
    'onChange': [{ type: HostListener, args: ['change', ['$event'],] },],
    'onBlur': [{ type: HostListener, args: ['blur',] },],
};
//# sourceMappingURL=j-tag.directive.js.map