import { Component, Input, Output, EventEmitter } from '@angular/core';
import { JTagDemoInputInterface } from './j-tag-demo.interface';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'j-tag',
  templateUrl: './j-tag-demo.component.html',
  styleUrls: ['./j-tag-demo.component.scss']
})
export class JTagDemoComponent {

  @Input()
  public get inputText() {
    return this.inputTextValue;
  }
  public set inputText(text: string) {
    this.inputTextValue = text;
    this.inputTextChange.emit(text);
  }

  @Output()
  public inputTextChange: EventEmitter<string> = new EventEmitter();

  public inputTextValue: string = '';
  public selectedTags: JTagDemoInputInterface;
  public form: FormGroup;
  public disabled = true;
  public items = ['Javascript', 'Typescript'];
  public itemsAsObjects = [{ id: 0, name: 'Angular', readonly: true }, { id: 1, name: 'React' }];

  public options = {
    readonly: <string>undefined,
    placeholder: '+ Tag'
  };

  public asyncErrorMessages = {
    isNan: 'Please only add numbers'
  };

  public validators = [this.startsWithAt, this.endsWith];

  public asyncValidators = [this.validateAsync];

  public errorMessages = {
    'startsWithAt@': 'Your items need to start with \'@\'',
    'endsWith$': 'Your items need to end with \'$\''
  };

  constructor() {
    this.form = new FormBuilder().group({
      chips: [['chip'], []]
    });
  }

  public onAdd(item: any) {
    console.log('tag added: value is ' + item);
  }

  public onRemove(item: any) {
    console.log('tag removed: value is ' + item);
  }

  public onSelect(item: any) {
    console.log('tag selected: value is ' + item);
  }

  public onFocus(item: any) {
    console.log('input focused: current value is ' + item);
  }

  public onTextChange(text: any) {
    console.log('text changed: value is ' + text);
  }

  public onBlur(item: any) {
    console.log('input blurred: current value is ' + item);
  }

  public onTagEdited(item: any) {
    console.log('tag edited: current value is ' + item);
  }

  public onValidationError(item: any) {
    console.log('invalid tag ' + item);
  }

  public transform(value: string): Observable<object> {
    const item = {
      display: '@' + value,
      value: '@' + value
    };
    return Observable.of(item);
  }
  public onAdding(tag: any): Observable<any> {
    const confirm = window.confirm('Do you really want to add this tag?');
    return Observable
      .of(tag)
      .filter(() => confirm);
  }

  public onRemoving(tag: any): Observable<any> {
    const confirm = window.confirm('Do you really want to remove this tag?');
    return Observable
      .of(tag)
      .filter(() => confirm);
  }

  public asyncOnAdding(tag: any): Observable<any> {
    const confirm = window.confirm('Do you really want to add this tag?');
    return Observable
      .of(tag)
      .filter(() => confirm);
  }

  private validateAsync(control: FormControl): Promise<any> {
    return new Promise((resolve) => {
      if (isNaN(control.value)) {
        resolve({ isNan: true });
      } else {
        resolve(undefined);
      }
    });
  }

  private startsWithAt(control: FormControl) {
    if (control.value.charAt(0) !== '@') {
      return { 'startsWithAt@': true };
    }
    return undefined;
  }

  private endsWith(control: FormControl) {
    if (control.value.charAt(control.value.length - 1) !== '$') {
      return { 'endsWith$': true };
    }
    return undefined;
  }

}
