import { Leg } from '../../astar/index';
import { Stop, StopRoute } from '../types';
import { stopLoader, stopRouteLoader } from '../loaders';

export default {
    start: async (parent: Leg): Promise<Stop> => {
        return await stopLoader.load(parent.start);
    },

    end: async (parent: Leg): Promise<Stop> => {
        return await stopLoader.load(parent.end);
    },

    instructions: async (parent: Leg): Promise<string> => {
        let start = await stopLoader.load(parent.start);
        let end = await stopLoader.load(parent.end);

        if (parent.walk) {
            // Walking between stops
            return `Walk from ${start.name} to ${end.name}`;
        } else {
            // Taking a 
            let route: StopRoute = await stopRouteLoader.load(start.id+parent.routes[0]);
            return `Take the ${route.number} ${route.headsign} from ${start.name} to ${end.name}`;
        }
    } 

}