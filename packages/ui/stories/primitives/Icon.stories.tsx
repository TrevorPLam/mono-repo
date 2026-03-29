import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '../../src/primitives';
import { Text } from '../../src/primitives';

const meta: Meta<typeof Icon> = {
  title: 'Primitives/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Icon component provides a flexible wrapper for SVG icons with design token integration.
It supports multiple sizes, colors, and accessibility features while maintaining consistent icon presentation.

## Accessibility
- Proper ARIA labels for screen readers
- Decorative icon support with aria-hidden
- Focus management for interactive icons
- Semantic markup with role="img"
- High contrast compliance via design tokens

## Design Token Integration
All visual properties are driven by design tokens from \`@repo/design-tokens\`:
- Colors: Semantic color tokens for different contexts
- Sizes: Consistent icon sizing using spacing tokens
- Accessibility: Proper contrast ratios for all color variants

## Usage Patterns
- UI icons for buttons and controls
- Status indicators and feedback
- Navigation and wayfinding icons
- Decorative visual elements
- Interactive icon components
        `,
      },
    },
    a11y: {
      element: '#storybook-root',
      manual: false,
      config: {
        rules: [
          {
            // Icons should have accessible labels or be decorative
            id: 'svg-img-max',
            enabled: true,
          },
          {
            // Color contrast for icons
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      description: 'Icon size using design token spacing values',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'],
      table: {
        defaultValue: { summary: 'md' },
        type: { summary: 'size token' },
      },
    },
    color: {
      control: 'select',
      description: 'Icon color using design token colors',
      options: ['neutral', 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'inherit'],
      table: {
        defaultValue: { summary: 'neutral' },
        type: { summary: 'color token' },
      },
    },
    label: {
      control: 'text',
      description: 'Accessible label for screen readers',
      table: {
        type: { summary: 'string' },
      },
    },
    decorative: {
      control: 'boolean',
      description: 'Mark icon as decorative (hidden from screen readers)',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    children: {
      description: 'SVG content for the icon',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    testId: {
      control: 'text',
      description: 'Test ID for testing purposes',
      table: {
        type: { summary: 'string' },
      },
    },
  },
  args: {
    children: (
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    ),
    size: 'md',
    color: 'neutral',
    label: 'Check icon',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    ),
    size: 'md',
    color: 'neutral',
    label: 'Check icon',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default Icon with medium size, neutral color, and accessible label.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    children: (
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    ),
    size: 'lg',
    color: 'primary',
    label: 'Interactive icon',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all Icon combinations. Use the controls panel to modify props.',
      },
    },
  },
};

export const IconSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start', width: '200px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Icon size="xs" color="neutral" label="Extra small icon">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </Icon>
        <Text size="sm">XS (12px)</Text>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Icon size="sm" color="neutral" label="Small icon">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </Icon>
        <Text size="sm">SM (16px)</Text>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Icon size="md" color="neutral" label="Medium icon">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </Icon>
        <Text size="sm">MD (20px)</Text>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Icon size="lg" color="neutral" label="Large icon">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </Icon>
        <Text size="sm">LG (24px)</Text>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Icon size="xl" color="neutral" label="Extra large icon">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </Icon>
        <Text size="sm">XL (32px)</Text>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Icon size="2xl" color="neutral" label="2XL icon">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </Icon>
        <Text size="sm">2XL (40px)</Text>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Icon size="3xl" color="neutral" label="3XL icon">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </Icon>
        <Text size="sm">3XL (48px)</Text>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available icon sizes using design token spacing values.',
      },
    },
  },
};

