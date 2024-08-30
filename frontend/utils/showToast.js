import Toast from 'react-native-toast-message';

export const showToast = ({message, type = 'success'}) => {
  Toast.show({
    type,
    position: 'top',
    text1: message,
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 50, // Adjust the top offset as needed
    onPress: () => Toast.hide(),
  });
};
