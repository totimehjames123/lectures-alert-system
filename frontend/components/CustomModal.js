// CustomModal.js
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Dialog, Button, Text } from 'react-native-paper';

const CustomModal = ({ visible, onDismiss, onConfirm, type, initialDate, initialReason }) => {
  const [date, setDate] = React.useState(initialDate || '');
  const [reason, setReason] = React.useState(initialReason || '');

  return (
    <Dialog visible={visible} onDismiss={onDismiss}>
      <Dialog.Title>
        {type === 'postpone' ? 'Reschedule Lecture' : 'Cancel Lecture'}
      </Dialog.Title>
      <Dialog.Content>
        {type === 'postpone' ? (
          <View>
            <Text>New Rescheduled Date:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new date"
              value={date}
              onChangeText={setDate}
            />
            <Text>Reason:</Text>
            <TextInput
              style={[styles.input, styles.commentInput]}
              placeholder="Enter reason"
              value={reason}
              onChangeText={setReason}
              multiline
            />
          </View>
        ) : (
          <View>
            <Text>Reason for Cancellation:</Text>
            <TextInput
              style={[styles.input, styles.commentInput]}
              placeholder="Enter reason"
              value={reason}
              onChangeText={setReason}
              multiline
            />
          </View>
        )}
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={() => onConfirm(date, reason)} mode="contained">
          {type === 'postpone' ? 'Submit Reschedule' : 'Submit Cancellation'}
        </Button>
        <Button onPress={onDismiss}>Cancel</Button>
      </Dialog.Actions>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  commentInput: {
    height: 80,
  },
});

export default CustomModal;
