import { User } from '../types';

type Login = {
    email: string;
    password: string;
}

type LoginPayload = {
    user: User;
    token: string;
    expiration: number;
}

type TravelPlanInput = {
    input: {
        start: string;
        end: string;
    }
}

type StopSearch = {
    name: string;
    limit: number;
}

export { Login, LoginPayload, TravelPlanInput, StopSearch }
