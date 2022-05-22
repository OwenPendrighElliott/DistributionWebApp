import time
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)


# place holder function for example
@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}