import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
// import { useNavigation } from '../context/NavigationContext';
import Dropdown from '../components/common/Dropdown';
import CustomButton from '../components/common/CustomButton'; // Import CustomButton
import SubmittedFormsTable from '../components/forms/SubmittedFormsTable';
import { INSPECTION_CATEGORIES, INSPECTION_TYPES, FORMS } from '../data/dummyData';
import { globalStyles, colors } from '../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';
import { FORM_TEMPLATES } from '../data/formTemplates';

const HomeScreen = () => {
    const navigation = useNavigation();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedForm, setSelectedForm] = useState(null); // Track selected form
    const [availableTypes, setAvailableTypes] = useState([]);
    const [availableForms, setAvailableForms] = useState([]);
    const [refreshTable, setRefreshTable] = useState(false);

    console.log('Navigation object:', navigation);

    useEffect(() => {
        if (selectedCategory) {
            const types = INSPECTION_TYPES[selectedCategory.value] || [];
            setAvailableTypes(types);
            setSelectedType(null);
            setSelectedForm(null);
            setAvailableForms([]);
        }
    }, [selectedCategory]);

    useEffect(() => {
        if (selectedType) {
            const forms = FORMS[selectedType.value] || [];
            setAvailableForms(forms);
            setSelectedForm(null);
        }
    }, [selectedType]);

    const handleFormSelect = (formId) => {
        if (!formId) {
            console.error('No formId provided');
            return;
        }

        const form = availableForms.find(f => f.formId === formId);
        setSelectedForm(form);
    };

    const handleGetForm = () => {
        if (!selectedForm) {
            alert('Please select a form first');
            return;
        }
        const formTemplate = FORM_TEMPLATES[selectedForm.formId];
        if (!formTemplate) {
            alert('Form template not found');
            return;
        }
        navigation.navigate('Form', { formId: selectedForm.formId, formTemplate });
    };

    return (
        <View style={globalStyles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.formSelection}>
                    <Dropdown
                        label="Inspection Category"
                        options={INSPECTION_CATEGORIES}
                        value={selectedCategory?.value}
                        onSelect={(value) => setSelectedCategory(
                            INSPECTION_CATEGORIES.find(cat => cat.value === value)
                        )}
                        placeholder="Select a category"
                    />

                    {availableTypes.length > 0 && (
                        <Dropdown
                            label="Inspection Type"
                            options={availableTypes}
                            value={selectedType?.value}
                            onSelect={(value) => setSelectedType(
                                availableTypes.find(type => type.value === value)
                            )}
                            placeholder="Select a type"
                            searchable
                        />
                    )}

                    {availableForms.length > 0 && (
                        <>
                            <Dropdown
                                label="Available Forms"
                                options={availableForms.map(form => ({
                                    id: form.formId,
                                    name: form.name,
                                    value: form.formId
                                }))}
                                value={selectedForm?.formId}
                                onSelect={handleFormSelect}
                                placeholder="Select a form"
                            />

                            <CustomButton
                                title="Get Form"
                                onPress={handleGetForm}
                                style={styles.getFormButton}
                                disabled={!selectedForm}
                            />
                        </>
                    )}
                </View>

                <View style={styles.submittedForms}>
                    <SubmittedFormsTable refresh={refreshTable} />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        paddingBottom: 20,
    },
    formSelection: {
        padding: 20,
        backgroundColor: '#fff',
        marginBottom: 20,
        borderRadius: 10,
        elevation: 2,
    },
    submittedForms: {
        paddingHorizontal: 10,
    },
    getFormButton: {
        marginTop: 20,
        backgroundColor: colors.primary,
    },
});

export default HomeScreen;