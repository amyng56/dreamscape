import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';

import { User, Post, PostCollection, PostComment } from '../mongodb/models/index.js';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getAllPosts = async (req, res) => {
    try {
        const userId = req.userId;
        const posts = await Post.find({ userId: userId });

        res.status(200).json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
};

export const getRecentPosts = async (req, res) => {
    try {
        const posts = await Post
            .find({})
            .populate('userId', '-password')
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
};

export const getInfinitePosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 9;

        const posts = await Post
            .find({})
            .populate('userId', '-password')
            .sort({ updatedAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        res.status(200).json({ posts, page: page });
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
};

export const getSearchPosts = async (req, res) => {
    try {
        const searchString = req.query.search || '';
        const query = {
            $or: [
                { dreamDescription: { $regex: searchString, $options: 'i' } },
                { dreamStory: { $regex: searchString, $options: 'i' } },
                { location: { $regex: searchString, $options: 'i' } },
                { tags: { $regex: searchString, $options: 'i' } },
            ],
        };

        const posts = await Post
            .find(query)
            .populate('userId', '-password')
            .sort({ updatedAt: -1 });

        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
};

export const getPostById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'Invalid post ID format' });
        }

        const posts = await Post.findById(id)
            .populate('userId', '-password');

        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'Invalid user ID format' });
        }

        const posts = await Post.find({ userId: id })
            .sort({ createdAt: -1 })
            .populate('userId', '-password');

        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
};

export const getAllFollowerPosts = async (req, res) => {
    try {
        const userId = req.userId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(404).json({ error: 'Invalid user ID format' });
        }

        const user = await User.findById(userId).select('following');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const following = user.following;
        following.push(userId);

        const posts = await Post.find({ userId: following })
            .sort({ createdAt: -1 })
            .populate('userId', '-password');

        res.status(200).json({ posts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
    }
};

export const createPost = async (req, res) => {
    try {
        const userId = req.userId;
        let { dreamDescription, imageUrl, interpretedDream, dreamStory, dateTime, location, tags, emotions } = req.body;
        const cloudinaryUrl = await cloudinary.uploader.upload(imageUrl);

        //Convert tags into array
        tags = tags?.replace(/ /g, "").split(",") || [];

        const newPost = await Post.create({
            userId,
            dreamDescription,
            imageUrl: cloudinaryUrl.url,
            interpretedDream,
            dreamStory,
            dateTime,
            location,
            tags,
            emotions,
        });

        res.status(201).json({ success: true, data: newPost });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
    }
};

export const updatePost = async (req, res) => {
    try {
        const userId = req.userId;
        let { dreamDescription, imageUrl, interpretedDream, dreamStory, dateTime, location, tags, emotions, postId } = req.body;

        //Check if the post exists
        const existingPost = await Post.findById(postId);

        if (!existingPost) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        //Check if the user is the owner of the post
        if (existingPost.userId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized to update this post' });
        }

        //Check if imageUrl is different from the existing one
        if (imageUrl !== existingPost.imageUrl) {
            // Delete the previous image from Cloudinary
            const publicId = existingPost.imageUrl.split('/').pop().split('.')[0];
            const deletedImage = await cloudinary.uploader.destroy(publicId);

            if (deletedImage.result !== "ok") {
                return res.status(500).json({ success: false, message: 'Failed to delete image from Cloudinary' });
            }

            //Upload the new image to Cloudinary
            const cloudinaryUrl = await cloudinary.uploader.upload(imageUrl);
            existingPost.imageUrl = cloudinaryUrl.url;
        }

        //Convert tags into array
        tags = tags?.replace(/ /g, "").split(",") || [];

        //Update post fields
        existingPost.dreamDescription = dreamDescription;
        existingPost.interpretedDream = interpretedDream;
        existingPost.dreamStory = dreamStory;
        existingPost.dateTime = dateTime;
        existingPost.location = location;
        existingPost.tags = tags;
        existingPost.emotions = emotions;

        //Save the updated post
        const updatedPost = await existingPost.save();

        res.status(201).json({ success: true, data: updatedPost });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
    }
};

export const deletePost = async (req, res) => {
    try {
        const userId = req.userId;
        const { postId } = req.body;

        //Check if the post exists and belongs to the user
        const postToDelete = await Post.findOne({ _id: postId, userId });

        if (!postToDelete) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        //Delete image from Cloudinary
        const publicId = postToDelete.imageUrl.split('/').pop().split('.')[0];
        const deletedImage = await cloudinary.uploader.destroy(publicId);

        if (deletedImage.result !== "ok") {
            return res.status(500).json({ success: false, message: 'Failed to delete image from Cloudinary' });
        }

        //Delete the post from the database
        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({ success: false, message: 'Post not found in the database' });
        }

        //Check and delete all corresponding entries in the postCollection collection
        const deletedPostCollectionEntries = await PostCollection.deleteMany({ postId });

        res.status(201).json({ success: true, data: deletedPost });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
    }
};

export const likePost = async (req, res) => {
    try {
        const userId = req.userId.toString();
        const { postId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(404).json({ error: 'Invalid post ID format' });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: `Post not found with the provided ID: ${postId}` });
        }

        const index = post.likes.findIndex((id) => id.toString() === userId);
        if (index === -1) {
            post.likes.push(userId);
        } else {
            post.likes = post.likes.filter((id) => id.toString() !== userId);
        }

        const updatedPost = await Post.findOneAndUpdate({ _id: postId }, post, { new: true });

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
};

export const collectPost = async (req, res) => {
    try {
        const userId = req.userId;
        const { postId } = req.body;

        const newPostCollection = await PostCollection.create({
            userId,
            postId
        });

        res.status(201).json({ success: true, data: newPostCollection });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
    }
};

export const uncollectPost = async (req, res) => {
    try {
        const { postCollectionId } = req.body;

        const deletedCollection = await PostCollection.findByIdAndDelete(postCollectionId);

        if (!deletedCollection) {
            return res.status(404).json({ message: 'Post collection not found' });
        }

        res.status(201).json({ success: true, data: deletedCollection });
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
};

export const commentPost = async (req, res) => {
    try {
        const userId = req.userId;
        const { postId, commentContent } = req.body;

        const newPostComment = await PostComment.create({
            userId,
            postId,
            commentContent
        });

        res.status(201).json({ success: true, data: newPostComment });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
    }
};

export const getPostCommments = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId).populate('userId', 'name username profilePicture');

        if (!post) {
            return res.status(404).json({ error: `Post not found with the provided ID: ${postId}` });
        }

        const postComments = await PostComment.find({ postId: postId })
            .sort({ createdAt: 1 })
            .populate('userId', 'name username profilePicture');

        res.status(201).json({ postComments });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
    }
};