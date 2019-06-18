import json
import utils
import datetime


class State:
	def __init__(self, current_route: list, current_location: dict, current_time: datetime.datetime, available_route, weight = 0):
		self.current_route = current_route
		self.current_time = current_time
		self.available_route = available_route
		self.current_location = current_location
		self.weight = weight

		self.compute_weight()

	def compute_weight(self):
		# Add wait time
		time = self.available_route['arrival_time']['text']
		arrival = utils.create_datetime_from_date_and_string(self.current_time, time)

		time = arrival - self.current_time
		self.weight += time.total_seconds() * 2

		# Add duration
		self.weight += self.available_route['duration']['value']

		# Add wait time until first step
		if len(self.current_route) == 0:
			time = datetime.datetime.fromtimestamp(self.available_route['departure_time']['value'])
			self.weight += (time - self.current_time).total_seconds()

	def end_date_time(self):
		return datetime.datetime.fromtimestamp(self.available_route['arrival_time']['value'])

	def extract_route(self):
		route = list(self.current_route)
		route.append(self.available_route)
		return route

	def check_for_bad_data(self):
		time = datetime.datetime.fromtimestamp(self.available_route['departure_time']['value'])
		if (time - self.current_time).total_seconds() > (3600 * 12):
			return True
		
		for i in range(len(self.current_route) - 1):
			first = datetime.datetime.fromtimestamp(self.current_route[i]['arrival_time'])
			next = datetime.datetime.fromtimestamp(self.current_route[i + 1]['departure_time'])
			if (next - first).total_seconds() > (3600 * 12):
				return True
		return False

class Algorithm:
	def __init__(self, data: dict, distance_function):
		self.data = data
		self.converted_data = utils.convert_given_data(data)
		self.start_location = data['startLocation']
		self.end_location = data['endLocation']
		time = data['departureTime']
		self.departure_time = datetime.datetime.fromtimestamp(time)
		self.distance_function = distance_function

	def run(self):
		result = []
		current_location = self.start_location
		current_route = []
		current_time = self.departure_time
		open_set = []
		available_dests = self.available_routes(self.start_location, self.departure_time, self.end_location)
		for dest in available_dests:
			open_set.append(State(list(current_route), dict(current_location), current_time, dict(dest)))
		# routes = utils.retrieve_directions(current_location, self.end_location, current_time)
		# for route in routes:
		# 	open_set.append(State(current_route, current_location, current_time, route))
		while open_set:
			# Choose best route from open_set.
			current = self.get_best_state(open_set)

			# Remove selected from open_set.
			open_set.remove(current)

			# Check for bad data			
			if current.check_for_bad_data():
				return result

			# Check if current route is a final one and save it.
			if self.is_final(current):
				result.append(current.extract_route())
				if len(result) == 5:
					return result
				continue

			# Add accesible states for current state in open_set.
			current_time = utils.create_datetime_from_date_and_string(current_time, current.available_route['arrival_time']['text'])
			current_route = list(current.current_route)
			current_route.append(current.available_route)
			current_location = dict(current.available_route['end_location'])
			for route in self.available_routes(dict(current_location), current.end_date_time(), self.end_location):
				open_set.append(State(list(current_route), dict(current_location), current_time, route, current.weight))

			# routes = utils.retrieve_directions(current_location, self.end_location, current_time)
			# for route in routes:
			# 	open_set.append(State(list(current_route), dict(current_location), current_time, route, current.weight))
		return result

	def get_best_state(self, states: list) -> State:
		return sorted(states, key = lambda x : x.weight)[0]
		
	def is_final(self, state: State):
		if state.available_route.get('type', 0) == 'INTERNAL':
			if state.available_route['end_location']['id'] == self.end_location['id']:
				return True
			return False
		
		dist = self.distance_function(self.end_location, state.available_route['end_location'])
		return dist < 10

	def write_result(self):
		file = open('result.json', 'w')
		file.write(json.dumps(self.converted_data))
		file.close()

	def available_routes(self, start_location: dict, current_time: datetime, end_location: dict):
		result = []
		for bus in self.converted_data:
			bus = utils.extract_subroute(bus, start_location, end_location)
			if bus['start_location']['id'] != start_location['id']:
				continue
			if (bus['days'][current_time.weekday()] != '1'):
				continue

			bus_departure = datetime.datetime(current_time.year, current_time.month, current_time.day, int(
				bus['departure_time']['text'].split(':')[0]), int(bus['departure_time']['text'].split(':')[1]))

			if (bus_departure < current_time):
				continue

			departure = utils.create_datetime_from_date_and_string(current_time, bus['departure_time']['text'])			
			bus['departure_time']['value'] = round(departure.timestamp())
			arrival = utils.create_datetime_from_date_and_string(current_time, bus['arrival_time']['text'])
			bus['arrival_time']['value'] = round(arrival.timestamp())
			duration = dict()
			time = arrival - departure
			duration['value'] = time.total_seconds()
			duration['text'] = utils.convert_seconds_to_hour_minute_format(time.total_seconds())
			bus['duration'] = duration
			result.append(bus)
		return result
