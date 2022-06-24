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
    # x_coords = np.array([2.0, 2.0062111801242235, 2.012422360248447, 2.018633540372671, 2.0248447204968945, 2.031055900621118, 2.0372670807453415, 2.0434782608695654, 2.049689440993789, 2.0559006211180124, 2.062111801242236, 2.0683229813664594, 2.0745341614906834, 2.080745341614907, 2.0869565217391304, 2.093167701863354, 2.099378881987578, 2.1055900621118013, 2.111801242236025, 2.1180124223602483, 2.124223602484472, 2.130434782608696, 2.1366459627329193, 2.142857142857143, 2.1490683229813663, 2.1552795031055902, 2.1614906832298137, 2.1677018633540373, 2.1739130434782608, 2.1801242236024843, 2.186335403726708, 2.1925465838509317, 2.198757763975155, 2.2049689440993787, 2.2111801242236027, 2.217391304347826, 2.2236024844720497, 2.229813664596273, 2.2360248447204967, 2.2422360248447206, 2.248447204968944, 2.2546583850931676, 2.260869565217391, 2.267080745341615, 2.2732919254658386, 2.279503105590062, 2.2857142857142856, 2.291925465838509, 2.298136645962733, 2.3043478260869565, 2.31055900621118, 2.3167701863354035, 2.3229813664596275, 2.329192546583851, 2.3354037267080745, 2.341614906832298, 2.3478260869565215, 2.3540372670807455, 2.360248447204969, 2.3664596273291925, 2.372670807453416, 2.37888198757764, 2.3850931677018634, 2.391304347826087, 2.3975155279503104, 2.403726708074534, 2.409937888198758, 2.4161490683229814, 2.422360248447205, 2.4285714285714284, 2.4347826086956523, 2.440993788819876, 2.4472049689440993, 2.453416149068323, 2.4596273291925463, 2.4658385093167703, 2.472049689440994, 2.4782608695652173, 2.4844720496894412, 2.4906832298136647, 2.4968944099378882, 2.5031055900621118, 2.5093167701863353, 2.5155279503105588, 2.5217391304347827, 2.527950310559006, 2.5341614906832297, 2.5403726708074537, 2.546583850931677, 2.5527950310559007, 2.559006211180124, 2.5652173913043477, 2.571428571428571, 2.577639751552795, 2.5838509316770186, 2.590062111801242, 2.596273291925466, 2.6024844720496896, 2.608695652173913, 2.6149068322981366, 2.62111801242236, 2.6273291925465836, 2.6335403726708075, 2.639751552795031, 2.6459627329192545, 2.6521739130434785, 2.658385093167702, 2.6645962732919255, 2.670807453416149, 2.6770186335403725, 2.683229813664596, 2.68944099378882, 2.6956521739130435, 2.701863354037267, 2.708074534161491, 2.7142857142857144, 2.720496894409938, 2.7267080745341614, 2.732919254658385, 2.7391304347826084, 2.7453416149068324, 2.751552795031056, 2.7577639751552794, 2.7639751552795033, 2.770186335403727, 2.7763975155279503, 2.782608695652174, 2.7888198757763973, 2.795031055900621, 2.801242236024845, 2.8074534161490683, 2.813664596273292, 2.8198757763975157, 2.8260869565217392, 2.8322981366459627, 2.8385093167701863, 2.8447204968944098, 2.8509316770186337, 2.857142857142857, 2.8633540372670807, 2.869565217391304, 2.875776397515528, 2.8819875776397517, 2.888198757763975, 2.8944099378881987, 2.900621118012422, 2.906832298136646, 2.9130434782608696, 2.919254658385093, 2.9254658385093166, 2.9316770186335406, 2.937888198757764, 2.9440993788819876, 2.950310559006211, 2.9565217391304346, 2.9627329192546585, 2.968944099378882, 2.9751552795031055, 2.981366459627329, 2.987577639751553, 2.9937888198757765, 3.0])
    # y_coords = np.array([4.019169329073482, 3.910543130990415, 3.8019169329073477, 3.6932907348242807, 3.5846645367412133, 3.4760383386581464, 3.3674121405750794, 3.2859424920127793, 3.204472843450479, 3.1230031948881782, 3.041533546325878, 2.960063897763578, 2.8785942492012775, 2.797124600638977, 2.715654952076677, 2.60702875399361, 2.5255591054313093, 2.4440894568690092, 2.362619808306709, 2.2811501597444086, 2.2159744408945685, 2.150798722044728, 2.085623003194888, 2.020447284345048, 1.9552715654952075, 1.8776814240073025, 1.8000912825193973, 1.7225011410314923, 1.6449109995435873, 1.567320858055682, 1.4897307165677771, 1.4121405750798721, 1.3578274760383384, 1.303514376996805, 1.2220447284345046, 1.1405750798722043, 1.059105431309904, 0.9776357827476038, 0.941427050053248, 0.9052183173588924, 0.8690095846645366, 0.8690095846645366, 0.7965921192758252, 0.7241746538871139, 0.6517571884984025, 0.6246006389776357, 0.5974440894568689, 0.5702875399361022, 0.5431309904153354, 0.5069222577209798, 0.470713525026624, 0.4345047923322683, 0.4345047923322683, 0.4073482428115015, 0.38019169329073477, 0.35303514376996803, 0.32587859424920124, 0.29872204472843444, 0.2715654952076677, 0.2444089456869009, 0.21725239616613415, 0.19009584664536738, 0.16293929712460062, 0.13578274760383385, 0.10862619808306707, 0.10862619808306707, 0.10862619808306707, 0.10862619808306707, 0.10862619808306707, 0.10862619808306707, 0.08690095846645365, 0.06517571884984025, 0.04345047923322683, 0.02172523961661342, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.018104366347177846, 0.03620873269435569, 0.05431309904153354, 0.07241746538871138, 0.09052183173588924, 0.10862619808306707, 0.1303514376996805, 0.1520766773162939, 0.1738019169329073, 0.19552715654952074, 0.21725239616613415, 0.21725239616613415, 0.2444089456869009, 0.2715654952076677, 0.29872204472843444, 0.32587859424920124, 0.32587859424920124, 0.32587859424920124, 0.32587859424920124, 0.35303514376996803, 0.38019169329073477, 0.4073482428115015, 0.4345047923322683, 0.470713525026624, 0.5069222577209798, 0.5431309904153354, 0.5431309904153354, 0.5431309904153354, 0.5431309904153354, 0.5793397231096911, 0.6155484558040468, 0.6517571884984025, 0.6879659211927581, 0.7241746538871139, 0.7603833865814695, 0.7965921192758252, 0.8328008519701809, 0.8690095846645366, 0.9233226837060702, 0.9776357827476038, 1.0319488817891374, 1.0862619808306708, 1.1405750798722043, 1.1948881789137378, 1.303514376996805, 1.3578274760383384, 1.4121405750798721, 1.4121405750798721, 1.520766773162939, 1.6293929712460062, 1.7380191693290732, 1.8466453674121404, 1.9552715654952075])
    
    x_min = data['xMin']
    x_max = data['xMax']

    # print("Y coords:")
    # print(y_coords, "\n")
    # print("X coords:")
    # print(x_coords, "\n")

    x_vector, y_vector = prep_input_vectors(x_coords, y_coords, x_min, x_max)

    # print("copy_x_vector:\n")
    # print([x_vector[i] for i in range(len(x_vector))], "\n")
    # print("copy_y_vector:\n")
    # print([y_vector[i] for i in range(len(y_vector))], "\n")

    stats = get_stats(x_vector, y_vector)
    n_digit_round = set_round_digits(x_min, x_max)

    return {'mean': f"{stats['mean']: .{n_digit_round}f}", 'median': f"{stats['median']: .{n_digit_round}f}", 'std': f"{stats['std']: .{n_digit_round}f}"}

