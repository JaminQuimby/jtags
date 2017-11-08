// angular
import {
    Component,
    forwardRef,
    HostBinding,
    Input,
    Output,
    EventEmitter,
    Renderer2,
    ViewChild,
    ViewChildren,
    ContentChildren,
    ContentChild,
    OnInit,
    TemplateRef,
    QueryList,
    AfterViewInit,
    Type
} from '@angular/core';

import {
    AsyncValidatorFn,
    FormControl,
    NG_VALUE_ACCESSOR,
    ValidatorFn
} from '@angular/forms';

// rx
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

// ng2-tag-input
import {
    TagInputAccessor,
    TagModel,
    listen,
    constants
} from '../../core';

import {
    DragProvider,
    DraggedTag,
    OptionsProvider,
    TagInputOptions
} from '../../core/providers';

import {
    JTagInputFormComponent,
    JTagInputDropdownComponent,
    JTagComponent
} from '../../components';

import { animations } from './animations';

// angular universal hacks
const DragEvent = (global as any).DragEvent;

// tslint:disable
const CUSTOM_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => JTagInputComponent),
    multi: true
};
const defaults: Type<TagInputOptions> = forwardRef(() => OptionsProvider.defaults.tagInput);
// tslint:enable

@Component({
    selector: 'j-tag-input',
    providers: [CUSTOM_ACCESSOR],
    styleUrls: ['./j-tag-input.style.scss'],
    templateUrl: './j-tag-input.template.html',
    animations
})
export class JTagInputComponent extends TagInputAccessor implements OnInit, AfterViewInit {

    @Input() public separatorKeys: string[] = new defaults().separatorKeys;
    @Input() public separatorKeyCodes: number[] = new defaults().separatorKeyCodes;
    @Input() public placeholder: string = new defaults().placeholder;
    @Input() public secondaryPlaceholder: string = new defaults().secondaryPlaceholder;
    @Input() public maxItems: number = new defaults().maxItems;
    @Input() public validators: ValidatorFn[] = new defaults().validators;
    @Input() public asyncValidators: AsyncValidatorFn[] = new defaults().asyncValidators;
    @Input() public onlyFromAutocomplete = new defaults().onlyFromAutocomplete;
    @Input() public errorMessages: { [key: string]: string } = new defaults().errorMessages;
    @Input() public theme: string = new defaults().theme;
    @Input() public onTextChangeDebounce = new defaults().onTextChangeDebounce;
    @Input() public inputId: string = new defaults().inputId;
    @Input() public inputClass: string = new defaults().inputClass;
    @Input() public clearOnBlur: boolean = new defaults().clearOnBlur;
    @Input() public hideForm: boolean = new defaults().hideForm;
    @Input() public addOnBlur: boolean = new defaults().addOnBlur;
    @Input() public addOnPaste: boolean = new defaults().addOnPaste;
    @Input() public pasteSplitPattern = new defaults().pasteSplitPattern;
    @Input() public blinkIfDupe = new defaults().blinkIfDupe;
    @Input() public removable = new defaults().removable;
    @Input() public editable: boolean = new defaults().editable;
    @Input() public allowDupes = new defaults().allowDupes;
    @Input() public modelAsStrings = new defaults().modelAsStrings;
    @Input() public trimTags = new defaults().trimTags;
    @Input() public get inputText(): string { return this.inputTextValue; }
    @Input() public ripple: boolean = new defaults().ripple;
    @Input() public tabindex: string = new defaults().tabIndex;
    @Input() public disable: boolean = new defaults().disable;
    @Input() public dragZone: string = new defaults().dragZone;
    @Input() public onRemoving = new defaults().onRemoving;
    @Input() public onAdding = new defaults().onAdding;
    @Input() public animationDuration = new defaults().animationDuration;
    @Output() public onAdd = new EventEmitter<TagModel>();
    @Output() public onRemove = new EventEmitter<TagModel>();
    @Output() public onSelect = new EventEmitter<TagModel>();
    @Output() public onFocus = new EventEmitter<string>();
    @Output() public onBlur = new EventEmitter<string>();
    @Output() public onTextChange = new EventEmitter<TagModel>();
    @Output() public onPaste = new EventEmitter<string>();
    @Output() public onValidationError = new EventEmitter<TagModel>();
    @Output() public onTagEdited = new EventEmitter<TagModel>();

    @ContentChild(JTagInputDropdownComponent) public dropdown: JTagInputDropdownComponent;
    @ContentChildren(TemplateRef, { descendants: false }) public templates: QueryList<TemplateRef<any>>;

    @ViewChild(JTagInputFormComponent) public inputForm: JTagInputFormComponent;

