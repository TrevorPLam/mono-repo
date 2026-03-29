import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@repo/ui';

const meta = {
  title: 'Primitives/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    tone: {
      control: 'select',
      options: ['neutral', 'primary', 'secondary', 'accent', 'success', 'warning', 'danger'],
    },
    state: {
      control: 'select',
      options: ['default', 'error', 'success'],
    },
    disabled: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text here...',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <Input size="xs" placeholder="Extra small input" />
      <Input size="sm" placeholder="Small input" />
      <Input size="md" placeholder="Medium input" />
      <Input size="lg" placeholder="Large input" />
      <Input size="xl" placeholder="Extra large input" />
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <Input tone="neutral" placeholder="Neutral input" />
      <Input tone="primary" placeholder="Primary input" />
      <Input tone="secondary" placeholder="Secondary input" />
      <Input tone="accent" placeholder="Accent input" />
      <Input tone="success" placeholder="Success input" />
      <Input tone="warning" placeholder="Warning input" />
      <Input tone="danger" placeholder="Danger input" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <Input state="default" placeholder="Default state" />
      <Input state="success" placeholder="Success state" />
      <Input state="error" placeholder="Error state" />
      <Input disabled placeholder="Disabled input" />
    </div>
  ),
};

export const Types: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <Input type="text" placeholder="Text input" />
      <Input type="email" placeholder="Email input" />
      <Input type="password" placeholder="Password input" />
      <Input type="number" placeholder="Number input" />
      <Input type="tel" placeholder="Telephone input" />
      <Input type="url" placeholder="URL input" />
      <Input type="search" placeholder="Search input" />
    </div>
  ),
};

export const WithLabels: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <div>
        <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Name
        </label>
        <Input id="name" placeholder="Enter your name" />
      </div>
      <div>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Email
        </label>
        <Input id="email" type="email" placeholder="Enter your email" />
      </div>
      <div>
        <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Password
        </label>
        <Input id="password" type="password" placeholder="Enter your password" />
      </div>
    </div>
  ),
};

export const WithHelperText: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '300px' }}>
      <div>
        <Input id="username" placeholder="Choose a username" />
        <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
          Username must be at least 3 characters long
        </p>
      </div>
      <div>
        <Input id="email" type="email" placeholder="Enter your email" state="error" />
        <p style={{ fontSize: '0.875rem', color: '#dc2626', marginTop: '0.5rem' }}>
          Please enter a valid email address
        </p>
      </div>
      <div>
        <Input id="password" type="password" placeholder="Enter your password" state="success" />
        <p style={{ fontSize: '0.875rem', color: '#16a34a', marginTop: '0.5rem' }}>
          Password meets all requirements
        </p>
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    placeholder: 'Try interacting with this input...',
    type: 'text',
  },
  play: async ({ canvasElement }) => {
    // This is where you could add interaction testing with Testing Library
    // For now, this story demonstrates the input in its default interactive state
    await new Promise(resolve => setTimeout(resolve, 100));
  },
};
