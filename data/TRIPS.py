# Daniel Holmes
# 2019-12-13
# TRIPS.py
# Convert GTFS trips.txt to a more usable JSON

import json
import pandas as pd

trips = pd.read_csv('trips.txt', index_col='trip_id')
stop_times = pd.read_csv('stop_times.txt', index_col=None)
stop_times['stop_time_id'] = stop_times['trip_id'] + stop_times['stop_id']
stop_times.index = stop_times['stop_time_id']

pd.DataFrame.to_csv(stop_times, 'stop_times_with_id.csv')

print(stop_times.head())
TRIPS = {'data': []}


def process_trips(path):
    """ process trips """
    for i, trip in enumerate(trips.index):
        print(i)
        stop_times_trip = list(stop_times[stop_times['trip_id'] == trip]['stop_time_id'])

        TRIPS['data'].append({
            '_id': trip,
            'service': trips.at[trip, 'service_id'],
            'route': trips.at[trip, 'route_id'],
            'headsign': trips.at[trip, 'trip_headsign'],
            'direction': int(trips.at[trip, 'direction_id']),
            'stopTimes': stop_times_trip
        })

    print(TRIPS['data'][0])
    with open(f'{path}.json', 'w') as fp:
        json.dump(TRIPS, fp)

if __name__ == '__main__':
    process_trips('TRIPS')
