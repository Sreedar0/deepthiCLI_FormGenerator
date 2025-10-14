import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { globalStyles, colors } from '../../styles/globalStyles';

const SideDrawer = () => {
  const { logout } = useAuth();
  const { navigate } = useNavigation();

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>Inspection App</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.drawerItem}
        onPress={() => navigate('Home')}
      >
        <Text style={styles.drawerItemText}>Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.drawerItem}
        onPress={() => {
          logout();
          navigate('Login');
        }}
      >
        <Text style={styles.drawerItemText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: colors.white,
  },
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
    marginBottom: 20,
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
  },
  drawerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  drawerItemText: {
    fontSize: 18,
    color: colors.dark,
  },
});

export default SideDrawer;