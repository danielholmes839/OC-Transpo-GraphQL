# Daniel Holmes
# 2019-12-13
# TRIPS.py
# Convert GTFS trips.txt to a more usable JSON

import json
import pandas as pd

trips = pd.read_csv('trips.txt', index_col='trip_id')
TRIPS = {}


def process_trips(path):
    """ process trips """
    for trip in trips.index:
        TRIPS[trip] = {
            'id': trip,
            'service_id': trips.at[trip, 'service_id'],
            'route_id': trips.at[trip, 'route_id'],
            'trip_headsign': trips.at[trip, 'trip_headsign']
        }

    with open(f'{path}.json', 'w') as fp:
        json.dump(TRIPS, fp)

if __name__ == '__main__':
    process_trips('TRIPS')
