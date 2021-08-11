import { GetServerSideProps } from 'next';
import { generate } from 'json-schema-faker';

import EventViewer from '@/components/EventViewer';
import { clearValues } from '@/utils/clear-values';

import { getSchemaByDetailType } from '@/lib/db';
import { getJSONSchemaForSchemaName } from '@/lib/aws';

const EventSources = ({ eventBus, schema }) => {
  const now = new Date();

  const { source, detailType, jsonSchema, version, schemaName } = schema;

  return (
    <EventViewer
      eventBus={eventBus}
      version={version}
      schemaName={schemaName}
      detailType={detailType}
      source={source}
      payload={{
        Time: now.toISOString(),
        Source: source,
        Resources: ['1'],
        DetailType: detailType,
        Detail: clearValues(generate(jsonSchema).detail),
        EventBusName: eventBus,
      }}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async (req) => {
  const detailType = req.query.detailType;

  const schema = await getSchemaByDetailType(detailType);

  const { Content: JSONSchema, SchemaVersion } = await getJSONSchemaForSchemaName(schema.schemaName);

  return {
    props: {
      eventBus: process.env.EVENT_BUS_NAME,
      schema: {
        ...schema,
        version: SchemaVersion,
        jsonSchema: JSON.parse(JSONSchema),
      },
    },
  };
};

export default EventSources;
