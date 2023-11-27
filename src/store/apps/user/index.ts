// import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { ThemeColor } from 'src/@core/layouts/types';

// export interface Provider {
//   _id: string;
//   managerName: string;
//   managerCi: string;
//   managerPhone: number;
//   businessAddress: string;
//   email: string;
//   businessName: string;
//   NIT: string;
//   informationAsset: informationAsset;
//   asset: boolean;
// }
// interface informationAsset {
//   asset: string;
//   description: string;
//   image: string;
// }

// interface UserState {
//   data: Provider | null;
//   list: Provider[];
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error: string | null;
// }

// const initialState: UserState = {
//   data: null,
//   list: [],
//   status: 'idle',
//   error: null
// };

// export const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzZXIiOiI2NGU1MjJlMGZhYTBiZTE1ZjgyNzQxYjciLCJBcHAiOnsiMCI6eyJ1dWlkIjoiY2FiODM2MzUtM2ZlMC00OGQxLTkzMTYtOTEzYWRjOTgxYThjIiwibmFtZSI6ImNlbnRyYWwiLCJ1cmwiOiJodHRwOi8vMTAuMTAuMjE0LjIxOTozMDA1L2hvbWUifX0sInJvbGVzIjpbIjY0ZTUyMTA2ZTNhYjFmYmFkYzEwZWRmMiJdLCJpYXQiOjE2OTU4NjcxODMsImV4cCI6MTY5NTg4ODc4M30.rlk73gMQhaCkH2LIuZviYv86kESO06u6E718mbXOmus';

// // Thunk para agregar usuario
// export const addProvider = createAsyncThunk(
//   'providers/addprovider',
//   async (userData: Provider) => {
//     const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ACTIVOS}supplier`, userData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }

//     });
//     return response.data;
//   }
// );

// export const fetchProvider = createAsyncThunk(
//   'providers/fetchProvider',
//   async (): Promise<Provider[]> => {
//     const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}supplier/`);
//     return response.data;
//   }
// );

// const userSlice = createSlice({
//   name: 'providers',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(addProvider.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(addProvider.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.list.push(action.payload);
//         state.data = action.payload;
//       })
//       .addCase(addProvider.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message || null;
//       })
//       .addCase(fetchProvider.fulfilled, (state, action) => {
//         state.list = action.payload;
//       });
//   }
// });

// export default userSlice.reducer;

// userSlice.js

import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchUser = createAsyncThunk('appUser/fetchUser', async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ACTIVOS}personal` )
    console.log(response)
    return response
  } catch (error) {
    throw error
  }
})

export const appUserSlice = createSlice({
  name: 'appUser',
  initialState: {
    user: {
      // Inicializa 'user' como un objeto vacío
      ci: '',
      name: '',
      email: '',
      rolUser: [],
      lastName: '',
      unity: '',
      file: '',
      _id: ''
    }
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.user = action.payload.data
    })
  }
})

export default appUserSlice.reducer
export const { actions } = appUserSlice
