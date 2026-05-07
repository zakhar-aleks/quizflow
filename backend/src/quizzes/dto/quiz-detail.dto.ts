import { Expose, Type } from "class-transformer";
import { QuestionDto } from "./question.dto";

export class QuizDetailDto {
    @Expose()
    id: string;

    @Expose()
    title: string;

    @Expose()
    createdAt: Date;

    @Expose()
    @Type(() => QuestionDto)
    questions: QuestionDto[];
}
