// common/DateField.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../styles/globalStyles';

const DateField = ({ label, value, onChange, required = false, style }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      onChange(selectedDate.toISOString());
    }
  };

  const displayDate = value ? new Date(value).toLocaleDateString() : 'Select Date';

  return (
    <View style={[styles.container, style]}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.dateButton}
        onPress={() => setShowPicker(true)}
      >
        <Text style={[
          styles.dateText,
          !value && styles.placeholderText
        ]}>
          {displayDate}
        </Text>
        <Icon name="calendar-today" size={20} color={colors.primary} />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  labelContainer: {
    width: '35%',
    paddingRight: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    textAlign: 'right',
  },
  required: {
    color: colors.danger,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    minHeight: 44,
  },
  dateText: {
    fontSize: 14,
    color: colors.dark,
  },
  placeholderText: {
    color: '#999',
  },
});

export default DateField;