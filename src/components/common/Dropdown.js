import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, TextInput, StyleSheet } from 'react-native';
import { colors } from '../../styles/globalStyles';

const Dropdown = ({ 
  label, 
  options, 
  value, 
  onSelect, 
  searchable = false, 
  placeholder = 'Select...',
  required = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const filteredOptions = searchable 
    ? options.filter(option => 
        option.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : options;

  const selectedOption = options.find(option => option.value === value);

  return (
    <View style={styles.dropdownContainer}>
      <Text style={styles.inputLabel}>
        {label}{required && ' *'}
      </Text>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsOpen(true)}
      >
        <Text style={[
          styles.dropdownButtonText, 
          !selectedOption && styles.placeholderText
        ]}>
          {selectedOption ? selectedOption.name : placeholder}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {searchable && (
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor={colors.placeholder}
                value={searchText}
                onChangeText={setSearchText}
              />
            )}

            <FlatList
              data={filteredOptions}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    onSelect(item.value);
                    setIsOpen(false);
                    setSearchText('');
                  }}
                >
                  <Text style={styles.dropdownItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.dark,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 15,
    backgroundColor: colors.white,
    elevation: 1,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: colors.dark,
  },
  placeholderText: {
    color: colors.placeholder,
  },
  dropdownArrow: {
    fontSize: 12,
    color: colors.gray,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
  },
  modalClose: {
    fontSize: 20,
    color: colors.gray,
    fontWeight: 'bold',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: colors.white,
  },
  dropdownItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  dropdownItemText: {
    fontSize: 16,
    color: colors.dark,
  },
});

export default Dropdown;