<template>
  <Base :name="props.name" :label="props.label" :required="props.required">
    <Field v-slot="{ field: fp }" :name="props.name" validate-on-input>
      <Select
        :invalid="!!injectedErrors[props.name]"
        :modelValue="fp.value"
        :name="props.name"
        :options="props.options"
        :searchable="props.searchable"
        @update:modelValue="fp.onChange"
      />
    </Field>
  </Base>
</template>

<script setup lang="ts">
import { Field } from 'vee-validate';
import { inject } from 'vue';
import { FormError, selectProps } from './form.types.js';
import Base from './control.vue';
import Select from './select.vue';

const props = defineProps(selectProps);
const injectedErrors = inject<FormError>('formErrors', {});
</script>
