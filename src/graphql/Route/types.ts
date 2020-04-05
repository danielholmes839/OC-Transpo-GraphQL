import { Document } from "mongoose";

interface Route extends Document { 
    number: string;
    routeType: number;
    colour: string;
    textColour: string;     
    trips: string[];        // ref
    stops: string[];        // ref
}

export { Route };