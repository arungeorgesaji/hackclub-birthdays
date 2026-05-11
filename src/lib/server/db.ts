import postgres from 'postgres';
import { env } from '$env/dynamic/private';

let client: postgres.Sql | null = null;

export function getSql() {
  if (client) return client;

  const connectionString =
    env.POSTGRES_URL ||
    env.POSTGRES_URL_NON_POOLING ||
    env.DATABASE_URL ||
    buildConnectionString();

  if (!connectionString) {
    throw new Error('Missing Postgres connection configuration.');
  }

  client = postgres(connectionString, {
    ssl:
      connectionString.includes('localhost') || connectionString.includes('127.0.0.1')
        ? 'prefer'
        : 'require'
  });

  return client;
}

function buildConnectionString() {
  const host = env.PGHOST || env.POSTGRES_HOST;
  const user = env.PGUSER || env.POSTGRES_USER;
  const database = env.PGDATABASE || env.POSTGRES_DATABASE;
  const passwordValue = env.PGPASSWORD || env.POSTGRES_PASSWORD;
  const portValue = env.PGPORT || env.POSTGRES_PORT;

  if (!host || !user || !database) return '';

  const password = passwordValue ? `:${encodeURIComponent(passwordValue)}` : '';
  const port = portValue ? `:${portValue}` : '';

  return `postgres://${user}${password}@${host}${port}/${database}`;
}
