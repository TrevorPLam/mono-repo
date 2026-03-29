import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Input } from '../../src/primitives';

const meta: Meta<typeof Input> = {
  title: 'Primitives/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Input component provides a foundational form input primitive with comprehensive styling and accessibility support.
It supports multiple input types, validation states, and visual feedback while maintaining consistency with design tokens.

## Accessibility
- Proper label association via htmlFor/id
- Screen reader announcements for validation states
- Keyboard navigation and focus management
- High contrast compliance via design tokens
- Semantic HTML5 input types for better mobile support

## Design Token Integration
All visual properties are driven by design tokens from \`@repo/design-tokens\`:
- Colors: Semantic tones for validation states
- Typography: Font size and weight tokens
- Spacing: Padding, margins, and gap tokens
- Border: Radius and border width tokens
- Shadows: Focus ring and depth tokens

## Form Integration
Designed to work seamlessly with form elements:
- HTML5 validation attributes support
- Proper form submission behavior
- Accessibility with label elements
- Validation state visual feedback
        `,
      },
    },
    a11y: {
      element: '#storybook-root',
      manual: false,
      config: {
        rules: [
          {
            // Inputs should have accessible labels
            id: 'label-title-only',
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
      description: 'Controls the input size using spacing tokens',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        defaultValue: { summary: 'md' },
        type: { summary: 'spacing token' },
      },
    },
    tone: {
      control: 'select',
      description: 'Semantic color tone using design token colors',
      options: ['neutral', 'primary', 'success', 'warning', 'error'],
      table: {
        defaultValue: { summary: 'neutral' },
        type: { summary: 'color token' },
      },
    },
    state: {
      control: 'select',
      description: 'Visual validation state for user feedback',
      options: ['default', 'error', 'success'],
      table: {
        defaultValue: { summary: 'default' },
        type: { summary: 'validation state' },
      },
    },
    type: {
      control: 'select',
      description: 'HTML5 input type for semantic behavior',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      table: {
        defaultValue: { summary: 'text' },
        type: { summary: 'HTML5 type' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for user guidance',
      table: {
        type: { summary: 'string' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input and prevents interactions',
      table: {
        type: { summary: 'boolean' },
      },
    },
    readOnly: {
      control: 'boolean',
      description: 'Makes input readable but not editable',
      table: {
        type: { summary: 'boolean' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Indicates input is required for form submission',
      table: {
        type: { summary: 'boolean' },
      },
    },
    value: {
      control: 'text',
      description: 'Controlled input value',
      table: {
        type: { summary: 'string' },
      },
    },
    autoComplete: {
      control: 'text',
      description: 'Browser autocomplete behavior',
      table: {
        type: { summary: 'string' },
      },
    },
    maxLength: {
      control: 'number',
      description: 'Maximum character length',
      table: {
        type: { summary: 'number' },
      },
    },
    pattern: {
      control: 'text',
      description: 'Regex pattern for validation',
      table: {
        type: { summary: 'regex string' },
      },
    },
    onChange: {
      action: 'changed',
      description: 'Change event handler',
      table: {
        type: { summary: 'function' },
      },
    },
    onFocus: {
      action: 'focused',
      description: 'Focus event handler',
      table: {
        type: { summary: 'function' },
      },
    },
    onBlur: {
      action: 'blurred',
      description: 'Blur event handler',
      table: {
        type: { summary: 'function' },
      },
    },
  },
  args: {
    placeholder: 'Enter text here...',
    onChange: fn(),
    onFocus: fn(),
    onBlur: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text here...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default input with medium size, neutral tone, and default state.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    placeholder: 'Interactive input',
    tone: 'primary',
    size: 'md',
    type: 'text',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all input combinations. Use the controls panel to modify props.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
          Extra Small
        </label>
        <Input size="xs" placeholder="Extra small input" />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
          Small
        </label>
        <Input size="sm" placeholder="Small input" />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
          Medium
        </label>
        <Input size="md" placeholder="Medium input" />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
          Large
        </label>
        <Input size="lg" placeholder="Large input" />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
          Extra Large
        </label>
        <Input size="xl" placeholder="Extra large input" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available input sizes using spacing tokens. Each size maintains proper touch targets and accessibility.',
      },
    },
  },
};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <Input tone="neutral" placeholder="Neutral input" />
      <Input tone="primary" placeholder="Primary input" />
      <Input tone="success" placeholder="Success input" />
      <Input tone="warning" placeholder="Warning input" />
      <Input tone="error" placeholder="Error input" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Semantic color tones using design token colors. Each tone provides appropriate visual feedback.',
      },
    },
  },
};

