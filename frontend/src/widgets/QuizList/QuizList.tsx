"use client";

import { useGetQuizzesQuery, useDeleteQuizMutation } from "@/shared/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/shared/lib";
import { setDeleting } from "@/features/deleteQuiz";
import Link from "next/link";
import { Trash2, Play } from "lucide-react";

export function QuizList() {
    const { data: quizzes, isLoading } = useGetQuizzesQuery();
    const [deleteQuiz] = useDeleteQuizMutation();
    const dispatch = useDispatch();
    const isDeleting = useSelector((state: RootState) => state.deleteQuiz.isDeleting);

    if (isLoading) return <div className="text-slate-500">Loading quizzes...</div>;
    if (!quizzes?.length) return (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-xl shadow-sm text-center">
            <h3 className="text-lg font-bold text-slate-800 mb-2">No quizzes found</h3>
            <p className="text-slate-500 mb-6 font-medium">You haven't created any quizzes yet.</p>
            <Link href="/create" className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-colors">
                Create First Quiz
            </Link>
        </div>
    );

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
                <Link key={quiz.id} href={`/quizzes/${quiz.id}`} className="block group">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-200 transition-all relative h-full flex flex-col justify-between">
                        <div>
                            <button
                                onClick={(e) => handleDelete(e, quiz.id)}
                                disabled={isDeleting[quiz.id]}
                                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors z-10 disabled:opacity-50"
                            >
                                <Trash2 size={16} />
                            </button>
                            <h3 className="text-lg font-bold text-slate-900 mb-2 pr-8 leading-tight">
                                {quiz.title}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase rounded tracking-wider">
                                    {quiz.questionCount} {quiz.questionCount === 1 ? "Question" : "Questions"}
                                </span>
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-medium">
                                Created {new Date(quiz.createdAt).toLocaleDateString()}
                            </span>
                            <Link
                                href={`/quizzes/${quiz.id}/take`}
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                            >
                                <Play size={12} /> Take Quiz
                            </Link>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );

    async function handleDelete(e: React.MouseEvent, id: string) {
        e.preventDefault();
        dispatch(setDeleting({ id, status: true }));
        try {
            await deleteQuiz(id).unwrap();
        } finally {
            dispatch(setDeleting({ id, status: false }));
        }
    }
}
