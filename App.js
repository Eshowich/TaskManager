import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import TaskItem from './components/TaskItem';
import TaskForm from './components/TaskForm';
import FilterBar from './components/FilterBar';
import { saveTasks, loadTasks } from './utils/storage';
import { 
  createTask, 
  filterTasks, 
  searchTasks, 
  sortTasksBy 
} from './utils/taskHelpers';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('smart');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTasksFromStorage();
  }, []);

  useEffect(() => {
    updateFilteredTasks();
  }, [tasks, searchQuery, activeFilter, sortBy]);

  const loadTasksFromStorage = async () => {
    try {
      setIsLoading(true);
      const savedTasks = await loadTasks();
      setTasks(savedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      Alert.alert('Error', 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const saveTasksToStorage = async (updatedTasks) => {
    try {
      await saveTasks(updatedTasks);
    } catch (error) {
      console.error('Error saving tasks:', error);
      Alert.alert('Error', 'Failed to save tasks');
    }
  };

  const updateFilteredTasks = () => {
    let filtered = filterTasks(tasks, activeFilter);
    filtered = searchTasks(filtered, searchQuery);
    filtered = sortTasksBy(filtered, sortBy);
    setFilteredTasks(filtered);
  };

  const getTaskCounts = () => ({
    all: tasks.length,
    active: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length,
  });

  const handleAddTask = (taskData) => {
    const newTask = createTask(
      taskData.title,
      taskData.description,
      taskData.dueDate,
      taskData.priority
    );
    
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
    setShowTaskForm(false);
  };

  const handleEditTask = (taskData) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === editingTask.id) {
        return { 
          ...task, 
          ...taskData,
          completedAt: task.completed ? task.completedAt : null,
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleTaskFormSubmit = (taskData) => {
    if (editingTask) {
      handleEditTask(taskData);
    } else {
      handleAddTask(taskData);
    }
  };

  const handleEditPress = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleFormCancel = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleToggleComplete = (taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { 
          ...task, 
          completed: !task.completed,
          completedAt: !task.completed ? new Date().toISOString() : null,
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTasksFromStorage();
    setRefreshing(false);
  };

  const handleClearCompleted = () => {
    const completedCount = tasks.filter(task => task.completed).length;
    
    if (completedCount === 0) {
      Alert.alert('No Completed Tasks', 'There are no completed tasks to clear.');
      return;
    }

    const message = `Are you sure you want to delete ${completedCount} completed task${completedCount > 1 ? 's' : ''}?`;
    
    Alert.alert(
      'Clear Completed Tasks',
      message,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive', 
          onPress: () => {
            const updatedTasks = tasks.filter(task => !task.completed);
            setTasks(updatedTasks);
            saveTasksToStorage(updatedTasks);
          }
        },
      ]
    );
  };

  const renderEmptyState = () => {
    const getEmptyMessage = () => {
      if (searchQuery.trim()) {
        return {
          icon: 'search-outline',
          title: 'No tasks found',
          subtitle: `No tasks match "${searchQuery}"`,
        };
      }
      
      switch (activeFilter) {
        case 'active':
          return {
            icon: 'checkmark-circle-outline',
            title: 'No active tasks',
            subtitle: 'All caught up! Great job.',
          };
        case 'completed':
          return {
            icon: 'list-outline',
            title: 'No completed tasks',
            subtitle: 'Complete some tasks to see them here.',
          };
        default:
          return {
            icon: 'add-circle-outline',
            title: 'No tasks yet',
            subtitle: 'Tap the + button to create your first task.',
          };
      }
    };

    const { icon, title, subtitle } = getEmptyMessage();

    return (
      <View style={styles.emptyState}>
        <Ionicons name={icon} size={64} color="#E0E0E0" />
        <Text style={styles.emptyStateTitle}>{title}</Text>
        <Text style={styles.emptyStateSubtitle}>{subtitle}</Text>
      </View>
    );
  };

  const renderTaskItem = ({ item }) => (
    <TaskItem
      task={item}
      onToggleComplete={handleToggleComplete}
      onEdit={handleEditPress}
      onDelete={handleDeleteTask}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Task Manager</Text>
          <Text style={styles.headerSubtitle}>
            {getTaskCounts().active} active, {getTaskCounts().completed} completed
          </Text>
        </View>
        <View style={styles.headerRight}>
          {activeFilter === 'completed' && getTaskCounts().completed > 0 && (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleClearCompleted}
            >
              <Ionicons name="trash-outline" size={20} color="#FF4444" />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowTaskForm(true)}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        taskCounts={getTaskCounts()}
      />

      <FlatList
        data={filteredTasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        style={styles.taskList}
        contentContainerStyle={[
          styles.taskListContent,
          filteredTasks.length === 0 && styles.taskListContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
      />

      <TaskForm
        visible={showTaskForm}
        task={editingTask}
        onSave={handleTaskFormSubmit}
        onCancel={handleFormCancel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#757575',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  addButton: {
    backgroundColor: '#2196F3',
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  taskList: {
    flex: 1,
  },
  taskListContent: {
    paddingVertical: 8,
  },
  taskListContentEmpty: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#9E9E9E',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#BDBDBD',
    textAlign: 'center',
    lineHeight: 24,
  },
});
