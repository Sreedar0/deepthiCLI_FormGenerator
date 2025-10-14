import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomInput from '../components/common/CustomInput';
import CustomButton from '../components/common/CustomButton';
import { globalStyles, colors } from '../styles/globalStyles';
import { useAuth } from '../context/AuthContext';

const Other = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = () => {
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    // Dummy validation
    if (username === 'admin' && password === 'password') {
      setError('');
      login();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <View style={globalStyles.container}>
      <View style={styles.loginContainer}>
        <Text style={globalStyles.title}>Inspection App</Text>
        <Text style={globalStyles.subtitle}>Please login to continue</Text>
        
        {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}
        
        <CustomInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
        />
        
        <CustomInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />
        
        <CustomButton
          title="Login"
          onPress={handleLogin}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
    marginTop: 50,
  },
});

export default Other;