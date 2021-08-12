import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

import { getAllSchemas } from '../lib/aws';

const log = console.log;

const REGSITRY_NAME = process.env.SCHEMA_REGISTRY_NAME;
const EVENT_BUS_NAME = process.env.EVENT_BUS_NAME;

const populate = async () => {
  log(chalk.green(`[1/2] - Fetching all schemas for event bus: ${EVENT_BUS_NAME}...`));

  const getAllSchemasForRegistry = await getAllSchemas(REGSITRY_NAME);

  log(chalk.green(`[2/2] - Populating local db with schemas...`));

  const schemasForDB = getAllSchemasForRegistry.map((schema) => {
    return {
      source: schema.SchemaName.split('@')[0],
      detailType: schema.SchemaName.split('@')[1],
      schemaName: schema.SchemaName,
    };
  });

  const datbaseDIR = path.join(__dirname, '../data/database.json');

  let fileData = {
    eventBusName: EVENT_BUS_NAME,
    schemas: schemasForDB,
  };

  if (fs.existsSync(datbaseDIR)) {
    const data = fs.readFileSync(datbaseDIR);
    const existingDB = JSON.parse(data.toString());
    fileData = { ...existingDB, ...fileData };
  } else {
    fileData = {
      ...fileData,
      collections: [],
      logs: [],
    };
  }

  fs.writeFileSync(datbaseDIR, JSON.stringify(fileData, null, 4));

  log(
    `
  Finished populating your local database with your schemas!

    EventBus: ${chalk.blue(EVENT_BUS_NAME)}

  Next run the command below to start EventBridge Canon

    ${chalk.blue(`npm run dev`)}
`
  );
};

populate();
