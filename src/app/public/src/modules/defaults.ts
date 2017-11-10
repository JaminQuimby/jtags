import { Observable } from 'rxjs/Observable';
import { ValidatorFn, AsyncValidatorFn } from '@angular/forms';

import { SECONDARY_PLACEHOLDER, PLACEHOLDER } from './core/constants';
import { JTagModel } from './core';

export interface JTagInputOptions {
    separatorKeys: string[];
    separatorKeyCodes: number[];
    maxItems: number;
    placeholder: string;
    secondaryPlaceholder: string;
    validators: ValidatorFn[];
    asyncValidators: AsyncValidatorFn[];
    onlyFromAutocomplete: boolean;
    errorMessages: { [key: string]: string; };
    theme: string;
    onTextChangeDebounce: number;
    inputId: string;
    inputClass: string;
    clearOnBlur: boolean;
    hideForm: boolean;
    addOnBlur: boolean;
    addOnPaste: boolean;
    pasteSplitPattern: string;
    blinkIfDupe: boolean;
    removable: boolean;
    editable: boolean;
    allowDupes: boolean;
    modelAsStrings: boolean;
    trimTags: boolean;
    ripple: boolean;
    tabIndex: string;
    disable: boolean;
    dragZone: string;
    onRemoving?: (tag: JTagModel) => Observable<JTagModel>;
    onAdding?: (tag: JTagModel) => Observable<JTagModel>;
    displayBy: string;
    identifyBy: string;
    animationDuration: {
        enter: string,
        leave: string
    };
}

export const defaults = {
    tagInput: <JTagInputOptions>{
        separatorKeys: [],
        separatorKeyCodes: [],
        maxItems: Infinity,
        placeholder: PLACEHOLDER,
        secondaryPlaceholder: SECONDARY_PLACEHOLDER,
        validators: [],
        asyncValidators: [],
        onlyFromAutocomplete: false,
        errorMessages: {},
        theme: '',
        onTextChangeDebounce: 250,
        inputId: '',
        inputClass: '',
        clearOnBlur: false,
        hideForm: false,
        addOnBlur: false,
        addOnPaste: false,
        pasteSplitPattern: ',',
        blinkIfDupe: true,
        removable: true,
        editable: false,
        allowDupes: false,
        modelAsStrings: false,
        trimTags: true,
        ripple: true,
        tabIndex: '',
        disable: false,
        dragZone: '',
        onRemoving: undefined,
        onAdding: undefined,
        displayBy: 'display',
        identifyBy: 'value',
        animationDuration: {
            enter: '250ms',
            leave: '150ms'
        }
    }
};