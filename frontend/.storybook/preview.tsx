import type {Preview} from '@storybook/react';
import {ThemeProvider} from '@emotion/react';
import {appTheme} from '@/theme';
import '../src/index.css';
import 'antd/dist/reset.css';

const preview: Preview = {
  decorators: [
    Story => (
      <ThemeProvider theme={appTheme}>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
