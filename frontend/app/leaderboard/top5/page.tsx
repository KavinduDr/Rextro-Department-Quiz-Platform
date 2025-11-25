"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface LeaderItem {
  studentId: string | number;
  name: string | null;
  correctCount: number;
  correctPercentage?: number;
  completionTime?: string | number;
  totalTimeTaken?: number;
  attempts?: number;
}

interface QuizSet {
  quizId: number;
  name: string;
}

const Top5PerQuiz: React.FC = () => {
  const [quizzes, setQuizzes] = useState<QuizSet[]>([]);
  const [data, setData] = useState<Record<number, LeaderItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const safeFetchJson = async (url: string) => {
          const res = await fetch(url);
          const contentType = res.headers.get('content-type') || '';
          const text = await res.text();

          if (!res.ok) {
            
            const preview = text?.slice(0, 500);
            throw new Error(`Request to ${url} failed: ${res.status} ${res.statusText} - ${preview}`);
          }

          if (!contentType.includes('application/json')) {
            const preview = text?.slice(0, 500);
            throw new Error(`Expected JSON from ${url} but received content-type: ${contentType} - body preview: ${preview}`);
          }

          try {
            return JSON.parse(text);
          } catch (e: any) {
            throw new Error(`Invalid JSON from ${url}: ${e?.message}`);
          }
        };

        
        const qsJson = await safeFetchJson('http://localhost:5000/api/quizzes/get-quiz-sets');
        const sets: QuizSet[] = Array.isArray(qsJson.data) ? qsJson.data : [];
        setQuizzes(sets);

        
        const requests = sets.map((s) =>
          safeFetchJson(`http://localhost:5000/api/leaderboard?quizId=${s.quizId}&limit=5`).then((j) => ({ id: s.quizId, items: Array.isArray(j.data) ? j.data : [] }))
        );

        const results = await Promise.all(requests);
        const map: Record<number, LeaderItem[]> = {};
        results.forEach((r) => {
          map[r.id] = r.items as LeaderItem[];
        });
        setData(map);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || 'Failed to load leaderboards');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) return <div className="p-6">Loading top-5 leaderboards…</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  const formatPercent = (p?: number) => {
    if (p == null) return '-';
    let s = Number(p).toFixed(2);
    s = s.replace(/\.?0+$/, '');
    return `${s}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff7ed] to-[#ffe4e1] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold" style={{ color: '#651321' }}>Leaderboard</h1>
          <p className="text-gray-600">Top 1–5 ranks for each department.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Link
              key={quiz.quizId}
              href={`/leaderboard/departmentLeaderboard?quizId=${quiz.quizId}`}
              className="block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              aria-label={`View leaderboard details for ${quiz.name ?? `Quiz ${quiz.quizId}`}`}
            >
              <div className="p-4 border-b" style={{ backgroundColor: '#651321' }}>
                <h2 className="text-lg font-semibold text-white">{quiz.name ?? `Quiz ${quiz.quizId}`}</h2>
              </div>

              <div className="p-4">
                {(!data[quiz.quizId] || data[quiz.quizId].length === 0) && (
                  <div className="text-sm text-gray-500">No participants yet</div>
                )}

                <div className="space-y-3">
                  {data[quiz.quizId]?.map((item, idx) => (
                    <div key={String(item.studentId) + idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-sm">
                          {idx === 0 ? (
                            <img src="/Rank_1.png" alt="1st" className="w-8 h-8" />
                          ) : idx === 1 ? (
                            <img src="/Rank_2.png" alt="2nd" className="w-8 h-8" />
                          ) : idx === 2 ? (
                            <img src="/Rank_3.png" alt="3rd" className="w-8 h-8" />
                          ) : (
                            <span className="font-bold text-sm text-gray-700">#{idx + 1}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 leading-tight max-w-[12rem] truncate">{item.name ?? String(item.studentId)}</div>
                          {/* <div className="text-xs text-gray-500">Correct : {item.correctCount ?? '-'}</div> */}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-l font-bold" style={{ color: '#df7500' }}>
                          {item.correctPercentage != null ? formatPercent(item.correctPercentage) : (item.correctCount != null ? String(item.correctCount) : '-')}
                        </div>
                        {/* <div className="text-xs text-gray-500">time: {item.totalTimeTaken ?? '-'}</div> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Top5PerQuiz;
