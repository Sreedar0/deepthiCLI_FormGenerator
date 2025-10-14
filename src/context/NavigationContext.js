import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [screenParams, setScreenParams] = useState({});

  const navigate = (screen, params = {}) => {
    setCurrentScreen(screen);
    setScreenParams(params);
  };

  const goBack = () => {
    setCurrentScreen('Home');
    setScreenParams({});
  };

  const value = {
    currentScreen,
    screenParams,
    navigate,
    goBack,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};