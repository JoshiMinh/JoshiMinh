from turtle import *

setup(700, 700)
speed(0)
bgcolor("black")

colors = ["red", "darkred"]
for i in range(400):
    forward(i+1)
    right(88)
    color(colors[i%2])

hideturtle()
exitonclick()