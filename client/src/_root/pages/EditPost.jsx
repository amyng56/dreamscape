import { useParams } from "react-router-dom";

import PostForm from "@/components/forms/PostForm";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { Loader } from "../../components/shared";
import { useAuthContext } from "../../context/AuthContext";

const EditPost = () => {
  const { id } = useParams();
  const { token } = useAuthContext();
  const { data: post, isPending: isLoadingPostById } = useGetPostById(id || '', token);

  if (isLoadingPostById)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Dream Entry</h2>
        </div>

        {isLoadingPostById ? <Loader /> : <PostForm action="Update" post={post?.posts} />}
      </div>
    </div>
  );
};

export default EditPost;
