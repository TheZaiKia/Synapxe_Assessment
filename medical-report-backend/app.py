from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
)

uploads_dir = os.path.join(os.getcwd(), 'uploads')
if not os.path.exists(uploads_dir):
    os.makedirs(uploads_dir)

app = Flask(__name__)
CORS(app)

@app.route('/summarize', methods=['POST'])
def summarize_report():
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
        messages=[
            {"role": "user", "content": "Summarise this report in a clear and concise manner. " + text}
        ]
    )

    summary = response.choices[0].message.content

    return jsonify({'summary': summary})

if __name__ == '__main__':
    app.run(debug=False, port=5000)