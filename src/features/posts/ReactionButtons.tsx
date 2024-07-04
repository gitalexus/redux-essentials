import { FC } from "react";
import { Post, reactionAdded } from "./postsSlice";
import { useAppDispatch } from "../../app/hooks";

const reactionEmoji: Record<keyof Post["reactions"], string> = {
  thumbsUp: "👍",
  hooray: "🎉",
  heart: "❤️",
  rocket: "🚀",
  eyes: "👀",
};

interface ReactionButtonsProps {
  post: Post;
}

const ReactionButtons: FC<ReactionButtonsProps> = ({ post }) => {
  const dispatch = useAppDispatch();
  const reactionButtons = (
    Object.keys(reactionEmoji) as Array<keyof typeof reactionEmoji>
  ).map((name) => {
    return (
      <button
        key={name}
        className="muted-button reaction-button"
        type="button"
        onClick={() =>
          dispatch(reactionAdded({ postId: post.id, reaction: name }))
        }
      >
        {reactionEmoji[name]} {post.reactions[name]}
      </button>
    );
  });
  return <div>{reactionButtons}</div>;
};

export default ReactionButtons;
