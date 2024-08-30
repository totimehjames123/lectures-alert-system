import { Expo } from 'expo-server-sdk';

let expo = new Expo();

const sendPushNotification = async (expoPushToken, title, body, lectureId) => {
  let messages = [];
  
  if (!Expo.isExpoPushToken(expoPushToken)) {
    console.error(`Invalid Expo push token: ${expoPushToken}`);
    return;
  }
  
  messages.push({
    to: expoPushToken,
    sound: 'default',
    title: title,
    body: body,
    data: { extraData: lectureId },
  });

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  let errors = [];

  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      ticketChunk.forEach(ticket => {
        if (ticket.status === 'error') {
          errors.push(ticket);
        }
      });
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error(error);
    }
  }

  if (errors.length) {
    console.error('Errors sending push notifications:', errors);
  }

  return tickets;
};

export default sendPushNotification