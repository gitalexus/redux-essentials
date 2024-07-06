import { AsyncThunk, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { client } from "../../api/client";

interface User {
  id: string;
  name: string;
}

interface ThunkConfig {}

export const fetchUsers: AsyncThunk<User[], void, ThunkConfig> =
  createAsyncThunk("users/fetchUsers", async () => {
    const response = await client.get("/fakeApi/users");
    return response.data;
  });

const initialState: User[] = [];

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (_, action) => {
      // Immer lets us update state in two ways: either mutating the existing state value, or returning a new result.
      // В этом случае изменение осуществляется за счет возвращения значения, а не мутации конкретных значений
      return action.payload;
    });
  },
});

export const selectUsers = (state: RootState) => state.users;

export default usersSlice.reducer;
