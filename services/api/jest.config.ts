import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	globals: {
		'ts-jest': {
			tsconfig: './tsconfig.json'
		}
	},
	testEnvironment: 'node',
	testMatch: ['**/__tests__/**/*.test.ts'],
	transform: {
		'^.+\\.ts?$': 'ts-jest'
	},
	collectCoverage: true,
	coverageReporters: ['html', 'text', 'json', 'text-summary'],
	setupFilesAfterEnv: ['./src/__tests__/jest.setup.ts'],
	coveragePathIgnorePatterns: [
		'src/shared',
		'src/http/errors',
		'src/http/middlewares/utils',
		'src/repositories'
	],
	clearMocks: true
};

export default config;
