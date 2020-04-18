import { gql } from 'apollo-server';

const typeDefs = gql`
	interface Node {
		id: ID!
	}

	type Date {
		year: Int!
		month: Int!
		day: Int!
	}

	type Time {
		hour: Int!
		minute: Int!
		string: String!
		int: Int!
	}

	type User implements Node {
		id: ID!
		email: String!
		password: String
		favouriteStops: [FavouriteStop]!
	}

	type FavouriteStop implements Node {
		id: ID!
		user: User!
		stop: Stop!
		stopRoutes: [StopRoute!]!
	}

	type Stop implements Node {
		id: ID!
		name: String!
		code: String!
		lat: Float!
		lon: Float!
		routes: [Route!]!
		stopRoutes: [StopRoute!]!
	}

	scalar StaticStopRouteMap

	type StopRoute implements Node {
		id: ID!
		headsign: String!           # route headsign
		number: String!             # route number
		stop: Stop!
		route: Route!
		stopTimes: [StopTime!]!		
		busData: LiveBusData! 		# live 
		map: StaticStopRouteMap!
	}

	type Route implements Node {
		id: ID!
		number: String!
		type: String!
		colour: String!
		textColour: String!
		trips: [Trip!]!
		stops: [Stop!]!
	}
	
	type Trip implements Node {
		id: ID!
		headsign: String!
		direction: Int!
		route: Route!
		service: Service!
		stopTimes: [StopTime!]!
	}

	type StopTime implements Node {
		id: ID!
		sequence: Int!
		time: Time!
		trip: Trip!
		stop: Stop!     
	}

	type Service implements Node {
		id: ID!
		start: Date!
		end: Date!                         
		exceptions: [ServiceException!]!
		monday: Boolean!
		tuesday: Boolean!
		wednesday: Boolean!
		thursday: Boolean!
		friday: Boolean!
		saturday: Boolean!
		sunday: Boolean!
	}

	type ServiceException implements Node {
		id: ID!
		date: Date!
		removed: Boolean!
	}

	type LiveBusData {
		nextBus: Bus
		buses: [Bus!]!
		busCount: Int!
		busCountGPS: Int!
	}

	type Bus {
		headsign: String!
		number: String!
		direction: Int!
		type: String!
		last: Boolean!			# Last stop of schedule
		lat: Float
		lon: Float
		speed: Float
		distance: String
		hasGPS: Boolean!
		arrival: Time!			# When the bus will arrive
		adjusted: Boolean!		# Whether or not the arrival time has been adjusted
	}

	type LoginPayload {
		user: User!
		token: String!
		expiration: Int!
	}

	type Query {
		routeGet(id: ID!): Route
		stopRouteGet(id: ID!): StopRoute
		tripGet(id: ID!): Trip
		serviceGet(id: ID!): Stop
		stopGet(id: ID!): Stop
		stopSearch(name: String!, limit: Int): [Stop!]!
		userGet: User
		userLogin(email: String!, password: String!): LoginPayload
	}

	type Mutation {
		userCreate(email: String!, password: String!): User
		userFavouriteStopAdd(stop: ID!, stopRoutes: [ID!]): FavouriteStop
		userFavouriteStopDelete(favouriteStop: ID!): FavouriteStop
		userFavouriteStopRoutesAdd(favouriteStop: ID!, stopRoutes: [ID!]!): FavouriteStop
		userFavouriteStopRoutesDelete(favouriteStop: ID!, stopRoutes: [ID!]!): FavouriteStop
	}
`

export default typeDefs;