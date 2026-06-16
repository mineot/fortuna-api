<template>
  <div class="d-flex flex-column gap-0">
    <label :for="props.id" class="form-label m-0 d-flex gap-2 align-items-center">
      <span>{{ props.label }}</span>
      <span v-if="props.required" class="required">*</span>
    </label>

    <Input
      :id="props.id"
      :invalid="isInvalid"
      :name="props.name"
      :required="props.required"
      :type="props.type as InputTypes"
      v-model="formControlModel"
    />

    <!--
    textarea 

    dropdown

    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="" id="checkChecked" checked />
      <label class="form-check-label" for="checkChecked"> Checked checkbox </label>
    </div>

    <div class="form-check">
      <input class="form-check-input" type="radio" name="radioDefault" id="radioDefault1" />
      <label class="form-check-label" for="radioDefault1"> Default radio </label>
    </div>
    <div class="form-check">
      <input class="form-check-input" type="radio" name="radioDefault" id="radioDefault2" checked />
      <label class="form-check-label" for="radioDefault2"> Default checked radio </label>
    </div>

    <label for="range1" class="form-label">Example range</label>
    <input type="range" class="form-range" id="range1" /> 
    -->

    <div v-if="isInvalid" class="invalid-feedback d-block">
      {{ getErrorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ErrorType, FormControlTypes, InputTypes, ModelValueTypes } from './types.js';
import { computed, PropType } from 'vue';
import Input from './input.vue';

const formControlModel = defineModel({
  type: Object as PropType<ModelValueTypes>,
});

const props = defineProps({
  type: {
    type: String as PropType<FormControlTypes>,
    required: false,
    default: 'text',
  },
  name: {
    type: String,
    required: false,
    default: '',
  },
  id: {
    type: String,
    required: false,
    default: '',
  },
  errors: {
    type: Object as PropType<ErrorType>,
    required: false,
    default: {},
  },
  required: {
    type: Boolean,
    required: false,
    default: false,
  },
  label: {
    type: String,
    required: false,
    default: 'Form Control',
  },
});

const isInvalid = computed<boolean>(() => {
  return props.errors[props.name] !== undefined;
});

const getErrorMessage = computed<string>(() => {
  return props.errors[props.name] ?? '';
});
</script>
