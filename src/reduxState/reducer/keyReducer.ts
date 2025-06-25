import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface KeyState {
  privateKey: string | null;
  publicKey: string | null;
}

const initialState: KeyState = {
  privateKey: null,
  publicKey: null,
};

export const keySlice = createSlice({
  name: "key",
  initialState,
  reducers: {
    setKeys: (
      state,
      action: PayloadAction<{ privateKey: string; publicKey: string }>
    ) => {
      state.privateKey = action.payload.privateKey;
      state.publicKey = action.payload.publicKey;
    },
    setPublicKey: (state, action: PayloadAction<string>) => {
      state.publicKey = action.payload;
    },
    clearKeys: (state) => {
      state.privateKey = null;
      state.publicKey = null;
    },
  },
});

export const { setKeys, setPublicKey, clearKeys } = keySlice.actions;
export default keySlice.reducer;
