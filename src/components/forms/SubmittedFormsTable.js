import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { globalStyles, colors } from '../../styles/globalStyles';
import { getSubmittedForms, deleteSubmittedForm } from '../../Services/storageService';
import CustomButton from '../common/CustomButton';
import { useNavigation } from '@react-navigation/native';

const SubmittedFormsTable = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  const loadForms = async () => {
    try {
      const submittedForms = await getSubmittedForms();
      // Parse the 'data' field of each form from JSON string to object
      const parsedForms = submittedForms.map(form => ({
        ...form,
        data: typeof form.data === 'string' ? JSON.parse(form.data) : form.data
      }));
      setForms(parsedForms);
    } catch (error) {
      console.error('Error loading forms:', error);
      Alert.alert('Error', 'Failed to load forms');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadForms();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadForms();
  };

  const handleDelete = (formId) => {
    Alert.alert(
      'Delete Form',
      'Are you sure you want to delete this form?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSubmittedForm(formId);
              // Reload form list after deletion
              await loadForms();
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Failed to delete form');
            }
          },
        },
      ],
    );
  };

  const handleView = (form) => {
    console.log(form,"FORMMMMMMMMMMMMMMM")
    navigation.navigate('FormView', { formData: form });
  };

  if (loading) {
    return (
      <View style={[globalStyles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading forms...</Text>
      </View>
    );
  }

  if (forms.length === 0) {
    return (
      <View style={globalStyles.container}>
        <Text style={styles.noFormsText}>No submitted forms yet</Text>
        <CustomButton title="Refresh" onPress={handleRefresh} variant="secondary" />
      </View>
    );
  }

  // Render header component
  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.headerText}>Form Name</Text>
      <Text style={styles.headerText}>Date</Text>
      <Text style={styles.headerText}>Actions</Text>
    </View>
  );

  // Render each row
  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.cellText} numberOfLines={1}>
        {item.formId}
      </Text>
      <Text style={styles.cellText}>{new Date(item.date).toLocaleDateString()}</Text>
      <View style={styles.actionsCell}>
        <TouchableOpacity onPress={() => handleView(item)}>
          <Text style={styles.viewButton}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={forms}
      keyExtractor={(item) => item.id}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={renderHeader}
      renderItem={renderItem}
      style={styles.flatList}
    />
  );
};

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: colors.light,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerText: {
    fontWeight: 'bold',
    color: colors.dark,
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
    alignItems: 'center',
  },
  cellText: {
    flex: 1,
    textAlign: 'center',
    color: colors.dark,
  },
  actionsCell: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  viewButton: {
    color: colors.primary,
    fontWeight: '600',
  },
  deleteButton: {
    color: colors.danger,
    fontWeight: '600',
  },
  noFormsText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
    color: colors.gray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: colors.primary,
  },
});

export default SubmittedFormsTable;