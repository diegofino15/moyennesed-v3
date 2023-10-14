import { Dimensions } from 'react-native';
import { useState, useRef, useEffect, useCallback } from 'react';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';


function BottomSheet({ isOpen, onClose, children, backgroundStyle, snapPoints }) {
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
      index={0}
      onDismiss={handleCloseModal}
      style={{
        width: Dimensions.get('window').width,
        borderTopEndRadius: 20,
        paddingHorizontal: 20,
      }}
      backgroundStyle={backgroundStyle}
      backdropComponent={renderBackdrop}
    >
      {children}
    </BottomSheetModal>
  );
}

export default BottomSheet;

