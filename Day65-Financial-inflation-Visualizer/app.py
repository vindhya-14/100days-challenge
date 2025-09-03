from flask import Flask, render_template, jsonify
from flask_cors import CORS
import pandas as pd
from utils.data_utils import read_prices, read_salaries, compute_correlation

app = Flask(__name__)
CORS(app)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/prices')
def api_prices():
    df = read_prices()
    return jsonify(df.to_dict(orient='records'))  # ✅ wrap in jsonify


@app.route('/api/salaries')
def api_salaries():
    df = read_salaries()
    return jsonify(df.to_dict(orient='records'))  # ✅ wrap in jsonify


@app.route('/api/correlation')
def api_correlation():
    corr = compute_correlation()
    return jsonify({"correlation": corr})  # ✅ jsonify dict properly


if __name__ == '__main__':
    app.run(debug=True)
