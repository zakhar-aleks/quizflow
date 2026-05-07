"use client";

import { useGetQuizQuery } from "@/shared/api";
import { TakeQuiz } from "@/widgets/TakeQuiz";

export function TakeQuizPage({ params }: { params: { id: string } }) {
    const { data: quiz, isLoading } = useGetQuizQuery(params.id);

    if (isLoading) return <div className="text-slate-500">Loading quiz...</div>;
    if (!quiz) return <div className="text-red-500">Quiz not found.</div>;

    return <TakeQuiz quiz={quiz} />;
}
