import time
from flask import Flask
from flask_cors import CORS
from flask import request
import random

app = Flask(__name__)
cors = CORS(app)

# place holder function for example
@app.route('/api/calculate_statistics', methods=['POST'])
def calculate_statistics():
    data = request.get_json()
    y_coords = data['yCoords']
    x_coords = data['xCoords']

    x_min = data['xMin']
    x_max = data['xMax']

    print("Y coords:")
    print(y_coords, "\n")
    print("X coords:")
    print(x_coords, "\n")

    n1 = round(random.random(),2)
    n2 = round(random.random(),2)
    n3 = round(random.random(),2)

    return {'mean': f"{n1: .2f}", 'median': f"{n2: .2f}", 'std': f"{n3: .2f}"}

