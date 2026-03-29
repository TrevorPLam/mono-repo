import type { Meta, StoryObj } from '@storybook/react';
import { Text } from '../../src/primitives';

const meta: Meta<typeof Text> = {
  title: 'Primitives/Text',
  component: Text,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Text component provides comprehensive typography primitives with design token integration.
It supports semantic HTML elements, multiple visual styles, and accessibility features while maintaining typographic consistency.

## Accessibility
- Polymorphic \`as\` prop for semantic heading and paragraph elements
- Proper heading hierarchy when using h1-h6 elements
- Screen reader friendly with appropriate element selection
- High contrast compliance via design tokens

## Design Token Integration
All typographic properties are driven by design tokens from \`@repo/design-tokens\`:
- Typography: Font size, weight, and line height tokens
- Colors: Semantic color tokens for different tones
- Spacing: Letter spacing and line height tokens
- Font families: Primary and secondary font tokens

## Usage Patterns
- Headings and subheadings
- Body text and paragraphs
- UI labels and captions
- Links and emphasized text
- Semantic markup for SEO
        `,
      },
    },
    a11y: {
      element: '#storybook-root',
      manual: false,
      config: {
        rules: [
          {
            // Heading hierarchy should be logical
            id: 'heading-order',
            enabled: true,
          },
          {
            // Color contrast for text
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
      options: ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div'],
      table: {
        defaultValue: { summary: 'span' },
        type: { summary: 'HTML element' },
      },
    },
    size: {
      control: 'select',
      description: 'Font size using design token typography scales',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        defaultValue: { summary: 'md' },
        type: { summary: 'typography token' },
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
    weight: {
      control: 'select',
      description: 'Font weight using design token values',
      options: ['light', 'normal', 'medium', 'semibold', 'bold'],
      table: {
        defaultValue: { summary: 'normal' },
        type: { summary: 'font weight' },
      },
    },
    align: {
      control: 'select',
      description: 'Text alignment',
      options: ['left', 'center', 'right', 'justify'],
      table: {
        defaultValue: { summary: 'left' },
        type: { summary: 'text align' },
      },
    },
    decoration: {
      control: 'select',
      description: 'Text decoration',
      options: ['none', 'underline', 'overline', 'line-through'],
      table: {
        defaultValue: { summary: 'none' },
        type: { summary: 'text decoration' },
      },
    },
    transform: {
      control: 'select',
      description: 'Text transformation',
      options: ['none', 'uppercase', 'lowercase', 'capitalize'],
      table: {
        defaultValue: { summary: 'none' },
        type: { summary: 'text transform' },
      },
    },
    leading: {
      control: 'select',
      description: 'Line height using design token values',
      options: ['none', 'tight', 'normal', 'relaxed', 'loose'],
      table: {
        defaultValue: { summary: 'normal' },
        type: { summary: 'line height' },
      },
    },
    tracking: {
      control: 'select',
      description: 'Letter spacing using design token values',
      options: ['tight', 'normal', 'wide', 'wider', 'widest'],
      table: {
        defaultValue: { summary: 'normal' },
        type: { summary: 'letter spacing' },
      },
    },
    truncate: {
      control: 'boolean',
      description: 'Truncate text with ellipsis when it overflows',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    italic: {
      control: 'boolean',
      description: 'Apply italic styling',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    children: {
      description: 'Text content',
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
    children: 'This is a Text component',
    size: 'md',
    tone: 'neutral',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is a Text component',
    size: 'md',
    tone: 'neutral',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default Text with medium size and neutral tone.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    children: 'Interactive Text Playground',
    size: 'lg',
    tone: 'primary',
    weight: 'semibold',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all Text combinations. Use the controls panel to modify props.',
      },
    },
  },
};

export const TypographyScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px' }}>
      <Text size="xs" weight="medium">Extra Small Text</Text>
      <Text size="sm" weight="medium">Small Text</Text>
      <Text size="md" weight="medium">Medium Text</Text>
      <Text size="lg" weight="medium">Large Text</Text>
      <Text size="xl" weight="medium">Extra Large Text</Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Typography scale using design token font sizes.',
      },
    },
  },
};

export const FontWeights: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px' }}>
      <Text size="lg" weight="light">Light Weight (300)</Text>
      <Text size="lg" weight="normal">Normal Weight (400)</Text>
      <Text size="lg" weight="medium">Medium Weight (500)</Text>
      <Text size="lg" weight="semibold">Semibold Weight (600)</Text>
      <Text size="lg" weight="bold">Bold Weight (700)</Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available font weights using design token values.',
      },
    },
  },
};

export const ColorTones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px' }}>
      <Text size="lg" tone="neutral">Neutral text color</Text>
      <Text size="lg" tone="primary">Primary text color</Text>
      <Text size="lg" tone="secondary">Secondary text color</Text>
      <Text size="lg" tone="accent">Accent text color</Text>
      <Text size="lg" tone="success">Success text color</Text>
      <Text size="lg" tone="warning">Warning text color</Text>
      <Text size="lg" tone="error">Error text color</Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Semantic color tones using design token colors for different contexts.',
      },
    },
  },
};

