import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors } from '../../styles/globalStyles';

const CustomInput = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry, 
  keyboardType = 'default',
  multiline = false,
  required = false 
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>
      {label}{required && ' *'}
    </Text>
    <TextInput
      style={[styles.input, multiline && styles.textArea]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.placeholder}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      multiline={multiline}
    />
  </View>
);

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.dark,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: colors.white,
    elevation: 1,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default CustomInput;