    public selectedTag: TagModel | undefined;
    public isLoading = false;
    public set inputText(text: string) {
        this.inputTextValue = text;
        this.inputTextChange.emit(text);
    }

    @ViewChildren(JTagComponent) public tags: QueryList<JTagComponent>;

    @Output() public inputTextChange: EventEmitter<string> = new EventEmitter();

    public inputTextValue = '';

    @HostBinding('attr.tabindex')
    public get tabindexAttr(): string {
        return this.tabindex !== '' ? '-1' : '';
    }

    public animationMetadata: { value: string, params: object };

    private listeners = {
        [constants.KEYDOWN]: <{ (fun: any): any }[]>[],
        [constants.KEYUP]: <{ (fun: any): any }[]>[]
    };

    constructor(private readonly renderer: Renderer2,
        public readonly dragProvider: DragProvider) {
        super();
    }

    public ngAfterViewInit(): void {
        // set up listeners

        this.setUpKeypressListeners();
        this.setupSeparatorKeysListener();
        this.setUpInputKeydownListeners();

        if (this.onTextChange.observers.length) {
            this.setUpTextChangeSubscriber();
        }

        // if clear on blur is set to true, subscribe to the event and clear the text's form
        if (this.clearOnBlur || this.addOnBlur) {
            this.setUpOnBlurSubscriber();
        }

        // if addOnPaste is set to true, register the handler and add items
        if (this.addOnPaste) {
            this.setUpOnPasteListener();
        }

        // if hideForm is set to true, remove the input
        if (this.hideForm) {
            this.inputForm.destroy();
        }
    }

    public ngOnInit(): void {
        // if the number of items specified in the model is > of the value of maxItems
        // degrade gracefully and let the max number of items to be the number of items in the model
        // though, warn the user.
        const hasReachedMaxItems = this.maxItems !== undefined &&
            this.items &&
            this.items.length > this.maxItems;

        if (hasReachedMaxItems) {
            this.maxItems = this.items.length;
            console.warn(constants.MAX_ITEMS_WARNING);
        }

        // Setting editable to false to fix problem with tags in IE still being editable when
        // onlyFromAutocomplete is true
        this.editable = this.onlyFromAutocomplete ? false : this.editable;

        this.setAnimationMetadata();
    }

    public onRemoveRequested(tag: TagModel, index: number): void {
        const subscribeFn = (model: TagModel) => this.removeItem(model, index);

        this.onRemoving ?
            this.onRemoving(tag)
                .first()
                .subscribe(subscribeFn) : subscribeFn(tag);
    }

    public onAddingRequested(fromAutocomplete: boolean, tag: TagModel, index?: number): void {
        if (!tag) {
            return;
        }

        const subscribeFn = (model: TagModel) => {
            return this.addItem(fromAutocomplete, model, index);
        };

        this.onAdding ?
            this.onAdding(tag)
                .first()
                .subscribe(subscribeFn) : subscribeFn(tag);
    }

    public appendTag = (tag: TagModel, index = this.items.length): void => {
        const items = this.items;
        const model = this.modelAsStrings ? (<any>tag)[this.identifyBy] : tag;

        this.items = [
            ...items.slice(0, index),
            model,
            ...items.slice(index, items.length)
        ];
    }

    public createTag = (model: TagModel): TagModel => {
        const trim = (val: TagModel, key: string): TagModel => {
            return typeof val === 'string' ? val.trim() : val[key];
        };

        return {
            ...typeof model !== 'string' ? model : {},
            [this.displayBy]: this.trimTags ? trim(model, this.displayBy) : model,
            [this.identifyBy]: this.trimTags ? trim(model, this.identifyBy) : model
        };
    }

    public selectItem(item: TagModel | undefined, emit = true): void {
        const isReadonly = item && typeof item !== 'string' && item.readonly;

        if (isReadonly || this.selectedTag === item) {
            return;
        }

        this.selectedTag = item;

        if (emit) {
            this.onSelect.emit(item);
        }
    }

    public fireEvents(eventName: string, $event?: any): void {
        this.listeners[eventName].forEach(listener => listener.call(this, $event));
    }

    public handleKeydown(data: any): void {
        const event = data.event;
        const key: any = event.keyCode || event.which;

        switch (constants.KEY_PRESS_ACTIONS[key]) {
            case constants.ACTIONS_KEYS.DELETE:
                if (this.selectedTag && this.removable) {
                    const index = this.items.indexOf(this.selectedTag);
                    this.onRemoveRequested(this.selectedTag, index);
                }
                break;
            case constants.ACTIONS_KEYS.SWITCH_PREV:
                this.moveToTag(data.model, constants.PREV);
                break;
            case constants.ACTIONS_KEYS.SWITCH_NEXT:
                this.moveToTag(data.model, constants.NEXT);
                break;
            case constants.ACTIONS_KEYS.TAB:
                this.moveToTag(data.model, constants.NEXT);
                break;
            default:
                return;
        }

        // prevent default behaviour
        event.preventDefault();
    }

