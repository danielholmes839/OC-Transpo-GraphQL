import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { plan, TravelPlan } from '../../astar/index';

import { stopLoader, stopRouteLoader, routeLoader, tripLoader, userLoader, serviceLoader } from '../loaders';
import { Login, LoginPayload, TravelPlanInput } from './types'
import { Stop, StopRoute, Route, Trip, User, Service, Context } from '../types';
import { UserCollection } from '../collections';


interface ID {
	id: string;
}

const createToken = (user: User): string => {
	/* Create a Json Web Token */
	return jwt.sign(
		{ user: user.id, email: user.email }, process.env.SECRET_KEY,
		{ expiresIn: '24h' }
	);
};

const resolvers = {
	stopGet: (_: void, args: ID): Promise<Stop> => stopLoader.load(args.id),
	stopRouteGet: (_: void, args: ID): Promise<StopRoute> => stopRouteLoader.load(args.id),
	routeGet: (_: void, args: ID): Promise<Route> => routeLoader.load(args.id),
	tripGet: (_: void, args: ID): Promise<Trip> => tripLoader.load(args.id),
	serviceGet: (_: void, args: ID): Promise<Service> => serviceLoader.load(args.id),

	// User Queries
	userGet: (_: void, args: void, context: Context): Promise<User> => {
		if (context.authenticated) return userLoader.load(context.user);
		throw new Error('Request Not Authenticated');
	},

	userLogin: async (_: void, login: Login): Promise<LoginPayload> => {
		/* Login a user and return a json web token */
		const user: User = await UserCollection.findOne({ email: login.email });				// Find existing user
		if (!user) throw new Error('Authentication Failed');
		const authenticated: boolean = await bcrypt.compare(login.password, user.password);		// Password match
		if (!authenticated) throw new Error('Authentication Failed');

		return {
			user: user,
			token: createToken(user),
			expiration: 24
		}
	},

	createTravelPlan: async (_: void, { input }: TravelPlanInput): Promise<TravelPlan> => {
		let [start, end] = <Stop[]>await stopLoader.loadMany([input.start, input.end]);
		if (start == null || end == null) return null;
		return plan(start.id, end.id);
	}
}

export default resolvers;