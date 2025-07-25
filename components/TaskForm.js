import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
  Platform,
  Switch,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

const TaskForm = ({ visible, task, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hasDate, setHasDate] = useState(false);
  const [hasTime, setHasTime] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      
      if (task.dueDate) {
        const taskDate = new Date(task.dueDate);
        setSelectedDate(taskDate);
        setHasDate(true);
        const hasSpecificTime = taskDate.getHours() !== 0 || taskDate.getMinutes() !== 0;
        setHasTime(hasSpecificTime);
      } else {
        setSelectedDate(new Date());
        setHasDate(false);
        setHasTime(false);
      }
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setSelectedDate(new Date());
      setHasDate(false);
      setHasTime(false);
    }
  }, [task, visible]);

  const handleSave = () => {
    const trimmedTitle = title.trim();
    
    if (!trimmedTitle) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    let finalDueDate = null;
    if (hasDate) {
      const dateToSave = new Date(selectedDate);
      if (!hasTime) {
        dateToSave.setHours(0, 0, 0, 0);
      }
      finalDueDate = dateToSave.toISOString();
    }

    const taskData = {
      title: trimmedTitle,
      description: description.trim(),
      priority,
      dueDate: finalDueDate,
    };

    onSave(taskData);
  };

  const onDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      const newDate = new Date(date);
      if (hasTime) {
        newDate.setHours(selectedDate.getHours());
        newDate.setMinutes(selectedDate.getMinutes());
      }
      setSelectedDate(newDate);
    }
  };

  const onTimeChange = (event, time) => {
    setShowTimePicker(false);
    if (time) {
      const newDate = new Date(selectedDate);
      newDate.setHours(time.getHours());
      newDate.setMinutes(time.getMinutes());
      setSelectedDate(newDate);
    }
  };

  const setQuickDate = (days) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + days);
    if (hasTime) {
      newDate.setHours(selectedDate.getHours());
      newDate.setMinutes(selectedDate.getMinutes());
    } else {
      newDate.setHours(0, 0, 0, 0);
    }
    setSelectedDate(newDate);
    setHasDate(true);
  };

  const formatDateDisplay = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateString = date.toDateString();
    
    if (dateString === today.toDateString()) {
      return 'Today';
    }
    if (dateString === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    
    const currentYear = today.getFullYear();
    const options = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    };
    
    if (date.getFullYear() !== currentYear) {
      options.year = 'numeric';
    }
    
    return date.toLocaleDateString('en-US', options);
  };

  const formatTimeDisplay = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getPriorityColor = (priorityLevel) => {
    switch (priorityLevel) {
      case 'high': return '#FF4444';
      case 'medium': return '#FFA500';
      case 'low': return '#4CAF50';
      default: return '#757575';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onCancel}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel} style={styles.headerButton}>
            <Ionicons name="close" size={24} color="#757575" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>
            {task ? 'Edit Task' : 'New Task'}
          </Text>
          
          <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter task title"
              placeholderTextColor="#999999"
              returnKeyType="next"
              maxLength={100}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter task description (optional)"
              placeholderTextColor="#999999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityContainer}>
              {['low', 'medium', 'high'].map((priorityLevel) => (
                <TouchableOpacity
                  key={priorityLevel}
                  style={[
                    styles.priorityButton,
                    priority === priorityLevel && styles.priorityButtonActive,
                    { borderColor: getPriorityColor(priorityLevel) },
                    priority === priorityLevel && { backgroundColor: getPriorityColor(priorityLevel) },
                  ]}
                  onPress={() => setPriority(priorityLevel)}
                >
                  <Text style={[
                    styles.priorityButtonText,
                    priority === priorityLevel && styles.priorityButtonTextActive,
                  ]}>
                    {priorityLevel.charAt(0).toUpperCase() + priorityLevel.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.sectionHeader}>
              <Text style={styles.label}>Due Date</Text>
              <Switch
                value={hasDate}
                onValueChange={setHasDate}
                trackColor={{ false: '#E0E0E0', true: '#2196F3' }}
                thumbColor={hasDate ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>

            {hasDate && (
              <>
                <View style={styles.quickDateContainer}>
                  <TouchableOpacity
                    style={styles.quickDateButton}
                    onPress={() => setQuickDate(0)}
                  >
                    <Text style={styles.quickDateText}>Today</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.quickDateButton}
                    onPress={() => setQuickDate(1)}
                  >
                    <Text style={styles.quickDateText}>Tomorrow</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.quickDateButton}
                    onPress={() => setQuickDate(7)}
                  >
                    <Text style={styles.quickDateText}>Next Week</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.dateTimeButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Ionicons name="calendar-outline" size={20} color="#2196F3" />
                  <Text style={styles.dateTimeButtonText}>
                    {formatDateDisplay(selectedDate)}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#757575" />
                </TouchableOpacity>

                <View style={styles.sectionHeader}>
                  <Text style={styles.subLabel}>Add specific time</Text>
                  <Switch
                    value={hasTime}
                    onValueChange={setHasTime}
                    trackColor={{ false: '#E0E0E0', true: '#2196F3' }}
                    thumbColor={hasTime ? '#FFFFFF' : '#FFFFFF'}
                  />
                </View>

                {hasTime && (
                  <TouchableOpacity
                    style={styles.dateTimeButton}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Ionicons name="time-outline" size={20} color="#2196F3" />
                    <Text style={styles.dateTimeButtonText}>
                      {formatTimeDisplay(selectedDate)}
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color="#757575" />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>

          {title.trim() && (
            <View style={styles.previewContainer}>
              <Text style={styles.previewLabel}>Preview</Text>
              <View style={styles.previewTask}>
                <View style={[styles.previewPriorityIndicator, { backgroundColor: getPriorityColor(priority) }]} />
                <View style={styles.previewContent}>
                  <Text style={styles.previewTitle}>{title.trim()}</Text>
                  {description.trim() && (
                    <Text style={styles.previewDescription}>{description.trim()}</Text>
                  )}
                  <View style={styles.previewMetadata}>
                    {hasDate && (
                      <Text style={styles.previewDueDate}>
                        Due: {formatDateDisplay(selectedDate)}
                        {hasTime && ` at ${formatTimeDisplay(selectedDate)}`}
                      </Text>
                    )}
                    <Text style={[styles.previewPriority, { color: getPriorityColor(priority) }]}>
                      {priority.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onTimeChange}
          />
        )}
      </View>
    </Modal>
  );
};

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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerButton: {
    padding: 8,
    minWidth: 60,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
    textAlign: 'right',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#757575',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#212121',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: '#2196F3',
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
  priorityButtonTextActive: {
    color: '#FFFFFF',
  },
  quickDateContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  quickDateButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  quickDateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2196F3',
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 12,
  },
  dateTimeButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
    marginLeft: 12,
  },
  previewContainer: {
    marginTop: 16,
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 12,
  },
  previewTask: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  previewPriorityIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 12,
  },
  previewContent: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  previewDescription: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
    lineHeight: 20,
  },
  previewMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewDueDate: {
    fontSize: 12,
    color: '#757575',
  },
  previewPriority: {
    fontSize: 10,
    fontWeight: '700',
  },
});

export default TaskForm; 