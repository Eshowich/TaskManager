export const generateTaskId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const createTask = (title, description = '', dueDate = null, priority = 'medium') => {
  return {
    id: generateTaskId(),
    title: title.trim(),
    description: description.trim(),
    completed: false,
    priority,
    dueDate,
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
};

export const filterTasks = (tasks, filter) => {
  switch (filter) {
    case 'active':
      return tasks.filter(task => !task.completed);
    case 'completed':
      return tasks.filter(task => task.completed);
    default:
      return tasks;
  }
};

export const searchTasks = (tasks, searchQuery) => {
  if (!searchQuery.trim()) {
    return tasks;
  }
  
  const query = searchQuery.toLowerCase();
  return tasks.filter(task => 
    task.title.toLowerCase().includes(query) || 
    task.description.toLowerCase().includes(query)
  );
};

export const sortTasks = (tasks) => {
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      if (a.completed) {
        return 1;
      } else {
        return -1;
      }
    }
    
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) {
      return priorityDiff;
    }
    
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (a.dueDate) {
      return -1;
    }
    if (b.dueDate) {
      return 1;
    }
    
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};

export const sortTasksByPriority = (tasks) => {
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      if (a.completed) {
        return 1;
      } else {
        return -1;
      }
    }
    
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) {
      return priorityDiff;
    }
    
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};

export const sortTasksByDueDate = (tasks) => {
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      if (a.completed) {
        return 1;
      } else {
        return -1;
      }
    }
    
    if (a.dueDate && !b.dueDate) {
      return -1;
    }
    if (!a.dueDate && b.dueDate) {
      return 1;
    }
    
    if (a.dueDate && b.dueDate) {
      const dateComparison = new Date(a.dueDate) - new Date(b.dueDate);
      if (dateComparison !== 0) {
        return dateComparison;
      }
    }
    
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};

export const sortTasksAlphabetically = (tasks) => {
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      if (a.completed) {
        return 1;
      } else {
        return -1;
      }
    }
    
    return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
  });
};

export const sortTasksByCreated = (tasks) => {
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      if (a.completed) {
        return 1;
      } else {
        return -1;
      }
    }
    
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};

export const sortTasksBy = (tasks, sortBy) => {
  switch (sortBy) {
    case 'priority':
      return sortTasksByPriority(tasks);
    case 'dueDate':
      return sortTasksByDueDate(tasks);
    case 'alphabetical':
      return sortTasksAlphabetically(tasks);
    case 'created':
      return sortTasksByCreated(tasks);
    case 'smart':
    default:
      return sortTasks(tasks);
  }
};

export const formatDate = (dateString, includeTime = false) => {
  if (!dateString) {
    return '';
  }
  
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const hasSpecificTime = date.getHours() !== 0 || date.getMinutes() !== 0;
  
  let dateDisplay = '';
  
  if (date.toDateString() === today.toDateString()) {
    dateDisplay = 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    dateDisplay = 'Tomorrow';
  } else if (date.toDateString() === yesterday.toDateString()) {
    dateDisplay = 'Yesterday';
  } else {
    const isCurrentYear = date.getFullYear() === today.getFullYear();
    const options = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    };
    
    if (!isCurrentYear) {
      options.year = 'numeric';
    }
    
    dateDisplay = date.toLocaleDateString('en-US', options);
  }
  
  if (includeTime && hasSpecificTime) {
    const timeDisplay = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${dateDisplay} at ${timeDisplay}`;
  }
  
  return dateDisplay;
};

export const formatTime = (dateString) => {
  if (!dateString) {
    return '';
  }
  
  const date = new Date(dateString);
  const hasSpecificTime = date.getHours() !== 0 || date.getMinutes() !== 0;
  
  if (!hasSpecificTime) {
    return '';
  }
  
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const isTaskOverdue = (task) => {
  if (!task.dueDate || task.completed) {
    return false;
  }
  
  const dueDate = new Date(task.dueDate);
  const now = new Date();
  
  const hasSpecificTime = dueDate.getHours() !== 0 || dueDate.getMinutes() !== 0;
  
  if (hasSpecificTime) {
    return dueDate < now;
  } else {
    const dueDateEndOfDay = new Date(dueDate);
    dueDateEndOfDay.setHours(23, 59, 59, 999);
    return dueDateEndOfDay < now;
  }
};

export const isTaskDueToday = (task) => {
  if (!task.dueDate || task.completed) {
    return false;
  }
  
  const dueDate = new Date(task.dueDate);
  const today = new Date();
  
  return dueDate.toDateString() === today.toDateString();
};

export const isTaskDueSoon = (task) => {
  if (!task.dueDate || task.completed) {
    return false;
  }
  
  const dueDate = new Date(task.dueDate);
  const now = new Date();
  const threeDaysFromNow = new Date(now);
  threeDaysFromNow.setDate(now.getDate() + 3);
  
  return dueDate >= now && dueDate <= threeDaysFromNow;
};

export const getTimeUntilDue = (task) => {
  if (!task.dueDate) {
    return '';
  }
  
  const dueDate = new Date(task.dueDate);
  const now = new Date();
  const diffMs = dueDate - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    const dayText = overdueDays === 1 ? '' : 's';
    return `${overdueDays} day${dayText} overdue`;
  } else if (diffDays === 0) {
    return 'Due today';
  } else if (diffDays === 1) {
    return 'Due tomorrow';
  } else {
    return `Due in ${diffDays} days`;
  }
};

export const taskHasTime = (task) => {
  if (!task.dueDate) {
    return false;
  }
  
  const date = new Date(task.dueDate);
  return date.getHours() !== 0 || date.getMinutes() !== 0;
}; 