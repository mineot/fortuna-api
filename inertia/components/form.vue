<template>
  <Form
    ref="form"
    :initial-values="props.initValues"
    :validation-schema="schema"
    class="d-flex flex-column gap-2 py-2"
    v-slot="{ errors }"
  >
    <template v-for="field in props.fields" :key="field.name">
      <template v-if="isInput(field)">
        <div class="d-flex flex-column">
          <div class="d-flex gap-1 align-items-end">
            <small>{{ field.label }}</small>
            <small class="text-danger" v-if="field.rules?.REQUIRED">*</small>
          </div>
          <div class="position-relative">
            <Field
              :class="['form-control form-control-sm', { 'is-invalid': errors[field.name] }]"
              :name="field.name"
              :type="checkInputType(field)"
              as="input"
              validate-on-input
            />
            <div v-if="field.type === 'PASSWORD'" class="position-absolute top-0 end-0 px-2 py-1">
              <i
                :class="['bi bi-eye-fill', { 'd-none': passwordShow[field.name] }]"
                role="button"
                @click="togglePassword(field.name, true)"
              />
              <i
                :class="['bi bi-eye-slash-fill', { 'd-none': !passwordShow[field.name] }]"
                role="button"
                @click="togglePassword(field.name, false)"
              />
            </div>
          </div>
          <ErrorMessage as="small" :name="field.name" class="text-danger" />
        </div>
      </template>
    </template>
  </Form>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from 'vue';
import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

type FieldType = 'TEXT' | 'EMAIL' | 'PASSWORD';
type FieldValue = Partial<Record<string, any>>;

type Rule = {
  REQUIRED?: string;
  EMAIL?: string;
  WHEN?: { field: string; message: string }[];
  EQUAL?: { field: string; message: string }[];
  LENGTH?: { value: number; message: string };
  MIN?: { value: number; message: string };
  MAX?: { value: number; message: string };
};

type Field = {
  name: string;
  label: string;
  type: FieldType;
  rules?: Rule;
};

export interface FormExposed {
  submit(): Promise<void>;
  getValues(): Promise<any>;
  reset(): void;
  validate(): Promise<boolean>;
  valid: boolean;
}

const form = ref<InstanceType<typeof Form> | null>(null);
const passwordShow = ref<Record<string, boolean>>({});
const valid = computed(() => form.value?.meta.valid ?? true);

const props = defineProps({
  editId: {
    type: String,
    required: false,
    default: null,
  },
  editMode: {
    type: Boolean,
    required: false,
    default: false,
  },
  storeUrl: {
    type: String,
    required: false,
    default: null,
  },
  updateUrl: {
    type: String,
    required: false,
    default: null,
  },
  fields: {
    type: Array as PropType<Field[]>,
    required: true,
  },
  initValues: {
    type: Object as PropType<FieldValue>,
    required: false,
    default: {},
  },
});

const schema = computed(() => {
  const rules: Record<string, any> = {};

  props.fields.forEach((field: Field) => {
    if (field.rules) {
      switch (field.type) {
        case 'TEXT':
        case 'EMAIL':
        case 'PASSWORD':
          rules[field.name] = yup.string();
          break;
      }

      if (field.rules.REQUIRED) {
        rules[field.name] = rules[field.name].required(field.rules.REQUIRED);
      }

      if (field.rules.EMAIL) {
        rules[field.name] = rules[field.name].email(field.rules.EMAIL);
      }

      if (field.rules.WHEN?.length) {
        for (const [index, when] of field.rules.WHEN.entries()) {
          rules[field.name] = rules[field.name].test(
            `when-${when.field}-${index}`,
            when.message,
            (value: string | undefined, { parent }: { parent: Record<string, any> }) => {
              const triggerFilled = !!parent[when.field];
              if (!triggerFilled) return true;
              return !!value && value.length > 0;
            },
          );
        }
      }

      if (field.rules.EQUAL?.length) {
        for (const equal of field.rules.EQUAL) {
          rules[field.name] = rules[field.name].oneOf([yup.ref(equal.field)], equal.message);
        }
      }

      if (field.rules.LENGTH) {
        rules[field.name] = rules[field.name].length(
          field.rules.LENGTH.value,
          field.rules.LENGTH.message,
        );
      }

      if (field.rules.MIN) {
        rules[field.name] = rules[field.name].min(
          field.rules.MIN.value,
          field.rules.MIN.message,
        );
      }

      if (field.rules.MAX) {
        rules[field.name] = rules[field.name].max(
          field.rules.MAX.value,
          field.rules.MAX.message,
        );
      }
    }
  });

  return yup.object(rules);
});

function togglePassword(name: string, value: boolean) {
  passwordShow.value[name] = value;
}

function checkInputType(field: Field): string {
  if (field.type === 'PASSWORD') {
    return passwordShow.value[field.name] ? 'text' : 'password';
  }

  return field.type.toLowerCase();
}

function isInput(field: Field): boolean {
  return field.type === 'TEXT' || field.type === 'EMAIL' || field.type === 'PASSWORD';
}

async function validate(): Promise<boolean> {
  if (!form.value) {
    return false;
  }

  const result = await form.value.validate();
  return result.valid;
}

async function submit() {
  if (!(await validate()) || !(props.storeUrl || props.updateUrl)) {
    return;
  }

  throw 'Not implemented yet!';
}

async function getValues(): Promise<any> {
  if (await validate()) {
    return form.value?.values;
  }

  return null;
}

function reset() {
  if (!form.value) {
    return;
  }

  form.value.resetForm();
}

defineExpose({ submit, getValues, reset, validate, valid });
</script>
