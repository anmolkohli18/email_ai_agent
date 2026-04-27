'use client';

import { Suspense } from 'react';

interface ThreeDViewerProps {
  model: string;
  fallbackImage?: string;
}

export default function ThreeDViewer({ model, fallbackImage }: ThreeDViewerProps) {
  return (
    <div className="relative w-full h-[500px] bg-slate-100 rounded-xl my-6 overflow-hidden flex items-center justify-center">
      <Suspense fallback={<p className="text-slate-600">Loading 3D viewer...</p>}>
        <div className="text-center p-8">
          <p className="text-slate-600 mb-4">
            3D Model: <span className="font-mono text-sm">{model}</span>
          </p>
          <p className="text-sm text-slate-500">
            To view this 3D model, please download it and open in a 3D viewer application.
          </p>
          <a
            href={model}
            download
            className="inline-block mt-4 bg-[#0056D2] hover:bg-[#0039A6] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Download Model
          </a>
          {fallbackImage && (
            <div className="mt-6">
              <img src={fallbackImage} alt="3D model preview" className="max-w-full rounded-lg mx-auto" />
            </div>
          )}
        </div>
      </Suspense>
    </div>
  );
}