    public setInputValue(value: string): void {
        const control = this.getControl();

        // update form value with the transformed item
        control.setValue(value);
    }

    public focus(applyFocus = false, displayAutocomplete = false): void {
        if (this.dragProvider.getState('dragging')) {
            return;
        }

        this.selectItem(undefined, false);

        if (applyFocus) {
            this.inputForm.focus();
            this.onFocus.emit(this.formValue);
        }
    }

    public blur(): void {
        this.onTouched();

        this.onBlur.emit(this.formValue);
    }

    public hasErrors(): boolean {
        return this.inputForm && this.inputForm.hasErrors();
    }

    public isInputFocused(): boolean {
        return this.inputForm && this.inputForm.isInputFocused();
    }

    public hasCustomTemplate(): boolean {
        const template = this.templates ? this.templates.first : undefined;
        const menuTemplate = this.dropdown && this.dropdown.templates ?
            this.dropdown.templates.first : undefined;

        return Boolean(template && template !== menuTemplate);
    }

    public get maxItemsReached(): boolean {
        return this.maxItems !== undefined &&
            this.items.length >= this.maxItems;
    }

    public get formValue(): string {
        const form = this.inputForm.value;

        return form ? form.value : '';
    }

    public onDragStarted(event: DragEvent, tag: TagModel, index: number): void {
        event.stopPropagation();

        const item = { zone: this.dragZone, tag, index } as DraggedTag;

        this.dragProvider.setSender(this);
        this.dragProvider.setDraggedItem(event, item);
        this.dragProvider.setState({ dragging: true, index });
    }

    public onDragOver(event: DragEvent, index?: number): void {
        this.dragProvider.setState({ dropping: true });
        this.dragProvider.setReceiver(this);

        event.preventDefault();
    }

    public onTagDropped(event: DragEvent, index: number): void {
        const item = this.dragProvider.getDraggedItem(event);

        if (item.zone !== this.dragZone) {
            return;
        }

        this.dragProvider.onTagDropped(item.tag, item.index, index);

        event.preventDefault();
        event.stopPropagation();
    }

    public isDropping(): boolean {
        const isReceiver = this.dragProvider.receiver === this;
        const isDropping = this.dragProvider.getState('dropping');

        return Boolean(isReceiver && isDropping);
    }

    public onTagBlurred(changedElement: TagModel, index: number): void {
        this.items[index] = changedElement;
        this.blur();
    }

    public trackBy(item: TagModel): string {
        return (<any>item)[this.identifyBy];
    }

    private getControl(): FormControl {
        return <FormControl>this.inputForm.value;
    }

    private isTagValid(tag: TagModel, fromAutocomplete = false): boolean {
        const selectedItem = this.dropdown ? this.dropdown.selectedItem : undefined;

        if (selectedItem && !fromAutocomplete) {
            return false;
        }

        const dupe = this.findDupe(tag, fromAutocomplete);

        // if so, give a visual cue and return false
        if (!this.allowDupes && dupe && this.blinkIfDupe) {
            const model = this.tags.find((taga: any) => {
                return this.getItemValue(taga.model) === this.getItemValue(dupe);
            });

            if (model) {
                model.blink();
            }
        }

        const isFromAutocomplete = fromAutocomplete && this.onlyFromAutocomplete;

        const assertions = [
            // 1. there must be no dupe OR dupes are allowed
            !dupe || this.allowDupes === true,

            // 2. check max items has not been reached
            this.maxItemsReached === false,

            // 3. check item comes from autocomplete or onlyFromAutocomplete is false
            ((isFromAutocomplete) || this.onlyFromAutocomplete === false)
        ];

        return assertions.filter(item => item).length === assertions.length;
    }

    private moveToTag(item: TagModel, direction: string): void {
        const isLast = this.tags.last.model === item;
        const isFirst = this.tags.first.model === item;
        const stopSwitch = (direction === constants.NEXT && isLast) ||
            (direction === constants.PREV && isFirst);

        if (stopSwitch) {
            this.focus(true);
            return;
        }

        const offset = direction === constants.NEXT ? 1 : -1;
        const index = this.getTagIndex(item) + offset;
        const tag = this.getTagAtIndex(index);

        return tag.select.call(tag);
    }

