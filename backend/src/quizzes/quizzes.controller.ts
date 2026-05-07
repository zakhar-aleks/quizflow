import { Controller, Get, Post, Put, Body, Param, Delete, HttpCode, HttpStatus } from "@nestjs/common";
import { QuizzesService } from "./quizzes.service";
import { CreateQuizDto } from "./dto/create-quiz.dto";
import { UpdateQuizDto } from "./dto/update-quiz.dto";
import { QuizSummaryDto } from "./dto/quiz-summary.dto";
import { QuizDetailDto } from "./dto/quiz-detail.dto";

@Controller("quizzes")
export class QuizzesController {
    constructor(private readonly quizzesService: QuizzesService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createQuizDto: CreateQuizDto): Promise<QuizDetailDto> {
        return this.quizzesService.create(createQuizDto);
    }

    @Get()
    findAll(): Promise<QuizSummaryDto[]> {
        return this.quizzesService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string): Promise<QuizDetailDto> {
        return this.quizzesService.findOne(id);
    }

    @Put(":id")
    update(@Param("id") id: string, @Body() updateQuizDto: UpdateQuizDto): Promise<QuizDetailDto> {
        return this.quizzesService.update(id, updateQuizDto);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param("id") id: string): Promise<void> {
        return this.quizzesService.remove(id);
    }
}
