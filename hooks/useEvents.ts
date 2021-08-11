import { useContext } from 'react';
import { EventBridgeCanonContext } from '@/contexts/EventBridgeCanon';
import { IApplicationData, ICollectionEvent, ILog, ISchema } from '@/types/index';

interface IHookFunctions {
  updateEvent: (event) => Promise<ICollectionEvent>;
  publishEvent: (event) => Promise<ILog>;
  saveEvent: (event) => Promise<ICollectionEvent>;
  getAllEventsAndEventSources: () => any; // TODO fix type
}

const useEvents = (): [ISchema[], IHookFunctions] => {
  // Fix any
  const [applicationData = {}, setApplicationData] = useContext<[IApplicationData, any]>(EventBridgeCanonContext);

  const { schemas, logs }: IApplicationData = applicationData;

  const updateEvent = async (customEvent): Promise<ICollectionEvent> => {
    const { schema, ...payload } = customEvent;

    try {
      const response = await fetch(`/api/collections/${customEvent.collectionId}/events`, {
        body: JSON.stringify({ event: payload }, null, 4),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PUT',
      });
      const event = await response.json();

      return event;
    } catch (error) {
      throw Error(error);
    }
  };

  const publishEvent = async (event): Promise<ILog> => {
    try {
      const response = await fetch(`/api/events/publish`, {
        body: JSON.stringify(event),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      const newLog = await response.json();

      setApplicationData({
        ...applicationData,
        logs: logs.concat([newLog]),
      });

      return newLog;
    } catch (error) {
      throw Error(error);
    }
  };

  const saveEvent = async (event): Promise<ICollectionEvent> => {
    try {
      const newEvent = await fetch(`/api/collections/${event.collectionId}/events`, {
        body: JSON.stringify({
          event,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      const response = await newEvent.json();
      return response;
    } catch (error) {
      throw Error(error);
    }
  };

  const getAllEventsAndEventSources = () => {
    return (
      (schemas &&
        schemas.reduce((sources, { source, detailType }) => {
          sources[source] = sources[source] || { schemas: [] };
          sources[source].schemas.push(detailType);
          return sources;
        }, {})) ||
      []
    );
  };

  return [
    schemas,
    {
      saveEvent,
      publishEvent,
      updateEvent,
      getAllEventsAndEventSources,
    },
  ];
};

export default useEvents;
