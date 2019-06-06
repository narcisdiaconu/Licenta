import math, googlemaps, os
import datetime
import re

def convert_given_data(data: dict):
	"""
	Convert data received from app to a Google Directions like structure
	"""
	result = []
	for bus in data['buses']:
		route = dict()
		route['bus_id'] = bus['id']
		route['type'] = 'INTERNAL'
		route['arrival_time'] = convert_time_to_dict(bus['arrivalTime'])
		route['departure_time'] = convert_time_to_dict(bus['departureTime'])
		route['price'] = bus['price']
		route['total_places'] = bus['totalPlaces']
		duration = dict()
		departure = datetime.datetime(2019, 1, 1, int(bus['departureTime'].split(':')[0]), int(bus['departureTime'].split(':')[1]))
		arrival = datetime.datetime(2019, 1, 1, int(bus['arrivalTime'].split(':')[0]), int(bus['arrivalTime'].split(':')[1]))
		time = arrival - departure
		duration['value'] = time.total_seconds()
		hour = str(time).split(':')[0]
		minute = str(time).split(':')[1]
		if len(hour) == 1:
			hour = '0' + hour
		if len(minute) == 1:
			minute = '0' + minute
		duration['text'] = hour + ':' + minute
		route['duration'] = duration
		bus_route = return_item_by_id(data['routes'], bus['route'])
		route['start_location'] = get_station_by_id(data, bus_route['startStation'])
		route['end_location'] = get_station_by_id(data, bus_route['endStation'])
		route['days'] = bus['days']

		steps = []
		step = dict()
		step['departure_time'] = convert_time_to_dict(bus['departureTime'])
		step['start_location'] = get_station_by_id(data, bus_route['startStation'])
		for stop in sorted(bus['busStops'], key = lambda x: x['arrivalTime']):
			step['price'] = stop['price']
			step['arrival_time'] = convert_time_to_dict(stop['arrivalTime'])
			step['end_location'] = get_station_by_id(data, stop['station'])

			steps.append(step)
			step = dict()
			step['departure_time'] = convert_time_to_dict(stop['departureTime'])
			step['start_location'] = get_station_by_id(data, stop['station'])
		
		step['arrival_time'] = convert_time_to_dict(bus['arrivalTime'])
		step['price'] = bus['price']
		step['end_location'] = get_station_by_id(data, bus_route['endStation'])
		steps.append(step)
		if (len(steps) == 1):
			steps = []
		route['steps'] = steps

		result.append(route)
	result.sort(key = lambda x: x['departure_time']['text'])
	return result
		
def convert_time_to_dict(string: str):
	result = dict()
	result['text'] = string
	return result

def get_station_by_id(data: dict, id):
	result = list(filter(lambda x: x['id'] == id, data['stations']))
	if (len(result) == 0):
		return None
	res = result[0]
	cityId = res.pop('cityId', None)
	if (cityId == None):
		return res
	res['city'] = return_item_by_id(data['cities'], cityId)
	return res

def return_item_by_id(items, id):
	result = list(filter(lambda x: x['id'] == id , items))
	if (len(result) == 0):
		return None
	return result[0]

def distance(start_location: dict, end_location: dict):
	"""
	Return real distance between two locations both parameters should be
	dictionaries and contain latitude and longitude in float values.
	"""
	return 0

