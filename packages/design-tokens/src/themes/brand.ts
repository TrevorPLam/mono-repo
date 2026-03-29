/**
 * Brand Customization System
 * Client-specific theme customization workflow
 * Enables easy brand variation management for marketing firm clients
 */

import { createBrandTheme, themeRegistry, type BrandCustomization } from './index';

// =============================================================================
// BRAND CUSTOMIZATION WORKFLOW
// =============================================================================

export interface ClientBrandProfile {
  /** Unique client identifier */
  id: string;
  /** Client display name */
  name: string;
  /** Client organization */
  organization?: string;
  /** Brand customization settings */
  customization: BrandCustomization;
  /** Theme metadata */
  metadata?: {
    created: string;
    updated: string;
    version: string;
    notes?: string;
  };
  /** Workflow status */
  status: 'draft' | 'review' | 'approved' | 'active' | 'archived';
}

export interface BrandCustomizationWorkflow {
  /** Create new brand profile */
  createProfile(profile: Omit<ClientBrandProfile, 'id' | 'metadata' | 'status'>): ClientBrandProfile;
  /** Update existing brand profile */
  updateProfile(id: string, updates: Partial<ClientBrandProfile>): ClientBrandProfile;
  /** Get brand profile by ID */
  getProfile(id: string): ClientBrandProfile | undefined;
  /** List all brand profiles */
  listProfiles(): ClientBrandProfile[];
  /** Delete brand profile */
  deleteProfile(id: string): boolean;
  /** Activate brand theme */
  activateTheme(id: string): boolean;
  /** Export brand configuration */
  exportProfile(id: string): string;
  /** Import brand configuration */
  importProfile(config: string): ClientBrandProfile;
}

/**
 * Brand Customization Manager - Handles client brand customization workflow
 */
export class BrandCustomizationManager implements BrandCustomizationWorkflow {
  private profiles: Map<string, ClientBrandProfile> = new Map();
  private activeProfile: string | null = null;

  /**
   * Create a new brand profile
   */
  createProfile(profileInput: Omit<ClientBrandProfile, 'id' | 'metadata' | 'status'>): ClientBrandProfile {
    const id = this.generateProfileId(profileInput.name);
    const now = new Date().toISOString();
    
    const profile: ClientBrandProfile = {
      ...profileInput,
      id,
      metadata: {
        created: now,
        updated: now,
        version: '1.0.0'
      },
      status: 'draft'
    };

    this.profiles.set(id, profile);
    return profile;
  }

  /**
   * Update existing brand profile
   */
  updateProfile(id: string, updates: Partial<ClientBrandProfile>): ClientBrandProfile {
    const existingProfile = this.profiles.get(id);
    if (!existingProfile) {
      throw new Error(`Brand profile with ID "${id}" not found`);
    }

    const updatedProfile: ClientBrandProfile = {
      ...existingProfile,
      ...updates,
      id, // Ensure ID doesn't change
      metadata: {
        created: existingProfile.metadata?.created || new Date().toISOString(),
        updated: new Date().toISOString(),
        version: this.incrementVersion(existingProfile.metadata?.version || '1.0.0'),
        ...(updates.metadata?.notes && { notes: updates.metadata.notes })
      }
    };

    this.profiles.set(id, updatedProfile);
    return updatedProfile;
  }

  /**
   * Get brand profile by ID
   */
  getProfile(id: string): ClientBrandProfile | undefined {
    return this.profiles.get(id);
  }

  /**
   * List all brand profiles
   */
  listProfiles(): ClientBrandProfile[] {
    return Array.from(this.profiles.values());
  }

  /**
   * Delete brand profile
   */
  deleteProfile(id: string): boolean {
    // Don't allow deletion of active profile
    if (this.activeProfile === id) {
      throw new Error('Cannot delete active brand profile');
    }

    return this.profiles.delete(id);
  }

  /**
   * Activate brand theme
   */
  activateTheme(id: string): boolean {
    const profile = this.profiles.get(id);
    if (!profile) {
      console.warn(`Brand profile with ID "${id}" not found`);
      return false;
    }

    try {
      // Create theme from brand customization
      const theme = createBrandTheme(profile.customization);
      
      // Register theme in global registry
      themeRegistry.registerTheme(theme);
      
      // Set as active profile
      this.activeProfile = id;
      
      // Update profile status
      this.updateProfile(id, { status: 'active' });
      
      console.log(`Activated brand theme for ${profile.name}`);
      return true;
    } catch (error) {
      console.error(`Failed to activate brand theme for ${profile.name}:`, error);
      return false;
    }
  }

