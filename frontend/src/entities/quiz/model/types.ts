export enum QuestionType {
    BOOLEAN = "BOOLEAN",
    INPUT = "INPUT",
    CHECKBOX = "CHECKBOX",
}

export interface Question {
    id: string;
    type: QuestionType;
    label: string;
    options?: string[];
    correctAnswer?: any;
    order: number;
}

export interface QuizSummary {
    id: string;
    title: string;
    questionCount: number;
    createdAt: string;
}

export interface QuizDetail {
    id: string;
    title: string;
    createdAt: string;
    questions: Question[];
}
