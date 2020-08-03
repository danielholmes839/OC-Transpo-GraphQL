import gql from 'graphql-tag';

const typeDefs = gql`
	scalar Distance							# Fancy distance string
	scalar StaticStopRouteMap				# static google maps URL for a StopRoute
	scalar StaticTravelPlanMap				# static google maps URL for a TravelPlan

	type Time {
		int: Int!							# Time as an integer (minutes into the day)
		hour: Int!							# Hour as an integer
		minute: Int!						# Minute as an integer
		string: String!						# Time as a string
		remaining: Int!						# Minutes until this time
	}

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
		map(width: Int, height: Int, zoom: Int): StaticTravelPlanMap!
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
	
	type User {
		id: ID!
		email: String!
		password: String
		favouriteStops: [FavouriteStop]!
	}

	# Favourite Stop type
	# Saves the users favourite stops and the routes belonging to that stop 
	type FavouriteStop {
		id: ID!
		user: User!
		stop: Stop!
		stopRoutes: [StopRoute!]!
	}

	# Schedule type for StopRoute type
	type Schedule {
		next(number: Int): [StopTime!]!
		all: [StopTime!]!
	}

	# Stop type
	type Stop {
		id: ID!
		name: String!
		code: String!
		lat: Float!
		lon: Float!
		routes: [Route!]!
		stopRoutes: [StopRoute!]!
	}

	# StopRoute type
	# Represents a route part of a stop
	type StopRoute {
		id: ID!
		headsign: String!           	# route headsign
		number: String!             	# route number
		stop: Stop!						
		route: Route!
		liveBusData: LiveBusData!
		schedule: Schedule!
		map(width: Int, height: Int, zoom: Int): StaticStopRouteMap
	}

	# Route type
	type Route {
		id: ID!
		number: String!
		type: String!
		backgroundColour: String!
		textColour: String!
		trips: [Trip!]!
		stops: [Stop!]!
	}
	
	# Trip type
	type Trip {
		id: ID!
		headsign: String!
		direction: Int!
		route: Route!
		service: Service!
		stopTimes: [StopTime!]!
	}

	# StopTime type
	type StopTime {
		id: ID!
		sequence: Int!
		time: Time!
		trip: Trip!
		service: Service!
		stop: Stop!     
	}

	# Service type
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

	type GPS {
		lat: Float
		lon: Float
		speed: Float
		distance: Distance
	}

	type Bus {
		headsign: String!
		number: String!
		direction: Int!			# 0 or 1 only  (I think)
		gps: GPS
		arrival: Time!			# When the bus will arrive
		age: Int! 				# Time since lat updated in minutes
		onTime: Boolean!		# Whether or not the arrival time has been adjusted
	}

	type LiveBusData {
		nextBus: Bus
		buses: [Bus!]!
		busCount: Int!
		busCountGPS: Int!
	}
	
	type Login {	
		user: String!			# I do not want to return the full user...
		token: String!
		expiration: Int!
	}

	type Query {
		# Stop Queries
		Stop_get(stop: ID!): Stop
		Stop_getMany(stops: [ID!]!): [Stop!]!
		Stop_search(name: String!, limit: Int): [Stop!]!

		# Route Queries
		Route_get(route: ID!): Route
		Route_getMany(routes: [ID!]!): [Route]!

		# StopRoute Queries
		StopRoute_get(stopRoute: ID!): StopRoute
		StopRoute_getMany(stopRoutes: [ID!]!): [StopRoute]!

		# Trip Queries
		Trip_get(trip: ID!): Trip

		# Service
		Service_get(service: ID!): Stop

		# User Queries
		User_get: User
		User_login(email: String!, password: String!): Login

		# TravelPlan Queries
		TravelPlan_get(start: ID!, end: ID!): TravelPlan
		
	}

	type Mutation {
		User_create(email: String!, password: String!): User
		User_FavouriteStop_add(stop: ID!): FavouriteStop
		User_FavouriteStop_remove(favouriteStop: ID!): FavouriteStop
		User_FavouriteStop_StopRoutes_add(favouriteStop: ID!, stopRoutes: [ID!]!): FavouriteStop
		User_FavouriteStop_StopRoutes_remove(favouriteStop: ID!, stopRoutes: [ID!]!): FavouriteStop
	}
`

export default typeDefs;