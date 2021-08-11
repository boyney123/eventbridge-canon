import React, { useState } from 'react';
import { useRouter, NextRouter } from 'next/router';
import NewEventModal from './Modals/NewEventModal';
import ImportEventModal from './Modals/ImportEventModal';

import useEvents from '@/hooks/useEvents';

import Link from 'next/link';
import { ICollectionEvent } from '../types';
import toast from 'react-hot-toast';

interface IHandleCreate {
  source: string;
  detailType: string;
}

const TopNavigationBar = () => {
  const router: NextRouter = useRouter();
  const [creatingNewEvent, setCreatingNewEvent] = useState(false);
  const [importingEvent, setImportingEvent] = useState(false);

  const [_, { saveEvent }] = useEvents();

  const handleCreate = ({ source, detailType }: IHandleCreate) => {
    router.push(`/events/create?source=${source}&detailType=${detailType}`);
    setCreatingNewEvent(false);
  };

  const handleImport = async (event: ICollectionEvent) => {
    const importedEvent = await saveEvent(event);
    toast.success('Succesfully imported event, loading event...');
    window.location.href = `/collection/${importedEvent.collectionId}/event/${importedEvent.id}`;
  };

  return (
    <div className="mx-auto px-4 lg:px-4 bg-gray-800">
      <NewEventModal isOpen={creatingNewEvent} onCancel={() => setCreatingNewEvent(false)} onCreate={handleCreate} />
      <ImportEventModal isOpen={importingEvent} onCancel={() => setImportingEvent(false)} onCreate={handleImport} />
      <div className="flex items-center justify-between h-16">
        <Link href="/">
          <a className=" flex items-center">
            <img src="/eventbridge-icon.svg" className="w-8" />
            <div className="flex-shrink-0 text-white font-bold pl-2">EventBridge Canon</div>
          </a>
        </Link>
        <div className="sm:ml-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 space-x-4">
              <button
                type="button"
                onClick={() => setImportingEvent(true)}
                className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-transparent  bg-gray-700 border-gray-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-pink-500"
              >
                <span>Import Event</span>
              </button>
              <button
                type="button"
                onClick={() => setCreatingNewEvent(true)}
                className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-pink-500"
              >
                <span>New Event</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavigationBar;
