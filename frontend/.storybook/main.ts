import type {StorybookConfig} from '@storybook/react-vite';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions', '@storybook/addon-viewport'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(viteConfig) {
    const configDir = path.dirname(fileURLToPath(import.meta.url));
    const srcPath = path.resolve(configDir, '../src');
    return {
      ...viteConfig,
      resolve: {
        ...viteConfig.resolve,
        alias: {
          ...(viteConfig.resolve?.alias as Record<string, string> | undefined),
          '@': srcPath,
        },
      },
    };
  },
};

export default config;
