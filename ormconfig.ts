import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
dotenv.config();

export const dataSourceOptions = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_DATABASE || 'wiltonprod',
  entities: ['dist/**/*.entity.{js,ts}'],
  logging: true,
  synchronize: false,
  migrationsRun: false,
  migrations: ['dist/**/migrations/*.{js,ts}'],
});
