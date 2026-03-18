from turtle import *

setup(800, 500)
speed(0)
bgcolor("white")

third = 800/3

def thirdVertSquare(name):
    pendown()
    color(name)
    begin_fill()
    forward(third)
    right(90)
    forward(500)
    right(90)
    forward(third)
    right(90)
    forward(500)
    right(90)
    end_fill()

penup()
goto(-400, 250)
thirdVertSquare("blue")

penup()
goto(-400+2*third, 250)
thirdVertSquare("red")

hideturtle()
exitonclick()