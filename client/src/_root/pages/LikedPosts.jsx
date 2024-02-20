import { GridPostList, Loader } from "@/components/shared";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { useAuthContext } from "../../context/AuthContext";

const LikedPosts = () => {
  const { token } = useAuthContext();
  const { data: currentUser } = useGetCurrentUser(token);

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <>
      {currentUser?.liked.length === 0 && (
        <p className="text-light-4">No liked posts</p>
      )}

      <GridPostList posts={currentUser.liked} showStats={false} />
    </>
  )
};

export default LikedPosts;