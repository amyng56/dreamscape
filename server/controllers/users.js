import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

import { User, Post, PostCollection } from '../mongodb/models/index.js';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' })
};

export const signUpUser = async (req, res) => {
    const { email, password, name, username } = req.body;

    try {
        const emailExists = await User.findOne({ email });
        const usernameExists = await User.findOne({ username });

        if (emailExists) {
            return res.status(400).json({ message: "Email already exists." });
        }

        if (usernameExists) {
            return res.status(400).json({ message: "Username already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({ email, password: hashedPassword, name, username });

        const token = createToken(newUser._id);

        res.status(200).json({ email, token });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};

export const signInUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User doesn't exist." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials. Please try again." });

        const token = createToken(user._id);

        const userWithoutSensitiveInfo = {
            id: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
        };

        res.status(200).json({ user: userWithoutSensitiveInfo, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getNUsers = async (req, res) => {
    try {
        let users = [];
        if (req.params.n === 'all') {
            users = await User.find({});
        } else {
            const n = parseInt(req.params.n, 10);
            users = await User.find({}).limit(n);
        }

        res.status(200).json({ users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
    }
};

export const getFollowingUsersById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'Invalid user ID format' });
        }

        const users = await User.findById(id)
            .select('following')
            .populate('following', '-password');

        const followingUsers = users.following;

        res.status(200).json({ users: followingUsers });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
    }
};


export const getFollowersById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'Invalid user ID format' });
        }

        const users = await await User.find({ following: id }).select('-password');

        res.status(200).json({ users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(404).json({ error: 'Invalid user ID format' });
        }

        const user = await User.aggregate([
            { $match: { _id: userId } },
            {
                $lookup: {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'posts',
                },
            },
            // {
            //     $lookup: {
            //         from: 'posts',
            //         localField: '_id',
            //         foreignField: 'likes',
            //         as: 'liked',
            //     },
            // },
            // {
            //     $lookup: {
            //         from: 'postcollections',
            //         localField: '_id',
            //         foreignField: 'userId',
            //         as: 'collections',
            //     },
            // },
            { $project: { password: 0 } },
            { $limit: 1 },
        ]);

        const likedPosts = await Post
            .find({ likes: userId })
            .populate("userId", "name profilePicture");

        const postCollections = await PostCollection
            .find({ userId: userId })
            .populate({
                path: 'postId',
                populate: {
                    path: 'userId',
                    model: 'User',
                    select: 'name profilePicture',
                }
            });

        if (!user) {
            return res.status(404).json({ error: 'User not found with the provided ID' });
        }

        res.status(200).json({ ...user[0], collections: postCollections, liked: likedPosts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'Invalid user ID format' });
        }
        const user = await User.aggregate([
            { $match: { _id: mongoose.Types.ObjectId.createFromHexString(id) } },
            {
                $lookup: {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'posts',
                },
            },
            {
                $lookup: {
                    from: 'postcollections',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'collections',
                },
            },
            {
                $lookup: {
                    from: 'users',
                    let: { userId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ['$$userId', '$following'] },
                            },
                        },
                        {
                            $project: {
                                _id: 1, // Only include the _id field
                            },
                        },
                    ],
                    as: 'followers',
                },
            },
            { $project: { password: 0 } },
            { $limit: 1 },
        ]);

        // const user = await User.findById(id)
        //     .select('-password');
        // // .populate({
        // //     path: 'posts',
        // //     model: 'Post',
        // //     select: 'dreamDescription imageUrl dateTime location tags emotions',
        // //     options: { localField: '_id', foreignField: 'userId', sort: { 'dateTime': -1 } }
        // // });
        // const posts = await Post.find({ userId: id }).populate('userId', 'profilePicture name');

        // user.posts = posts;

        if (!user) {
            return res.status(404).json({ error: 'User not found with the provided ID' });
        }

        res.status(200).json(user[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'Invalid user ID format' })
        }

        const { name, bio } = req.body;
        
        if (req.file) {
            const updatedUser = await User.findByIdAndUpdate(
                id,
                { name, bio, profilePicture: req.file.filename },
                { new: true }
            ).select('-password');

            res.status(200).json(updatedUser);
        } else {
            //Update the user in the database without a new profile picture
            const updatedUser = await User.findByIdAndUpdate(
                id,
                { name, bio },
                { new: true }
            ).select('-password');

            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found with the provided ID ' });
            }

            res.status(200).json(updatedUser);
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const followUser = async (req, res) => {
    try {
        const userId = req.userId;
        const { userIdToFollow } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(userIdToFollow)) {
            return res.status(404).json({ error: 'Invalid user ID format' });
        }

        const user = await User.findById(userId);
        const userToFollow = await User.findById(userIdToFollow);

        if (!user || !userToFollow) {
            return res.status(404).json({ error: "User or follower not found" });
        }

        if (user.following.includes(userIdToFollow)) {
            return res.status(400).json({ message: `User [${userToFollow.name}] is already being followed` });
        }

        user.following.push(userIdToFollow);
        await user.save();

        res.status(200).json({ success: true, message: 'Successfully followed the user' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
    }
};

export const unfollowUser = async (req, res) => {
    try {
        const userId = req.userId;
        const { userIdToUnfollow } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(userIdToUnfollow)) {
            return res.status(404).json({ error: 'Invalid user ID format' });
        }

        const user = await User.findById(userId);
        const userToUnfollow = await User.findById(userIdToUnfollow);

        if (!user || !userToUnfollow) {
            return res.status(404).json({ error: "User or follower not found" });
        }

        if (!user.following.includes(userIdToUnfollow)) {
            return res.status(400).json({ message: `User ${userToUnfollow.name} is not being followed` });
        }

        user.following = user.following.filter(id => id.toString() !== userIdToUnfollow);
        await user.save();

        res.status(200).json({ success: true, message: 'Successfully unfollowed the user' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
    }
};