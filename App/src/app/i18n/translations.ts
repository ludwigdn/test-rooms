import { InjectionToken } from '@angular/core';
import { LANG_EN_NAME, LANG_EN_TRANS } from './lang-en';
import { LANG_FR_NAME, LANG_FR_TRANS } from './lang-fr';

export const TRANSLATIONS = new InjectionToken('translations');

// all translations
const dictionary = {
    [LANG_EN_NAME]: LANG_EN_TRANS,
    [LANG_FR_NAME]: LANG_FR_TRANS
};

// providers
export const TRANSLATION_PROVIDERS = [
    { provide: TRANSLATIONS, useValue: dictionary },
];