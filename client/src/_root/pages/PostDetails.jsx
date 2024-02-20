import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useState, useEffect } from "react";

import { Button, Input } from "@/components/ui";
import { Loader } from "@/components/shared";
import { GridPostList, PostStats } from "@/components/shared";

import {
  useGetPostById,
  useGetUserPosts,
  useDeletePost,
  useCommentPost,
  useGetPostComments
} from "@/lib/react-query/queriesAndMutations";
import { useAuthContext } from "../../context/AuthContext";
import { downloadImage, formatDateString, multiFormatDateString } from "../../utils";

const serverMediaUrl = `${process.env.SERVER_URL}/uploads/`;

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, token } = useAuthContext();
  const [newComment, setNewComment] = useState('');

  const { data: posts, isPending: isLoadingPostById } = useGetPostById(id || '', token);
  const post = posts?.posts;
  const { data: userPosts, isPending: isUserPostLoading } = useGetUserPosts(post?.userId._id, token);
  const { mutateAsync: deletePost, isPending: isLoadingDeletePost } = useDeletePost(token);
  const { mutateAsync: commentPost, isPending: isLoadingCommentPost } = useCommentPost(token);
  const { data: postComments, isPending: isLoadingGetPostComments } = useGetPostComments(id || '', token);
  const [comments, setComments] = useState(postComments);

  const relatedPosts = userPosts?.posts.filter(
    (userPost) => userPost._id !== id
  );

  useEffect(() => {
    setComments(postComments);
  }, [postComments]);

  const handleDeletePost = () => {
    toast.warning(
      <div>
        {isLoadingDeletePost ? (
          <div className="flex-center gap-2">
            <Loader /> Deleting...
          </div>
        ) : (
          <>
            Are you sure you want to delete this post?<br />
            <i className="text-sm">*The generated photo will be deleted as well.</i>
            <div className="mt-2 flex justify-end">
              <button
                className="mr-2 bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  toast.dismiss();
                  deletePost({ postId: id });
                  navigate(-1);
                }}
              >
                Yes
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  toast.dismiss();
                }}
              >
                No
              </button>
            </div>
          </>
        )}
      </div>,
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: true,
        theme: 'dark'
      }
    );
  };

  const handleCommentPost = async (e) => {
    e.stopPropagation();

    try {
      const updatedComments = await commentPost({ postId: id, commentContent: newComment });

      if (updatedComments) {
        setComments(prevComments => ({
          postComments: [
            ...prevComments.postComments,
            {
              ...updatedComments.data,
              userId: {
                _id: user.id,
                username: user.username,
                profilePicture: user.profilePicture,
              },
            },
          ],
        }));
      } else {
        toast.error("Comment failed. Please try again.", {
          position: "top-center",
          hideProgressBar: true,
          theme: "dark",
        });
      }

    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        hideProgressBar: true,
        theme: "dark",
      });
      console.error(error);
    }
  };

  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost">
          <img
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isLoadingPostById || !post ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <div className="xl:flex-row xl:flex">
            <div className="relative post_details-img group">
              <img
                src={post?.imageUrl}
                alt="post image"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-6 right-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <button
                  type='button'
                  onClick={() => downloadImage(post?._id, post?.imageUrl)}
                  className='outline-none bg-transparent border-none'>
                  <img
                    className='w-6 h-6 object-contain'
                    src="/assets/icons/download.svg"
                    alt='download'
                    title="Click to download"
                  />
                </button>
              </div>
            </div>

            <div className="post_details-info">
              <div className="flex-between w-full">
                <Link
                  to={`/profile/${post?.userId?._id}`}
                  className="flex items-center gap-3">
                  <img
                    src={
                      post?.userId?.profilePicture ? `${serverMediaUrl}${post.userId.profilePicture}` : "/assets/icons/profile-placeholder.svg"
                    }
                    alt="creator"
                    className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                  />
                  <div className="flex gap-1 flex-col">
                    <p className="base-medium lg:body-bold text-light-1">
                      {post?.userId?.name}
                    </p>
                    <div className="flex-center gap-2 text-light-3">
                      <p className="subtle-semibold lg:small-regular ">
                        {multiFormatDateString(post?.createdAt)}
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
                </Link>

                <div className={`flex-center gap-3 ${user.id !== post?.userId?._id && "!hidden"}`}>
                  <p>{post.emotions}</p>
                  <Link
                    to={`/update-post/${post?._id}`}>
                    <img
                      src={"/assets/icons/edit.svg"}
                      alt="edit"
                      width={24}
                      height={24}
                    />
                  </Link>
                  <Button
                    onClick={handleDeletePost}
                    variant="ghost"
                    className="post_details-delete_btn">
                    <img
                      src={"/assets/icons/delete.svg"}
                      alt="delete"
                      width={24}
                      height={24}
                    />
                  </Button>
                </div>
              </div>

              <hr className="border w-full border-dark-4/80" />

              <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
                <p>"{post?.dreamDescription}"</p>
                <p>{post?.dreamStory ? <><br /> 📌 {post.dreamStory}</> : ""}</p>
                <p>{post?.interpretedDream ? <><br /> 💡 {post.interpretedDream}</> : ""}</p>
                <ul className="flex gap-1 mt-2">
                  {post?.tags.map((tag, index) => (
                    tag ?
                      <li
                        key={`${tag}${index}`}
                        className="text-light-3 small-regular">
                        #{tag}
                      </li>
                      : ""
                  ))}
                </ul>
              </div>

              <div className="w-full">
                <PostStats post={post} userId={user.id} token={token} />
              </div>
            </div>
          </div>

          <div className="post_details-comment ">
            <hr className="border w-full border-dark-4/80" />
            <h3 className="text-lg font-semibold mb-1">Comments 💬</h3>
            {isLoadingGetPostComments ? <Loader /> :
              <div className="flex flex-col w-full">
                {comments?.postComments.map((comment, index) => (
                  <div key={index} className="mb-4 flex items-center justify-between gap-2">
                    <div className="flex flex-row gap-2">
                      <Link to={`/profile/${comment?.userId?._id}`} className="min-w-8">
                        <img
                          src={comment?.userId?.profilePicture ? `${serverMediaUrl}${comment.userId.profilePicture}` : "/assets/icons/profile-placeholder.svg"}
                          alt="user"
                          className={`w-8 h-8 rounded-full ${comment?.userId?._id === post?.userId?._id && `border-solid border-2 border-primary-500`}`}
                          title={`${comment?.userId?._id === post?.userId?._id && `Dreamer`}`}
                        />
                      </Link>
                      <p className="text-light-3 text-sm">@{comment?.userId?.username}:</p>
                      <p className="text-purple-100 text-sm lg:text-base break-all" >{comment.commentContent}</p>
                    </div>
                    <p className="text-light-4 text-xs min-w-32">
                      {multiFormatDateString(comment?.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            }
            <div className="mb-4 flex items-center w-full">
              <img
                src={user.profilePicture ? `${serverMediaUrl}${user.profilePicture}` : "/assets/icons/profile-placeholder.svg"}
                alt="user"
                className="w-8 h-8 rounded-full mr-4"
              />
              <Input
                placeholder="Add a comment..."
                type="text"
                className="shad-input"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newComment !== "") {
                    e.preventDefault();
                    handleCommentPost(e);
                  }
                }}
                tabIndex="0"
                maxLength={50}
              />
              {isLoadingCommentPost ?
                <Loader />
                :
                <img
                  src={"/assets/icons/send.svg"}
                  alt="send"
                  width={20}
                  height={20}
                  onClick={(e) => {
                    if (newComment !== "") {
                      handleCommentPost(e);
                    }
                  }}
                  className={`ml-4 ${newComment === "" ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:opacity-50'}`}
                />
              }
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          More Related Posts
        </h3>
        {isUserPostLoading || !relatedPosts ? (
          <Loader />
        ) : (
          <GridPostList posts={relatedPosts} />
        )}
      </div>
    </div>
  );
};

export default PostDetails;