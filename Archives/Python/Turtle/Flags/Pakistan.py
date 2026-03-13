from turtle import *

setup(800, 500)
bgcolor("white")
speed(0)

def SilentMove(x, y):
    penup()
    goto(x, y)
    pendown()

SilentMove(-200, 250)
color("darkgreen")
begin_fill()
for i in range(2):
    forward(600)
    right(90)
    forward(500)
    right(90)
end_fill()

SilentMove(50, -135)
color("white")
begin_fill()
circle(150)
end_fill()

SilentMove(90, -80)
color("darkgreen")
begin_fill()
circle(130)
end_fill()

SilentMove(110, 90)
color("white")
begin_fill()
for i in range(5):
    forward(90)
    left(144)
end_fill()

hideturtle()
exitonclick()