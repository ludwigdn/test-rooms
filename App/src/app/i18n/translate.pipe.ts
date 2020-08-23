import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service';

@Pipe({
    name: 'translate',
    pure: false // adding this line updates the value when language is changed
})

export class TranslatePipe implements PipeTransform {

    constructor(private _translate: TranslateService) { }

    transform(value: string, args: any[]): any {
        if (!value) return;
        return this._translate.do(value);
    }
}
