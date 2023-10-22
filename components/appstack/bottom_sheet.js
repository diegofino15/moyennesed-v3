import { useState, useRef, useEffect, useCallback } from 'react';
import { View, Dimensions } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';


function BottomSheet({ isOpen, onClose, children, backgroundStyle, snapPoints, selectedSnapPoint=0 }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    if (isOpen) { handleOpenModal(); }
  }, [isOpen]);

  const handleOpenModal = () => {
    if (isModalOpen) { return; }
    setIsModalOpen(true);
    bottomSheetModalRef.current?.present();
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    bottomSheetModalRef.current?.dismiss();
    onClose();
  };
  const bottomSheetModalRef = useRef(null);

  const renderBackdrop = useCallback(
    (props) => <BottomSheetBackdrop
      disappearsOnIndex={-1}
      {...props}
    />,
    []
  );
  
  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={snapPoints}
      index={selectedSnapPoint}
      onDismiss={handleCloseModal}
      style={{
        width: Dimensions.get('window').width,
        borderTopEndRadius: 20,
      }}
      backgroundStyle={backgroundStyle}
      backdropComponent={renderBackdrop}
    >
      <View style={{
        paddingHorizontal: 20,
      }}>
        {children}
      </View>
    </BottomSheetModal>
  );
}

export { BottomSheet };