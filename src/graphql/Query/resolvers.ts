import { stopLoader, routeLoader } from '../loaders';
import { Stop, Route } from '../types';

const stopGet = async (_: void, { stop }: { stop: string }): Promise<Stop> => {
  return await stopLoader.load(stop);
}

const routeGet = async (_: void, { route }: { route: string }): Promise<Route> => {
  return await routeLoader.load(route);
}

export default {
  stopGet, routeGet
}