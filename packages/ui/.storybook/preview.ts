import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    a11y: {
      config: {
        rules: [
          {
            // Enable color contrast checking for WCAG compliance
            id: 'color-contrast',
            enabled: true,
            options: {
              // WCAG AA compliance level
              contrastRatio: {
                normal: 4.5,
                large: 3,
              },
            },
          },
          {
            // Ensure buttons have accessible names
            id: 'button-name',
            enabled: true,
          },
          {
            // Ensure heading hierarchy is logical
            id: 'heading-order',
            enabled: true,
          },
          {
            // Ensure landmarks are properly used
            id: 'landmark-one-main',
            enabled: true,
          },
          {
            // Ensure links have accessible names
            id: 'link-name',
            enabled: true,
          },
          {
            // Ensure lists are properly structured
            id: 'list',
            enabled: true,
          },
          {
            // Ensure list items are properly structured
            id: 'listitem',
            enabled: true,
          },
          {
            // Ensure focus order is logical
            id: 'focus-order-semantics',
            enabled: true,
          },
          {
            // Ensure form fields have labels
            id: 'label-title-only',
            enabled: true,
          },
          {
            // Ensure alt text for images
            id: 'image-alt',
            enabled: true,
          },
          {
            // Ensure ARIA attributes are valid
            id: 'aria-valid-attr-value',
            enabled: true,
          },
          {
            // Ensure ARIA roles are valid
            id: 'aria-allowed-attr',
            enabled: true,
          },
        ],
      },
      // Enable manual testing mode for thorough review
      manual: true,
      // Run tests automatically when stories render
      runOnRender: false,
    },
    chromatic: {
      // Configure Chromatic-specific settings
      viewports: [320, 768, 1024, 1440],
      disableSnapshot: false,
      pauseAnimation: true,
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
