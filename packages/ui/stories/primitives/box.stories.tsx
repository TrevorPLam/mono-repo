import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '../../src/primitives';

const meta: Meta<typeof Box> = {
  title: 'Primitives/Box',
  component: Box,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Box component is a versatile layout primitive that provides access to CSS properties via component props.
It serves as the foundational building block for layouts, spacing, and styling while maintaining design token consistency.

## Accessibility
- Polymorphic \`as\` prop for semantic HTML elements
- Proper landmark elements when used with semantic \`as\` values
- Screen reader friendly with appropriate element selection
- Focus management when used with interactive elements

## Design Token Integration
All spacing and visual properties are driven by design tokens from \`@repo/design-tokens\`:
- Spacing: Padding and margin tokens (xs, sm, md, lg, xl)
- Colors: Background and border color tokens
- Border: Radius and width tokens
- Layout: Flexbox and grid spacing tokens

## Usage Patterns
- Layout composition and structure
- Spacing and positioning
- Flexbox and grid containers
- Responsive design patterns
- Component composition foundation
        `,
      },
    },
    a11y: {
      element: '#storybook-root',
      manual: false,
      config: {
        rules: [
          {
            // Landmark elements should be properly nested
            id: 'landmark-one-main',
            enabled: true,
          },
          {
            // Color contrast for text and backgrounds
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
  argTypes: {
    as: {
      control: 'select',
      description: 'Render as different HTML elements for semantic markup',
      options: ['div', 'section', 'article', 'main', 'header', 'footer', 'nav', 'aside', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      table: {
        defaultValue: { summary: 'div' },
        type: { summary: 'HTML element' },
      },
    },
    display: {
      control: 'select',
      description: 'CSS display property using design token values',
      options: ['block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid', 'none'],
      table: {
        type: { summary: 'display value' },
      },
    },
    position: {
      control: 'select',
      description: 'CSS position property',
      options: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
      table: {
        defaultValue: { summary: 'static' },
        type: { summary: 'position value' },
      },
    },
    p: {
      control: 'select',
      description: 'Padding using design token spacing values',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
      table: {
        type: { summary: 'spacing token' },
      },
    },
    m: {
      control: 'select',
      description: 'Margin using design token spacing values',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
      table: {
        type: { summary: 'spacing token' },
      },
    },
    width: {
      control: 'text',
      description: 'Width value (CSS units or numbers)',
      table: {
        type: { summary: 'string | number' },
      },
    },
    height: {
      control: 'text',
      description: 'Height value (CSS units or numbers)',
      table: {
        type: { summary: 'string | number' },
      },
    },
    flexDirection: {
      control: 'select',
      description: 'Flexbox direction',
      options: ['row', 'row-reverse', 'column', 'column-reverse'],
      table: {
        type: { summary: 'flex direction' },
      },
    },
    justifyContent: {
      control: 'select',
      description: 'Flexbox justify content',
      options: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'],
      table: {
        type: { summary: 'justify value' },
      },
    },
    alignItems: {
      control: 'select',
      description: 'Flexbox align items',
      options: ['flex-start', 'flex-end', 'center', 'stretch', 'baseline'],
      table: {
        type: { summary: 'align value' },
      },
    },
    gap: {
      control: 'text',
      description: 'Gap spacing for flexbox and grid',
      table: {
        type: { summary: 'string | number' },
      },
    },
    backgroundColor: {
      control: 'text',
      description: 'Background color using design tokens or CSS values',
      table: {
        type: { summary: 'color value' },
      },
    },
    border: {
      control: 'text',
      description: 'Border using design token values',
      table: {
        type: { summary: 'border value' },
      },
    },
    borderRadius: {
      control: 'select',
      description: 'Border radius using design token values',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'full'],
      table: {
        type: { summary: 'radius token' },
      },
    },
  },
  args: {
    children: 'This is a Box component',
    p: 'md',
    backgroundColor: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is a Box component',
    p: 'md',
    backgroundColor: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default Box with medium padding, light background, and subtle border.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    children: 'Interactive Box Playground',
    p: 'lg',
    backgroundColor: '#dbeafe',
    border: '2px solid #3b82f6',
    borderRadius: 'lg',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100px',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all Box combinations. Use the controls panel to modify props.',
      },
    },
  },
};

export const SemanticElements: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px' }}>
      <Box as="header" p="md" backgroundColor="#fef3c7" border="1px solid #f59e0b" borderRadius="md">
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>Header Element</h2>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#92400e' }}>
          Semantic header for page or section
        </p>
      </Box>
      <Box as="main" p="md" backgroundColor="#f0f9ff" border="1px solid #0ea5e9" borderRadius="md">
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>Main Element</h2>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#075985' }}>
          Main content area of the page
        </p>
      </Box>
      <Box as="section" p="md" backgroundColor="#f0fdf4" border="1px solid #22c55e" borderRadius="md">
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>Section Element</h2>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#166534' }}>
          Thematic grouping of content
        </p>
      </Box>
      <Box as="article" p="md" backgroundColor="#faf5ff" border="1px solid #a855f7" borderRadius="md">
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>Article Element</h2>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b21a8' }}>
          Self-contained composition
        </p>
      </Box>
      <Box as="footer" p="md" backgroundColor="#fef2f2" border="1px solid #ef4444" borderRadius="md">
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>Footer Element</h2>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#991b1b' }}>
          Footer information and links
        </p>
      </Box>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Semantic HTML elements using the polymorphic `as` prop for better accessibility and SEO.',
      },
    },
    a11y: {
      config: {
        rules: [
          { id: 'landmark-one-main', enabled: true },
          { id: 'region', enabled: true },
        ],
      },
    },
  },
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
