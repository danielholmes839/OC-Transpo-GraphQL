import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Context } from 'middleware'
import { plan, TravelPlan } from 'astar';
import { Stop, StopRoute, Route, Trip, User, Service } from 'api/types';
import { UserModel, StopModel } from 'api/models';
import { Login, LoginPayload, TravelPlan_get_args, StopSearch } from './types'

// Query Resolvers
export default {
	// Stop Queries
	Stop_get: (_: void, args: { stop: string }, context: Context): Promise<Stop> => {
		const { stopLoader } = context.loaders
		return stopLoader.load(args.stop);
	},

	Stop_getMany: (_: void, args: { stops: string[] }, context: Context): Promise<(Stop | Error)[]> => {
		const { stopLoader } = context.loaders
		return stopLoader.loadMany(args.stops);
	},

	Stop_search: async (_: void, { name, limit }: StopSearch): Promise<Stop[]> => {
		if (!limit) limit = 3;
		return StopModel.find(
			{ $text: { $search: name } },
			{ score: { $meta: 'textScore' } }
		).sort(
			{ score: { $meta: 'textScore' } }
		).limit(limit);
	},

	// Route Queries
	Route_get: (_: void, args: { route: string }, context: Context): Promise<Route> => {
		const { routeLoader } = context.loaders
		return routeLoader.load(args.route);
	},

	Route_getMany: (_: void, args: { routes: string[] }, context: Context): Promise<(Route | Error)[]> => {
		const { routeLoader } = context.loaders;
		return routeLoader.loadMany(args.routes);
	},

	// StopRoute Queries
	StopRoute_get: (_: void, args: { stopRoute: string }, context: Context): Promise<StopRoute> => {
		const { stopRouteLoader } = context.loaders;
		return stopRouteLoader.load(args.stopRoute);
	},

	StopRoute_getMany: (_: void, args: { stopRoutes: string[] }, context: Context): Promise<(StopRoute | Error)[]> => {
		const { stopRouteLoader } = context.loaders;
		return stopRouteLoader.loadMany(args.stopRoutes);
	},

	// Trip Queries
	Trip_get: (_: void, args: { trip: string }, context: Context): Promise<Trip> => {
		const { tripLoader } = context.loaders;
		return tripLoader.load(args.trip);
	},

	// Service Queries
	Service_get: (_: void, args: { service: string }, context: Context): Promise<Service> => {
		const { serviceLoader } = context.loaders;
		return serviceLoader.load(args.service);
	},

	// User Queries
	User_get: (_: void, __: void, context: Context): Promise<User> => {
		/* Get a user by the authentication token */
		if (!context.authenticated) throw new Error('Authentication Failed');
		const { userLoader } = context.loaders;
		return userLoader.load(context.user);
	},

	User_login: async (_: void, login: Login, context: Context): Promise<LoginPayload> => {
		/* Login a user and return a json web token */
		const user: User = await UserModel.findOne({ email: login.email });						// Find existing user
		if (!user) throw new Error('Authentication Failed');									// No existing user
		const authenticated: boolean = await bcrypt.compare(login.password, user.password);		// Check if passwords match
		if (!authenticated) throw new Error('Authentication Failed');							// Password don't match

		// Return the user, jwt, expiration
		return {
			user: user.id,
			token: jwt.sign({ user: user.id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '24h' }),
			expiration: 24
		}
	},

	// TravelPlan Queries
	TravelPlan_get: async (_: void, { start, end }: TravelPlan_get_args, context: Context): Promise<TravelPlan> => {
		const { stopLoader } = context.loaders;
		let [start_document, end_document] = <Stop[]>await stopLoader.loadMany([start, end]);
		if (start_document == null || end_document == null) return null;
		return plan(start, end);
	},
}

