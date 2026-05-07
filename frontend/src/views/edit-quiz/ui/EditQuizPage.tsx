"use client";

import { useGetQuizQuery } from "@/shared/api";
import { QuizForm } from "@/widgets/QuizForm";

export function EditQuizPage({ params }: { params: { id: string } }) {
    const { data: quiz, isLoading } = useGetQuizQuery(params.id);

    if (isLoading) return <div className="text-slate-500">Loading...</div>;
    if (!quiz) return <div className="text-red-500">Quiz not found.</div>;

    return (
        <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Editing Quiz</h2>
            <QuizForm existingQuiz={quiz} />
        </div>
    );
}
