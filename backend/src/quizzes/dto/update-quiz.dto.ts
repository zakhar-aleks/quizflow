import { Type } from "class-transformer";
import { IsString, MinLength, ValidateNested, ArrayMinSize, IsEnum, IsOptional, IsArray } from "class-validator";
import { QuestionType } from "@prisma/client";

export class UpdateQuestionDto {
    @IsEnum(QuestionType)
    type: QuestionType;

    @IsString()
    label: string;

    @IsOptional()
    options?: any;

    @IsOptional()
    correctAnswer?: any;
}

export class UpdateQuizDto {
    @IsString()
    @MinLength(1)
    title: string;

    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => UpdateQuestionDto)
    questions: UpdateQuestionDto[];
}
