import React from 'react';

export default function PageLayout({ children, inspector }) {
  return (
    <div className="flex h-full w-full">
       <div className="flex-1 p-6 overflow-y-auto">
         {children}
       </div>
       <div className="w-[320px] border-l border-white/10 bg-[#141416] flex flex-col shrink-0 overflow-y-auto">
         {inspector}
       </div>
    </div>
  );
}
