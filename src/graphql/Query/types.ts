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

type TravelPlan_get_args = {
    start: string;
    end: string;
}

type StopSearch = {
    name: string;
    limit: number;
}

export { Login, LoginPayload, TravelPlan_get_args, StopSearch }
