import React, {useState, useRef, useEffect} from 'react';

export const GeneralContext = React.createContext();

const GeneralContextProvider = ({children}) => {
  const drawer = useRef(null);

  const [modalVisible, setModalVisible] = useState(false);

  const [registeredEmail, setRegisteredEmail] = useState('');

  return (
    <GeneralContext.Provider
      value={{
        drawer,
        modalVisible,
        setModalVisible,
        registeredEmail,
        setRegisteredEmail,
      }}>
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralContextProvider;
