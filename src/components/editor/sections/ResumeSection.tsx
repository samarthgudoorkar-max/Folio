'use client';

import React, { useRef, useState } from 'react';
import { PortfolioResume } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Trash2, Loader2, ExternalLink } from 'lucide-react';

interface ResumeSectionProps {
  data: PortfolioResume;
  onChange: (updated: PortfolioResume) => void;
}

export function ResumeSection({ data, onChange }: ResumeSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (file.type !== 'application/pdf') {
      setError('Resume must be a PDF document.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('PDF size exceeds 5MB limit.');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const uploadData = await res.json();
      onChange({
        url: uploadData.url,
        filename: file.name,
        lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      });
    } catch {
      // Fallback data url
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        onChange({
          url: uploadEvent.target?.result as string,
          filename: file.name,
          lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        });
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange({
      url: '',
      filename: '',
      lastUpdated: '',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-text-primary">Resume / Curriculum Vitae</h3>
        <p className="text-xs text-text-muted mt-0.5">
          Allow recruiters and clients to download or view your verified CV.
        </p>
      </div>

      {data.url ? (
        <div className="p-4 rounded-xl border border-border bg-slate-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-lg bg-red-50 text-red-600 border border-red-100">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">
                {data.filename || 'Resume.pdf'}
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                {data.lastUpdated ? `Updated ${data.lastUpdated}` : 'Active document'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-slate-200/50 transition-colors"
              title="Preview document"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 rounded-lg text-danger hover:bg-red-50 transition-colors"
              title="Remove resume"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-border-strong rounded-xl p-6 text-center hover:border-primary hover:bg-slate-50 transition-colors flex flex-col items-center justify-center gap-2"
        >
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          ) : (
            <div className="p-3 rounded-full bg-slate-100 text-slate-500">
              <Upload className="w-5 h-5" />
            </div>
          )}
          <div>
            <span className="text-xs font-semibold text-primary hover:underline">
              {isUploading ? 'Uploading PDF...' : 'Upload PDF Resume'}
            </span>
            <p className="text-[11px] text-text-muted mt-1">PDF format up to 5MB</p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileUpload}
      />

      {error && <p className="text-xs text-danger font-medium">{error}</p>}

      <div className="pt-2">
        <Input
          label="Or provide external Resume URL (Google Drive, Dropbox, etc.)"
          value={data.url && !data.url.startsWith('/uploads/') && !data.url.startsWith('data:') ? data.url : ''}
          onChange={(e) => {
            const val = e.target.value;
            onChange({
              url: val,
              filename: val ? 'External_Resume.pdf' : '',
              lastUpdated: val ? 'Current' : '',
            });
          }}
          placeholder="https://drive.google.com/..."
        />
      </div>
    </div>
  );
}
