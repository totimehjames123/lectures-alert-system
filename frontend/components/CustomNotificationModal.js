import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchablePicker from './SearchablePicker';
import { classes } from '../utils/constants';
import CommentField from './CommentField';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/userSlice'; // Import the selector to get user data
import AlertMessage from './AlertMessage'; // Import the custom AlertMessage component

const CustomNotificationModal = ({ visible, onClose }) => {
    const [classValue, setClassValue] = useState('CPS 2B');
    const [comment, setComment] = useState('');
    const [lecturerDetails, setLecturerDetails] = useState(null);
    const [loading, setLoading] = useState(false); // Added loading state
    const [alert, setAlert] = useState({ visible: false, message: '', type: 'success' });

    // Fetch user data from Redux store
    const user = useSelector(selectUser);

    useEffect(() => {
        if (user) {
            setLecturerDetails({
                indexNumber: user.indexNumber,
                fullName: user.fullName,
            });
        }
    }, [user]);

    const handleConfirm = async () => {
        if (!lecturerDetails) {
            setAlert({
                visible: true,
                message: 'Unable to fetch lecturer details.',
                type: 'error'
            });
            return;
        }

        if (!classValue || !comment) { // Validate fields
            setAlert({
                visible: true,
                message: 'Please fill in all fields.',
                type: 'warning'
            });
            return;
        }

        setLoading(true); // Start loading

        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URL}/send-custom-notification`, {
                classValue,
                message: comment,
                lecturerIndexNumber: lecturerDetails.indexNumber,
                lecturerName: lecturerDetails.fullName,
            });
            if (response.status === 200) {
                setAlert({
                    visible: true,
                    message: response.data.message || 'Notifications sent successfully.',
                    type: 'success'
                });
                // Delay closing the modal and clearing fields
                setTimeout(() => {
                    setAlert({ ...alert, visible: false });
                    setClassValue('CPS 2B'); // Reset the class value
                    setComment(''); // Clear the comment field
                    onClose(); // Close the modal
                }, 2000); // Show alert for 2 seconds
            } else {
                setAlert({
                    visible: true,
                    message: response.data.message || 'Failed to send notification.',
                    type: 'error'
                });
            }
        } catch (error) {
            console.log('Error sending notification:', error);
            setAlert({
                visible: true,
                message: error.response?.data?.message || 'An error occurred while sending notification.',
                type: 'error'
            });
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <Modal transparent={true} visible={visible} animationType="slide">
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
                <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '90%', position: 'relative' }}>
                    <TouchableOpacity
                        onPress={onClose}
                        style={{ position: 'absolute', top: 10, right: 10 }}
                    >
                        <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, textAlign: 'center', fontFamily: "Poppins-Regular" }}>Send a Notification</Text>
                    <Text style={{ fontSize: 12, color: 'gray', textAlign: 'center', marginBottom: 16, fontFamily: "Poppins-Regular" }}>
                        Send a customized notification to your students
                    </Text>

                    <View>
                        <SearchablePicker
                            icon="grid-outline"
                            label="Class"
                            options={classes}
                            selectedValue={classValue}
                            onSelect={setClassValue}
                            moreClass={'mb-2'}
                        />
                        <CommentField
                            moreClass="mb-4"
                            onChangeText={setComment}
                            value={comment}
                            label="Write a message"
                            numberOfLines={undefined}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
                        <TouchableOpacity
                            onPress={onClose}
                            style={{ borderColor: 'gray', borderWidth: 1, padding: 10, paddingHorizontal: 20, borderRadius: 5 }}
                        >
                            <Text style={{ color: 'gray', fontFamily: "Poppins-Regular" }}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleConfirm}
                            style={{ backgroundColor: '#FBBF24', padding: 10, paddingHorizontal: 20, borderRadius: 5 }}
                            disabled={loading} // Disable button while loading
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={{ color: 'gray', fontFamily: "Poppins-Regular" }}>Send</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <AlertMessage
                visible={alert.visible}
                onDismiss={() => setAlert({ ...alert, visible: false })}
                message={alert.message}
                type={alert.type}
            />
        </Modal>
    );
};

export default CustomNotificationModal;
