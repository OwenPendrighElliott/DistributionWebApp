import time
from flask import Flask
from flask_cors import CORS
from flask import request
from maffs import get_stats, get_samples
from utils import prep_input_vectors
import numpy as np

app = Flask(__name__)
cors = CORS(app)

def set_round_digits(x_min, x_max):
    n_digit_max = np.floor(np.log10(x_max - x_min)) + 1
    if n_digit_max == 0:
        n_digit_round = 5 # This could be improved
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
    # x_coords = np.linspace(1,100,100)
    # y_coords = np.array([1.4867195147343e-06, 2.45106104294233e-06, 3.99989037241663e-06, 6.4611663926488e-06, 1.03310065813217e-05, 1.63509588958253e-05, 2.56160811951383e-05, 3.97238223814148e-05, 6.09759039529897e-05, 9.26476353230142e-05, 0.000139341123134969, 0.000207440308767921, 0.000305686225478055, 0.000445889724807599, 0.000643795497926865, 0.000920104769622966, 0.00130165384164891, 0.00182273109600128, 0.00252649577810393, 0.00346643791897576, 0.00470779076312334, 0.00632877642858276, 0.00842153448411835, 0.0110925548393749, 0.0144624147976342, 0.0186646099340664, 0.0238432745020429, 0.0301496139168006, 0.0377369231406399, 0.0467541424067055, 0.0573380051248129, 0.0696039583923258, 0.0836361772145172, 0.0994771387927487, 0.117117359532744, 0.13648600918747, 0.157443187618844, 0.179774665124813, 0.203189835501224, 0.227323505631361, 0.251741946984239, 0.275953371470115, 0.2994226832711, 0.32159002340941, 0.341892294166129, 0.359786557812623, 0.37477397940639, 0.386422853089569, 0.394389234004919, 0.398433801691346, 0.398433801691346, 0.394389234004919, 0.386422853089569, 0.37477397940639, 0.359786557812623, 0.341892294166129, 0.32159002340941, 0.2994226832711, 0.275953371470116, 0.251741946984239, 0.227323505631361, 0.203189835501224, 0.179774665124813, 0.157443187618844, 0.13648600918747, 0.117117359532744, 0.0994771387927487, 0.0836361772145173, 0.0696039583923258, 0.0573380051248129, 0.0467541424067055, 0.03773692314064, 0.0301496139168007, 0.0238432745020429, 0.0186646099340664, 0.0144624147976342, 0.0110925548393749, 0.00842153448411835, 0.00632877642858276, 0.00470779076312334, 0.00346643791897576, 0.00252649577810393, 0.00182273109600128, 0.00130165384164891, 0.000920104769622967, 0.000643795497926863, 0.000445889724807599, 0.000305686225478057, 0.00020744030876792, 0.000139341123134969, 9.26476353230145e-05, 6.09759039529897e-05, 3.9723822381415e-05, 2.56160811951381e-05, 1.63509588958253e-05, 1.03310065813217e-05, 6.4611663926488e-06, 3.99989037241663e-06, 2.45106104294232e-06, 1.4867195147343e-06])
    x_min = data['xMin']
    x_max = data['xMax']

    # print("Y coords:")
    # print(y_coords, "\n")
    # print("X coords:")
    # print(x_coords, "\n")

    x_vector, y_vector = prep_input_vectors(x_coords, y_coords, x_min, x_max)

    print("copy_x_vector:\n")
    print([x_vector[i] for i in range(len(x_vector))], "\n")
    print("copy_y_vector:\n")
    print([y_vector[i] for i in range(len(y_vector))], "\n")

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