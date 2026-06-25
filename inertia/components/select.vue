<template>
  <div ref="containerRef" class="searchable-select position-relative">
    <button
      ref="triggerRef"
      type="button"
      class="form-select form-select-sm text-start d-flex align-items-center pe-3"
      :class="{ 'is-invalid': props.invalid }"
      :disabled="props.disabled"
      :id="props.id"
      :name="props.name"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      @click="toggleDropdown"
      @keydown.enter.prevent="openDropdown"
      @keydown.space.prevent="openDropdown"
      @keydown.down.prevent="openDropdown"
    >
      <span class="text-truncate flex-grow-1 text-start">{{ displayText }}</span>
      <i class="bi bi-chevron-down chevron-icon flex-shrink-0" :class="{ open: isOpen }"></i>
    </button>

    <div v-if="isOpen" class="dropdown-menu show w-100 p-0 mt-1 shadow-sm" @click.stop>
      <div v-if="props.searchable" class="p-2 border-bottom">
        <div class="input-group input-group-sm">
          <span class="input-group-text bg-transparent border-end-0">
            <i class="bi bi-search"></i>
          </span>
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            class="search-input form-control form-control-sm border-start-0"
            :placeholder="t('app.terms.search')"
            @keydown="handleSearchKeydown"
            @click.stop
          />
          <button
            v-if="searchQuery"
            class="btn btn-sm btn-outline-secondary border-start-0"
            tabindex="-1"
            @click="searchQuery = ''"
          >
            <i class="bi bi-x"></i>
          </button>
        </div>
      </div>

      <ul
        ref="listRef"
        class="list-unstyled mb-0 overflow-auto"
        role="listbox"
        style="max-height: 260px"
      >
        <li
          v-for="(option, index) in filteredOptions"
          :key="index"
          role="option"
          :aria-selected="isSelected(option.value)"
          :class="[
            'dropdown-item py-1 px-3',
            {
              active: isSelected(option.value),
              highlighted: highlightedIndex === index && !isSelected(option.value),
            },
          ]"
          @click="selectOption(option.value)"
          @mouseenter="highlightedIndex = index"
        >
          {{ option.label }}
        </li>
        <li
          v-if="filteredOptions.length === 0"
          class="dropdown-item disabled text-center py-3 text-muted"
        >
          {{ t('app.terms.noRecordsFound') }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted, PropType } from 'vue';
import { SelectOption } from './types';
import { useI18n } from '~/lib/i18n';

const { t } = useI18n();

defineOptions({
  inheritAttrs: false,
});

const selectModel = defineModel<any>({});

const props = defineProps({
  id: {
    type: String,
    required: false,
    default: '',
  },
  name: {
    type: String,
    required: false,
    default: '',
  },
  placeholder: {
    type: String,
    required: false,
    default: '',
  },
  required: {
    type: Boolean,
    required: false,
    default: false,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  invalid: {
    type: Boolean,
    required: false,
    default: false,
  },
  options: {
    type: Array as PropType<SelectOption[]>,
    required: false,
    default: () => [],
  },
  searchable: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const isOpen = ref(false);
const searchQuery = ref('');
const highlightedIndex = ref(0);

const containerRef = ref<HTMLElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const listRef = ref<HTMLElement | null>(null);

const displayText = computed(() => {
  if (selectModel.value == null || selectModel.value === '') {
    return props.placeholder;
  }

  const option = props.options.find((o) => o.value === selectModel.value);
  return option ? option.label : String(selectModel.value);
});

const filteredOptions = computed(() => {
  if (!searchQuery.value) {
    return props.options;
  }

  const q = searchQuery.value.toLowerCase();

  return props.options.filter((o) => o.label.toLowerCase().includes(q));
});

function isSelected(value: any): boolean {
  return selectModel.value === value;
}

function toggleDropdown() {
  if (isOpen.value) {
    closeDropdown();
  } else {
    openDropdown();
  }
}

function openDropdown() {
  if (props.disabled) {
    return;
  }

  isOpen.value = true;
  searchQuery.value = '';
  highlightedIndex.value = 0;

  nextTick(() => {
    if (props.searchable) {
      searchInputRef.value?.focus();
    }
  });
}

function closeDropdown() {
  isOpen.value = false;
  searchQuery.value = '';

  nextTick(() => {
    triggerRef.value?.focus();
  });
}

function selectOption(value: any) {
  selectModel.value = value;
  closeDropdown();
}

function handleSearchKeydown(e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowDown': {
      e.preventDefault();

      if (highlightedIndex.value < filteredOptions.value.length - 1) {
        highlightedIndex.value++;
      }

      break;
    }

    case 'ArrowUp': {
      e.preventDefault();

      if (highlightedIndex.value > 0) {
        highlightedIndex.value--;
      }

      break;
    }

    case 'Enter': {
      e.preventDefault();

      const option = filteredOptions.value[highlightedIndex.value];

      if (option) {
        selectOption(option.value);
      }

      break;
    }

    case 'Escape': {
      e.preventDefault();
      closeDropdown();
      break;
    }
  }
}

watch(highlightedIndex, () => {
  nextTick(() => {
    if (!listRef.value) {
      return;
    }

    const item = listRef.value.children[highlightedIndex.value] as HTMLElement | undefined;
    item?.scrollIntoView({ block: 'nearest' });
  });
});

function handleClickOutside(e: MouseEvent) {
  if (isOpen.value && containerRef.value && !containerRef.value.contains(e.target as Node)) {
    closeDropdown();
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<style scoped>
.form-select {
  background-image: none !important;
  cursor: pointer;
}

.chevron-icon {
  transition: transform 0.2s ease;
  font-size: 0.75rem;
}

.chevron-icon.open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  inset: 100% 0 auto 0;
  z-index: 1050;
}

.highlighted {
  background-color: var(--bs-tertiary-bg);
}

.search-input:focus {
  outline: none !important;
  box-shadow: none !important;
  border-color: var(--bs-border-color);
}
</style>
