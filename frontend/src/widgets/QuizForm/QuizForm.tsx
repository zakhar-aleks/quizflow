"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createQuizSchema, CreateQuizSchemaType } from "@/features/createQuiz";
import { QuestionType, QuizDetail } from "@/entities/quiz";
import { useRouter } from "next/navigation";
import { useCreateQuizMutation, useUpdateQuizMutation } from "@/shared/api";
import { BooleanQuestion } from "./BooleanQuestion";
import { InputQuestion } from "./InputQuestion";
import { CheckboxQuestion } from "./CheckboxQuestion";

interface QuizFormProps {
    existingQuiz?: QuizDetail;
}

export function QuizForm({ existingQuiz }: QuizFormProps) {
    const router = useRouter();
    const [createQuiz, { isLoading: isCreating }] = useCreateQuizMutation();
    const [updateQuiz, { isLoading: isUpdating }] = useUpdateQuizMutation();
    const isLoading = isCreating || isUpdating;

    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<CreateQuizSchemaType>({
        resolver: zodResolver(createQuizSchema),
        defaultValues: existingQuiz
            ? {
                  title: existingQuiz.title,
                  questions: existingQuiz.questions.map((q) => ({
                      type: q.type,
                      label: q.label,
                      options: q.options ?? [],
                      correctAnswer: q.correctAnswer,
                  })),
              }
            : {
                  title: "",
                  questions: [{ type: QuestionType.INPUT, label: "", options: [] }],
              },
    });

    const { fields, append, remove } = useFieldArray({ control, name: "questions" });

    const onSubmit = async (data: CreateQuizSchemaType) => {
        try {
            if (existingQuiz) {
                await updateQuiz({ id: existingQuiz.id, data }).unwrap();
                router.push(`/quizzes/${existingQuiz.id}`);
            } else {
                await createQuiz(data).unwrap();
                router.push("/quizzes");
            }
        } catch (error) {
            console.error("Failed to save quiz", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Quiz Title</label>
                <input
                    {...register("title")}
                    className="text-2xl font-bold w-full focus:outline-none focus:border-indigo-500 border-b border-transparent pb-1"
                    placeholder="Enter quiz title"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div className="space-y-6">
                {fields.map((field, index) => {
                    const questionType = watch(`questions.${index}.type`);
                    const typeColor = questionType === QuestionType.BOOLEAN ? "blue" : questionType === QuestionType.CHECKBOX ? "purple" : "emerald";
                    const badgeClass = `px-2 py-1 bg-${typeColor}-50 text-${typeColor}-600 text-[10px] font-bold uppercase rounded tracking-wider`;

                    return (
                        <div key={field.id} className="bg-white border border-slate-200 rounded-xl p-6 relative group shadow-sm">
                            <div className="absolute -left-3 top-6 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-400">
                                {index + 1}
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <span className={badgeClass}>{questionType}</span>
                                    <select
                                        {...register(`questions.${index}.type`)}
                                        className="text-xs border-none bg-slate-50 text-slate-600 rounded px-2 py-1 focus:outline-none cursor-pointer"
                                    >
                                        <option value={QuestionType.INPUT}>Short Input</option>
                                        <option value={QuestionType.BOOLEAN}>True / False</option>
                                        <option value={QuestionType.CHECKBOX}>Checkbox</option>
                                    </select>
                                </div>
                                {fields.length > 1 && (
                                    <button type="button" onClick={() => remove(index)} className="text-slate-300 hover:text-red-400 transition-colors">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <input
                                        {...register(`questions.${index}.label`)}
                                        className="w-full font-medium text-slate-800 focus:outline-none focus:border-indigo-500 border-b border-transparent pb-1"
                                        placeholder="Enter your question text here..."
                                    />
                                    {errors.questions?.[index]?.label && (
                                        <p className="text-red-500 text-sm mt-1">{errors.questions[index]?.label?.message}</p>
                                    )}
                                </div>

                                {questionType === QuestionType.BOOLEAN && <BooleanQuestion control={control} questionIndex={index} />}
                                {questionType === QuestionType.INPUT && <InputQuestion control={control} questionIndex={index} />}
                                {questionType === QuestionType.CHECKBOX && (
                                    <CheckboxQuestion control={control} questionIndex={index} register={register} errors={errors} />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {errors.questions?.root && <p className="text-red-500 text-sm text-center">{errors.questions.root.message}</p>}

            <div className="flex flex-col items-center gap-4 pt-4">
                <button
                    type="button"
                    onClick={() => append({ type: QuestionType.INPUT, label: "", options: [] })}
                    className="flex items-center gap-2 px-6 py-3 border-2 border-dashed border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-500 rounded-xl transition-all w-full justify-center"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="font-medium">Add Next Question</span>
                </button>
                <div className="flex w-full justify-between items-center">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-lg shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? "Saving..." : existingQuiz ? "Save Changes" : "Publish Quiz"}
                    </button>
                </div>
            </div>
        </form>
    );
}
