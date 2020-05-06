import { Document } from "mongoose";

interface Route extends Document { 
    number: string;
    type: number;
    backgroundColour: string;
    textColour: string;     
    trips: string[];        // ref
    stops: string[];        // ref
}

export { Route };