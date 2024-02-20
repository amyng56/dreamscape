const baseUrl = process.env.SERVER_URL;

export const generateImage = async (prompt, token) => {
    if (prompt) {
        try {
            const response = await fetch(`${baseUrl}/api/dalle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    prompt: prompt
                })
            });

            const data = await response.json();

            return (`data:image/jpeg;base64,${data.photo}`);
        } catch (error) {
            console.error('Error generating image', error);
            throw error;
        }
    } else {
        throw new Error('Please enter prompt to visualize your Dream 💭');
    }
};

export const interpretDream = async (prompt, token) => {
    if (prompt) {
        try {
            const response = await fetch(`${baseUrl}/api/dalle/interpret-dream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    prompt: prompt
                })
            });

            if (response.ok) {
                return response.json();
            } else {
                const errorMessage = await response.json();
                throw new Error(errorMessage.message);
            }
        } catch (error) {
            console.error('Error interpreting dream', error);
            throw error;
        }
    } else {
        throw new Error('Please enter prompt to visualize your Dream 💭');
    }
};
