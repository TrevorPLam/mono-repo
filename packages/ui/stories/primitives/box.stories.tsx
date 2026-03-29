import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@repo/ui';

const meta = {
  title: 'Primitives/Box',
  component: Box,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ['div', 'section', 'article', 'main', 'header', 'footer', 'nav', 'aside', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
    display: {
      control: 'select',
      options: ['block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid', 'none'],
    },
    position: {
      control: 'select',
      options: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
    },
  },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is a Box component',
    padding: 'md',
    background: 'neutral',
    border: 'sm',
    borderRadius: 'md',
  },
};

export const AsDifferentElements: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Box as="header" padding="md" background="primary" borderRadius="md">
        Header Element
      </Box>
      <Box as="main" padding="md" background="secondary" borderRadius="md">
        Main Element
      </Box>
      <Box as="section" padding="md" background="accent" borderRadius="md">
        Section Element
      </Box>
      <Box as="article" padding="md" background="success" borderRadius="md">
        Article Element
      </Box>
      <Box as="footer" padding="md" background="warning" borderRadius="md">
        Footer Element
      </Box>
    </div>
  ),
};

export const LayoutProperties: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '400px' }}>
      <Box display="block" padding="md" background="neutral" borderRadius="md">
        Block Display
      </Box>
      <Box display="flex" padding="md" background="primary" borderRadius="md" justifyContent="center">
        Flex Display (Centered)
      </Box>
      <Box display="grid" padding="md" background="secondary" borderRadius="md" gridTemplateColumns="1fr 1fr" gap="sm">
        <Box background="accent" padding="sm" borderRadius="sm">Grid 1</Box>
        <Box background="accent" padding="sm" borderRadius="sm">Grid 2</Box>
      </Box>
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Box padding="xs" background="neutral" borderRadius="md">
        Padding XS
      </Box>
      <Box padding="sm" background="neutral" borderRadius="md">
        Padding SM
      </Box>
      <Box padding="md" background="neutral" borderRadius="md">
        Padding MD
      </Box>
      <Box padding="lg" background="neutral" borderRadius="md">
        Padding LG
      </Box>
      <Box padding="xl" background="neutral" borderRadius="md">
        Padding XL
      </Box>
    </div>
  ),
};

export const MarginSpacing: Story = {
  render: () => (
    <div style={{ background: '#f5f5f5', padding: '1rem' }}>
      <Box margin="xs" background="primary" borderRadius="md">
        Margin XS
      </Box>
      <Box margin="sm" background="primary" borderRadius="md">
        Margin SM
      </Box>
      <Box margin="md" background="primary" borderRadius="md">
        Margin MD
      </Box>
      <Box margin="lg" background="primary" borderRadius="md">
        Margin LG
      </Box>
      <Box margin="xl" background="primary" borderRadius="md">
        Margin XL
      </Box>
    </div>
  ),
};

export const FlexboxExamples: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <Box display="flex" gap="sm">
        <Box flex="1" padding="md" background="primary" borderRadius="md">Flex 1</Box>
        <Box flex="1" padding="md" background="secondary" borderRadius="md">Flex 1</Box>
        <Box flex="1" padding="md" background="accent" borderRadius="md">Flex 1</Box>
      </Box>
      
      <Box display="flex" justifyContent="space-between" padding="md" background="neutral" borderRadius="md">
        <Box padding="sm" background="primary" borderRadius="sm">Start</Box>
        <Box padding="sm" background="accent" borderRadius="sm">Middle</Box>
        <Box padding="sm" background="secondary" borderRadius="sm">End</Box>
      </Box>
      
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100px" padding="md" background="neutral" borderRadius="md">
        <Box padding="sm" background="primary" borderRadius="sm">Centered</Box>
      </Box>
      
      <Box display="flex" flexDirection="column" gap="sm" padding="md" background="neutral" borderRadius="md">
        <Box padding="sm" background="primary" borderRadius="sm">Column 1</Box>
        <Box padding="sm" background="secondary" borderRadius="sm">Column 2</Box>
        <Box padding="sm" background="accent" borderRadius="sm">Column 3</Box>
      </Box>
    </div>
  ),
};

export const GridExamples: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <Box 
        display="grid" 
        gridTemplateColumns="repeat(3, 1fr)" 
        gap="sm" 
        padding="md" 
        background="neutral" 
        borderRadius="md"
      >
        <Box padding="sm" background="primary" borderRadius="sm">Grid 1</Box>
        <Box padding="sm" background="secondary" borderRadius="sm">Grid 2</Box>
        <Box padding="sm" background="accent" borderRadius="sm">Grid 3</Box>
        <Box padding="sm" background="success" borderRadius="sm">Grid 4</Box>
        <Box padding="sm" background="warning" borderRadius="sm">Grid 5</Box>
        <Box padding="sm" background="danger" borderRadius="sm">Grid 6</Box>
      </Box>
      
      <Box 
        display="grid" 
        gridTemplateColumns="2fr 1fr" 
        gridTemplateRows="auto 1fr" 
        gap="sm" 
        padding="md" 
        background="neutral" 
        borderRadius="md"
        minHeight="200px"
      >
        <Box padding="sm" background="primary" borderRadius="sm" gridColumn="1 / 3">Header</Box>
        <Box padding="sm" background="secondary" borderRadius="sm">Main</Box>
        <Box padding="sm" background="accent" borderRadius="sm">Sidebar</Box>
      </Box>
    </div>
  ),
};

export const BordersAndBackgrounds: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Box padding="md" background="primary" borderRadius="md">
        Primary Background
      </Box>
      <Box padding="md" background="secondary" border="sm" borderColor="accent" borderRadius="md">
        Secondary with Accent Border
      </Box>
      <Box padding="md" background="accent" border="md" borderColor="success" borderRadius="lg">
        Accent with Success Border
      </Box>
      <Box padding="md" background="success" border="lg" borderColor="warning" borderRadius="xl">
        Success with Warning Border
      </Box>
    </div>
  ),
};

export const Positioning: Story = {
  render: () => (
    <Box position="relative" minHeight="200px" background="neutral" borderRadius="md" padding="md">
      <Box position="absolute" top="sm" right="sm" padding="sm" background="primary" borderRadius="sm">
        Absolute Top Right
      </Box>
      <Box position="absolute" bottom="sm" left="sm" padding="sm" background="secondary" borderRadius="sm">
        Absolute Bottom Left
      </Box>
      <Box position="relative" padding="sm" background="accent" borderRadius="sm" margin="lg">
        Relative Content
      </Box>
    </Box>
  ),
};

export const Responsive: Story = {
  render: () => (
    <Box padding="md" background="primary" borderRadius="md">
      <Box 
        display="flex" 
        flexDirection={{ base: 'column', md: 'row' }} 
        gap="sm"
      >
        <Box flex="1" padding="sm" background="secondary" borderRadius="sm">
          Responsive Item 1
        </Box>
        <Box flex="1" padding="sm" background="accent" borderRadius="sm">
          Responsive Item 2
        </Box>
      </Box>
    </Box>
  ),
};

export const CustomStyling: Story = {
  args: {
    children: 'Custom styled Box',
    padding: 'lg',
    background: 'gradient',
    border: 'md',
    borderColor: 'accent',
    borderRadius: 'xl',
    boxShadow: 'lg',
    transform: 'scale(1.05)',
    transition: 'all 0.2s ease-in-out',
    style: {
      cursor: 'pointer',
    },
  },
};
