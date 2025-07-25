import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = '@TaskManager:tasks';

export const saveTasks = async (tasks) => {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

export const loadTasks = async () => {
  try {
    const tasksJson = await AsyncStorage.getItem(TASKS_KEY);
    if (tasksJson) {
      return JSON.parse(tasksJson);
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

export const clearTasks = async () => {
  try {
    await AsyncStorage.removeItem(TASKS_KEY);
  } catch (error) {
    console.error('Error clearing tasks:', error);
  }
}; 