import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../styles/globalStyles';

const RadioGroup = ({
  label,
  options,
  selectedValue,
  onValueChange,
  required = false
}) => (
  <View style={styles.radioGroupContainer}>
    <Text style={styles.radioGroupLabel}>
      {label}{required && ' *'}
    </Text>
    <View>
      {options.map((option) => (
      <TouchableOpacity
        key={option.value}
        style={styles.radioOption}
        onPress={() => onValueChange(option.value)}
      >
        <View style={styles.radioCircle}>
          {selectedValue === option.value && (
            <View style={styles.radioSelected} />
          )}
        </View>
        <Text style={styles.radioLabel}>{option.label}</Text>
      </TouchableOpacity>
    ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  radioGroupContainer: {
    marginBottom: 20,
    flexDirection:'row',
    justifyContent:'space-around'
  },
  radioGroupLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: colors.dark,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  radioLabel: {
    fontSize: 16,
    color: colors.dark,
  },
});

export default RadioGroup;