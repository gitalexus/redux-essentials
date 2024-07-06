import { FC } from "react";
import { useAppSelector } from "../../app/hooks";
import { Link, RouteComponentProps } from "react-router-dom";
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import { selectPostById } from "./postsSlice";

type ParamsType = {
  postId: string;
};

type Props = RouteComponentProps<ParamsType>;

const SinglePostPage: FC<Props> = ({ match }) => {
  const { postId } = match.params;

  const post = useAppSelector((state) => selectPostById(state, postId));

  if (!post) {
    return (
      <section>
        <h2>Post not found</h2>
      </section>
    );
  }

  return (
    <section>
      <article className="post">
        <h2>{post.title}</h2>
        <PostAuthor userId={post.user} />
        <p className="post-content">{post.content}</p>
        <ReactionButtons post={post} />
        <Link className="button" to={`/editPost/${postId}`}>
          Edit post
        </Link>
        <TimeAgo timestamp={post.date} />
      </article>
    </section>
  );
};

export default SinglePostPage;