  /**
   * Export brand configuration
   */
  exportProfile(id: string): string {
    const profile = this.profiles.get(id);
    if (!profile) {
      throw new Error(`Brand profile with ID "${id}" not found`);
    }

    return JSON.stringify(profile, null, 2);
  }

  /**
   * Import brand configuration
   */
  importProfile(config: string): ClientBrandProfile {
    try {
      const profile = JSON.parse(config) as ClientBrandProfile;
      
      // Validate profile structure
      this.validateProfile(profile);
      
      // Generate new ID to avoid conflicts
      const importedProfile: ClientBrandProfile = {
        ...profile,
        id: this.generateProfileId(profile.name + '-imported'),
        metadata: {
          ...profile.metadata,
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
          version: '1.0.0'
        },
        status: 'draft'
      };

      this.profiles.set(importedProfile.id, importedProfile);
      return importedProfile;
    } catch (error) {
      throw new Error(`Failed to import brand configuration: ${error}`);
    }
  }

  /**
   * Get active profile
   */
  getActiveProfile(): ClientBrandProfile | undefined {
    return this.activeProfile ? this.profiles.get(this.activeProfile) : undefined;
  }

  /**
   * Generate unique profile ID
   */
  private generateProfileId(name: string): string {
    const base = name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    let id = base;
    let counter = 1;
    
    while (this.profiles.has(id)) {
      id = `${base}-${counter}`;
      counter++;
    }
    
    return id;
  }

  /**
   * Validate profile structure
   */
  private validateProfile(profile: any): void {
    if (!profile.name || typeof profile.name !== 'string') {
      throw new Error('Profile must have a valid name');
    }
    
    if (!profile.customization) {
      throw new Error('Profile must have customization settings');
    }
    
    const customization = profile.customization as BrandCustomization;
    if (!customization.id || !customization.name) {
      throw new Error('Customization must have id and name');
    }
  }

  /**
   * Increment version number
   */
  private incrementVersion(version: string): string {
    const parts = version.split('.');
    if (parts.length !== 3) {
      return '1.0.0';
    }
    
    const patch = parseInt(parts[2] || '0', 10) + 1;
    return `${parts[0]}.${parts[1]}.${patch}`;
  }
}

// =============================================================================
// BRAND CUSTOMIZATION BUILDER
// =============================================================================

export interface BrandCustomizationBuilder {
  /** Set brand identity */
  setIdentity(id: string, name: string, organization?: string): BrandCustomizationBuilder;
  /** Set primary brand color */
  setPrimaryColor(color: string): BrandCustomizationBuilder;
  /** Set secondary brand color */
  setSecondaryColor(color: string): BrandCustomizationBuilder;
  /** Set accent color */
  setAccentColor(color: string): BrandCustomizationBuilder;
  /** Set brand font family */
  setFontFamily(fontFamily: string): BrandCustomizationBuilder;
  /** Set border radius style */
  setBorderRadius(radius: string): BrandCustomizationBuilder;
  /** Add custom token override */
  addCustomToken(path: string, value: any): BrandCustomizationBuilder;
  /** Add multiple custom tokens */
  addCustomTokens(tokens: Record<string, any>): BrandCustomizationBuilder;
  /** Build the customization object */
  build(): BrandCustomization;
}

/**
 * Fluent builder for brand customizations
 */
export class BrandCustomizationBuilderImpl implements BrandCustomizationBuilder {
  private customization: Partial<BrandCustomization> = {};

  setIdentity(id: string, name: string, organization?: string): BrandCustomizationBuilder {
    this.customization.id = id;
    this.customization.name = name;
    return this;
  }

  setPrimaryColor(color: string): BrandCustomizationBuilder {
    this.customization.primaryColor = color;
    return this;
  }

  setSecondaryColor(color: string): BrandCustomizationBuilder {
    this.customization.secondaryColor = color;
    return this;
  }

  setAccentColor(color: string): BrandCustomizationBuilder {
    this.customization.accentColor = color;
    return this;
  }

  setFontFamily(fontFamily: string): BrandCustomizationBuilder {
    this.customization.fontFamily = fontFamily;
    return this;
  }

  setBorderRadius(radius: string): BrandCustomizationBuilder {
    this.customization.borderRadius = radius;
    return this;
  }

  addCustomToken(path: string, value: any): BrandCustomizationBuilder {
    if (!this.customization.customTokens) {
      this.customization.customTokens = {};
    }
    this.customization.customTokens[path] = value;
    return this;
  }

  addCustomTokens(tokens: Record<string, any>): BrandCustomizationBuilder {
    if (!this.customization.customTokens) {
      this.customization.customTokens = {};
    }
    Object.assign(this.customization.customTokens, tokens);
    return this;
  }

