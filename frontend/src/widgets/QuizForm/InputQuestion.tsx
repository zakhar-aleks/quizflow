import { Controller, Control } from "react-hook-form";
import { CreateQuizSchemaType } from "@/features/createQuiz";

interface Props {
    control: Control<CreateQuizSchemaType>;
    questionIndex: number;
}

export function InputQuestion({ control, questionIndex }: Props) {
    return (
        <Controller
            control={control}
            name={`questions.${questionIndex}.correctAnswer`}
            render={({ field }) => (
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Correct Answer</p>
                    <input
                        type="text"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="Enter correct answer..."
                        className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none text-sm text-slate-800 transition-colors"
                    />
                </div>
            )}
        />
    );
}
