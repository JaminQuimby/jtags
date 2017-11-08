import { Component, EventEmitter, Input, Output, ViewChild, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

@Component({
    selector: 'j-tag-input-form',
    styleUrls: ['./j-tag-input-form.style.scss'],
    templateUrl: './j-tag-input-form.template.html'
})
export class JTagInputFormComponent implements OnInit {

    @Output() public onSubmit: EventEmitter<any> = new EventEmitter();
    @Output() public onBlur: EventEmitter<any> = new EventEmitter();
    @Output() public onFocus: EventEmitter<any> = new EventEmitter();
    @Output() public onKeyup: EventEmitter<any> = new EventEmitter();
    @Output() public onKeydown: EventEmitter<any> = new EventEmitter();

    @Input() public placeholder: string;
    @Input() public validators: ValidatorFn[] = [];
    @Input() public asyncValidators: AsyncValidatorFn[] = [];
    @Input() public inputId: string;
    @Input() public inputClass: string;
    @Input() public get inputText(): string { return this.inputTextValue; }
    @Input() public tabindex: string = '';
    @Input() public disabled: boolean = false;

    public set inputText(text: string) {
        this.inputTextValue = text;
        this.inputTextChange.emit(text);
    }

    @ViewChild('input') public input: any;

    public form: FormGroup;

    @Output() public inputTextChange: EventEmitter<string> = new EventEmitter();

    public inputTextValue: string = '';

    public ngOnInit() {
        // creating form
        this.form = new FormGroup({
            item: new FormControl({ value: '', disabled: this.disabled }, this.validators, this.asyncValidators)
        });
    }

    public get value(): AbstractControl | null {
        return this.form.get('item');
    }

    public isInputFocused(): boolean {
        return document.activeElement === this.input.nativeElement;
    }

    public getErrorMessages(messages: any): string[] {
        const value = this.value;

        return value ? Object.keys(messages)
            .filter(err => value.hasError(err))
            .map(err => messages[err]) : [];
    }

    public hasErrors(): boolean {
        return this.form.dirty &&
            this.form.value.item &&
            this.form.invalid;
    }

    public focus(): void {
        this.input.nativeElement.focus();
    }

    public blur(): void {
        this.input.nativeElement.blur();
    }

    public getElementPosition(): ClientRect {
        return this.input.nativeElement.getBoundingClientRect();
    }

    public destroy(): void {
        const input = this.input.nativeElement;
        input.parentElement.removeChild(input);
    }

    public onKeyDown($event: any) {
        return this.onKeydown.emit($event);
    }

    public submit($event: any): void {
        this.onSubmit.emit($event);
    }
}
