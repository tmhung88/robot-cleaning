import { assertNotEmpty } from '../helper/assert.helper';

export interface PostgresConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export const postgresConfigFactory = (): { postgres: PostgresConfig } => {
  assertNotEmpty(process.env['POSTGRES_HOST'], 'POSTGRES_HOST m ust be available');
  assertNotEmpty(process.env['POSTGRES_PORT'], 'POSTGRES_PORT must be available');
  assertNotEmpty(process.env['POSTGRES_USER'], 'POSTGRES_USER must be available');
  assertNotEmpty(process.env['POSTGRES_HOST'], 'POSTGRES_HOST must be available');
  assertNotEmpty(process.env['POSTGRES_PASSWORD'], 'POSTGRES_PASSWORD must be available');
  assertNotEmpty(process.env['POSTGRES_DB'], 'POSTGRES_DB must be available');

  return {
    postgres: {
      host: process.env['POSTGRES_HOST'],
      port: parseInt(process.env['POSTGRES_PORT']),
      username: process.env['POSTGRES_USER'],
      password: process.env['POSTGRES_PASSWORD'],
      database: process.env['POSTGRES_DB'],
    },
  };
};
