import React from 'react';
import { View, Alert, Text, StyleSheet } from 'react-native';
import FormRenderer from '../components/forms/FormRenderer';
import { saveForm } from '../Services/storageService';

const FormScreen = ({ route, navigation }) => {
  // Received via navigation
  const { formId, formTemplate } = route.params;

  const handleSubmit = (data) => {
    const formData = {
      id: Date.now().toString(),
      formId,
      data,
      date: new Date().toISOString()
    };
    saveForm(formData).then(() => {
      Alert.alert('Saved!');
      navigation.goBack();
    });
  };

  if (!formTemplate) return <View style={styles.center}><Text style={styles.error}>Form not found</Text></View>;

  return (
    <View style={styles.container}>
      <FormRenderer formTemplate={formTemplate} onSubmit={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: '#FAFAFA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red', fontWeight: 'bold' }
});

export default FormScreen;
