import { useContext } from 'react';
import { EventBridgeCanonContext } from '@/contexts/EventBridgeCanon';
import { IApplicationData } from '@/types/index';

interface IHookFunctions {
  fetchFromDB: () => Promise<IApplicationData>;
}

export const useApplication = (): [IApplicationData, IHookFunctions] => {
  const [applicationData = {}, setApplicationData] = useContext<[IApplicationData, any]>(EventBridgeCanonContext);

  const fetchFromDB = async (): Promise<IApplicationData> => {
    try {
      const response = await fetch('/api/data', {
        method: 'GET',
      });

      const data = await response.json();

      setApplicationData(data);

      return data;
    } catch (error) {
      throw Error(error);
    }
  };

  return [applicationData, { fetchFromDB }];
};

export default useApplication;
