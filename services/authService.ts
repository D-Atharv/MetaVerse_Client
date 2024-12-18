interface AuthResponse {
    token: string;
}

interface ErrorResponse {
    message: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const login = async (username: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/login`, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const error: ErrorResponse = await response.json();
        throw new Error(error.message);
    }

    return response.json();
};

export const signIn = async (username: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const error: ErrorResponse = await response.json();
        throw new Error(error.message);
    }

    return response.json();
};

export const logout = (): void => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
};
