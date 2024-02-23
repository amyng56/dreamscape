import { Link } from "react-router-dom";

import { PostStats } from "@/components/shared";
import { useAuthContext } from "../../context/AuthContext";
import { formatDateString, multiFormatDateString } from "../../utils";

const serverMediaUrl = process.env.ENABLE_PROFILEPIC_CLOUDINARY === '1' ? "" : `${process.env.SERVER_URL}/uploads/`;

const PostCard = ({ post }) => {
  const { user, token } = useAuthContext();

  if (!post.userId) return;

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.userId._id}`}>
            <img
              src={
                post.userId.profilePicture ? `${serverMediaUrl}${post.userId.profilePicture}` :
                  "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="rounded-full w-12 h-12"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.userId.name}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular ">
                {multiFormatDateString(post.createdAt)}
              </p>
              {post.location ?
                <>
                  <img
                    src={"/assets/icons/location.svg"}
                    alt="location"
                    width={15}
                    height={15}
                  />
                  <p className="subtle-semibold lg:small-regular">
                    {post.location}
                  </p>
                </>
                : ""}
              {post.dateTime ?
                <>
                  <img
                    src={"/assets/icons/dream-date.svg"}
                    alt="location"
                    width={20}
                    height={20}
                  />
                  <p className="subtle-semibold lg:small-regular">
                    {formatDateString(post.dateTime)}
                  </p>
                </>
                : ""}
            </div>
          </div>
        </div>
        <div className="flex-center gap-4">
          <p>{post.emotions}</p>
          <Link
            to={`/update-post/${post._id}`}
            className={`${user.id !== post.userId._id && "hidden"}`}>
            <img
              src={"/assets/icons/edit.svg"}
              alt="edit"
              width={20}
              height={20}
            />
          </Link>
        </div>
      </div>

      <Link to={`/posts/${post._id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.dreamDescription}</p>
          <ul className="flex gap-1 mt-2">
            {post?.tags.map((tag, index) => (
              tag ?
                <li key={`${tag}${index}`} className="text-light-3 small-regular">
                  #{tag}
                </li>
                : ""
            ))}
          </ul>
        </div>

        <img
          src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="post image"
          className="post-card_img"
        />
      </Link>

      <PostStats post={post} userId={user.id} token={token} />
    </div>
  );
};

export default PostCard;
