from flask import Flask, request, jsonify
import spacy

app = Flask(__name__)

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Intent detection and response logic
def chatbot_response(user_input):
    doc = nlp(user_input.lower())
    if any(token.lemma_ == "hello" for token in doc):
        return "Hello! How can I assist you on your dating journey?"
    elif any(token.lemma_ in ["date", "match"] for token in doc):
        return "Looking for a match? Tell me more about what you're seeking."
    elif any(token.lemma_ == "bye" for token in doc):
        return "Goodbye! Have a great day!"
    else:
        return "That's fascinating! Could you elaborate?"

# API endpoint for the chatbot
@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_input = data.get('message', '')
    response = chatbot_response(user_input)
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True)
