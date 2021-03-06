import {
  Directive,
  Input,
  OnInit,
  OnDestroy,
  forwardRef,
  HostListener,
  Renderer,
  ElementRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { JTagDemoInputInterface, JTagDemoOutputInterface } from './j-tag-demo.interface';
import { JTagDemoComponent } from './j-tag-demo.component';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  Validator,
  NG_VALIDATORS,
  AbstractControl
} from '@angular/forms';

import {
  Subscription
} from 'rxjs/Subscription';

// tslint:disable
const SKY_JTAG_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => JTagDemoInputDirective),
  multi: true
};

const SKY_JTAG_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => JTagDemoInputDirective),
  multi: true
};
// tslint:enable
@Directive({
  selector: '[jTagInputData]',
  providers: [
    SKY_JTAG_VALUE_ACCESSOR,
    SKY_JTAG_VALIDATOR
  ]
})
export class JTagDemoInputDirective implements
  OnInit, OnDestroy, ControlValueAccessor, Validator, OnChanges {

  public pickerChangedSubscription: Subscription;

  @Input()
  public jTagInputData: JTagDemoComponent;

  @Input()
  public returnFormat: string;
  private modelValue: JTagDemoOutputInterface;
  public constructor(private renderer: Renderer, private elRef: ElementRef) {
  }

  public ngOnInit() {
    this.renderer.setElementClass(this.elRef.nativeElement, 'sky-form-control', true);
  }
  public ngOnDestroy() {
    this.pickerChangedSubscription.unsubscribe();
  }

  public ngOnChanges(changes: SimpleChanges) {
  }

  @HostListener('change', ['$event'])
  public onChange(event: any) {
    let newValue = event.target.value;
    this.modelValue = newValue;
    this._validatorChange();
    this._onChange(this.modelValue);
    this.writeModelValue(this.modelValue);
  }

  @HostListener('blur')
  public onBlur /* istanbul ignore next */() {
    this._onTouched();
  }

  public registerOnChange(fn: (value: any) => any): void { this._onChange = fn; }
  public registerOnTouched(fn: () => any): void { this._onTouched = fn; }
  public registerOnValidatorChange(fn: () => void): void { this._validatorChange = fn; }

  public writeValue(value: any) {
    this.modelValue = value;
    this.writeModelValue(this.modelValue);
  }
  public validate(control: AbstractControl): { [key: string]: any } {
    let value = control.value;
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
  }
  private writeModelValue(model: JTagDemoInputInterface) {
    let setElementValue: string;
    if (model) {
      /* istanbul ignore next */
      this.renderer.setElementProperty(this.elRef.nativeElement, 'value', setElementValue);
    }
    this.jTagInputData.selectedTags = model;
  }

  /*istanbul ignore next */
  private _onChange = (_: any) => { };
  /*istanbul ignore next */
  private _onTouched = () => { };
  private _validatorChange = () => { };

}
