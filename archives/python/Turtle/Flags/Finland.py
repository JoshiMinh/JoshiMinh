from turtle import *

setup(800, 500)
speed(0)
bgcolor("white")
color("navy")

def drawRect(x, y, width, height):
    penup()
    goto(x, y)
    pendown()
    begin_fill()
    for i in range(2):
        forward(width)
        right(90)
        forward(height)
        right(90)
    end_fill()

drawRect(-400, 62.5, 800, 125)
drawRect(-170, 250, 800/7, 500)

hideturtle()
exitonclick()