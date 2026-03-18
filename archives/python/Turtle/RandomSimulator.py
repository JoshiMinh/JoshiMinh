import turtle
import random
import time

WINDOW_SIZE = 600
HALF_WINDOW = WINDOW_SIZE // 2
TURTLE_COUNT = 100
STEP_SIZE = 60
STEP_DELAY = 0.2
MAX_PEN_SIZE = 4
FPS = 60

DIRECTIONS = {
    "north": (0, STEP_SIZE),
    "south": (0, -STEP_SIZE),
    "east": (STEP_SIZE, 0),
    "west": (-STEP_SIZE, 0),
}

DEFAULT_SPAWN_COORD = (-HALF_WINDOW, -HALF_WINDOW)

def generate_color(index, total):
    color_int = int((index / total) * 0xFFFFFF)
    return f"#{color_int:06x}"

def is_in_bounds(x, y):
    return -HALF_WINDOW <= x <= HALF_WINDOW and -HALF_WINDOW <= y <= HALF_WINDOW

def reset_turtle(t):
    if t.screen._root is not None:
        t.goto(DEFAULT_SPAWN_COORD)
        t.showturtle()

screen = turtle.Screen()
screen.setup(WINDOW_SIZE, WINDOW_SIZE)
screen.title("Random Simulator - Turtle")
screen.bgcolor("black")
screen.tracer(0)

all_turtles = []
for i in range(TURTLE_COUNT):
    color = generate_color(i, TURTLE_COUNT)
    t = turtle.Turtle()
    t.shape("triangle")
    t.penup()
    t.speed(0)
    t.goto(DEFAULT_SPAWN_COORD)
    t.color(color)
    t.pensize(1)
    t.pendown()
    all_turtles.append(t)

simulation_running = True
winner = None
fps_animation = False
reset_turtles = False

def restart_simulation(x, y):
    global simulation_running, winner, all_turtles
    simulation_running = True
    winner = None
    all_turtles.clear()
    for i in range(TURTLE_COUNT):
        color = generate_color(i, TURTLE_COUNT)
        t = turtle.Turtle()
        t.shape("triangle")
        t.penup()
        t.speed(0)
        t.goto(DEFAULT_SPAWN_COORD)
        t.color(color)
        t.pensize(1)
        t.pendown()
        all_turtles.append(t)
    screen.bgcolor("black")
    screen.update()

screen.listen()
screen.onkey(restart_simulation, "r")

while simulation_running:
    targets = []
    for t in all_turtles:
        direction = random.choice(list(DIRECTIONS.values()))
        target_x = t.xcor() + direction[0]
        target_y = t.ycor() + direction[1]
        targets.append((t, target_x, target_y))

    if fps_animation:
        for _ in range(FPS):
            for t, target_x, target_y in targets:
                dx = (target_x - t.xcor()) / FPS
                dy = (target_y - t.ycor()) / FPS
                t.setheading(t.towards(target_x, target_y))
                t.goto(t.xcor() + dx, t.ycor() + dy)
            screen.update()
            time.sleep(STEP_DELAY / FPS)
    else:
        for t, target_x, target_y in targets:
            t.setheading(t.towards(target_x, target_y))
            t.goto(target_x, target_y)
        screen.update()
        time.sleep(STEP_DELAY)

    for t, target_x, target_y in targets[:]:
        if not is_in_bounds(t.xcor(), t.ycor()):
            if reset_turtles:
                reset_turtle(t)
            else:
                t.hideturtle()
                all_turtles.remove(t)
            continue

        if t.xcor() >= HALF_WINDOW and t.ycor() >= HALF_WINDOW:
            simulation_running = False
            winner = t
            break

        current_size = t.pensize()
        t.pensize(min(current_size + 0.5, MAX_PEN_SIZE))

    if not all_turtles:
        simulation_running = False
        break

if winner:
    winner.color("gold")
    winner.write("Winner!", align="center", font=("Arial", 16, "bold"))
else:
    screen.bgcolor("black")
    turtle.color("red")
    turtle.hideturtle()
    turtle.penup()
    turtle.write("No Winners", align="center", font=("Arial", 24, "bold"))

screen.mainloop()