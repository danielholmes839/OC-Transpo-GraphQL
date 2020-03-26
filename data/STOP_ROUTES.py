import json
import pandas as pd


def time_to_int(time_string):
    hour = int(time[:2])
    minute = int(time[3:5])
    return  (hour * 60) + minute


stop_times_df = pd.read_csv('stop_times.txt')
stop_times_df.sort_values(by=['arrival_time'], inplace=True)
stop_times_df.reset_index(inplace=True)

routes_df = pd.read_csv('routes.txt', index_col='route_id')
stops_df = pd.read_csv('stops.txt')
trips_df = pd.read_csv('trips.txt')

# Get stop route headsigns
route_id_to_number = dict()
for route_id in routes_df.index:
    number = routes_df.at[route_id, 'route_short_name']
    route_id_to_number[route_id] = number

headsigns = dict()
for i in trips_df.index:
    print(i)
    route_id = trips_df.at[i, 'route_id']
    headsign = trips_df.at[i, 'trip_headsign']
    headsigns[i] = headsign


# Trip to Route dictionary
trips_dict = dict()
for i in trips_df.index:
    trip_id = trips_df.at[i, 'trip_id']
    trips_dict[trip_id] = {
        'route': trips_df.at[i, 'route_id'],
        'headsign': trips_df.at[i, 'trip_headsign']
    }

print(trips_dict)

# Stop Routes dictionary
stop_routes = dict()
for i in stops_df.index:
    print(i)
    stop = stops_df.at[i, 'stop_id']
    stop_routes[stop] = dict()

print(stop_times_df.index)
for i in stop_times_df.index:
    print(i)
    stop = stop_times_df.at[i, 'stop_id']
    trip = stop_times_df.at[i, 'trip_id']
    route = trips_dict[trip]['route']

    time = stop_times_df.at[i, 'arrival_time']
    stop_time_id = trip + stop

    if route not in stop_routes[stop]:
        number = route_id_to_number[route]

        stop_routes[stop][route] = {
            '_id': stop + route,
            'route': route,
            'stop': stop,
            'number': number,
            'headsign': trips_dict[trip]['headsign'],
            'stopTimes': []
        }

    stop_routes[stop][route]['stopTimes'].append(stop_time_id)


data = {'data': []}
for stop in stop_routes.keys():
    for route in stop_routes[stop].keys():
        data['data'].append(stop_routes[stop][route])

print('Saving Stop Routes')
with open(f'STOP_ROUTES.json', 'w') as fp:
    json.dump(data, fp)



"""

for i, stop in enumerate(stops):

for i, stop in enumerate(stops):
    for
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
"""