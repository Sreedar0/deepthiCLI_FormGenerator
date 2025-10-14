import { PermissionsAndroid, Platform, Alert } from 'react-native';

export async function requestStoragePermission() {
  if (Platform.OS !== 'android') return true; // No need on iOS (Info.plist handles this)

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission',
        message: 'This app needs access to your storage to display photos',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      Alert.alert('Permission denied', 'Storage permission is needed to select photos.');
      return false;
    }
  } catch (err) {
    console.warn('Permission error', err);
    Alert.alert('Permission error', 'Error requesting storage permission.');
    return false;
  }
}
