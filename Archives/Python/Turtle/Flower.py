from turtle import *

setup(700, 700)
speed(0)
bgcolor("black")

colors = ["red", "green", "blue", "yellow", "purple", "orange", "white", "pink"]

for i in range(16):
    color(colors[i%8-1])
    for j in range(20):
        right(90)
        circle(150 - j *6, 90)
        left(90)
        circle(150 - j *6, 90)
        right(180)
    circle(40, 24)

hideturtle()
exitonclick()