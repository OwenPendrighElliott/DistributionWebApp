import time
from flask import Flask
from flask_cors import CORS
from flask import request
import random
from maffs import get_stats, get_cdf
import numpy as np

app = Flask(__name__)
cors = CORS(app)

def set_round_digits(x_min, x_max):
    n_digit_max = np.floor(np.log10(x_max - x_min)) + 1
    if n_digit_max == 0:
        n_digit_round = 5 # This needs to be improved
    elif n_digit_max < 5:
        n_digit_round = 5 - n_digit_max
    else:
        n_digit_round = 0
    return int(n_digit_round)

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

    # n1 = round(random.random(),2)
    # n2 = round(random.random(),2)
    # n3 = round(random.random(),2)

    stats = get_stats(y_coords, get_cdf(y_coords), x_coords, x_min, x_max)
    n_digit_round = set_round_digits(x_min, x_max)

    return {'mean': f"{1.123: .{n_digit_round}f}", 'median': f"{stats['median']: .{n_digit_round}f}", 'std': f"{stats['std']: .{n_digit_round}f}"}
    # return {'mean': f"{n1: .2f}", 'median': f"{n2: .2f}", 'std': f"{n3: .2f}"}

