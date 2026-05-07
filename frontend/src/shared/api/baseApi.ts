import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { QuizSummary, QuizDetail } from "@/entities/quiz";
import { CreateQuizSchemaType } from "@/features/createQuiz";

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
    tagTypes: ["Quiz"],
    endpoints: (builder) => ({
        getQuizzes: builder.query<QuizSummary[], void>({
            query: () => "/quizzes",
            providesTags: ["Quiz"],
        }),
        getQuiz: builder.query<QuizDetail, string>({
            query: (id) => `/quizzes/${id}`,
            providesTags: (result, error, id) => [{ type: "Quiz", id }],
        }),
        createQuiz: builder.mutation<QuizDetail, CreateQuizSchemaType>({
            query: (body) => ({
                url: "/quizzes",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Quiz"],
        }),
        updateQuiz: builder.mutation<QuizDetail, { id: string; data: CreateQuizSchemaType }>({
            query: ({ id, data }) => ({
                url: `/quizzes/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_r, _e, { id }) => [{ type: "Quiz", id }, "Quiz"],
        }),
        deleteQuiz: builder.mutation<void, string>({
            query: (id) => ({
                url: `/quizzes/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Quiz"],
        }),
    }),
});

export const { useGetQuizzesQuery, useGetQuizQuery, useCreateQuizMutation, useUpdateQuizMutation, useDeleteQuizMutation } = baseApi;
