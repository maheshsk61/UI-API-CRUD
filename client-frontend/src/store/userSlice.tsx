// src/store/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

let nextId = 1; // Start user ID from 1

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get('http://localhost:5000/api/users');
  return response.data;
});

export const createUser = createAsyncThunk('users/createUser', async (user: Omit<User, 'id'>) => {
  const newUser = { ...user, id: nextId++ }; // Assign the next ID
  await axios.post('http://localhost:5000/api/users', newUser);
  return newUser;
});

export const updateUser = createAsyncThunk('users/updateUser', async (user: User) => {
  await axios.put(`http://localhost:5000/api/users/${user.id}`, user);
  return user;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id: number) => {
  await axios.delete(`http://localhost:5000/api/users/${id}`);
  return id;
});

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      });
  },
});

export default userSlice.reducer;
