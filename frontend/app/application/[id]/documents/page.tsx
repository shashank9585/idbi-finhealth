"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DocumentUploader from "@/components/documents/document-uploader";

export default function DocumentsPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/application/${id}`} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Document Processing Center</h1>
          <p className="text-slate-500 text-sm">Upload documents for OCR extraction and AI analysis</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Upload New Document</h3>
        <DocumentUploader applicationId={parseInt(id)} />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Uploaded Documents</h3>
        <div className="text-center py-8 text-slate-500">
          <p>No documents uploaded yet. Use the uploader above to add bank statements, GST returns, or utility bills.</p>
        </div>
      </div>
    </div>
  );
}