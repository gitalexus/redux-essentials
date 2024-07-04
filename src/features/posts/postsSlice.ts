import { PayloadAction, createSlice, nanoid } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { sub } from "date-fns";

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

const initialState: Post[] = [
  {
    id: "1",
    title: "First post",
    content: "Hello!",
    user: "0",
    date: sub(new Date(), { minutes: 10 }).toISOString(),
    reactions: { thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0 },
  },
  {
    id: "2",
    title: "Second post",
    content: "Good morning!",
    user: "1",
    date: sub(new Date(), { minutes: 5 }).toISOString(),
    reactions: { thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0 },
  },
];

/**
 * Стоит обратить внимание что при обращении к store внутри slice мы делаем это напрямую, не добавляя название слайса к store.<property>
 * Вне слайса же обращения уже должны будут содержать   store.<sliceName.<property>
 */

const postSlices = createSlice({
  name: "posts",
  initialState,
  /*  don't try to mutate any data outside of createSlice! (immer)*/
  reducers: {
    /* addPost */
    postAdded: {
      reducer: (state, action: PayloadAction<Post>) => {
        state.push(action.payload);
      },
      /**
       * prepare - это callback который позволяет предварительно подготовить payload перед переачай в reducer
       * это удобно использовать, когда подобная подготовка логики требуется в нескольких компонентах (нет необходимости повторять логику в каждом компоненте)
       * Логика связанная с присвоением случайных значений не должна реализовываться в редьюсере.
       * А при использовании слайсов, мы не управляем вручную созданием акшенов.
       * Поэтому и требуется использовать специальный механизм.
       * Также механизм prepare может быть удобен если логика подготовки компонента очьне обширна и вынесение ее в отдельный блок улучшит читаемость кода.
       */
      prepare: (title: string, content: string, user: string) => {
        return {
          payload: {
            id: nanoid(),
            date: new Date().toISOString(),
            title,
            content,
            user,
            reactions: { thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0 },
          },
        };
      },
    },
    /* updatePost */
    postUpdated: (
      state,
      action: PayloadAction<{ id: string; title: string; content: string }>,
    ) => {
      const { id, title, content } = action.payload;
      const existedPost = state.find((post) => post.id === id);
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
      const existedPost = state.find((post) => post.id === postId);
      if (existedPost) {
        existedPost.reactions[reaction]++;
      }
    },
  },
});

export const selectPosts = (state: RootState) => state.posts;

export const { postAdded, postUpdated, reactionAdded } = postSlices.actions;
export default postSlices.reducer;
