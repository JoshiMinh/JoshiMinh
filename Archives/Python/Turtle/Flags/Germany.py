from turtle import *

setup(800, 500)
speed(0)

third = 500/3

def thirdSquare(name):
    pendown()
    color(name)
    begin_fill()
    forward(800)
    right(90)
    forward(third)
    right(90)
    forward(800)
    right(90)
    forward(third)
    right(90)
    end_fill()

penup()
goto(-400, 250)
thirdSquare("black")

penup()
goto(-400, 250-third)
thirdSquare("red")

penup()
goto(-400, 250-2*third)
thirdSquare("yellow")

hideturtle()
exitonclick()