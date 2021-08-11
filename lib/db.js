// TODO: Get populate script to populate the initial datbase stuff.
import initialData from '../data/database.json';
import { Low, JSONFile } from 'lowdb';

const adapter = new JSONFile('./data/database.json');
const db = new Low(adapter);

db.data = initialData || {
  collections: [],
  customEvents: [],
  logs: [],
  ...data,
};

export const getAllEventsBySource = (source) => {
  return db.data.events.filter((event) => {
    return event.source === source;
  });
};

// tODO :REMOVE THIS
export const getEventByName = (name) => {
  return db.data.events.find((event) => {
    return event.detailType === name;
  });
};

export const getSchemaByDetailType = (detailType) => {
  return db.data.schemas.find((schema) => {
    return schema.detailType === detailType;
  });
};

export const getEventFromCollection = (collectionId, eventId) => {
  const collection = db.data.collections.find(({ id }) => id === collectionId);
  return collection.events.find(({ id }) => id === eventId);
};

/**
 * EVENTS
 */

export const createEvent = async (customEvent) => {
  const { collectionId, ...event } = customEvent;

  const collections = db.data.collections.map((collection) => {
    if (collection.id === collectionId) {
      return {
        ...collection,
        events: collection.events.concat([event]),
      };
    }
    return collection;
  });

  db.data.collections = collections;

  await db.write();
};

export const updateEvent = async (collectionId, customEvent) => {
  // TODO: Fix this, update things better.
  const collections = db.data.collections.map((collection) => {
    if (collection.id === collectionId) {
      return {
        ...collection,
        events: collection.events.map((event) => {
          if (event.id === customEvent.id) {
            return {
              ...event,
              ...customEvent,
            };
          }
          return event;
        }),
      };
    }
    return collection;
  });

  db.data.collections = collections;

  await db.write();
};

export const saveCollection = async (collection) => {
  db.data.collections.push(collection);
  await db.write();
};

export const saveEventLog = async (logEvent) => {
  db.data.logs.push(logEvent);
  await db.write();
};

export default db;
