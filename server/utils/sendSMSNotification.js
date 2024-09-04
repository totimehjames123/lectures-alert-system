import axios from 'axios'; // Ensure axios is imported

const sendSMSNotification = async (phoneNumbers, message) => {
  try {
    const apiKey = process.env.SMS_KEY;
    if (!apiKey) {
      throw new Error("API key is not defined. Check your environment variables.");
    }

    const to = phoneNumbers.join(',');

    const response = await axios.get('https://sms.arkesel.com/sms/api', {
      params: { 
        action: 'send-sms',
        api_key: apiKey,
        to,
        from: 'CPS LECTS',
        sms: message
      }
    });

    console.log('SMS sent:', response.data);
  } catch (error) {
    console.error('Error sending SMS:', error.message);
  }
};

export default sendSMSNotification 
