from flask import Flask
from flask_cors import CORS
from flask import request
from empirical import get_stats, get_samples
from utils import prep_input_vectors
import numpy as np

app = Flask(__name__)
cors = CORS(app)

def set_round_digits(x_min, x_max):
    n_digit_max = np.floor(np.log10(x_max - x_min)) + 1
    if n_digit_max == 0:
        n_digit_round = 5
    elif n_digit_max < 5:
        n_digit_round = 5 - n_digit_max
    else:
        n_digit_round = 0
    return int(n_digit_round)


@app.route('/api/calculate_statistics', methods=['POST'])
def calculate_statistics():
    data = request.get_json()
    y_coords = data['yCoords']
    x_coords = data['xCoords']
    x_min = data['xMin']
    x_max = data['xMax']

    x_vector, y_vector = prep_input_vectors(x_coords, y_coords, x_min, x_max)

    stats = get_stats(x_vector, y_vector)
    n_digit_round = set_round_digits(x_min, x_max)

    return {'mean': f"{stats['mean']: .{n_digit_round}f}", 'median': f"{stats['median']: .{n_digit_round}f}", 'std': f"{stats['std']: .{n_digit_round}f}"}

@app.route('/api/sample_distribution', methods=['POST'])
def sample_distribution():
    data = request.get_json()
    y_coords = data['yCoords']
    x_coords = data['xCoords']
    x_min = data['xMin']
    x_max = data['xMax']
    n_samples = data['nSamples']

    return {"samples": list(get_samples(x_coords, y_coords, x_min, x_max, n_samples))}