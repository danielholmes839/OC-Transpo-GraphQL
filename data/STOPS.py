import json
import pandas as pd

stops = pd.read_csv('stops.txt', index_col='stop_id')
stop_times = pd.read_csv('stop_times.txt', index_col='trip_id')
trips = pd.read_csv('trips.txt', index_col='trip_id')

STOPS = {'data': []}


def process_stop(stop_id):
    """ Add a stop """
    code = str(stops.at[stop_id, 'stop_code'])[:4]
    name = stops.at[stop_id, 'stop_name']
    lat = stops.at[stop_id, 'stop_lat']
    lon = stops.at[stop_id, 'stop_lon']

    trip_ids = stop_times[stop_times['stop_id'] == stop_id].index
    routes = [trips.at[trip, 'route_id'] for trip in trip_ids]
    routes = list(set(routes))

    stop = {
        '_id': stop_id,
        'code': code,
        'name': name,
        'lat': lat,
        'lon': lon,
        'routes': routes,
        'stopRoutes': [stop_id + route_id for route_id in routes]
    }

    STOPS['data'].append(stop)


def process_stops(path):
    print(stops.shape[0])
    for i, stop in enumerate(stops.index):
        print(i)
        process_stop(stop)

    with open(f'{path}.json', 'w') as fp:
        json.dump(STOPS, fp)


if __name__ == '__main__':
    process_stops('STOPS')

