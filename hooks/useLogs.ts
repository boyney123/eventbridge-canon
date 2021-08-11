import { useContext } from 'react';
import { EventBridgeCanonContext } from '@/contexts/EventBridgeCanon';
import { IApplicationData, ILog } from '@/types/index';

interface IHookFunctions {
  getLogsForEvent: (eventId: string, detailType?: string) => ILog[];
}

export const useLogs = (): [ILog[], IHookFunctions] => {
  const [applicationData] = useContext<[IApplicationData]>(EventBridgeCanonContext);
  const { logs } = applicationData || {};

  const getLogsForEvent = (eventId, detailType): ILog[] => {
    if (eventId) {
      return (logs && logs.filter((log) => log.eventId === eventId)) || [];
    } else {
      return (logs && logs.filter((log) => log?.payload?.DetailType === detailType && log?.eventId === undefined)) || [];
    }
  };

  return [logs, { getLogsForEvent }];
};
export default useLogs;
