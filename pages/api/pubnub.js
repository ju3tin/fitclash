// pages/api/pubnub.js
import PubNub from 'pubnub';

export default async function handler(req, res) {
  const { channel, message, uuid } = req.query;

  if (!channel) {
    return res.status(400).json({ error: 'Channel parameter is required.' });
  }

  if (!uuid) {
    return res.status(400).json({ error: 'UUID parameter is required.' });
  }

  const pubnub = new PubNub({
    publishKey: process.env.PUBNUB_PUBLISH_KEY,
    subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
    uuid: uuid, // Use dynamic UUID
  });

  if (req.method === 'GET') {
    // Fetch last 10 messages from the channel
    try {
      const history = await pubnub.fetchMessages({
        channels: [channel],
        count: 10,
      });

      return res.status(200).json({ messages: history.channels[channel] || [] });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch messages.' });
    }
  }

  if (req.method === 'POST') {
    // Send a message to the channel
    try {
      if (!message) {
        return res.status(400).json({ error: 'Message parameter is required.' });
      }

      await pubnub.publish({
        channel: channel,
        message: message,
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to send message.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}
