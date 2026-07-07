import { type SelectOption } from '~/components/controls/select.vue';

export type LanguageOptionArgs = {
  enUsLang: string;
  ptBrLang: string;
};

export const languageOptions = (args: LanguageOptionArgs): SelectOption[] => {
  return [
    { label: args.enUsLang, value: 'en-US' },
    { label: args.ptBrLang, value: 'pt-BR' },
  ];
};

export const currencyOptions: SelectOption[] = [
  { label: 'USD', value: 'USD' },
  { label: 'BRL', value: 'BRL' },
];

export const timezoneOptions: SelectOption[] = Intl.supportedValuesOf('timeZone').map((tz) => ({
  label: tz,
  value: tz,
}));
