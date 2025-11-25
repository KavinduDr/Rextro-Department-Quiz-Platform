"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Trophy, Star, Menu, ChevronDown, X } from 'lucide-react';
import { createStudentApi } from '@/interceptors/student';
import { useUser } from '@/contexts/UserContext';
import { transformLeaderboard, transformApiLeaderboard } from './leaderboardTransformer';

interface StudentData {
  id: number;
  name: string;
  score: number;
  attempts?: number;
  totalTimeTaken?: number;
  completionTime?: string | null;
  studentId?: string | null;
  studentRef?: string | null;
  totalQuestions?: number;
  correctPercentage?: number;
}

interface SchoolData {
  id: number;
  name: string;
  score: number;
  rank: number;
  students: StudentData[];
}

const Leaderboard: React.FC = () => {
  const [selectedSchool, setSelectedSchool] = useState<SchoolData | null>(null);
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const user = useUser();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const quizId = searchParams?.get('quizId') || '1';
        const limit = searchParams?.get('limit') || '20';
        const url = `http://localhost:5000/api/leaderboard?quizId=${encodeURIComponent(
          quizId
        )}&limit=${encodeURIComponent(limit)}`;

        const res = await fetch(url, { method: 'GET' });
        if (!res.ok) throw new Error(`Leaderboard fetch failed: ${res.status}`);
        const json = await res.json();

        const transformed = transformApiLeaderboard(json);
        setSchools(transformed);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };

    fetchLeaderboard();
  }, [searchParams]);


  const getRankBadgeStyle = (rank: number): string => {
    if (rank <= 3) {
      return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg transform scale-110';
    }
    return 'bg-gray-100 text-gray-600';
  };

  
  React.useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    if (selectedSchool) {
      
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [selectedSchool]);

  return (
    <div
      className="min-h-screen bg-gradient-to-br p-4 relative"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
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
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(255,255,255,0.6)',
        zIndex: 1
      }} />
      <div className="max-w-4xl mx-auto" style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div className=" mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#651321' }}>
            Leaderboard
          </h1>
          <p className="text-gray-600">Quiz Rankings</p>
        </div>



        {/* Top 3 Podium */}
        <div className="flex justify-center items-end mb-12 space-x-6">
          {/* Second Place */}
          <div className="text-center bg-white p-8 shadow-lg flex flex-col items-center justify-center w-44 md:w-56" style={{ borderRadius: '50px' }}>
            <div className="relative flex items-center justify-center">
              <img
                src="/Rank_2.png"
                alt="Second Place"
                className="w-20 md:w-24 h-auto block mx-auto"
              />
            </div>
            <h3
              title={schools[1]?.name}
              className="font-semibold text-sm md:text-base text-center text-gray-800 mb-2 max-w-[10rem] md:max-w-[16rem] whitespace-normal break-words leading-tight"
            >
              {schools[1]?.name}
            </h3>
            <h3
              title={String(schools[1]?.score ?? '')}
              className="font-semibold text-sm md:text-base text-center text-gray-800 mb-1 max-w-[10rem] md:max-w-[16rem] whitespace-normal break-words leading-tight"
            >
              {(() => {
                const school = schools[1] as any;
                const top = school?.students?.[0] as any;
                const percent = top?.correctPercentage ?? school?.correctPercentage ?? (typeof school?.score === 'number' ? school.score : null);
                if (percent != null && !Number.isNaN(Number(percent))) {
                  const val = Number(percent);
                  const formatted = Number.isInteger(val) ? String(val) : val.toFixed(2).replace(/\.00$/, '');
                  return `${formatted}%`;
                }
                return school?.score ?? '-';
              })()}
            </h3>
            <div className="text-sm text-gray-500">
              {(() => {
                const top = (schools[1] as any)?.students?.[0] as any;
                return typeof top?.totalTimeTaken === 'number' ? `${(top.totalTimeTaken / 1000).toFixed(2)}s` : '-';
              })()}
            </div>
          </div>

          {/* First Place */}
          <div className="text-center mb-10 p-10 bg-white shadow-xl flex flex-col items-center justify-center w-56 md:w-72" style={{ borderRadius: '50px' }}>
            <div className="relative flex items-center justify-center">
              <img
                src="/Rank_1.png"
                alt="First Place"
                className="w-24 md:w-32 h-auto block mx-auto"
              />
            </div>
            <h3
              title={schools[0]?.name}
              className="font-semibold text-base md:text-lg text-center text-gray-800 mb-2 max-w-[12rem] md:max-w-[20rem] whitespace-normal break-words leading-tight"
            >
              {schools[0]?.name}
            </h3>
            <h3
              title={String(schools[0]?.score ?? '')}
              className="font-semibold text-base md:text-lg text-center text-gray-800 mb-1 max-w-[12rem] md:max-w-[20rem] whitespace-normal break-words leading-tight"
            >
              {(() => {
                const school = schools[0] as any;
                const top = school?.students?.[0] as any;
                const percent = top?.correctPercentage ?? school?.correctPercentage ?? (typeof school?.score === 'number' ? school.score : null);
                if (percent != null && !Number.isNaN(Number(percent))) {
                  const val = Number(percent);
                  const formatted = Number.isInteger(val) ? String(val) : val.toFixed(2).replace(/\.00$/, '');
                  return `${formatted}%`;
                }
                return school?.score ?? '-';
              })()}
            </h3>
            <div className="text-sm text-gray-500">
              {(() => {
                const top = (schools[0] as any)?.students?.[0] as any;
                return typeof top?.totalTimeTaken === 'number' ? `${(top.totalTimeTaken / 1000).toFixed(2)}s` : '-';
              })()}
            </div>
          </div>

          {/* Third Place */}
          <div className="text-center bg-white p-8 shadow-lg flex flex-col items-center justify-center w-44 md:w-56" style={{ borderRadius: '50px' }}>
            <div className="relative flex items-center justify-center">
              <img
                src="/Rank_3.png"
                alt="First Place"
                className="w-20 md:w-24 h-auto block mx-auto"
              />
            </div>
            <h3
              title={schools[2]?.name}
              className="font-semibold text-sm md:text-base text-center text-gray-800 mb-2 max-w-[10rem] md:max-w-[16rem] whitespace-normal break-words leading-tight"
            >
              {schools[2]?.name}
            </h3>
            <h3
              title={String(schools[2]?.score ?? '')}
              className="font-semibold text-sm md:text-base text-center text-gray-800 mb-1 max-w-[10rem] md:max-w-[16rem] whitespace-normal break-words leading-tight"
            >
              {(() => {
                const school = schools[2] as any;
                const top = school?.students?.[0] as any;
                const percent = top?.correctPercentage ?? school?.correctPercentage ?? (typeof school?.score === 'number' ? school.score : null);
                if (percent != null && !Number.isNaN(Number(percent))) {
                  const val = Number(percent);
                  const formatted = Number.isInteger(val) ? String(val) : val.toFixed(2).replace(/\.00$/, '');
                  return `${formatted}%`;
                }
                return school?.score ?? '-';
              })()}
            </h3>
            <div className="text-sm text-gray-500">
              {(() => {
                const top = (schools[2] as any)?.students?.[0] as any;
                return typeof top?.totalTimeTaken === 'number' ? `${(top.totalTimeTaken / 1000).toFixed(2)}s` : '-';
              })()}
            </div>
          </div>
        </div>

        {/* Full Rankings Table */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 border-b flex justify-center items-center" style={{ backgroundColor: '#651321' }}>
            <h2 className="text-xl font-bold text-white">Ranks</h2>
          </div>

          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {schools.map((school, index) => (
              <div
                key={school.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200 group cursor-pointer"
                onClick={() => setSelectedSchool(school)}
              >
                <div className="flex items-center space-x-4">
                  {/* Rank Badge */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm${school.rank <= 3 ? '' : ' ' + getRankBadgeStyle(school.rank)}`}>
                    {school.rank === 1 ? (
                      <img src="/Rank_1.png" alt="1st Place" className="w-8 h-8 object-contain" />
                    ) : school.rank === 2 ? (
                      <img src="/Rank_2.png" alt="2nd Place" className="w-8 h-8 object-contain" />
                    ) : school.rank === 3 ? (
                      <img src="/Rank_3.png" alt="3rd Place" className="w-8 h-8 object-contain" />
                    ) : (
                      school.rank
                    )}
                  </div>

                  {/* School Name */}
                  <div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                      {school.name}
                    </h3>
                    {school.students && school.students.length > 0 && (
                      <div className="text-sm text-gray-500 mt-1">
                        {(() => {
                          const top = school.students[0] as any;
                          const attempts = top?.attempts != null ? String(top.attempts) : '-';
                          return `Attempts: ${attempts}`;
                        })()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Score */}
                  <div className="text-right">
                    <span className="text-2xl font-bold" style={{ color: '#df7500' }}>
                      {school.score}
                    </span>
                    {school.students && school.students.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {(() => {
                          const top = school.students[0] as any;
                          return typeof top?.totalTimeTaken === 'number' ? `${(top.totalTimeTaken / 1000).toFixed(2)}s` : '-';
                        })()}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Details Modal */}
        {selectedSchool && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" />

            <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 z-10">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b" >
                <h3 className="font-bold text-lg" style={{ color: '#651321' }}>
                  {selectedSchool.name}
                </h3>
                <button
                  onClick={() => setSelectedSchool(null)}
                  className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors"
                >
                  <X size={20} style={{ color: '#651321' }} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-4" >
                <div className="flex items-center gap-6">
                  <div>
                    <div>
                      {selectedSchool.rank === 1 ? (
                        <img src="/Rank_1.png" alt="1st Place" className="w-25 h-25 object-contain" />
                      ) : selectedSchool.rank === 2 ? (
                        <img src="/Rank_2.png" alt="2nd Place" className="w-25 h-25 object-contain" />
                      ) : selectedSchool.rank === 3 ? (
                        <img src="/Rank_3.png" alt="3rd Place" className="w-25 h-25 object-contain" />
                      ) : (
                        <Trophy size={60} color="#DF7500" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    {selectedSchool.students.map((student) => (
                      <div key={student.id} className="flex items-center justify-between py-2 px-3 bg-white bg-opacity-70 rounded-lg">
                        <div>
                          <div className="text-sm text-gray-500">
                            {student.studentId ? `ID: ${student.studentId}` : null}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.attempts ? ` Attempts: ${student.attempts}` : null}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.completionTime ? `Last Attempt at: ` : null}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.completionTime ? `${new Date(student.completionTime).toLocaleString()}` : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* School Total */}
                <div className="mt-4 pt-4 border-t border-orange-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg" style={{ color: '#651321' }}>
                     Total:
                    </span>

                    <div className="text-right">
                      <div className="font-bold text-2xl" style={{ color: '#df7500' }}>
                        {selectedSchool.score}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {(() => {
                          const totalMs = selectedSchool.students.reduce((acc, s) => acc + (typeof s.totalTimeTaken === 'number' ? s.totalTimeTaken : 0), 0);
                          return totalMs > 0 ? `${(totalMs / 1000).toFixed(2)}s` : '-';
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;