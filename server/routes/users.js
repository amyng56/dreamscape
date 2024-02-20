import express from 'express';
import multer from 'multer';

import requireAuth from '../middleware/auth.js';
import {
    getNUsers,
    getUserById,
    updateUser,
    getCurrentUser,
    followUser,
    unfollowUser,
    getFollowersById,
    getFollowingUsersById
} from '../controllers/users.js';

const router = express.Router();

// Multer storage configuration for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.use(requireAuth);

router.get('/get-users/:n', getNUsers);
router.get('/', getCurrentUser);
router.get('/:id', getUserById);
router.get('/get-followed-by-users/:id', getFollowersById);
router.get('/get-following-users/:id', getFollowingUsersById);
router.patch('/:id', upload.single('file'), updateUser);
router.patch('/follow/:userIdToFollow', followUser);
router.patch('/unfollow/:userIdToUnfollow', unfollowUser);

export default router;
