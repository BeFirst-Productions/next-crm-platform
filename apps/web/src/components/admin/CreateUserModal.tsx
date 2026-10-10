"use client";

import * as React from "react";
import { CreateUserFormCard } from "@/components/admin/CreateUserFormCard";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateUserModal({ isOpen, onClose, onSuccess }: CreateUserModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-5xl my-auto animate-slide-up">
        <CreateUserFormCard onClose={onClose} onSuccess={onSuccess} isModal={true} />
      </div>
    </div>
  );
}
