import FileSaver from 'file-saver';

import { dreamPrompts } from '../constants';

export function getRandomPrompt(prompt) {
    const randomIndex = Math.floor(Math.random() * dreamPrompts.length);
    const randomPrompt = dreamPrompts[randomIndex];

    if (randomPrompt === prompt) return getRandomPrompt(prompt);

    return randomPrompt;
};

export async function downloadImage(_id, photo) {
    FileSaver.saveAs(photo, `download-${_id}.jpg`);
};

//for google login
export function generateRandomPassword() {
    //Generate a random string of length 8
    return Math.random().toString(36).slice(-8);
}

export const convertFileToUrl = (file) => URL.createObjectURL(file);

export const checkIsLiked = (likeList, userId) => {
    return likeList.includes(userId);
};

export const multiFormatDateString = (timestamp = "") => {
    const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
    const date = new Date(timestampNum * 1000);
    const now = new Date();

    const diff = now.getTime() - date.getTime();
    const diffInSeconds = diff / 1000;
    const diffInMinutes = diffInSeconds / 60;
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;

    switch (true) {
        case Math.floor(diffInDays) >= 30:
            return formatDateString(timestamp);
        case Math.floor(diffInDays) === 1:
            return `${Math.floor(diffInDays)} day ago`;
        case Math.floor(diffInDays) > 1 && diffInDays < 30:
            return `${Math.floor(diffInDays)} days ago`;
        case Math.floor(diffInHours) >= 1:
            return `${Math.floor(diffInHours)} hours ago`;
        case Math.floor(diffInMinutes) >= 1:
            return `${Math.floor(diffInMinutes)} minutes ago`;
        default:
            return "Just now";
    }
};

export const formatDateString = (dateString) => {
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
};