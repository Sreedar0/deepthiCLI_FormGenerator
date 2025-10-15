// common/CustomInput.js (updated)
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors } from '../../styles/globalStyles';

const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  required = false,
  secureTextEntry = false,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      </View>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multiline,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#999"
        {...props}
      />
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
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#fff',
    minHeight: 44,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
});

export default CustomInput;