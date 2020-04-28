import { gql } from 'apollo-server';

const typeDefs = gql`
	# Fancy distance string
	scalar Distance

	# URL for google maps static API
	scalar StaticStopRouteMap

	type Date {
		year: Int!
		month: Int!
		day: Int!
	}

	type TravelPlan {
		start: Stop!
		end: Stop!
		distance: Distance!
		legs: [Leg!]!
	}

	type Leg {
		start: Stop!	
		end: Stop!
		distance: Distance!
		instructions: String!
		routes: [Route!]			# Will be null if walking
		stopRoutes: [StopRoute!]
		walk: Boolean!
	}

	type Time {
		hour: Int!
		minute: Int!
		string: String!
		int: Int!
	}

	type User {
		id: ID!
		email: String!
		password: String
		favouriteStops: [FavouriteStop]!
	}

	type FavouriteStop {
		id: ID!
		user: User!
		stop: Stop!
		stopRoutes: [StopRoute!]!
	}

	type Schedule {
		next: StopTime
		all: [StopTime!]!
	}

	type Stop {
		id: ID!
		name: String!
		code: String!
		lat: Float!
		lon: Float!
		routes: [Route!]!
		stopRoutes: [StopRoute!]!
	}

	type StopRoute {
		id: ID!
		headsign: String!           # route headsign
		number: String!             # route number
		stop: Stop!
		route: Route!
		stopTimes: [StopTime!]!		
		busData: LiveBusData! 		# live 
		schedule: Schedule!
		map: StaticStopRouteMap!
	}

	type Route {
		id: ID!
		number: String!
		type: String!
		colour: String!
		textColour: String!
		trips: [Trip!]!
		stops: [Stop!]!
	}
	
	type Trip {
		id: ID!
		headsign: String!
		direction: Int!
		route: Route!
		service: Service!
		stopTimes: [StopTime!]!
	}

	type StopTime {
		id: ID!
		sequence: Int!
		time: Time!
		trip: Trip!
		stop: Stop!     
	}

	type Service {
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

	type ServiceException {
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
		distance: Distance
		hasGPS: Boolean!
		arrival: Time!			# When the bus will arrive
		adjusted: Boolean!		# Whether or not the arrival time has been adjusted
	}

	input TravelPlanInput {
		start: ID!
		end: ID!
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
		userGet: User
		userLogin(email: String!, password: String!): LoginPayload
		createTravelPlan(input: TravelPlanInput): TravelPlan
		stopSearch(name: String!, limit: Int): [Stop!]!
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