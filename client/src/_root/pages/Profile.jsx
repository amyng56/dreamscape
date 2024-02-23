import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";

import { Button } from "@/components/ui";
import { LikedPosts, FollowingUsers, FollowedByUsers } from "@/_root/pages";
import { useAuthContext } from "@/context/AuthContext";
import { useGetUserById, useGetCurrentUser, useFollowUser, useUnfollowUser } from "@/lib/react-query/queriesAndMutations";
import { GridPostList, Loader } from "@/components/shared";

const serverMediaUrl = process.env.ENABLE_PROFILEPIC_CLOUDINARY === '1' ? "" : `${process.env.SERVER_URL}/uploads/`;

const StatBlock = ({ value, label, active }) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className={`small-medium lg:base-medium text-light-2 hover:underline underline-offset-2 ${active === 'true' && `underline`}`}>{label}</p>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  const { user, token } = useAuthContext();
  const { pathname } = useLocation();

  const { data: currentProfileUser } = useGetUserById(id || "", token);

  const { data: currentUser } = useGetCurrentUser(token);

  const { mutate: followUser, isPending: isLoadingFollowUser } = useFollowUser(token);

  const { mutate: unfollowUser, isPending: isLoadingUnfollowUser } = useUnfollowUser(token);

  const isFollowing = currentUser?.following.includes(id) || false;

  const handleFollowUser = (e) => {
    e.stopPropagation();
    followUser(id);
  };

  const handleUnfollowUser = (e) => {
    e.stopPropagation();
    unfollowUser(id);
  };

  if (!currentProfileUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              currentProfileUser.profilePicture ? `${serverMediaUrl}${currentProfileUser.profilePicture}` : "/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentProfileUser.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentProfileUser.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <Link to={`/profile/${id}`}>
                <StatBlock value={currentProfileUser.posts?.length ?? 0} label="Posts" />
              </Link>
              <Link to={`/profile/${id}/followed-by-users`}>
                <StatBlock value={currentProfileUser.followers?.length ?? 0} label="Followers" active={`${pathname === `/profile/${id}/followed-by-users`}`} />
              </Link>
              <Link to={`/profile/${id}/following-users`}>
                <StatBlock value={currentProfileUser.following?.length ?? 0} label="Following" active={`${pathname === `/profile/${id}/following-users`}`} />
              </Link>
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentProfileUser.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <div className={`${user.id !== currentProfileUser._id && "hidden"}`}>
              <Link
                to={`/update-profile/${currentProfileUser._id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${user.id !== currentProfileUser._id && "hidden"
                  }`}>
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
            <div className={`${user.id === id && "hidden"}`}>
              {isFollowing ?
                <Button
                  type="button"
                  size="sm"
                  className="shad-button_primary px-5"
                  onClick={(e) => handleUnfollowUser(e)}
                  disabled={isLoadingUnfollowUser}
                >
                  Unfollow
                  {isLoadingUnfollowUser && <Loader />}
                </Button>
                :
                <Button
                  type="button"
                  size="sm"
                  className="shad-button_primary px-5"
                  onClick={(e) => handleFollowUser(e)}
                  disabled={isLoadingFollowUser}
                >
                  Follow
                  {isLoadingFollowUser && <Loader />}
                </Button>
              }
            </div>
          </div>
        </div>
      </div>

      {currentProfileUser._id === user.id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${pathname === `/profile/${id}` && "!bg-dark-3"
              }`}>
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
              }`}>
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked
          </Link>
        </div>
      )}

      <Routes>
        <Route
          index
          element={<GridPostList posts={currentProfileUser.posts ?? []} showUser={false} />}
        />
        {currentProfileUser._id === user.id && (
          <Route path="/liked-posts" element={<LikedPosts />} />
        )}
        <Route path="/following-users" element={<FollowingUsers currentProfileUserId={id} currentUserFollowingList={currentUser?.following} />} />
        <Route path="/followed-by-users" element={<FollowedByUsers currentProfileUserId={id} currentUserFollowingList={currentUser?.following} />} />
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;
