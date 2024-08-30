import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import verifyUser from '../utils/verifyUser';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isVerified, setIsVerified] = useState(null); // State to hold verification status

  useEffect(() => {
    const checkVerification = async () => {
      const verified = await verifyUser();
      setIsVerified(verified);
    };

    checkVerification();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem('currentUser');
    setIsVerified(false);
  };

  return (
    <AuthContext.Provider value={{ isVerified, setIsVerified, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
