import { useContext } from 'react';
import { EventBridgeCanonContext } from '@/contexts/EventBridgeCanon';
import { IApplicationData, ICollection } from '@/types/index';
import { post } from '@/utils/request';

interface IHookFunctions {
  saveCollection: (collection: ICollection) => Promise<ICollection>;
}

export const useCollections = (): [ICollection[], IHookFunctions] => {
  // TODO: fix this context any
  const [applicationData = {}, setApplicationData] = useContext<any>(EventBridgeCanonContext);
  const { collections }: IApplicationData = applicationData;

  const saveCollection = async (collection: ICollection): Promise<ICollection> => {
    try {
      const newCollection = await post('/api/collections', { body: { collection } });

      setApplicationData({
        ...applicationData,
        collections: collections.concat([newCollection]),
      });

      return newCollection;
    } catch (error) {
      console.log(error);
    }
  };

  return [collections, { saveCollection }];
};

export default useCollections;
