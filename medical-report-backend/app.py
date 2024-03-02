from flask import Flask, request, jsonify, session
from flask_cors import CORS
import fitz
import os
from dotenv import load_dotenv
from openai import OpenAI

users_db = {}

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

uploads_dir = os.path.join(os.getcwd(), 'uploads')
if not os.path.exists(uploads_dir):
    os.makedirs(uploads_dir)

app = Flask(__name__)
app.secret_key = os.urandom(24)
CORS(app)

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if username in users_db:
        return jsonify({'error': 'Username already exists'}), 409
    users_db[username] = password
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if username not in users_db or users_db[username] != password:
        return jsonify({'error': 'Invalid username or password'}), 401
    session['username'] = username
    return jsonify({'message': 'Login successful'}), 200

@app.route('/logout', methods=['GET'])
def logout():
    session.pop('username', None)
    return jsonify({'message': 'Logout successful'}), 200

@app.route('/summarize', methods=['POST'])
def summarize_report():
    # if 'username' not in session:
    #     return jsonify({'error': 'Authentication required'}), 401
    file = request.files['file']
    if not file:
        return jsonify({'error': 'No file provided'}), 400

    filepath = os.path.join('uploads', file.filename)
    file.save(filepath)

    text = ''
    with fitz.open(filepath) as doc:
        for page in doc:
            text += page.get_text()

    os.remove(filepath)

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": "Summarise this report in a clear and concise manner. " + text}]
    )

    summary = response.choices[0].message.content
    return jsonify({'summary': summary})

if __name__ == '__main__':
    app.run(debug=False, port=5000)