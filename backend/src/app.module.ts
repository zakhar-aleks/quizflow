import { Module } from "@nestjs/common";
import { QuizzesModule } from "./quizzes/quizzes.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
    imports: [PrismaModule, QuizzesModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
