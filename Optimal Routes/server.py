from flask import Flask, request, Response
import json
import argparse
import algorithm
import utils
import os

app = Flask(__name__)
app.debug = True

@app.route("/", methods=['POST', 'OPTIONS'])
def get_routes():
	data = request.get_json()
	if data is None:
		return "Missing data", 400
	a = algorithm.Algorithm(data, utils.haversine_distance)
	response = a.run()
	res = []
	index = 0
	for route in response:
		new_route = dict()
		new_route['summary'] = utils.extract_summary(route, index)
		new_route['route'] = route
		res.append(new_route)
		index += 1
	
	res = utils.order_result(res)
	return Response(json.dumps(res), status=200, mimetype="application/json")

if __name__ == '__main__':

	parser = argparse.ArgumentParser()
	parser.add_argument(
		'--port',
		type=int,
		default=5000,
		help='PORT'
	)
	parser.add_argument(
		'--host',
		type=str,
		default='localhost',
		help='HOST'
	)
	args = parser.parse_args()
	app.run(host=args.host, port=args.port, threaded=True)
