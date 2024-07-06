import {
  AsyncThunk,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { client } from "../../api/client";

export interface Post {
  id: string;
  title: string;
  content: string;
  user: string;
  date: string;
  reactions: Reactions;
}

export interface Reactions {
  thumbsUp: number;
  hooray: number;
  heart: number;
  rocket: number;
  eyes: number;
}

type Status = "idle" | "loading" | "succeeded" | "failed";

interface PostSliceState {
  posts: Post[];
  status: Status;
  error: string | null;
}

interface ThunkConfig {}

/**
 * Thunk функция для асинхронного data fetching (получаем posts с мок-RESTapi-сервера)
 * - A string that will be used as the prefix for the generated action types
 * - A "payload creator" callback function that should return a Promise containing some data, or a rejected Promise with an error
 */
export const fetchPosts: AsyncThunk<Post[], void, ThunkConfig> =
  createAsyncThunk("post/fetchPosts", async () => {
    const response = await client.get("fakeApi/posts");
    return response.data;
  });

const initialState: PostSliceState = {
  posts: [],
  status: "idle",
  error: null,
};

export const addNewPost: AsyncThunk<
  Post,
  Pick<Post, "title" | "content" | "user">,
  ThunkConfig
> = createAsyncThunk(
  "posts/addNewPost",
  // The payload creator receives the partial `{title, content, user}` object
  async (initialPost) => {
    // We send the initial data to the fake API server
    const response = await client.post("/fakeApi/posts", initialPost);
    // The response includes the complete post object, including unique ID
    return response.data;
  },
);

/**
 * Стоит обратить внимание что при обращении к store внутри slice мы делаем это напрямую, не добавляя название слайса к store.<property>
 * Вне слайса же обращения уже должны будут содержать   store.<sliceName.<property>
 */

const postSlices = createSlice({
  name: "posts",
  initialState,
  /*  don't try to mutate any data outside of createSlice! (immer)*/
  reducers: {
    // ниже закомментирована предварительная версия addPost которая генерировала id в себе в секции prepare
    // /* addPost */
    // postAdded: {
    //   reducer: (state, action: PayloadAction<Post>) => {
    //     state.posts.push(action.payload);
    //   },
    //   /**
    //    * prepare - это callback который позволяет предварительно подготовить payload перед переачай в reducer
    //    * это удобно использовать, когда подобная подготовка логики требуется в нескольких компонентах (нет необходимости повторять логику в каждом компоненте)
    //    * Логика связанная с присвоением случайных значений не должна реализовываться в редьюсере.
    //    * А при использовании слайсов, мы не управляем вручную созданием акшенов.
    //    * Поэтому и требуется использовать специальный механизм.
    //    * Также механизм prepare может быть удобен если логика подготовки компонента очьне обширна и вынесение ее в отдельный блок улучшит читаемость кода.
    //    */
    //   prepare: (title: string, content: string, user: string) => {
    //     return {
    //       payload: {
    //         id: nanoid(),
    //         date: new Date().toISOString(),
    //         title,
    //         content,
    //         user,
    //         reactions: { thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0 },
    //       },
    //     };
    //   },
    // },
    /* updatePost */
    postUpdated: (
      state,
      action: PayloadAction<{ id: string; title: string; content: string }>,
    ) => {
      const { id, title, content } = action.payload;
      const existedPost = state.posts.find((post) => post.id === id);
      if (existedPost) {
        existedPost.title = title;
        existedPost.content = content;
      }
    },
    /* reactionAdded */
    reactionAdded: (
      state,
      action: PayloadAction<{ postId: string; reaction: keyof Reactions }>,
    ) => {
      const { postId, reaction } = action.payload;
      const existedPost = state.posts.find((post) => post.id === postId);
      if (existedPost) {
        existedPost.reactions[reaction]++;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = state.posts.concat(action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      });
  },
});

/* selects */
export const selectAllPosts = (state: RootState) => state.posts;
export const selectPostById = (state: RootState, postId: string) =>
  state.posts.posts.find((post) => post.id === postId);

/* actions */
export const { postUpdated, reactionAdded } = postSlices.actions;

/* reducer */
export default postSlices.reducer;
