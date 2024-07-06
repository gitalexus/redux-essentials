import { ChangeEvent, FC, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { postUpdated, selectPostById } from "./postsSlice";

type ParamsType = {
  postId: string;
};

type Props = RouteComponentProps<ParamsType>;

const EditPostForm: FC<Props> = ({ match }) => {
  const { postId } = match.params;
  const post = useAppSelector((state) => selectPostById(state, postId));

  const [title, setTitle] = useState(post?.title);
  const [content, setContent] = useState(post?.content);
  const dispatch = useAppDispatch();
  const history = useHistory();

  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const onContentChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setContent(e.target.value);

  const onSavePostClick = () => {
    if (title && content) {
      dispatch(
        postUpdated({
          id: postId,
          title,
          content,
        }),
      );
      history.push(`/posts/${postId}`);
    }
  };

  return (
    <section>
      <h2>Edit post</h2>
      <form>
        <label htmlFor="postTitle">Post title:</label>
        <input
          type="text"
          id="postTile"
          name="postTitle"
          placeholder="What's on your mind?"
          value={title}
          onChange={onTitleChange}
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          name="postContent"
          id="postContent"
          value={content}
          onChange={onContentChange}
        />
      </form>
      <button type="button" onClick={onSavePostClick}>
        Save post
      </button>
    </section>
  );
};

export default EditPostForm;