export const ValidationStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '300px' }}>
      <div>
        <Input state="default" placeholder="Default state" />
        <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
          Default input state with no validation feedback
        </p>
      </div>
      <div>
        <Input state="success" placeholder="Success state" />
        <p style={{ fontSize: '0.875rem', color: '#16a34a', marginTop: '0.5rem' }}>
          ✓ Input validation passed
        </p>
      </div>
      <div>
        <Input state="error" placeholder="Error state" />
        <p style={{ fontSize: '0.875rem', color: '#dc2626', marginTop: '0.5rem' }}>
          ✗ Input validation failed
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Visual validation states providing immediate feedback to users.',
      },
    },
  },
};

export const InputTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
          Text Input
        </label>
        <Input type="text" placeholder="Enter text" />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
          Email Input
        </label>
        <Input type="email" placeholder="email@example.com" />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
          Password Input
        </label>
        <Input type="password" placeholder="Enter password" />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
          Number Input
        </label>
        <Input type="number" placeholder="123" />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
          Telephone Input
        </label>
        <Input type="tel" placeholder="+1 (555) 123-4567" />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
          URL Input
        </label>
        <Input type="url" placeholder="https://example.com" />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
          Search Input
        </label>
        <Input type="search" placeholder="Search..." />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'HTML5 input types providing semantic behavior and optimized mobile keyboards.',
      },
    },
  },
};

export const FormExample: Story = {
  render: () => (
    <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '350px' }}>
      <div>
        <label htmlFor="fullname" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
          Full Name *
        </label>
        <Input 
          id="fullname" 
          placeholder="Enter your full name" 
          required
          autoComplete="name"
        />
      </div>
      <div>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
          Email Address *
        </label>
        <Input 
          id="email" 
          type="email" 
          placeholder="email@example.com" 
          required
          autoComplete="email"
        />
      </div>
      <div>
        <label htmlFor="phone" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
          Phone Number
        </label>
        <Input 
          id="phone" 
          type="tel" 
          placeholder="+1 (555) 123-4567"
          autoComplete="tel"
        />
      </div>
      <div>
        <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
          Password *
        </label>
        <Input 
          id="password" 
          type="password" 
          placeholder="Enter secure password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>
    </form>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete form example with proper labels, validation attributes, and autocomplete behavior.',
      },
    },
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
          Normal Input
        </label>
        <Input placeholder="Editable input" />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
          Disabled Input
        </label>
        <Input disabled placeholder="Cannot edit this" />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
          Read Only Input
        </label>
        <Input readOnly value="This value is read only" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different interaction states showing disabled and read-only behaviors.',
      },
    },
  },
};

export const AccessibilityExamples: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '350px' }}>
      <div>
        <h4>Required Fields</h4>
        <label htmlFor="required-field" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
          Required Field <span aria-label="required">*</span>
        </label>
        <Input 
          id="required-field" 
          required 
          aria-describedby="required-help"
          placeholder="This field is required"
        />
        <p id="required-help" style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
          This field must be filled out
        </p>
      </div>
      
      <div>
        <h4>Error State with ARIA</h4>
        <label htmlFor="error-field" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
          Email Address
        </label>
        <Input 
          id="error-field" 
          type="email" 
          state="error"
          aria-invalid="true"
          aria-describedby="error-message"
          placeholder="Enter valid email"
        />
        <p id="error-message" style={{ fontSize: '0.875rem', color: '#dc2626', marginTop: '0.5rem' }}>
          Please enter a valid email address
        </p>
      </div>
      
      <div>
        <h4>Described by Helper Text</h4>
        <label htmlFor="helper-field" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
          Password
        </label>
        <Input 
          id="helper-field" 
          type="password"
          aria-describedby="password-help"
          placeholder="Create secure password"
        />
        <p id="password-help" style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
          Password must be at least 8 characters with uppercase, lowercase, and numbers
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Accessibility features including ARIA attributes, required field indicators, and helper text associations.',
      },
    },
    a11y: {
      // Enhanced accessibility testing for this story
      config: {
        rules: [
          { id: 'label-title-only', enabled: true },
          { id: 'color-contrast', enabled: true },
          { id: 'aria-required-children', enabled: true },
          { id: 'aria-input-field-name', enabled: true },
        ],
      },
    },
  },
};
