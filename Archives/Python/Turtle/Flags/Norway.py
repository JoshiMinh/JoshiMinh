from turtle import *

setup(800, 500)
speed(0)
bgcolor("Red")

def drawRect(x, y, width, height, colorname):
    penup()
    goto(x, y)
    pendown()
    color(colorname)
    begin_fill()
    for i in range(2):
        forward(width)
        right(90)
        forward(height)
        right(90)
    end_fill()

drawRect(-400, 50, 800, 100, "White")
drawRect(-200, 250, 100, 500, "White")

drawRect(-400, 25, 800, 50, "Navy")
drawRect(-175, 250, 50, 500, "Navy")

hideturtle()
exitonclick()