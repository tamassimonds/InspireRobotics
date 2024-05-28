// features/user/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '/lib/firebase/initFirebase';

// Async thunk action
export const fetchUserDetails = createAsyncThunk(
  'user/fetchDetails',
  async (userID, { rejectWithValue }) => {
    
    try {
      const employeesRef = collection(db, 'employees');
      console.log(userID)
      const q = query(employeesRef, where('UID', 'array-contains', userID));
      const querySnapshot = await getDocs(q);
      let employeeData = null;

      querySnapshot.forEach((doc) => {
        employeeData = doc.data();
      });

      return employeeData;
    } catch (error) {

      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  userData: null,
  loading: false,
  error: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
