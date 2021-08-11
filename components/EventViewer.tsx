import { useEffect, useState, Fragment } from 'react';
import Head from 'next/head';
import toast from 'react-hot-toast';
import { useClipboard } from 'use-clipboard-copy';
import { ChevronDownIcon, GlobeIcon, DocumentIcon, CollectionIcon } from '@heroicons/react/solid';
import { DocumentIcon as DocumentIconOutline } from '@heroicons/react/outline';
import { Menu, Transition } from '@headlessui/react';
import { IAWSEventPayload, ILog } from '@/types/index';

import Editor from '@/components/Editor';
import SaveEventModal from '@/components/Modals/SaveEventModal';

import useEvents from '@/hooks/useEvents';
import useLogs from '@/hooks/useLogs';

import ViewEventLog from '@/components/Modals/ViewEventLog';

const tabs = [
  { name: 'Event', href: '#', current: true },
  // { name: 'Schema', href: '#', current: false },
  // { name: 'Targets', href: '#', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

interface IEventViewerProps {
  id?: string;
  name?: string;
  schemaName: string;
  description?: string;
  version: string;
  payload: IAWSEventPayload;
  source: string;
  eventBus: string;
  detailType: string;
  isEditingEvent?: boolean;
  collectionId?: string;
}

const EventViewer = ({ id, name, schemaName, description, version, payload, source, detailType, eventBus, isEditingEvent = false, collectionId }: IEventViewerProps) => {
  const [editorValue, setEditorValue] = useState(payload);

  const clipboard = useClipboard();

  useEffect(() => {
    setEditorValue(payload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, name, detailType]);

  const [showSaveEventModal, setShowEventModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState();

  const [_, { saveEvent, updateEvent, publishEvent }] = useEvents();
  const [__, { getLogsForEvent }] = useLogs();

  const logs = getLogsForEvent(id, detailType);

  const sendEventToBus = async (payload) => {
    console.log('PUBLISH', id);

    try {
      toast.promise(
        publishEvent({
          id,
          payload,
        }),
        {
          loading: 'Publishing event...',
          success: (
            <div>
              <span className="block text-bold">Succesfully Published Event</span>
              <span className="block text-xs text-pink-500  ">{schemaName}</span>
            </div>
          ),
          error: (
            <div>
              <span className="block text-bold text-red-400">Failed to publish event</span>
              <span className="block text-xs text-gray-500  ">{schemaName}</span>
            </div>
          ),
        },
        {
          duration: 2000,
          icon: <DocumentIconOutline className="h-5 w-5 text-pink-400" />,
        }
      );
      setSelectedLog(null);
    } catch (error) {
      toast.error('Failed to publish event');
    }
  };

  const handleResendEvent = async (log: ILog) => {
    const { payload } = log;
    await sendEventToBus(payload);
    setSelectedLog(null);
  };

  const handlePublishEvent = async () => {
    await sendEventToBus(editorValue);
  };

  const handleUpdateEvent = async () => {
    try {
      toast.promise(
        updateEvent({
          id,
          payload: editorValue,
          collectionId,
        }),
        {
          loading: 'Updating event...',
          success: (
            <div>
              <span className="block text-bold">Updated Event</span>
              <span className="block text-xs text-pink-500  ">{name}</span>
            </div>
          ),
          error: (
            <div>
              <span className="block text-bold text-red-400">Failed to update event</span>
              <span className="block text-xs text-gray-500  ">{name}</span>
            </div>
          ),
        },
        {
          duration: 2000,
        }
      );
    } catch (error) {
      toast.error('Failed to update event');
    }
  };

  const handleSaveEvent = async (eventMetadata) => {
    try {
      const newEvent = await saveEvent({
        detailType,
        source,
        version,
        eventBus,
        schemaName,
        payload: editorValue,
        ...eventMetadata,
      });
      toast.success('Successfully saved event');

      window.location.href = `/collection/${newEvent.collectionId}/event/${newEvent.id}`;

      // TODO Fix this with state updates.
      // router.push(`/collection/${newEvent.collectionId}/event/${newEvent.id}`);
    } catch (error) {
      toast.error('Failed to create event');
    }
  };

  const handleExportEvent = async () => {
    clipboard.copy(
      JSON.stringify(
        {
          detailType,
          source,
          version,
          eventBus,
          schemaName,
          payload: editorValue,
          descripton: description || '',
          name,
        },
        null,
        4
      )
    );
    toast.success('Succesfully copied to clipboard');
  };

  return (
    <div className="flex-1 flex flex-col">
      <Head>
        <title>{name || detailType}</title>
      </Head>
      <SaveEventModal isOpen={showSaveEventModal} onCreate={handleSaveEvent} onCancel={() => setShowEventModal(false)} />
      <ViewEventLog isOpen={!!selectedLog} log={selectedLog} onCancel={() => setSelectedLog(null)} onResend={handleResendEvent} />
      <>
        <header className="w-full">
          <div className=" bg-white flex">
            <div className=" w-full ">
              <div className="flex justify-between px-4 items-center py-4 bg-white border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold leading-7 text-gray-800 sm:text-3xl sm:truncate">{name || schemaName}</h2>
                  {description && <h2 className="text-sm  leading-7 text-gray-600 sm:truncate">{description}</h2>}
                  <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                    <div className="mt-2 flex items-center text-sm text-gray-400">
                      <GlobeIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" aria-hidden="true" />
                      {eventBus}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-400">
                      <CollectionIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" aria-hidden="true" />
                      {source}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-400">
                      <DocumentIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" aria-hidden="true" />
                      {detailType} (v{version})
                    </div>
                  </div>
                </div>

                <div className="space-x-3">
                  <button
                    onClick={() => handlePublishEvent()}
                    type="button"
                    className="inline-flex items-center px-4 py-3 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    Publish Event
                  </button>
                  <span className="relative z-0 inline-flex shadow-sm rounded-md">
                    <button
                      onClick={() => {
                        if (isEditingEvent) {
                          handleUpdateEvent();
                        } else {
                          setShowEventModal(true);
                        }
                      }}
                      type="button"
                      className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      Save
                    </button>
                    <Menu as="span" className="relative block">
                      {({ open }) => (
                        <>
                          <Menu.Button className="relative inline-flex items-center px-2 py-2.5 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                            <span className="sr-only">Open options</span>
                            <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                          </Menu.Button>
                          <Transition
                            show={open}
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items static className="origin-top-right absolute right-0 mt-2 -mr-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <div className="py-1 hover:bg-gray-100">
                                <Menu.Item>
                                  <button onClick={() => setShowEventModal(true)} className="text-gray-700 block px-4 py-2 text-sm">
                                    Save As...
                                  </button>
                                </Menu.Item>
                              </div>
                              <div className="py-1 hover:bg-gray-100">
                                <Menu.Item>
                                  <button onClick={() => handleExportEvent()} className="text-gray-700 block px-4 py-2 text-sm">
                                    Export Event
                                  </button>
                                </Menu.Item>
                              </div>
                            </Menu.Items>
                          </Transition>
                        </>
                      )}
                    </Menu>
                  </span>
                </div>
              </div>

              <div className="flex justify-between w-full px-4 pt-2 pb-0">
                <div>
                  <div className="sm:hidden">
                    <label htmlFor="tabs" className="sr-only">
                      Select a tab
                    </label>
                    <select id="tabs" name="tabs" className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" defaultValue={tabs.find((tab) => tab.current).name}>
                      {tabs.map((tab) => (
                        <option key={tab.name}>{tab.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="hidden sm:block">
                    <div className="">
                      <nav className="-mb-px flex" aria-label="Tabs">
                        {tabs.map((tab) => (
                          <a key={tab.name} href={tab.href} className={classNames(tab.current ? ' border-b-2 border-pink-400 text-gray-800 ' : ' text-gray-500 ', 'whitespace-nowrap py-3 px-8   font-medium text-sm ')} aria-current={tab.current ? 'page' : undefined}>
                            {tab.name}
                          </a>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 items-stretch">
          <main className="flex-1  space-y-6">
            <section aria-labelledby="primary-heading" className="flex mt-1  lg:order-last border border-gray-200">
              <Editor
                value={JSON.stringify(editorValue, null, 4)}
                onChange={(value) => {
                  try {
                    setEditorValue(JSON.parse(value));
                  } catch (error) {}
                }}
              />
            </section>
            {logs.length > 0 && (
              <>
                <h2 className=" text-gray-800">Event Logs</h2>
                <div className="flex flex-col">
                  <div className="-my-2  sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                      <div className="shadow  border-b border-gray-200 sm:rounded-lg">
                        <table className="w-full divide-y divide-gray-200 border border-gray-200">
                          <thead className="bg-gray-500 text-gray-100">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                AWS Event ID
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                Status
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                Created At
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {logs.reverse().map((log) => (
                              <tr key={log.awsPublishEventId}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <button className="text-indigo-600 hover:text-indigo-900" onClick={() => setSelectedLog(log)}>
                                    {log.awsPublishEventId}
                                  </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Success</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{log.createdAt}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {logs.length === 0 && (
              <div>
                <h2 className=" text-gray-800">Event Logs</h2>
                <p className="text-sm text-gray-500">No logs found. Start by publishing your event.</p>
              </div>
            )}
          </main>
        </div>
      </>
    </div>
  );
};

export default EventViewer;
