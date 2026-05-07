import { createSlice } from "@reduxjs/toolkit";

interface DeleteQuizState {
    isDeleting: Record<string, boolean>;
}

const initialState: DeleteQuizState = {
    isDeleting: {},
};

export const deleteQuizSlice = createSlice({
    name: "deleteQuiz",
    initialState,
    reducers: {
        setDeleting: (state, action: { payload: { id: string; status: boolean } }) => {
            state.isDeleting[action.payload.id] = action.payload.status;
        },
    },
});

export const { setDeleting } = deleteQuizSlice.actions;
export default deleteQuizSlice.reducer;
