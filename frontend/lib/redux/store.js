// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '/lib/redux/features/user/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer, // use userReducer here
    // other reducers...
  },
});

export default store;