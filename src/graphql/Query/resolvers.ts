import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { plan, TravelPlan } from '../../astar/index';

import { stopLoader, stopRouteLoader, routeLoader, tripLoader, userLoader, serviceLoader } from '../loaders';
import { Login, LoginPayload, TravelPlanInput, StopSearch } from './types'
import { Stop, StopRoute, Route, Trip, User, Service, Context } from '../types';
import { UserModel, StopModel } from '../models';


// Query Resolvers
export default {
	// Stop Queries
	Stop_get: (_: void, args: { stop: string }): Promise<Stop> => {
		return stopLoader.load(args.stop);
	},

	Stop_getMany: (_: void, args: { stops: string[] }): Promise<(Stop | Error)[]> => {
		return stopLoader.loadMany(args.stops);
	},

	Stop_search: async (_: void, { name, limit }: StopSearch): Promise<Stop[]> => {
		if (!limit) limit = 3;
		return StopModel.find(
			{ $text: { $search: name } },
			{ score: { $meta: "textScore" } }
		).sort(
			{ score: { $meta: "textScore" } }
		).limit(limit);
	},

	// Route Queries
	Route_get: (_: void, args: { route: string }): Promise<Route> => {
		return routeLoader.load(args.route);
	},

	Route_getMany: (_: void, args: { routes: string[] }): Promise<(Route | Error)[]> => {
		return routeLoader.loadMany(args.routes);
	},

	// StopRoute Queries
	StopRoute_get: (_: void, args: { stopRoute: string }): Promise<StopRoute> => {
		return stopRouteLoader.load(args.stopRoute);
	},

	StopRoute_getMany: (_: void, args: { stopRoutes: string[] }): Promise<(StopRoute | Error)[]> => {
		return stopRouteLoader.loadMany(args.stopRoutes);
	},

	// Trip Queries
	Trip_get: (_: void, args: { trip: string }): Promise<Trip> => {
		return tripLoader.load(args.trip);
	},

	// Service Queries
	Service_get: (_: void, args: { service: string }): Promise<Service> => {
		return serviceLoader.load(args.service);
	},

	// User Queries
	User_get: (_: void, __: void, context: Context): Promise<User> => {
		/* Get a user by the authentication token */
		if (!context.authenticated) throw new Error('Authentication Failed');
		return userLoader.load(context.user);
	},

	User_login: async (_: void, login: Login): Promise<LoginPayload> => {
		/* Login a user and return a json web token */
		const user: User = await UserModel.findOne({ email: login.email });				// Find existing user
		if (!user) throw new Error('Authentication Failed');									// No existing user
		const authenticated: boolean = await bcrypt.compare(login.password, user.password);		// Check if passwords match
		if (!authenticated) throw new Error('Authentication Failed');							// Password don't match

		// Return the user, jwt, expiration
		return {
			user: user,
			token: jwt.sign({ user: user.id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '24h' }),
			expiration: 24
		}
	},

	// TravelPlan Queries
	TravelPlan_get: async (_: void, { input }: TravelPlanInput): Promise<TravelPlan> => {
		let [start, end] = <Stop[]>await stopLoader.loadMany([input.start, input.end]);
		if (start == null || end == null) return null;
		return plan(start.id, end.id);
	},
}

