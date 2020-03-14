import json
import pandas as pd

days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

df = pd.read_csv('calendar.txt')
exceptions_df = pd.read_csv('calendar_dates.txt')

exception_types = {
    1: False,   # Added
    2: True     # Removed
}

exceptions = list(range(exceptions_df.shape[0]))
exceptions = [f'exception-{e}' for e in exceptions]
exceptions_df['id'] = exceptions
print(exceptions_df['id'])

def convert_date(date):
    date = str(date)
    date_object = {
        'yyyymmdd': date,
        'year': int(date[:4]),
        'month': int(date[4:6]),
        'day': int(date[6:8])
    }
    return date_object


services = dict()

for i in df.index:
    service = dict()
    _id = df.at[i, 'service_id']
    service['_id'] = _id
    service['start'] = convert_date(df.at[i, 'start_date'])
    service['end'] = convert_date(df.at[i, 'end_date'])
    service['exceptions'] = []

    for day in days:
        service[day] = bool(df.at[i, day])

    services[_id] = service

service_exceptions = {'data': []}

for i in exceptions_df.index:
    exception_id = exceptions_df.at[i, 'id']
    removed = exception_types[exceptions_df.at[i, 'exception_type']]
    date = convert_date(exceptions_df.at[i, 'date'])

    service_exception = {
        '_id': exception_id,
        'date': date,
        'removed': removed
    }
    service_exceptions['data'].append(service_exception)

    _id = exceptions_df.at[i, 'service_id']
    services[_id]['exceptions'].append(exception_id)

with open(f'SERVICE.json', 'w') as fp:
    json.dump({'data': [services[_id] for _id in services.keys()]}, fp)

with open(f'SERVICE_EXCEPTIONS.json', 'w') as fp:
    json.dump(service_exceptions, fp)

