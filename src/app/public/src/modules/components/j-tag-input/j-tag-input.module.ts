import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HighlightPipe, DragProvider, Options, OptionsProvider } from '../../core';
import { JTagComponent } from '../j-tag';
import { JTagInputFormComponent } from '../j-tag-input-form';
import { JTagRippleComponent } from '../j-tag/j-tag-ripple.component';
import { JTagInputComponent } from './';

const COMPONENTS = [
    JTagInputComponent,
    JTagInputFormComponent,
    JTagComponent,
    HighlightPipe,
    JTagRippleComponent
];

const optionsProvider = new OptionsProvider();

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule
    ],
    declarations: COMPONENTS,
    exports: COMPONENTS,
    providers: [
        DragProvider
    ]
})
export class JTagInputModule {
    public static withDefaults(options: Options): void {
        optionsProvider.setOptions(options);
    }
}
