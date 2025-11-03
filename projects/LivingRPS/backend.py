from flask import Flask, request, jsonify
import torch
from rps_agent_model import RPSAgentModel

# Initialize Flask app
app = Flask(__name__)

# Load the AI model
model = RPSAgentModel()
model.load_state_dict(torch.load("rps_agent_model.pth", map_location=torch.device('cpu')))
model.eval()

# Define choices
choices = ["rock", "paper", "scissors"]

@app.route("/play", methods=["POST"])
def play():
    data = request.json
    user_choice = data.get("choice")

    if user_choice not in choices:
        return jsonify({"error": "Invalid choice. Choose rock, paper, or scissors."}), 400

    # Convert user choice to tensor
    user_choice_idx = choices.index(user_choice)
    user_input = torch.tensor([user_choice_idx], dtype=torch.long)

    # Get AI's choice
    with torch.no_grad():
        ai_choice_idx = model(user_input).argmax().item()
    ai_choice = choices[ai_choice_idx]

    # Determine the result
    if user_choice == ai_choice:
        result = "draw"
    elif (user_choice == "rock" and ai_choice == "scissors") or \
         (user_choice == "paper" and ai_choice == "rock") or \
         (user_choice == "scissors" and ai_choice == "paper"):
        result = "win"
    else:
        result = "lose"

    return jsonify({"user_choice": user_choice, "ai_choice": ai_choice, "result": result})

if __name__ == "__main__":
    app.run(debug=True)