def haversine_distance(start_location: dict, end_location: dict):
	"""
	Returns haversine distance between two points. Both parameters should be
	dictionaries and contain latitude and longitude in float values.
	"""
	lon1, lat1, lon2, lat2 = map(math.radians, [start_location['longitude'], start_location['latitude'], end_location['longitude'], end_location['latitude']])
	R = 6371000 # Earth radius in meters

	delta_lon = lon2 - lon1
	delta_lat = lat2 - lat1
	a = math.sin(delta_lat/2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(delta_lon/2) ** 2
	c = math.asin(math.sqrt(a))
	return c * R

def retrieve_directions(start_location: dict, end_location: dict, departure_time: datetime.datetime):
	"""
	Retrieve directions using Google Directions API. start_location, end_location should be dictionaries with both latitude and longitude values, departure_time is a datetime object
	"""
	gmaps = googlemaps.Client(key=os.environ['GOOGLE_MAPS_KEY'])
	start = str(start_location['latitude']) + ',' + str(start_location['longitude'])
	end = str(end_location['latitude']) + ',' + str(end_location['longitude'])
	directions = gmaps.directions(start, end, mode='transit', departure_time=departure_time)
	result = []
	for res in directions:
		leg = convert_leg(res['legs'][0])
		result.append(leg)
	return result

def convert_leg(leg: dict):
	leg['arrival_time']['text'] = convert_from_12_to_24(leg['arrival_time']['text'])
	leg['departure_time']['text'] = convert_from_12_to_24(leg['departure_time']['text'])
	leg['duration']['text'] = convert_text_to_hour(leg['duration']['text'])
	start_location = convert_location(leg['start_location'])
	start_location['name'] = leg['start_address']

	end_location = convert_location(leg['end_location'])
	end_location['name'] = leg['end_address']

	leg['start_location'] = start_location
	leg['end_location'] = end_location

	steps = []
	for step in leg['steps']:
		step['duration']['text'] = convert_text_to_hour(step['duration']['text'])
		step['end_location'] = convert_location(step['end_location'])
		step['start_location'] = convert_location(step['start_location'])

		if step['travel_mode'] == 'TRANSIT':
			step['transit_details'] = convert_transit_details(step['transit_details'])
		elif step['travel_mode'] == 'WALKING':
			step['steps'] = convert_walking_steps(step['steps'])
		
		steps.append(step)
	leg['steps'] = steps
	leg['type'] = 'EXTERNAL'

	return leg

def convert_transit_details(details: dict):
	result = dict(details)
	result['arrival_stop'] = convert_location(details['arrival_stop']['location'])
	result['arrival_stop']['name'] = details['arrival_stop']['name']
	result['departure_stop'] = convert_location(details['departure_stop']['location'])
	result['departure_stop']['name'] = details['arrival_stop']['name']
	result['arrival_time']['text'] = convert_from_12_to_24(details['arrival_time']['text'])
	result['departure_time']['text'] = convert_from_12_to_24(details['departure_time']['text'])
	return result

def convert_walking_steps(steps: list):
	result = []
	for step in steps:
		step['duration']['text'] = convert_text_to_hour(step['duration']['text'])
		step['end_location'] = convert_location(step['end_location'])
		step['start_location'] = convert_location(step['start_location'])

		result.append(step)
	return result

def convert_location(location: dict):
	new_location = dict()
	new_location['latitude'] = location['lat']
	new_location['longitude'] = location['lng']
	return new_location

def convert_text_to_hour(string: str):
	hours = re.search("([0-9]{1,2}) hour", string)
	if hours:
		hours = hours.group(1)
	minutes = re.search("([0-9]{1,2}) min", string)
	if minutes:
		minutes = minutes.group(1)
	if hours == None:
		hours = "00"
	if minutes == None:
		minutes = "00"
	if len(hours) == 1:
		hours = '0' + hours
	if len(minutes) == 1:
		minutes = '0' + minutes
	return str(hours) + ':' + str(minutes)

def convert_from_12_to_24(time: str):
	hour = int(time.split(':')[0])
	minute = time.split(':')[1][0:2]
	type = time.split(':')[1][2:4]
	if type == 'pm':
		hour += 12
	if hour / 10 == 0:
		hour = '0' + str(hour)
	else:
		hour = str(hour)

	if hour == '24':
		hour = '00'
	return hour + ':' + minute

def extract_summary(route, index):
	result = dict()

	# Departure and arrival time
	result['departure_time'] = route[0]['departure_time']
	result['arrival_time'] = route[-1]['arrival_time']
	result['start_location'] = route[0]['start_location']
	result['end_location'] = route[-1]['end_location']
	result['id'] = 'route' + str(index)

	# Total travel time
	# Total wait time
	# Transfers
	travel_time = 0
	wait_time = 0
	tranfers = 0
	current_time = 0
	for step in route:
		travel_time += step['duration']['value']
		tranfers += 1
		if step['type'] == 'EXTERNAL':
			time = 0
			for s in step['steps']:
				if s['travel_mode'] == 'WALKING':
					if time != 0:
						time += s['duration']['value']
				elif s['travel_mode'] == 'TRANSIT':
					tranfers += 1
					if time == 0:
						time = s['transit_details']['arrival_time']['value']
					else:
						wait_time += s['transit_details']['departure_time']['value'] - time
						time = s['transit_details']['arrival_time']['value']
			tranfers -= 1
		if current_time == 0:
			current_time = step['arrival_time']['value']
			continue
		wait_time += step['departure_time']['value'] - current_time
		current_time = step['departure_time']['value']

	result['transfers'] = tranfers
	wt = dict()
	wt['value'] = wait_time
	wt['text'] = convert_seconds_to_hour_minute_format(wait_time)

	tt = dict()
	tt['value'] = travel_time
	tt['text'] = convert_seconds_to_hour_minute_format(travel_time)

	result['travel_time'] = tt
	result['wait_time'] = wt

	return result

def create_datetime_from_date_and_string(date, time):
	return datetime.datetime(date.year, date.month, date.day, int(time.split(":")[0]), int(time.split(":")[1]))

def convert_seconds_to_hour_minute_format(seconds):
	hours = seconds // 3600
	minutes = seconds % 3600 // 60
	hours = int(hours)
	minutes = int(minutes)
	if seconds % 3600 % 60 > 0:
		minutes += 1
	if hours // 10 == 0:
		hours = '0' + str(hours)
	if minutes // 10 == 0:
		minutes = '0' + str(minutes)
	return str(hours) + ':' + str(minutes)

def order_result(result):
	return sorted(result, key = lambda x: x['summary']['departure_time']['text'])