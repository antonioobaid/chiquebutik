"use client";

import { Suspense } from "react";
import SuccessContent from "./SuccessContent";

export const dynamic = "force-dynamic";

export default function SuccessPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Laddar betalningsinformation...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
