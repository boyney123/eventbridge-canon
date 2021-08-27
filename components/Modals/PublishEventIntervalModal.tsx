/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef, useState, FunctionComponent } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import useCollections from '@/hooks/useCollections';
import { IModalProps } from '@/types/index';

export const PublishEventIntervalModal = ({ isOpen = false, onCreate = () => {}, onCancel = () => {} }: IModalProps) => {
  const [event, setEvent] = useState({ interval: 5 });

  const [collections] = useCollections();
  const cancelButtonRef = useRef(null);

  const handleOnCreate = async () => {
    onCreate(event);
  };

  const handleOnCancel = () => {
    onCancel();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" static className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} open={isOpen} onClose={handleOnCancel}>
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
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div>
                <div className="mt-3 sm:mt-5">
                  <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                    Publish Interval
                  </Dialog.Title>
                  <p className="text-gray-500 text-xs">Keep publishing event on an interval (e.g every X seconds)</p>
                  <div className="my-8 space-y-4">
                    <div className="flex content-center justify-center">
                      <label htmlFor="source" className="flex justify-right items-center w-1/2 content-center  text-sm font-medium text-gray-700">
                        Interval (in seconds):
                      </label>
                      <input type="text" name="interval" id="interval" className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Time in seconds" onChange={(e) => setEvent({ ...event, interval: e.target.value })} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:col-start-2 sm:text-sm ${
                    !event.interval ? 'opacity-10' : 'opacity-100'
                  }`}
                  disabled={!event.interval}
                  onClick={handleOnCreate}
                >
                  Start Publishing
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
};

export default PublishEventIntervalModal;
