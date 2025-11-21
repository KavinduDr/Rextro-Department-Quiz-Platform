'use client';

import React from 'react'
import { useRouter } from 'next/navigation'

const departmentList = [
  {
    name: "Electrical and Information Engineering",
    color: "bg-gradient-to-r from-[#df7500] to-[#651321]",
    text: "text-white"
  },
  {
    name: "Mechanical Engineering",
    color: "bg-gradient-to-r from-[#651321] to-[#df7500]",
    text: "text-white"
  },
  {
    name: "Civil and Environmental Engineering",
    color: "bg-gradient-to-r from-[#df7500] to-[#651321]",
    text: "text-white"
  }
]

export default function DepartmentsPage() {
  const router = useRouter();

  const handlePick = (dept: string) => {
    router.push(`/quiz?department=${encodeURIComponent(dept)}`);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-[#fff7ed] to-[#ffe4e1] relative"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* White background container for image */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#FED9DF',
          zIndex: 0,
        }}
      />
      {/* Background image nested inside white background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none',
          backgroundImage: 'url("/Container.png")',
          backgroundSize: 'auto',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top',
          backgroundAttachment: 'scroll',
        }}
      />
      {/* Semi-transparent overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(255,255,255,0.6)',
          zIndex: 1
        }}
      />
      <div className="w-full max-w-md mx-auto" style={{ position: 'relative', zIndex: 2 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-[#651321] mb-6 text-center">Pick Your Department</h1>
        <div className="flex flex-col gap-5">
          {departmentList.map((dept) => (
            <button
              key={dept.name}
              onClick={() => handlePick(dept.name)}
              className={`w-full py-4 rounded-xl shadow-lg font-semibold text-lg ${dept.color} ${dept.text} transition-all duration-200 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-[#df7500]`}
            >
              {dept.name}
            </button>
          ))}
        </div>
        <button
          onClick={() => router.push('/')}
          className="mt-8 w-full py-3 rounded-xl bg-white text-[#651321] font-medium shadow hover:bg-[#df7500]/10 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}