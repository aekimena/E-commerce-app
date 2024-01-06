// context for general stuff

import React, {useState, useRef, useEffect} from 'react';

export const GeneralContext = React.createContext();

const GeneralContextProvider = ({children}) => {
  const drawer = useRef(null);


  const [registeredEmail, setRegisteredEmail] = useState('');

  return (
    <GeneralContext.Provider
      value={{
        drawer,
        registeredEmail,
        setRegisteredEmail,
      }}>
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralContextProvider;
