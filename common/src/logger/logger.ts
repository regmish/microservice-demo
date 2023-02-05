import pino from 'pino';
import pretty from 'pino-pretty';

export const logger = pino(
  pretty({
    ignore: 'pid,hostname',
    translateTime: 'yyyy-mm-dd HH:MM:ss',
  })
);
