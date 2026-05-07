import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateQuizDto } from "./dto/create-quiz.dto";
import { UpdateQuizDto } from "./dto/update-quiz.dto";
import { QuizSummaryDto } from "./dto/quiz-summary.dto";
import { QuizDetailDto } from "./dto/quiz-detail.dto";
import { plainToInstance } from "class-transformer";

@Injectable()
export class QuizzesService {
    constructor(private prisma: PrismaService) {}

    async create(createQuizDto: CreateQuizDto): Promise<QuizDetailDto> {
        const quiz = await this.prisma.quiz.create({
            data: {
                title: createQuizDto.title,
                questions: {
                    create: createQuizDto.questions.map((q, index) => ({
                        type: q.type,
                        label: q.label,
                        options: q.options ? JSON.parse(JSON.stringify(q.options)) : null,
                        correctAnswer: q.correctAnswer ? JSON.parse(JSON.stringify(q.correctAnswer)) : null,
                        order: index + 1,
                    })),
                },
            },
            include: {
                questions: {
                    orderBy: { order: "asc" },
                },
            },
        });

        return plainToInstance(QuizDetailDto, quiz);
    }

    async findAll(): Promise<QuizSummaryDto[]> {
        const quizzes = await this.prisma.quiz.findMany({
            include: {
                _count: {
                    select: { questions: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return quizzes.map((q) =>
            plainToInstance(QuizSummaryDto, {
                id: q.id,
                title: q.title,
                createdAt: q.createdAt,
                questionCount: q._count.questions,
            }),
        );
    }

    async findOne(id: string): Promise<QuizDetailDto> {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id },
            include: {
                questions: {
                    orderBy: { order: "asc" },
                },
            },
        });

        if (!quiz) {
            throw new NotFoundException(`Quiz with ID ${id} not found`);
        }

        return plainToInstance(QuizDetailDto, quiz);
    }

    async update(id: string, updateQuizDto: UpdateQuizDto): Promise<QuizDetailDto> {
        const quiz = await this.prisma.quiz.findUnique({ where: { id } });
        if (!quiz) {
            throw new NotFoundException(`Quiz with ID ${id} not found`);
        }

        await this.prisma.question.deleteMany({ where: { quizId: id } });

        const updated = await this.prisma.quiz.update({
            where: { id },
            data: {
                title: updateQuizDto.title,
                questions: {
                    create: updateQuizDto.questions.map((q, index) => ({
                        type: q.type,
                        label: q.label,
                        options: q.options ? JSON.parse(JSON.stringify(q.options)) : null,
                        correctAnswer: q.correctAnswer ? JSON.parse(JSON.stringify(q.correctAnswer)) : null,
                        order: index + 1,
                    })),
                },
            },
            include: {
                questions: { orderBy: { order: "asc" } },
            },
        });

        return plainToInstance(QuizDetailDto, updated);
    }

    async remove(id: string): Promise<void> {
        const quiz = await this.prisma.quiz.findUnique({ where: { id } });
        if (!quiz) {
            throw new NotFoundException(`Quiz with ID ${id} not found`);
        }

        await this.prisma.quiz.delete({ where: { id } });
    }
}
