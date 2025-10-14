import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import SideDrawer from '../components/navigation/SideDrawer';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import FormScreen from '../screens/FormScreen';
// import FormViewScreen from '../screens/FormViewScreen';
import FormViewScreen from '../screens/FormViewScreen';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { NavigationContainer } from '@react-navigation/native';
import Other from '../screens/other';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}}/>
      <Stack.Screen name="Form" component={FormScreen} options={{headerShown:false}}/>
      <Stack.Screen name="FormView" component={FormViewScreen} />
      {/* <Stack.Screen name="FormView" component={FormViewScreen} /> */}
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Drawer.Navigator drawerContent={props => <SideDrawer {...props} />}>
          <Drawer.Screen name="Main" component={MainStack} />
        </Drawer.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;