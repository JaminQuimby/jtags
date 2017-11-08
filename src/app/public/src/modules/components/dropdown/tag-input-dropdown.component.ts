import {
    Component,
    ContentChildren,
    EventEmitter,
    forwardRef,
    HostListener,
    Injector,
    Input,
    QueryList,
    TemplateRef,
    Type,
    ViewChild,
    OnInit
} from '@angular/core';

// rx
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/debounceTime';

import { Ng2Dropdown, Ng2MenuItem } from 'ng2-material-dropdown';
import { TagModel, TagInputDropdownOptions, OptionsProvider } from '../../core';
import { JTagInputComponent } from '../../components';
// tslint:disable
const defaults: Type<TagInputDropdownOptions> = forwardRef(() => OptionsProvider.defaults.dropdown);
// tslint:enable
@Component({
    selector: 'j-tag-input-dropdown',
    templateUrl: './tag-input-dropdown.template.html'
})
export class JTagInputDropdownComponent implements OnInit {
    /**
     * @name dropdown
     */
    @ViewChild(Ng2Dropdown) public dropdown: Ng2Dropdown;

    /**
     * @name menuTemplate
     * @desc reference to the template if provided by the user
     * @type {TemplateRef}
     */
    @ContentChildren(TemplateRef) public templates: QueryList<TemplateRef<any>>;

    /**
     * @name offset
     * @type {string}
     */
    @Input() public offset: string = new defaults().offset;

    /**
     * @name focusFirstElement
     * @type {boolean}
     */
    @Input() public focusFirstElement = new defaults().focusFirstElement;

    /**
     * - show autocomplete dropdown if the value of input is empty
     * @name showDropdownIfEmpty
     * @type {boolean}
     */
    @Input() public showDropdownIfEmpty = new defaults().showDropdownIfEmpty;

    /**
     * @description observable passed as input which populates the autocomplete items
     * @name autocompleteObservable
     */
    @Input() public autocompleteObservable: (text: string) => Observable<any>;

    /**
     * - desc minimum text length in order to display the autocomplete dropdown
     * @name minimumTextLength
     */
    @Input() public minimumTextLength = new defaults().minimumTextLength;

    /**
     * - number of items to display in the autocomplete dropdown
     * @name limitItemsTo
     */
    @Input() public limitItemsTo: number = new defaults().limitItemsTo;

    /**
     * @name displayBy
     */
    @Input() public displayBy = new defaults().displayBy;

    /**
     * @name identifyBy
     */
    @Input() public identifyBy = new defaults().identifyBy;

    /**
     * @description a function a developer can use to implement custom matching for the autocomplete
     * @name matchingFn
     */
    @Input() public matchingFn: (value: string, target: TagModel) => boolean = new defaults().matchingFn;

    /**
     * @name appendToBody
     * @type {boolean}
     */
    @Input() public appendToBody = new defaults().appendToBody;

    /**
     * @name keepOpen
     * @description option to leave dropdown open when adding a new item
     * @type {boolean}
     */
    @Input() public keepOpen = new defaults().keepOpen;

    /**
     * list of items that match the current value of the input (for autocomplete)
     * @name items
     * @type {TagModel[]}
     */
    public items: TagModel[] = [];

    /**
     * @name tagInput
     */
    public tagInput: JTagInputComponent = this.injector.get(JTagInputComponent);

    /**
     * @name _autocompleteItems
     * @type {Array}
     * @private
     */
    private _autocompleteItems: TagModel[] = [];

    /**
     * @name autocompleteItems
     * @param items
     */
    public set autocompleteItems(items: TagModel[]) {
        this._autocompleteItems = items;
    }

    /**
     * @name autocompleteItems
     * @desc array of items that will populate the autocomplete
     * @type {Array<string>}
     */
    @Input() public get autocompleteItems(): TagModel[] {
        const items = this._autocompleteItems;

        if (!items) {
            return [];
        }

        return items.map((item: TagModel) => {
            return typeof item === 'string' ? {
                [this.displayBy]: item,
                [this.identifyBy]: item
            } : item;
        });
    }

    constructor(private readonly injector: Injector) { }

    public ngOnInit(): void {
        this.onItemClicked().subscribe(this.requestAdding);

        // reset itemsMatching array when the dropdown is hidden
        this.onHide().subscribe(this.resetItems);

        const DEBOUNCE_TIME = 200;

        this.tagInput
            .onTextChange
            .debounceTime(DEBOUNCE_TIME)
            .filter((value: string) => {
                if (this.keepOpen === false) {
                    return value.length > 0;
                }

                return true;
            })
            .subscribe(this.show);
    }

