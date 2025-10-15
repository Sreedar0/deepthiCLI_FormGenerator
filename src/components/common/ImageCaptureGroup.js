import React, { useState } from 'react';
import { View, Button, Image, Alert, Platform, Text, TouchableOpacity, TextInput, FlatList, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { height: screenHeight } = Dimensions.get('window');

const copyToPermanentStorage = async (tempUri) => {
  try {
    const fileName = `image_${Date.now()}.jpg`;
    const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    
    let sourcePath = tempUri;
    if (tempUri.startsWith('file://')) {
      sourcePath = tempUri.replace('file://', '');
    }
    
    await RNFS.copyFile(sourcePath, destPath);
    return `file://${destPath}`;
  } catch (error) {
    console.error('copyToPermanentStorage error:', error);
    return null;
  }
};

const ImageCaptureGroup = ({ images, setImages }) => {
  console.log("ImageCaptureGroup - images prop:", images);
  
  const safeImages = Array.isArray(images) ? images : [];

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.7,
      },
      async (response) => {
        console.log("Image picker response:", response);
        if (response.assets && response.assets[0]?.uri) {
          const permanentUri = await copyToPermanentStorage(response.assets[0].uri);
          console.log("Permanent URI:", permanentUri);
          if (permanentUri) {
            const newImage = {
              id: Date.now().toString(),
              uri: permanentUri,
              description: ''
            };
            console.log("Adding new image:", newImage);
            
            const updatedImages = [...safeImages, newImage];
            setImages(updatedImages);
          }
        }
      }
    );
  };

  const takePhoto = () => {
    launchCamera(
      {
        mediaType: 'photo',
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.7,
        saveToPhotos: false,
      },
      async (response) => {
        console.log("Camera response:", response);
        if (response.assets && response.assets[0]?.uri) {
          const permanentUri = await copyToPermanentStorage(response.assets[0].uri);
          console.log("Permanent URI:", permanentUri);
          if (permanentUri) {
            const newImage = {
              id: Date.now().toString(),
              uri: permanentUri,
              description: ''
            };
            console.log("Adding new image:", newImage);
            
            const updatedImages = [...safeImages, newImage];
            setImages(updatedImages);
          }
        }
      }
    );
  };

  const deleteImage = (imageId) => {
    console.log("Deleting image:", imageId);
    const updatedImages = safeImages.filter(img => img.id !== imageId);
    setImages(updatedImages);
  };

  const updateDescription = (imageId, description) => {
    console.log("Updating description for:", imageId, "to:", description);
    const updatedImages = safeImages.map(img => 
      img.id === imageId ? { ...img, description } : img
    );
    setImages(updatedImages);
  };

  const renderImageItem = ({ item: image, index }) => (
    <View style={styles.imageCard}>
      <View style={styles.imageHeader}>
        <Text style={styles.imageNumber}>Image {index + 1}</Text>
        <TouchableOpacity 
          onPress={() => deleteImage(image.id)}
          style={styles.deleteButton}
        >
          <Icon name="delete" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.imageContent}>
        <Image
          source={{ uri: image.uri }}
          style={styles.image}
          resizeMode="cover"
          onError={(e) => console.log('Image load error:', e.nativeEvent)}
        />
        
        <TextInput
          style={styles.descriptionInput}
          placeholder="Add description for this image..."
          value={image.description}
          onChangeText={(text) => updateDescription(image.id, text)}
          multiline
          numberOfLines={3}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Take Photo" onPress={takePhoto} />
        <Button title="Pick from Gallery" onPress={pickImage} />
      </View>
      
      <Text style={styles.imagesCount}>
        {safeImages.length} image{safeImages.length !== 1 ? 's' : ''} added
      </Text>
      
      {safeImages.length > 0 ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
        >
          {safeImages.map((image, index) => (
            <View key={image.id} style={styles.imageCard}>
              <View style={styles.imageHeader}>
                <Text style={styles.imageNumber}>Image {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => deleteImage(image.id)}
                  style={styles.deleteButton}
                >
                  <Icon name="delete" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.imageContent}>
                <Image
                  source={{ uri: image.uri }}
                  style={styles.image}
                  resizeMode="cover"
                  onError={(e) => console.log('Image load error:', e.nativeEvent)}
                />
                
                <TextInput
                  style={styles.descriptionInput}
                  placeholder="Add description for this image..."
                  value={image.description}
                  onChangeText={(text) => updateDescription(image.id, text)}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noImagesText}>No images added yet. Click buttons above to add images.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  imagesCount: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    fontWeight: '500',
  },
  listContainer: {
    height: Math.min(screenHeight * 0.5, 400), // Dynamic height based on screen
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  imageCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  imageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  imageNumber: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  deleteButton: {
    padding: 4,
  },
  imageContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 4,
    backgroundColor: '#f5f5f5',
  },
  descriptionInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  noImagesText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    marginTop: 20,
    fontSize: 14,
  },
});

export default ImageCaptureGroup;