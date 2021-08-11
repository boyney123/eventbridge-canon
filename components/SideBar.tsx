/* This example requires Tailwind CSS v2.0+ */
import { useState } from 'react';

const tabs = [{ name: 'Events' }, { name: 'My Collections' }];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function CollectionList({ children = (state: any) => {} }) {
  const [selectedTab, setSelectedTab] = useState('Events');

  return (
    <div className="w-72 border-r border-gray-200 pb-4  bg-white">
      <div>
        <div className="sm:block">
          <div className="border-b border-gray-200">
            <nav className="flex" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setSelectedTab(tab.name)}
                  className={classNames(tab.name === selectedTab ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'w-1/2  text-center whitespace-nowrap py-4  border-b-2 font-medium text-sm')}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
          {children({ selectedTab })}
        </div>
      </div>
    </div>
  );
}
