import type { NextApiRequest, NextApiResponse } from 'next';

import { saveEventLog } from '@/lib/db';
import { putEvent } from '@/lib/aws';
import { v4 as uuid } from 'uuid';
import { ILog } from '@/types/index';

export default async function handler(req: NextApiRequest, res: NextApiResponse<ILog>) {
  if (req.method === 'POST') {
    const { payload, id } = req.body;

    const { Entries = [] } = await putEvent({
      ...payload,
      Time: new Date(payload.Time),
      Detail: JSON.stringify(payload.Detail),
    });

    const awsPublishEventId = Entries[0]?.EventId;

    const log = {
      awsPublishEventId,
      eventId: id,
      createdAt: new Date(),
      payload,
      id: uuid(),
    };

    await saveEventLog(log);

    return res.status(201).json(log);
  } else {
    return res.status(400);
  }
}
