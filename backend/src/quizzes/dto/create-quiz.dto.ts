import { Type } from "class-transformer";
import { IsString, MinLength, ValidateNested, ArrayMinSize, IsEnum, IsOptional, IsArray, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate } from "class-validator";
import { QuestionType } from "@prisma/client";

export class CreateQuestionDto {
    @IsEnum(QuestionType)
    type: QuestionType;

    @IsString()
    label: string;

    @IsOptional()
    options?: any;

    @IsOptional()
    correctAnswer?: any;
}

export class CreateQuizDto {
    @IsString()
    @MinLength(1)
    title: string;

    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => CreateQuestionDto)
    questions: CreateQuestionDto[];
}
