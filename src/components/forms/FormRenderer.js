import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
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
import DateField from '../common/DateField';
import { saveForm } from '../../Services/storageService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImageCaptureGroup from '../common/ImageCaptureGroup';
import Accordion from '../common/Accordion';

// Updated Dynamic Group Component with new layout
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
            <Text style={styles.removeButtonText}>X</Text>
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

  // Initialize form data
  const initialData = {};
  formTemplate.fields.forEach((field) => {
    if (field.type === 'dynamic_group') {
      initialData[field.id] = [{}];
    } else if (field.type === 'image_group') {
      initialData[field.id] = [];
    } else if (field.type === 'checkbox' && field.options) {
      initialData[field.id] = [];
    } else if (field.type === 'checkbox') {
      initialData[field.id] = false;
    } else {
      initialData[field.id] = '';
    }
  });

  const [formData, setFormData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [accordionStates, setAccordionStates] = useState({});

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

  const handleAccordionToggle = (fieldId, isOpen) => {
    setAccordionStates(prev => ({
      ...prev,
      [fieldId]: isOpen
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
        if (field.options && Array.isArray(field.options)) {
          return (
            <CheckboxField
              label={field.label}
              value={value || []}
              onValueChange={(val) => handleInputChange(field.id, val)}
              required={field.required}
              options={field.options}
              isGroup={true}
            />
          );
        } else {
          return (
            <CheckboxField
              label={field.label}
              value={!!value}
              onValueChange={(val) => handleInputChange(field.id, val)}
              required={field.required}
            />
          );
        }

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
          <DateField
            label={field.label}
            value={value}
            onChange={(date) => handleInputChange(field.id, date)}
            required={field.required}
          />
        );

      case 'signature':
        return (
          <View style={styles.signatureContainer}>
            <View style={styles.signatureLabelContainer}>
              <Text style={styles.signatureLabel}>
                {field.label}
                {field.required && <Text style={styles.required}> *</Text>}
              </Text>
            </View>
            <View style={styles.signatureField}>
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
          </View>
        );

      case 'image':
        return (
          <View style={styles.imageContainer}>
            <View style={styles.imageLabelContainer}>
              <Text style={styles.imageLabel}>
                {field.label}
                {field.required && <Text style={styles.required}> *</Text>}
              </Text>
            </View>
            <View style={styles.imageField}>
              <ImageCapture
                image={value}
                setImage={(img) => handleInputChange(field.id, img)}
              />
            </View>
          </View>
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

      case 'image_group':
        const imageArray = Array.isArray(value) ? value : [];
        return (
          <View style={styles.imageGroupContainer}>
            <View style={styles.imageGroupLabelContainer}>
              <Text style={styles.imageGroupLabel}>
                {field.label}
                {field.required && <Text style={styles.required}> *</Text>}
              </Text>
            </View>
            <View style={styles.imageGroupField}>
              <ImageCaptureGroup
                images={imageArray}
                setImages={(newImages) => {
                  console.log("Setting images for field:", field.id, "new images:", newImages);
                  handleInputChange(field.id, newImages);
                }}
              />
            </View>
          </View>
        );

      case 'accordion':
        return (
          <Accordion
            title={field.label}
            isOpen={accordionStates[field.id] || false}
            onToggle={(isOpen) => handleAccordionToggle(field.id, isOpen)}
          >
            {field.fields && field.fields.map((subField) => (
              <View key={subField.id} style={styles.accordionField}>
                {renderField(subField)}
              </View>
            ))}
          </Accordion>
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
    padding: 16,
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
    marginBottom: 8,
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
  required: {
    color: colors.danger,
  },
  // Signature styles
  signatureContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  signatureLabelContainer: {
    width: '35%',
    paddingRight: 12,
    paddingTop: 8,
  },
  signatureLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    textAlign: 'right',
  },
  signatureField: {
    flex: 1,
  },
  signatureSaved: {
    color: 'green',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  // Image styles
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  imageLabelContainer: {
    width: '35%',
    paddingRight: 12,
    paddingTop: 8,
  },
  imageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    textAlign: 'right',
  },
  imageField: {
    flex: 1,
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
    textAlign: 'center',
    paddingHorizontal: 8,
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
  removeButtonText: {
    color: 'red',
    backgroundColor: 'black',
    padding: 7,
    fontWeight: 'bold',
    borderRadius: 8,
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
  // Image Group Styles
  imageGroupContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  imageGroupLabelContainer: {
    width: '35%',
    paddingRight: 12,
    paddingTop: 8,
  },
  imageGroupLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    textAlign: 'right',
  },
  imageGroupField: {
    flex: 1,
  },
  // Accordion styles
  accordionField: {
    marginBottom: 8,
  },
});

export default FormRenderer;