export const SERVICE_PREFIX = 'API';
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const VERSION = require('../package.json').version;

export const PORT = process.env.PORT || 3000;

export const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';