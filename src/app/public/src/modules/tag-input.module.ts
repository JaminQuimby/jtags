import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Ng2DropdownModule } from 'ng2-material-dropdown';
import { HighlightPipe, DragProvider, Options, OptionsProvider } from './core';

import {
    JTagComponent,
    JTagInputComponent,
    JTagInputDropdownComponent,
    JTagInputFormComponent,
    JTagRippleComponent
} from './components';

const COMPONENTS = [
    JTagInputComponent,
    JTagInputFormComponent,
    JTagComponent,
    HighlightPipe,
    JTagInputDropdownComponent,
    JTagRippleComponent
];

const optionsProvider = new OptionsProvider();

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        Ng2DropdownModule
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
