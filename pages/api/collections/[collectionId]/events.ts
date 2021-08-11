import type { NextApiRequest, NextApiResponse } from 'next';
import { createEvent, updateEvent } from '@/lib/db';
import { v4 as uuid } from 'uuid';
import { ICollectionEvent } from '@/types/index';

export default async function handler(req: NextApiRequest, res: NextApiResponse<ICollectionEvent>) {
  const { event } = req.body;
  const { collectionId } = req.query;

  if (!collectionId) {
    return res.status(400);
  }

  switch (req.method) {
    case 'POST':
      const newEvent = { ...event, id: uuid(), collectionId };
      await createEvent(newEvent);
      return res.status(201).json(newEvent);
    case 'PUT':
      await updateEvent(collectionId, event);
      return res.status(201).json(event);
    default:
      return res.status(400);
  }
}
