<<<<<<< HEAD
# Task Manager

A React Native task management application built with Expo, featuring local storage, smart sorting, and intuitive task organization.

## Features

### Core Functionality
- Create, edit, and delete tasks
- Mark tasks as complete/incomplete
- Search tasks by title or description
- Filter tasks (All, Active, Completed)
- Multiple sort options (Smart, Priority, Due Date, A-Z, Created)

### Task Management
- **Priority Levels**: Low, Medium, High with color coding
- **Due Dates**: Calendar picker with optional time
- **Visual Indicators**: Overdue warnings, priority badges
- **Smart Sorting**: Automatically prioritizes by importance and urgency

### User Experience
- Clean, modern interface
- Pull-to-refresh functionality
- Local data persistence
- Empty state messaging
- Task preview while creating

## Technical Implementation

### Architecture
- **Components**: Modular component structure
- **Utils**: Separated business logic and storage
- **State Management**: React hooks for local state
- **Data Persistence**: AsyncStorage for offline functionality

### Key Technologies
- React Native & Expo
- AsyncStorage for local storage
- Expo Vector Icons for UI elements
- DateTimePicker for date/time selection

### Code Organization
```
TaskManager/
├── App.js                 # Main application component
├── components/           
│   ├── TaskItem.js       # Individual task display
│   ├── TaskForm.js       # Create/edit task modal
│   └── FilterBar.js      # Search, filter, and sort controls
└── utils/
    ├── storage.js        # AsyncStorage operations
    └── taskHelpers.js    # Task manipulation utilities
```

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Run on Device**
   - Scan QR code with Expo Go app
   - Or run on iOS/Android emulator

## Dependencies

```json
{
  "@react-native-async-storage/async-storage": "^1.23.1",
  "@react-native-community/datetimepicker": "^7.6.2",
  "@expo/vector-icons": "^14.0.0"
}
```

Built with modern React Native practices and clean code principles. 
=======
# TaskManager
Task manager React Native
>>>>>>> 73f4d3848220dc6f82757c1f4a13c19b9f615d52
