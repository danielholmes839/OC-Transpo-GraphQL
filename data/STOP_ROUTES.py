import json
import pandas as pd

stop_times_df = pd.read_csv('stop_times.txt')
routes_df = pd.read_csv('routes.txt', index_col='route_id')

stop_times_df.sort_values(by=['arrival_time'], inplace=True)
print(stop_times_df['arrival_time'])

stops_df = pd.read_csv('stops.txt', index_col='stop_id')
trips_df = pd.read_csv('trips.txt', index_col='trip_id')

print(trips_df.head())

stops = list(stops_df.index)
data = dict()

for i, stop in enumerate(stops):
    print(i, stop)
    trip_ids = list(stop_times_df[stop_times_df['stop_id'] == stop]['trip_id'])
    routes = [trips_df.at[trip, 'route_id'] for trip in trip_ids]
    routes = set(routes)

    data[stop] = dict()

    for route in routes:
        data[stop][route] = {
            '_id': stop+route,
            'number': routes_df.at[route, 'route_short_name'],
            'headsign': '',
            'stop': stop,
            'route': route,
            'stopTimes': []
        }

print(data)

headsigns = dict()
for trip_id in trips_df.index:
    route_id = trips_df.at[trip_id, 'route_id']
    headsign = trips_df.at[trip_id, 'trip_headsign']
    headsigns[trip_id+route_id] = headsign


for i in stop_times_df.index:
    print(i, stop_times_df.at[i, 'arrival_time'])
    stop = stop_times_df.at[i, 'stop_id']
    trip = stop_times_df.at[i, 'trip_id']
    route = trips_df.at[trip, 'route_id']

    _id = trip + stop
    data[stop][route]['stopTimes'].append(_id)
    data[stop][route]['headsign'] = headsigns[trip+route]


stop_routes = {
    'data': []
}

for stop in data.keys():
    for route in data[stop].keys():
        stop_routes['data'].append(data[stop][route])


with open(f'STOP_ROUTES.json', 'w') as fp:
    json.dump(stop_routes, fp)