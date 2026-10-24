'use client';

import React from 'react';
import { PortfolioContact } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ContactSectionProps {
  data: PortfolioContact;
  onChange: (updated: PortfolioContact) => void;
}

export function ContactSection({ data, onChange }: ContactSectionProps) {
  const updateField = <K extends keyof PortfolioContact>(field: K, value: PortfolioContact[K]) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-text-primary">Contact Details</h3>
        <p className="text-xs text-text-muted mt-0.5">
          Provide direct contact methods. Folio creates a verified direct mailto: link for incoming inquiries.
        </p>
      </div>

      <Input
        label="Direct Inquiries Email *"
        type="email"
        value={data.email}
        onChange={(e) => updateField('email', e.target.value)}
        placeholder="your.email@domain.com"
        error={!data.email.trim() ? 'Email is required for direct inquiries' : undefined}
        helperText="Visitors clicking this link will open their default email app."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Phone Number (Optional)"
          value={data.phone || ''}
          onChange={(e) => updateField('phone', e.target.value)}
          placeholder="+1 (555) 000-0000"
        />
        <Input
          label="Scheduling Link (e.g. Cal.com, Calendly)"
          value={data.bookingUrl || ''}
          onChange={(e) => updateField('bookingUrl', e.target.value)}
          placeholder="https://cal.com/your-name"
        />
      </div>

      <Textarea
        label="Inquiry Note / Response Timeline"
        value={data.note || ''}
        onChange={(e) => updateField('note', e.target.value)}
        placeholder="e.g. I respond to all inquiries within 24 hours. Please include project timeline and scope."
        rows={3}
      />
    </div>
  );
}
