"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetQuizzesQuery } from "@/shared/api";

export function Sidebar() {
    const pathname = usePathname();
    const { data: quizzes, isLoading } = useGetQuizzesQuery();

    return (
        <aside className="w-72 bg-white border-r border-slate-200 flex flex-col p-4 flex-shrink-0 overflow-y-auto">
            <Link 
                href="/create"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg mb-6 hover:bg-slate-800 transition-colors"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                New Quiz
            </Link>

            <nav className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">My Quizzes</div>
                
                <Link
                    href="/quizzes"
                    className={`flex items-center justify-between px-3 py-2 rounded-lg group ${
                        pathname === "/quizzes" 
                            ? "bg-indigo-50 text-indigo-700" 
                            : "text-slate-600 hover:bg-slate-50"
                    }`}
                >
                    <span className="text-sm font-medium truncate">All Quizzes Dashboard</span>
                </Link>

                {isLoading ? (
                    <div className="px-3 py-2 text-sm text-slate-400">Loading...</div>
                ) : (
                    quizzes?.map((quiz) => (
                        <Link
                            key={quiz.id}
                            href={`/quizzes/${quiz.id}`}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg group ${
                                pathname === `/quizzes/${quiz.id}`
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                            <span className="text-sm font-medium truncate pr-2">{quiz.title}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                pathname === `/quizzes/${quiz.id}`
                                    ? "bg-indigo-100 text-indigo-600"
                                    : "bg-slate-100 text-slate-500 font-mono"
                            }`}>
                                {quiz.questionCount} {quiz.questionCount === 1 ? 'Q' : 'Qs'}
                            </span>
                        </Link>
                    ))
                )}
            </nav>

            <div className="mt-auto border-t border-slate-100 pt-4">
                <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-xs text-slate-500">QuizFlow</span>
                </div>
            </div>
        </aside>
    );
}
