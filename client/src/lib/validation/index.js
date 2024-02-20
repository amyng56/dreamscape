import { z } from "zod";

export const SignupValidation = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(4).max(14, { message: "Username must be between 3 and 14 characters." }),
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});


export const SigninValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export const ProfileValidation = z.object({
  file: z.custom(),
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  username: z.string().min(3, { message: "Name must be at least 3 characters." }),
  email: z.string().email(),
  bio: z.string(),
});

export const PostValidation = z.object({
  dreamDescription: z.string().min(10, { message: "Minimum 10 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
  imageUrl: z.custom(),
  // .min(1, { message: "Please visualize your dream first!" }),
  interpretedDream: z.string(),
  dreamStory: z.string(),
  dateTime: z.optional(z.date()),
  // .max(new Date(), { message: "Future dream?" }),
  location: z.string(),
  tags: z.string(),
  emotions: z.string().max(6, 'Maximum 3 emojis allowed'),
});
