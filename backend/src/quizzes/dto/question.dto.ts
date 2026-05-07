import { Expose } from "class-transformer";
import { QuestionType } from "@prisma/client";

export class QuestionDto {
    @Expose()
    id: string;

    @Expose()
    type: QuestionType;

    @Expose()
    label: string;

    @Expose()
    options: any;

    @Expose()
    correctAnswer: any;

    @Expose()
    order: number;
}
