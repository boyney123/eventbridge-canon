/* This example requires Tailwind CSS v2.0+ */
import { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import Link from 'next/link';
import toast from 'react-hot-toast';

import { FolderIcon } from '@heroicons/react/outline';
import useCollections from '@/hooks/useCollections';
import CreateCollectionModal from '@/components/Modals/CreateCollectionModal';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function CollectionList() {
  const [collections, { saveCollection }] = useCollections();
  const [showCollectionModal, setShowCollectionModal] = useState(false);

  const handleCreate = async (collection) => {
    try {
      await saveCollection(collection);
      setShowCollectionModal(false);
      toast.success(`Successfully created collection "${collection.name}"!`);
    } catch (error) {
      toast.error('Failed to create colletion.');
    }
  };

  return (
    <div className="w-72 border-r border-gray-200 pb-4  bg-white">
      <CreateCollectionModal isOpen={showCollectionModal} onCreate={handleCreate} onCancel={() => setShowCollectionModal(false)} />
      <div className="flex-grow flex flex-col py-4">
        <button onClick={() => setShowCollectionModal(true)} className="mb-4 px-3 text-xs block w-full text-left text-pink-500 font-bold ">
          + Create Collection
        </button>
        {collections.length > 0 && (
          <nav className="flex-1 px-2 space-y-1" aria-label="Sidebar">
            {collections.map((collection) =>
              collection.events.length === 0 ? (
                <div key={collection.name}>
                  <a href="#" className="bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 group w-full flex items-center pl-2 py-2 text-sm font-medium rounded-md">
                    <FolderIcon className=" text-pink-500 group-hover:text-pink-700 mr-3 flex-shrink-0 h-6 w-6" aria-hidden="true" />
                    {collection.name}
                  </a>
                </div>
              ) : (
                <Disclosure as="div" key={collection.name} className="space-y-1">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className=" bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <FolderIcon className="mr-3 flex-shrink-0 h-6 w-6 text-pink-500 group-hover:text-pink-700" aria-hidden="true" />
                        <span className="flex-1">
                          {collection.name} ({collection.events.length})
                        </span>
                        <svg className={classNames(open ? 'text-gray-400 rotate-90' : 'text-gray-300', 'ml-3 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150')} viewBox="0 0 20 20" aria-hidden="true">
                          <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                        </svg>
                      </Disclosure.Button>
                      <Disclosure.Panel className="space-y-1">
                        {collection.events.map((event) => (
                          <div key={event.id} className="pl-4 pr-2 py-2 hover:bg-gray-50 border-b border-gray-100">
                            <Link href={`/collection/${collection.id}/event/${event.id}`}>
                              <a className="group w-full items-center  text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50 ">
                                <span className="block text-gray-800">{event.name}</span>
                                <span className="block text-xs mt-1 text-pink-800 truncate  font-light">{event.schemaName}</span>
                              </a>
                            </Link>
                          </div>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              )
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
