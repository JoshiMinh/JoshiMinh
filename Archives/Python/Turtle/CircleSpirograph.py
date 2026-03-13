from turtle import *

speed(0)
setup(800, 800)
bgcolor("Black")
pensize(3)

for i in range(6):
    for colors in ["red","magenta","blue", "cyan", "green", "yellow", "white"]:
        color(colors)
        circle(120)
        left(10)

hideturtle()
exitonclick()