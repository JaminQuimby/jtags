import {
    fakeAsync,
    ComponentFixture,
    async,
    tick,
    TestBed,
    discardPeriodicTasks
} from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs/Subject';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { JTagModel } from '../../core';
import { JTagInputComponent } from './j-tag-input.component';

import {
    BasicJTagInputComponent,
    JTagInputComponentWithOutputs,
    JTagInputComponentWithValidation,
    JTagInputComponentWithTransformer,
    JTagInputComponentWithPlaceholder,
    JTagInputComponentWithMaxItems,
    JTagInputComponentWithTemplate,
    JTagInputComponentWithOnlyAutocomplete,
    TestModule,
    JTagInputComponentWithModelAsStrings,
    JTagInputComponentWithAddOnBlur,
    JTagInputComponentWithHooks
} from './tests/testing-helpers.spec';

describe('JTagInputComponent', () => {
    const match = jasmine.objectContaining;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            imports: [BrowserAnimationsModule, TestModule]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents();
    }));

    function getComponent(fixture: any) {
        fixture.detectChanges();
        tick();

        fixture.detectChanges();
        tick();

        return fixture.debugElement.query(By.directive(JTagInputComponent)).componentInstance;
    }

    describe('Basic behaviours', () => {
        it('should have 2 tags set by ngModel', fakeAsync(() => {
            const fixture: ComponentFixture<BasicJTagInputComponent> =
                TestBed.createComponent(BasicJTagInputComponent);
            const component = getComponent(fixture);

            expect(component.items.length).toEqual(2);

        }));

        it('should override the default placeholder of the input', fakeAsync(() => {
            const fixture: ComponentFixture<JTagInputComponentWithPlaceholder> =
                TestBed.createComponent(JTagInputComponentWithPlaceholder);
            const component = getComponent(fixture);

            expect(component.items.length).toEqual(2);
            expect(component.inputForm.input.nativeElement.getAttribute('placeholder')).toEqual('New Tag');
        }));

        it('should be "touched" on blur', fakeAsync(() => {
            const fixture: ComponentFixture<BasicJTagInputComponent> =
                TestBed.createComponent(BasicJTagInputComponent);
            const component = <JTagInputComponent>getComponent(fixture);
            const onTouched = jasmine.createSpy('onTouched');

            component.registerOnTouched(onTouched);
            component.blur();

            expect(onTouched).toHaveBeenCalled();
        }));
    });

    describe('when a new item is added', () => {
        it('should be added to the list of items and update its parent\'s model', fakeAsync(() => {
            const fixture: ComponentFixture<BasicJTagInputComponent> =
                TestBed.createComponent(BasicJTagInputComponent);
            const component = getComponent(fixture);
            const value = 'New Item';

            component.setInputValue(value);
            expect(component.inputForm.form.valid).toEqual(true);

            component.onAddingRequested(false, value);

            tick();
            fixture.detectChanges();

            expect(component.inputForm.form.controls.item.value).toEqual('');
            expect(fixture.componentInstance.items.length).toEqual(3);
            expect(component.items.length).toEqual(3);
        }));

        it('should not be allowed if max-items is set up', fakeAsync(() => {
            const fixture: ComponentFixture<JTagInputComponentWithMaxItems> =
                TestBed.createComponent(JTagInputComponentWithMaxItems);
            const component = getComponent(fixture);

            const value = 'New Item';
            component.setInputValue(value);

            component.onAddingRequested(false, value);

            fixture.detectChanges();

            expect(fixture.componentInstance.items.length).toEqual(2);
            expect(component.items.length).toEqual(2);

            discardPeriodicTasks();
        }));

        it('emits the event onAdd', () => {
            const fixture: ComponentFixture<JTagInputComponentWithOutputs> =
                TestBed.createComponent(JTagInputComponentWithOutputs);
            const itemName = 'New Item';

            fakeAsync(() => {
                const component = getComponent(fixture);

                component.inputForm.form.get('item').setValue(itemName);

                component.onAdd.subscribe((item: any) => {
                    expect(item).toEqual(itemName);
                });

                component.onAddingRequested();
                tick();

                discardPeriodicTasks();
            });
        });

        it('does not allow dupes', fakeAsync(() => {
            const fixture: ComponentFixture<BasicJTagInputComponent> =
                TestBed.createComponent(BasicJTagInputComponent);
            const component = getComponent(fixture);

            component.inputForm.form.get('item').setValue('Javascript');
            component.onAddingRequested();
            expect(component.items.length).toEqual(2);

            tick(1000);

            discardPeriodicTasks();
        }));
    });

    describe('when an item is removed', () => {
        let fixture: ComponentFixture<BasicJTagInputComponent>;
        let tagName: string;
        //  let item: JTagModel;
        let component;

        beforeEach(() => {
            fixture = TestBed.createComponent(BasicJTagInputComponent);
            tagName = 'Typescript';
        });

        it('is removed from the list', fakeAsync(() => {
            component = getComponent(fixture);
            component.removeItem(tagName, 1);

            fixture.detectChanges();

            expect(component.items.length).toEqual(1);
            expect(component.inputForm.isInputFocused()).toEqual(true);
        }));

        it('emits the event onRemove', fakeAsync(() => {
            component = getComponent(fixture);
            component.onRemove.subscribe((tag: any) => {
                expect(tag).toEqual(tagName);
            });

            component.removeItem(tagName);
            tick();

            discardPeriodicTasks();
        }));

        it('is sets current selected item as undefined', fakeAsync(() => {
            component = getComponent(fixture);
            component.removeItem(tagName, 0);

            expect(component.selectedTag).toBe(undefined);
        }));
    });

    describe('testing validators', () => {
        it('injects minLength validator and validates correctly', fakeAsync(() => {
            const fixture: ComponentFixture<JTagInputComponentWithValidation> =
                TestBed.createComponent(JTagInputComponentWithValidation);
            const component = getComponent(fixture);
            const value = 'Ab';

            component.setInputValue(value);
            expect(component.inputForm.form.valid).toBe(false);

            component.onAddingRequested(false, value);
            fixture.detectChanges();
            tick();

            expect(component.items.length).toEqual(2);

            const invalid = 'Abcde';

            // addItem element with > 3 chars without @
            component.setInputValue('Abcde');
            component.onAddingRequested(false, invalid);

            fixture.detectChanges();
            tick();

            expect(component.inputForm.form.valid).toBe(false);

            const valid = '@Abcde';

            // addItem element with > 3 chars with @
            component.setInputValue(valid);

            expect(component.inputForm.form.valid).toBe(true);

            component.onAddingRequested(false, valid);
            fixture.detectChanges();
            tick();

            expect(component.items.length).toEqual(3);

            discardPeriodicTasks();
        }));

        it('injects minLength validator and custom validator and validates correctly', fakeAsync(() => {
            const fixture: ComponentFixture<JTagInputComponentWithValidation> =
                TestBed.createComponent(JTagInputComponentWithValidation);
            const component = getComponent(fixture);
            const value = 'Javascript';

            component.setInputValue(value);
            expect(component.inputForm.form.valid).toBe(false);

            const invalid = '@J';

            component.setInputValue(invalid);
            expect(component.inputForm.form.valid).toBe(false);

            const valid = '@Javascript';

            // addItem element with > 3 chars AND @
            component.setInputValue(valid);
            expect(component.inputForm.form.valid).toBe(true);

            discardPeriodicTasks();
        }));

        it('validates transformed values', fakeAsync(() => {
            const fixture: ComponentFixture<JTagInputComponentWithTransformer> =
                TestBed.createComponent(JTagInputComponentWithTransformer);
            const component = getComponent(fixture);

            component.setInputValue('@');
            component.onAddingRequested(false, '@');

            fixture.detectChanges();
            tick();

            expect(component.items[2]).toEqual(match({ display: 'prefix: @', value: 'prefix: @' }));
            expect(component.items.length).toEqual(3);

            discardPeriodicTasks();
        }));
    });

    describe('when user navigates tags with keypress event', () => {
        let keyUp: Event = new Event('keyup'),
            keyDown: Event = new Event('keydown'),
            fixture: ComponentFixture<BasicJTagInputComponent>,
            component;

        (<any>keyDown)['keyCode'] = 37;

        beforeEach(() => {
            fixture = TestBed.createComponent(BasicJTagInputComponent);
        });

        it('it handles navigation/deletion of tags', fakeAsync(() => {
            component = getComponent(fixture);

            // selected tag is undefined
            expect(component.selectedTag).toEqual(undefined);

            // press backspace
            component.inputForm.input.nativeElement.dispatchEvent(keyDown);

            // selected tag is the last one
            expect(component.selectedTag).toEqual('Typescript');

            // press tab and focus input again
            (<any>keyDown)['keyCode'] = 9;
            component.tags.last.element.nativeElement.dispatchEvent(keyDown);

            expect(component.selectedTag).toEqual(undefined);
            expect(component.inputForm.isInputFocused()).toEqual(true);

            (<any>keyDown)['keyCode'] = 8;
            // then starts from back again
            component.inputForm.input.nativeElement.dispatchEvent(keyDown);

            expect(component.selectedTag).toEqual('Typescript');

            // it removes current selected tag when pressing delete
            component.tags.last.element.nativeElement.dispatchEvent(keyDown);

            expect(component.items.length).toEqual(1);
            expect(component.selectedTag).toBe(undefined);

            discardPeriodicTasks();
        }));

        it('it navigates back and forth between tags', fakeAsync(() => {
            component = getComponent(fixture);
            (<any>keyDown)['keyCode'] = 37;

            // press left arrow
            component.inputForm.input.nativeElement.dispatchEvent(keyDown);

            // selected tag is the last one
            expect(component.selectedTag).toEqual('Typescript');

            // press left arrow
            component.tags.last.element.nativeElement.dispatchEvent(keyDown);
            expect(component.selectedTag).toEqual('Javascript');

            // press right arrow
            (<any>keyDown)['keyCode'] = 39;
            component.tags.first.element.nativeElement.dispatchEvent(keyDown);
            expect(component.selectedTag).toEqual('Typescript');

            // press tab -> focuses input
            (<any>keyDown)['keyCode'] = 9;
            component.tags.last.element.nativeElement.dispatchEvent(keyDown);

            expect(component.selectedTag).toEqual(undefined);
            expect(component.inputForm.isInputFocused()).toEqual(true);

            discardPeriodicTasks();
        }));

        it('it focuses input when pressing tab', fakeAsync(() => {
            component = getComponent(fixture);
            (<any>keyUp)['keyCode'] = 9;

            // press left arrow
            component.tags.first.element.nativeElement.dispatchEvent(keyDown);

            // selected tag is the last one
            expect(component.selectedTag).toEqual('Typescript');

            // press tab -> focuses input
            component.tags.last.element.nativeElement.dispatchEvent(keyDown);
            expect(component.selectedTag).toEqual(undefined);

            expect(component.inputForm.isInputFocused()).toEqual(true);

            discardPeriodicTasks();
        }));
    });

    describe('when using a custom template', () => {
        it('replaced template with the custom one', fakeAsync(() => {
            const fixture: ComponentFixture<JTagInputComponentWithTemplate> =
                TestBed.createComponent(JTagInputComponentWithTemplate);

            const component = getComponent(fixture);

            expect(component.items.length).toEqual(2);
            expect(document.querySelectorAll('.custom-class').length).toEqual(2);

            discardPeriodicTasks();
        }));
    });

    describe('when using the autocomplete', () => {
        let keyUp: Event = new Event('keyUp');
        (<any>keyUp)['keyCode'] = 73;

        it('does not let add item if onlyFromAutocomplete is set to true', fakeAsync(() => {
            const fixture: ComponentFixture<JTagInputComponentWithOnlyAutocomplete> =
                TestBed.createComponent(JTagInputComponentWithOnlyAutocomplete);
            const component = getComponent(fixture);
            const value = 'item';

            component.setInputValue(value);
            component.onAddingRequested(false, value);
            expect(component.items.length).toEqual(2);

            component.setInputValue(value);

            component.onAddingRequested(true, value);
            expect(component.items.length).toEqual(3);

            discardPeriodicTasks();
        }));
    });

    describe('model as strings', () => {
        it('adds item to the model as a string', fakeAsync(() => {
            const fixture: ComponentFixture<JTagInputComponentWithModelAsStrings> =
                TestBed.createComponent(JTagInputComponentWithModelAsStrings);

            const component: JTagInputComponent = getComponent(fixture);
            component.appendTag({ display: 'Tag', value: 'Tag' });

            expect(component.items[2]).toEqual('Tag');

            discardPeriodicTasks();
        }));
    });

    describe('when addOnBlur is true', () => {
        it('should add an item on blur', fakeAsync(() => {
            const fixture: ComponentFixture<JTagInputComponentWithAddOnBlur> =
                TestBed.createComponent(JTagInputComponentWithAddOnBlur);

            const component: JTagInputComponent = getComponent(fixture);

            component.setInputValue('New Item');
            component.inputForm.onBlur.emit();

            expect(component.items.length).toEqual(3);

            discardPeriodicTasks();
        }));
    });
    describe('when using hooks onAdding and onRemoving', () => {
        let fixture: ComponentFixture<JTagInputComponentWithHooks>;

        beforeEach(() => {
            fixture = TestBed.createComponent(JTagInputComponentWithHooks);
        });

        it('intercepts hook onAdding and returns an observable', fakeAsync(() => {
            const component: JTagInputComponent = getComponent(fixture);
            const subject = new Subject();
            const tag = component.createTag('tag');

            component.onAdding = () => {
                return subject;
            };

            component.onAddingRequested(false, tag);

            expect(component.items.length).toBe(2);

            subject.next(tag);

            expect(component.items.length).toBe(3);
        }));

        it('intercepts hook onRemoving and returns an observable', fakeAsync(() => {
            const component: JTagInputComponent = getComponent(fixture);
            const subject = new Subject();

            component.onRemoving = () => {
                return subject;
            };

            const tag = component.items[0];

            component.onRemoveRequested(tag, 0);

            expect(component.items.length).toBe(2);

            subject.next(tag);

            expect(component.items.length).toBe(1);
        }));
    });
});
