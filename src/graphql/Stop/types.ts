import { Document } from "mongoose";

interface Stop extends Document { 
    id: string;
    name: string;
    code: string;
    lat: number;
    lon: number;
    routes: string[];           // ref
    stopRoutes: string[];       // ref
}

export { Stop };