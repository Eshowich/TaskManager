import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FilterBar = ({ 
  searchQuery, 
  onSearchChange, 
  activeFilter, 
  onFilterChange,
  sortBy,
  onSortChange,
  taskCounts 
}) => {
  const [showSortModal, setShowSortModal] = useState(false);
  
  const filters = [
    { key: 'all', label: 'All', count: taskCounts.all },
    { key: 'active', label: 'Active', count: taskCounts.active },
    { key: 'completed', label: 'Done', count: taskCounts.completed },
  ];

  const sortOptions = [
    { 
      key: 'smart', 
      label: 'Smart Sort', 
      description: 'Priority, due date, then creation date',
      icon: 'sparkles-outline'
    },
    { 
      key: 'priority', 
      label: 'Priority', 
      description: 'High to low priority',
      icon: 'flag-outline'
    },
    { 
      key: 'dueDate', 
      label: 'Due Date', 
      description: 'Earliest due date first',
      icon: 'calendar-outline'
    },
    { 
      key: 'alphabetical', 
      label: 'A-Z', 
      description: 'Alphabetical by title',
      icon: 'text-outline'
    },
    { 
      key: 'created', 
      label: 'Created', 
      description: 'Most recently created',
      icon: 'time-outline'
    },
  ];

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.key === sortBy);
    if (option) {
      return option.label;
    }
    return 'Smart Sort';
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#757575" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Search tasks..."
          placeholderTextColor="#999999"
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#757575" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.controlsRow}>
        <View style={styles.filtersContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterTab,
                activeFilter === filter.key && styles.filterTabActive,
              ]}
              onPress={() => onFilterChange(filter.key)}
            >
              <Text 
                style={[
                  styles.filterTabText,
                  activeFilter === filter.key && styles.filterTabTextActive,
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                minimumFontScale={0.8}
              >
                {filter.label}
              </Text>
              <View style={[
                styles.countBadge,
                activeFilter === filter.key && styles.countBadgeActive,
              ]}>
                <Text style={[
                  styles.countText,
                  activeFilter === filter.key && styles.countTextActive,
                ]}>
                  {filter.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortModal(true)}
        >
          <Ionicons name="funnel-outline" size={16} color="#2196F3" />
          <Text 
            style={styles.sortButtonText}
            numberOfLines={1}
          >
            {getCurrentSortLabel()}
          </Text>
          <Ionicons name="chevron-down" size={14} color="#757575" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showSortModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort by</Text>
              <TouchableOpacity
                onPress={() => setShowSortModal(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={20} color="#757575" />
              </TouchableOpacity>
            </View>
            
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.sortOption,
                  sortBy === option.key && styles.sortOptionActive,
                ]}
                onPress={() => {
                  onSortChange(option.key);
                  setShowSortModal(false);
                }}
              >
                <View style={styles.sortOptionIcon}>
                  <Ionicons 
                    name={option.icon} 
                    size={20} 
                    color={sortBy === option.key ? '#2196F3' : '#757575'} 
                  />
                </View>
                <View style={styles.sortOptionContent}>
                  <Text style={[
                    styles.sortOptionLabel,
                    sortBy === option.key && styles.sortOptionLabelActive,
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={styles.sortOptionDescription}>
                    {option.description}
                  </Text>
                </View>
                {sortBy === option.key && (
                  <Ionicons name="checkmark" size={20} color="#2196F3" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
  },
  filterTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    gap: 3,
    minHeight: 32,
  },
  filterTabActive: {
    backgroundColor: '#2196F3',
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#757575',
    textAlign: 'center',
    flex: 1,
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  countBadge: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  countText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#757575',
  },
  countTextActive: {
    color: '#FFFFFF',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginLeft: 6,
    gap: 3,
    minWidth: 80,
  },
  sortButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2196F3',
    flex: 1,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 350,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  modalCloseButton: {
    padding: 4,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  sortOptionActive: {
    backgroundColor: '#F0F8FF',
  },
  sortOptionIcon: {
    marginRight: 12,
    width: 24,
    alignItems: 'center',
  },
  sortOptionContent: {
    flex: 1,
  },
  sortOptionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
    marginBottom: 2,
  },
  sortOptionLabelActive: {
    color: '#2196F3',
  },
  sortOptionDescription: {
    fontSize: 12,
    color: '#757575',
  },
});

export default FilterBar; 