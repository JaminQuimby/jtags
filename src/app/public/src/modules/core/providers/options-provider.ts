import { defaults, JTagInputOptions } from '../../defaults';

export type Options = {
    tagInput?: {
        [P in keyof JTagInputOptions]?: JTagInputOptions[P];
    };
};

export class OptionsProvider {
    public static defaults = defaults;

    public setOptions(options: Options): void {
        OptionsProvider.defaults.tagInput = {...defaults.tagInput, ...options.tagInput};
    }
}

export { JTagInputOptions };
