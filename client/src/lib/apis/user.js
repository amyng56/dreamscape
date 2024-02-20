import { jwtDecode } from "jwt-decode";

import { generateRandomPassword } from "../../utils";

const baseUrl = process.env.SERVER_URL;

//signin thru google
export const createOrGetUser = async (response) => {
    const decoded = jwtDecode(response.credential);

    //desturcture values in response.credential
    // const { sub, name, email, picture, given_name } = decoded;

    // const password = generateRandomPassword();

    // const user = {
    //     _id: sub,
    //     username: name,
    //     name: given_name,
    //     email: email,
    //     profilePicture: picture,
    //     password: password
    // };

    // createUser(user);

    console.log(decoded);
};

export const createUser = async (formData) => {
    try {
        const response = await fetch(`${baseUrl}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            return response.json();
        } else {
            const errorMessage = await response.json();
            throw new Error(errorMessage.message);
        }
    } catch (error) {
        console.error('Error creating user account:', error);
        throw error;
    }
};

export const signInUser = async (formData) => {
    try {
        const response = await fetch(`${baseUrl}/api/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            // dispatch({ type: 'LOGIN', payload: response.json() });
            return response.json();
        } else {
            const errorMessage = await response.json();
            throw new Error(errorMessage.message);
        }
    } catch (error) {
        console.error('Error signing in user account:', error);
        throw error;
    }
};

export const getUsers = async (limit, token) => {
    try {
        const response = await fetch(`${baseUrl}/api/user/get-users/${limit}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to fetch user data');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

export const getCurrentUser = async (token) => {
    try {
        const response = await fetch(`${baseUrl}/api/user`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to fetch current user data');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

export const getUserById = async (userId, token) => {
    try {
        const response = await fetch(`${baseUrl}/api/user/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to fetch user data');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

export const getFollowingUsersById = async (userId, token) => {
    try {
        const response = await fetch(`${baseUrl}/api/user/get-following-users/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to fetch user data');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

export const getFollowersById = async (userId, token) => {
    try {
        const response = await fetch(`${baseUrl}/api/user/get-followed-by-users/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to fetch user data');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

export const updateUser = async (user, token) => {
    try {
        const formData = new FormData();
        Object.keys(user).forEach(key => {
            if (key === 'file') {
                formData.append(key, user[key][0]); // Assuming 'file' is an array of File objects
            } else {
                formData.append(key, user[key]);
            }
        });

        const response = await fetch(`${baseUrl}/api/user/${user.userId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                // 'Content-Type': 'application/json'
            },
            // body: JSON.stringify(user)
            body: formData
        });

        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to update user profile');
        }
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

export const followUser = async (userId, token) => {
    try {
        const response = await fetch(`${baseUrl}/api/user/follow/${userId}`, {
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
        console.error('Error following user: ', error);
        throw error;
    }
};

export const unfollowUser = async (userId, token) => {
    try {
        const response = await fetch(`${baseUrl}/api/user/unfollow/${userId}`, {
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
        console.error('Error unfollowing user: ', error);
        throw error;
    }
};