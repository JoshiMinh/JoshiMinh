from turtle import *

speed(0)
setup(800, 800)
bgcolor("White")

def drawSquare(name):
    color(name)
    begin_fill()
    for i in range(4):
        forward(100)
        right(90)
    end_fill()

def coord(x, y):
    penup()
    goto(-400+100*x, 400-100*y)
    pendown()

for x in range(8):
    for y in range(0+(x%2), 8+(x%2), 2):
        coord(x, y)
        drawSquare("Black")

hideturtle()
exitonclick()