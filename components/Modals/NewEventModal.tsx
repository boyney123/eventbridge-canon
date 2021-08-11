/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import useEvents from '@/hooks/useEvents';
import { IModalProps } from '@/types/index';

export default function NewEventModal({ isOpen = false, onCreate, onCancel = () => {} }: IModalProps) {
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedDetailType, setSelectedDetailType] = useState('');

  const cancelButtonRef = useRef(null);

  const [_, { getAllEventsAndEventSources }] = useEvents();
  const sourcesAndEvents = getAllEventsAndEventSources();

  const listOfSources = Object.keys(sourcesAndEvents);
  const listOfDetailTypes = selectedSource ? sourcesAndEvents[selectedSource].schemas : [];

  const handleOnCreate = () => {
    onCreate({ source: selectedSource, detailType: selectedDetailType });
  };

  const handleOnCancel = () => {
    onCancel();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" static className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} open={isOpen} onClose={onCancel}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 sm:mt-5">
                  <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                    New Event
                  </Dialog.Title>
                  <p className="text-gray-500 text-xs">Select your Source and Event</p>
                  <div className="my-8 space-y-4">
                    <div className="flex content-center justify-center">
                      <label htmlFor="source" className="flex justify-right items-center w-1/2 content-center  text-sm font-medium text-gray-700">
                        Event Source:
                      </label>
                      <select id="source" name="source" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" onChange={(e) => setSelectedSource(e.target.value)}>
                        <option value="">Please Select</option>
                        {listOfSources.map((source) => {
                          return (
                            <option key={source} value={source}>
                              {source}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className={`flex content-center justify-center ${!selectedSource ? 'opacity-20' : 'opacity-100'}`}>
                      <label htmlFor="detailType" className="flex justify-right items-center w-1/2 content-center  text-sm font-medium text-gray-700">
                        Detail Type:
                      </label>
                      <select id="detailType" name="detailType" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" onChange={(e) => setSelectedDetailType(e.target.value)}>
                        <option value="">Please Select</option>
                        {listOfDetailTypes.map((detailType) => {
                          return (
                            <option key={detailType} value={detailType}>
                              {detailType}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:col-start-2 sm:text-sm ${
                    !selectedDetailType || !selectedSource ? 'opacity-10' : 'opacity-100'
                  }`}
                  disabled={!selectedSource || !selectedDetailType}
                  onClick={handleOnCreate}
                >
                  Create Event
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={handleOnCancel}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
