import path from 'path';
import {
  DefaultAssetNamingStrategy,
  DefaultLogger,
  DefaultSearchPlugin,
  dummyPaymentHandler,
  LogLevel,
  TypeORMHealthCheckStrategy,
  VendureConfig,
} from '@vendure/core';
import { ConnectionOptions } from 'typeorm';
import {
  AssetServerPlugin,
  configureS3AssetStorage,
} from '@vendure/asset-server-plugin';
import { BullMQJobQueuePlugin } from '@vendure/job-queue-plugin/package/bullmq';
import { ExamplePlugin } from '@vendure-nx/plugin-example';
import * as dotenv from 'dotenv';
dotenv.config();

const PORT = +((process.env.API_INTERNAL_PORT ?? 3000).toString());
const assetUrlPrefix =
  process.env.ASSET_URL_PREFIX ||
  `${process.env.API_PUBLIC_URL}:${process.env.API_PUBLIC_PORT}/vendure-assets/`;
const rootDir = process.cwd();

export const config: VendureConfig = {
  apiOptions: {
    port: PORT,
    adminApiPath: 'admin-api',
    shopApiPath: 'shop-api',
  },
  authOptions: {
    requireVerification: true,
    tokenMethod: ['bearer', process.env.COOKIE_SECRET ? 'cookie' : undefined],
    cookieOptions: {
      secret: process.env.COOKIE_SECRET,
    },
  },
  dbConnectionOptions: {
    ...getDbConnectionOptions(),
    logging: ['error', 'warn'],
  },
  paymentOptions: {
    paymentMethodHandlers: [dummyPaymentHandler],
  },
  logger: new DefaultLogger({
    level:
      process.env.LOG_LEVEL === 'debug'
        ? LogLevel.Debug
        : process.env.LOG_LEVEL === 'verbose'
          ? LogLevel.Verbose
          : LogLevel.Info,
  }),
  systemOptions: {
    healthChecks: [
      new TypeORMHealthCheckStrategy({ key: 'database', timeout: 5000 }),
    ],
  },
  plugins: [
    AssetServerPlugin.init({
      route: 'vendure-assets',
      assetUploadDir: path.join(rootDir, 'static/assets'),
      assetUrlPrefix,
      namingStrategy: new DefaultAssetNamingStrategy(),
      storageStrategyFactory: process.env.USE_MINIO === 'true'
        ? configureS3AssetStorage({
            bucket: process.env.MINIO_BUCKET,
            credentials: {
              accessKeyId: process.env.MINIO_ACCESS_KEY,
              secretAccessKey: process.env.MINIO_SECRET_KEY,
            },
            nativeS3Configuration: {
              endpoint: process.env.MINIO_ENDPOINT ?? 'http://localhost:9000',
              forcePathStyle: true,
              region: process.env.MINIO_STORAGE_REGION || 'us-east-1',
            },
          })
        : undefined,
    }),
    BullMQJobQueuePlugin.init({
      connection: {
        host: process.env.REDIS_HOST ?? '127.0.0.1',
        port: process.env.REDIS_PORT ? +process.env.REDIS_PORT : 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        maxRetriesPerRequest: null,
      },
      queueOptions: {
        defaultJobOptions: {},
      },
    }),
    DefaultSearchPlugin,
    ExamplePlugin,
  ],
};

function getDbConnectionOptions() {
  return {
    type: 'postgres',
    synchronize: false,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  } as ConnectionOptions;
}
