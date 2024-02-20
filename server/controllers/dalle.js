import OpenAI from "openai";
import * as dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const generateImage = async (req, res) => {
    try {
        const { prompt } = req.body;
        const aiResponse = await openai.images.generate({
            model: "dall-e-2",
            prompt: `${prompt}`,
            n: 1,
            size: "1024x1024",
            response_format: 'b64_json',
        });
        const image = aiResponse.data[0].b64_json;

        res.status(200).json({
            photo: image
        });

    } catch (error) {
        console.log(error);
        res.status(500).send(error?.response.data.error.message);
    }
};

export const interpretDream = async (req, res) => {
    try {
        const { prompt } = req.body;
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "system",
                    "content": "Given the dream story, your job is to interpret it."
                },
                {
                    "role": "user",
                    "content": `${prompt}`
                }
            ],
            temperature: 1,
            max_tokens: 1024,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: response.choices?.[0]?.message?.content
        });

    } catch (error) {
        console.log(error);
        res.status(500).send(error?.response.data.error.message);
    }
};