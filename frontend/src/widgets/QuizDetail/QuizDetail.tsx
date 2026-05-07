"use client";

import { useGetQuizQuery } from "@/shared/api";
import { QuestionType } from "@/entities/quiz";
import Link from "next/link";
import { ArrowLeft, Pencil, Play } from "lucide-react";

export function QuizDetail({ quizId }: { quizId: string }) {
    const { data: quiz, isLoading, error } = useGetQuizQuery(quizId);

    if (isLoading) return <div className="text-slate-500">Loading quiz details...</div>;
    if (error || !quiz) return <div className="text-red-500 font-medium">Failed to load quiz.</div>;

    return (
        <div>
            <Link href="/quizzes" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Back to Quizzes
            </Link>
            
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Quiz Title</label>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">{quiz.title}</h1>
                        <p className="text-xs font-medium text-slate-500">
                            Created on {new Date(quiz.createdAt).toLocaleDateString()} &bull; {quiz.questions.length} Questions
                        </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        <Link
                            href={`/quizzes/${quizId}/edit`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <Pencil size={14} /> Edit
                        </Link>
                        <Link
                            href={`/quizzes/${quizId}/take`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
                        >
                            <Play size={14} /> Take Quiz
                        </Link>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {quiz.questions.map((q, i) => {
                    const typeColor = q.type === QuestionType.BOOLEAN ? "blue" : q.type === QuestionType.CHECKBOX ? "purple" : "emerald";
                    const badgeClass = `px-2 py-1 bg-${typeColor}-50 text-${typeColor}-600 text-[10px] font-bold uppercase rounded tracking-wider`;

                    return (
                        <div key={q.id} className="bg-white border border-slate-200 rounded-xl p-6 relative group shadow-sm">
                            <div className="absolute -left-3 top-6 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-400">
                                {i + 1}
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <span className={badgeClass}>{q.type}</span>
                            </div>
                            
                            <h3 className="w-full font-bold text-slate-900 mb-4">{q.label}</h3>
                            
                            {q.type === QuestionType.BOOLEAN && (
                                <div className="flex gap-4">
                                    <label className={`flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-2 bg-slate-50 ${q.correctAnswer === true ? "ring-2 ring-indigo-500 bg-white" : "opacity-70"}`}>
                                        <input type="radio" disabled checked={q.correctAnswer === true} className="text-indigo-600" /> 
                                        <span className="text-sm text-slate-600">True</span>
                                    </label>
                                    <label className={`flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-2 bg-slate-50 ${q.correctAnswer === false ? "ring-2 ring-indigo-500 bg-white" : "opacity-70"}`}>
                                        <input type="radio" disabled checked={q.correctAnswer === false} className="text-indigo-600" /> 
                                        <span className="text-sm text-slate-600">False</span>
                                    </label>
                                </div>
                            )}

                            {q.type === QuestionType.INPUT && (
                                <div>
                                    <input 
                                        type="text" 
                                        disabled 
                                        value={q.correctAnswer || ""}
                                        className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 text-sm text-slate-800 font-medium cursor-not-allowed"
                                    />
                                </div>
                            )}

                            {q.type === QuestionType.CHECKBOX && (
                                <div className="space-y-2">
                                    {q.options?.map((opt, idx) => {
                                        const isCorrect = Array.isArray(q.correctAnswer) && q.correctAnswer.includes(opt);
                                        return (
                                            <div key={idx} className="flex items-center gap-3">
                                                <input 
                                                    type="checkbox" 
                                                    disabled 
                                                    checked={isCorrect}
                                                    className="rounded text-indigo-600 opacity-70 cursor-not-allowed" 
                                                /> 
                                                <input 
                                                    type="text"
                                                    value={opt}
                                                    disabled
                                                    className={`text-sm bg-slate-50 border border-transparent rounded px-3 py-2 flex-1 outline-none ${isCorrect ? "text-slate-900 font-medium border-indigo-200 bg-indigo-50/50" : "text-slate-600"}`}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
