// reduxState/reducer/messageReducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  message_id: string;
  sender_id: number;
  message_content: string;
  is_deleted: boolean;
  created_at: string;
}

interface MessagesState {
  messages: Message[];
}

const initialState: MessagesState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessages(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
    },
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
  },
});

export const { setMessages, addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
