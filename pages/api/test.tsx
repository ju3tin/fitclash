import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'GET') {
    res.status(200).json({ message: 'Hello from the TypeScript API!' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}