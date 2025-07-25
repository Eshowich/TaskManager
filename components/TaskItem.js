import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  formatDate, 
  formatTime, 
  isTaskOverdue, 
  isTaskDueToday, 
  isTaskDueSoon,
  taskHasTime 
} from '../utils/taskHelpers';

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete }) => {
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(task.id) },
      ]
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#FF4444';
      case 'medium': return '#FFA500';
      case 'low': return '#4CAF50';
      default: return '#757575';
    }
  };

  const getDueDateStyle = () => {
    if (!task.dueDate || task.completed) {
      return { color: '#757575' };
    }
    
    if (isTaskOverdue(task)) {
      return { color: '#FF4444', fontWeight: '600' };
    }
    if (isTaskDueToday(task)) {
      return { color: '#FF6B35', fontWeight: '600' };
    }
    if (isTaskDueSoon(task)) {
      return { color: '#FFA500', fontWeight: '500' };
    }
    
    return { color: '#757575' };
  };

  const getDueDateIcon = () => {
    if (!task.dueDate) return 'calendar-outline';
    
    if (isTaskOverdue(task)) return 'warning-outline';
    if (isTaskDueToday(task)) return 'today-outline';
    if (taskHasTime(task)) return 'time-outline';
    
    return 'calendar-outline';
  };

  const dueDateStyle = getDueDateStyle();
  const hasTime = taskHasTime(task);
  const isOverdue = isTaskOverdue(task);

  return (
    <View style={[
      styles.container,
      task.completed && styles.completedContainer,
      isOverdue && !task.completed && styles.overdueContainer,
    ]}>
      <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(task.priority) }]} />
      
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => onToggleComplete(task.id)}
      >
        <Ionicons
          name={task.completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={task.completed ? '#4CAF50' : '#757575'}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={[
          styles.title,
          task.completed && styles.completedText,
        ]}>
          {task.title}
        </Text>
        
        {task.description && (
          <Text style={[
            styles.description,
            task.completed && styles.completedText,
          ]}>
            {task.description}
          </Text>
        )}

        <View style={styles.metadata}>
          {task.dueDate && (
            <View style={styles.dueDateContainer}>
              <Ionicons
                name={getDueDateIcon()}
                size={14}
                color={dueDateStyle.color}
              />
              <View style={styles.dueDateTextContainer}>
                <Text style={[
                  styles.dueDate,
                  dueDateStyle,
                  task.completed && styles.completedText,
                ]}>
                  {formatDate(task.dueDate)}
                </Text>
                {hasTime && (
                  <Text style={[
                    styles.dueTime,
                    dueDateStyle,
                    task.completed && styles.completedText,
                  ]}>
                    {formatTime(task.dueDate)}
                  </Text>
                )}
              </View>
            </View>
          )}
          
          <View style={styles.priorityBadge}>
            <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
              {task.priority.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(task)}
        >
          <Ionicons name="pencil-outline" size={20} color="#2196F3" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={20} color="#FF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  completedContainer: {
    backgroundColor: '#F8F9FA',
    opacity: 0.7,
  },
  overdueContainer: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF4444',
    backgroundColor: '#FFF5F5',
  },
  priorityIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 12,
  },
  checkbox: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
    lineHeight: 20,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dueDateTextContainer: {
    marginLeft: 4,
  },
  dueDate: {
    fontSize: 12,
    color: '#757575',
  },
  dueTime: {
    fontSize: 11,
    color: '#757575',
    fontWeight: '500',
    marginTop: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    marginLeft: 12,
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
});

export default TaskItem; 