import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    bio: { type: String },
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const dreamEntrySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dreamDescription: { type: String, required: true },
    imageUrl: { type: String, required: true },
    interpretedDream: { type: String },
    dreamStory: { type: String },
    dateTime: { type: Date, default: Date.now },
    location: { type: String },
    tags: { type: [String], default: [] },
    emotions: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: { type: [String], default: [] },
}, { timestamps: true });

const postcommentSchema = new Schema({
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    commentContent: { type: String, required: true },
}, { timestamps: true });

const postCollectionSchema = new Schema({
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,
    unique: { index: { postId: 1, userId: 1 }, message: 'Combination of postId and userId must be unique' }
});

//Create models
const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', dreamEntrySchema);
const PostComment = mongoose.model('Comment', postcommentSchema);
const PostCollection = mongoose.model('PostCollection', postCollectionSchema);

export {
    User,
    Post,
    PostComment,
    PostCollection
};
