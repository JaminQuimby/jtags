import {Pipe, PipeTransform} from '@angular/core';

const escape = (s: any) => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
/* tslint:disable */
@Pipe({
    name: 'highlight'
})
/* tslint:enabled */
export class HighlightPipe implements PipeTransform {

    public transform(value: string, arg: string): string {
        if (!arg.trim()) {
            return value;
        }

        try {
            const regex = new RegExp(`(${escape(arg)})`, 'i');
            return value.replace(regex, '<b>$1</b>');
        } catch (e) {
            return value;
        }
    }
}
