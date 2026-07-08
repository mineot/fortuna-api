import { type PropType } from 'vue';

export type InputTypes = 'text' | 'email' | 'password';
export type SelectTypes = 'select';
export type RuleField = { field: string; message: string };
export type RuleNumber = { value: number; message: string };
export type RuleTypes = InputTypes | SelectTypes;
export type RuleObjectItem = { rules: Rule; type: RuleTypes };
export type RuleObject = Record<string, RuleObjectItem>;
export type FormError = Partial<Record<string, string | undefined>>;

export type Rule = {
  REQUIRED?: string;
  EMAIL?: string;
  WHEN?: RuleField[];
  EQUAL?: RuleField[];
  LENGTH?: RuleNumber;
  MIN?: RuleNumber;
  MAX?: RuleNumber;
};

export type SelectOption = {
  value: any;
  label: string;
};

export interface FormExposed {
  getValues(): Promise<any>;
  reset(): void;
  validate(): Promise<boolean>;
  valid: boolean;
}

export const baseControlProps = {
  name: {
    type: String,
    required: true,
    default: 'control-name',
  },
  label: {
    type: String,
    required: true,
    default: 'Control Label',
  },
  required: {
    type: Boolean,
    required: false,
    default: false,
  },
};

export const inputProps = {
  ...baseControlProps,
  type: {
    type: String as PropType<InputTypes>,
    required: true,
    default: 'text',
  },
};

export const selectProps = {
  ...baseControlProps,
  searchable: {
    type: Boolean,
    required: false,
    default: false,
  },
  options: {
    type: Array as PropType<SelectOption[]>,
    required: true,
    default: [],
  },
};

export const formProps = {
  rules: {
    type: Object as PropType<RuleObject>,
    required: false,
    default: {},
  },
  initValues: {
    type: Object,
    required: false,
    default: {},
  },
};
