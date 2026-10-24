'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioTitle: string;
  onConfirm: () => Promise<void>;
}

export function DeleteModal({
  isOpen,
  onClose,
  portfolioTitle,
  onConfirm,
}: DeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Portfolio?"
      maxWidth="sm"
    >
      <div className="space-y-4 pt-1">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 text-danger border border-red-100">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">
            Are you sure you want to permanently delete <strong>“{portfolioTitle}”</strong>? This action cannot be undone and will immediately remove both the draft and any published links.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isDeleting}>
            Keep Portfolio
          </Button>
          <Button variant="danger" size="sm" isLoading={isDeleting} onClick={handleDelete}>
            Delete Permanently
          </Button>
        </div>
      </div>
    </Modal>
  );
}
