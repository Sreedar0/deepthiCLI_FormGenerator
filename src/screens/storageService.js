import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveForm = async (formData) => {
  try {
    const existingForms = await AsyncStorage.getItem('savedForms');
    const savedForms = existingForms ? JSON.parse(existingForms) : [];
    savedForms.push(formData);
    await AsyncStorage.setItem('savedForms', JSON.stringify(savedForms));
    return true;
  } catch (error) {
    console.error('Error saving form:', error);
    return false;
  }
};

// In storageService.js
export const submitForm = async (formData) => {
  try {
    if (!formData?.formId) {
      throw new Error('Invalid form data - missing formId');
    }
    
    const existingForms = await AsyncStorage.getItem('submittedForms');
    const submittedForms = existingForms ? JSON.parse(existingForms) : [];
    submittedForms.push({
      ...formData,
      id: Date.now().toString(),
      date: new Date().toISOString()
    });
    await AsyncStorage.setItem('submittedForms', JSON.stringify(submittedForms));
    return true;
  } catch (error) {
    console.error('Error submitting form:', error);
    return false;
  }
};

export const getSubmittedForms = async () => {
  try {
    const storedForms = await AsyncStorage.getItem('submittedForms');
    return storedForms ? JSON.parse(storedForms) : [];
  } catch (error) {
    console.error('Error loading submitted forms:', error);
    return [];
  }
};

export const deleteSubmittedForm = async (formId) => {
  try {
    const storedForms = await AsyncStorage.getItem('submittedForms');
    const submittedForms = storedForms ? JSON.parse(storedForms) : [];
    const updatedForms = submittedForms.filter(form => form.id !== formId);
    await AsyncStorage.setItem('submittedForms', JSON.stringify(updatedForms));
    return updatedForms;
  } catch (error) {
    console.error('Error deleting form:', error);
    return null;
  }
};