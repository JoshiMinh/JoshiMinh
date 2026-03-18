from turtle import *

setup(800, 500)
speed(0)
bgcolor("white")

def SilentMove(x, y):
    penup()
    goto(x, y)
    pendown()

def drawSquare(x, y, width, height, colorname):
    SilentMove(x, y)
    color(colorname)
    begin_fill()
    for i in range(2):
        forward(width)
        right(90)
        forward(height)
        right(90)
    end_fill()

def star():
    color("white")
    begin_fill()
    for i in range(5):
        forward(25)
        right(144)
    end_fill()

for i in range(0, 13, 2):
    drawSquare(-400, 250-(500/13)*i, 800, 500/13, "firebrick")
drawSquare(-400, 250, 350, (500/13)*7, "navy")

for i in range(5):
    for j in range(6):
        SilentMove(-380+(55*j), 230-(55*i))
        star()

for i in range(4):
    for j in range(5):
        SilentMove(-350+(55*j), 200-(55*i))
        star()

hideturtle()
exitonclick()