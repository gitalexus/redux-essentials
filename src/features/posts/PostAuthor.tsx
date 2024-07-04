import { FC } from "react";
import { useAppSelector } from "../../app/hooks";

interface PostAuthorProps {
  userId: string;
}

const PostAuthor: FC<PostAuthorProps> = ({ userId }) => {
  const author = useAppSelector((state) =>
    state.users.find((user) => user.id === userId),
  );
  return <span>by {author ? author.name : "unknown author"}</span>;
};

export default PostAuthor;
