import React, { useEffect } from 'react';
import { BadgeDollarSign } from 'lucide-react';

export default function AdPlaceholder({ type = 'inline' }) {

  useEffect(() => {
    try {
      // (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  if (type === 'inline') {
    return (
      <div className="bg-gray-100 rounded-xl shadow-md overflow-hidden flex flex-col items-center justify-center h-full p-4 min-h-[268px]">
          <BadgeDollarSign className="w-10 h-10 text-gray-400 mb-2" />
          <p className="text-gray-500 font-semibold">פרסומת</p>
      </div>
    );
  }

  if (type === 'banner') {
    return (
      <div className="w-full h-14 bg-gray-200 flex items-center justify-center text-gray-500">
        <BadgeDollarSign className="w-5 h-5 mr-2" />
        <span className="text-sm font-medium">מקום לפרסומת (באנר)</span>
      </div>
    );
  }

  return null;
}