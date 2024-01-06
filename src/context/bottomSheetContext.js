// context for bottom sheets

import React, {useRef} from 'react';

export const BottomSheet = React.createContext();

const BottomSheetContext = ({children}) => {
  const refRBSheetForAddress = useRef(null);
  const refRBSheetForEditAddress = useRef(null);
  const refRBSheetForCart = useRef(null);
  return (
    <BottomSheet.Provider
      value={{
        refRBSheetForAddress,
        refRBSheetForEditAddress,
        refRBSheetForCart,
      }}>
      {children}
    </BottomSheet.Provider>
  );
};

export default BottomSheetContext;
