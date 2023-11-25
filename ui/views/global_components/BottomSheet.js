import { useState, useRef, useEffect, useCallback } from 'react';
import { View, Dimensions } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';


function BottomSheet({ isOpen, onClose, children, backgroundStyle, snapPoints, theme, selectedSnapPoint=0, padding=20 }) {
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
      name='bottom_sheet'
      ref={bottomSheetModalRef}
      snapPoints={snapPoints}
      index={selectedSnapPoint}
      onDismiss={handleCloseModal}
      style={{
        width: Dimensions.get('screen').width,
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
      backgroundStyle={{
        backgroundColor: theme.colors.background,
        ...backgroundStyle,
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.onBackground,
      }}
      backdropComponent={renderBackdrop}
    >
      <View style={{
        paddingHorizontal: padding,
        backgroundColor: theme.colors.background,
      }}>
        {children}
      </View>
    </BottomSheetModal>
  );
}

export { BottomSheet };