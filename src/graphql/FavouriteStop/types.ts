import { Document } from "mongoose";

interface FavouriteStop extends Document {
    user: string;           // ref
    stop: string;           // ref
    stopRoutes: string[];   // ref
}

export { FavouriteStop };