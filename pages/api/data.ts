import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';
import { IApplicationData } from '@/types/index';

export default async function handler(req: NextApiRequest, res: NextApiResponse<IApplicationData>) {
  if (req.method === 'GET') {
    return res.status(201).json(db.data);
  } else {
    return res.status(400);
  }
}
