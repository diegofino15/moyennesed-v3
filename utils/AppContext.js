import { createContext, useContext } from 'react';

const AppContext = createContext({
  loggedIn: false,
  setLoggedIn: () => {},
});

export const useAppContext = () => useContext(AppContext);

export function AppContextProvider({ children, state }) {
  return (
    <AppContext.Provider value={state}>
      {children}
    </AppContext.Provider>
  );
}


