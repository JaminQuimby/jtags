import { ControlValueAccessor } from '@angular/forms';
import { Input } from '@angular/core';
import { OptionsProvider } from './providers';

export type JTagModel = string | {[key: string]: any};

export function isObject(obj: any): boolean {
    return obj === Object(obj);
}

export class TagInputAccessor implements ControlValueAccessor {
    private _items: JTagModel[] = [];
    private _onTouchedCallback: () => void;
    private _onChangeCallback: (items: JTagModel[]) => void;

    @Input() public displayBy: string = OptionsProvider.defaults.tagInput.displayBy;

    @Input() public identifyBy: string = OptionsProvider.defaults.tagInput.identifyBy;

    public get items(): JTagModel[] {
        return this._items;
    }

    public set items(items: JTagModel[]) {
        this._items = items;
        this._onChangeCallback(this._items);
    }

    public onTouched() {
        this._onTouchedCallback();
    }

    public writeValue(items: any[]) {
        this._items = items || [];
    }

    public registerOnChange(fn: any) {
        this._onChangeCallback = fn;
    }

    public registerOnTouched(fn: any) {
        this._onTouchedCallback = fn;
    }

    public getItemValue(item: JTagModel): string {
        return isObject(item) ? (<any>item)[this.identifyBy] : item;
    }

    public getItemDisplay(item: JTagModel): string {
        return isObject(item) ? (<any>item)[this.displayBy] : item;
    }

    protected getItemsWithout(index: number): JTagModel[] {
        return this.items.filter((item, position) => position !== index);
    }
}
