
import { reactive, computed, watch } from 'vue';
import { tasks as initialTasks } from '../data/tasks.js';

const STORAGE_KEY = 'taskflow_tasks';

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Помилка завантаження:', error);
  }

  return initialTasks.map(task => ({ ...task }));
}

export const tasksStore = reactive({
  tasks: loadTasks()
});

watch(
  () => tasksStore.tasks,
  (tasks) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
      );
    } catch (error) {
      console.error('Помилка збереження:', error);
    }
  },
  { deep: true }
);

export const completedTasks = computed(() =>
  tasksStore.tasks.filter(task => task.status === 'done')
);

export const inProgressTasks = computed(() =>
  tasksStore.tasks.filter(task => task.status === 'progress')
);

export const plannedTasks = computed(() =>
  tasksStore.tasks.filter(task => task.status === 'todo')
);

export function updateTaskStatus(id, status) {
  const task = tasksStore.tasks.find(task => task.id === id);

  if (task && ['todo', 'progress', 'done'].includes(status)) {
    task.status = status;
  }
}

export function updateTaskPriority(id, priority) {
  const task = tasksStore.tasks.find(task => task.id === id);

  if (task && ['low', 'medium', 'high'].includes(priority)) {
    task.priority = priority;
  }
}