export const SemanticHeadings: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '500px' }}>
      <Text as="h1" size="xl" weight="bold" tone="neutral">
        Heading 1 - Page Title
      </Text>
      <Text as="h2" size="lg" weight="semibold" tone="neutral">
        Heading 2 - Section Title
      </Text>
      <Text as="h3" size="md" weight="semibold" tone="neutral">
        Heading 3 - Subsection Title
      </Text>
      <Text as="h4" size="sm" weight="medium" tone="neutral">
        Heading 4 - Component Title
      </Text>
      <Text as="h5" size="xs" weight="medium" tone="neutral">
        Heading 5 - Small Title
      </Text>
      <Text as="h6" size="xs" weight="medium" tone="neutral">
        Heading 6 - Micro Title
      </Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Semantic heading elements using the polymorphic `as` prop for proper document structure.',
      },
    },
    a11y: {
      config: {
        rules: [
          { id: 'heading-order', enabled: true },
          { id: 'color-contrast', enabled: true },
        ],
      },
    },
  },
};

export const TextAlignment: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px' }}>
      <div style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem' }}>
        <Text align="left" size="lg" weight="medium">Left aligned text</Text>
      </div>
      <div style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem' }}>
        <Text align="center" size="lg" weight="medium">Center aligned text</Text>
      </div>
      <div style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem' }}>
        <Text align="right" size="lg" weight="medium">Right aligned text</Text>
      </div>
      <div style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem' }}>
        <Text align="justify" size="lg" weight="medium">
          Justified text that spreads evenly across the container with consistent spacing between words.
        </Text>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Text alignment options for different layout needs.',
      },
    },
  },
};

export const TextStyles: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px' }}>
      <div>
        <Text size="lg" decoration="underline">Underlined text</Text>
      </div>
      <div>
        <Text size="lg" decoration="line-through">Strikethrough text</Text>
      </div>
      <div>
        <Text size="lg" decoration="overline">Overlined text</Text>
      </div>
      <div>
        <Text size="lg" transform="uppercase">Uppercase text</Text>
      </div>
      <div>
        <Text size="lg" transform="lowercase">lowercase text</Text>
      </div>
      <div>
        <Text size="lg" transform="capitalize">Capitalized text</Text>
      </div>
      <div>
        <Text size="lg" italic>Italic text styling</Text>
      </div>
      <div>
        <Text size="lg" weight="bold" italic>Bold and italic text</Text>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Text styling options including decorations, transformations, and italic styling.',
      },
    },
  },
};

export const LineHeightAndSpacing: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '400px' }}>
      <div>
        <Text size="md" weight="medium" tone="primary">Line Height</Text>
        <Text leading="tight">Tight line height for compact text blocks and space-constrained layouts.</Text>
        <Text leading="normal">Normal line height for comfortable reading and standard text blocks.</Text>
        <Text leading="relaxed">Relaxed line height for improved readability and longer content sections.</Text>
        <Text leading="loose">Loose line height for maximum readability and accessibility-focused content.</Text>
      </div>
      
      <div>
        <Text size="md" weight="medium" tone="primary">Letter Spacing</Text>
        <Text tracking="tight">Tight tracking for condensed text and headlines.</Text>
        <Text tracking="normal">Normal tracking for standard body text.</Text>
        <Text tracking="wide">Wide tracking for emphasis and improved readability.</Text>
        <Text tracking="wider">Wider tracking for titles and prominent text.</Text>
        <Text tracking="widest">Widest tracking for special emphasis and decorative text.</Text>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Line height and letter spacing options for typography refinement.',
      },
    },
  },
};

export const TruncatedText: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <div>
        <Text size="sm" weight="medium" tone="primary">Normal Text</Text>
        <Text size="md">
          This text will wrap normally and display in multiple lines if needed.
        </Text>
      </div>
      <div>
        <Text size="sm" weight="medium" tone="primary">Truncated Text</Text>
        <Text size="md" truncate>
          This text will be truncated with an ellipsis when it overflows the container width.
        </Text>
      </div>
      <div>
        <Text size="sm" weight="medium" tone="primary">Long Truncated Text</Text>
        <Text size="md" truncate>
          This is a very long piece of text that will definitely be truncated with an ellipsis when it reaches the container width limit.
        </Text>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Text truncation with ellipsis for handling overflow content.',
      },
    },
  },
};

export const AccessibilityExamples: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '500px' }}>
      <div>
        <Text size="sm" weight="medium" tone="primary">Semantic Heading Structure</Text>
        <Text as="h1" size="lg" weight="bold">
          Main Page Title
        </Text>
        <Text as="p" size="md">
          This is a paragraph that follows the main heading, providing context and content.
        </Text>
        <Text as="h2" size="md" weight="semibold">
          Section Title
        </Text>
        <Text as="p" size="md">
          This paragraph provides content for the section, maintaining proper document hierarchy.
        </Text>
      </div>
      
      <div>
        <Text size="sm" weight="medium" tone="primary">High Contrast Examples</Text>
        <div style={{ backgroundColor: '#1f2937', padding: '1rem', borderRadius: '0.5rem' }}>
          <Text tone="neutral" size="lg">Light text on dark background</Text>
        </div>
        <div style={{ backgroundColor: '#fef3c7', padding: '1rem', borderRadius: '0.5rem' }}>
          <Text tone="neutral" size="lg">Dark text on light background</Text>
        </div>
      </div>
      
      <div>
        <Text size="sm" weight="medium" tone="primary">Link and Emphasis Text</Text>
        <Text as="p" size="md">
          This paragraph contains <Text as="span" weight="semibold">strong text</Text> for emphasis,
          <Text as="span" italic>italic text</Text> for stress, and 
          <Text as="span" tone="primary" decoration="underline">link text</Text> for navigation.
        </Text>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Accessibility features including semantic markup, proper heading hierarchy, and high contrast examples.',
      },
    },
    a11y: {
      config: {
        rules: [
          { id: 'heading-order', enabled: true },
          { id: 'color-contrast', enabled: true },
          { id: 'link-in-text-block', enabled: true },
        ],
      },
    },
  },
};
