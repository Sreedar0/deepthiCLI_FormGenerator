import React from 'react';
import { View, Button, Image, Alert, Platform, Text } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';

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

const ImageCapture = ({ image, setImage }) => {
  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.7,
      },
      async (response) => {
        if (response.assets && response.assets[0]?.uri) {
          const permanentUri = await copyToPermanentStorage(response.assets[0].uri);
          if (permanentUri) {
            setImage(permanentUri);
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
        if (response.assets && response.assets[0]?.uri) {
          const permanentUri = await copyToPermanentStorage(response.assets[0].uri);
          if (permanentUri) {
            setImage(permanentUri);
          }
        }
      }
    );
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <Button title="Take Photo" onPress={takePhoto} />
      <Button title="Pick from Gallery" onPress={pickImage} />
      {image ? (
        <View style={{ marginTop: 8 }}>
          <Text style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
            Preview:
          </Text>
          <Image
            source={{ uri: image }}
            style={{ height: 120, width: 150 }}
            resizeMode="cover"
          />
        </View>
      ) : null}
    </View>
  );
};

export default ImageCapture;