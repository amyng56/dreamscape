import { GridPostList, Loader } from "@/components/shared";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { useAuthContext } from "../../context/AuthContext";

const PostCollections = () => {
  const { token } = useAuthContext();
  const { data: currentUser } = useGetCurrentUser(token);

  const postCollections = currentUser?.collections.map((postCollection) => ({
      ...postCollection.postId,
    }))
    .reverse();

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="collections"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Post Collections</h2>
      </div>

      {!currentUser ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {postCollections.length === 0 ? (
            <p className="text-light-4">No available posts</p>
          ) : (
            <GridPostList posts={postCollections} showStats={false} />
          )}
        </ul>
      )}
    </div>
  );
};

export default PostCollections;