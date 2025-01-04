// reduxState/reducer/messageReducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  message_id: number;
  sender_id: number;
  message_content: string;
  is_deleted: boolean;
  message_time: string;
  is_read: boolean;
  receiver_id: number;
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
    updateMessageStatus(
      state,
      action: PayloadAction<{ id: number; isDeleted: boolean }>
    ) {
      const message = state.messages.find(
        (msg) => msg.message_id === action.payload.id
      );
      if (message) {
        message.is_deleted = action.payload.isDeleted;
      }
    },
  },
});

export const { setMessages, addMessage, updateMessageStatus } =
  messagesSlice.actions;
export default messagesSlice.reducer;
