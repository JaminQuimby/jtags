import {
    Component,
    Input,
    Output,
    EventEmitter,
    TemplateRef,
    ElementRef,
    HostListener,
    HostBinding,
    ViewChild,
    ChangeDetectorRef,
    Renderer2
} from '@angular/core';

import { TagModel } from '../../core';
import { JTagRippleComponent } from '../j-tag';

// angular universal hacks
/* tslint:disable-next-line */
const KeyboardEvent = (global as any).KeyboardEvent;
const MouseEvent = (global as any).MouseEvent;

// mocking navigator
const navigator = typeof window !== 'undefined' ? window.navigator : {
    userAgent: 'Chrome',
    vendor: 'Google Inc'
};

const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

@Component({
    selector: 'j-tag',
    templateUrl: './j-tag.template.html',
    styleUrls: ['./j-tag-component.style.scss']
})
export class JTagComponent {

    @Input() public model: TagModel;
    @Input() public removable: boolean;
    @Input() public editable: boolean;
    @Input() public template: TemplateRef<any>;
    @Input() public displayBy: string;
    @Input() public identifyBy: string;
    @Input() public index: number;
    @Input() public hasRipple: boolean;
    @Input() public disabled = false;

    @Output() public onSelect: EventEmitter<TagModel> = new EventEmitter<TagModel>();
    @Output() public onRemove: EventEmitter<TagModel> = new EventEmitter<TagModel>();
    @Output() public onBlur: EventEmitter<TagModel> = new EventEmitter<TagModel>();
    @Output() public onKeyDown: EventEmitter<any> = new EventEmitter<any>();
    @Output() public onTagEdited: EventEmitter<TagModel> = new EventEmitter<TagModel>();

    public get readonly(): boolean {
        return typeof this.model !== 'string' && this.model.readonly === true;
    }

    public editing = false;

    @HostBinding('class.moving') public moving: boolean;

    public rippleState = 'none';

    @ViewChild(JTagRippleComponent) public ripple: JTagRippleComponent;

    constructor(public element: ElementRef,
        public renderer: Renderer2,
        private cdRef: ChangeDetectorRef) { }

    public select($event?: MouseEvent): void {
        if (this.readonly || this.disabled) {
            return;
        }

        if ($event) {
            $event.stopPropagation();
        }

        this.focus();

        this.onSelect.emit(this.model);
    }

    public remove($event: MouseEvent): void {
        $event.stopPropagation();
        this.onRemove.emit(this);
    }

    public focus(): void {
        this.element.nativeElement.focus();
    }

    public move(): void {
        this.moving = true;
    }

    @HostListener('keydown', ['$event'])
    public keydown(event: KeyboardEvent): void {
        if (this.editing) {
            if (event.keyCode === 13) { this.disableEditMode(event); }
            return;
        }

        this.onKeyDown.emit({ event, model: this.model });
    }

    public blink(): void {
        const classList = this.element.nativeElement.classList;
        classList.add('blink');

        setTimeout(() => classList.remove('blink'), 50);
    }

    public toggleEditMode(): void {
        if (this.editable) {
            if (!this.editing) { this.activateEditMode(); }
        }
    }

    public onBlurred(event: any): void {
        // Checks if it is editable first before handeling the onBlurred event in order to prevent
        // a bug in IE where tags are still editable with onlyFromAutocomplete set to true
        if (!this.editable) {
            return;
        }

        const value: string = event.target.innerText;
        const result = typeof this.model === 'string' ? value :
            { [this.identifyBy]: value, [this.displayBy]: value };

        this.disableEditMode();

        this.onBlur.emit(result);
    }

    public getDisplayValue(item: TagModel): string {
        return typeof item === 'string' ? item : item[this.displayBy];
    }

    public get isRippleVisible(): boolean {
        return !this.readonly &&
            !this.editing &&
            isChrome &&
            this.hasRipple;
    }

    private getContentEditableText(): string {
        const input = this.getContentEditable();

        return input ? input.innerText.trim() : '';
    }

    private setContentEditableText(model: TagModel) {
        const input = this.getContentEditable();
        const value = this.getDisplayValue(model);

        input.innerText = value;
    }

    private activateEditMode(): void {
        const classList = this.element.nativeElement.classList;
        classList.add('tag--editing');

        this.editing = true;
    }

    private disableEditMode($event?: KeyboardEvent): void {
        const classList = this.element.nativeElement.classList;
        const input = this.getContentEditableText();

        this.editing = false;
        classList.remove('tag--editing');

        if (!input) {
            this.setContentEditableText(this.model);
            return;
        }

        this.storeNewValue(input);
        this.cdRef.detectChanges();

        if ($event) {
            $event.preventDefault();
        }
    }

    private storeNewValue(input: string): void {
        const exists = (model: TagModel) => {
            return typeof model === 'string' ?
                model === input :
                model[this.displayBy] === input;
        };

        // if the value changed, replace the value in the model
        if (exists(this.model) === false) {
            const model = typeof this.model === 'string' ? input :
                { [this.identifyBy]: input, [this.displayBy]: input };

            // emit output
            this.model = model;
            this.onTagEdited.emit(model);
        }
    }

    private getContentEditable(): HTMLInputElement {
        return this.element.nativeElement.querySelector('[contenteditable]');
    }

    private isDeleteIconVisible(): boolean {
        return !this.readonly &&
            !this.disabled &&
            this.removable &&
            !this.editing;
    }
}
