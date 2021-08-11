import { GetServerSideProps } from 'next';
import { getEventFromCollection } from '@/lib/db';
import EventViewer from '@/components/EventViewer';

const EventSources = ({ collectionEvent, collectionId }) => {
  return <EventViewer isEditingEvent={true} collectionId={collectionId} {...collectionEvent} />;
};

export const getServerSideProps: GetServerSideProps = async (req) => {
  const collectionId = req.params.collectionId;
  const eventId = req.params.eventId;

  const collectionEvent = getEventFromCollection(collectionId, eventId);

  return {
    props: {
      collectionId,
      collectionEvent,
    },
  };
};

export default EventSources;