  build(): BrandCustomization {
    if (!this.customization.id || !this.customization.name) {
      throw new Error('Brand customization must have id and name');
    }
    return this.customization as BrandCustomization;
  }
}

// =============================================================================
// PRESET BRAND TEMPLATES
// =============================================================================

export interface BrandPreset {
  id: string;
  name: string;
  description: string;
  customization: BrandCustomization;
  category: 'corporate' | 'creative' | 'tech' | 'retail' | 'healthcare' | 'education';
}

/**
 * Predefined brand templates for common client types
 */
export const brandPresets: BrandPreset[] = [
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    description: 'Professional blue theme for corporate clients',
    category: 'corporate',
    customization: {
      id: 'corporate-blue',
      name: 'Corporate Blue',
      primaryColor: '#1e40af',
      secondaryColor: '#64748b',
      accentColor: '#0ea5e9',
      fontFamily: 'Inter, system-ui, sans-serif',
      borderRadius: '0.375rem'
    }
  },
  {
    id: 'creative-purple',
    name: 'Creative Purple',
    description: 'Vibrant purple theme for creative agencies',
    category: 'creative',
    customization: {
      id: 'creative-purple',
      name: 'Creative Purple',
      primaryColor: '#7c3aed',
      secondaryColor: '#a78bfa',
      accentColor: '#f59e0b',
      fontFamily: '"Poppins", system-ui, sans-serif',
      borderRadius: '0.75rem'
    }
  },
  {
    id: 'tech-green',
    name: 'Tech Green',
    description: 'Modern green theme for technology companies',
    category: 'tech',
    customization: {
      id: 'tech-green',
      name: 'Tech Green',
      primaryColor: '#059669',
      secondaryColor: '#6b7280',
      accentColor: '#10b981',
      fontFamily: '"JetBrains Mono", monospace',
      borderRadius: '0.25rem'
    }
  },
  {
    id: 'retail-orange',
    name: 'Retail Orange',
    description: 'Energetic orange theme for retail brands',
    category: 'retail',
    customization: {
      id: 'retail-orange',
      name: 'Retail Orange',
      primaryColor: '#ea580c',
      secondaryColor: '#78716c',
      accentColor: '#fbbf24',
      fontFamily: '"Montserrat", system-ui, sans-serif',
      borderRadius: '0.5rem'
    }
  },
  {
    id: 'healthcare-teal',
    name: 'Healthcare Teal',
    description: 'Calming teal theme for healthcare organizations',
    category: 'healthcare',
    customization: {
      id: 'healthcare-teal',
      name: 'Healthcare Teal',
      primaryColor: '#0d9488',
      secondaryColor: '#6b7280',
      accentColor: '#14b8a6',
      fontFamily: '"Open Sans", system-ui, sans-serif',
      borderRadius: '0.5rem'
    }
  },
  {
    id: 'education-navy',
    name: 'Education Navy',
    description: 'Trustworthy navy theme for educational institutions',
    category: 'education',
    customization: {
      id: 'education-navy',
      name: 'Education Navy',
      primaryColor: '#1e3a8a',
      secondaryColor: '#64748b',
      accentColor: '#3b82f6',
      fontFamily: '"Lato", system-ui, sans-serif',
      borderRadius: '0.25rem'
    }
  }
];

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Create brand customization builder
 */
export function createBrandBuilder(): BrandCustomizationBuilder {
  return new BrandCustomizationBuilderImpl();
}

/**
 * Get brand presets by category
 */
export function getBrandPresets(category?: string): BrandPreset[] {
  if (!category) {
    return brandPresets;
  }
  return brandPresets.filter(preset => preset.category === category);
}

/**
 * Create brand profile from preset
 */
export function createProfileFromPreset(
  presetId: string, 
  clientName: string, 
  organization?: string
): ClientBrandProfile {
  const preset = brandPresets.find(p => p.id === presetId);
  if (!preset) {
    throw new Error(`Brand preset with ID "${presetId}" not found`);
  }

  const customization: BrandCustomization = {
    ...preset.customization,
    id: clientName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name: clientName
  };

  const profile: ClientBrandProfile = {
    id: customization.id,
    name: clientName,
    customization,
    metadata: {
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      version: '1.0.0',
      notes: `Created from ${preset.name} preset`
    },
    status: 'draft'
  };

  if (organization) {
    profile.organization = organization;
  }

  return profile;
}

// =============================================================================
// GLOBAL INSTANCES
// =============================================================================

/** Global brand customization manager instance */
export const brandManager = new BrandCustomizationManager();
