import { Expose } from "class-transformer";

export class QuizSummaryDto {
    @Expose()
    id: string;

    @Expose()
    title: string;

    @Expose()
    questionCount: number;

    @Expose()
    createdAt: Date;
}
