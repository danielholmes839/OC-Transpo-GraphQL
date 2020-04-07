import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { stopLoader, stopRouteLoader, routeLoader, tripLoader, userLoader, serviceLoader } from '../loaders';
import { Stop, StopRoute, Route, Trip, User, Service, Context, Login, LoginPayload } from '../types';
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
	stopGet: (parent: void, { id }: ID): Promise<Stop> => stopLoader.load(id),
	stopRouteGet: (parent: void, { id }: ID): Promise<StopRoute> => stopRouteLoader.load(id),
	routeGet: (parent: void, { id }: ID): Promise<Route> => routeLoader.load(id),
	tripGet: (parent: void, { id }: ID): Promise<Trip> => tripLoader.load(id),
	serviceGet: (parent: void, { id }: ID): Promise<Service> => serviceLoader.load(id),

	// User Queries
	userGet: (parent: void, args: void, context: Context): Promise<User> => {
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
	}
}

export default resolvers;