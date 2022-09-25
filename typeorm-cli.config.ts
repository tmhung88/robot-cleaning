import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { postgresConfigFactory } from 'src/config/postgres.config';

config();

export default new DataSource({
  ...postgresConfigFactory().postgres,
  type: 'postgres',
  entities: ['./src/**/*.entity.ts'],
  migrations: ['./migrations/*.ts'],
  logging: true,
  migrationsTableName: 'typeorm_migrations',
});
