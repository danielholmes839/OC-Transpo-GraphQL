import gql from 'graphql-tag';

const typeDefs = gql`
	scalar Distance							# Distance string "5km", "3.1km", "800m"
	scalar StaticStopRouteMap				# static google maps URL for a StopRoute

	type Time {
		int: Int!							# Time as an integer (minutes into the day)
		string: String!						# Time as a string - could add more formatting options later...
		intRemaining: Int!
		stringRemaining: String!			# Minutes until this time
	}

	type Date {
		year: Int!					
		month: Int!
		day: Int!
		string: String!			
	}
	
	type User {
		id: ID!
		email: String!
		favouriteStops: [FavouriteStop]!
	}

	type FavouriteStop {
		id: ID!
		user: User!
		stop: Stop!
		stopRoutes: [StopRoute!]!
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
		headsign: String!
		number: String!
		stop: Stop!						
		route: Route!
		schedule: Schedule!
		liveBusData: LiveBusData!
		map(width: Int, height: Int): StaticStopRouteMap
	}

	type Schedule {
		next(limit: Int): [StopTime!]!
		all: [StopTime!]!
	}

	type Route {
		id: ID!
		number: String!
		type: String!
		backgroundColour: String!
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
		service: StopTimeService!
		stop: Stop!   
		route: Route!
		stopRoute: StopRoute!  
	}

	type StopTimeService {
		service: Service!
		serviceToday: Boolean!
		serviceTomorrow: Boolean!
		serviceIsNextDay: Boolean!  # The time of the stop time was originally past 24 hours
		monday: Boolean!
		tuesday: Boolean!
		wednesday: Boolean!
		thursday: Boolean!
		friday: Boolean!
		saturday: Boolean!
		sunday: Boolean!
	}

	type Service {
		id: ID!
		start: Date!
		end: Date!                         
		exceptions: [ServiceException!]!
		serviceToday: Boolean!
		serviceTomorrow: Boolean!	
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
		gps: GPS
		age: Int! 				# Time since lat updated in minutes
		arrival: Time!			# When the bus will arrive
		onTime: Boolean!		# Whether or not the arrival time has been adjusted
	}

	type LiveBusData {
		nextBus: Bus
		buses: [Bus!]!
		busCount: Int!
		busCountGPS: Int!
	}

	type Query {
		# Stop Queries
		Stop_get(id: ID!): Stop
		Stop_getMany(ids: [ID!]!): [Stop]!
		Stop_search(name: String!, limit: Int): [Stop!]!
		
		# Route Queries
		Route_get(id: ID!): Route
		Route_getMany(ids: [ID!]!): [Route]!
		
		# StopRoute Queries
		StopRoute_get(id: ID!): StopRoute
		StopRoute_getMany(ids: [ID!]!): [StopRoute]!
		
		# Trip Queries
		Trip_get(id: ID!): Trip
		Trip_getMany(ids: [ID!]!): [Trip]!

		# StopTime Queries
		StopTime_get(id: ID!): StopTime
		StopTime_getMany(ids: [ID!]!): [StopTime]!

		# Service Queries
		Service_get(id: ID!): Service
		Service_getMany(ids: ID!): [Service]!

		# User Queries
		User_get: User
		User_login(email: String!, password: String!): String
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