'use client';

import React from 'react';
import { PortfolioProfile } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploader } from '../ImageUploader';

interface ProfileSectionProps {
  data: PortfolioProfile;
  onChange: (updated: PortfolioProfile) => void;
}

export function ProfileSection({ data, onChange }: ProfileSectionProps) {
  const updateField = <K extends keyof PortfolioProfile>(field: K, value: PortfolioProfile[K]) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-text-primary">Profile Header</h3>
        <p className="text-xs text-text-muted mt-0.5">
          Your primary identity, professional title, headline, and profile picture.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name *"
          value={data.name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="e.g. Alex Chen"
          error={!data.name.trim() ? 'Name is required' : undefined}
        />
        <Input
          label="Professional Role / Title *"
          value={data.role}
          onChange={(e) => updateField('role', e.target.value)}
          placeholder="e.g. Senior Product Designer"
          error={!data.role.trim() ? 'Role is required' : undefined}
        />
      </div>

      <Input
        label="Location"
        value={data.location}
        onChange={(e) => updateField('location', e.target.value)}
        placeholder="e.g. San Francisco, CA (or Remote)"
      />

      <Textarea
        label="Headline"
        value={data.headline}
        onChange={(e) => updateField('headline', e.target.value)}
        placeholder="A concise, high-impact summary of what you build or design."
        rows={2}
        helperText="Displayed prominently in your hero banner."
      />

      <Textarea
        label="Short Bio"
        value={data.bio}
        onChange={(e) => updateField('bio', e.target.value)}
        placeholder="Brief overview of your background, principles, and specialties."
        rows={3}
      />

      <ImageUploader
        label="Avatar / Profile Photo"
        value={data.avatarUrl}
        onChange={(url) => updateField('avatarUrl', url)}
        aspectRatio="avatar"
        helperText="Recommended: 1:1 square photo, at least 400x400px"
      />
    </div>
  );
}
