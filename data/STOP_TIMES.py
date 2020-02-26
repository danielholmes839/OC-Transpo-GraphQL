# Daniel Holmes
# 2019-12-13
# STOP_TIMES.py
# Convert GTFS stop_times.txt to a more usable JSON

import json
import pandas as pd

stop_times_df = pd.read_csv('stop_times.txt', index_col='trip_id')
trips_df = pd.read_csv('trips.txt', index_col='trip_id')
STOP_TIMES = {'data': []}


def process_stop_times(path):
    """ process stop times """

    stops = list(stop_times_df['stop_id'])
    trips = list(stop_times_df.index)
    times = list(stop_times_df['arrival_time'])
    sequences = list(stop_times_df['stop_sequence'])
    _ids = list(stop_times_df.index + stop_times_df['stop_id'])

    added = set()

    for stop, trip, _id, sequence, time, i in zip(stops, trips, _ids, sequences, times, range(len(stops))):
        if _id in added:
            print({
                '_id': _id,
                'time': time,
                'sequence': sequence,
                'trip': trip,
                'stop': stop,
                'route': trips_df.at[trip, 'route_id']
            })
            continue
        added.add(_id)

        STOP_TIMES['data'].append({
            '_id': _id,
            'time': time,
            'sequence': sequence,
            'trip': trip,
            'stop': stop,
            'route': trips_df.at[trip, 'route_id']
        })
    print(len(_ids), len(set(_ids)), len(STOP_TIMES['data']))

    with open(f'{path}.json', 'w') as fp:
        json.dump(STOP_TIMES, fp)


if __name__ == '__main__':
    process_stop_times('STOP_TIMES')
