import { Controller, Control } from "react-hook-form";
import { CreateQuizSchemaType } from "@/features/createQuiz";

interface Props {
    control: Control<CreateQuizSchemaType>;
    questionIndex: number;
}

export function BooleanQuestion({ control, questionIndex }: Props) {
    return (
        <Controller
            control={control}
            name={`questions.${questionIndex}.correctAnswer`}
            render={({ field }) => (
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Correct Answer</p>
                    <div className="flex gap-4">
                        {[true, false].map((val) => (
                            <label
                                key={String(val)}
                                className={`flex items-center gap-2 border rounded-lg px-4 py-2 cursor-pointer transition-all ${
                                    field.value === val
                                        ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
                                        : "border-slate-200 bg-slate-50 hover:border-slate-300"
                                }`}
                            >
                                <input
                                    type="radio"
                                    checked={field.value === val}
                                    onChange={() => field.onChange(val)}
                                    className="text-indigo-600"
                                />
                                <span className="text-sm text-slate-700 font-medium">{val ? "True" : "False"}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        />
    );
}
