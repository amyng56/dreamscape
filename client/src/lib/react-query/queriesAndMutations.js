import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
} from "@tanstack/react-query";

import { createUser, signInUser, getUserById, updateUser, getUsers, getCurrentUser, followUser, unfollowUser, getFollowingUsersById, getFollowersById } from "../apis/user";
import { createPost, updatePost, deletePost, getRecentPosts, getInfinitePosts, getSearchPosts, getAllFollowerPosts, likePost, collectPost, uncollectPost, getPostById, getUserPosts, commentPost, getPostComments } from "../apis/post";
import { generateImage, interpretDream } from "../apis/dalle";
import { QUERY_KEYS } from "@/lib/react-query/queryKeys";

// AUTH QUERIES
export const useCreateUser = () => {
    return useMutation({
        mutationFn: (user) => createUser(user),
    });
};

export const useSignInUser = () => {
    return useMutation({
        mutationFn: (user) => signInUser(user),
    });
};

// DALLE QUERIES
export const useGenerateImage = (token) => {
    return useMutation({
        mutationFn: (form) => generateImage(form, token),
        enabled: !!token,
    });
};

export const useInterpretDream = (token) => {
    return useMutation({
        mutationFn: (form) => interpretDream(form, token),
        enabled: !!token,
    });
};

// POST QUERIES
export const useCreatePost = (token) => {
    return useMutation({
        mutationFn: (post) => createPost(post, token),
        enabled: !!token,
    });
};

export const useUpdatePost = (token) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post) => updatePost(post, token),
        enabled: !!token,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?._id],
            });
        },
    });
};

export const useDeletePost = (token) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (postId) => deletePost(postId, token),
        enabled: !!token,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ALL_FOLLOWER_POSTS],
            });
        },
    });
};

export const useGetRecentPosts = (token) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: () => getRecentPosts(token),
        enabled: !!token,
    });
};

export const useGetPosts = (token) => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: ({ pageParam }) => getInfinitePosts(pageParam, token),
        enabled: !!token,
        getNextPageParam: (lastPage) => {
            // If there's no data, there are no more pages.
            if (lastPage && lastPage.posts.length === 0) {
                return null;
            }

            return lastPage.page + 1;
        },
    });
};

export const useSearchPosts = (searchParam, token) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchParam],
        queryFn: () => getSearchPosts(searchParam, token),
        enabled: !!searchParam && !!token,
    });
};

export const useGetPostById = (postId, token) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostById(postId, token),
        enabled: !!postId && !!token,
    });
};

export const useGetUserPosts = (userId, token) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
        queryFn: () => getUserPosts(userId, token),
        enabled: !!userId && !!token,
    });
};

export const useGetAllFollowerPosts = (token) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_FOLLOWER_POSTS],
        queryFn: () => getAllFollowerPosts(token),
        enabled: !!token,
    });
};

export const useLikePost = (token) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (postId) => likePost(postId, token),
        enabled: !!token,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?._id],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ALL_FOLLOWER_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER],
            });
        },
    });
};

export const useCollectPost = (token) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (postId) => collectPost(postId, token),
        enabled: !!token,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ALL_FOLLOWER_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER],
            });
        },
    });
};

export const useUncollectPost = (token) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (postCollectionId) => uncollectPost(postCollectionId, token),
        enabled: !!token,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ALL_FOLLOWER_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER],
            });
        },
    });
};

export const useCommentPost = (token) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (postComment) => commentPost(postComment, token),
        enabled: !!token,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_COMMENTS_BY_POST_ID, data?.postId],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.postId],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_POSTS, data?.userId],
            });
        },
    });
};

export const useGetPostComments = (postId, token) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_COMMENTS_BY_POST_ID, postId],
        queryFn: () => getPostComments(postId, token),
        enabled: !!token,
    });
};

// USER QUERIES
export const useGetCurrentUser = (token) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: () => getCurrentUser(token),
        enabled: !!token,
    });
};

export const useGetUsers = (limit, token) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USERS],
        queryFn: () => getUsers(limit, token),
        enabled: !!token,
    });
};

export const useGetUserById = (userId, token) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
        queryFn: () => getUserById(userId, token),
        enabled: !!userId && !!token,
    });
};

export const useGetFollowingUsersById = (userId, token) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_FOLLOWING_USERS_BY_ID, userId],
        queryFn: () => getFollowingUsersById(userId, token),
        enabled: !!userId && !!token,
    });
};

export const useGetFollowersById = (userId, token) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_FOLLOWERS_BY_ID, userId],
        queryFn: () => getFollowersById(userId, token),
        enabled: !!userId && !!token,
    });
};

export const useUpdateUser = (token) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user) => updateUser(user, token),
        enabled: !!token,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?._id],
            });
        },
    });
};

export const useFollowUser = (token) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId) => followUser(userId, token),
        enabled: !!token,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USERS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_BY_ID],
            });
        },
    });
};

export const useUnfollowUser = (token) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId) => unfollowUser(userId, token),
        enabled: !!token,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USERS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_BY_ID],
            });
        },
    });
};
