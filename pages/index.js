import { useState } from 'react';
import { useRouter } from 'next/router';
import { PlusIcon } from '@heroicons/react/solid';
import { DocumentIcon } from '@heroicons/react/outline';
import NewEventModal from '@/components/Modals/NewEventModal';

const EventSources = () => {
  const router = useRouter();

  const [creatingNewEvent, setCreatingNewEvent] = useState(false);

  const hasProjects = false;

  const handleCreate = ({ source, detailType }) => {
    router.push(`/events/create?source=${source}&detailType=${detailType}`);
  };

  return (
    <div className="flex-1 flex flex-col">
      <NewEventModal isOpen={creatingNewEvent} onCancel={() => setCreatingNewEvent(false)} onCreate={handleCreate} />

      {!hasProjects && (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center -mt-20">
            <h3 className="mt-2 text-2xl font-medium text-gray-900">EventBridge Canon</h3>
            <p className="mt-2 text-md text-gray-500">Publish, Save and Share AWS EventBridge Events</p>
            <div className="mt-6 space-x-4">
              <button
                onClick={() => setCreatingNewEvent(true)}
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Create Event
              </button>
              <a
                href="https://eventbridge-canon.netlify.app/"
                target="_blank"
                rel="noreferrer"
                type="button"
                className="inline-flex items-center px-4 py-2 border-transparent shadow-sm text-sm font-medium rounded-md text-pink-500 border border-pink-500 bg-transparent  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                <DocumentIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Read Docs
              </a>
            </div>
          </div>
        </div>
      )}
      {hasProjects && <>Projects Bro</>}
    </div>
  );
};

export async function getServerSideProps(req) {
  return {
    props: {
      eventBus: process.env.EVENT_BUS_NAME,
    },
  };
}

export default EventSources;
