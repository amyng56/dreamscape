import { Loader, PostCard, UserCard } from "@/components/shared";
import { useGetRecentPosts, useGetAllFollowerPosts, useGetUsers } from "@/lib/react-query/queriesAndMutations";
import { useAuthContext } from "../../context/AuthContext";

const Home = () => {
  const { user, token } = useAuthContext();
  // const {
  //   data: posts,
  //   isLoading: isPostLoading,
  //   isError: isErrorPosts,
  // } = useGetRecentPosts(token);
  const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetAllFollowerPosts(token);
  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(10, token);

  const followingList = creators?.users
    .filter(userr => userr._id === user.id)
    .map(({ following }) => following || [])
    .flat();

  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Dreams Feed 🌌</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {posts?.posts.length > 0 ?
                posts?.posts.map((post) => (
                  <li key={post?._id} className="flex justify-center w-full">
                    <PostCard post={post} />
                  </li>
                ))
                : <p className="text-light-4 mt-10 text-center w-full">End of posts</p>}
            </ul>
          )}
        </div>
      </div>

      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Users</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.users?.map((creator) => (
              creator._id !== user.id ?
                <li key={creator?._id} className="flex-1 min-w-[200px] w-full  ">
                  <UserCard user={creator} isFollowing={followingList.includes(creator._id)} token={token} />
                </li>
                : ""
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
