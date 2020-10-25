type Login = {
    email: string;
    password: string;
}

type StopSearch = {
    name: string;
    skip: number;
    limit: number;
}

export { Login, StopSearch }
