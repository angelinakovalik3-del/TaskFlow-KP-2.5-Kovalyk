
<template>
  <f7-page name="tasks">
    <f7-navbar title="Мої завдання" />

    <div class="app-content">
      <div class="page-heading">
        <h1>Завдання</h1>
        <p>Список поточних завдань</p>
      </div>

      <!-- Фільтрація завдань -->
      <div class="task-filters">
        <label>
          Фільтр за статусом:
          <select v-model="statusFilter">
            <option value="all">Усі статуси</option>
            <option value="todo">Заплановано</option>
            <option value="progress">У роботі</option>
            <option value="done">Виконано</option>
          </select>
        </label>

        <label>
          Фільтр за пріоритетом:
          <select v-model="priorityFilter">
            <option value="all">Усі пріоритети</option>
            <option value="low">Низький</option>
            <option value="medium">Середній</option>
            <option value="high">Високий</option>
          </select>
        </label>
      </div>

      <div class="filter-summary">
        Знайдено завдань: {{ filteredTasks.length }}
      </div>

      <!-- Список завдань -->
      <div class="task-list">
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="task-row task-row-detail"
        >
          <f7-icon
            :f7="task.status === 'done'
              ? 'checkmark_circle_fill'
              : 'circle'"
            :class="{
              'completed-icon': task.status === 'done'
            }"
          />

          <div class="task-details">
            <div class="task-title">
              {{ task.title }}
            </div>

            <div class="task-description">
              {{ task.description }}
            </div>

            <div
              class="task-status"
              :class="`status-${task.status}`"
            >
              {{ statusLabel(task.status) }}
            </div>

            <div class="task-priority">
              Пріоритет: {{ priorityLabel(task.priority) }}
            </div>

            <!-- Редагування завдання -->
            <div class="task-actions">
              <label>
                Статус:
                <select
                  :value="task.status"
                  @change="updateTaskStatus(
                    task.id,
                    $event.target.value
                  )"
                >
                  <option value="todo">Заплановано</option>
                  <option value="progress">У роботі</option>
                  <option value="done">Виконано</option>
                </select>
              </label>

              <label>
                Пріоритет:
                <select
                  :value="task.priority"
                  @change="updateTaskPriority(
                    task.id,
                    $event.target.value
                  )"
                >
                  <option value="low">Низький</option>
                  <option value="medium">Середній</option>
                  <option value="high">Високий</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Повідомлення, якщо завдань немає -->
      <div
        v-if="filteredTasks.length === 0"
        class="empty-state"
      >
        За вибраними фільтрами завдань не знайдено.
      </div>

      <!-- Кнопка скидання фільтрів -->
      <f7-button
        outline
        large
        class="reset-filters"
        @click="resetFilters"
      >
        Скинути фільтри
      </f7-button>
    </div>

    <AppTabbar active="tasks" />
  </f7-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import AppTabbar from '../components/AppTabbar.vue';

import {
  tasksStore,
  updateTaskStatus,
  updateTaskPriority
} from '../store/tasks.js';

const statusFilter = ref('all');
const priorityFilter = ref('all');

const filteredTasks = computed(() =>
  tasksStore.tasks.filter(task => {
    const matchesStatus =
      statusFilter.value === 'all' ||
      task.status === statusFilter.value;

    const matchesPriority =
      priorityFilter.value === 'all' ||
      task.priority === priorityFilter.value;

    return matchesStatus && matchesPriority;
  })
);

function resetFilters() {
  statusFilter.value = 'all';
  priorityFilter.value = 'all';
}

function statusLabel(status) {
  return {
    todo: 'Заплановано',
    progress: 'У роботі',
    done: 'Виконано'
  }[status] ?? status;
}

function priorityLabel(priority) {
  return {
    low: 'Низький',
    medium: 'Середній',
    high: 'Високий'
  }[priority] ?? priority;
}
</script>
