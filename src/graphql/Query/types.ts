import { User } from '../types';

interface Login {
    email: string;
    password: string;
}

interface LoginPayload {
    user: User;
    token: string;
    expiration: number;
}

export { Login, LoginPayload }