@app.route('/api/sample_distribution', methods=['POST'])
def sample_distribution():
    data = request.get_json()
    # y_coords = data['yCoords']
    # x_coords = data['xCoords']
    x_coords = np.linspace(1,100,100)
    y_coords = np.array([1.4867195147343e-06, 2.45106104294233e-06, 3.99989037241663e-06, 6.4611663926488e-06, 1.03310065813217e-05, 1.63509588958253e-05, 2.56160811951383e-05, 3.97238223814148e-05, 6.09759039529897e-05, 9.26476353230142e-05, 0.000139341123134969, 0.000207440308767921, 0.000305686225478055, 0.000445889724807599, 0.000643795497926865, 0.000920104769622966, 0.00130165384164891, 0.00182273109600128, 0.00252649577810393, 0.00346643791897576, 0.00470779076312334, 0.00632877642858276, 0.00842153448411835, 0.0110925548393749, 0.0144624147976342, 0.0186646099340664, 0.0238432745020429, 0.0301496139168006, 0.0377369231406399, 0.0467541424067055, 0.0573380051248129, 0.0696039583923258, 0.0836361772145172, 0.0994771387927487, 0.117117359532744, 0.13648600918747, 0.157443187618844, 0.179774665124813, 0.203189835501224, 0.227323505631361, 0.251741946984239, 0.275953371470115, 0.2994226832711, 0.32159002340941, 0.341892294166129, 0.359786557812623, 0.37477397940639, 0.386422853089569, 0.394389234004919, 0.398433801691346, 0.398433801691346, 0.394389234004919, 0.386422853089569, 0.37477397940639, 0.359786557812623, 0.341892294166129, 0.32159002340941, 0.2994226832711, 0.275953371470116, 0.251741946984239, 0.227323505631361, 0.203189835501224, 0.179774665124813, 0.157443187618844, 0.13648600918747, 0.117117359532744, 0.0994771387927487, 0.0836361772145173, 0.0696039583923258, 0.0573380051248129, 0.0467541424067055, 0.03773692314064, 0.0301496139168007, 0.0238432745020429, 0.0186646099340664, 0.0144624147976342, 0.0110925548393749, 0.00842153448411835, 0.00632877642858276, 0.00470779076312334, 0.00346643791897576, 0.00252649577810393, 0.00182273109600128, 0.00130165384164891, 0.000920104769622967, 0.000643795497926863, 0.000445889724807599, 0.000305686225478057, 0.00020744030876792, 0.000139341123134969, 9.26476353230145e-05, 6.09759039529897e-05, 3.9723822381415e-05, 2.56160811951381e-05, 1.63509588958253e-05, 1.03310065813217e-05, 6.4611663926488e-06, 3.99989037241663e-06, 2.45106104294232e-06, 1.4867195147343e-06])
    x_min = data['xMin']
    x_max = data['xMax']
    n_samples = data['nSamples']

    return {"samples": list(get_samples(x_coords, y_coords, x_min, x_max, n_samples))}