    public updatePosition(): void {
        const position = this.tagInput.inputForm.getElementPosition();

        this.dropdown.menu.updatePosition(position);
    }

    public get isVisible(): boolean {
        return this.dropdown.menu.state.menuState.isVisible;
    }

    public onHide(): EventEmitter<Ng2Dropdown> {
        return this.dropdown.onHide;
    }

    public onItemClicked(): EventEmitter<string> {
        return this.dropdown.onItemClicked;
    }

    public get selectedItem(): Ng2MenuItem {
        return this.dropdown.menu.state.dropdownState.selectedItem;
    }

    public get state(): any {
        return this.dropdown.menu.state;
    }

    public show = (): void => {
        const value = this.getFormValue();
        const hasMinimumText = value.trim().length >= this.minimumTextLength;
        const position = this.calculatePosition();
        const items = this.getMatchingItems(value);
        const hasItems = items.length > 0;
        const isHidden = this.isVisible === false;
        const showDropdownIfEmpty = this.showDropdownIfEmpty && hasItems && !value;
        const assertions = [];

        const shouldShow = isHidden && ((hasItems && hasMinimumText) || showDropdownIfEmpty);
        const shouldHide = this.isVisible && !hasItems;

        if (this.autocompleteObservable && hasMinimumText) {
            return this.getItemsFromObservable(value);
        }

        if (!this.showDropdownIfEmpty && !value) {
            return this.dropdown.hide();
        }

        this.setItems(items);

        if (shouldShow) {
            this.dropdown.show(position);
        } else if (shouldHide) {
            this.hide();
        }
    }

    public hide(): void {
        this.resetItems();
        this.dropdown.hide();
    }

    @HostListener('window:scroll')
    public scrollListener(): void {
        if (!this.isVisible) {
            return;
        }

        this.updatePosition();
    }

    @HostListener('window:blur')
    public onWindowBlur(): void {
        this.dropdown.hide();
    }

    private getFormValue(): string {
        return this.tagInput.formValue.trim();
    }

    private calculatePosition(): ClientRect {
        return this.tagInput.inputForm.getElementPosition();
    }

    private requestAdding = (item: Ng2MenuItem): void => {
        this.tagInput.onAddingRequested(true, this.createTagModel(item));
    }

    private createTagModel(item: Ng2MenuItem): TagModel {
        const display = typeof item.value === 'string' ? item.value : item.value[this.displayBy];
        const value = typeof item.value === 'string' ? item.value : item.value[this.identifyBy];

        return {
            ...item.value,
            [this.tagInput.displayBy]: display,
            [this.tagInput.identifyBy]: value
        };
    }

    private getMatchingItems(value: string): TagModel[] {
        if (!value && !this.showDropdownIfEmpty) {
            return [];
        }

        const dupesAllowed = this.tagInput.allowDupes;

        return this.autocompleteItems.filter((item: TagModel) => {
            const hasValue: boolean = dupesAllowed ? true : this.tagInput.tags.some(tag => {
                const identifyBy = this.tagInput.identifyBy;
                const model = typeof tag.model === 'string' ? tag.model : tag.model[identifyBy];

                return model === (<any>item)[this.identifyBy];
            });

            return this.matchingFn(value, item) && hasValue === false;
        });
    }

    private setItems(items: TagModel[]): void {
        this.items = items.slice(0, this.limitItemsTo || items.length);
    }

    private resetItems = (): void => {
        this.items = [];
    }

    private populateItems(data: any): JTagInputDropdownComponent {
        this.autocompleteItems = data.map((item: any) => {
            return typeof item === 'string' ? {
                [this.displayBy]: item,
                [this.identifyBy]: item
            } : item;
        });

        return this;
    }

    private getItemsFromObservable = (text: string): void => {
        this.setLoadingState(true);

        const subscribeFn = (data: any[]) => {
            // hide loading animation
            this.setLoadingState(false)
                // add items
                .populateItems(data);

            this.setItems(this.getMatchingItems(text));

            if (this.items.length) {
                this.dropdown.show(this.calculatePosition());
            } else if (!this.showDropdownIfEmpty && this.isVisible) {
                this.dropdown.hide();
            }
        };

        this.autocompleteObservable(text)
            .first()
            .subscribe(subscribeFn, () => this.setLoadingState(false));
    }

    private setLoadingState(state: boolean): JTagInputDropdownComponent {
        this.tagInput.isLoading = state;

        return this;
    }
}
