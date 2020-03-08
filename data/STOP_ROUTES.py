import json
import pandas as pd

stop_times_df = pd.read_csv('stop_times.txt')
stop_times_df.sort_values(by=['arrival_time'], inplace=True)
print(stop_times_df['arrival_time'])

stops_df = pd.read_csv('stops.txt', index_col='stop_id')
trips_df = pd.read_csv('trips.txt', index_col='trip_id')

print(trips_df.head())

stops = list(stops_df.index)
data = dict()

for i, stop in enumerate(stops):
    print(i, stop)
    trip_ids = stop_times_df[stop_times_df['stop_id'] == stop]['trip_id']
    routes = [trips_df.at[trip, 'route_id'] for trip in trip_ids]
    routes = set(routes)

    data[stop] = dict()

    for route in routes:
        data[stop][route] = {
            '_id': stop+route,
            'stop': stop,
            'route': route,
            'stopTimes': []
        }

print(data)

for i in stop_times_df.index:
    print(i, stop_times_df.at[i, 'arrival_time'])
    stop = stop_times_df.at[i, 'stop_id']
    trip = stop_times_df.at[i, 'trip_id']
    route = trips_df.at[trip, 'route_id']

    _id = trip + stop
    data[stop][route]['stopTimes'].append(_id)


stop_routes = {
    'data': []
}

for stop in data.keys():
    for route in data[stop].keys():
        stop_routes['data'].append(data[stop][route])


with open(f'STOP_ROUTES.json', 'w') as fp:
    json.dump(stop_routes, fp)