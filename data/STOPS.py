import json
import pandas as pd

stops = pd.read_csv('stops.txt', index_col='stop_id')
stop_times = pd.read_csv('stop_times.txt', index_col='trip_id')
trips = pd.read_csv('trips.txt', index_col='trip_id')

STOPS = {}


def process_stop(stop_id):
    """ Add a stop """
    code = str(stops.at[stop_id, 'stop_code']).strip('.0')
    name = stops.at[stop_id, 'stop_name']
    lat = stops.at[stop_id, 'stop_lat']
    lon = stops.at[stop_id, 'stop_lon']

    STOPS[stop_id] = {
        'id': stop_id,
        'code': code,
        'name': name,
        'lat': lat,
        'lon': lon,
        'routes': set()
    }

    stop_trips = stop_times[stop_times['stop_id'] == stop_id].sort_values(by=['arrival_time'])

    for trip_id in stop_trips.index:
        route_id = trips.at[trip_id, 'route_id']

        if route_id not in STOPS[stop_id]['routes']:
            STOPS[stop_id]['routes'].add(route_id)

    STOPS[stop_id]['routes'] = list(STOPS[stop_id]['routes'])


def process_stops(path):
    for i, stop in enumerate(stops.index):
        process_stop(stop)

    with open(f'{path}.json', 'w') as fp:
        json.dump(STOPS, fp)


if __name__ == '__main__':
    process_stops('STOPS')

