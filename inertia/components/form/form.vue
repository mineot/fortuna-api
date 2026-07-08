<template>
  <Form
    :initial-values="props.initValues"
    :validation-schema="schema"
    class="d-flex flex-column gap-2 py-2"
    ref="form"
    v-slot="{ errors }"
  >
    <FormErrorsProvider :errors="errors">
      <slot :errors="errors" :form="form" />
    </FormErrorsProvider>
  </Form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Form } from 'vee-validate';
import { formProps, RuleObjectItem } from './form.types';
import FormErrorsProvider from './form-errors-provider.vue';
import * as yup from 'yup';

const form = ref<InstanceType<typeof Form> | null>(null);
const valid = computed(() => form.value?.meta.valid ?? true);
const props = defineProps(formProps);

const schema = computed(() => {
  const rules: Record<string, any> = {};

  Object.keys(props.rules).forEach((name: string) => {
    const item: RuleObjectItem = props.rules[name];

    switch (item.type) {
      case 'text':
      case 'email':
      case 'password':
        rules[name] = yup.string();
        break;
      case 'select':
        rules[name] = yup.mixed();
        break;
    }

    if (item.rules.REQUIRED) {
      rules[name] = rules[name].required(item.rules.REQUIRED);
    }

    if (item.rules.EMAIL) {
      rules[name] = rules[name].email(item.rules.EMAIL);
    }

    if (item.rules.WHEN?.length) {
      for (const [index, when] of item.rules.WHEN.entries()) {
        rules[name] = rules[name].test(
          `when-${when.field}-${index}`,
          when.message,
          (value: unknown, { parent }: { parent: Record<string, any> }) => {
            const triggerValue = parent[when.field];
            const triggerFilled =
              triggerValue !== undefined && triggerValue !== null && triggerValue !== '';

            if (!triggerFilled) {
              return true;
            }

            return value !== undefined && value !== null && value !== '';
          },
        );
      }
    }

    if (item.rules.EQUAL?.length) {
      for (const equal of item.rules.EQUAL) {
        rules[name] = rules[name].oneOf([yup.ref(equal.field)], equal.message);
      }
    }

    if (item.rules.LENGTH) {
      rules[name] = rules[name].length(item.rules.LENGTH.value, item.rules.LENGTH.message);
    }

    if (item.rules.MIN) {
      rules[name] = rules[name].min(item.rules.MIN.value, item.rules.MIN.message);
    }

    if (item.rules.MAX) {
      rules[name] = rules[name].max(item.rules.MAX.value, item.rules.MAX.message);
    }
  });

  return yup.object(rules);
});

async function validate(): Promise<boolean> {
  if (!form.value) {
    return false;
  }

  const result = await form.value.validate();
  return result.valid;
}

async function getValues(): Promise<any> {
  if (await validate()) {
    return form.value?.values ?? null;
  }

  return null;
}

function reset() {
  if (!form.value) {
    return;
  }

  form.value.resetForm();
}

defineExpose({ getValues, reset, validate, valid });
</script>
