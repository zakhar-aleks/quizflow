import { PrismaClient, QuestionType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const quiz = await prisma.quiz.create({
        data: {
            title: "Sample Full-Stack Developer Quiz",
            questions: {
                create: [
                    {
                        type: QuestionType.BOOLEAN,
                        label: "NestJS is built on top of Express by default.",
                        correctAnswer: true,
                        order: 1,
                    },
                    {
                        type: QuestionType.INPUT,
                        label: "What does ORM stand for?",
                        correctAnswer: "Object Relational Mapping",
                        order: 2,
                    },
                    {
                        type: QuestionType.CHECKBOX,
                        label: "Which of the following are React state management libraries?",
                        options: ["Redux", "Zod", "Jotai", "Prisma"],
                        correctAnswer: ["Redux", "Jotai"],
                        order: 3,
                    },
                ],
            },
        },
    });

    console.log("Database seeded successfully.");
    console.log(quiz);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
