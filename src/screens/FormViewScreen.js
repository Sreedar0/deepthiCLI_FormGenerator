import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { FORM_TEMPLATES } from '../data/formTemplates';
import RNFS from 'react-native-fs';

const { width: screenWidth } = Dimensions.get('window');

// Move normalizeUri outside the component
const normalizeUri = async (uri) => {
  if (!uri) return null;
  
  try {
    // Handle different URI formats
    if (uri.startsWith('http') || uri.startsWith('content://')) {
      return uri;
    }
    
    if (uri.startsWith('data:')) {
      return uri;
    }
    
    // Handle file URIs
    let filePath = uri;
    if (uri.startsWith('file://')) {
      filePath = uri.replace('file://', '');
    }
    
    // Check if file exists
    const fileExists = await RNFS.exists(filePath);
    if (fileExists) {
      return `file://${filePath}`;
    } else {
      console.warn('File does not exist:', filePath);
      return null;
    }
  } catch (error) {
    console.error('Error normalizing URI:', error);
    return null;
  }
};

// Create a separate ImageField component
const ImageField = ({ value }) => {
  console.log(value,"lklkkllklklk");
  
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      if (!value) {
        setImageUri(null);
        return;
      }

      setLoading(true);
      try {
        const normalizedUri = await normalizeUri(value);
        setImageUri(normalizedUri);
      } catch (error) {
        console.error('Error loading image:', error);
        setImageUri(null);
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [value]);

  if (loading) {
    return <Text>Loading image...</Text>;
  }

  if (!imageUri) {
    return <Text style={styles.errorText}>Unable to load image</Text>;
  }

  return (
    <Image 
      source={{ uri: imageUri }} 
      style={styles.image} 
      resizeMode="contain"
      onError={(e) => console.log('Image error:', e.nativeEvent)}
    />
  );
};

// Create a separate SignatureField component
const SignatureField = ({ value }) => {
  if (!value) return null;
  
  const uri = value.startsWith('data:image')
    ? value
    : `data:image/png;base64,${value}`;
    
  return <Image source={{ uri }} style={styles.signature} />;
};

