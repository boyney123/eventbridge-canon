const { EventBridge } = require('@aws-sdk/client-eventbridge');
const { Schemas } = require('@aws-sdk/client-schemas');

const schemas = new Schemas();
const eventbridge = new EventBridge();

export const getTargetsForEventsOnEventBridge = async (eventBusName) => {
  const targetsForEvents = await eventbridge.listRules({ EventBusName: eventBusName });
  return buildTargets(targetsForEvents.Rules);
};

export const getAllSchemas = async (registryName) => {
  const { Schemas = [] } = await schemas.listSchemas({ RegistryName: registryName });
  return Schemas;
};

export const getJSONSchemaForSchemaName = (schemaName) => {
  return schemas.exportSchema({
    RegistryName: process.env.SCHEMA_REGISTRY_NAME,
    SchemaName: schemaName,
    Type: 'JSONSchemaDraft4',
  });
};

export const getAllSchemasAsJSONSchema = async (registryName) => {
  const { Schemas = [] } = await schemas.listSchemas({ RegistryName: registryName });

  return Schemas.map(async (schema) => {
    return schemas.exportSchema({
      RegistryName: registryName,
      SchemaName: schema.SchemaName,
      Type: 'JSONSchemaDraft4',
    });
  });
};
export const hydrateSchemasWithAdditionalOpenAPIData = async (registryName, schemaList) => {
  return schemaList.map(async (rawSchema) => {
    const schema = buildSchema(rawSchema);

    // get the schema as open API too, as its has more metadata we might find useful.
    const openAPISchema = await schemas.describeSchema({
      RegistryName: registryName,
      SchemaName: schema.SchemaName,
    });
    const schemaAsOpenAPI = buildSchema(openAPISchema);

    const { LastModified, SchemaArn, SchemaVersion, Tags, VersionCreatedDate } = schemaAsOpenAPI;

    return {
      ...schema,
      LastModified,
      SchemaArn,
      SchemaVersion,
      Tags,
      VersionCreatedDate,
    };
  });
};

export const buildSchema = (rawSchema) => {
  return { ...rawSchema, Content: JSON.parse(rawSchema.Content) };
};

export const buildTargets = (busRules) => {
  return busRules.reduce((rules, rule) => {
    const eventPattern = JSON.parse(rule.EventPattern);
    const detailType = eventPattern['detail-type'] || [];
    detailType.forEach((detail) => {
      if (!rules[detail]) {
        rules[detail] = { rules: [] };
      }
      rules[detail].rules.push(rule.Name);
    });
    return rules;
  }, {});
};

export const putEvent = (event) => {
  return eventbridge.putEvents({
    Entries: [event],
  });
};
