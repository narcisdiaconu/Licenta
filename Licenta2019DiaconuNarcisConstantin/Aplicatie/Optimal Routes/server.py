import json
import algorithm
import utils

def get_routes(request):
	data = request.get_json()
	if data is None:
		return "Missing data", 400
	a = algorithm.Algorithm(data, utils.haversine_distance, 5)
	response = a.Astar()
	res = []
	index = 0
	for route in response:
		new_route = dict()
		new_route['summary'] = utils.extract_summary(route, index)
		new_route['route'] = utils.add_waitings(route)
		res.append(dict(new_route))
		index += 1
	
	res = utils.order_result(res)
	
	return {}.format(res);
