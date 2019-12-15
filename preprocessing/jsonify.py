# Daniel Holmes
# 2019-12-13
# jsonify.py
# Convert GTFS data to JSON

import json
import pandas as pd


stops = pd.read_csv('stops.txt', index_col='stop_id')
stop_times = pd.read_csv('stop_times.txt', index_col='trip_id')
trips = pd.read_csv('trips.txt', index_col='trip_id')
routes = pd.read_csv('routes.txt', index_col='route_id')
calendar = pd.read_csv('calendar.txt', index_col='service_id')


STOPS = {}
TRIPS = {}
STOP_TIMES = {}
ROUTES = {}


def process_trips():
    """ Processes Trips """
    for trip in trips.index:
        TRIPS[trip] = {
            'id': trip,
            'service_id': trips.at[trip, 'service_id'],
            'route_id': trips.at[trip, 'route_id'],
            'trip_headsign': trips.at[trip, 'trip_headsign']
        }


def process_stop_times():
    trip_ids = trips.index
    trip_stop_ids = stop_times['stop_id']
    trip_arrival_times = stop_times['arrival_time']

    for trip_id, stop_id, time in zip(trip_ids, trip_stop_ids, trip_arrival_times):
        STOP_TIMES[f'{trip_id}-{stop_id}'] = {
            'trip_id': trip_id,
            'stop_id': stop_id,
            'time': time
        }


def process_stop_trip(trip_id, stop_id):
    """ Adds trips to routes for the stop """
    route_id = trips.at[trip_id, 'route_id']
    route_number = routes.at[route_id, 'route_short_name']

    if route_id not in STOPS[stop_id]['routes']:
        STOPS[stop_id]['routes'][route_id] = {
            'id': route_id,
            'number': route_number,
            'name': trips.at[trip_id, 'trip_headsign'],
            'trips': []
        }

    STOPS[stop_id]['routes'][route_id]['trips'].append(trip_id)


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
        'routes': {}
    }

    stop_trips = stop_times[stop_times['stop_id'] == stop_id].sort_values(by=['arrival_time'])

    for trip in stop_trips.index:
        process_stop_trip(trip, stop_id)


def process_stops():
    for i, stop in enumerate(stops.index):
        process_stop(stop)


"""
process_stop_times()
with open(f'STOP_TIMES.json', 'w') as fp:
    json.dump(STOP_TIMES, fp)
  """
process_stops()
with open('STOPS.json', 'w') as fp:
    json.dump(STOPS, fp)

"""

process_trips()
with open(f'TRIPS.json', 'w') as fp:
    json.dump(TRIPS, fp)
"""

