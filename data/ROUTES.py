import json
import pandas as pd
import numpy as np

routes_df = pd.read_csv('routes.txt', index_col='route_id')
trips_df = pd.read_csv('trips.txt', index_col='trip_id')
stop_times_df = pd.read_csv('stop_times.txt')

ROUTES = {'data': []}

route_stops = {}
route_trips = {}

for route in routes_df.index:
    route_stops[route] = set()
    route_trips[route] = set()

for i in stop_times_df.index:
    print(i)
    trip = stop_times_df.at[i, 'trip_id']
    stop = stop_times_df.at[i, 'stop_id']
    route = trips_df.at[trip, 'route_id']

    route_stops[route].add(stop)
    route_trips[route].add(trip)


def process_routes(path):
    for route in routes_df.index:
        colour = routes_df.at[route, 'route_color']
        if type(colour) != str:
            colour = 'FF0000'

        text_colour = routes_df.at[route, 'route_text_color']
        if type(text_colour) != str:
            text_colour = 'FFFFFF'

        ROUTES['data'].append({
            '_id': route,
            'name': routes_df.at[route, 'route_short_name'],
            'routeType': int(routes_df.at[route, 'route_type']),
            'colour': colour,
            'textColour': text_colour,
            'trips': list(route_trips[route]),
            'stops': list(route_stops[route])
        })

    with open(f'{path}.json', 'w') as fp:
        json.dump(ROUTES, fp)


if __name__ == '__main__':
    process_routes('ROUTES')