// Dynamic Group Display Component for text fields
const DynamicGroupDisplay = ({ groups, groupFields }) => {
  console.log("DynamicGroupDisplay - groups:", groups, "groupFields:", groupFields);
  
  if (!groups || !Array.isArray(groups) || groups.length === 0) {
    return <Text style={styles.noData}>No groups added</Text>;
  }

  // Calculate table width based on number of columns
  const tableWidth = Math.max(screenWidth * 1.5, groupFields.length * 120 + 80); // Minimum width + serial column

  return (
    <View style={styles.dynamicGroupsContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={true}
        style={styles.horizontalScroll}
      >
        <View style={[styles.tableContainer, { width: tableWidth }]}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.serialNoCell]}>#</Text>
            {groupFields.map((field) => (
              <Text key={field.id} style={styles.tableHeaderCell}>
                {field.label}
              </Text>
            ))}
          </View>
          
          {/* Table Rows */}
          {groups.map((group, groupIndex) => (
            <View 
              key={groupIndex} 
              style={[
                styles.tableRow,
                groupIndex % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
              ]}
            >
              <Text style={[styles.tableCell, styles.serialNoCell]}>
                {groupIndex + 1}
              </Text>
              {groupFields.map((field) => (
                <Text key={field.id} style={styles.tableCell}>
                  {group[field.id] || '-'}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// Table Format for Array Fallback
const ArrayTableDisplay = ({ value, fieldDef }) => {
  console.log("ArrayTableDisplay - value:", value, "fieldDef:", fieldDef);
  
  if (!value || !Array.isArray(value) || value.length === 0) {
    return <Text style={styles.noData}>No data available</Text>;
  }

  // Try to detect if this is a dynamic group by checking fieldDef
  if (fieldDef?.type === 'dynamic_group' && fieldDef?.groupFields) {
    return <DynamicGroupDisplay groups={value} groupFields={fieldDef.groupFields} />;
  }

  // Get all unique keys from all objects in the array
  const allKeys = [...new Set(value.flatMap(item => Object.keys(item)))];
  
  if (allKeys.length === 0) {
    return <Text style={styles.noData}>Empty groups</Text>;
  }

  // Calculate table width based on number of columns
  const tableWidth = Math.max(screenWidth * 1.5, allKeys.length * 120 + 80);

  return (
    <View style={styles.dynamicGroupsContainer}>
    {/* <Text style={styles.sectionTitle}>Dynamic Groups ({value.length})</Text> */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={true}
        style={styles.horizontalScroll}
      >
        <View style={[styles.tableContainer, { width: tableWidth }]}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.serialNoCell]}>#</Text>
            {allKeys.map((key) => (
              <Text key={key} style={styles.tableHeaderCell}>
                {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}
              </Text>
            ))}
          </View>
          
          {/* Table Rows */}
          {value.map((item, index) => (
            <View 
              key={index} 
              style={[
                styles.tableRow,
                index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
              ]}
            >
              <Text style={[styles.tableCell, styles.serialNoCell]}>
                {index + 1}
              </Text>
              {allKeys.map((key) => (
                <Text key={key} style={styles.tableCell}>
                  {item[key] || '-'}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// Table Format for Object Fallback
const ObjectTableDisplay = ({ value }) => {
  console.log("ObjectTableDisplay - value:", value);
  
  if (!value || typeof value !== 'object') {
    return <Text style={styles.noData}>No data available</Text>;
  }

  const entries = Object.entries(value);
  
  if (entries.length === 0) {
    return <Text style={styles.noData}>Empty object</Text>;
  }

  return (
    <View style={styles.tableContainer}>
      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderCell}>Field</Text>
        <Text style={styles.tableHeaderCell}>Value</Text>
      </View>
      
      {/* Table Rows */}
      {entries.map(([key, val], index) => (
        <View 
          key={key} 
          style={[
            styles.tableRow,
            index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
          ]}
        >
          <Text style={[styles.tableCell, styles.fieldNameCell]}>
            {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}
          </Text>
          <Text style={styles.tableCell}>
            {String(val || '-')}
          </Text>
        </View>
      ))}
    </View>
  );
};

// Main field display component - simplified
const FieldDisplay = ({ value, type, fieldDef }) => {
  console.log("FieldDisplay - Type:", type, "Value:", value, "FieldDef:", fieldDef);
  
  // First, check if this is a dynamic group (either by type or by fieldDef)
  if (type === 'dynamic_group' || fieldDef?.type === 'dynamic_group') {
    return (
      <DynamicGroupDisplay 
        groups={value} 
        groupFields={fieldDef?.groupFields || []} 
      />
    );
  }

  if (
    type === 'image' ||
    (typeof value === 'string' && value.includes('file:'))
  ) {
    console.log(type, value);
    return <ImageField value={value} />;
  }
  console.log(type, "SIGNATUREEEEEEE", "---------------", value)
  if (typeof value === 'string' && value.includes('data:')) {

    const uri = value.startsWith('data:image')
      ? value
      : `data:image/png;base64,${value}`;
    return <Image source={{ uri }} style={styles.signature} />;
  }

  if (type === 'date' && value) {
    return <Text>{new Date(value).toLocaleDateString()}</Text>;
  }

  if (['checkbox', 'radio', 'select'].includes(type)) {
    return <Text>{String(value)}</Text>;
  }

  // Handle array values (like dynamic groups that might not be properly typed)
  if (Array.isArray(value)) {
    return <ArrayTableDisplay value={value} fieldDef={fieldDef} />;
  }

  // Handle object values
  if (typeof value === 'object' && value !== null) {
    return <ObjectTableDisplay value={value} />;
  }

  return <Text>{value || 'Not provided'}</Text>;
};

const getFieldType = (key, fields) => {
  if (!fields || !Array.isArray(fields)) return 'text';
  const field = fields.find(f => f.id === key);
  return field ? field.type : 'text';
};

const FormViewScreen = ({ route }) => {
  const { formData, fieldDefs: passedDefs } = route.params || {};
  console.log("FormViewScreen - formData:", formData, "passedDefs:", passedDefs);
  
  if (!formData) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>No data</Text>
      </View>
    );
  }

  const fieldDefs = Array.isArray(passedDefs) && passedDefs.length > 0
    ? passedDefs
    : (FORM_TEMPLATES[formData.formId]?.fields || []);

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={true}
    >
      <Text style={styles.formTitle}>{formData.formId}</Text>
      <Text style={styles.date}>
        Submitted: {new Date(formData.date).toLocaleString()}
      </Text>
      
      {Object.entries(formData.data).map(([key, value]) => {
        const fieldType = getFieldType(key, fieldDefs);
        const fieldDef = fieldDefs.find(f => f.id === key);
        
        console.log(`Field: ${key}, Type: ${fieldType}, Value:`, value);
        
        return (
          <View key={key} style={styles.fieldBlock}>
            <Text style={styles.label}>
              {fieldDef?.label || key.replace(/([A-Z])/g, ' $1').trim()}
            </Text>
            <FieldDisplay 
              value={value} 
              type={fieldType}
              fieldDef={fieldDef}
            />
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    padding: 16,
    paddingBottom: 40 
  },
  formTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 8 
  },
  date: { 
    color: '#777', 
    marginBottom: 12 
  },
  fieldBlock: { 
    marginBottom: 18,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8
  },
  label: { 
    fontWeight: 'bold', 
    color: '#222', 
    marginBottom: 8,
    fontSize: 16
  },
  image: { 
    height: 200, 
    width: '100%', 
    resizeMode: 'contain', 
    marginTop: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 4
  },
  signature: { 
    height: 200, 
    backgroundColor: '#FFF', 
    marginTop: 6 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  error: { 
    color: 'red', 
    fontWeight: 'bold' 
  },
  errorText: {
    color: 'red',
    fontStyle: 'italic'
  },
  // Dynamic Group Styles
  dynamicGroupsContainer: {
    marginTop: 10,
  },
  horizontalScroll: {
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  noData: {
    fontStyle: 'italic',
    color: '#999',
    textAlign: 'center',
    marginVertical: 10,
  },
  // Table Styles
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    minWidth: screenWidth - 32, // Account for padding
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4a90e2',
    borderBottomWidth: 1,
    borderBottomColor: '#3a80d2',
  },
  tableHeaderCell: {
    width: 120, // Fixed width for each column
    padding: 12,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    fontSize: 12,
    borderRightWidth: 1,
    borderRightColor: '#3a80d2',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tableRowEven: {
    backgroundColor: '#fff',
  },
  tableRowOdd: {
    backgroundColor: '#f9f9f9',
  },
  tableCell: {
    width: 120, // Fixed width for each column
    padding: 10,
    textAlign: 'center',
    fontSize: 12,
    color: '#333',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  serialNoCell: {
    width: 60, // Smaller width for serial numbers
    fontWeight: 'bold',
    backgroundColor: '#f8f8f8',
  },
  fieldNameCell: {
    fontWeight: '600',
    backgroundColor: '#f8f8f8',
    textAlign: 'left',
  }
});

export default FormViewScreen;