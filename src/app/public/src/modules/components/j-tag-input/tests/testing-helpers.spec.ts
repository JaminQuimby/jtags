import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
    Validators,
    FormControl
} from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

import { JTagInputModule } from '../j-tag-input.module';

function getItems() {
    return ['Javascript', 'Typescript'];
}

const validators = [Validators.minLength(3), (control: FormControl) => {
    if (control.value.charAt(0) !== '@') {
        return {
            'startsWithAt@': true
        };
    }
    return undefined;
}];

@Component({
    selector: 'test-app',
    template: `<j-tag-input [(ngModel)]="items"></j-tag-input>`
})
export class BasicJTagInputComponent {
    public items = getItems();
}

@Component({
    selector: 'test-app',
    template: `<j-tag-input
                  [(ngModel)]="items"
                  (onRemove)="onRemove($event)"
                  (onAdd)="onAdd($event)">
              </j-tag-input>`
})
/* tslint:disable */
export class JTagInputComponentWithOutputs {
    /* tslint:enable */
    public validators: any = validators;
    public items = getItems();

    public onAdd() { }
    public onRemove() { }
}

@Component({
    selector: 'test-app',
    template: `<j-tag-input [(ngModel)]="items"></j-tag-input>`
})
/* tslint:disable */
export class JTagInputComponentTagsAsObjects {
    /* tslint:enable */
    public items = [{ value: 0, display: 'React' }, { value: 1, display: 'Angular' }];
}

@Component({
    selector: 'test-app',
    template: `<j-tag-input [(ngModel)]="items"></j-tag-input>`
})
/* tslint:disable */
export class JTagInputComponentCustomTagsAsObjects {
    /* tslint:enable */
    public items = [{ id: 0, name: 'React' }, { id: 1, name: 'Angular' }];
}

@Component({
    selector: 'test-app',
    template: `<j-tag-input
                  [(ngModel)]="items"
                  [validators]="validators">
              </j-tag-input>`
})
/* tslint:disable */
export class JTagInputComponentWithValidation {
    /* tslint:enable */
    public items = getItems();
    public validators: any = validators;
}

@Component({
    selector: 'test-app',
    template: `<j-tag-input [(ngModel)]="items"
                          [onAdding]="onAdding">
                         </j-tag-input>`
})
/* tslint:disable */
export class JTagInputComponentWithTransformer {
    /* tslint:enable */
    public items = getItems();

    public onAdding(value: string): Observable<object> {
        const item = { display: `prefix: ${value}`, value: `prefix: ${value}` };
        return Observable.of(item);
    }
}

@Component({
    selector: 'test-app',
    template: `<j-tag-input [(ngModel)]="items" [placeholder]="'New Tag'"></j-tag-input>`
})
/* tslint:disable */
export class JTagInputComponentWithPlaceholder {
    /* tslint:enable */
    public items = getItems();
}

@Component({
    selector: 'test-app',
    template: `<j-tag-input [(ngModel)]="items" [maxItems]="2"></j-tag-input>`
})
/* tslint:disable */
export class JTagInputComponentWithMaxItems {
    /* tslint:enable */
    public items = getItems();
}

@Component({
    selector: 'test-app',
    template: `<j-tag-input [(ngModel)]="items">
               </j-tag-input>`
})
/* tslint:disable */
export class JTagInputComponentWithAutocomplete {
    /* tslint:enable */
    public items = getItems();
}

@Component({
    selector: 'test-app',
    template: `<j-tag-input [(ngModel)]="items">
                    <ng-template let-item="item">
                        <span class="custom-class">
                            item: {{ item }}
                        </span>

                        <span (click)="input.removeItem(item)" class="ng2-tag__remove-button">
                            x
                        </span>
                    </ng-template>
                </j-tag-input>`
})
/* tslint:disable */
export class JTagInputComponentWithTemplate {
    /* tslint:enable */
    public items = getItems();
}

@Component({
    selector: 'test-app',
    template: `<j-tag-input [(ngModel)]="items"
                           [onlyFromAutocomplete]="true">
               </j-tag-input>`
})
/* tslint:disable */
export class JTagInputComponentWithOnlyAutocomplete {
    /* tslint:enable */
    public items = getItems();
}

@Component({
    selector: 'test-app',
    template: `<j-tag-input [(ngModel)]="items" [modelAsStrings]="true"></j-tag-input>`
})
/* tslint:disable */
export class JTagInputComponentWithModelAsStrings {
    /* tslint:enable */
    public items = getItems();
}

@Component({
    selector: 'test-app',
    template: `<j-tag-input [(ngModel)]="items" [addOnBlur]="true">
               </j-tag-input>`
})
/* tslint:disable */
export class JTagInputComponentWithAddOnBlur {
    /* tslint:enable */
    public items = getItems();
}

@Component({
    selector: 'test-app',
    template: `<j-tag-input [(ngModel)]="items"
                          [onRemoving]="onRemoving"
                          [onAdding]="onAdding"></j-tag-input>`
})
/* tslint:disable */
export class JTagInputComponentWithHooks {
    /* tslint:enable */
    public items = getItems();

    public onAdding(tag: any): Observable<any> {
        return;
    }

    public onRemoving(tag: any): Observable<any> {
        return;
    }
}

const COMPONENTS = [
    BasicJTagInputComponent,
    JTagInputComponentWithPlaceholder,
    JTagInputComponentWithOutputs,
    JTagInputComponentWithTransformer,
    JTagInputComponentWithValidation,
    JTagInputComponentWithMaxItems,
    JTagInputComponentWithTemplate,
    JTagInputComponentWithAutocomplete,
    JTagInputComponentWithOnlyAutocomplete,
    JTagInputComponentTagsAsObjects,
    JTagInputComponentCustomTagsAsObjects,
    JTagInputComponentWithModelAsStrings,
    JTagInputComponentWithAddOnBlur,
    JTagInputComponentWithHooks
];

@NgModule({
    imports: [CommonModule, FormsModule, JTagInputModule],
    declarations: COMPONENTS,
    exports: COMPONENTS
})
export class TestModule { }