export const ColorVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start', width: '200px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Icon size="lg" color="neutral" label="Neutral icon">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </Icon>
        <Text size="sm">Neutral</Text>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Icon size="lg" color="primary" label="Primary icon">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </Icon>
        <Text size="sm">Primary</Text>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Icon size="lg" color="secondary" label="Secondary icon">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </Icon>
        <Text size="sm">Secondary</Text>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Icon size="lg" color="accent" label="Accent icon">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </Icon>
        <Text size="sm">Accent</Text>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Icon size="lg" color="success" label="Success icon">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </Icon>
        <Text size="sm">Success</Text>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Icon size="lg" color="warning" label="Warning icon">
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
        </Icon>
        <Text size="sm">Warning</Text>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Icon size="lg" color="error" label="Error icon">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </Icon>
        <Text size="sm">Error</Text>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Icon size="lg" color="inherit" label="Inherit color icon">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </Icon>
        <Text size="sm">Inherit</Text>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Semantic color variants using design token colors for different contexts.',
      },
    },
  },
};

export const CommonIcons: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', width: '400px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Icon size="lg" color="neutral" label="Check icon">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </Icon>
        <Text size="xs">Check</Text>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Icon size="lg" color="neutral" label="Close icon">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </Icon>
        <Text size="xs">Close</Text>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Icon size="lg" color="neutral" label="Arrow icon">
          <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
        </Icon>
        <Text size="xs">Arrow</Text>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Icon size="lg" color="neutral" label="Menu icon">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
        </Icon>
        <Text size="xs">Menu</Text>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Icon size="lg" color="neutral" label="Search icon">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </Icon>
        <Text size="xs">Search</Text>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Icon size="lg" color="neutral" label="Settings icon">
          <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.04,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
        </Icon>
        <Text size="xs">Settings</Text>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Icon size="lg" color="neutral" label="Heart icon">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </Icon>
        <Text size="xs">Heart</Text>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Icon size="lg" color="neutral" label="Download icon">
          <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
        </Icon>
        <Text size="xs">Download</Text>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common UI icons for various interface elements and actions.',
      },
    },
  },
};

export const StatusIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem' }}>
        <Icon size="lg" color="success" label="Success status">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </Icon>
        <Text size="md">Operation completed successfully</Text>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem' }}>
        <Icon size="lg" color="warning" label="Warning status">
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
        </Icon>
        <Text size="md">Please review your input</Text>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#fef2f2', borderRadius: '0.5rem' }}>
        <Icon size="lg" color="error" label="Error status">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </Icon>
        <Text size="md">An error occurred</Text>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem' }}>
        <Icon size="lg" color="primary" label="Info status">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </Icon>
        <Text size="md">Additional information</Text>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Status icons with appropriate colors and contextual backgrounds.',
      },
    },
  },
};

export const AccessibilityExamples: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '400px' }}>
      <div>
        <Text size="sm" weight="medium" tone="primary">Accessible Icons with Labels</Text>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Icon size="lg" color="success" label="Download completed">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
          </Icon>
          <Icon size="lg" color="primary" label="Open settings">
            <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.04,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
          </Icon>
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <Text size="sm" tone="secondary">These icons have proper labels for screen readers</Text>
        </div>
      </div>
      
      <div>
        <Text size="sm" weight="medium" tone="primary">Decorative Icons (Hidden from Screen Readers)</Text>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Icon size="lg" color="neutral" decorative>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </Icon>
          <Icon size="lg" color="neutral" decorative>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </Icon>
          <Icon size="lg" color="neutral" decorative>
            <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z" />
          </Icon>
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <Text size="sm" tone="secondary">These decorative icons are hidden from screen readers</Text>
        </div>
      </div>
      
      <div>
        <Text size="sm" weight="medium" tone="primary">Icons with Text Labels</Text>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', backgroundColor: 'white' }}>
            <Icon size="sm" color="primary" decorative>
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </Icon>
            Download File
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', backgroundColor: 'white' }}>
            <Icon size="sm" color="error" decorative>
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </Icon>
            Delete Item
          </button>
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <Text size="sm" tone="secondary">Icons in buttons are decorative when text provides the label</Text>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Accessibility features including proper labeling, decorative icons, and button integration.',
      },
    },
    a11y: {
      config: {
        rules: [
          { id: 'svg-img-max', enabled: true },
          { id: 'color-contrast', enabled: true },
          { id: 'button-name', enabled: true },
        ],
      },
    },
  },
};
