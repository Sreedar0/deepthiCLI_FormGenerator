import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { globalStyles, colors } from '../../styles/globalStyles';

const LoadingSpinner = ({ text = 'Loading...' }) => (
  <View style={globalStyles.loadingContainer}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={globalStyles.loadingText}>{text}</Text>
  </View>
);

export default LoadingSpinner;