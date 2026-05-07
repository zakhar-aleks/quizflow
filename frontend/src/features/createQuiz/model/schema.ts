import { z } from "zod";
import { QuestionType } from "@/entities/quiz";

export const createQuestionSchema = z.object({
    type: z.nativeEnum(QuestionType),
    label: z.string().min(1, "Question label is required"),
    options: z.array(z.string()).optional(),
    correctAnswer: z.any().optional(),
}).refine(
    (data) => {
        if (data.type === QuestionType.CHECKBOX) {
            return data.options && data.options.length >= 2;
        }
        return true;
    },
    {
        message: "Checkbox questions must have at least 2 options",
        path: ["options"],
    }
);

export const createQuizSchema = z.object({
    title: z.string().min(1, "Quiz title is required"),
    questions: z.array(createQuestionSchema).min(1, "At least one question is required"),
});

export type CreateQuizSchemaType = z.infer<typeof createQuizSchema>;
export type CreateQuestionSchemaType = z.infer<typeof createQuestionSchema>;
