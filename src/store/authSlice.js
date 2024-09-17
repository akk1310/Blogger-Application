import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  status: false,
  userData: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload.userData;
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
    },
  },
});

const initialPostState = {
  posts: [], // Post state initialization
};

const postSlice = createSlice({
  name: "posts",
  initialState: initialPostState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    addLike: (state, action) => {
      const postId = action.payload;
      const post = state.posts.find((post) => post.$id === postId);
      if (post) {
        post.likes += 1;
      }
    },
    removeLike: (state, action) => {
      const postId = action.payload;
      const post = state.posts.find((post) => post.$id === postId);
      if (post && post.likes > 0) {
        post.likes -= 1;
      }
    },
  },
});

// Exporting the actions
export const { setPosts, addLike, removeLike } = postSlice.actions;
export const { login, logout } = authSlice.actions;

// Exporting the reducers
export const postReducer = postSlice.reducer; // Named export for post reducer
export default authSlice.reducer; // Default export for auth reducer
