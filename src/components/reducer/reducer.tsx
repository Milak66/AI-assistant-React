import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Sender = "user" | "ai";

export interface Message {
    text: string;
    id: number;
    sender: Sender;
}

interface InitialState {
    messages: Message[];
}

const initialState: InitialState = {
    messages: [{
        text: "Sup! I'm your AI assistant. How can I help you?",
        id: Date.now(),
        sender: "ai"
    },]
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        onAddMessage: (state, action: PayloadAction<Message>) => {
            state.messages.push(action.payload);
        }
    }
});

export const {
    onAddMessage
} = chatSlice.actions;

export default chatSlice.reducer;