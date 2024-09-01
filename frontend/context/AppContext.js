import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [appKey, setAppKey] = useState(0);

  const reloadApp = () => setAppKey(prevKey => prevKey + 1);

  return (
    <AppContext.Provider value={{ appKey, reloadApp }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
