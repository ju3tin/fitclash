const PubNub = require('pubnub');

// Initialize PubNub with demo keys
const pubnub = new PubNub({
  publishKey: 'demo',
  subscribeKey: 'demo',
  userId: 'myUniqueUserId'
});

// Next.js API route handler
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, channel } = req.body;
  if (!message || !channel) {
    return res.status(400).json({ error: 'Missing message or channel' });
  }

  try {
    const result = await pubnub.publish({
      message,
      channel,
      sendByPost: false,
      storeInHistory: true,
      meta: { sender: "user123" },
      customMessageType: "text-message"
    });
    return res.status(200).json({ success: true, result });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}