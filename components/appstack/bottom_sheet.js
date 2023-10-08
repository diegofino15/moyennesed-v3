import { Dimensions } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';


function BottomSheet({ isOpen, onClose, children, backgroundStyle, snapPoints }) {
  const { dismissAll: dismissAllModals } = useBottomSheetModal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    if (isOpen) { handleOpenModal(); }
  }, [isOpen]);

  const handleOpenModal = () => {
    if (isModalOpen) { return; }
    dismissAllModals();
    setIsModalOpen(true);
    bottomSheetModalRef.current?.present();
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    bottomSheetModalRef.current?.dismiss();
    onClose();
    dismissAllModals();
  };
  const bottomSheetModalRef = useRef(null);
  
  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={snapPoints}
      index={0}
      onDismiss={handleCloseModal}
      style={{
        width: Dimensions.get('window').width,
        borderTopEndRadius: 20,
      }}
      backgroundStyle={backgroundStyle}
    >
      {children}
    </BottomSheetModal>
  );
}

export default BottomSheet;

