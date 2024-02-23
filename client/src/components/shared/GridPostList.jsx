import { Link } from "react-router-dom";

import { PostStats } from "@/components/shared";
import { useAuthContext } from "@/context/AuthContext";

const serverMediaUrl = process.env.ENABLE_PROFILEPIC_CLOUDINARY === '1' ? "" : `${process.env.SERVER_URL}/uploads/`;

const GridPostList = ({ posts, showUser = true, showStats = true }) => {
  const { user, token } = useAuthContext();
  
  return (
    <>
      {posts.length === 0 && (
        <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
      )}
      <ul className="grid-container">
        {posts?.map((post) => (
          <li key={post._id} className="relative min-w-80 h-80">
            <Link to={`/posts/${post._id}`} className="grid-post_link">
              <img
                src={post.imageUrl}
                alt="post image"
                className="h-full w-full object-cover"
              />
            </Link>
            <div className="grid-post_user">
              {showUser && (
                <div className="flex items-center justify-start gap-2 flex-1">
                  <img
                    src={
                      post?.userId.profilePicture ? `${serverMediaUrl}${post.userId.profilePicture}` : "/assets/icons/profile-placeholder.svg"
                    }
                    alt="creator"
                    className="w-8 h-8 rounded-full"
                  />
                  <p className="line-clamp-1">{post.userId.name}</p>
                </div>
              )}
              {showStats && <PostStats post={post} userId={user.id} token={token} />}
            </div>
          </li>
        ))}
      </ul>
    </>

  );
};

export default GridPostList;
