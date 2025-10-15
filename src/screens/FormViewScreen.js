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

const AccordionDisplay = ({ value, fieldDef }) => {
  if (!fieldDef?.fields || !Array.isArray(fieldDef.fields)) {
    return <Text style={styles.noData}>No accordion data</Text>;
  }

  return (
    <View style={styles.accordionContainer}>
      {fieldDef.fields.map((subField) => {
        const subValue = value?.[subField.id];
        const subFieldType = getFieldType(subField.id, fieldDef.fields);
        const subFieldDef = fieldDef.fields.find(f => f.id === subField.id);
        
        return (
          <View key={subField.id} style={styles.accordionField}>
            <Text style={styles.accordionSubLabel}>
              {subFieldDef?.label || subField.id.replace(/([A-Z])/g, ' $1').trim()}
            </Text>
            <FieldDisplay 
              value={subValue} 
              type={subFieldType}
              fieldDef={subFieldDef}
            />
          </View>
        );
      })}
    </View>
  );
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

// Enhanced Dynamic Group Display Component that handles all array types
const DynamicGroupDisplay = ({ groups, groupFields, isImageGroup = false }) => {
  console.log("DynamicGroupDisplay - groups:", groups, "groupFields:", groupFields, "isImageGroup:", isImageGroup);
  
  if (!groups || !Array.isArray(groups) || groups.length === 0) {
    return <Text style={styles.noData}>No data available</Text>;
  }

  // Handle image groups
  if (isImageGroup) {
    return (
      <View style={styles.imageGroupContainer}>
        {groups.map((image, index) => (
          <View key={image.id || index} style={styles.imageDisplayCard}>
            <Text style={styles.imageDisplayTitle}>Image {index + 1}</Text>
            
            <Image
              source={{ uri: image.uri }}
              style={styles.imageDisplay}
              resizeMode="contain"
              onError={(e) => console.log('Image display error:', e.nativeEvent)}
            />
            
            {image.description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionLabel}>Description:</Text>
                <Text style={styles.descriptionText}>{image.description}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    );
  }

  // Detect if this is an image group by checking the first item
  const firstItem = groups[0];
  const isLikelyImageGroup = firstItem && 
    (typeof firstItem === 'object' && firstItem !== null) && 
    (firstItem.uri || firstItem.url || firstItem.path);

  if (isLikelyImageGroup) {
    return (
      <View style={styles.imageGroupContainer}>
        {groups.map((image, index) => (
          <View key={image.id || index} style={styles.imageDisplayCard}>
            <Text style={styles.imageDisplayTitle}>Image {index + 1}</Text>
            
            <ImageField value={image.uri || image.url || image.path} />
            
            {image.description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionLabel}>Description:</Text>
                <Text style={styles.descriptionText}>{image.description}</Text>
              </View>
            )}
            
            {/* Show other properties in a table format */}
            {Object.keys(image).length > 1 && (
              <View style={styles.imageProperties}>
                <Text style={styles.propertiesTitle}>Properties:</Text>
                {Object.entries(image).map(([key, value]) => {
                  if (key === 'uri' || key === 'url' || key === 'path') return null;
                  return (
                    <View key={key} style={styles.propertyRow}>
                      <Text style={styles.propertyKey}>{key}:</Text>
                      <Text style={styles.propertyValue}>{String(value)}</Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  }

  // Get all unique keys from all objects in the array for table display
  const allKeys = [...new Set(groups.flatMap(item => 
    typeof item === 'object' && item !== null ? Object.keys(item) : []
  ))];
  
  if (allKeys.length === 0) {
    // If no object keys, display as simple list
    return (
      <View style={styles.simpleList}>
        {groups.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.listIndex}>{index + 1}.</Text>
            <Text style={styles.listText}>{String(item)}</Text>
          </View>
        ))}
      </View>
    );
  }

  // Calculate table width based on number of columns
  const tableWidth = Math.max(screenWidth * 1.5, allKeys.length * 120 + 80);

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
            {allKeys.map((key) => (
              <Text key={key} style={styles.tableHeaderCell}>
                {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}
              </Text>
            ))}
          </View>
          
          {/* Table Rows */}
          {groups.map((item, index) => (
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
              {allKeys.map((key) => {
                const value = item[key];
                
                // Render images in table cells
                if (typeof value === 'string' && (value.includes('file:') || value.includes('http'))) {
                  return (
                    <View key={key} style={[styles.tableCell, styles.imageCell]}>
                      <ImageField value={value} />
                    </View>
                  );
                }
                
                // Render signature images
                if (typeof value === 'string' && value.includes('data:image')) {
                  const uri = value.startsWith('data:image') ? value : `data:image/png;base64,${value}`;
                  return (
                    <View key={key} style={[styles.tableCell, styles.imageCell]}>
                      <Image source={{ uri }} style={styles.tableImage} />
                    </View>
                  );
                }
                
                // Default text display
                return (
                  <Text key={key} style={styles.tableCell}>
                    {value || '-'}
                  </Text>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// Remove the separate ImageGroupDisplay component since it's now integrated

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
  
  // Handle all array types through DynamicGroupDisplay
  if (Array.isArray(value)) {
    // Check if this is specifically an image group
    const isImageGroup = type === 'image_group' || 
      (Array.isArray(value) && value.length > 0 && 
       typeof value[0] === 'object' && value[0] !== null && 
       (value[0].uri || value[0].url || value[0].path));
    
    return (
      <DynamicGroupDisplay 
        groups={value} 
        groupFields={fieldDef?.groupFields || []}
        isImageGroup={isImageGroup}
      />
    );
  }

  if (type === 'accordion') {
    return <AccordionDisplay value={value} fieldDef={fieldDef} />;
  }

  // Handle checkbox fields
  if (type === 'checkbox') {
    return renderCheckboxField(value, fieldDef);
  }

  // Handle single image fields
  if (
    type === 'image' ||
    (typeof value === 'string' && value.includes('file:'))
  ) {
    console.log(type, value);
    return <ImageField value={value} />;
  }

  // Handle signature fields
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

  if (['radio', 'select'].includes(type)) {
    return <Text>{String(value)}</Text>;
  }

  // Handle object values
  if (typeof value === 'object' && value !== null) {
    return <ObjectTableDisplay value={value} />;
  }

  return <Text>{value || 'Not provided'}</Text>;
};

// Helper function to render checkbox fields
const renderCheckboxField = (value, fieldDef) => {
  // Handle checkbox group display
  if (fieldDef?.options && Array.isArray(fieldDef.options)) {
    const selectedOptions = Array.isArray(value) ? value : [];
    const selectedLabels = selectedOptions.map(selectedValue => {
      const option = fieldDef.options.find(opt => 
        (opt.value || opt) === selectedValue
      );
      return option?.label || option || selectedValue;
    });
    
    return (
      <View>
        <Text style={styles.checkboxGroupLabel}>{fieldDef.label}:</Text>
        {selectedOptions.length > 0 ? (
          selectedLabels.map((label, index) => (
            <Text key={index} style={styles.checkboxGroupItem}>• {label}</Text>
          ))
        ) : (
          <Text style={styles.noData}>None selected</Text>
        )}
      </View>
    );
  } else {
    // Handle single checkbox display
    return (
      <Text>
        {fieldDef?.label || 'Checkbox'}: {value ? 'Yes' : 'No'}
      </Text>
    );
  }
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCell: {
    padding: 4,
  },
  tableImage: {
    width: 100,
    height: 60,
    resizeMode: 'contain',
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
  },
  // Image Group Styles
  imageGroupContainer: {
    marginTop: 10,
  },
  imageDisplayCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  imageDisplayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  imageDisplay: {
    height: 200,
    width: '100%',
    borderRadius: 4,
    marginBottom: 8,
  },
  descriptionContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  descriptionLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
  imageProperties: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  propertiesTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 6,
    color: '#555',
  },
  propertyRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  propertyKey: {
    fontWeight: '600',
    fontSize: 12,
    color: '#666',
    width: 100,
  },
  propertyValue: {
    fontSize: 12,
    color: '#333',
    flex: 1,
  },
  // Simple list styles for non-object arrays
  simpleList: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  listItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  listIndex: {
    fontWeight: 'bold',
    marginRight: 8,
    color: '#666',
  },
  listText: {
    flex: 1,
    color: '#333',
  },
  // Checkbox styles
  checkboxGroupLabel: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  checkboxGroupItem: {
    marginLeft: 8,
    marginBottom: 4,
    color: '#333',
  },
  accordionContainer: {
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 8,
  padding: 12,
  backgroundColor: '#f9f9f9',
  marginTop: 8,
},
accordionField: {
  marginBottom: 12,
  paddingBottom: 12,
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
},
accordionSubLabel: {
  fontWeight: 'bold',
  color: '#444',
  marginBottom: 6,
  fontSize: 14,
},
});

export default FormViewScreen;