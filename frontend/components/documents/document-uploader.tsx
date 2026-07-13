"use client";

import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api-client";

interface DocumentUploaderProps {
  applicationId: number;
  onUploadComplete?: () => void;
}

export default function DocumentUploader({ applicationId, onUploadComplete }: DocumentUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const docType = determineDocType(file.name);
      const result = await api.uploadDocument(applicationId, file, docType);
      setUploadedDoc(result);
      onUploadComplete?.();
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const determineDocType = (filename: string): string => {
    const lower = filename.toLowerCase();
    if (lower.includes("bank") || lower.includes("statement")) return "bank_statement";
    if (lower.includes("gst") || lower.includes("tax")) return "gst_return";
    if (lower.includes("utility") || lower.includes("electricity")) return "utility_bill";
    return "other";
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#003366] hover:bg-slate-50 transition-all"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-12 h-12 text-[#003366] animate-spin" />
            <div>
              <p className="font-medium text-slate-900">Processing Document...</p>
              <p className="text-sm text-slate-500 mt-1">Running OCR extraction & AI analysis</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="w-12 h-12 text-slate-400" />
            <div>
              <p className="font-medium text-slate-900">Click to upload document</p>
              <p className="text-sm text-slate-500 mt-1">PDF, JPG, or PNG (Bank statements, GST returns, Utility bills)</p>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Upload Result */}
      {uploadedDoc && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-900">{uploadedDoc.filename}</p>
              <p className="text-xs text-slate-500">
                {(uploadedDoc.file_size / 1024).toFixed(1)} KB • {uploadedDoc.file_type.replace('_', ' ')}
              </p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              {uploadedDoc.status}
            </span>
          </div>

          {/* Extracted Text */}
          {uploadedDoc.extracted_text && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" /> OCR Extracted Text
              </h4>
              <pre className="bg-slate-50 p-3 rounded-lg text-xs text-slate-700 whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">
                {uploadedDoc.extracted_text}
              </pre>
            </div>
          )}

          {/* AI Analysis */}
          {uploadedDoc.ai_analysis && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">AI Analysis Results</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium">Validation Status</p>
                  <p className="text-sm font-bold text-blue-900 capitalize">
                    {uploadedDoc.ai_analysis.validation_status}
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-xs text-purple-600 font-medium">AI Confidence</p>
                  <p className="text-sm font-bold text-purple-900">
                    {uploadedDoc.ai_analysis.confidence_score}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}