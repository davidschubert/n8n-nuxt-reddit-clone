<template>
  <div class="comment-sort-dropdown">
    <div class="dropdown-container">
      <label for="sort-select" class="sort-label">Sortieren nach:</label>
      <select 
        id="sort-select"
        v-model="currentSort" 
        @change="onSortChange"
        class="sort-select"
      >
        <option value="popular">Beliebt</option>
        <option value="new">Neu</option>
        <option value="old">Älteste</option>
        <option value="controversial">Kontrovers</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CommentSortType } from '~/types/comment'

interface Props {
  modelValue: CommentSortType
}

interface Emits {
  (e: 'update:modelValue', value: CommentSortType): void
  (e: 'change', value: CommentSortType): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const currentSort = computed({
  get: () => props.modelValue,
  set: (value: CommentSortType) => {
    emit('update:modelValue', value)
  }
})

const onSortChange = () => {
  emit('change', currentSort.value)
}
</script>

<style scoped>
.comment-sort-dropdown {
  margin-bottom: 1rem;
}

.dropdown-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.sort-select {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.sort-select:hover {
  border-color: #9ca3af;
}

.sort-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.sort-select:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>