import { useFieldArray } from "react-hook-form";

export function CheckboxQuestion({ control, questionIndex, register, errors }: any) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `questions.${questionIndex}.options`,
    });

    return (
        <div>
            {errors.questions?.[questionIndex]?.options?.root && (
                <p className="text-red-500 text-sm mb-2">{errors.questions[questionIndex].options.root.message}</p>
            )}
            <div className="space-y-2">
                {fields.map((field, optionIndex) => (
                    <div key={field.id} className="flex items-center gap-3 group">
                        <input type="checkbox" disabled className="rounded text-indigo-600 cursor-not-allowed opacity-70" />
                        <input
                            {...register(`questions.${questionIndex}.options.${optionIndex}`)}
                            className="text-sm text-slate-800 bg-slate-50 border border-transparent focus:border-indigo-500 focus:bg-white rounded px-3 py-2 flex-1 outline-none transition-colors"
                            placeholder={`Option ${optionIndex + 1}`}
                        />
                        <button
                            type="button"
                            onClick={() => remove(optionIndex)}
                            className="text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"/></svg>
                        </button>
                    </div>
                ))}
            </div>
            <button
                type="button"
                onClick={() => append("")}
                className="text-xs text-indigo-600 font-semibold mt-4 hover:text-indigo-800 transition-colors"
            >
                + Add Option
            </button>
        </div>
    );
}
