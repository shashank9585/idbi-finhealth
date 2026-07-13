import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
      <Loader2 className="w-12 h-12 animate-spin text-[#003366]" />
      <p className="mt-4 text-slate-500 font-medium">Loading application data...</p>
    </div>
  );
}