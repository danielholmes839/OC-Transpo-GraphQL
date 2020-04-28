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

interface TravelPlanInput {
    input: {
        start: string;
        end: string;
    }
}

export { Login, LoginPayload, TravelPlanInput }
