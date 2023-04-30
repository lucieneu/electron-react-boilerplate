// import { configureStore } from '@reduxjs/toolkit';
// import { counterSlice } from './labelSlice';
// // ...

// export const store = configureStore({
//   reducer: {
//     labels: counterSlice,
//   },
// });

// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof store.dispatch;
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import labelReducer from './labelSlice';
import directoryReducer from './directorySlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    label: labelReducer,
    directory: directoryReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
