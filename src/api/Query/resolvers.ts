import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Context } from 'middleware'
import { Stop, StopTime, StopRoute, Route, Trip, User, Service } from 'api/types';
import { UserModel, StopModel } from 'api/models';
import { Login, StopSearch } from './types'

type Get = { id: string };
type GetMany = { ids: string[] };

// Query Resolvers
export default {
	// Stop Queries
	Stop_get: (_: void, { id }: Get, context: Context): Promise<Stop> => {
		const { stopLoader } = context.loaders
		return stopLoader.load(id);
	},

	Stop_getMany: (_: void, { ids }: GetMany, context: Context): Promise<(Stop | Error)[]> => {
		const { stopLoader } = context.loaders
		return stopLoader.loadMany(ids);
	},

	Stop_search: async (_: void, { name, limit=3 }: StopSearch): Promise<Stop[]> => {
		// Search by stop code first
		let stops = await StopModel.find({ code: name });
		if (stops.length !== 0) {
			return stops;
		}
		// Search by stop name
		return StopModel.find(
			{ $text: { $search: name } },
			{ score: { $meta: 'textScore' } }
		).sort(
			{ score: { $meta: 'textScore' } }
		).limit(limit);
	},

	// Route Queries
	Route_get: (_: void, { id }: Get, context: Context): Promise<Route> => {
		const { routeLoader } = context.loaders
		return routeLoader.load(id);
	},

	Route_getMany: (_: void, { ids }: GetMany, context: Context): Promise<(Route | Error)[]> => {
		const { routeLoader } = context.loaders;
		return routeLoader.loadMany(ids);
	},

	// StopRoute Queries
	StopRoute_get: (_: void, { id }: Get, context: Context): Promise<StopRoute> => {
		const { stopRouteLoader } = context.loaders;
		return stopRouteLoader.load(id);
	},

	StopRoute_getMany: (_: void, { ids }: GetMany, context: Context): Promise<(StopRoute | Error)[]> => {
		const { stopRouteLoader } = context.loaders;
		return stopRouteLoader.loadMany(ids);
	},

	// Trip Queries
	Trip_get: (_: void, { id }: Get, context: Context): Promise<Trip> => {
		const { tripLoader } = context.loaders;
		return tripLoader.load(id);
	},

	Trip_getMany: (_: void, { ids }: GetMany, context: Context): Promise<(Trip | Error)[]> => {
		const { tripLoader } = context.loaders;
		return tripLoader.loadMany(ids);
	},

	// Service Queries
	Service_get: (_: void, { id }: Get, context: Context): Promise<Service> => {
		const { serviceLoader } = context.loaders;
		return serviceLoader.load(id);
	},

	Service_getMany: (_: void, { ids }: GetMany, context: Context): Promise<(Service | Error)[]> => {
		const { serviceLoader } = context.loaders;
		return serviceLoader.loadMany(ids);
	},

	// StopTime Queries
	StopTime_get: (_: void, { id }: Get, context: Context): Promise<StopTime> => {
		const { stopTimeLoader } = context.loaders;
		return stopTimeLoader.load(id);
	},

	StopTime_getMany: (_: void, { ids }: GetMany, context: Context): Promise<(StopTime | Error)[]> => {
		const { stopTimeLoader } = context.loaders;
		return stopTimeLoader.loadMany(ids);
	},

	// User Queries
	User_get: (_: void, __: void, context: Context): Promise<User> => {
		/* Get a user by the authentication token */
		if (!context.authenticated) throw new Error('Authentication Required');
		const { userLoader } = context.loaders;
		return userLoader.load(context.user);
	},

	User_login: async (_: void, { email, password }: Login): Promise<String> => {
		/* Login a user and return a json web token */
		const user: User = await UserModel.findOne({ email: email });						// Find existing user
		if (!user) throw new Error('Incorrect username or password');							// No existing user
		const authenticated: boolean = await bcrypt.compare(password, user.password);		// Check if passwords match
		if (!authenticated) throw new Error('Incorrect username or password');					// Password don't match

		// Return the user, jwt, expiration
		return jwt.sign({ user: user.id, email: user.email }, process.env.JWT_KEY, { expiresIn: '24h' })
	}
}

