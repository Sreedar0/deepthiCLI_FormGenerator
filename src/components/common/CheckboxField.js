import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../styles/globalStyles';

const CheckboxField = ({ label, value, onValueChange, required = false, id}) => (
  <View style={styles.checkboxContainer}>
    {/* <Text>{id}</Text> */}
    <TouchableOpacity
      style={styles.checkbox}
      onPress={() => onValueChange(!value)}
    >
      {value && <Text style={styles.checkboxCheck}>✓</Text>}
    </TouchableOpacity>
    <Text style={styles.checkboxLabel}>
      {label}{required && ' *'}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
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
  },
  checkboxCheck: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: colors.dark,
  },
});

export default CheckboxField;