import time
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)


# place holder function for example
@app.route('/api/calculate_statistics')
def get_current_time():
    return {'mean': 1.0, 'std': 2.0, 'median': 3.0}