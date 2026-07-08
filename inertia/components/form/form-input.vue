<template>
  <Base :name="props.name" :label="props.label" :required="props.required">
    <Field
      :class="['form-control form-control-sm', { 'is-invalid': injectedErrors[props.name] }]"
      :name="props.name"
      :type="props.type"
      as="input"
      validate-on-input
    />

    <div v-if="props.type === 'password'" class="position-absolute top-0 end-0 px-2 py-1">
      <i
        :class="['bi bi-eye-fill', { 'd-none': pswdShow[props.name] }]"
        @click="togglePassword(props.name, true)"
        role="button"
      />

      <i
        :class="['bi bi-eye-slash-fill', { 'd-none': !pswdShow[props.name] }]"
        @click="togglePassword(props.name, false)"
        role="button"
      />
    </div>
  </Base>
</template>

<script setup lang="ts">
import { FormError, inputProps } from './form.types.js';
import { inject, ref } from 'vue';
import Base from './control.vue';

const props = defineProps(inputProps);
const injectedErrors = inject<FormError>('formErrors', {});
const pswdShow = ref<Record<string, boolean>>({});

function togglePassword(name: string, value: boolean) {
  pswdShow.value[name] = value;
}
</script>
