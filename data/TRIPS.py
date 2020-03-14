# Daniel Holmes
# 2019-12-13
# TRIPS.py
# Convert GTFS trips.txt to a more usable JSON

import json
import pandas as pd

trips = pd.read_csv('trips.txt', index_col='trip_id')
stop_times = pd.read_csv('stop_times.txt', index_col=None)
stop_times['id'] = stop_times['trip_id'] + stop_times['stop_id']
stop_times.drop_duplicates('id', inplace=True)



def process_trips():
    """ process trips """
    trips_dict = dict()
    for i, trip in enumerate(trips.index):
        print(i)
        trips_dict[trip] = {
            '_id': trip,
            'service': trips.at[trip, 'service_id'],
            'route': trips.at[trip, 'route_id'],
            'headsign': trips.at[trip, 'trip_headsign'],
            'direction': int(trips.at[trip, 'direction_id']),
            'stopTimes': []
        }

    trip_ids = list(stop_times['trip_id'])
    stop_time_ids = list(stop_times['id'])

    for i, (trip_id, stop_time_id) in enumerate(zip(trip_ids, stop_time_ids)):
        print(i)
        trips_dict[trip_id]['stopTimes'].append(stop_time_id)

    data = {'data': [trips_dict[trip] for trip in trips_dict.keys()]}
    with open(f'TRIPS.json', 'w') as fp:
        json.dump(data, fp)


if __name__ == '__main__':
    process_trips()
