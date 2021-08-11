import { useEffect, useState } from 'react';
import Head from 'next/head';

import dynamic from 'next/dynamic';
const Toaster = dynamic(() => import('react-hot-toast').then((mod) => mod.Toaster), { ssr: false });

import TopNavigationBar from '@/components/TopNavigationBar';
import SideBar from '@/components/SideBar';
import CollectionList from '@/components/CollectionList';
import EventList from '@/components/EventList';

import { EventBridgeCanonContext } from '@/contexts/EventBridgeCanon';
import useApplication from '@/hooks/useApplication';

import '../styles/globals.css';

const App = ({ children }) => {
  const [data, { fetchFromDB }] = useApplication();

  useEffect(() => {
    const init = async () => {
      await fetchFromDB();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data.schemas) return null;

  return (
    <>
      <Head>
        <title>EventBridge Canon</title>
      </Head>
      <TopNavigationBar />
      <div className="min-h-screen flex">
        <SideBar>
          {({ selectedTab }) => {
            return (
              <>
                {selectedTab === 'Events' && <EventList />}
                {selectedTab === 'My Collections' && <CollectionList />}
              </>
            );
          }}
        </SideBar>
        {children}
      </div>
      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  );
};

function EventBridgeCanonApp({ Component, pageProps }) {
  const [applicationData, setApplicationData] = useState();

  return (
    <EventBridgeCanonContext.Provider value={[applicationData, setApplicationData]}>
      <App>
        <Component {...pageProps} />
      </App>
    </EventBridgeCanonContext.Provider>
  );
}

export default EventBridgeCanonApp;
