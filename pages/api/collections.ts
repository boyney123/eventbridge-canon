import type { NextApiRequest, NextApiResponse } from 'next';
import { saveCollection } from '@/lib/db';
import { v4 as uuid } from 'uuid';
import { ICollection } from '@/types/index';

export default async function handler(req: NextApiRequest, res: NextApiResponse<ICollection>) {
  if (req.method === 'POST') {
    const { collection } = req.body;

    const newCollection = {
      ...collection,
      events: [],
      id: uuid(),
    };

    await saveCollection(newCollection);

    return res.status(201).json(newCollection);
  } else {
    return res.status(400);
  }
}
