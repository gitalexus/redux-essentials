import { ChangeEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { postAdded } from "./postsSlice";
import { selectUsers } from "../users/usersSlice";

const AddPostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, serUserId] = useState("");

  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);

  const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);

  const onContentChanged = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setContent(e.target.value);

  const onAuthorChange = (e: ChangeEvent<HTMLSelectElement>) =>
    serUserId(e.target.value);

  const canSave = Boolean(userId) && Boolean(title) && Boolean(content);

  const userOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  const onAddClick = () => {
    if (title && content) {
      dispatch(postAdded(title, content, userId));
      setTitle("");
      setContent("");
    }
  };

  return (
    <section>
      <h2>Add a new post</h2>
      <form>
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChange}>
          <option value=""></option>
          {userOptions}
        </select>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          value={title}
          type="text"
          name="postTitle"
          id="postTitle"
          onChange={onTitleChanged}
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          onChange={onContentChanged}
          name="postContent"
          id="postContent"
          value={content}
        ></textarea>
        <button type="button" onClick={onAddClick} disabled={!canSave}>
          Save post
        </button>
      </form>
    </section>
  );
};

export default AddPostForm;
