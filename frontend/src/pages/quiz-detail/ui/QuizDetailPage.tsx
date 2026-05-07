import { QuizDetail } from "@/widgets/QuizDetail";

export function QuizDetailPage({ params }: { params: { id: string } }) {
    return (
        <div>
            <QuizDetail quizId={params.id} />
        </div>
    );
}
