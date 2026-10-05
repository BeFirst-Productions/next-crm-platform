"use client";

import * as React from "react";
import { X, UploadCloud, FileSpreadsheet, Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ImportLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete?: (count: number) => void;
}

export function ImportLeadsModal({ isOpen, onClose, onImportComplete }: ImportLeadsModalProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadSuccess, setUploadSuccess] = React.useState(false);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleStartImport = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    // Simulate upload / processing
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => {
        onImportComplete?.(15);
        onClose();
        setSelectedFile(null);
        setUploadSuccess(false);
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in select-none">
      <div className="bg-[#0b1426] border border-[#1b2b4b] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#162544] flex items-center justify-between bg-[#080f1e]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Import Leads</h3>
              <p className="text-[11px] text-slate-400">Upload bulk lead data using CSV or XLSX</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#14233e] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Download Template Bar */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0e1a32] border border-[#1b2f56]">
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-xs font-medium text-slate-200">Download CSV Template</p>
                <p className="text-[10px] text-slate-400">Standard columns for lead import</p>
              </div>
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                const headers = "Lead ID,Company,Contact Person,Phone,Email,Source,Assigned Staff,Status,Priority\nLD-1001,Demo Tech LLC,John Doe,+971501234567,john@demotech.ae,Website,Rahul Sharma,Interested,High";
                const blob = new Blob([headers], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "lead_import_template.csv";
                a.click();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Template
            </a>
          </div>

          {/* Upload Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              dragActive
                ? "border-blue-500 bg-blue-500/10"
                : selectedFile
                ? "border-emerald-500/60 bg-emerald-500/5"
                : "border-[#1e335a] hover:border-slate-500 bg-[#081020]"
            }`}
            onClick={() => document.getElementById("lead-csv-upload-input")?.click()}
          >
            <input
              id="lead-csv-upload-input"
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              className="hidden"
              onChange={handleFileChange}
            />

            {selectedFile ? (
              <div className="flex flex-col items-center gap-2">
                <FileSpreadsheet className="w-10 h-10 text-emerald-400" />
                <p className="text-xs font-semibold text-slate-100">{selectedFile.name}</p>
                <p className="text-[11px] text-slate-400">
                  {(selectedFile.size / 1024).toFixed(1)} KB • Ready to import
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="text-[11px] text-rose-400 hover:underline mt-1"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#111e38] flex items-center justify-center text-blue-400 mb-1">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-slate-200">
                  Click to browse or drag and drop file here
                </p>
                <p className="text-[11px] text-slate-400">
                  Supported formats: CSV, XLS, XLSX (Max 10MB)
                </p>
              </div>
            )}
          </div>

          {uploadSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Import successful! Leads updated in system.</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#162544] bg-[#080f1e] flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs border-[#1b2b4b] text-slate-300 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            disabled={!selectedFile || isUploading}
            onClick={handleStartImport}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4"
          >
            {isUploading ? "Importing..." : "Start Import"}
          </Button>
        </div>
      </div>
    </div>
  );
}