    private getTagIndex(item: TagModel): number {
        const tags = this.tags.toArray();

        return tags.findIndex(tag => tag.model === item);
    }

    private getTagAtIndex(index: number) {
        const tags = this.tags.toArray();

        return tags[index];
    }

    private removeItem(tag: TagModel, index: number): void {
        this.items = this.getItemsWithout(index);

        // if the removed tag was selected, set it as undefined
        if (this.selectedTag === tag) {
            this.selectItem(undefined, false);
        }

        // focus input
        this.focus(true, false);

        // emit remove event
        this.onRemove.emit(tag);
    }

    private addItem(fromAutocomplete = false, item: TagModel, index?: number): void {
        const model = this.getItemDisplay(item);

        const reset = (): void => {
            // reset control and focus input
            this.setInputValue('');

            // focus input
            this.focus(true, false);
        };

        const validationFilter = (tag: TagModel): boolean => {
            const isValid = this.isTagValid(tag, fromAutocomplete) && this.inputForm.form.valid;

            if (!isValid) {
                this.onValidationError.emit(tag);
            }

            return isValid;
        };

        const subscribeFn = (tag: TagModel): void => {
            this.appendTag(tag, index);

            // emit event
            this.onAdd.emit(tag);

            if (!this.dropdown) {
                return;
            }

            this.dropdown.hide();
            if (this.dropdown.showDropdownIfEmpty) { this.dropdown.show(); }
        };

        Observable
            .of(model)
            .first()
            .filter(() => model.trim() !== '')
            .map(() => item)
            .map(this.createTag)
            .filter(validationFilter)
            .subscribe(subscribeFn, undefined, reset);
    }

    private setupSeparatorKeysListener(): void {
        const useSeparatorKeys = this.separatorKeyCodes.length > 0 || this.separatorKeys.length > 0;
        const listener = ($event: any) => {
            const hasKeyCode = this.separatorKeyCodes.indexOf($event.keyCode) >= 0;
            const hasKey = this.separatorKeys.indexOf($event.key) >= 0;

            if (hasKeyCode || hasKey) {
                $event.preventDefault();
                this.onAddingRequested(false, this.formValue);
            }
        };

        listen.call(this, constants.KEYDOWN, listener, useSeparatorKeys);
    }

    private setUpKeypressListeners(): void {
        const listener = ($event: any) => {
            const isCorrectKey = $event.keyCode === 37 || $event.keyCode === 8;

            if (isCorrectKey &&
                !this.formValue &&
                this.items.length) {
                this.tags.last.select.call(this.tags.last);
            }
        };

        // setting up the keypress listeners
        listen.call(this, constants.KEYDOWN, listener);
    }

    private setUpInputKeydownListeners(): void {
        this.inputForm.onKeydown.subscribe((event: any) => {
            this.fireEvents('keydown', event);

            if (event.key === 'Backspace' && this.formValue === '') {
                event.preventDefault();
            }
        });
    }

    private setUpOnPasteListener(): void {
        const input = this.inputForm.input.nativeElement;

        // attach listener to input
        this.renderer.listen(input, 'paste', this.onPasteCallback);
    }

    private setUpTextChangeSubscriber(): void {
        this.inputForm.form
            .valueChanges
            .debounceTime(this.onTextChangeDebounce)
            .map(() => this.formValue)
            .subscribe((value: string) => this.onTextChange.emit(value));
    }

    private setUpOnBlurSubscriber(): void {
        const filterFn = (): boolean => {
            return !(this.dropdown && this.dropdown.isVisible) && !!this.formValue;
        };

        this.inputForm
            .onBlur
            .filter(filterFn)
            .subscribe(() => {
                if (this.addOnBlur) {
                    this.onAddingRequested(false, this.formValue);
                }

                this.setInputValue('');
            });
    }

    private findDupe(tag: TagModel, isFromAutocomplete: boolean): TagModel | undefined {
        const identifyBy = isFromAutocomplete ? this.dropdown.identifyBy : this.identifyBy;
        const id = (<any>tag)[identifyBy];

        return this.items.find(item => this.getItemValue(item) === id);
    }

    private onPasteCallback = (data: ClipboardEvent): void => {
        const text = data.clipboardData.getData('text/plain');

        text.split(this.pasteSplitPattern)
            .map(item => this.createTag(item))
            .forEach(item => this.onAddingRequested(false, item));

        this.onPaste.emit(text);

        setTimeout(() => this.setInputValue(''), 0);
    }

    private setAnimationMetadata(): void {
        this.animationMetadata = {
            value: 'in',
            params: { ...this.animationDuration }
        };
    }
}
