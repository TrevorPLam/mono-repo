import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from '../../src/primitives';

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Button component is a foundational primitive that provides consistent button interactions across the application.
It supports multiple visual variants, sizes, tones, and states while maintaining accessibility standards.

## Accessibility
- Built-in keyboard navigation support
- Proper ARIA attributes for screen readers
- Focus management and visible focus indicators
- High contrast compliance via design tokens
- Semantic HTML structure with proper button types

## Design Token Integration
All visual properties are driven by design tokens from \`@repo/design-tokens\`:
- Colors: Semantic color tokens for different tones
- Typography: Font size and weight tokens
- Spacing: Padding and gap tokens
- Border: Radius and border width tokens
- Shadows: Drop shadow tokens for depth
        `,
      },
    },
    a11y: {
      element: '#storybook-root',
      manual: false,
      config: {
        rules: [
          {
            // Buttons should have accessible text
            id: 'button-name',
            enabled: true,
          },
          {
            // Sufficient color contrast
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
      description: 'Controls the button size using spacing tokens',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        defaultValue: { summary: 'md' },
        type: { summary: 'spacing token' },
      },
    },
    tone: {
      control: 'select',
      description: 'Semantic color tone using design token colors',
      options: ['neutral', 'primary', 'secondary', 'accent', 'success', 'warning', 'error'],
      table: {
        defaultValue: { summary: 'neutral' },
        type: { summary: 'color token' },
      },
    },
    variant: {
      control: 'select',
      description: 'Visual style variant affecting background and border',
      options: ['solid', 'outline', 'ghost', 'link'],
      table: {
        defaultValue: { summary: 'solid' },
        type: { summary: 'style variant' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button and prevents interactions',
      table: {
        type: { summary: 'boolean' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading state with spinner and disables interactions',
      table: {
        type: { summary: 'boolean' },
      },
    },
    type: {
      control: 'select',
      description: 'HTML button type for form semantics',
      options: ['button', 'submit', 'reset'],
      table: {
        defaultValue: { summary: 'button' },
        type: { summary: 'HTML type' },
      },
    },
    onClick: {
      action: 'clicked',
      description: 'Click event handler',
      table: {
        type: { summary: 'function' },
      },
    },
    children: {
      description: 'Button content - should be descriptive for accessibility',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    className: {
      control: false,
      description: 'Additional CSS classes for customization',
      table: {
        type: { summary: 'string' },
      },
    },
  },
  args: {
    children: 'Click me',
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Click me',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default button with medium size, neutral tone, and solid variant.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    children: 'Interactive Button',
    tone: 'primary',
    size: 'md',
    variant: 'solid',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all button combinations. Use the controls panel to modify props.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Button size="xs">Extra Small</Button>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button size="xl">Extra Large</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available button sizes using spacing tokens. Each size maintains proper touch targets and accessibility.',
      },
    },
  },
};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button tone="neutral">Neutral</Button>
      <Button tone="primary">Primary</Button>
      <Button tone="secondary">Secondary</Button>
      <Button tone="accent">Accent</Button>
      <Button tone="success">Success</Button>
      <Button tone="warning">Warning</Button>
      <Button tone="error">Error</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Semantic color tones using design token colors. Each tone provides appropriate contrast and meaning.',
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="solid">Solid</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Visual variants for different hierarchy levels and use cases.',
      },
    },
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button>Normal</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different button states. Disabled and loading states prevent user interaction.',
      },
    },
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <span style={{ marginRight: '0.5rem' }}>🚀</span>
        With Icon
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with icon content. Icons should be used to supplement text, not replace it for accessibility.',
      },
    },
  },
};

export const InteractiveExamples: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3>Click Counter</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Button tone="primary" onClick={() => alert('Primary action clicked!')}>
            Primary Action
          </Button>
          <Button tone="secondary" onClick={() => alert('Secondary action clicked!')}>
            Secondary Action
          </Button>
        </div>
      </div>
      
      <div>
        <h3>Form Actions</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button type="submit" tone="success">Submit Form</Button>
          <Button type="reset" variant="outline">Reset</Button>
        </div>
      </div>
      
      <div>
        <h3>Loading States</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button loading>Loading...</Button>
          <Button tone="primary" loading>Submitting...</Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive examples demonstrating real-world usage patterns and event handling.',
      },
    },
  },
};

export const AccessibilityExamples: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <h4>Descriptive Labels</h4>
        <Button tone="primary">Save Document</Button>
        <Button tone="error">Delete Item</Button>
      </div>
      
      <div>
        <h4>Keyboard Navigation</h4>
        <p>Tab to navigate, Enter/Space to activate</p>
        <Button>Tab to me</Button>
        <Button tone="primary">Then me</Button>
      </div>
      
      <div>
        <h4>Disabled State</h4>
        <Button disabled>Cannot interact</Button>
        <Button tone="primary" disabled>Also disabled</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Accessibility features including keyboard navigation, screen reader support, and proper disabled states.',
      },
    },
    a11y: {
      // Enhanced accessibility testing for this story
      config: {
        rules: [
          { id: 'button-name', enabled: true },
          { id: 'color-contrast', enabled: true },
          { id: 'keyboard', enabled: true },
          { id: 'focus-order-semantics', enabled: true },
        ],
      },
    },
  },
};
