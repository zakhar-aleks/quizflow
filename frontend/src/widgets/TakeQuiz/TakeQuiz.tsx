"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QuizDetail, QuestionType } from "@/entities/quiz";
import { ArrowLeft, CheckCircle, XCircle, Trophy } from "lucide-react";
import Link from "next/link";

function normalizeAnswer(val: any): any {
    if (typeof val === "string") return val.trim().toLowerCase();
    return val;
}

function checkAnswer(question: QuizDetail["questions"][number], userAnswer: any): boolean {
    const correct = question.correctAnswer;
    if (correct === null || correct === undefined) return true;

    if (question.type === QuestionType.BOOLEAN) {
        return userAnswer === correct;
    }
    if (question.type === QuestionType.INPUT) {
        return normalizeAnswer(userAnswer) === normalizeAnswer(correct);
    }
    if (question.type === QuestionType.CHECKBOX) {
        const correctArr: string[] = Array.isArray(correct) ? correct : [];
        const userArr: string[] = Array.isArray(userAnswer) ? userAnswer : [];
        return (
            correctArr.length === userArr.length &&
            correctArr.every((c) => userArr.includes(c))
        );
    }
    return false;
}

interface Props {
    quiz: QuizDetail;
}

type Answers = Record<string, any>;
type Phase = "taking" | "results";

export function TakeQuiz({ quiz }: Props) {
    const router = useRouter();
    const [answers, setAnswers] = useState<Answers>({});
    const [phase, setPhase] = useState<Phase>("taking");

    const setAnswer = (questionId: string, value: any) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const toggleCheckbox = (questionId: string, option: string) => {
        setAnswers((prev) => {
            const current: string[] = prev[questionId] ?? [];
            return {
                ...prev,
                [questionId]: current.includes(option)
                    ? current.filter((o) => o !== option)
                    : [...current, option],
            };
        });
    };

    const results = quiz.questions.map((q) => ({
        question: q,
        userAnswer: answers[q.id],
        correct: checkAnswer(q, answers[q.id]),
    }));

    const score = results.filter((r) => r.correct).length;
    const total = quiz.questions.length;
    const pct = Math.round((score / total) * 100);

    if (phase === "results") {
        return (
            <div className="space-y-6">
                <Link href={`/quizzes/${quiz.id}`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Back to Quiz
                </Link>

                <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm text-center">
                    <Trophy size={40} className={`mx-auto mb-4 ${pct >= 70 ? "text-yellow-400" : "text-slate-300"}`} />
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">{pct}%</h1>
                    <p className="text-slate-500 font-medium">{score} of {total} correct</p>
                    <div className="w-full bg-slate-100 rounded-full h-2 mt-6 mb-2">
                        <div
                            className={`h-2 rounded-full transition-all ${pct >= 70 ? "bg-emerald-500" : pct >= 40 ? "bg-yellow-400" : "bg-red-400"}`}
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {results.map((r, i) => (
                        <div key={r.question.id} className={`bg-white border rounded-xl p-5 shadow-sm ${r.correct ? "border-emerald-200" : "border-red-200"}`}>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex-shrink-0">
                                    {r.correct
                                        ? <CheckCircle size={18} className="text-emerald-500" />
                                        : <XCircle size={18} className="text-red-400" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-800 mb-2">{i + 1}. {r.question.label}</p>
                                    <div className="text-sm space-y-1">
                                        <p className="text-slate-500">
                                            Your answer:{" "}
                                            <span className={`font-medium ${r.correct ? "text-emerald-600" : "text-red-500"}`}>
                                                {formatAnswer(r.userAnswer)}
                                            </span>
                                        </p>
                                        {!r.correct && r.question.correctAnswer !== undefined && r.question.correctAnswer !== null && (
                                            <p className="text-slate-500">
                                                Correct: <span className="font-medium text-emerald-600">{formatAnswer(r.question.correctAnswer)}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={() => { setAnswers({}); setPhase("taking"); }}
                        className="px-5 py-2.5 text-sm font-medium border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Retry
                    </button>
                    <button
                        onClick={() => router.push("/quizzes")}
                        className="px-5 py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Back to Quizzes
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Link href={`/quizzes/${quiz.id}`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Back to Quiz
            </Link>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Taking Quiz</p>
                <h1 className="text-2xl font-bold text-slate-900">{quiz.title}</h1>
                <p className="text-sm text-slate-500 mt-1">{total} questions</p>
            </div>

            <div className="space-y-6">
                {quiz.questions.map((q, i) => (
                    <div key={q.id} className="bg-white border border-slate-200 rounded-xl p-6 relative shadow-sm">
                        <div className="absolute -left-3 top-6 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-400">
                            {i + 1}
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-4">{q.label}</h3>

                        {q.type === QuestionType.BOOLEAN && (
                            <div className="flex gap-4">
                                {[true, false].map((val) => (
                                    <label
                                        key={String(val)}
                                        className={`flex items-center gap-2 border rounded-lg px-5 py-2.5 cursor-pointer transition-all ${
                                            answers[q.id] === val
                                                ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
                                                : "border-slate-200 hover:border-slate-300"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name={q.id}
                                            checked={answers[q.id] === val}
                                            onChange={() => setAnswer(q.id, val)}
                                            className="text-indigo-600"
                                        />
                                        <span className="text-sm font-medium text-slate-700">{val ? "True" : "False"}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {q.type === QuestionType.INPUT && (
                            <input
                                type="text"
                                value={answers[q.id] ?? ""}
                                onChange={(e) => setAnswer(q.id, e.target.value)}
                                placeholder="Your answer..."
                                className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none text-sm text-slate-800 transition-colors"
                            />
                        )}

                        {q.type === QuestionType.CHECKBOX && (
                            <div className="space-y-2">
                                {q.options?.map((opt) => {
                                    const checked = (answers[q.id] ?? []).includes(opt);
                                    return (
                                        <label
                                            key={opt}
                                            className={`flex items-center gap-3 border rounded-lg px-4 py-2.5 cursor-pointer transition-all ${
                                                checked
                                                    ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
                                                    : "border-slate-200 hover:border-slate-300"
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => toggleCheckbox(q.id, opt)}
                                                className="text-indigo-600 rounded"
                                            />
                                            <span className="text-sm text-slate-700">{opt}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex justify-end pt-2">
                <button
                    onClick={() => setPhase("results")}
                    className="px-8 py-3 text-sm font-semibold bg-indigo-600 text-white rounded-lg shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-colors"
                >
                    Submit Quiz
                </button>
            </div>
        </div>
    );
}

function formatAnswer(val: any): string {
    if (val === null || val === undefined || val === "") return "—";
    if (typeof val === "boolean") return val ? "True" : "False";
    if (Array.isArray(val)) return val.join(", ") || "—";
    return String(val);
}
