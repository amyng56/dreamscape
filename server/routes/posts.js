import express from 'express';

import requireAuth from '../middleware/auth.js';
import { getAllPosts, createPost, updatePost, deletePost, getRecentPosts, getInfinitePosts, getAllFollowerPosts, getSearchPosts, getPostById, getUserPosts, likePost, collectPost, uncollectPost, commentPost, getPostCommments } from '../controllers/posts.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getAllPosts);

router.post('/create', createPost);
router.patch('/update', updatePost);
router.post('/delete', deletePost);
router.get('/recent', getRecentPosts);
router.get('/infinite', getInfinitePosts);
router.get('/followers', getAllFollowerPosts);
router.get('/search', getSearchPosts);
router.get('/:id', getPostById);
router.get('/user-posts/:id', getUserPosts);
router.patch('/like-post/:postId', likePost);
router.post('/collect-post', collectPost);
router.post('/uncollect-post', uncollectPost);
router.post('/comment-post', commentPost);
router.get('/comments/:postId', getPostCommments);

export default router;