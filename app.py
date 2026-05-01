from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():

    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'})

    image = request.files['image']

    if image.filename == '':
        return jsonify({'error': 'No selected image'})

    prediction = "This appears to be recyclable waste."

    return jsonify({
        'prediction': prediction
    })

if __name__ == '__main__':
    app.run(debug=True)