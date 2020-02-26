# Daniel Holmes
# 2019-12-13
# STOP_TIMES.py
# Convert GTFS stop_times.txt to a more usable JSON

import json
import pandas as pd

stop_times = pd.read_csv('stop_times.txt', index_col='trip_id')
STOP_TIMES = {}


def process_stop_times(path):
    """ process stop times """
    trip_ids = stop_times.index
    trip_stop_ids = stop_times['stop_id']
    trip_arrival_times = stop_times['arrival_time']

    for trip_id, stop_id, time in zip(trip_ids, trip_stop_ids, trip_arrival_times):
        STOP_TIMES[f'{trip_id}-{stop_id}'] = {
            'trip_id': trip_id,
            'stop_id': stop_id,
            'time': time[:-3]
        }

    with open(f'{path}.json', 'w') as fp:
        json.dump(STOP_TIMES, fp)


if __name__ == '__main__':
    process_stop_times('STOP_TIMES')
