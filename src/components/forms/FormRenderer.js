import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
  Button,
  TouchableOpacity,
} from 'react-native';
import CustomInput from '../common/CustomInput';
import Dropdown from '../common/Dropdown';
import CheckboxField from '../common/CheckboxField';
import RadioGroup from '../common/RadioGroup';
import CustomButton from '../common/CustomButton';
import { globalStyles, colors } from '../../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';
import SignaturePad from '../common/SignaturePad';
import ImageCapture from '../common/ImageCapture';
import DateTimePicker from '@react-native-community/datetimepicker';
import { saveForm } from '../../Services/storageService';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Dynamic Group Component
// Updated Dynamic Group Component - Simplified for text-only fields
const DynamicGroup = ({ group, groupIndex, groupData, onGroupChange, onRemoveGroup, isLastGroup }) => {
  const handleFieldChange = (fieldId, value) => {
    const updatedGroup = {
      ...groupData,
      [fieldId]: value
    };
    onGroupChange(groupIndex, updatedGroup);
  };

  const renderGroupField = (field) => {
    const value = groupData[field.id] || '';

    return (
      <CustomInput
        label={field.label}
        value={value}
        onChangeText={(text) => handleFieldChange(field.id, text)}
        placeholder={`Enter ${field.label.toLowerCase()}`}
        keyboardType="default"
        required={field.required}
      />
    );
  };

  return (
    <View style={styles.groupContainer}>
      <View style={styles.groupHeader}>
        <Text style={styles.groupTitle}>Group {groupIndex + 1}</Text>
        {!isLastGroup && (
          <TouchableOpacity onPress={() => onRemoveGroup(groupIndex)} style={styles.removeButton}>
            {/* <Icon name="delete" size={20} color={colors.danger} /> */}
            <Text style={{color:'red', backgroundColor:'black',padding:7,fontWeight:'bold',borderRadius:8}}>X</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.groupFields}>
        {group.groupFields.map((field, fieldIndex) => (
          <View key={`${field.id}-${fieldIndex}`} style={styles.groupField}>
            {renderGroupField(field)}
          </View>
        ))}
      </View>
    </View>
  );
};
const FormRenderer = ({ formTemplate }) => {
  const navigation = useNavigation();

  // Initialize form data - simpler structure
  const initialData = {};
  formTemplate.fields.forEach((field) => {
    if (field.type === 'dynamic_group') {
      // Initialize with one empty group
      initialData[field.id] = [{}];
    } else {
      initialData[field.id] = field.type === 'checkbox' ? false : '';
    }
  });

  const [formData, setFormData] = useState(initialData);
  const [showDatePicker, setShowDatePicker] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (fieldId, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  // Dynamic Group Handlers
  const handleAddGroup = (fieldId) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: [...prev[fieldId], {}]
    }));
  };

  const handleRemoveGroup = (fieldId, groupIndex) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: prev[fieldId].filter((_, index) => index !== groupIndex)
    }));
  };

  const handleGroupChange = (fieldId, groupIndex, updatedGroup) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: prev[fieldId].map((group, index) => 
        index === groupIndex ? updatedGroup : group
      )
    }));
  };

  const handleSignature = (fieldId, signature) => {
    console.log("Setting signature for field:", fieldId);
    setFormData((prev) => ({
      ...prev,
      [fieldId]: signature,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formPayload = {
        id: Date.now().toString(),
        formId: formTemplate.title,
        data: formData,
        date: new Date().toISOString(),
        submitted: true,
      };

      console.log("Submitting form:", formPayload);

      const success = await saveForm(formPayload);
      if (success) {
        Alert.alert('Success', 'Form submitted successfully!');
        navigation.navigate('Home', { refresh: true });
      } else {
        Alert.alert('Error', 'Failed to submit the form.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      Alert.alert('Error', 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formPayload = {
        id: Date.now().toString(),
        formId: formTemplate.title,
        data: formData,
        date: new Date().toISOString(),
        submitted: false,
      };

      console.log("Saving draft:", formPayload);

      const success = await saveForm(formPayload);
      if (success) {
        Alert.alert('Success', 'Draft saved!');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to save draft.');
      }
    } catch (err) {
      console.error('Save error:', err);
      Alert.alert('Error', 'An error occurred during saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderField = (field) => {
    const value = formData[field.id];

    switch (field.type) {
      case 'text':
      case 'number':
      case 'textarea':
        return (
          <CustomInput
            label={field.label}
            value={value || ''}
            onChangeText={(text) => handleInputChange(field.id, text)}
            placeholder={field.placeholder || ''}
            keyboardType={field.type === 'number' ? 'numeric' : 'default'}
            multiline={field.type === 'textarea'}
            required={field.required}
          />
        );

      case 'select':
        return (
          <Dropdown
            label={field.label}
            options={field.options.map((opt) => ({ id: opt, name: opt, value: opt }))}
            value={value}
            onSelect={(val) => handleInputChange(field.id, val)}
            required={field.required}
          />
        );

      case 'checkbox':
        return (
          <CheckboxField
            label={field.label}
            value={!!value}
            onValueChange={(val) => handleInputChange(field.id, val)}
            required={field.required}
            id={field.id}
          />
        );

      case 'radio':
        return (
          <RadioGroup
            label={field.label}
            options={field.options}
            selectedValue={value}
            onValueChange={(val) => handleInputChange(field.id, val)}
            required={field.required}
          />
        );

      case 'date':
        return (
          <View style={{ marginVertical: 8 }}>
            <Button
              title={value ? new Date(value).toLocaleDateString() : 'Select Date'}
              onPress={() => setShowDatePicker({ ...showDatePicker, [field.id]: true })}
            />
            {showDatePicker[field.id] && (
              <DateTimePicker
                value={value ? new Date(value) : new Date()}
                mode="date"
                display="default"
                onChange={(e, selectedDate) => {
                  setShowDatePicker({ ...showDatePicker, [field.id]: false });
                  if (selectedDate) handleInputChange(field.id, selectedDate.toISOString());
                }}
              />
            )}
          </View>
        );

      case 'signature':
        return (
          <View>
            <Text style={styles.signatureLabel}>{field.label}</Text>
            <SignaturePad
              onOK={(sigBase64) => {
                console.log("Signature captured, length:", sigBase64.length);
                handleInputChange(field.id, sigBase64);
              }}
              value={value}
            />
            {value && (
              <Text style={styles.signatureSaved}>
                ✓ Signature saved ({Math.round(value.length / 1024)} KB)
              </Text>
            )}
          </View>
        );

      case 'image':
        return (
          <ImageCapture
            image={value}
            setImage={(img) => handleInputChange(field.id, img)}
          />
        );

      case 'dynamic_group':
        return (
          <View style={styles.dynamicGroupSection}>
            <Text style={styles.sectionTitle}>{field.label}</Text>
            {value.map((groupData, groupIndex) => (
              <DynamicGroup
                key={groupIndex}
                group={field}
                groupIndex={groupIndex}
                groupData={groupData}
                onGroupChange={(index, updatedGroup) => 
                  handleGroupChange(field.id, index, updatedGroup)
                }
                onRemoveGroup={(index) => handleRemoveGroup(field.id, index)}
                isLastGroup={groupIndex === value.length - 1}
              />
            ))}
            <TouchableOpacity 
              style={styles.addGroupButton}
              onPress={() => handleAddGroup(field.id)}
            >
              <Icon name="add" size={20} color={colors.primary} />
              <Text style={styles.addGroupButtonText}>Add More</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return <Text>{String(value)}</Text>;
    }
  };

  if (isSubmitting || isSaving) {
    return (
      <View style={[globalStyles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>
          {isSubmitting ? 'Submitting...' : 'Saving...'}
        </Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.formTitle}>{formTemplate.title}</Text>
        {formTemplate.fields.map((field) => (
          <View key={field.id || field.sno} style={styles.fieldBlock}>
            {renderField(field)}
          </View>
        ))}
        <View style={styles.buttonGroup}>
          <CustomButton
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="danger"
            style={styles.button}
            disabled={isSubmitting || isSaving}
          />
          <CustomButton
            title={isSaving ? 'Saving...' : 'Save Draft'}
            onPress={handleSave}
            variant="secondary"
            style={styles.button}
            disabled={isSubmitting || isSaving}
          />
          <CustomButton
            title={isSubmitting ? 'Submitting...' : 'Submit'}
            onPress={handleSubmit}
            style={styles.button}
            disabled={isSubmitting || isSaving}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: colors.dark,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    flexWrap: 'wrap',
  },
  button: {
    minWidth: '30%',
    marginVertical: 10,
  },
  fieldBlock: {
    marginBottom: 18,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: colors.primary,
  },
  signatureLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.dark,
  },
  signatureSaved: {
    color: 'green',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  // Dynamic Group Styles
  dynamicGroupSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.dark,
  },
  groupContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
  },
  removeButton: {
    padding: 5,
  },
  groupFields: {
    // Grid layout for better organization
  },
  groupField: {
    marginBottom: 12,
  },
  addGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  addGroupButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  dynamicGroupSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.dark,
  },
  groupContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
  },
  removeButton: {
    padding: 5,
  },
  groupFields: {
    // All fields are text inputs now
  },
  groupField: {
    marginBottom: 12,
  },
  addGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  addGroupButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default FormRenderer;