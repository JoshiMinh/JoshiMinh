import os
import time

BLUE = '\033[38;2;0;50;200m'
RED = '\033[38;2;200;0;50m'
RESET = '\033[0m'

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def checkwin():
    global winner
    win_conditions = [(0, 1, 2), (3, 4, 5), (6, 7, 8), (0, 3, 6), (1, 4, 7), (2, 5, 8), (0, 4, 8), (2, 4, 6)]
    for a, b, c in win_conditions:
        if board[a] == board[b] == board[c]:
            winner = board[a]
            return True
    return False

def is_draw():
    return all(cell in 'XO' for cell in board) and not checkwin()

def minimax(board, depth, is_maximizing):
    if checkwin():
        return (10 - depth) if winner == AI else (depth - 10)
    if is_draw():
        return 0
    if is_maximizing:
        max_eval = float('-inf')
        for i in range(9):
            if board[i] not in 'XO':
                board[i] = AI
                max_eval = max(max_eval, minimax(board, depth + 1, False))
                board[i] = str(i + 1)
        return max_eval
    else:
        min_eval = float('inf')
        for i in range(9):
            if board[i] not in 'XO':
                board[i] = player
                min_eval = min(min_eval, minimax(board, depth + 1, True))
                board[i] = str(i + 1)
        return min_eval

def AI_choice():
    time.sleep(1)
    best_score = float('-inf')
    best_move = -1
    for i in range(9):
        if board[i] not in 'XO':
            board[i] = AI
            move_score = minimax(board, 0, False)
            board[i] = str(i + 1)
            if move_score > best_score:
                best_score = move_score
                best_move = i
    board[best_move] = AI

def display():
    def colored_cell(cell):
        if cell == player:
            return f"{BLUE}{cell}{RESET}"
        elif cell == AI:
            return f"{RED}{cell}{RESET}"
        return cell
    print(f"\n {colored_cell(board[0])} | {colored_cell(board[1])} | {colored_cell(board[2])} ")
    print("---|---|---")
    print(f" {colored_cell(board[3])} | {colored_cell(board[4])} | {colored_cell(board[5])} ")
    print("---|---|---")
    print(f" {colored_cell(board[6])} | {colored_cell(board[7])} | {colored_cell(board[8])} \n")

def player_choice():
    try:
        pos = int(input("Enter Position (1-9): ")) - 1
        if 0 <= pos <= 8 and board[pos] not in 'XO':
            board[pos] = player
        else:
            print("Invalid move, try again.")
            player_choice()
    except ValueError:
        print("Invalid input, enter a number between 1 and 9.")
        player_choice()

def play_game():
    global board, player, AI, winner
    board = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
    player = input("X or O? ").upper()
    AI = "O" if player == "X" else "X"
    winner = None
    for i in range(9):
        clear_screen()
        display()
        if i % 2 == 0:
            player_choice()
        else:
            AI_choice()
        if checkwin():
            break
    clear_screen()
    display()
    if winner:
        print(f"{winner} Wins!")
    else:
        print("It's a Draw!")

while True:
    play_game()
    if input("Play again? (Y/N): ").strip().upper() != 'Y':
        break