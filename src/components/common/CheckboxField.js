import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../styles/globalStyles';

const CheckboxField = ({ 
  label, 
  value, 
  onValueChange, 
  required = false, 
  id,
  options = [], // For checkbox groups
  isGroup = false // Flag to indicate if it's a checkbox group
}) => {
  // Handle single checkbox
  const handleSingleCheckbox = () => {
    onValueChange(!value);
  };

  // Handle checkbox group selection
  const handleGroupCheckbox = (optionValue) => {
    const currentValues = Array.isArray(value) ? value : [];
    const newValues = currentValues.includes(optionValue)
      ? currentValues.filter(item => item !== optionValue)
      : [...currentValues, optionValue];
    
    onValueChange(newValues);
  };

  // Check if an option is selected in group mode
  const isOptionSelected = (optionValue) => {
    return Array.isArray(value) && value.includes(optionValue);
  };

  // Render single checkbox
  const renderSingleCheckbox = () => (
    <View style={styles.checkboxContainer}>
      <TouchableOpacity
        style={[styles.checkbox, value && styles.checkboxSelected]}
        onPress={handleSingleCheckbox}
      >
        {value && <Text style={styles.checkboxCheck}>✓</Text>}
      </TouchableOpacity>
      <Text style={styles.checkboxLabel}>
        {label}{required && ' *'}
      </Text>
    </View>
  );

  // Render checkbox group
  const renderCheckboxGroup = () => (
    <View style={styles.checkboxGroupContainer}>
      <Text style={styles.groupLabel}>
        {label}{required && ' *'}
      </Text>
      {options.map((option, index) => (
        <View key={option.value || option} style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[
              styles.checkbox, 
              isOptionSelected(option.value || option) && styles.checkboxSelected
            ]}
            onPress={() => handleGroupCheckbox(option.value || option)}
          >
            {isOptionSelected(option.value || option) && (
              <Text style={styles.checkboxCheck}>✓</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>
            {option.label || option}
          </Text>
        </View>
      ))}
    </View>
  );

  return isGroup ? renderCheckboxGroup() : renderSingleCheckbox();
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxGroupContainer: {
    marginBottom: 15,
  },
  groupLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#fff',
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxCheck: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: colors.dark,
    flex: 1,
  },
});

export default CheckboxField;