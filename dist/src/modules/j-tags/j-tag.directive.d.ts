import { OnInit, OnDestroy, Renderer, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { JTagComponent } from './j-tag.component';
import { ControlValueAccessor, Validator, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
export declare class JTagInputDirective implements OnInit, OnDestroy, ControlValueAccessor, Validator, OnChanges {
    private renderer;
    private elRef;
    pickerChangedSubscription: Subscription;
    jTagInput: JTagComponent;
    returnFormat: string;
    private modelValue;
    constructor(renderer: Renderer, elRef: ElementRef);
    ngOnInit(): void;
    ngOnDestroy(): void;
    ngOnChanges(changes: SimpleChanges): void;
    onChange(event: any): void;
    onBlur(): void;
    registerOnChange(fn: (value: any) => any): void;
    registerOnTouched(fn: () => any): void;
    registerOnValidatorChange(fn: () => void): void;
    writeValue(value: any): void;
    validate(control: AbstractControl): {
        [key: string]: any;
    };
    private writeModelValue(model);
    private _onChange;
    private _onTouched;
    private _validatorChange;
}
