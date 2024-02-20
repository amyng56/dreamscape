const baseUrl = process.env.SERVER_URL;

const createPost = async (post, token) => {
    try {
        const response = await fetch(`${baseUrl}/api/post/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(post)
        });

        if (response.ok) {
            return response.json();
        } else {
            const errorMessage = await response.json();
            throw new Error(errorMessage.message);
        }
    } catch (error) {
        console.error('Error sharing dream:', error);
        throw error;
    }
};

const updatePost = async (post, token) => {
    try {
        const response = await fetch(`${baseUrl}/api/post/update`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(post)
        });

        if (response.ok) {
            return response.json();
        } else {
            const errorMessage = await response.json();
            throw new Error(errorMessage.message);
        }
    } catch (error) {
        console.error('Error updating dream:', error);
        throw error;
    }
};

const deletePost = async (postId, token) => {
    try {
        const response = await fetch(`${baseUrl}/api/post/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(postId)
        });

        if (response.ok) {
            return response.json();
        } else {
            const errorMessage = await response.json();
            throw new Error(errorMessage.message);
        }
    } catch (error) {
        console.error('Error deleting dream(post):', error);
        throw error;
    }
};

const getRecentPosts = async (token) => {
    try {
        const response = await fetch(`${baseUrl}/api/post/recent`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to fetch post data');
        }
    } catch (error) {
        console.error('Error fetching post data:', error);
        throw error;
    }
};

const getInfinitePosts = async (pageParam = 1, token) => {
    try {
        const response = await fetch(`${baseUrl}/api/post/infinite?page=${pageParam}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to fetch post data');
        }
    } catch (error) {
        console.error('Error fetching post data:', error);
        throw error;
    }
};

const getSearchPosts = async (searchParam = '', token) => {
    try {
        const response = await fetch(`${baseUrl}/api/post/search?search=${searchParam}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to fetch search post data');
        }
    } catch (error) {
        console.error('Error fetching search post data:', error);
        throw error;
    }
};

const getPostById = async (postId, token) => {
    try {
        const response = await fetch(`${baseUrl}/api/post/${postId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to fetch post data');
        }
    } catch (error) {
        console.error('Error fetching post data:', error);
        throw error;
    }
};

const getUserPosts = async (userId, token) => {
    try {
        const response = await fetch(`${baseUrl}/api/post/user-posts/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to fetch user post data');
        }
    } catch (error) {
        console.error('Error fetching user post data:', error);
        throw error;
    }
};

const getAllFollowerPosts = async (token) => {
    try {
        const response = await fetch(`${baseUrl}/api/post/followers`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to fetch user post data');
        }
    } catch (error) {
        console.error('Error fetching user post data:', error);
        throw error;
    }
};

const likePost = async (postId, token) => {
    try {
        const response = await fetch(`${baseUrl}/api/post/like-post/${postId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            return response.json();
        } else {
            const errorMessage = await response.json();
            throw new Error(errorMessage.message);
        }
    } catch (error) {
        console.error('Error liking post: ', error);
        throw error;
    }
};

const collectPost = async (postId, token) => {
    try {
        const response = await fetch(`${baseUrl}/api/post/collect-post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(postId)
        });

        if (response.ok) {
            return response.json();
        } else {
            const errorMessage = await response.json();
            throw new Error(errorMessage.message);
        }
    } catch (error) {
        console.error('Error collecting post: ', error);
        throw error;
    }
};

const uncollectPost = async (postCollectionId, token) => {
    try {
        const response = await fetch(`${baseUrl}/api/post/uncollect-post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(postCollectionId)
        });

        if (response.ok) {
            return response.json();
        } else {
            const errorMessage = await response.json();
            throw new Error(errorMessage.message);
        }
    } catch (error) {
        console.error('Error uncollecting post: ', error);
        throw error;
    }
};

const commentPost = async (postComment, token) => {
    try {
        const response = await fetch(`${baseUrl}/api/post/comment-post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(postComment)
        });

        if (response.ok) {
            return response.json();
        } else {
            const errorMessage = await response.json();
            throw new Error(errorMessage.message);
        }
    } catch (error) {
        console.error('Error commenting post: ', error);
        throw error;
    }
};

const getPostComments = async (postId, token) => {
    try {
        const response = await fetch(`${baseUrl}/api/post/comments/${postId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to fetch post comments data');
        }
    } catch (error) {
        console.error('Error fetching user post data:', error);
        throw error;
    }
};
export {
    createPost,
    updatePost,
    deletePost,
    getRecentPosts,
    getInfinitePosts,
    getSearchPosts,
    likePost,
    collectPost,
    uncollectPost,
    getPostById,
    getUserPosts,
    getAllFollowerPosts,
    commentPost,
    getPostComments
};
