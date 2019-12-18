import json
import pandas as pd
import numpy as np

routes = pd.read_csv('routes.txt', index_col='route_id')
stop_times = pd.read_csv('stop_times.txt', index_col='trip_id')
trips = pd.read_csv('trips.txt', index_col='trip_id')

stop_times = stop_times[stop_times['stop_sequence'] == 1]
stop_times = stop_times.sort_values(by=['arrival_time'])
trip_ids = list(set(stop_times.index))

# GTFS ROUTE TYPES
route_types = {
    0: 'Light Rail',
    1: 'Subway',
    2: 'Rail',
    3: 'Bus',
    4: 'Ferry',
    5: 'Cable Car',
    6: 'Gondola',
    7: 'Funicular'
}
ROUTES = {}


def process_routes(path):
    for trip_id in trip_ids:
        route_id = trips.at[trip_id, 'route_id']
        stop_times.at[trip_id, 'route_id'] = route_id

    for route in routes.index:
        ROUTES[route] = {
            'id': route,
            'number': routes.at[route, 'route_short_name'],
            'colour': routes.at[route, 'route_color'],
            'type': route_types[routes.at[route, 'route_type']],
            'type_number': int(routes.at[route, 'route_type']),
            'trips': []
        }

        if type(ROUTES[route]['colour']) != str:
            ROUTES[route]['colour'] = 'FF0000'

    for trip_id in stop_times.index:
        route = stop_times.at[trip_id, 'route_id']
        ROUTES[route]['trips'].append(trip_id)

    with open(f'{path}.json', 'w') as fp:
        json.dump(ROUTES, fp)


if __name__ == '__main__':
    process_routes('ROUTES')