'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  aspectRatio?: 'square' | 'wide' | 'avatar';
}

export function ImageUploader({
  value,
  onChange,
  label,
  helperText = 'PNG, JPG, WebP up to 5MB',
  aspectRatio = 'square',
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB. Please choose a smaller image.');
      return;
    }

    // Validate type
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'].includes(file.type)) {
      setError('Please upload a valid image (PNG, JPG, WebP, SVG).');
      return;
    }

    setIsUploading(true);

    try {
      const { uploadFileClient } = await import('@/lib/data-service');
      const data = await uploadFileClient(file);
      onChange(data.url);
    } catch (err: any) {
      setError(err.message || 'Failed to process image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-border bg-slate-50">
          <img
            src={value}
            alt="Uploaded preview"
            className={`w-full object-cover ${
              aspectRatio === 'avatar'
                ? 'h-28 w-28 rounded-full mx-auto my-2'
                : aspectRatio === 'wide'
                ? 'h-36'
                : 'h-40'
            }`}
          />
          <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Change
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-border-strong rounded-xl p-4 text-center hover:border-primary hover:bg-slate-50 transition-colors flex flex-col items-center justify-center gap-2"
        >
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          ) : (
            <div className="p-2.5 rounded-full bg-slate-100 text-slate-500">
              <Upload className="w-5 h-5" />
            </div>
          )}
          <div>
            <span className="text-xs font-medium text-primary hover:underline">
              {isUploading ? 'Uploading image...' : 'Click to upload image'}
            </span>
            <p className="text-[11px] text-text-muted mt-0.5">{helperText}</p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && <p className="text-xs text-danger font-medium">{error}</p>}
    </div>
  );
}
