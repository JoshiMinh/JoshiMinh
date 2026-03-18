from turtle import *

setup(800, 500)
speed(0)
pensize(12)
bgcolor("White")

def drawCircle(x, y, radius, colorname):
    penup()
    goto(x, y)
    pendown()
    color(colorname)
    circle(radius)

Radius = 80

drawCircle(-200, 0, Radius, "Blue")
drawCircle(0, 0, Radius, "Black")
drawCircle(200, 0, Radius, "Red")
drawCircle(-100, -100, Radius, "Yellow")
drawCircle(100, -100, Radius, "Green")

hideturtle()
exitonclick()