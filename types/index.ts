export interface IApplicationData {
  logs?: [ILog];
  collections?: [ICollection];
  schemas?: [ISchema];
}

export interface ISchema {
  source: string;
  detailType: string;
  schemaName: string;
}

export interface IAWSEventPayload {
  Time: string;
  Source: string;
  Resources: [string];
  DetailType: string;
  Detail: any;
  EventBusName: string;
}

export interface ICollectionEvent {
  id: string;
  collectionId: string;
  name: string;
  description?: string;
  detailType: string;
  source: string;
  version: string;
  eventBusName: string;
  schemaName: string;
  payload: IAWSEventPayload;
}

export interface ICollection {
  id: string;
  name: string;
  description?: string;
  events?: [ICollectionEvent?];
}

export interface ILog {
  id: string;
  awsPublishEventId: string;
  eventId: string;
  createdAt: string;
  payload: IAWSEventPayload;
}

export interface IModalProps {
  onCreate?: (newEvent: any) => void;
  onCancel: () => void;
  isOpen: boolean;
}
