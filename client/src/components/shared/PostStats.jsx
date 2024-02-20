import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

import { useLikePost, useCollectPost, useUncollectPost, useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "../../utils";
import Loader from "./Loader";

const PostStats = ({ post, userId, token }) => {
  const location = useLocation();
  const likesList = post.likes;
  const [likes, setLikes] = useState(likesList || []);
  const [isCollected, setIsCollected] = useState(false);

  const { mutate: likePost } = useLikePost(token);
  const { mutate: collectPost, isPending: isCollectingPost } = useCollectPost(token);
  const { mutate: uncollectPost, isPending: isUncollectingPost } = useUncollectPost(token);

  const { data: currentUser } = useGetCurrentUser(token);
  const collectedPostRecord = currentUser?.collections.find(
    (record) => record.postId._id === post._id
  );

  useEffect(() => {
    setIsCollected(!!collectedPostRecord);
  }, [currentUser]);

  const handleLikePost = (e) => {
    e.stopPropagation();

    let likesArray = [...likes];

    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((id) => id !== userId);
    } else {
      likesArray.push(userId);
    }

    setLikes(likesArray);
    likePost(post._id);
  };

  const handleCollectPost = (e) => {
    e.stopPropagation();

    if (collectedPostRecord) {
      setIsCollected(false);
      return uncollectPost({ postCollectionId: collectedPostRecord._id });
    }

    collectPost({ postId: post._id });
    setIsCollected(true);
  };

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
        <img
          src={`${checkIsLiked(likes, userId) ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"
            }`}
          alt="like"
          width={20}
          height={20}
          onClick={(e) => handleLikePost(e)}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>

        {/* {showComment &&
          <Link
            to={`/comment-post/${post?._id}`}
            className={`${currentUser.id === post?.userId?._id && "hidden"}`}>
            <img
              src={"/assets/icons/comment.svg"}
              alt="comment"
              width={24}
              height={24}
            />
          </Link>
        } */}
      </div>

      <div className="flex gap-2">
        {isCollectingPost || isUncollectingPost ? <Loader /> :
          <img
            src={isCollected ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="share"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={(e) => handleCollectPost(e)}
          />
        }
      </div>
    </div>
  );
};

export default PostStats;
