import redis, {
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from 'redis';
import fs from 'fs';

import { ICacheRepository } from '../types';

export class RedisClient implements ICacheRepository {
  private _client!: RedisClientType<RedisModules, RedisFunctions, RedisScripts>;
  async initialize(): Promise<void> {
    const connectionOptions = await this._getConnectionDetail();

    this._client = redis.createClient({
      ...connectionOptions,
      pingInterval: parseInt(process.env.REDIS_PING_INTERVAL || '10000', 10),
    });

    await this._client.connect();
  }
  async get(key: string): Promise<string | null> {
    return this._client.get(key);
  }

  async set(key: string, value: string, ttl = 0): Promise<void> {
    this._client.multi().set(key, value).expire(key, ttl).exec();

  }

  async cleanup(): Promise<void> {
    await this._client.flushAll();
  }

  /** Build connection string either from secret file mounted or env variables */
  private async _getConnectionDetail(): Promise<redis.RedisClientOptions> {
    if (process.env.REDIS_CONNECTION_STRING) {
      return {
        url: process.env.REDIS_CONNECTION_STRING,
      };
    } else if (process.env.REDIS_CONNECTION_SECRET_PATH) {
      try {
        const secretFile = await fs.promises.readFile(
          process.env.REDIS_CONNECTION_SECRET_PATH,
          'utf8'
        );

        return {
          url: secretFile?.toString()?.trim(),
        };
      } catch (error) {
        console.error(`Error reading Redis connection secret file: ${error}`);
        throw error;
      }
    } else if (
      process.env.REDIS_USERNAME &&
      process.env.REDIS_PASSWORD &&
      process.env.REDIS_HOST &&
      process.env.REDIS_PORT
    ) {
      return {
        url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      };
    } else {
      throw new Error(
        'Insufficient AMQP credentials provided. Please check the environment variables.'
      );
    }
  }
}
