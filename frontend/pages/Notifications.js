import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import axios from 'axios';
import NotificationsCard from '../components/NotificationsCard';
import getCurrentUser from '../utils/getCurrentUser';
import { formatRelativeTime } from '../utils/formatRelativeTime';
import { useFocusEffect } from '@react-navigation/native';
import LoadingScreen from '../components/LoadingScreen';

const Notifications = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userParams, setUserParams] = useState(null);
  const intervalRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
      if (!userParams) return;

      const { role, classValue, indexNumber } = userParams;
      const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URL}/all-notifications`, {
        params: { role, classValue, indexNumber }
      });

      const data = response.data;
      if (Array.isArray(data)) {
        setNotifications(data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      // Don't set error state here to avoid disrupting the UI on every failed fetch
    }
  }, [userParams]);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          throw new Error('User not found');
        }

        const { role, classValue, indexNumber, _id } = currentUser;
        setUserParams({ role, classValue, indexNumber, _id });
        setLoading(false);
      } catch (err) {
        setError('Failed to initialize user');
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  useEffect(() => {
    if (userParams) {
      fetchNotifications();
      intervalRef.current = setInterval(fetchNotifications, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [userParams, fetchNotifications]);

  const handleNotificationRead = async (id) => {
    try {
      if (!userParams) return;

      const { role, classValue, indexNumber, _id } = userParams;
      
      await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URL}/mark-notification-read`, {
        id,
        role,
        classValue,
        indexNumber,
        userId: _id
      });

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === id ? { ...notification, readBy: [...notification.readBy, _id] } : notification
        )
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      if (!userParams) return;

      const { role, classValue, indexNumber, _id } = userParams;
      await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URL}/mark-all-notifications-read`, {
        role,
        classValue,
        indexNumber,
        userId: _id
      });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          readBy: [...notification.readBy, _id],
        }))
      );
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        markAllAsRead();
      };
    }, [userParams])
  );

  if (loading) {
    return <LoadingScreen text1='Fetching Notifications' text2=' '/>;
  }

  if (error) {
    return <Text className="text-red-500 text-center mt-3" style={{fontFamily: 'Poppins-Regular'}}>{error}</Text>;
  }

  const unreadNotifications = notifications.filter(notification => 
    !notification.readBy.includes(userParams?._id)
  );
  const readNotifications = notifications.filter(notification => 
    notification.readBy.includes(userParams?._id)
  );

  return (
    <ScrollView contentContainerStyle={{ paddingVertical: 10 }} style={{ backgroundColor: 'white', flex: 1 }}>
      {unreadNotifications.length === 0 && readNotifications.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'gray', textAlign: 'center', marginTop: 16, fontFamily: "Poppins-Regular" }}>You have no notifications</Text>
        </View>
      ) : (
        <>
          {unreadNotifications.length > 0 && (
            <>
              <Text style={{ fontSize: 12, color: 'gray', marginBottom: 8, paddingHorizontal: 10 }}>{unreadNotifications.length} UNREAD NOTIFICATIONS</Text>
              {unreadNotifications.map((notification) => (
                <NotificationsCard
                  key={notification._id}
                  action={notification.action}
                  title={notification.title || notification.action}
                  description={notification.description}
                  period={formatRelativeTime(notification.date)}
                  isRead={false}
                  onPress={() => handleNotificationRead(notification._id)}
                />
              ))}
            </>
          )}

          {readNotifications.length > 0 && (
            <>
              <Text style={{ fontSize: 12, color: 'gray', marginVertical: 8, paddingHorizontal: 10  }}>ALL READ NOTIFICATIONS</Text>
              {readNotifications.map((notification) => (
                <NotificationsCard
                  key={notification._id}
                  action={notification.action}
                  title={notification.title || notification.action}
                  description={notification.description}
                  period={formatRelativeTime(notification.date)}
                  isRead={true}
                />
              ))}
            </>
          )}
        </>
      )}
    </ScrollView>
  );
};

export default Notifications;