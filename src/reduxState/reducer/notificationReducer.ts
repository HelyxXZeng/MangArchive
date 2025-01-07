// // reduxState/reducer/messageReducer.ts
import { createSlice } from "@reduxjs/toolkit";

// interface Notification {
//     id: number;
//     time: string;
//     is_read: boolean;
//     name: string;
//     content: string;
//     user: number;
// }

// interface NotificationsState {
//   notifications: Notification[];
// }

// const initialState: NotificationsState = {
//   notifications: [],
// };

const notificationsSlice = createSlice({
  name: "notification",
  initialState: { notificationCount: 0 },
  reducers: {
    setCount(state, action) {
      state.notificationCount = action.payload;
    },
    subCount(state) {
      if (state.notificationCount > 0)
        state.notificationCount = state.notificationCount - 1;
    },
  },
});

// const messagesSlice = createSlice({
//   name: "message",
//   initialState,
//   reducers: {
//     setMessages(state, action: PayloadAction<Message[]>) {
//       state.messages = action.payload;
//     },
//     addMessage(state, action: PayloadAction<Message>) {
//       state.messages.push(action.payload);
//     },
//     updateMessageStatus(
//       state,
//       action: PayloadAction<{ id: number; isDeleted: boolean }>
//     ) {
//       const message = state.messages.find(
//         (msg) => msg.message_id === action.payload.id
//       );
//       if (message) {
//         message.is_deleted = action.payload.isDeleted;
//       }
//     },
//   },
// });

export const { setCount, subCount } = notificationsSlice.actions;
export default notificationsSlice.reducer;
